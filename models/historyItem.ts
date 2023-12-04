import { Move } from './move';
import UserDTO from './DTOs/userDTO';

interface IHistoryItem {
  gameId: string;
  player1: UserDTO;
  player2: UserDTO;
  winner: string;
  moves: Move[];
}

class HistoryItem implements IHistoryItem {
  gameId: string;
  player1: UserDTO;
  player2: UserDTO;
  winner: string;
  moves: Move[];

  constructor(
    gameId: string,
    player1: UserDTO,
    player2: UserDTO,
    winner: string,
    moves: Move[]
  ) {
    this.gameId = gameId;
    this.player1 = player1;
    this.player2 = player2;
    this.winner = winner;
    this.moves = moves;
  }
}

export default HistoryItem;