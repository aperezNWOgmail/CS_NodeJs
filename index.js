//---------------------------------------------------
// IMPORT BLOCK
//---------------------------------------------------
import SudokuGenerate, { SudokuSolve } from "./modules/sudoku.js";
import generarinformejson, {
  GenerarInformeCSVJson,
} from "./modules/database.js";
//
import express from "express";
import cors from "cors";
import fs from "fs";
import TicTacToeTest from "./modules/tictactoe.cjs";
//---------------------------------------------------
// VARIABLE DECLARATION
//---------------------------------------------------
//
let appName = "[WEB API / NODE.JS - DEMO]";
//
let appVersion = "1.0.0.3";
//
let portNumber = 4000;
//
const app = express();

//---------------------------------------------------
// Handling GET requests for different endpoints
//---------------------------------------------------
//
app.use(
  cors({
    origin: "*",
  }),
);

app.get("/Sudoku_Solve_NodeJS", (req, res) => {
  //
  const p_matrix = req.query.p_matrix;
  const result = SudokuSolve(p_matrix);
  //
  console.log("SUDOKU_SOLVE_NODE_JS input  :  " + p_matrix);
  console.log("SUDOKU_SOLVE_NODE_JS output :  " + result);
  //
  res.send(result);
});

app.get("/Sudoku_Generate_NodeJS", (req, res) => {
  res.send(SudokuGenerate());
});

app.get("/tictactoe", (req, res) => {
  res.send(TicTacToeTest());
});

// DatabaseConnect
(async () => {
  //
  const result = await GenerarInformeCSVJson();
  //
  app.get("/DatabaseConnect", (req, res) => {
    res.send(result);
  });
  //
  console.log(result);
})();

// GenerarInformeCSVJson
(async () => {
  //
  const result = await GenerarInformeCSVJson();
  //
  app.get("/GenerarInformeCSVJson", (req, res) => {
    res.send(result);
  });
  //
  console.log(result);
})();

// generarinformejson
(async () => {
  //
  const result = await generarinformejson();
  //
  app.get("/generarinformejson", (req, res) => {
    res.send(result);
  });
  //
  console.log(result);
})();

// index
async function GetIndex() {
  //
  const data = await fs.readFileSync("index.html", "utf8");
  //const data = await fs.readFileSync("index.html");
  //
  return data;
}
//
(async () => {
  //
  const result = await GetIndex();
  //
  app.get("/Index", (req, res) => {
    res.send(result);
  });
  //
  console.log(result);
})();

//---------------------------------------------------
// DRIVER CODE
//---------------------------------------------------
//
app.listen(portNumber, () => {
  //
  console.log("[APPLICATION START]");
  console.log(" Application Name       : " + appName);
  console.log(" Application Version    : " + appVersion);
  console.log(" Server running on port : " + portNumber);
});

// To stop the server
// For example, you might use Ctrl + C in your terminal to trigger this function
const stopServer = () => {
  server.close(() => {
    console.log("Server stopped");
  });
};

// Call stopServer when you want to stop the server
// For example, you might trigger it in response to a specific condition or manually via some signal.
// stopServer();
