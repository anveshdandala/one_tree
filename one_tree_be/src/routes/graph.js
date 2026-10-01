import { Router } from "express";
import { updateNodePositions, saveGraph, createEdge } from "../controllers/graphController.js";

const router = Router();

router.patch("/positions", updateNodePositions);
router.post("/save", saveGraph);
router.post("/edges", createEdge);

export default router;
