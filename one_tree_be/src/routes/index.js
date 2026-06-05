import { Router } from "express";
import { syncUser } from "../controllers/userController.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import branchRoutes from "./branches.js";

const router = Router();

router.get("/hello", (req, res) => {
  res.json({ message: "Hello from the API!" });
});

router.post("/users/sync", requireAuth, syncUser);
router.use("/branches", requireAuth, branchRoutes);
export default router;
