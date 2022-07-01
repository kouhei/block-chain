import * as bodyParser from 'body-parser';
import * as express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Nodes, Transactions } from '../Core/Entities';
import { BlockUseCase } from '../Core/UseCases/BlockUseCase';
import { ChainUseCase } from '../Core/UseCases/ChainUseCase';
import { MinerUseCase } from '../Core/UseCases/MinerUseCase';
import { NodeUseCase } from '../Core/UseCases/NodeUseCase';
import { ProofUseCase } from '../Core/UseCases/ProofUseCase';
import { CryptoRepository } from '../Infrastructure/CryptoRepository';
import { NodeDriver } from '../Infrastructure/NodeDriver';
import { chain, mine, nodes, transactions } from './Controllers';

const NODE_ID = uuidv4();
const PORT = Number.parseInt(process.argv[2]) || 3000;

const nodeList = new Nodes();
const transactionList = new Transactions();
const cryptoRepository = new CryptoRepository();
const nodeDriver = new NodeDriver();
const nodeUseCase = new NodeUseCase(nodeList, nodeDriver);
const proofUseCase = new ProofUseCase(cryptoRepository);
const blockUseCase = new BlockUseCase(transactionList, cryptoRepository);
const chainUseCase = new ChainUseCase(blockUseCase, proofUseCase, nodeUseCase);
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
