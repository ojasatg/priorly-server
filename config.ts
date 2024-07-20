import convict from "convict";

const config = convict({
    port: {
        doc: "The port to bind to",
        format: "port",
        default: 3030,
        env: "PORT",
    },
    mongo: {
        doc: "Mongo DB URI",
        format: "String",
        default: "",
        env: "MONGO_DB_URI",
    },
});

export default config;
