import { Router } from "express";
import {
  addBranch,
  getBranches,
  addNode,
} from "../controllers/branch.controller.js";

const router = Router();

router.post("/", addBranch);
router.get("/", getBranches);
router.post("/:branchId/nodes", addNode);

export default router;
