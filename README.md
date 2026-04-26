# ElecGuide - Election Process Education Assistant

![CI](https://github.com/harshaldhonge2007-sudo/prmtwr1/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

An AI-powered web app to educate Indian citizens on the election process.

## Live Demo
[https://election-assistant-844332838952.us-central1.run.app](https://election-assistant-844332838952.us-central1.run.app)

## Features
- **AI Chat (Google Gemini)** — Ask any election question and get contextual, verified answers.
- **Google Sign-In (Firebase Auth)** — Secure authentication with personalized profiles.
- **Cloud History (Firestore)** — Your chat history is saved securely to the cloud.
- **Smart Tracking (Analytics)** — Tracking user engagement and page views via Google Analytics 4.
- **WCAG AA Accessible** — Keyboard navigation, high contrast, and screen-reader optimized.
- **Performance Caching** — Backend response caching for near-instant responses.

## Tech Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **AI**: Google Gemini Pro 1.5
- **Google Cloud**: Firebase (Auth, Firestore, Analytics) + Cloud Run
- **CI/CD**: GitHub Actions for automated testing and deployment.

## Setup
```bash
git clone https://github.com/harshaldhonge2007-sudo/prmtwr1
cd prmtwr1
npm install
npm run dev
```

## Testing & Quality
```bash
npm test          # Run Jest automated tests
npm run lint      # Check code quality with ESLint
```

Built for the Advanced Coding Competition.


---
*Last updated on Sun Apr 26 18:41:40 IST 2026*
