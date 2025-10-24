# AgriRisk Intelligence Platform (ARIP)

AI-Driven Climate Resilience and Financial Inclusion for Uganda's Smallholder Farmers.

## Overview

ARIP fuses satellite imagery, climate data, mobile money behaviors, and VSLA records to produce a composite risk score that enables climate-resilient credit and insurance products for smallholder farmers.

This repository includes:
- A Node/Express backend with a USSD endpoint
- A responsive static web UI with the ARIP proposal content
- Simple APIs to simulate the ARIP composite score

## Quick Start

Prerequisites: Node.js 18+ and npm.

```bash
npm install
npm start
# open http://localhost:3000
```

Development mode with hot-reload:

```bash
npm run dev
```

Environment variables: copy `.env.example` to `.env` and adjust if needed.

## Endpoints

- `GET /` — Web UI
- `GET /health` — Service health
- `POST /ussd` — USSD callback (Africa's Talking style: `sessionId`, `serviceCode`, `phoneNumber`, `text`)
- `GET /api/health` — API health
- `GET /api/version` — API version
- `GET /api/score?phoneNumber=+256700000000` — Mock composite score (also supports `nationalId` or `vslaId`)
- `POST /api/score` — JSON body `{ "phoneNumber": "+256..." }`

## USSD Testing

You can simulate a USSD session locally with `curl`:

```bash
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=12345&serviceCode=*123#&phoneNumber=%2B256700000000&text=" \
  http://localhost:3000/ussd
```

Proceed to choose menu options by appending `text` with `*`-separated inputs. For example, to check score (option 4):

```bash
curl -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "sessionId=12345&serviceCode=*123#&phoneNumber=%2B256700000000&text=4" \
  http://localhost:3000/ussd
```

### Africa's Talking Sandbox

1. Create a sandbox app in Africa's Talking.
2. Create a USSD code and set the callback URL to your server `/ussd` (e.g., via ngrok: `https://<subdomain>.ngrok.io/ussd`).
3. Method: POST. Content-Type: `application/x-www-form-urlencoded`.
4. Use the same menu flow as above. Responses must start with `CON` to continue or `END` to terminate.

## Architecture (MVP)

- Express server serves the static frontend and exposes USSD and REST APIs
- Deterministic mock scoring helper to simulate ARI, FRL, and Climate Bonus
- Mobile-first, accessible HTML/CSS without heavy JS frameworks

Future enhancements (placeholders):
- Integration with satellite APIs (e.g., NDVI/EVI providers)
- Secure partner APIs (authentication, rate limiting)
- Data lake and model training pipelines
- Permissioned blockchain component for auditable data sharing

## Deployment

- Use any Node-friendly host (Railway, Render, Fly.io, AWS, Azure, GCP)
- Set `PORT` and optional `CORS_ORIGIN`
- Run `npm start`

## License

Proprietary — for internal evaluation and pilot purposes.
