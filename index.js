//
console.log("[APPLICATION START]");
//
function SudokuGenerate() {
  return "[{2,0,8,5,1,3,4,6,7},{0,3,6,2,4,0,1,9,8},{0,0,0,8,6,0,2,5,3},{3,2,5,4,7,6,0,1,9},{0,6,9,1,8,2,3,7,5},{8,7,0,3,0,5,0,0,2},{0,4,7,9,2,8,0,3,1},{1,8,0,7,5,4,0,2,6},{9,5,2,0,0,1,7,0,4}]";
}
//
function DatabaseConnect() {
  //
  let _result = "[]";
  let result = "";
  //
  const sql = require("mssql");
  //
  (async () => {
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
      const pool = await sql.connect(config);
      result = await pool.request().query("SELECT * FROM PERSONA");
      console.dir(result);
      _result = "[CONNECTION OK]";
      //
    } catch (err) {
      console.error("Error:", err);
      if (err.originalError && err.originalError.info) {
        console.error("Detailed Error Info:", err.originalError.info);
      }
      _result = "[CONNECTION ERROR]";
      //
    } finally {
      sql.close();
    }
  })();
  //
  return _result;
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
app.get("/DatabaseConnect", (req, res) => {
  res.send(DatabaseConnect());
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
