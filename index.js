//
console.log("[APPLICATION START]");
//
import SudokuGenerator, { SudokuSolver, Grid, ReplaceAll } from "./sudoku.js";
//const express = require("express");
import express from "express";
//const cors = require("cors");
import cors from "cors";
//const sql = require("mssql");
import sql from "mssql";
//const koffi = require("koffi");
import koffi from "koffi";

//
const app = express();
const config = {
  user: "aperezNWO_SQLLogin_1",
  password: "aperezNWO_SQLLogin_1",
  server: "webapiangulardemo.mssql.somee.com",
  database: "webapiangulardemo",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};
//
let portNumber = 4000;

//Sudoku_Generate_NodeJS
function SudokuGenerate() {
  //
  let N = 9;
  let K = 20;
  //
  const sudokuGenerator = new SudokuGenerator(N, K);
  //
  return sudokuGenerator.Run();
  //
  //return "[{2,0,8,5,1,3,4,6,7},{0,3,6,2,4,0,1,9,8},{0,0,0,8,6,0,2,5,3},{3,2,5,4,7,6,0,1,9},{0,6,9,1,8,2,3,7,5},{8,7,0,3,0,5,0,0,2},{0,4,7,9,2,8,0,3,1},{1,8,0,7,5,4,0,2,6},{9,5,2,0,0,1,7,0,4}]";
}
// Sudoku_Solve_NodeJS
function SudokuSolve(p_matrix) {
  //
  p_matrix =
    "[{2,0,8,5,1,3,4,6,7},{0,3,6,2,4,0,1,9,8},{0,0,0,8,6,0,2,5,3},{3,2,5,4,7,6,0,1,9},{0,6,9,1,8,2,3,7,5},{8,7,0,3,0,5,0,0,2},{0,4,7,9,2,8,0,3,1},{1,8,0,7,5,4,0,2,6},{9,5,2,0,0,1,7,0,4}]";
  //
  const replaceMap = new Map();
  //
  replaceMap.set("[", "");
  replaceMap.set("]", "");
  replaceMap.set("},", "|");
  replaceMap.set("{", "");
  //
  for (const [key, value] of replaceMap) {
    //ReplaceAll(p_matrix, new RegExp(key, "g"), value);
    ReplaceAll(p_matrix, key, value);
  }
  //
  ReplaceAll(p_matrix, "}", "");
  //
  console.log("Processed Matrix : " + p_matrix);

  //
  /*const grid = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];*/

  //
  let grid = new Grid(9, 9);
  //
  const str_p_matrix_rows = p_matrix.split("|");
  //
  console.log("Processed Matrix : " + str_p_matrix_rows);
  //
  let i = 0;
  //
  for (let row of str_p_matrix_rows) {
    let j = 0;
    //
    const str_p_matrix_cols = row.split(",");
    //
    for (let col of str_p_matrix_cols) {
      const num = parseInt(col);
      //
      //grid.set(i, j, num);
      //
      j++;
    }
    //
    i++;
  }
  //
  let sudokuSolver = new SudokuSolver();
  let result = sudokuSolver.Solve(grid.data);
  //
  return result;
}
// NO FUNCIONA EN CODESANDBOX. dll EN LINUX SON DE FORMATO
// FUNICONA PARCIAL EN VISUAL STUDIO.
function Sudoku_Generate_CPP() {
  // NO FUNCIONA
  const dllPath = "./Algorithm.dll";
  const dll = koffi.load(dllPath);
  const f_Sudoku_Generate_CPP = dll.stdcall("Sudoku_Generate_CPP", [], "char*");
  //
  let result = f_Sudoku_Generate_CPP();

  // Print the result
  console.log(result); //
}
//
async function generarinformejson() {
  //
  try {
    //
    let p_sql =
      "SELECT TOP 100 accessDate,id_Column,ipValue,pageName  FROM ACCESSLOGS WHERE LOGTYPE=1 AND (PAGENAME LIKE '%DEMO%' AND PAGENAME LIKE '%PAGE%') AND PAGENAME NOT LIKE '%ERROR%' AND PAGENAME  NOT LIKE '%PAGE_DEMO_INDEX%' AND UPPER(PAGENAME) NOT LIKE '%CACHE%' AND IPVALUE <> '::1' ORDER BY ID_COLUMN DESC ";
    //
    const pool = await sql.connect(config);
    const result = await pool.request().query(p_sql);
    //
    console.log(result);
    //
    return result;
  } catch (err) {
    //
    console.error("Error:", err);
    //
    if (err.originalError && err.originalError.info) {
      console.error("Detailed Error Info:", err.originalError.info);
    }
    //
    return JSON.parse("[]");
    //
  } finally {
    //sql.close();
  }
}

//
async function GenerarInformeCSVJson() {
  //
  try {
    /*
      export interface PersonEntity 
      {
          id_Column       : string;
          ciudad          : string;
          nombreCompleto  : string;
          profesionOficio : string;
      }
    */
    //
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query(
        "SELECT id_Column, ciudad, nombreCompleto,profesionOficio FROM PERSONA",
      );
    //
    console.log(result);
    //
    return result;
  } catch (err) {
    //
    console.error("Error:", err);
    //
    if (err.originalError && err.originalError.info) {
      console.error("Detailed Error Info:", err.originalError.info);
    }
    //
    return JSON.parse("[]");
    //
  } finally {
    //sql.close();
  }
}

//
app.use(
  cors({
    origin: "*",
  }),
);

//---------------------------------------------------
// Handling GET requests for different endpoints
//---------------------------------------------------

app.get("/Sudoku_Solve_NodeJS", (req, res) => {
  const p_matrix = req.query.p_matrix;
  const result = res.send(SudokuSolve(p_matrix));
  console.log("SUDOKU_SOLVE_NODE_JS input  :  " + p_matrix);
  console.log("SUDOKU_SOLVE_NODE_JS output :  " + result);
});

app.get("/Sudoku_Generate_NodeJS", (req, res) => {
  res.send(SudokuGenerate());
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

//---------------------------------------------------
// DRIVER CODE|
//---------------------------------------------------
app.listen(portNumber, () => {
  console.log("Server running on port " + portNumber);
});
