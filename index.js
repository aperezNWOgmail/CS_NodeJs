console.log("mcsd");

const express = require("express");
const app = express();

// Handling GET requests for different endpoints
app.get("/endpoint1", (req, res) => {
  res.send("Response for endpoint1");
});

app.get("/endpoint2", (req, res) => {
  res.send("Response for endpoint2");
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
