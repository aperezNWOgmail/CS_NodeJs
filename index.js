console.log("mcsd");

const express = require("express");
const app = express();

// Handling GET requests for different endpoints
app.get("/Sudoku_Generate_NodeJS", (req, res) => {
  res.send(
    "[{2,0,8,5,1,3,4,6,7},{0,3,6,2,4,0,1,9,8},{0,0,0,8,6,0,2,5,3},{3,2,5,4,7,6,0,1,9},{0,6,9,1,8,2,3,7,5},{8,7,0,3,0,5,0,0,2},{0,4,7,9,2,8,0,3,1},{1,8,0,7,5,4,0,2,6},{9,5,2,0,0,1,7,0,4}]",
  );
});

app.get("/endpoint2", (req, res) => {
  res.send("Response for endpoint2");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
