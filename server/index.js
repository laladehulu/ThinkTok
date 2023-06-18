import express from 'express'
import vectordb from 'vectordb'
import axios from 'axios'
import extract from 'pdf-text-extract'
import path from 'path'
import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'
import { exit } from 'process'
import https from 'https'
import fs from 'fs'
import url from 'url'

const app = express()

const uri = "data/lancedb";
let sampleJSONTree = {
  threads:[
      {
          title: "heel",
          username :"aaa",
          text :"dddd",
          comments:[{
              
          }]
      },
      {
          
      },
      {
          
      }

  ]
}

app.use(express.static('pain2/build'))
const db = await vectordb.connect(uri)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORGANIZATION,
})
const openai = new OpenAIApi(configuration)

app.listen("8080", (res) => {
  console.log("Listening on port 8080")
})
app.get('/load', (req, res) => {
  console.log(req.query.pdf)
  const link = req.query.pdf;
  var parsed = url.parse(link)
  const filename = path.basename(parsed.pathname).split('.')[0]

  const file = fs.createWriteStream(`${filename}.pdf`)
  const request = https.get(link, async function (response) {
    response.pipe(file)

    // after download completed close filestream
    file.on("finish", () => {
      file.close()
      console.log("Download Completed")

      extract(`${filename}.pdf`, async function (err, pages) {
        if (err) {
          console.dir(err)
          return
        }

        let sentences = []
        for (let [i, page] of pages.entries()) {
          for (let [j, sentence] of page.split('\n').entries()) {
            // console.log(res.data.data[0].embedding)
            sentences.push({ text: sentence, pageId: i, paragraphId: j })
          }
        }
        const data = contextualize(sentences, 20, 'paragraphId');

        for (let [i, chunk] of data.entries()) {
          console.log(`Embedding ${i + 1} out of ${data.length} chunks...`)
          const res = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: chunk.text,
          })
          chunk.vector = res.data.data[0].embedding
          // console.log(chunk)
        }

        console.log(data)

        console.log(filename)
        const table = await db.createTable(filename, data)
        // table.add(data)
      })

      res.send({ table: filename })
    });

  })
})

app.get('/query/:table', async function (req, res) {
  const table = await db.openTable(req.params.table)

  const query = req.headers.query
  const queryEmbedding = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: query,
  })

  const results = await table
    .search(queryEmbedding.data.data[0].embedding)
    .select(['text', 'context'])
    .limit(5)
    .execute()

  const isReply = req.headers.isreply === "true"
  let response
  if (isReply) {
    const personalityTable = await db.openTable("personalities")
    const currentReplies = req.headers.currentreplies
    const personalityEmbedding = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: currentReplies,
    })
    const personalities = await personalityTable
      .search(personalityEmbedding.data.data[0].embedding)
      .select(['text'])
      .limit(5)
      .execute()

    response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [{ role: 'user', content: createPrompt(query, results, personalities, currentReplies) }],
    })
  } else {
    response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [{ role: 'user', content: createPrompt(query, results) }],
    })
  }

  const replies = JSON.parse(response.data.choices[0].message.content)
  console.log(replies)

  let replyData = []
  for (let reply of replies) {
    const embedding = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: `personality/username: ${reply.username}, reply: ${reply.tweet}`,
    })
    if (embedding.data.data[0].embedding == null) {
      console.error(`embedding null + ${reply.username} + ${reply.tweet}`)
    }
    replyData.push({ username: reply.username, text: reply.tweet, vector: embedding.data.data[0].embedding })
    // console.log(replyData.vector)
  }


  console.log(replyData)

  const personalityTable = await db.openTable('personalities')
  personalityTable.add(replyData)

  res.send(response.data.choices[0].message.content)
})

function contextualize(rows, contextSize, groupColumn) {
  const grouped = []
  rows.forEach(row => {
    if (!grouped[row[groupColumn]]) {
      grouped[row[groupColumn]] = []
    }
    grouped[row[groupColumn]].push(row)
  })

  const data = []
  Object.keys(grouped).forEach(key => {
    for (let i = 0; i < grouped[key].length; i++) {
      const start = i - contextSize > 0 ? i - contextSize : 0
      grouped[key][i].context = grouped[key].slice(start, i + 1).map(r => r.text).join(' ')
    }
    data.push(...grouped[key])
  })
  return data
}

function createPrompt(query, context, personalities = "", currentReplies = "") {
  let prompt =
    'Provide 10 reddit-style and twitter-sized responses in json string form in an array with parameters username and tweet (no additional text in your response) each with different personalities helping someone learn the textbook material below.\n\n' +

    'Textbook Context:\n'

  // need to make sure our prompt is not larger than max size
  prompt = prompt + context.map(c => c.context).join('\n\n---\n\n').substring(0, 3750)
  prompt = prompt + `Similar Personalities:\n\n ${personalities ? personalities.map(p => `user: ${p.username} - ${p.text}`).join('\n\n---\n\n').substring(0, 3750) : ""}\n\n`
  prompt = prompt + `Current Replies:\n\n ${JSON.stringify(currentReplies)} \n\n`
  prompt = prompt + `\n\nQuestion: ${query}\n`
  if (personalities) {
    prompt = prompt + `Reply with a few more responses from the same users:`
  } else {
    prompt = prompt + `Answer with 10 responses:`
  }
  console.log(prompt)
  return prompt
}