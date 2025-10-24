import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { healthRouter } from "../routes/health.js";
import { ussdRouter } from "../routes/ussd.js";
import { apiRouter } from "../routes/api.js";

dotenv.config();

export const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", healthRouter);
app.use("/api", apiRouter);
app.use("/api", ussdRouter);
