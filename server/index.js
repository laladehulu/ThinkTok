import express from 'express'
import vectordb from 'vectordb'
import axios from 'axios'
import extract from 'pdf-text-extract'
import path from 'path'
import 'dotenv/config'
import { Configuration, OpenAIApi } from 'openai'
import { exit } from 'process'
import http from 'http'
import fs from 'fs'
import url from 'url'
import path from 'path'

const app = express()

const uri = "data/lancedb";
const db = await vectordb.connect(uri)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization: 'org-t4zSAElGhxVsm9gQ9mdgVhWp',
})
const openai = new OpenAIApi(configuration)


app.get('/load', (req, res) => {
  const link = req.data.link
  var parsed = url.parse(link)
  const filename = path.basename(parsed.pathname)


  const file = fs.createWriteStream(`${filename}.pdf`)
  const request = http.get(link, async function (response) {
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
            const res = await openai.createEmbedding({
              model: 'text-embedding-ada-002',
              input: sentence,
            })
            // console.log(res.data.data[0].embedding)
            sentences.push({ text: sentence, pageId: i, paragraphId: j, vector: res.data.data[0].embedding })
          }
        }
      })

      res.sendStatus(200)
    });

    const data = contextualize(sentences, 20, 'paragraphId');

    const table = await db.createTable(filename)
    table.add(data)
  })
})

app.get('/query/{table}', async function (req, res) {
  const table = await db.openTable(req.params.table)

  const query = 'how do I program in eliza'
  const queryEmbedding = await openai.createEmbedding({
    model: 'text-embedding-ada-002',
    input: query,
  })
  const results = await table
    .search(queryEmbedding.data.data[0].embedding)
    .select(['text', 'context'])
    .limit(5)
    .execute()

  createPrompt(query, results);
  const response = await openai.createChatCompletion({
    model: 'gpt-4-0613',
    messages: [{ role: 'user', content: createPrompt(query, results) }],
  })
  const replies = JSON.parse(response.data.choices[0].message.content)

  let replyData = []
  replies.map(async (reply) => {
    const embedding = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: `personality/username: ${reply.username}, reply: ${reply.tweet}`,
    })
    replyData.push({ username: reply.username, text: reply.tweet, vector: embedding.data.data[0].embedding })
  })

  const personalityTable = await db.createTable('personalities')
  table.add(replyData)


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

function createPrompt(query, context) {
  let prompt =
    'Provide 10 reddit-style and twitter-sized responses in json string form in an array with parameters username and tweet (no additional text in your response) each with different personalities helping someone learn the textbook material below.\n\n' +

    'Context:\n'

  // need to make sure our prompt is not larger than max size
  prompt = prompt + context.map(c => c.context).join('\n\n---\n\n').substring(0, 3750)
  prompt = prompt + `\n\nQuestion: ${query}\nAnswer:`
  return prompt
}