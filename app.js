const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

//middleware
app.use(express.json());
app.use(cors());

//database
const db = process.env.db;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected"))
  .catch((err) => console.log(err.message));
//routes middleware
app.use("/user", require("./routes/user"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.port;
app.listen(PORT, () => console.log(`connected to port ${PORT}`));
