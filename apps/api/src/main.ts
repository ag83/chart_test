import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import stockRoutes from './app/routes/stock.route';


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/stock", stockRoutes);

const port = process.env.port || 3000;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
