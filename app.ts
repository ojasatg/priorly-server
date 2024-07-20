import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import appRouter from "#routes/router";
import config from "./config";
import mongoose from "mongoose";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = config.get("port") || 3000;
const mongo_uri = config.get("mongo");

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use(appRouter);

mongoose
    .connect(mongo_uri)
    .then(() => {
        console.info("Mongo: DB Connected");
        app.listen(port, () => {
            console.info(`Server running at http://localhost:${port}`);
        });
    })
    .catch((error) => {
        console.error("Mongo: Error connecting DB");
        console.error(error);
    });
