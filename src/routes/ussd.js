const express = require('express');
const router = express.Router();

// Generic USSD handler following Africa's Talking style parameters
// Expects: sessionId, serviceCode, phoneNumber, text
// Response: plain text beginning with 'CON' to continue or 'END' to end session

function buildMenu(language) {
  const isEn = language === 'en';
  if (isEn) {
    return (
      'Welcome to ARIP\n' +
      '1. About ARIP\n' +
      '2. Farmer Services\n' +
      '3. FSP Portal\n' +
      '4. Check ARIP Score\n' +
      '5. Language'
    );
  }
  if (language === 'lg') {
    return (
      'Tukwaniriza ku ARIP\n' +
      '1. Ebikwata ku ARIP\n' +
      '2. Empeereza ku mulimi\n' +
      '3. FSP Portal\n' +
      '4. Kebera Ebbaluwa y\'omutindo (Score)\n' +
      '5. Olulimi'
    );
  }
  if (language === 'rn') {
    return (
      'Tukarata ARIP\n' +
      '1. Ebiya ARIP\n' +
      '2. Empeeka z\'abalimi\n' +
      '3. FSP Portal\n' +
      '4. Reeba ARIP Score\n' +
      '5. Orulimi'
    );
  }
  return buildMenu('en');
}

function computeAripScore(phoneNumber = '') {
  // Deterministic pseudo-random based on phone
  const norm = String(phoneNumber).replace(/\D/g, '');
  let seed = 0;
  for (let i = 0; i < norm.length; i += 1) seed = (seed * 31 + norm.charCodeAt(i)) >>> 0;
  function rnd(min, max) {
    seed = (1103515245 * seed + 12345) & 0x7fffffff;
    const val = min + (seed % (max - min + 1));
    return val;
  }
  const agroClimaticRiskIndex = rnd(40, 100);
  const financialRepaymentLikelihood = rnd(40, 95);
  const climateResilienceBonus = rnd(0, 25);
  const composite = Math.min(200, agroClimaticRiskIndex + financialRepaymentLikelihood + climateResilienceBonus);
  return {
    composite,
    agroClimaticRiskIndex,
    financialRepaymentLikelihood,
    climateResilienceBonus,
  };
}

function languageFromText(text) {
  // Persisting language per session would require a session store.
  // Here we infer language selection within the same input chain when choosing option 5.
  // Default English.
  const parts = text.split('*').filter(Boolean);
  // Find last occurrence of menu 5 -> language selection
  for (let i = 0; i < parts.length; i += 1) {
    if (parts[i] === '5') {
      const langChoice = parts[i + 1];
      if (langChoice === '1') return 'en';
      if (langChoice === '2') return 'lg';
      if (langChoice === '3') return 'rn';
    }
  }
  return 'en';
}

