import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import appRouter from "#routes/router";
import config from "./config";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = config.get("port") || 3000;

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(appRouter);

app.listen(port, () => {
    console.info(`Server running at http://localhost:${port}`);
});
