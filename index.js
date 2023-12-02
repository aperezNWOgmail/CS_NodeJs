//
console.log("[APPLICATION START]");
//
let portNumber = 3000;
//
function SudokuGenerate() {
  return "[{2,0,8,5,1,3,4,6,7},{0,3,6,2,4,0,1,9,8},{0,0,0,8,6,0,2,5,3},{3,2,5,4,7,6,0,1,9},{0,6,9,1,8,2,3,7,5},{8,7,0,3,0,5,0,0,2},{0,4,7,9,2,8,0,3,1},{1,8,0,7,5,4,0,2,6},{9,5,2,0,0,1,7,0,4}]";
}
//
async function DatabaseConnect() {
  //
  const sql = require("mssql");
  //
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
  try {
    //
    const pool = await sql.connect(config);
    const result = await pool.request().query("SELECT * FROM PERSONA");
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
    sql.close();
  }
}

//
const express = require("express");
const cors = require("cors");
const app = express();

//
app.use(
  cors({
    origin: "*",
  }),
);

// Handling GET requests for different endpoints
app.get("/Sudoku_Generate_NodeJS", (req, res) => {
  res.send(SudokuGenerate());
});

//
(async () => {
  //
  const result = await DatabaseConnect();
  //
  console.log(result);
  //
  app.get("/DatabaseConnect", (req, res) => {
    res.send(result);
  });
})();

// Start the server on port 3000
app.listen(portNumber, () => {
  console.log("Server running on port 3000");
});
