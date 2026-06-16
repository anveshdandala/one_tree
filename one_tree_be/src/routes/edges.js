import { Router } from "express";
import { addEdge, getEdges } from "../controllers/edge.controller.js";

const router = Router();

router.post("/", addEdge);
router.get("/", getEdges);

export default router;
