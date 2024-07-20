import { Router } from "express";

import TodoController from "#controllers/todo.controller";

const router = Router();

router.get("/all", TodoController.all);
router.post("/create", TodoController.create);
router.get("/details", TodoController.details);
router.put("/edit", TodoController.edit);
router.delete("/remove", TodoController.remove);
router.delete("/bulk/", TodoController.bulk);
router.get("/deleted", TodoController.allDeleted);

export default router;
