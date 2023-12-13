const prompt = require("prompt-sync")();

class TicTacToe {
  showBoard(board) {
    console.log(`\t\t\t ${board[0][0]} | ${board[0][1]} | ${board[0][2]} `);
    console.log(`\t\t\t-----------`);
    console.log(`\t\t\t ${board[1][0]} | ${board[1][1]} | ${board[1][2]} `);
    console.log(`\t\t\t-----------`);
    console.log(`\t\t\t ${board[2][0]} | ${board[2][1]} | ${board[2][2]} \n`);
  }

  showInstructions() {
    console.log("\nChoose a cell numbered from 1 to 9 as below and play\n\n");
    console.log("\t\t\t 1 | 2 | 3 ");
    console.log("\t\t\t-----------");
    console.log("\t\t\t 4 | 5 | 6 ");
    console.log("\t\t\t-----------");
    console.log("\t\t\t 7 | 8 | 9 \n\n");
  }

  initialise(board) {
    for (let i = 0; i < SIDE; i++) {
      for (let j = 0; j < SIDE; j++) board[i][j] = " ";
    }
  }

  declareWinner(whoseTurn) {
    if (whoseTurn == COMPUTER) console.log("COMPUTER has won\n");
    else console.log("HUMAN has won\n");
  }

  rowCrossed(board) {
    for (let i = 0; i < SIDE; i++) {
      if (
        board[i][0] == board[i][1] &&
        board[i][1] == board[i][2] &&
        board[i][0] != " "
      )
        return true;
    }
    return false;
  }

  columnCrossed(board) {
    for (let i = 0; i < SIDE; i++) {
      if (
        board[0][i] == board[1][i] &&
        board[1][i] == board[2][i] &&
        board[0][i] != " "
      )
        return true;
    }
    return false;
  }

  diagonalCrossed(board) {
    if (
      board[0][0] == board[1][1] &&
      board[1][1] == board[2][2] &&
      board[0][0] != " "
    )
      return true;
    if (
      board[0][2] == board[1][1] &&
      board[1][1] == board[2][0] &&
      board[0][2] != " "
    )
      return true;
    return false;
  }

  gameOver(board) {
    return (
      this.rowCrossed(board) ||
      this.columnCrossed(board) ||
      this.diagonalCrossed(board)
    );
  }

  minimax(board, depth, isAI) {
    let score = 0;
    let bestScore = 0;
    if (this.gameOver(board) == true) {
      if (isAI == true) return -1;
      if (isAI == false) return +1;
    } else {
      if (depth < 9) {
        if (isAI == true) {
          bestScore = -999;
          for (let i = 0; i < SIDE; i++) {
            for (let j = 0; j < SIDE; j++) {
              if (board[i][j] == " ") {
                board[i][j] = COMPUTERMOVE;
                score = this.minimax(board, depth + 1, false);
                board[i][j] = " ";
                if (score > bestScore) {
                  bestScore = score;
                }
              }
            }
          }
          return bestScore;
        } else {
          bestScore = 999;
          for (let i = 0; i < SIDE; i++) {
            for (let j = 0; j < SIDE; j++) {
              if (board[i][j] == " ") {
                board[i][j] = HUMANMOVE;
                score = this.minimax(board, depth + 1, true);
                board[i][j] = " ";
                if (score < bestScore) {
                  bestScore = score;
                }
              }
            }
          }
          return bestScore;
        }
      } else {
        return 0;
      }
    }
  }

  bestMove(board, moveIndex) {
    let x = -1,
      y = -1;
    let score = 0,
      bestScore = -999;
    for (let i = 0; i < SIDE; i++) {
      for (let j = 0; j < SIDE; j++) {
        if (board[i][j] == " ") {
          board[i][j] = COMPUTERMOVE;
          score = this.minimax(board, moveIndex + 1, false);
          board[i][j] = " ";
          if (score > bestScore) {
            bestScore = score;
            x = i;
            y = j;
          }
        }
      }
    }
    return x * 3 + y;
  }

  playTicTacToe(whoseTurn) {
    let board = new Array(SIDE).fill().map(() => new Array(SIDE).fill(" "));
    let moveIndex = 0,
      x = 0,
      y = 0;
    this.initialise(board);
    this.showInstructions();

    while (this.gameOver(board) == false && moveIndex != SIDE * SIDE) {
      let n;
      if (whoseTurn == COMPUTER) {
        n = this.bestMove(board, moveIndex);
        x = Math.floor(n / SIDE);
        y = n % SIDE;
        board[x][y] = COMPUTERMOVE;
        console.log(`COMPUTER has put a ${COMPUTERMOVE} in cell ${n + 1}\n`);
        this.showBoard(board);
        moveIndex++;
        whoseTurn = HUMAN;
      } else if (whoseTurn == HUMAN) {
        console.log("You can insert in the following positions : ");
        for (let i = 0; i < SIDE; i++)
          for (let j = 0; j < SIDE; j++)
            if (board[i][j] == " ") console.log(`${i * 3 + j + 1} `);
        //console.log();
        n = parseInt(prompt("\nEnter the position = "));
        n--;
        x = Math.floor(n / SIDE);
        y = n % SIDE;
        if (board[x][y] == " " && n < 9 && n >= 0) {
          board[x][y] = HUMANMOVE;
          console.log(`\nHUMAN has put a ${HUMANMOVE} in cell ${n + 1}\n`);
          this.showBoard(board);
          moveIndex++;
          whoseTurn = COMPUTER;
        } else if (board[x][y] != " " && n < 9 && n >= 0) {
          console.log(
            "\nPosition is occupied, select any one place from the available places\n\n",
          );
        } else if (n < 0 || n > 8) {
          console.log("Invalid position\n");
        }
      }
    }

    if (this.gameOver(board) == false && moveIndex == SIDE * SIDE)
      console.log("It's a draw\n");
    else {
      if (whoseTurn == COMPUTER) whoseTurn = HUMAN;
      else if (whoseTurn == HUMAN) whoseTurn = COMPUTER;
      this.declareWinner(whoseTurn);
    }
  }

  Run() {
    console.log(
      "\n-------------------------------------------------------------------\n\n",
    );
    console.log("\t\t\t Tic-Tac-Toe\n");
    console.log(
      "\n-------------------------------------------------------------------\n\n",
    );

    let choice = prompt("Do you want to start first?(y/n) : ");
    if (choice == "n") this.playTicTacToe(COMPUTER);
    else if (choice == "y") this.playTicTacToe(HUMAN);
    else console.log("Invalid choice\n");
  }
}

export default function TicTacToeTest() {
  let ticTacToe = new TicTacToe();
  ticTacToe.Run();
}
