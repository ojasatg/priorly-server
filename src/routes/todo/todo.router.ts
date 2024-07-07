import { Router, type Request, type Response } from "express";

const router = Router();

router.post("/create", async (req: Request, res: Response) => {
    console.log(req.body);
    res.send("created successfully");
});

export default router;
