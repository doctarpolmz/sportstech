const express = require('express');
const router = express.Router();

function computeAripScoreFromIdentifier(identifier = '') {
  const norm = String(identifier).replace(/\D/g, '');
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

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/score', (req, res) => {
  const { phoneNumber, nationalId, vslaId } = req.body || {};
  const id = phoneNumber || nationalId || vslaId || 'unknown';
  const score = computeAripScoreFromIdentifier(id);
  res.json({ id, score });
});

router.get('/score', (req, res) => {
  const id = req.query.phoneNumber || req.query.nationalId || req.query.vslaId || 'unknown';
  const score = computeAripScoreFromIdentifier(id);
  res.json({ id, score });
});

router.get('/version', (req, res) => {
  res.json({ name: 'ARIP', version: '0.1.0' });
});

module.exports = router;
