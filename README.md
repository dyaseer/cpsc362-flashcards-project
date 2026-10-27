# CPSC 362 Flashcards

Flashcards is a React/Vite application with an Express API that stores decks in a local JSON file. Decks and cards are public to read. A random owner capability is generated when a deck is created; it is returned once and required to edit or delete that deck. The public deck link is safe to share; the separate owner link grants full edit and delete access, so share it only with trusted people.

## Requirements

- Node.js 20.19+ or 22.12+

## Run locally

1. Copy `.env.example` to `.env` if you want to configure the API port, allowed browser origin, or JSON file location. Defaults work for local development.
2. Install dependencies:

   ```powershell
   npm install
   ```

3. Start the API in one terminal:

   ```powershell
   npm run dev:api
   ```

   The API creates `data/decks.json` the first time it starts.

4. Start the Vite app in another terminal:

   ```powershell
   npm run dev
   ```

Open the URL Vite prints (usually `http://localhost:5173`). Vite proxies `/api` requests to `http://localhost:3001`.
After successfully creating a deck, the app opens a separate confirmation page with its public and owner links.

## Configuration

| Variable | Default | Description |
| --- | --- | --- |
| `API_PORT` | `3001` | Port used by the API |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Browser origin allowed by the API's CORS policy |
| `DECKS_FILE` | `data/decks.json` in the project root | Path to the JSON data file; relative paths resolve from the project root |

The JSON file is created automatically and should be kept out of version control and backed up if its contents matter. This storage approach is intended for local, single-process use: it is not designed for multiple API processes, heavy concurrent use, or hosting with an ephemeral filesystem. Do not run multiple API instances against the same file.

## API

- `GET /api/health` — data-file health check
- `GET /api/decks` — up to 100 newest public decks
- `POST /api/decks` — create a deck and its cards; returns the deck and one-time `ownerToken`
- `GET /api/decks/:slug` — get a public deck and its cards
- `PUT /api/decks/:slug` — replace a deck and its cards; requires `X-Owner-Token`
- `DELETE /api/decks/:slug` — delete a deck and its cards; requires `X-Owner-Token`

Decks may have up to 200 cards. Card order is preserved. The owner token is stored hashed in the JSON file and is never included in public deck responses. The owner link carries the token in the URL fragment (after `#`), which is not sent to the API in HTTP requests. Opening a valid owner link saves edit access in that browser and removes the token from the address bar. Create and edit attempts share a per-client-IP rolling rate limit of three requests per five seconds; excess requests return `429` with a `Retry-After` header. The limit is held in API memory and resets when the API restarts.

## Checks

```powershell
npm run lint
npm run build
```
