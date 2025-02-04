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
import nodemailer from "nodemailer";
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
//
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail's SMTP server
  host: "smtp.gmail.com",
  port: 587, //587, // Port for TLS
  secure: false, // true for 465 (SSL), false for other ports
  auth: {
    user: "alejandro.perez.acosta@gmail.com", // Replace with your Gmail address
    pass: "bzjz fsev xwoh dgkt", // Replace with your Gmail password or app-specific password
  },
});
// Step 2: Define the email options
const mailOptions = {
  from: "alejandro.perez.acosta@gmail.com", // Sender address
  to: "alejandro.perez.acosta@hotmail.com", // List of recipients
  subject: "Test Email from Node.js", // Subject line
  text: "This is a test email sent from Node.js using Gmail SMTP.", // Plain text body
  html: "<h1>Hello!</h1><p>This is a test email sent from <b>Node.js</b> using Gmail SMTP.</p>", // HTML body
};
//---------------------------------------------------
// Handling GET requests for different endpoints
//---------------------------------------------------
//
app.use(
  cors({
    origin: "*",
  })
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
//

(async () => {
  //
  const result = "";
  // Step 3: Send the email
  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
      result = info.response;
    }
  });
  //
  app.get("/SendMail", (req, res) => {
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
