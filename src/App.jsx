import CreateDeckPage from './components/CreateDeckPage';
import DeckCreatedPage from './components/DeckCreatedPage';
import DeckPage from './components/DeckPage';
import Home from './components/Home';

function App() {
  const createdMatch = window.location.pathname.match(/^\/decks\/([^/]+)\/created\/?$/);
  const deckMatch = window.location.pathname.match(/^\/decks\/([^/]+)\/?$/);
  if (/^\/create\/?$/.test(window.location.pathname)) return <CreateDeckPage />;
  if (createdMatch) return <DeckCreatedPage slug={decodeURIComponent(createdMatch[1])} />;
  return deckMatch ? <DeckPage slug={decodeURIComponent(deckMatch[1])} /> : <Home />;
}

export default App;