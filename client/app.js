const express = require("express");

const app = express();

// routes

app.get("/", (req, res) => {
  res.send("Hello World");
});

// not found

// error handle

const port = 3000;

const start = async () => {
  try {
    // connectDB
    app.listen(port, () => {
      console.log(`server is listeling on port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
