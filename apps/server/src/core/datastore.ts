import { promises as fs } from "fs";
import path from "path";
import { FarmerProfile, SessionState, ClimateDatum, MobileMoneyFeature, VslaRecord } from "../types.js";

const dataRoot = path.join(process.cwd(), "data");
const ensureDir = async () => fs.mkdir(dataRoot, { recursive: true });

async function readJson<T>(file: string, fallback: T): Promise<T> {
  await ensureDir();
  const p = path.join(dataRoot, file);
  try {
    const raw = await fs.readFile(p, "utf8");
    return JSON.parse(raw) as T;
  } catch (e) {
    await fs.writeFile(p, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

async function writeJson<T>(file: string, data: T): Promise<void> {
  await ensureDir();
  const p = path.join(dataRoot, file);
  await fs.writeFile(p, JSON.stringify(data, null, 2));
}

export const datastore = {
  async getFarmers(): Promise<FarmerProfile[]> {
    return readJson<FarmerProfile[]>("farmers.json", []);
  },
  async saveFarmers(all: FarmerProfile[]): Promise<void> {
    return writeJson("farmers.json", all);
  },
  async upsertFarmer(newFarmer: FarmerProfile): Promise<FarmerProfile> {
    const all = await this.getFarmers();
    const idx = all.findIndex(f => f.phoneNumber === newFarmer.phoneNumber);
    if (idx >= 0) {
      all[idx] = newFarmer;
    } else {
      all.push(newFarmer);
    }
    await this.saveFarmers(all);
    return newFarmer;
  },
  async findFarmer(phoneNumber: string): Promise<FarmerProfile | undefined> {
    const all = await this.getFarmers();
    return all.find(f => f.phoneNumber === phoneNumber);
  },

  async getSessions(): Promise<SessionState[]> {
    return readJson<SessionState[]>("sessions.json", []);
  },
  async saveSessions(all: SessionState[]): Promise<void> {
    return writeJson("sessions.json", all);
  },
  async upsertSession(state: SessionState): Promise<SessionState> {
    const all = await this.getSessions();
    const idx = all.findIndex(s => s.sessionId === state.sessionId);
    if (idx >= 0) all[idx] = state; else all.push(state);
    await this.saveSessions(all);
    return state;
  },
  async clearSession(sessionId: string): Promise<void> {
    const all = await this.getSessions();
    const filtered = all.filter(s => s.sessionId !== sessionId);
    await this.saveSessions(filtered);
  },

  async getClimate(): Promise<ClimateDatum[]> {
    return readJson<ClimateDatum[]>("climate.json", []);
  },
  async getMobileMoney(): Promise<MobileMoneyFeature[]> {
    return readJson<MobileMoneyFeature[]>("mobile.json", []);
  },
  async getVsla(): Promise<VslaRecord[]> {
    return readJson<VslaRecord[]>("vsla.json", []);
  }
};
