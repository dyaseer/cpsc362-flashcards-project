import { useEffect, useState } from 'react';
import { deleteDeck, getDeck, updateDeck } from '../api';
import DeckForm from './DeckForm';

function DeckPage({ slug }) {
  const [deck, setDeck] = useState(null);
  const [ownerToken] = useState(() => {
    const linkToken = new URLSearchParams(window.location.hash.slice(1)).get('owner');
    return linkToken && /^[A-Za-z0-9_-]{43}$/.test(linkToken)
      ? linkToken
      : localStorage.getItem(`deck-owner:${slug}`);
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [revealedCards, setRevealedCards] = useState(new Set());

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    const linkToken = fragment.get('owner');
    if (!linkToken) return;

    if (/^[A-Za-z0-9_-]{43}$/.test(linkToken)) {
      localStorage.setItem(`deck-owner:${slug}`, linkToken);
    }

    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`,
    );
  }, [slug]);

  useEffect(() => {
    getDeck(slug)
      .then(setDeck)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSave(updatedDeck) {
    setSaving(true);
    setError('');
    try {
      const savedDeck = await updateDeck(slug, updatedDeck, ownerToken);
      setDeck(savedDeck);
      setEditing(false);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this deck and all of its flashcards?')) return;
    setError('');
    try {
      await deleteDeck(slug, ownerToken);
      localStorage.removeItem(`deck-owner:${slug}`);
      window.location.assign('/');
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  function toggleCard(cardId) {
    setRevealedCards((current) => {
      const next = new Set(current);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  if (loading) return <main className="page"><p>Loading deck…</p></main>;
  if (error && !deck) {
    return (
      <main className="page">
        <p className="error-message" role="alert">{error}</p>
        <a href="/">Back to decks</a>
      </main>
    );
  }
  if (!deck) return null;

  return (
    <main className="page">
      <a className="back-link" href="/">← All decks</a>
      {error && <p className="error-message" role="alert">{error}</p>}
      {editing ? (
        <section className="panel">
          <h1>Edit deck</h1>
          <DeckForm
            initialDeck={deck}
            submitLabel="Save changes"
            onSubmit={handleSave}
            saving={saving}
          />
          <button
            className="button button-secondary"
            type="button"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </section>
      ) : (
        <>
          <header className="deck-header">
            <div>
              <h1>{deck.title}</h1>
              <p>{deck.description || 'No description'}</p>
              <p>{deck.cards.length} {deck.cards.length === 1 ? 'card' : 'cards'}</p>
            </div>
            {ownerToken && (
              <div className="form-actions">
                <button className="button" type="button" onClick={() => setEditing(true)}>
                  Edit deck
                </button>
                <button className="button button-danger" type="button" onClick={handleDelete}>
                  Delete deck
                </button>
              </div>
            )}
          </header>
          {!ownerToken && (
            <p className="notice">
              This is a public deck. Editing is available only in the browser that created it.
            </p>
          )}
          <section className="flashcard-list" aria-label="Flashcards">
            {deck.cards.length === 0 && <p>This deck has no cards yet.</p>}
            {deck.cards.map((card) => {
              const isRevealed = revealedCards.has(card.id);
              return (
                <article className="flashcard" key={card.id}>
                  <h2>{card.term}</h2>
                  {isRevealed && <p>{card.definition}</p>}
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => toggleCard(card.id)}
                  >
                    {isRevealed ? 'Hide definition' : 'Show definition'}
                  </button>
                </article>
              );
            })}
          </section>
        </>
      )}
    </main>
  );
}

export default DeckPage;
