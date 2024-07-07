import { Router } from "express";

export const todoRouter = Router();

todoRouter.get("/todo/app", (req, res) => {
    res.send("I am a Todo App");
});
