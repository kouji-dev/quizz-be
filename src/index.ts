import express from 'express';
import {db} from './db/db.ts';
import examRoutes from './routes/admin/examRoutes.js';
import categoriesRoutes from './routes/admin/categoriesRoutes.js';
import { sql } from 'drizzle-orm';


const app = express();
app.use(express.json());

app.get('/', async (req, res) => {
  const name = process.env.NAME || 'World';
  const result = await db.execute(sql`SELECT NOW()`);
  res.send(result);
});

app.use('/exams', examRoutes);
app.use('/categories', categoriesRoutes);




const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
