import { Router } from "express";
import { datastore } from "../core/datastore.js";
import { computeAripScore } from "../core/scoreEngine.js";
import { FarmerProfile, Language } from "../types.js";

export const ussdRouter = Router();

function t(lang: Language, key: string): string {
  const dict: Record<Language, Record<string, string>> = {
    en: {
      welcome: "Welcome to ARIP",
      main: "1. Register\n2. Check score\n3. Insurance quote\n4. Finance options\n5. Language",
      askName: "Enter your full name:",
      askCrop: "Enter main crop (e.g., maize):",
      askAcres: "Enter acres (e.g., 2):",
      askDistrict: "Enter your district (e.g., Gulu):",
      askPractices: "Select practices (comma): 1.Mulching 2.Agroforestry 3.Water harvesting 4.Drought-resistant seed 0.None",
      saved: "Registration complete.",
      needReg: "Please register first (option 1).",
      score: "Your ARIP score is",
      insurance: "Estimated parametric premium:",
      finance: "Recommended loan:",
      langChoose: "Choose language: 1.English 2.Luganda 3.Runyankole",
      langSaved: "Language updated.",
    },
    lg: {
      welcome: "Tukwaniriza ku ARIP",
      main: "1. Wewandiise\n2. Weetegereze essinga\n3. Ensasula y'ensimbi y'ensonyi\n4. Ennonyezebwa y'ensimbi\n5. Olulimi",
      askName: "Yingiza erinya lyo lyonna:",
      askCrop: "Yingiza ommere ey'obufuzi (eg. maize):",
      askAcres: "Yingiza amasizo (eg. 2):",
      askDistrict: "Yingiza disitulikiti yo (eg. Gulu):",
      askPractices: "Londa (comma): 1.Mulching 2.Agroforestry 3.Water 4.Seed",
      saved: "Okwewandiisa kutuukiridde.",
      needReg: "Bambi wewandiise okusooka (1).",
      score: "Akalamu k'o ARIP",
      insurance: "Ensasula y'ensonyi esaasanyiziddwa:",
      finance: "Ensasula eyasembyeyo:",
      langChoose: "Londa olulimi: 1.Olungereza 2.Oluganda 3.Runyankole",
      langSaved: "Olulimi luterezedwa.",
    },
    rn: {
      welcome: "Tukwakwasa ku ARIP",
      main: "1. Iyandikishe\n2. Reeba essinga\n3. Inshuuranzi\n4. Obusasi bw'ensimbi\n5. Orulimi",
      askName: "Teka erinya ryawe ryona:",
      askCrop: "Teka ekirimwa ekuru (maize):",
      askAcres: "Teka ekaalo (2):",
      askDistrict: "Teka district yawe (Gulu):",
      askPractices: "Hanga (comma): 1.Mulching 2.Agroforestry 3.Water 4.Seed",
      saved: "Okwewandikisha kumalirizibwa.",
      needReg: "Taasoooka wewandikishe (1).",
      score: "Omurambu gwa ARIP",
      insurance: "Eky'okuriisa kya inshooransi:",
      finance: "Obusasi oburungi:",
      langChoose: "Hanga orurimi: 1.Orungyereza 2.Oluganda 3.Runyankole",
      langSaved: "Orurimi ruteerweho.",
    },
  };
  return dict[lang][key] || dict.en[key] || key;
}

function parsePractices(input: string): string[] {
  const map: Record<string, string> = {
    "1": "mulching",
    "2": "agroforestry",
    "3": "water harvesting",
    "4": "drought-resistant seed",
  };
  return input
    .split(/[, ]+/)
    .map(x => x.trim())
    .filter(Boolean)
    .map(x => map[x])
    .filter(Boolean) as string[];
}

ussdRouter.post("/ussd", async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body as Record<string, string>;
  if (!sessionId || !phoneNumber) {
    return res.send("END Invalid request");
  }
  const existing = await datastore.findFarmer(phoneNumber);
  const lang: Language = existing?.language || "en";

  const tokens = (text || "").split("*").filter(Boolean);

  if (tokens.length === 0) {
    return res.send(`CON ${t(lang, "welcome")}\n${t(lang, "main")}`);
  }

  const first = tokens[0];

  // 5. Language
  if (first === "5") {
    if (tokens.length === 1) {
      return res.send(`CON ${t(lang, "langChoose")}`);
    }
    const choice = tokens[1];
    const map: Record<string, Language> = { "1": "en", "2": "lg", "3": "rn" };
    const chosen = map[choice] || "en";
    const now = new Date().toISOString();
    const profile: FarmerProfile = existing || {
      phoneNumber,
      createdAt: now,
      updatedAt: now,
    };
    profile.language = chosen;
    profile.updatedAt = now;
    await datastore.upsertFarmer(profile);
    return res.send(`END ${t(chosen, "langSaved")}`);
  }

  // 1. Register
  if (first === "1") {
    if (tokens.length === 1) return res.send(`CON ${t(lang, "askName")}`);
    if (tokens.length === 2) return res.send(`CON ${t(lang, "askCrop")}`);
    if (tokens.length === 3) return res.send(`CON ${t(lang, "askAcres")}`);
    if (tokens.length === 4) return res.send(`CON ${t(lang, "askDistrict")}`);
    if (tokens.length === 5) return res.send(`CON ${t(lang, "askPractices")}`);
    if (tokens.length >= 6) {
      const [_, name, crop, acresStr, district, practicesRaw] = tokens;
      const acres = Number(acresStr) || 0;
      const practices = parsePractices(practicesRaw || "");
      const now = new Date().toISOString();
      const profile: FarmerProfile = {
        phoneNumber,
        name,
        crop,
        acres,
        district,
        climatePractices: practices,
        language: lang,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };
      await datastore.upsertFarmer(profile);
      return res.send(`END ${t(lang, "saved")}`);
    }
  }

  // Require registration for some features
  if (!existing) {
    return res.send(`END ${t(lang, "needReg")}`);
  }

  // 2. Check score
  if (first === "2") {
    const score = await computeAripScore(existing);
    return res.send(`END ${t(lang, "score")} ${score.total}/200\nARI ${score.ari} FRL ${score.frl} +${score.bonus}`);
  }

  // 3. Insurance quote (very simplified)
  if (first === "3") {
    const acres = existing.acres || 1;
    const score = await computeAripScore(existing);
    const riskFactor = Math.max(0.2, 1 - score.ari / 100); // worse ARI => higher premium
    const premiumPerAcre = Math.round(15000 * riskFactor);
    const total = premiumPerAcre * acres;
    return res.send(`END ${t(lang, "insurance")} UGX ${total.toLocaleString()} (${acres} acres)`);
  }

  // 4. Finance options (simplified)
  if (first === "4") {
    const score = await computeAripScore(existing);
    let recommended = 500_000;
    if (score.total >= 160) recommended = 2_000_000;
    else if (score.total >= 130) recommended = 1_200_000;
    else if (score.total >= 100) recommended = 800_000;
    return res.send(`END ${t(lang, "finance")} UGX ${recommended.toLocaleString()}`);
  }

  return res.send("END Bye");
});
