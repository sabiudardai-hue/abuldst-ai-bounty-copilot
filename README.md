# Abuldst AI Bounty Copilot

An AI-powered workspace that helps Web3 creators understand bounty, ambassador, grant and job opportunities.

## Current MVP

- Paste an opportunity description.
- Analyze it with Google Gemini.
- Extract requirements, missing information, suggested actions and a submission checklist.
- Validate structured AI output before displaying it.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- Google Gemini via `@google/genai`
- Zod validation

## Run locally or in GitHub Codespaces

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and add your Gemini API key:

   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the forwarded port 3000 in Codespaces.

## Gemini API key

Create a key in Google AI Studio: https://aistudio.google.com/app/apikey

Keep `GEMINI_API_KEY` server-side. Never prefix it with `NEXT_PUBLIC_`, commit it, or paste it into public issues.

## Planned next milestones

- Supabase authentication and persistence
- PayPal Sandbox Orders API and verified webhook flow
- Premium package entitlement checks
- Tests, deployment and demo recording

## Security notes

- Never paste wallet seed phrases, private keys, passwords or other secrets into the analyzer.
- AI output can be wrong; verify campaign facts against the original source.
- Payment status and premium access must be verified server-side.
