import { useState } from 'react';

const emptyCard = () => ({ term: '', definition: '' });

function DeckForm({ initialDeck, submitLabel, onSubmit, saving }) {
  const [title, setTitle] = useState(initialDeck?.title || '');
  const [description, setDescription] = useState(initialDeck?.description || '');
  const [cards, setCards] = useState(
    initialDeck?.cards?.length ? initialDeck.cards : [emptyCard()],
  );

  function updateCard(index, field, value) {
    setCards((current) =>
      current.map((card, cardIndex) =>
        cardIndex === index ? { ...card, [field]: value } : card,
      ),
    );
  }

  async function submit(event) {
    event.preventDefault();
    const saved = await onSubmit({
      title,
      description,
      cards: cards.map(({ term, definition }) => ({ term, definition })),
    });
    if (saved) {
      setTitle('');
      setDescription('');
      setCards([emptyCard()]);
    }
  }

  return (
    <form className="deck-form" onSubmit={submit}>
      <label>
        Deck title
        <input
          required
          maxLength="120"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label>
        Description
        <textarea
          maxLength="500"
          rows="2"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      <h3>Flashcards</h3>
      {cards.map((card, index) => (
        <fieldset className="card-fields" key={card.id || index}>
          <legend>Card {index + 1}</legend>
          <label>
            Term
            <input
              required
              maxLength="500"
              value={card.term}
              onChange={(event) => updateCard(index, 'term', event.target.value)}
            />
          </label>
          <label>
            Definition
            <textarea
              required
              maxLength="2000"
              rows="3"
              value={card.definition}
              onChange={(event) =>
                updateCard(index, 'definition', event.target.value)
              }
            />
          </label>
          <button
            className="button button-secondary"
            type="button"
            disabled={cards.length === 1}
            onClick={() =>
              setCards((current) => current.filter((_, cardIndex) => cardIndex !== index))
            }
          >
            Remove card
          </button>
        </fieldset>
      ))}
      <div className="form-actions">
        <button
          className="button button-secondary"
          type="button"
          disabled={cards.length >= 200}
          onClick={() => setCards((current) => [...current, emptyCard()])}
        >
          Add card
        </button>
        <button className="button" type="submit" disabled={saving}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default DeckForm;
