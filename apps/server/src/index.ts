import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { healthRouter } from "./routes/health.js";
import { ussdRouter } from "./routes/ussd.js";
import { apiRouter } from "./routes/api.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(",") || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", healthRouter);
app.use("/api", apiRouter);
app.use("/api", ussdRouter);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`ARIP server listening on port ${port}`);
});
