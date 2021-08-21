"use strict";

const fs = require("fs");
const express = require("express");
const app = express();
const port = 4000;

app.get("/", (req, res) => {
    const raw = fs.readFileSync("./data.json");
    const data = JSON.parse(raw);
    res.send(data);
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
