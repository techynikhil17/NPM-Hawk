<div align="center">
  <h1>🦅 NPM Hawk</h1>
  <p><b>Monitor your packages. With absolute precision.</b></p>
  <p><i>J.A.R.V.I.S. Protocol Online. All systems nominal.</i></p>
</div>

<br/>

## ◈ SYSTEM OVERVIEW

Welcome to the **Hawk_OS**. Building software is easy; knowing exactly what's running in your dependency tree is the real superpower. 

**NPM Hawk** is a high-performance, full-stack monitoring dashboard designed for developers who want absolute visibility over their open-source footprint. With a sleek, Gen-Z aesthetic and a cinematic HUD interface, NPM Hawk doesn't just list packages—it acts as your personal AI assistant (think J.A.R.V.I.S. meets your friendly neighborhood developer), providing real-time telemetry, threat detection, and health diagnostics for your entire npm ecosystem.

No credit cards. No complex auth. Just enter your npm identity, and the system automatically discovers and monitors your perimeter.

---

## ⚡ CAPABILITIES (ARSENAL DEPLOYED)

### 🧬 Identity Sync (Auto-Discover)
Why manually track packages when the system can do it for you? Enter your npm username, and the scanner will automatically cross-reference the registry, pulling every package where you are listed as a maintainer. Zero config required.

### 🛡️ Threat Detection (OSV.dev)
Every package is continuously cross-referenced against **OSV.dev** (Google's open-source vulnerability database). Anticipate and neutralize threats before they reach production. Classifications range from MODERATE to CRITICAL.

### 🎯 Target Health (Core Integrity)
A deep-dive diagnostic composite score (0–100) across five weighted dimensions, sourced via npms.io:
- **Maintenance:** Commit recency & release cadence (25pts)
- **Security:** Known CVEs (25pts)
- **Popularity:** Weekly download volume & trend (20pts)
- **Quality:** TypeScript support, tests, and documentation (20pts)
- **Community:** GitHub stars, forks, and issues (10pts)

### 📊 Telemetry Feed
Pulling live data directly from the npm registry APIs. Watch your weekly, monthly, and all-time download counts shift in real time via our interactive, high-contrast HUD charts.

### ⚖️ Tactical Compare
Evaluating alternative dependencies? Enter up to 5 packages to open the comparison matrix. Overlay download trends, compare health gauges, and view a full side-by-side tactical breakdown.

---

## 🛠️ ARCHITECTURE

Built with a modern, high-speed stack designed for rapid deployment and edge-ready scaling.

- **Frontend Interface:** React 18 + Vite (Sleek Glassmorphism UI, Recharts, Framer Motion aesthetics)
- **Backend Relay:** Node.js + Express (Rate-limited proxy, dynamic CORS)
- **Data Sources:** 
  - `registry.npmjs.org` (Downloads & Metadata)
  - `api.npms.io` (Health & Quality Metrics)
  - `api.osv.dev` (Vulnerability Scanning)
  - `api.github.com` (Repository Analytics)

---

## 🚀 DEPLOYMENT PROTOCOL

To run the Hawk_OS locally on your own mainframe:

### 1. Initialize the Backend
```bash
cd backend
npm install
npm run dev
```
*The server will spin up on port `3001`.*

### 2. Initialize the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm run dev
```
*The HUD will initialize at `http://localhost:5173`.*

---

## 🌐 PRODUCTION ENVIRONMENT

NPM Hawk is designed for zero-cost, serverless deployment:
- **Frontend** deployed on **Vercel** (`VITE_API_BASE` points to backend).
- **Backend** deployed on **Railway** (`ALLOWED_ORIGIN` points to frontend to secure CORS).

---

> *"Sometimes you gotta run before you can walk."*  
> **— Tony Stark**
