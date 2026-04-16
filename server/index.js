const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
const router = require('./router');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use(router);

app.get('/', (req, res) => {
  res.send('Let\'s serve some candidates!');
})

async function dbLink() {
  await db();
}

dbLink()
.then(() => app.listen(port, () => {console.log(`🔥 Server's up at ${port}!`)}))
.catch(console.error)

