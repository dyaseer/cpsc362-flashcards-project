import { useState } from 'react';
import { createDeck } from '../api';
import DeckForm from './DeckForm';

function CreateDeckPage() {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleCreate(deck) {
    setSaving(true);
    setError('');
    try {
      const { deck: createdDeck, ownerToken } = await createDeck(deck);
      localStorage.setItem(`deck-owner:${createdDeck.slug}`, ownerToken);
      window.location.assign(`/decks/${createdDeck.slug}/created`);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="page">
      <a className="back-link" href="/">← Public decks</a>
      <header className="page-header">
        <h1>Create a deck</h1>
        <p>Add a title, description, and flashcards to share with others.</p>
      </header>

      <section className="panel" aria-labelledby="create-heading">
        <h2 id="create-heading">New deck</h2>
        {error && <p className="error-message" role="alert">{error}</p>}
        <DeckForm submitLabel="Create deck" onSubmit={handleCreate} saving={saving} />
      </section>
    </main>
  );
}

export default CreateDeckPage;
