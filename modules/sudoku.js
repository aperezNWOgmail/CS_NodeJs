//
import koffi from "koffi";

// This code is contributed by Aarti_Rathi
class SudokuGenerator {
  constructor(N, K) {
    this.N = N;
    this.K = K;
    this.SRN = Math.floor(Math.sqrt(N));
    this.mat = new Array(N);
    for (let i = 0; i < N; i++) {
      this.mat[i] = new Array(N);
      this.mat[i].fill(0);
    }
  }

  fillValues() {
    this.fillDiagonal();
    this.fillRemaining(0, this.SRN);
    this.removeKDigits();
  }

  fillDiagonal() {
    for (let i = 0; i < this.N; i += this.SRN) {
      this.fillBox(i, i);
    }
  }

  unUsedInBox(rowStart, colStart, num) {
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        if (this.mat[rowStart + i][colStart + j] === num) {
          return false;
        }
      }
    }
    return true;
  }

  fillBox(row, col) {
    let num;
    for (let i = 0; i < this.SRN; i++) {
      for (let j = 0; j < this.SRN; j++) {
        do {
          num = this.randomGenerator(this.N);
        } while (!this.unUsedInBox(row, col, num));
        this.mat[row + i][col + j] = num;
      }
    }
  }

  randomGenerator(num) {
    const randomValue = Math.floor(Math.random() * num) + 1;
    return randomValue;
  }

  CheckIfSafe(i, j, num) {
    return (
      this.unUsedInRow(i, num) &&
      this.unUsedInCol(j, num) &&
      this.unUsedInBox(i - (i % this.SRN), j - (j % this.SRN), num)
    );
  }

  unUsedInRow(i, num) {
    for (let j = 0; j < this.N; j++) {
      if (this.mat[i][j] === num) {
        return false;
      }
    }
    return true;
  }

  unUsedInCol(j, num) {
    for (let i = 0; i < this.N; i++) {
      if (this.mat[i][j] === num) {
        return false;
      }
    }
    return true;
  }

  fillRemaining(i, j) {
    if (j >= this.N && i < this.N - 1) {
      i = i + 1;
      j = 0;
    }
    if (i >= this.N && j >= this.N) {
      return true;
    }
    if (i < this.SRN) {
      if (j < this.SRN) {
        j = this.SRN;
      }
    } else if (i < this.N - this.SRN) {
      if (j === Math.floor(i / this.SRN) * this.SRN) {
        j = j + this.SRN;
      }
    } else {
      if (j === this.N - this.SRN) {
        i = i + 1;
        j = 0;
        if (i >= this.N) {
          return true;
        }
      }
    }
    for (let num = 1; num <= this.N; num++) {
      if (this.CheckIfSafe(i, j, num)) {
        this.mat[i][j] = num;
        if (this.fillRemaining(i, j + 1)) {
          return true;
        }
        this.mat[i][j] = 0;
      }
    }
    return false;
  }

  removeKDigits() {
    let count = this.K;
    while (count !== 0) {
      let cellId = this.randomGenerator(this.N * this.N) - 1;
      let i = Math.floor(cellId / this.N);
      let j = cellId % this.N;
      if (j !== 0) {
        j = j - 1;
      }
      if (this.mat[i][j] !== 0) {
        count--;
        this.mat[i][j] = 0;
      }
    }
  }

  printSudoku() {
    let string_matrix = "";
    for (let i = 0; i < this.N; i++) {
      let row = "{";
      for (let j = 0; j < this.N; j++) {
        let cell = this.mat[i][j].toString();
        console.log(cell + " ");
        row += cell + (j < this.N - 1 ? "," : "");
      }
      row += i < this.N - 1 ? "}," : "}";
      string_matrix += row;
      console.log();
    }
    string_matrix = "[" + string_matrix + "]";
    console.log();
    return string_matrix;
  }

  Run() {
    this.fillValues();
    let str_matrix = this.printSudoku();
    return str_matrix;
  }
}

class SudokuSolver {
  constructor() {}

