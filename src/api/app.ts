import * as bodyParser from 'body-parser';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Nodes, Transactions } from '../core/entities';
import { CryptoRepository } from '../core/infrastructure/cryptoRepository';
import { NodeDriver } from '../core/infrastructure/NodeDriver';
import { BlockUseCase } from '../core/useCases/blockUseCase';
import { ChainUseCase } from '../core/useCases/Chain/ChainUseCase';
import { MinerUseCase } from '../core/useCases/Chain/mineBlockUseCase';
import { NodeUseCase } from '../core/useCases/NodeUseCase';
import { ProofUseCase } from '../core/useCases/ProofUseCase';
import { chain, mine, nodes, transactions } from './controllers';

const NODE_ID = uuidv4();
const PORT = Number.parseInt(process.argv[2]) || 3000;

const nodeList = new Nodes();
const transactionList = new Transactions();
const cryptoRepository = new CryptoRepository();
const proofUseCase = new ProofUseCase(cryptoRepository);
const nodeUseCase = new NodeUseCase(nodeList);
const blockUseCase = new BlockUseCase(transactionList, cryptoRepository);
const chainUseCase = new ChainUseCase(new NodeDriver(), blockUseCase, proofUseCase);
const minerUseCase = new MinerUseCase(chainUseCase, proofUseCase, blockUseCase);

const app = express();

// post で body を json で受け取れるようにする
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/chain', chain(chainUseCase));
app.use('/mine', mine(minerUseCase, NODE_ID));
app.use('/nodes', nodes(nodeUseCase, chainUseCase));
app.use('/transactions', transactions(blockUseCase, chainUseCase));

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
