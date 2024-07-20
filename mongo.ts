import { MongoClient } from "mongodb";
import config from "./config";

const MONGO_CONNECTION_STRING = config.get("mongo");

let db;

MongoClient.connect(MONGO_CONNECTION_STRING)
    .then((client) => {
        console.info("Mongo: Connected to database");
        db = client.db("priorly");
    })
    .catch((error) => console.error(error));

export default db;
