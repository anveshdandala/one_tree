import { verifyToken } from "@clerk/backend";
import { prisma } from "../config/prisma.js";

export async function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    req.clerkUserId = payload.sub;
    next();
  } catch (e) {
    console.log("Auth error:", e.message);
    res.status(401).json({ error: "Invalid token" });
  }
}
