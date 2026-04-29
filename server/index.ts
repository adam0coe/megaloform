import app from './app';
import db from './db';

const port = 3000;

async function dbLink() {
  await db();
}

dbLink()
.then(() => app.listen(port, () => {console.log(`🔥 Server's up at ${port}!`)}))
.catch(console.error)
