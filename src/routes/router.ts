import { Router } from "express";
import todoRouter from "./todo/todo.router";

const router = Router();

router.use("/todo", todoRouter);

export default router;
