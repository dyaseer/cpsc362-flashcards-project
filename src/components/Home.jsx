import React from 'react';
import DeckPreview from './deckPreview';

function Home() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Homepage</h1>
      <p>Flashcards hosted online; no login, easy access, easily shareable.</p>

      {/*Container for deck preview thing*/}
      <h2>Popular Decks...</h2>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column', 
          gap: '12px'
        }}
      >
        <DeckPreview
          title="CPSC 362"
          desc="Software engineering."
          count="28"
        />
        <DeckPreview
          title="Math 150A"
          desc="Calculus 1."
          count="8"
        />
        <DeckPreview
          title="Math 170A"
          desc="Mathematical structures."
          count="42"
        />
        <DeckPreview
          title="Yay!!!"
          desc="This works now."
          count="0"
        />
        <DeckPreview
          title="Project"
          desc="Feed me dummy data."
          count="0"
        />
      </div>
    </div>
  );
}

export default Home;