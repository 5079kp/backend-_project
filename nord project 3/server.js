const express = require("express");

const app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(5000, () => {
    console.log("Server is running on http://localhost:5000");
});