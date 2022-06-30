import type { Block } from '../../Entities';

export interface IMinerUseCase {
  mineBlock(node_id: string): Block;
}
