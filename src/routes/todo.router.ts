import { Router } from "express";

import TodoController from "#controllers/todo.controller";

const router = Router();

router.get("/all", TodoController.all);
router.post("/create", TodoController.create);
router.delete("/remove", TodoController.remove);
router.get("/details", TodoController.details);
router.put("/edit", TodoController.edit);

export default router;
