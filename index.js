//---------------------------------------------------
// IMPORT BLOCK
//---------------------------------------------------
import SudokuGenerate, { SudokuSolve } from "./modules/sudoku.js";
import generarinformejson, {
  GenerarInformeCSVJson,
} from "./modules/database.js";
import { sendDynamicEmail } from "./modules/EmailManager.js";
//
import express from "express";
import cors from "cors";
import fs from "fs";
import TicTacToeTest from "./modules/tictactoe.cjs";
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
    //origin: "https://apereznwo.github.io",
    origin: "*",
    credentials: true,
  })
);

//---------------------------------------------------
// MIDDLEWARE: HTTP Request Logger for Render & Hostings
//---------------------------------------------------
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logMessage = `[HTTP] ${req.method} ${req.originalUrl || req.url} - Status: ${res.statusCode} - ${duration}ms - IP: ${req.ip}`;
    console.log(logMessage);
  });
  next();
});

//---------------------------------------------------
// PING ENDPOINT: Returns zero kb data
//---------------------------------------------------
app.get("/ping", (req, res) => {
  res.status(204).send(); // 204 No Content responds with zero bytes of data
});

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


// NODE.JS VERSION 
app.get('/getNodeVersion', (req, res) => {
    res.send(process.version);
});

// Server Framework Version Endpoint (Express version)
app.get('/getNodeWebServerVersion', (req, res) => {
    // You can also read this dynamically from package.json if you want your app version instead
    const expressVersion = require('express/package.json').version;
    
    res.json({
        server: 'Express',
        version: expressVersion // e.g., "4.19.2"
    });
});
/////////////////////////////////////////////////////////
// SMTP ENDPOINT ROUTE
/////////////////////////////////////////////////////////
app.get("/SendEmail", (req, res) => {
  try {
    sendDynamicEmail(
      "alejandro.perez.acosta@gmail.com",
      "Test Notification",
      "This is a test notification email from Web API.",
      "<h3>This is a test notification email from Web API.</h3>"
    );
    res.status(200).send({ message: "Email dispatch triggered successfully!" });
  } catch (error) {
    console.error("Error triggering email route:", error);
    res.status(500).send({ error: "Failed to send email." });
  }
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

    res.status(200).send({ message: "Form submitted successfully!" });
  } catch (err) {
    console.error("Error inserting data:", err);
    res.status(500).send({ error: "An error occurred while saving the data." });
  }
});

/////////////////////////////////////////////////////////
// CHAT FUNCTIONS
/////////////////////////////////////////////////////////
//
import { createServer } from 'http';
import { Server       } from 'socket.io';
const httpServer = createServer(app);

// Initialize Socket.io with your CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: "https://apereznwo.github.io",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io connection logic
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("message", (msg) => {
    console.log("Message:", msg);
    io.emit("message", msg); 
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

//---------------------------------------------------
// HEALTH ENDPOINT: Describes all available endpoints and system status
//---------------------------------------------------
app.get("/health", (req, res) => {
  const healthInfo = {
    status: "UP",
    appName: appName,
    version: appVersion,
    nodeVersion: process.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    endpoints: [
      { path: "/ping", method: "GET", description: "Returns a zero KB (204 No Content) response for health checking." },
      { path: "/health", method: "GET", description: "Describes system status and all available REST endpoints." },
      { path: "/Sudoku_Solve_NodeJS", method: "GET", description: "Solves a Sudoku puzzle given via query parameter p_matrix." },
      { path: "/Sudoku_Generate_NodeJS", method: "GET", description: "Generates a new Sudoku puzzle." },
      { path: "/tictactoe", method: "GET", description: "Runs/tests Tic-Tac-Toe module logic." },
      { path: "/DatabaseConnect", method: "GET", description: "Returns database report or connection status JSON." },
      { path: "/GenerarInformeCSVJson", method: "GET", description: "Returns generated CSV/JSON report data." },
      { path: "/generarinformejson", method: "GET", description: "Returns general JSON report output." },
      { path: "/Index", method: "GET", description: "Serves the index.html content." },
      { path: "/getNodeVersion", method: "GET", description: "Returns the active Node.js version." },
      { path: "/getNodeWebServerVersion", method: "GET", description: "Returns the active express version." },
      { path: "/SendEmail", method: "GET", description: "Triggers a test email notification." },
      { path: "/contact", method: "POST", description: "Handles contact form submission, saves to SQL server, and emails confirmations." }
    ]
  };
  res.status(200).json(healthInfo);
});


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
