# Typing Test Pro

A React + TypeScript typing app focused on consistent metrics and practical UX:
track corrected WPM, raw WPM, and accuracy in timed sessions with local score history.

## Features

- Session durations: `15s`, `30s`, `60s`
- Quote length presets: short, medium, long
- Live stats: WPM, raw WPM, and accuracy
- Auto-finish on timeout or when the full quote is completed
- Local leaderboard with player name, score, and date
- Persistent theme (`light`/`dark`) and signed-in user
- Quote fetch from DummyJSON with local fallback quotes
- Optional local typing sound (`/public/typing.wav`)

## Tech Stack

- React 19 + TypeScript
- Vite 8
- ESLint 9

## Run Locally

```bash
npm install
npm run dev
```

Useful scripts:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Metric Formula

This app computes:

- `correctChars`: typed characters that match the quote at the same index
- `accuracy`: `correctChars / totalTypedChars * 100`
- `wpm`: `(correctChars / 5) / elapsedMinutes`
- `rawWpm`: `(totalTypedChars / 5) / elapsedMinutes`

`elapsedMinutes` is measured from the first typed character until finish.

## Known Limitations

- Leaderboard is local-only (`localStorage`) and device-specific
- Quote API is external; fallback quotes are used on fetch failure
- No backend auth (player name is stored locally)
