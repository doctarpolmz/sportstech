export type Language = "en" | "lg" | "rn"; // English, Luganda, Runyankole

export interface FarmerProfile {
  phoneNumber: string;
  name?: string;
  crop?: string;
  acres?: number;
  district?: string;
  climatePractices?: string[]; // e.g., mulching, agroforestry, water harvesting
  language?: Language;
  createdAt: string;
  updatedAt: string;
}

export interface SessionState {
  sessionId: string;
  phoneNumber: string;
  path: string[]; // tokens from USSD text
  metadata: Record<string, string>;
  updatedAt: string;
}

export interface ClimateDatum {
  district: string;
  ndvi: number; // 0..1 vegetation index
  rainfallMm: number; // last 30 days
  droughtRisk: number; // 0..1
}

export interface MobileMoneyFeature {
  phoneNumber: string;
  monthlyTxnCount: number;
  monthlyInflowUGX: number;
  avgBalanceUGX: number;
}

export interface VslaRecord {
  phoneNumber: string;
  onTimeRepaymentRate: number; // 0..1
  delinquencyDaysAvg: number; // avg days late
}

export interface ScoreBreakdown {
  ari: number; // Agroclimatic Risk Index (0..100)
  frl: number; // Financial Repayment Likelihood (0..100)
  bonus: number; // Climate bonus (0..20)
  total: number; // 0..200
}
