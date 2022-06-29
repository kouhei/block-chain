import { Block } from '../../entities';

export interface IMinerUseCase {
  mineBlock(node_id: string): Block;
}
