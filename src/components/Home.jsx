import { useEffect, useState } from 'react';
import { getDecks } from '../api';
import DeckPreview from './deckPreview';

function Home() {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDecks()
      .then(setDecks)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page">
      <header className="page-header">
        <h1>Flashcards</h1>
        <p>Create, study, and share flashcard decks.</p>
        <a className="button create-deck-link" href="/create">Create a deck</a>
      </header>

      <section className="deck-list" aria-labelledby="decks-heading">
        <h2 id="decks-heading">Public decks</h2>
        {error && <p className="error-message" role="alert">{error}</p>}
        {loading && <p>Loading decks…</p>}
        {!loading && !error && decks.length === 0 && <p>No decks yet. Create one above.</p>}
        {decks.map((deck) => (
          <DeckPreview key={deck.slug} deck={deck} />
        ))}
      </section>
    </main>
  );
}

export default Home;
