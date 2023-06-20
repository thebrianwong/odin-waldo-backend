import { NextFunction, Request, Response } from "express";

import express from "express";

const router = express.Router();

/* GET home page. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "From index" });
});

export default router;
