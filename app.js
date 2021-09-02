require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const route = require("./routes/index");
const mongoose = require("mongoose");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(cors());

app.use((req, res, next) => {
  if (req.originalUrl.includes("webhook")) {
    next();
  } else {
    bodyParser.json({ limit: "50mb" })(req, res, next);
  }
});

app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);
//DB Connection
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

route(app);

app.use(express.static(__dirname));

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
