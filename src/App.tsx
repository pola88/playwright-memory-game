import React from 'react';
import { Game } from './components/Game'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <title>Playwright Memory Game</title>
        <link rel="icon" href="/favicon.ico" />
      </header>
      <main>
        <Game />
      </main>
      
    </div>
  );
}

export default App;
