function DeckPreview({ deck }) {
  return (
    <a className="deck-preview" href={`/decks/${encodeURIComponent(deck.slug)}`}>
      <div>
        <h3>{deck.title}</h3>
        <p>{deck.description || 'No description'}</p>
      </div>
      <span>{deck.cardCount} {deck.cardCount === 1 ? 'card' : 'cards'}</span>
    </a>
  );
}

export default DeckPreview;