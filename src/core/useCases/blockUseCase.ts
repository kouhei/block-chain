import { Amount, Block, Hash, ITransactions, Proof, Transaction, Transactions, Uuid } from '../entities';
import { ICryptoRepository } from '../interfaces/ICryptoRepository';
import { IBlockUseCase } from '../interfaces/useCases/IBlockUseCase';

export class BlockUseCase implements IBlockUseCase {
  private cryptoRepository: ICryptoRepository;
  constructor(private transactions: ITransactions, cryptoRepository: ICryptoRepository) {
    this.cryptoRepository = cryptoRepository;
  }

  /**
   * create a new transaction and add to the list contained in next block.
   * @param sender 送信者
   * @param recipient 受信者
   * @param amount 送った数量
   */
  addTransaction(sender: Uuid, recipient: Uuid, amount: Amount) {
    this.transactions.add(new Transaction(sender, recipient, amount));
  }

  createNewBlock(proof: Proof, lastBlock: Block): Block {
    const newBlock = new Block(
      lastBlock.index + 1,
      Date.now(),
      this.transactions.getTransactions(),
      proof,
      this.generateBlockHash(lastBlock)
    );

    this.transactions = new Transactions();

    return newBlock;
  }

  // 別にした方がいいかも
  generateBlockHash(block: Block): Hash {
    const { index, timestamp, transactions, proof, previousHash } = block;
    const blockMap = new Map(Object.entries({ index, timestamp, transactions, proof, previousHash }));
    const jsonStr = JSON.stringify(Array.from(blockMap));
    return this.cryptoRepository.encryptSha256(jsonStr);
  }
}
