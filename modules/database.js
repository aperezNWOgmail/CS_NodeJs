//const sql = require("mssql");
import sql from "mssql";

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
