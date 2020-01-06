import React from 'react';
import './App.css';

import './components/game.css'
import Racing from './components/game-racing'

function App() {
  return (
    <div className="App">
      <div className="games-container">
        <div className="info-area">
          info
        </div>
        <div className="games-area">
          <Racing canvasWidth={300} canvasHeight={300} cellSize={10} />
        </div>
      </div>
    </div>
  );
}

export default App;
