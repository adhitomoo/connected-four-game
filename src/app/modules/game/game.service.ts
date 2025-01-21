import { Injectable } from "@angular/core";
import { BehaviorSubject, findIndex, Observable, Subject } from "rxjs";

interface GameState {
  boards: number[][];
  moves: number;
  currentPlayer: number;
  gameStatus: string;
  winner: number | null;
}

@Injectable({
  providedIn: 'root'
})

export class GameService {

  public counter$: Subject<number> = new Subject<number>();
  public _counter: BehaviorSubject<number> = new BehaviorSubject<number>(30);

  rows: number = 6;
  cols: number = 7;

  // counter!: number

  gameState: GameState = {
    boards: Array(this.rows).fill(null).map(() => Array(this.cols).fill(0)),
    moves: 0,
    currentPlayer: 1,
    gameStatus: 'not_started',
    winner: null
  };

  directionWinner: any = [];

  constructor() { }

  public restart(): Observable<any> {
    return new Observable((obs) => {
      this.gameState = {
        boards: Array(this.rows).fill(null).map(() => Array(this.cols).fill(0)),
        moves: 0,
        currentPlayer: 1,
        gameStatus: 'not_started',
        winner: null
      }

      obs.next(this.gameState);
    })
  }

  public dropPiece(column: number) {
    // this.gameState.moves =+ this.gameState.moves + 1;
    for(let row = 5; row >= 0; row--) {
      // this.gameState.currentPlayer = this.gameState.moves % 2 === 0 ? 2 : 1;
      if (!this.gameState.boards[row][column]) {
          this.gameState.boards[row][column] = this.gameState.currentPlayer;

          this.switchPlayer().subscribe();
        // this.checkWinner(this.gameState.boards);
        return row; // Return the row index where the disc landed
      }

    }

    return -1
  }

  public cpuMove(): Observable<number> {
    return new Observable((obs) => {
      let column: number;
      // let row: number;

      // do {
      //   column = Math.floor(Math.random() * this.cols);
      //   row = this.dropPiece(column);
      // } while (row === -1); // Keep trying until a valid move is found
      column = Math.floor(Math.random() * this.cols);
      // this.switchPlayer().subscribe();
      obs.next(column);
    });
  }

  public switchPlayer(): Observable<number> {
    return new Observable((obs) => {
      this.gameState.currentPlayer = (this.gameState.currentPlayer + 1) % 2 === 0 ? 2 : 1;

      obs.next((this.gameState.currentPlayer));
    })
  }

  public checkWinner(board: any): Observable<any> {
    return new Observable((obs) => {
      obs.next(
        this.checkDirection(board, 1, 0) || // Horizontal
        this.checkDirection(board, 0, 1) || // Vertical
        this.checkDirection(board, 1, 1) || // Diagonal (bottom-left to top-right)
        this.checkDirection(board, 1, -1) // Diagonal (top-left to bottom-right)
      )
    })
  }

  private checkDirection(board: any, deltaRow: number, deltaCol: number) {
    this.directionWinner = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = board[row][col];
        if (cell) {
          // Check for four in a row in the specified direction
          if (
              board[row + deltaRow] && board[row + deltaRow][col + deltaCol] === cell &&
              board[row + 2 * deltaRow] && board[row + 2 * deltaRow][col + 2 * deltaCol] === cell &&
              board[row + 3 * deltaRow] && board[row + 3 * deltaRow][col + 3 * deltaCol] === cell
          ) {
            return cell; // Return the winner ('X' or 'O')
          }
        }
      }
    }
    return null;
  }


  public horizontalDirection(board: any): Observable<any> {
    this.directionWinner = [];

    return new Observable((obs) => {
      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols - 3; col++) {
            const result = board[row][col];
            if (result && result === board[row][col] && result === board[row][col + 1] && result === board[row][col + 2] && result === board[row][col + 3]) {
              this.directionWinner.push([row, col], [row, col + 1], [row, col + 2], [row, col + 3]);
              this.gameState.winner = result;
              obs.next(this.directionWinner);
            }

            obs.closed
            // let count = 0;
            // while (count <= 4) {
            //   if (result && result === board[row + count][col]) {
            //     this.directionWinner.push([row + count, col]);
            //     this.gameState.winner = result;

            //     obs.next(this.directionWinner);
            //   }
            //   count++;
            // }
        }
      }
    });
  }

  public verticalDirection(board: any): Observable<any> {
    this.directionWinner = [];

    return new Observable((obs) => {
      for (let col = 0; col < this.cols; col++) {
        for (let row = 0; row < this.rows - 3; row++) {
            const result = board[row][col];
            if (result && result === board[row][col] && result === board[row + 1][col] && result === board[row + 2][col] && result === board[row + 3][col]) {
              this.directionWinner.push([row, col], [row + 1, col], [row + 2, col], [row + 3, col]);
              this.gameState.winner = result;

              obs.next(this.directionWinner);
            }
            obs.closed
        }
      }
    });
  }

  public diagonalDirection(board: any): Observable<any> {
    this.directionWinner = [];
    return new Observable((obs) => {
      for (let row = 3; row < this.rows; row++) {
        for (let col = 0; col < this.cols - 3; col++) {
            const result = board[row][col];
            if (result && result === board[row - 1][col + 1] && result === board[row - 2][col + 2] && result === board[row - 3][col + 3]) {
              this.directionWinner.push([row, col], [row - 1, col + 1], [row - 2, col + 2], [row - 3, col + 3]);
              this.gameState.winner = result;
              obs.next(this.directionWinner);
            }
        }
      }

    // Check for top-left to bottom-right
      for (let row = 0; row < this.rows - 3; row++) {
        for (let col = 0; col < this.cols - 3; col++) {
            const result = board[row][col];
            if (result && result === board[row + 1][col + 1] && result === board[row + 2][col + 2] && result === board[row + 3][col + 3]) {
                this.directionWinner.push([row, col], [row + 1, col + 1], [row + 2, col + 2], [row + 3, col + 3]);
                this.gameState.winner = result;
                obs.next(this.directionWinner);
            }
        }
      }

      obs.closed
    }
  )}

  // public verticalDirection(board: any, row: number, col: number, result: number) {
  //   return result === board[row + 1][col] && result === board[row + 2][col] && result === board[row + 3][col];
  // }

  // public diagonalDirection(board: any, row: number, col: number, result: number) {
  //   return result === board[row][col + 1] && result === board[row + 1][col + 2] && result === board[row + 2][col  + 3];
  // }

  // public diagonalRightDirection(board: any, row: number, col: number, result: number) {
  //   return result === board[row][col] && result === board[row + 1][col + 1] && result === board[row + 2][col + 2] && result === board[row + 3][col  + 3];
  // }
}
