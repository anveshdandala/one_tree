import { Router } from "express";
import { addBranch } from "../controllers/branch.controller.js";

const router = Router();

router.post("/", addBranch);

export default router;
