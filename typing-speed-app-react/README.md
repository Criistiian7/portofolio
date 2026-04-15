# Typing Speed Test

A small React + TypeScript + Vite app that measures **typing speed (WPM)** and **accuracy** on random quotes, keeps a **local leaderboard** in the browser, and supports **15 / 30 / 60 second** timers with **light and dark** themes.

## Features

- Random quotes from the [DummyJSON](https://dummyjson.com/docs/quotes) API, with a **local fallback list** if the network fails.
- **Net WPM** using the usual convention: correct characters ÷ 5, divided by elapsed time in minutes. **Accuracy** is correct keystrokes ÷ total keystrokes.
- Timer presets **15s, 30s, 60s**; test ends when the timer reaches zero **or** when you type the full quote.
- Optional **key click** sound (off by default) using a bundled `public/typing.wav` file—no external audio URLs.
- **Leaderboard** stored in `localStorage` (name, WPM, timestamp), top 10 scores.
- **Sign out** clears the session name from `localStorage` (scores remain unless you clear site data).

## Tech stack

- React 19, TypeScript, Vite 8
- Vitest + Testing Library for unit tests on pure logic (`src/lib`)

## Run locally

```bash
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

```bash
npm run typecheck
npm run lint
npm run test
```

## Decisions & limitations

- **WPM formula**: net WPM = (correct characters ÷ 5) ÷ (elapsed minutes). Elapsed time is measured from the first keystroke to finish (timer expiry or completing the quote).
- **Quote length**: “Short / Medium / Long” trims the same fetched quote to 5, 10, or all words—length, not a separate word list.
- **Leaderboard**: browser-only; clearing storage or using another device loses entries.
- **Sound**: browsers may block autoplay until there has been user interaction; the toggle stays available.

## Live demo

Add your deployed URL here after you publish the build.
