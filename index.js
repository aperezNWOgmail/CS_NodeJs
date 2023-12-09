//
console.log("[APPLICATION START]");
//
let portNumber = 4000;
//
const express = require("express");
const cors = require("cors");
const app = express();
const sql = require("mssql");
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
function SudokuGenerate() {
  return "[{2,0,8,5,1,3,4,6,7},{0,3,6,2,4,0,1,9,8},{0,0,0,8,6,0,2,5,3},{3,2,5,4,7,6,0,1,9},{0,6,9,1,8,2,3,7,5},{8,7,0,3,0,5,0,0,2},{0,4,7,9,2,8,0,3,1},{1,8,0,7,5,4,0,2,6},{9,5,2,0,0,1,7,0,4}]";
}

//
function SudokuGenerate_CPP() {
  const ffi = require("ffi-napi");
  const dllPath = "./my_dll.dll";
  const dll = ffi.Library(dllPath, {
    // Define function signatures here
  });

  dll.add = {
    args: ["int", "int"],
    returns: "int",
  };

  dll.get_data = {
    args: [],
    returns: "pointer",
  };

  //
  const result = dll.add(10, 20);
  console.log(result);
  //
  const dataPtr = dll.get_data();
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

// Handling GET requests for different endpoints
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

//
app.listen(portNumber, () => {
  console.log("Server running on port " + portNumber);
});
