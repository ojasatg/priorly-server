import { Router } from "express";

import TodoController from "#controllers/todo.controller";

const router = Router();

router.post("/create", TodoController.createTodo);

router.get("/all", TodoController.allTodos);

router.post("/delete", TodoController.deleteTodo);

export default router;
