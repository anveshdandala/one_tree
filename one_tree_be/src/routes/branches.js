import { Router } from "express";
import {
  addBranch,
  getBranches,
  addNodeToBranch,
  toggleNode,
} from "../controllers/branch.controller.js";

const router = Router();

router.get("/", getBranches);
router.post("/", addBranch);
router.post("/:branchId/nodes", addNodeToBranch);
router.patch("/nodes/:nodeId/toggle", toggleNode);

export default router;
