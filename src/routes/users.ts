import { NextFunction, Request, Response } from "express";

import express from "express";

const router = express.Router();

/* GET users listing. */
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "From users" });
});

export default router;
