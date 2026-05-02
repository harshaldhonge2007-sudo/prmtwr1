# CivicSync — AI-Powered Election Education Assistant

![CI](https://github.com/harshaldhonge2007-sudo/prmtwr1/actions/workflows/ci.yml/badge.svg?branch=main)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-blue)
![Cloud Run](https://img.shields.io/badge/Deploy-Cloud%20Run-orange)

> **CivicSync** is an AI-powered web application that educates Indian citizens about the democratic election process — from voter registration to polling booth procedures — using Google Gemini AI, Firebase, and Google Cloud Run.

## 🌐 Live Demo
**[https://civicsync-844332838952.us-central1.run.app](https://civicsync-844332838952.us-central1.run.app)**

---

## 🏆 Google Services Integration

| Service | Usage |
|---|---|
| **Google Gemini Pro 1.5** | AI chat — answers election questions with contextual, factual responses |
| **Firebase Authentication** | Google Sign-In for secure, personalized sessions |
| **Cloud Firestore** | Persists user chat history with server-side timestamps |
| **Firebase Analytics (GA4)** | Tracks page views and login events |
| **Google Cloud Run** | Fully managed, auto-scaling container deployment |
| **Google Maps Embed** | Interactive map showing polling booth locations |
| **Web Speech API (TTS)** | Voice narration for AI responses (accessibility) |

---

## 🛡️ Security Architecture

- **Helmet.js** — Sets 14 security HTTP headers (HSTS, X-Content-Type, etc.)
- **express-rate-limit** — 100 requests/15 min per IP to prevent abuse
- **Payload size limit** — `express.json({ limit: '10kb' })` blocks large payload attacks
- **Input validation** — Every API endpoint validates, sanitizes, and rejects malformed input
- **Environment secrets** — API keys exclusively via `process.env`, never in source code
- **`.env.example`** — Documents required secrets without exposing values

---

## ⚡ Performance Architecture

- **Vite build** — Tree-shaking and code splitting for minimal bundle size
- **React lazy loading** — All pages loaded on demand (`React.lazy` + `Suspense`)
- **In-memory TTL cache** — Gemini responses cached for 5 minutes, auto-cleanup every 10 min
- **HTTP cache headers** — Static assets served with `maxAge: 1d, etag: true`
- **Gzip compression** — All responses compressed via `compression` middleware
- **useCallback/useMemo** — Prevents unnecessary React re-renders

---

## ♿ Accessibility (WCAG 2.1 AA)

- **Skip navigation link** — `Skip to main content` for keyboard users
- **ARIA live regions** — Screen reader announcements on route changes and AI responses
- **`role="log"`** — Chat message area properly announced to assistive technology
- **Focus management** — Input refocused after message send; visible focus rings on all elements
- **`focus-visible` outlines** — CSS focus indicators for keyboard navigation
- **Text size control** — UI font scaling: Normal / Large / Extra Large
- **Dark mode** — System preference detection + manual toggle
- **TTS narration** — Every AI response readable aloud via Web Speech API

---

## 🧪 Testing

```bash
cd backend && npm test          # Run 25 tests across 3 suites
cd backend && npm run test:coverage  # With coverage report
```

| Suite | Tests | Coverage |
|---|---|---|
| `api.test.ts` | 18 tests — health, FAQ, timeline, location, voting guide, chat validation | All endpoints |
| `gemini.test.ts` | 3 tests — response, session isolation, error handling | GeminiService |
| `cache.test.ts` | 5 tests — store, retrieve, TTL expiry, size, objects | Cache utility |

**CI/CD**: GitHub Actions runs lint + tests + frontend build on every push to `main`.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + TypeScript + Tailwind CSS + Vite |
| **Backend** | Node.js + Express + TypeScript |
| **AI** | Google Gemini Pro 1.5 (via `@google/generative-ai`) |
| **Database** | Firebase Firestore (chat history) |
| **Auth** | Firebase Authentication (Google Sign-In) |
| **Deployment** | Google Cloud Run (Docker container) |
| **CI/CD** | GitHub Actions |
| **Testing** | Jest + Supertest + ts-jest |
| **Security** | Helmet + express-rate-limit |

---

## 🚀 Local Setup

```bash
# Clone the repo
git clone https://github.com/harshaldhonge2007-sudo/prmtwr1
cd prmtwr1

# Setup environment
cp .env.example backend/.env
# Edit backend/.env and add your GEMINI_API_KEY

# Install all dependencies
cd frontend && npm install
cd ../backend && npm install

# Run tests
cd backend && npm test

# Start dev server
cd backend && npm run dev
```

---

## ☁️ Deploy to Cloud Run

```bash
gcloud run deploy civicsync \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key_here"
```

---

*Built for the Advanced Coding Competition — Election Process Education Initiative.*