router.post('/', (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text = '' } = req.body;

  const lang = languageFromText(text);
  const responseType = 'text/plain; charset=utf-8';
  res.set('Content-Type', responseType);

  // Split user input into parts based on '*'
  const parts = text.split('*').filter(Boolean);

  if (parts.length === 0) {
    return res.send(`CON ${buildMenu(lang)}`);
  }

  const first = parts[0];

  // 1. About ARIP
  if (first === '1') {
    const aboutEn =
      'ARIP: AI-driven risk scoring that fuses satellite, mobile money, and VSLA data to unlock climate-resilient finance for smallholders.';
    const aboutLg =
      'ARIP: Enkwatirako ku byuma by\'akalimagezi okugatta amawulire g\'ennyanja, mobile money ne VSLA okuyamba abalimi.';
    const aboutRn =
      'ARIP: Ekyuma ky\'akalimagezi kigatta satellite, mobile money na VSLA okuhika ensimbi ku balimi.';
    const msg = lang === 'lg' ? aboutLg : lang === 'rn' ? aboutRn : aboutEn;
    return res.send(`END ${msg}`);
  }

  // 2. Farmer Services -> 1) Register 2) Tips 3) Insurance
  if (first === '2') {
    if (parts.length === 1) {
      const menu =
        (lang === 'lg'
          ? 'Empeereza z\'abalimi\n1. Wewandiise\n2. Ebiteeso by\'obulimi\n3. Parametric Insurance'
          : lang === 'rn'
          ? 'Empeeka z\'abalimi\n1. Wewandiike\n2. Amagezi g\'obulimi\n3. Parametric Insurance'
          : 'Farmer Services\n1. Register\n2. Farming Tips\n3. Parametric Insurance');
      return res.send(`CON ${menu}`);
    }
    const second = parts[1];
    if (second === '1') {
      // Collect simple registration: Name then District
      if (parts.length === 2) {
        const prompt = lang === 'lg' ? 'Yingiza Erinnya lyo' : lang === 'rn' ? 'Teka Erinya ryawe' : 'Enter your Name';
        return res.send(`CON ${prompt}`);
      }
      if (parts.length === 3) {
        const prompt = lang === 'lg' ? 'Yingiza District yo' : lang === 'rn' ? 'Teka District yawe' : 'Enter your District';
        return res.send(`CON ${prompt}`);
      }
      if (parts.length >= 4) {
        const name = parts[2];
        const district = parts[3];
        const thanks =
          lang === 'lg'
            ? `Webale, ${name}. Oteekeddwa mu lukalala lwa ARIP mu ${district}.`
            : lang === 'rn'
            ? `Webare, ${name}. Oyongereire mu ARIP mu ${district}.`
            : `Thank you, ${name}. You are registered with ARIP in ${district}.`;
        // Normally, save to DB here.
        return res.send(`END ${thanks}`);
      }
    }
    if (second === '2') {
      const tips =
        lang === 'lg'
          ? 'Ebiteeso: Kozesa obutonde, kola mulching, era kendeeza amazzi.'
          : lang === 'rn'
          ? 'Amagezi: Shomera ebyatsi, koresha mulching, okeye amazzi.'
          : 'Tips: Use drought-resistant seeds, practice mulching, optimize water use.';
      return res.send(`END ${tips}`);
    }
    if (second === '3') {
      const ins =
        lang === 'lg'
          ? 'Insurance: Funa obukwakkulizo obusalawo ku biseera ebyomusana n\'enfulungu.'
          : lang === 'rn'
          ? 'Insurance: Enkomezi yokwegarukamu ku badebe n\'enzara.'
          : 'Insurance: Parametric cover for drought and flood triggers.';
      return res.send(`END ${ins}`);
    }
    return res.send('END Invalid option');
  }

  // 3. FSP Portal -> 1) Request API Access 2) Contact
  if (first === '3') {
    if (parts.length === 1) {
      const menu =
        lang === 'lg'
          ? 'FSP Portal\n1. Saba API Access\n2. Tuukirira ARIP'
          : lang === 'rn'
          ? 'FSP Portal\n1. Sabira API Access\n2. Tubashe kuhuura'
          : 'FSP Portal\n1. Request API Access\n2. Contact ARIP';
      return res.send(`CON ${menu}`);
    }
    const second = parts[1];
    if (second === '1') {
      if (parts.length === 2) {
        const prompt = lang === 'lg' ? 'Yingiza email yo' : lang === 'rn' ? 'Teka email yawe' : 'Enter your work email';
        return res.send(`CON ${prompt}`);
      }
      const email = parts[2];
      const msg =
        lang === 'lg'
          ? `Tukusaba okutegeka. Tusindikidde agakwakkulizo ku ${email}.`
          : lang === 'rn'
          ? `Tukushabire. Tatusindise ebisoboka ku ${email}.`
          : `Thanks. We've sent onboarding details to ${email}.`;
      return res.send(`END ${msg}`);
    }
    if (second === '2') {
      const msg =
        lang === 'lg'
          ? 'Tuukirira: partnerships@arip.ug'
          : lang === 'rn'
          ? 'Tuhikire: partnerships@arip.ug'
          : 'Contact: partnerships@arip.ug';
      return res.send(`END ${msg}`);
    }
    return res.send('END Invalid option');
  }

  // 4. Check ARIP Score
  if (first === '4') {
    const score = computeAripScore(phoneNumber);
    const msg =
      lang === 'lg'
        ? `Score yo: ${score.composite} (ARI ${score.agroClimaticRiskIndex}, FRL ${score.financialRepaymentLikelihood}, Bonus ${score.climateResilienceBonus})`
        : lang === 'rn'
        ? `Score yawe: ${score.composite} (ARI ${score.agroClimaticRiskIndex}, FRL ${score.financialRepaymentLikelihood}, Bonus ${score.climateResilienceBonus})`
        : `Your ARIP Score: ${score.composite} (ARI ${score.agroClimaticRiskIndex}, FRL ${score.financialRepaymentLikelihood}, Bonus ${score.climateResilienceBonus})`;
    return res.send(`END ${msg}`);
  }

  // 5. Language
  if (first === '5') {
    if (parts.length === 1) {
      return res.send('CON Choose Language\n1. English\n2. Luganda\n3. Runyankole');
    }
    const choice = parts[1];
    if (!['1', '2', '3'].includes(choice)) {
      return res.send('END Invalid language');
    }
    const nextMenu = buildMenu(choice === '1' ? 'en' : choice === '2' ? 'lg' : 'rn');
    return res.send(`CON ${nextMenu}`);
  }

  return res.send('END Invalid option');
});

module.exports = router;
