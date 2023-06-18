import express, { response } from 'express'
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
var FOREVERTHREADTREE = {
  threads: []
}
const uri = "data/lancedb";
let sampleJSONTree = {
  threads: [
    {
      title: "make fake title",
      username: "make fake username",
      text: "an eager personality posting learning content",
      comments: [{
        username: "",
        text: "",
      }]
    },
    {
      title: "make fake title",
      username: "make fake username",
      text: "an funny personality posting learning content",
      comments: [{
        username: "",
        text: "",
      }]
    },
    {
      title: "make fake title",
      username: "make fake username",
      text: "an sad personality posting learning content",
      comments: [{
        username: "",
        text: "",
      }]
    },

  ]
}

app.use(express.static('NewFrontend/build'))
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
        //detect if table filename exist
        try {
          const tbl = await db.openTable(filename);
          //table exist 
          console.log("table " + filename + " exist");
        } catch (error) {
          console.log(error)
          const data = contextualize(sentences, 20, 'paragraphId');

          for (let [i, chunk] of data.entries()) {
            console.log(`Embedding ${i + 1} out of ${data.length} chunks...`)
            const res = await openai.createEmbedding({
              model: 'text-embedding-ada-002',
              input: chunk.text,
            })
            chunk.vector = res.data.data[0].embedding
            if (i >= 2) {
              break;

            }          // console.log(chunk)
          }
          const table = await db.createTable(filename, data.slice(0, 3))
        }




        //console.log(data)

        // console.log(filename)
        //const table = await db.createTable(filename, data.slice(0,3))
        // table.add(data)
      })

      res.send({ table: filename })
    });

  })
})

app.post("/newThread", async function (req, res) {


  const title = req.headers.title;
  const username = req.headers.username;
  const text = req.headers.text;
  let newThread = {
    title, username, text, comments: []
  }
  console.log("forever threads tree", FOREVERTHREADTREE);
  FOREVERTHREADTREE.threads.push(newThread);
  console.log("made new thread");
  res.json(FOREVERTHREADTREE)
})
//both user and agent, add to FOREEVERTHREADTREE
function makeComment(thread, username,text){
    let newComment = {
      username,text
    }
    thread.comments.push(newComment);
} 
async function agentRespondToComment(text){
    let prompt = "give a social media response to this  comment(dont give anything else beside the social media response):" + text
    
   let response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo-16k',
      messages: [{ role: 'user', content:prompt }],
    })
    
    return response.data.choices[0].message.content;

}
app.post("/newComment", async function (req, res) {


 
  const username = req.headers.username;
  const text = req.headers.text;
  const thread = FOREVERTHREADTREE.threads[0];
  makeComment(thread, "Devin",text)
  console.log("forever threads tree", FOREVERTHREADTREE);

 let agentComment =  await agentRespondToComment(text)
 makeComment(thread, "Washington", agentComment)
  

  res.json(FOREVERTHREADTREE);
})

app.get('/query/:table', async function (req, res) {
  console.log("query",req.params.table);
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
  let response;
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
  let rawReplies = response.data.choices[0].message.content;
  console.log("raw replies", rawReplies);
  let replyJson = extractJSON(rawReplies);
  console.log(replyJson)
  const replies = JSON.parse(rawReplies);
  console.log(replies)


  let replyData = []

  for (let reply of replies.threads) {
    const embedding = await openai.createEmbedding({
      model: 'text-embedding-ada-002',
      input: `personality/username: ${reply.username}, reply: ${reply.text}`,
    })
    if (embedding.data.data[0].embedding == null) {
      console.error(`embedding null + ${reply.username} + ${reply.text}`)
    }
    replyData.push({ username: reply.username, text: reply.text, vector: embedding.data.data[0].embedding })
    // console.log(replyData.vector)
  }


  console.log(replyData)


  const personalityTable = await db.openTable('personalities')
  personalityTable.add(replyData)

  FOREVERTHREADTREE = JSON.parse(response.data.choices[0].message.content);
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
    JSON.stringify(sampleJSONTree) +
    '    \n  Populate this JSON  (no additional text in your response, only generate JSON) with text that help student with reddit style response and tweet-size responsee with different personalities. base the text section on personalities \n\n'



  // need to make sure our prompt is not larger than max size
  
  prompt = prompt + context.map(c => c.context).join('\n\n---\n\n').substring(0, 3750)
  prompt = prompt + `Similar Personalities:\n\n ${personalities ? personalities.map(p => `user: ${p.username} - ${p.text}`).join('\n\n---\n\n').substring(0, 3750) : ""}\n\n`
  prompt = prompt + `Current Replies:\n\n ${JSON.stringify(currentReplies)} \n\n`
  prompt = prompt + `\n\ ${query}\n`
  prompt = prompt + "hey, remember to populate the JSON!(no non-json texts)"

  
  /*
  if (personalities) {
    prompt = prompt + `Reply with a few more responses from the same users:`
  } else {
    prompt = prompt + `Answer with 2 responses:`
  }*/

  console.log(prompt)

  return prompt
}

function extractJSON(str) {
  var firstOpen, firstClose, candidate;
  firstOpen = str.indexOf('{', firstOpen + 1);
  do {
    firstClose = str.lastIndexOf('}');
    console.log('firstOpen: ' + firstOpen, 'firstClose: ' + firstClose);
    if (firstClose <= firstOpen) {
      return null;
    }
    do {
      candidate = str.substring(firstOpen, firstClose + 1);
      console.log('candidate: ' + candidate);
      try {
        var res = JSON.parse(candidate);
        console.log('...found');
        return [res, firstOpen, firstClose + 1];
      }
      catch (e) {
        console.log('...failed');
      }
      firstClose = str.substr(0, firstClose).lastIndexOf('}');
    } while (firstClose > firstOpen);
    firstOpen = str.indexOf('{', firstOpen + 1);
  } while (firstOpen != -1);
}