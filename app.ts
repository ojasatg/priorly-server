import express from "express";
import cors from "cors";

import type { TCustomString } from "./src/types/demo";

import { todoRouter } from "./src/routes/router";

const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

function getString(arg: TCustomString) {
    return `arg is ${arg}`;
}

app.get("/hello", (req, res) => {
    const str = getString("some");
    res.send(str);
});

app.use(todoRouter);

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}`);
});
