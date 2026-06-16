import { Router } from "express";
import { syncUser } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import branchRoutes from "./branches.js";
import edgeRoutes from "./edges.js";
import {
  saveGraph,
  updateNodePositions,
  createEdge,
} from "../controllers/graphController.js";
const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

router.post("/users/sync", requireAuth, syncUser);
router.use("/branches", requireAuth, branchRoutes);
router.use("/edges", requireAuth, edgeRoutes);
router.post("/save-graph", requireAuth, saveGraph);
router.patch("/nodes/positions", requireAuth, updateNodePositions);
export default router;
