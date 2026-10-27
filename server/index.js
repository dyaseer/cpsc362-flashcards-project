import 'dotenv/config';
import { createHash, randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cors from 'cors';
import express from 'express';

const app = express();
const port = Number(process.env.API_PORT || 3001);
const dataFile = path.resolve(
  process.env.DECKS_FILE || path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'decks.json'),
);
let writeQueue = Promise.resolve();
const changeWindowMs = 5_000;
const changeLimit = 3;
const changesByIp = new Map();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '100kb' }));

function limitDeckChanges(req, res, next) {
  const now = Date.now();
  const recentChanges = (changesByIp.get(req.ip) || [])
    .filter((timestamp) => timestamp > now - changeWindowMs);

  if (recentChanges.length >= changeLimit) {
    const retryAfterSeconds = Math.ceil((recentChanges[0] + changeWindowMs - now) / 1000);
    res.set('Retry-After', String(retryAfterSeconds));
    res.status(429).json({
      error: 'You can create or edit up to 3 decks in any 5-second period. Please wait and try again.',
    });
    return;
  }

  recentChanges.push(now);
  changesByIp.set(req.ip, recentChanges);
  next();
}

const rateLimitCleanup = setInterval(() => {
  const cutoff = Date.now() - changeWindowMs;
  for (const [ip, timestamps] of changesByIp) {
    const recentChanges = timestamps.filter((timestamp) => timestamp > cutoff);
    if (recentChanges.length === 0) changesByIp.delete(ip);
    else changesByIp.set(ip, recentChanges);
  }
}, changeWindowMs);
rateLimitCleanup.unref();

app.param('slug', (req, res, next, slug) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug)) {
    res.status(404).json({ error: 'Deck not found.' });
    return;
  }
  req.params.slug = slug.toLowerCase();
  next();
});

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

function readDeck(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'A deck object is required.' };
  }
  const { title, description = '', cards } = input;
  if (typeof title !== 'string' || title.trim().length === 0 || title.trim().length > 120) {
    return { error: 'Title must contain 1 to 120 characters.' };
  }
  if (typeof description !== 'string' || description.length > 500) {
    return { error: 'Description must be at most 500 characters.' };
  }
  if (!Array.isArray(cards) || cards.length > 200) {
    return { error: 'Cards must be a list containing at most 200 cards.' };
  }

  const normalizedCards = [];
  for (const [position, card] of cards.entries()) {
    if (!card || typeof card !== 'object' || Array.isArray(card)) {
      return { error: `Card ${position + 1} is invalid.` };
    }
    const term = typeof card.term === 'string' ? card.term.trim() : '';
    const definition = typeof card.definition === 'string' ? card.definition.trim() : '';
    if (!term || term.length > 500 || !definition || definition.length > 2000) {
      return { error: `Card ${position + 1} needs a term (up to 500 characters) and definition (up to 2,000 characters).` };
    }
    normalizedCards.push({ id: randomUUID(), term, definition, position });
  }

  return { title: title.trim(), description: description.trim(), cards: normalizedCards };
}

