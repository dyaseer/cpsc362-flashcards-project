function DeckCreatedPage({ slug }) {
  const ownerToken = localStorage.getItem(`deck-owner:${slug}`);
  const publicLink = `${window.location.origin}/decks/${slug}`;
  const ownerLink = ownerToken
    ? `${publicLink}#owner=${encodeURIComponent(ownerToken)}`
    : null;

  return (
    <main className="page">
      <section className="panel deck-created" aria-labelledby="created-heading">
        <h1 id="created-heading">Deck created</h1>
        <p>Public link (safe to share):</p>
        <p className="share-link">
          <a href={publicLink}>{publicLink}</a>
        </p>
        {ownerLink ? (
          <>
            <p>Owner link (grants full edit and delete access; share only with trusted people):</p>
            <p className="share-link">
              <a href={ownerLink}>{ownerLink}</a>
            </p>
            <p>Your owner access is also saved in this browser. Keep the owner link private.</p>
          </>
        ) : (
          <p className="notice" role="status">
            The owner link is unavailable in this browser. Only the public link is shown.
          </p>
        )}
      </section>
    </main>
  );
}

export default DeckCreatedPage;
