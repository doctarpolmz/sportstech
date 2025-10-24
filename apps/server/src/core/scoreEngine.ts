import { datastore } from "./datastore.js";
import { FarmerProfile, ScoreBreakdown } from "../types.js";

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(max, x));
}

async function computeAri(profile: FarmerProfile): Promise<number> {
  const climate = await datastore.getClimate();
  const c = climate.find(x => x.district.toLowerCase() === (profile.district || "").toLowerCase());
  if (!c) return 50; // neutral default
  // Higher NDVI, moderate rainfall, lower drought risk => higher ARI
  const ndviScore = c.ndvi * 60; // 0..60
  const rainfallScore = clamp(1 - Math.abs(c.rainfallMm - 120) / 200, 0, 1) * 25; // sweet spot around 120mm => 0..25
  const droughtPenalty = (1 - c.droughtRisk) * 15; // 0..15
  return clamp(ndviScore + rainfallScore + droughtPenalty, 0, 100);
}

async function computeFrl(profile: FarmerProfile): Promise<number> {
  const [mobile, vsla] = await Promise.all([datastore.getMobileMoney(), datastore.getVsla()]);
  const m = mobile.find(x => x.phoneNumber === profile.phoneNumber);
  const v = vsla.find(x => x.phoneNumber === profile.phoneNumber);
  let score = 50;
  if (m) {
    const activity = clamp(m.monthlyTxnCount / 50, 0, 1);
    const inflow = clamp(m.monthlyInflowUGX / 1_000_000, 0, 1);
    const balance = clamp(m.avgBalanceUGX / 500_000, 0, 1);
    score = 30 * activity + 15 * inflow + 10 * balance + 20; // 20 baseline + 55 max
  }
  if (v) {
    const repayment = clamp(v.onTimeRepaymentRate, 0, 1) * 35; // strong weight on VSLA behavior
    const delinquency = clamp(1 - v.delinquencyDaysAvg / 30, 0, 1) * 15;
    score = clamp(score + repayment + delinquency, 0, 100);
  }
  return clamp(score, 0, 100);
}

function computeBonus(profile: FarmerProfile): number {
  const practices = new Set((profile.climatePractices || []).map(p => p.toLowerCase()));
  let bonus = 0;
  if (practices.has("mulching")) bonus += 5;
  if (practices.has("agroforestry")) bonus += 7;
  if (practices.has("water harvesting")) bonus += 4;
  if (practices.has("drought-resistant seed")) bonus += 6;
  return clamp(bonus, 0, 20);
}

export async function computeAripScore(profile: FarmerProfile): Promise<ScoreBreakdown> {
  const [ari, frl] = await Promise.all([computeAri(profile), computeFrl(profile)]);
  const bonus = computeBonus(profile);
  const total = clamp(ari + frl + bonus, 0, 200);
  return { ari: Math.round(ari), frl: Math.round(frl), bonus: Math.round(bonus), total: Math.round(total) };
}
