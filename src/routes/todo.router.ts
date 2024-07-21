import { Router } from "express";

import TodoController from "#controllers/todo.controller";

const router = Router();

router.post("/create", TodoController.create);
router.get("/all", TodoController.all);
router.get("/count", TodoController.count);
router.get("/details", TodoController.details);
router.put("/edit", TodoController.edit);
router.put("/bulk/", TodoController.bulk);
router.delete("/remove", TodoController.remove);

export default router;
