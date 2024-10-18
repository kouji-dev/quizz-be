import express from 'express';
import {db} from './db.ts'
import { sql } from 'drizzle-orm';
const app = express();

app.get('/', async (req, res) => {
  const name = process.env.NAME || 'World';
  const result = await db.execute(sql`SELECT NOW()`);
  res.send(result);
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