  isSafe(grid, row, col, num) {
    for (let x = 0; x < SudokuSolver.N; ++x) {
      if (grid[row][x] === num || grid[x][col] === num) {
        return false;
      }
    }
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);
    for (let i = 0; i < 3; ++i) {
      for (let j = 0; j < 3; ++j) {
        if (grid[i + startRow][j + startCol] === num) {
          return false;
        }
      }
    }
    return true;
  }

  solveSudoku(grid) {
    let row = -1,
      col = -1;
    let isEmpty = false;
    for (let i = 0; i < SudokuSolver.N; ++i) {
      for (let j = 0; j < SudokuSolver.N; ++j) {
        if (grid[i][j] === 0) {
          row = i;
          col = j;
          isEmpty = true;
          break;
        }
      }
      if (isEmpty) {
        break;
      }
    }
    if (!isEmpty) {
      return true;
    }
    for (let num = 1; num <= 9; ++num) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;
        if (this.solveSudoku(grid)) {
          return true;
        }
        grid[row][col] = 0;
      }
    }
    return false;
  }

  printGrid(grid) {
    let string_matrix = "";
    for (let i = 0; i < SudokuSolver.N; ++i) {
      let row = "{";
      for (let j = 0; j < SudokuSolver.N; ++j) {
        let cell = grid[i][j].toString();
        console.log(cell + " ");
        row += cell + (j < SudokuSolver.N - 1 ? "," : "");
      }
      row += i < SudokuSolver.N - 1 ? "}," : "}";
      string_matrix += row;
      console.log();
    }
    string_matrix = "[" + string_matrix + "]";
    console.log();
    return string_matrix;
  }

  Run() {
    let grid = [
      [0, 4, 0, 1, 0, 2, 6, 5, 7],
      [2, 7, 3, 6, 8, 5, 4, 1, 9],
      [0, 6, 0, 9, 0, 4, 2, 8, 3],
      [0, 9, 0, 3, 2, 8, 7, 0, 5],
      [0, 5, 7, 4, 0, 9, 0, 6, 2],
      [4, 2, 8, 5, 6, 7, 3, 9, 1],
      [0, 3, 2, 0, 0, 1, 0, 7, 4],
      [7, 1, 4, 2, 0, 6, 9, 3, 8],
      [0, 8, 0, 7, 4, 0, 1, 2, 6],
    ];
    if (this.solveSudoku(grid)) {
      console.log("Sudoku solved:");
      this.printGrid(grid);
    } else {
      console.log("No solution exists.");
    }
  }

  Solve(grid) {
    let str_matrix = "";
    if (this.solveSudoku(grid)) {
      console.log("Sudoku solved:");
      str_matrix = this.printGrid(grid);
    } else {
      console.log("No solution exists.");
    }
    return str_matrix;
  }
}

export class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.data =
      /* new Array(rows).fill(new Array(columns).fill(0));*/
      //
      [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1],
      ];
  }

  get() {
    return this.data;
  }

  get(row, col) {
    return this.data[row][col];
  }

  set(row, col, value) {
    this.data[row][col] = value;
  }
}

SudokuSolver.N = 9;

// NO FUNCIONA EN CODESANDBOX. dll EN LINUX SON DE FORMATO
// FUNCIONA PARCIAL EN VISUAL STUDIO.
function Sudoku_Generate_CPP() {
  //
  const dllPath = "./Algorithm.dll";
  const dll = koffi.load(dllPath);
  const f_Sudoku_Generate_CPP = dll.stdcall("Sudoku_Generate_CPP", [], "char*");
  //
  let result = f_Sudoku_Generate_CPP();

  // Print the result
  console.log(result); //
}
//
function ReplaceAll(str, from, to) {
  //
  let startPos = 0;
  let str_return = str;
  //
  while ((startPos = str_return.indexOf(from, startPos)) !== -1) {
    str_return = str_return.replace(from, to);
    startPos += to.length;
  }
  return str_return;
}
//Sudoku_Generate_NodeJS
export default function SudokuGenerate() {
  //
  let N = 9;
  let K = 20;
  //
  const sudokuGenerator = new SudokuGenerator(N, K);
  //
  return sudokuGenerator.Run();
  //
}

// Sudoku_Solve_NodeJS
// https://ms7tks-4000.csb.app/Sudoku_Solve_NodeJS?p_matrix=[{6,1,5,0,4,3,7,8,9},{0,2,4,0,9,7,1,6,5},{8,0,9,6,5,1,0,4,3},{0,4,2,0,0,9,8,7,6},{7,3,6,4,0,2,5,0,1},{5,0,8,1,7,6,0,2,4},{0,5,3,9,6,8,4,0,7},{0,6,1,0,0,5,9,3,8},{0,0,7,3,1,4,0,5,2}]
export function SudokuSolve(p_matrix) {
  //
  let result = "";
  //
  const replaceMap = new Map();
  //
  replaceMap.set("[", "");
  replaceMap.set("]", "");
  replaceMap.set("},", "|");
  replaceMap.set("{", "");
  replaceMap.set("}", "");
  //
  for (const [key, value] of replaceMap) {
    p_matrix = ReplaceAll(p_matrix, key, value);
  }
  //
  const str_p_matrix_rows = p_matrix.split("|");
  //
  let grid = new Grid(9, 9);
  //
  let i = 0;
  //
  for (let row of str_p_matrix_rows) {
    //
    //result += (row + "<br/>");
    //
    let j = 0;
    //
    let str_p_matrix_cols = row.split(",");
    //
    for (let col of str_p_matrix_cols) {
      //
      let num = parseInt(col);
      //
      //grid[i][j] = num;
      grid.set(i, j, num);
      //
      j++;
    }
    //
    i++;
  }
  //
  let sudokuSolver = new SudokuSolver();
  result = sudokuSolver.Solve(grid.data);
  //
  return result;
}
