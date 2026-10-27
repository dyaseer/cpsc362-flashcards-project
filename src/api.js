async function request(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed (${response.status})`);
  }
  return payload;
}

export function getDecks() {
  return request('/decks');
}

export function getDeck(slug) {
  return request(`/decks/${encodeURIComponent(slug)}`);
}

export function createDeck(deck) {
  return request('/decks', {
    method: 'POST',
    body: JSON.stringify(deck),
  });
}

export function updateDeck(slug, deck, ownerToken) {
  return request(`/decks/${encodeURIComponent(slug)}`, {
    method: 'PUT',
    headers: { 'X-Owner-Token': ownerToken },
    body: JSON.stringify(deck),
  });
}

export function deleteDeck(slug, ownerToken) {
  return request(`/decks/${encodeURIComponent(slug)}`, {
    method: 'DELETE',
    headers: { 'X-Owner-Token': ownerToken },
  });
}
