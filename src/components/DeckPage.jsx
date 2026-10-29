import { useEffect, useState } from 'react';
import { deleteDeck, getDeck, updateDeck } from '../api';
import DeckForm from './DeckForm';

function shuffleIds(ids) {
  const shuffled = [...ids];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
  const [studying, setStudying] = useState(false);
  const [studyOrder, setStudyOrder] = useState([]);
  const [studyIndex, setStudyIndex] = useState(0);
  const [studyRevealed, setStudyRevealed] = useState(false);

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
      setStudying(false);
      setRevealedCards(new Set());
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

  function startStudy() {
    if (!deck?.cards.length) return;
    setStudyOrder(deck.cards.map((card) => card.id));
    setStudyIndex(0);
    setStudyRevealed(false);
    setStudying(true);
  }

  function shuffleStudy() {
    setStudyOrder((current) => shuffleIds(current));
    setStudyIndex(0);
    setStudyRevealed(false);
  }

  function moveStudy(direction) {
    setStudyIndex((current) => Math.max(0, Math.min(current + direction, studyOrder.length - 1)));
    setStudyRevealed(false);
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

  const currentStudyCard = studying
    ? deck.cards.find((card) => card.id === studyOrder[studyIndex])
    : null;

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
          {deck.cards.length > 0 && (
            <div className="form-actions study-toolbar">
              <button
                className="button"
                type="button"
                onClick={() => studying ? setStudying(false) : startStudy()}
              >
                {studying ? 'Back to all cards' : 'Start Study Mode'}
              </button>
            </div>
          )}
          {studying && currentStudyCard ? (
            <section className="panel study-panel" aria-label="Study mode">
              <div className="study-topbar">
                <strong>Card {studyIndex + 1} of {studyOrder.length}</strong>
                <button className="button button-secondary" type="button" onClick={shuffleStudy}>
                  Shuffle cards
                </button>
              </div>
              <progress
                className="study-progress"
                value={studyIndex + 1}
                max={studyOrder.length}
                aria-label="Study progress"
              />
              <button
                type="button"
                className="study-card"
                onClick={() => setStudyRevealed((value) => !value)}
                aria-label={studyRevealed ? 'Show question' : 'Reveal answer'}
              >
                <span className="study-card-label">{studyRevealed ? 'ANSWER' : 'QUESTION'}</span>
                <span className="study-card-content">
                  {studyRevealed ? currentStudyCard.definition : currentStudyCard.term}
                </span>
                <span className="study-card-hint">Click to flip</span>
              </button>
              <div className="study-navigation">
                <button
                  className="button button-secondary"
                  type="button"
                  disabled={studyIndex === 0}
                  onClick={() => moveStudy(-1)}
                >
                  Previous
                </button>
                {studyIndex === studyOrder.length - 1 ? (
                  <button className="button" type="button" onClick={startStudy}>Study again</button>
                ) : (
                  <button className="button" type="button" onClick={() => moveStudy(1)}>Next</button>
                )}
              </div>
            </section>
          ) : (
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
          )}
        </>
      )}
    </main>
  );
}

export default DeckPage;
