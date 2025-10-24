import { Router } from "express";
import { z } from "zod";
import { datastore } from "../core/datastore.js";
import { computeAripScore } from "../core/scoreEngine.js";

export const apiRouter = Router();

const FarmerSchema = z.object({
  phoneNumber: z.string(),
  name: z.string().optional(),
  crop: z.string().optional(),
  acres: z.number().optional(),
  district: z.string().optional(),
  climatePractices: z.array(z.string()).optional(),
  language: z.enum(["en", "lg", "rn"]).optional(),
});

apiRouter.post("/farmers", async (req, res) => {
  const parse = FarmerSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const now = new Date().toISOString();
  const existing = await datastore.findFarmer(parse.data.phoneNumber);
  const farmer = { createdAt: existing?.createdAt || now, updatedAt: now, ...existing, ...parse.data };
  await datastore.upsertFarmer(farmer);
  res.json(farmer);
});

apiRouter.get("/farmers/:phoneNumber", async (req, res) => {
  const f = await datastore.findFarmer(req.params.phoneNumber);
  if (!f) return res.status(404).json({ error: "Not found" });
  res.json(f);
});

apiRouter.get("/score/:phoneNumber", async (req, res) => {
  const f = await datastore.findFarmer(req.params.phoneNumber);
  if (!f) return res.status(404).json({ error: "Farmer not found" });
  const score = await computeAripScore(f);
  res.json(score);
});
