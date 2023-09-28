const express = require("express");
const bodyParser = require("body-parser");
const route = require("./src/route/route");
const mongoose = require("mongoose");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ==+==+==+==+==+==+==+==+==+==[Connect DataBase]==+==+==+==+==+==+==+==+==+==
let MongoURL = process.env.MongoURL;
mongoose
  .connect(String(MongoURL), { useNewUrlParser: true, })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));


app.use("/", route);


app.listen(process.env.PORT || 3000, function () {
  console.log("Port running on " + (process.env.PORT || 3000));
});
