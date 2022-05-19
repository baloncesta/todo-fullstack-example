import express from 'express';
import jsonGraphqlExpress from 'json-graphql-server';
import cors from 'cors';
import datum from './data.js'
const PORT = 3001;
const app = express();
const data = datum
app.use(cors());
app.use('/graphql', jsonGraphqlExpress.default(data));
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
});