async function readStore() {
  let contents;
  try {
    contents = await readFile(dataFile, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return { decks: [] };
    throw error;
  }

  let store;
  try {
    store = JSON.parse(contents);
  } catch (error) {
    throw new Error(`Deck data file contains invalid JSON: ${dataFile}`, { cause: error });
  }
  if (!store || !Array.isArray(store.decks)) {
    throw new Error(`Deck data file must contain an object with a decks array: ${dataFile}`);
  }
  return store;
}

async function writeStore(store) {
  const tempFile = `${dataFile}.${process.pid}.${randomUUID()}.tmp`;
  await writeFile(tempFile, `${JSON.stringify(store, null, 2)}\n`, { encoding: 'utf8', flag: 'wx' });
  try {
    await rename(tempFile, dataFile);
  } catch (error) {
    await rm(tempFile, { force: true });
    throw error;
  }
}

function changeStore(callback) {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    const result = await callback(store);
    if (result.changed) await writeStore(store);
    return result;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

async function getStoreSnapshot() {
  await writeQueue;
  return readStore();
}

function publicDeck(deck) {
  const visibleDeck = { ...deck };
  delete visibleDeck.ownerTokenHash;
  delete visibleDeck.cards;
  return { ...visibleDeck, cardCount: deck.cards.length };
}

function sameToken(expectedHash, token) {
  const expected = Buffer.from(expectedHash, 'hex');
  const provided = Buffer.from(hashToken(token), 'hex');
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

app.get('/api/health', async (req, res, next) => {
  try {
    await getStoreSnapshot();
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.get('/api/decks', async (req, res, next) => {
  try {
    const store = await getStoreSnapshot();
    res.json(
      store.decks
        .slice()
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, 100)
        .map(publicDeck),
    );
  } catch (error) {
    next(error);
  }
});

app.post('/api/decks', limitDeckChanges, async (req, res, next) => {
  const deckInput = readDeck(req.body);
  if (deckInput.error) {
    res.status(400).json({ error: deckInput.error });
    return;
  }

  const slug = randomUUID();
  const ownerToken = randomBytes(32).toString('base64url');
  const deck = {
    slug,
    title: deckInput.title,
    description: deckInput.description,
    ownerTokenHash: hashToken(ownerToken),
    createdAt: new Date().toISOString(),
    cards: deckInput.cards,
  };

  try {
    await changeStore((store) => {
      store.decks.push(deck);
      return { changed: true };
    });
    res.status(201).json({ deck: { ...publicDeck(deck), cards: deck.cards }, ownerToken });
  } catch (error) {
    next(error);
  }
});

app.get('/api/decks/:slug', async (req, res, next) => {
  try {
    const store = await getStoreSnapshot();
    const deck = store.decks.find((candidate) => candidate.slug === req.params.slug);
    if (!deck) {
      res.status(404).json({ error: 'Deck not found.' });
      return;
    }
    res.json({ ...publicDeck(deck), cards: deck.cards });
  } catch (error) {
    next(error);
  }
});

app.put('/api/decks/:slug', limitDeckChanges, async (req, res, next) => {
  const deckInput = readDeck(req.body);
  if (deckInput.error) {
    res.status(400).json({ error: deckInput.error });
    return;
  }
  const ownerToken = req.get('X-Owner-Token');
  if (!ownerToken) {
    res.status(401).json({ error: 'Owner access is required.' });
    return;
  }

  try {
    const result = await changeStore((store) => {
      const deck = store.decks.find((candidate) => candidate.slug === req.params.slug);
      if (!deck) return { status: 404, error: 'Deck not found.' };
      if (!sameToken(deck.ownerTokenHash, ownerToken)) {
        return { status: 403, error: 'Owner access is invalid.' };
      }

      deck.title = deckInput.title;
      deck.description = deckInput.description;
      deck.cards = deckInput.cards;
      return { changed: true, deck };
    });
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.json({ ...publicDeck(result.deck), cards: result.deck.cards });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/decks/:slug', async (req, res, next) => {
  const ownerToken = req.get('X-Owner-Token');
  if (!ownerToken) {
    res.status(401).json({ error: 'Owner access is required.' });
    return;
  }

  try {
    const result = await changeStore((store) => {
      const deckIndex = store.decks.findIndex((candidate) => candidate.slug === req.params.slug);
      if (deckIndex < 0) return { status: 404, error: 'Deck not found.' };
      if (!sameToken(store.decks[deckIndex].ownerTokenHash, ownerToken)) {
        return { status: 403, error: 'Owner access is invalid.' };
      }
      store.decks.splice(deckIndex, 1);
      return { changed: true };
    });
    if (result.error) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) {
    next(error);
    return;
  }
  res.status(error.status === 400 ? 400 : 500).json({
    error: error.status === 400 ? 'Invalid request body.' : 'The server could not complete the request.',
  });
});

async function start() {
  await mkdir(path.dirname(dataFile), { recursive: true });
  try {
    await readFile(dataFile, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeStore({ decks: [] });
  }
  await readStore();
  app.listen(port, () => {
    console.log(`Flashcards API listening on port ${port}; storing decks in ${dataFile}`);
  });
}

start().catch((error) => {
  console.error('Unable to start the Flashcards API:', error);
  process.exitCode = 1;
});
