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
import bodyParser from "body-parser";
import sql from "mssql";
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
// SQL Server configuration
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
//---------------------------------------------------
// Handling GET requests for different endpoints
//---------------------------------------------------
//
app.use(bodyParser.json());
app.use(
  cors({
    origin: "https://apereznwo.github.io",
    credentials: true,
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
/////////////////////////////////////////////////////////
// SMTP FUNCTIONS
/////////////////////////////////////////////////////////
app.get("/SendEmail", (req, res) => {
  //
  const result = "";
  // Step 3: Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
      result = info.response;
    }
  });
  //
  res.send(result);
});
//
// POST endpoint to handle form submission
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Connect to the SQL Server
    const pool = await sql.connect(config);

    // Insert the data into the database
    const result = await pool
      .request()
      .input("name", sql.NVarChar(100), name)
      .input("email", sql.NVarChar(100), email)
      .input("message", sql.NVarChar(sql.MAX), message)
      .query(
        "INSERT INTO ContactForm (Name, Email, Message) VALUES (@name, @email, @message)"
      );

    console.log("Data inserted successfully:", result);

    const recipient = email;
    const emailSubject = "Contacto - Tutorias en Programacion";
    const emailText =
      "Gracias por enviar su información. Pronto estaremos contactandolo.";
    const emailHtml =
      "<h2>Gracias por enviar su información</h2>" +
      "<p>Pronto estaremos contactandolo." +
      "<br><br>Atte : <b>Pablo Alejandro Pérez Acosta</b>." +
      "<br><br>Linkedin : <a href='www.linkedin.com/in/pablo-alejandro-pérez-acosta-54765770' target='_blank'>(ir a perfil)</a>" +
      "<br><br>Whatsapp : <a href='https://wa.me/573223573416?text=Hola%20Necesito%20Asesoria!' target='_blank'>+573223573416</a>" +
      "<br><br>Demo     : <a href='https://apereznwo.github.io/PWA_DEMO_ENV_PUBLIC' target='_blank'>(Ir a Demo)</a></p>";

    sendDynamicEmail(recipient, emailSubject, emailText, emailHtml);

    const _recipient = "alejandro.perez.acosta@gmail.com";
    const _emailSubject = "Requerimiento - Tutorias en Programacion";
    const _emailText = "Requerimiento - Tutorias en Programacion.";
    const _emailHtml =
      "<h2>Requerimiento - Tutorias en Programacion</h2>" +
      "<p>Detalles." +
      "<br><br>Nombre   : <b>" +
      name +
      "</b>." +
      "<br><br>Email    : <b>" +
      email +
      "</b>." +
      "<br><br>Mensaje  : <b>" +
      message +
      "</b>." +
      "</p>";

    sendDynamicEmail(_recipient, _emailSubject, _emailText, _emailHtml);

    // + ";"

    res.status(200).send({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send({ error: "An error occurred while saving the data." });
  }
});
//
// Step 2: Function to send email with dynamic options
function sendDynamicEmail(to, subject, text, html) {
  // Define the base mailOptions
  const _mailOptions = {
    from: "alejandro.perez.acosta@gmail.com", // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line
    text: text, // Plain text body
    html: html, // HTML body
  };

  // Step 3: Send the email
  transporter.sendMail(_mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}
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
