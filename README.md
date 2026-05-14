# Vision 10Q Trainer

Mobile-first React + Vite web app to train Vision Packaging outside sales reps on the **10 core discovery questions**.

## What this app includes
- **Learn Mode** flashcards for each question (purpose, casual version, follow-ups, mistake, coaching note)
- **Drill Mode** timed recall + purpose matching quiz with score saved in localStorage
- **Conversation Mode** natural flow generator by customer type
- **Roleplay Mode** objections and best-next-question coaching
- **Field Mode** mobile cheat sheet with opening line, conversational path, and Salesforce note template
- **Manager Scorecard** local scoring + CSV export

## Tech
- React 18
- Vite 5
- Static frontend only (no backend)

## Local development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages (`sactowilly/vsn-10Qs`)
1. Ensure the repository remote is set:
   ```bash
   git remote add origin https://github.com/sactowilly/vsn-10Qs.git
   # or update existing:
   git remote set-url origin https://github.com/sactowilly/vsn-10Qs.git
   ```
2. Push branch:
   ```bash
   git push -u origin work
   ```
3. Build site:
   ```bash
   npm run build
   ```
4. Publish `dist/` through GitHub Pages (Settings → Pages), or a GitHub Actions Pages workflow.

> `vite.config.js` uses `base: './'` so the app works on Pages static hosting paths.

## Structured data
All 10 questions and training metadata are in:
- `src/data/questions.json`

## Suggested screenshots / usage notes
Capture these for onboarding docs:
1. Learn Mode card (purpose + follow-ups)
2. Drill Mode timer + score
3. Conversation Mode customer type flow
4. Roleplay feedback
5. Manager scorecard + CSV export
