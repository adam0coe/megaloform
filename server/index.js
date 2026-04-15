const express = require('express')
const app = express()
const port = 3000
const db = require('./db')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

async function dbLink() {
  await db();
}

dbLink()
.then(() => app.listen(port, () => {console.log(`🔥 Server's up at ${port}!`)}))
.catch(console.error)

