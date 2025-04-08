require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = require("./db/connect");

// routes
const player = require("./routes/player");
app.use("/api/v1/player", player);

app.get("/", (req, res) => {
  res.send("Hello World");
});

// not found

// error handle

const port = 3000;

const start = async () => {
  try {
    // connectDB
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`server is listeling on port ${port}....`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
