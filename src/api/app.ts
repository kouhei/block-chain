import * as bodyParser from 'body-parser';
import * as express from 'express';
import { router as chain } from './chain';
import { router as mine } from './mine';
import { router as nodes } from './nodes';
import { router as transactions } from './transactions';

const port = Number.parseInt(process.argv[2]) || 3000;
const app = express();

// post で body を json で受け取れるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/chain', chain);
app.use('/mine', mine);
app.use('/nodes', nodes);
app.use('/transactions', transactions);

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
