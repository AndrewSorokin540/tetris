import React from 'react';
import './App.css';

import './components/game.css'
import Racing from './components/game-racing'
import Snake from './components/game-snake'

function App() {
  return (
    <div className="App">
      <div className="games-container">
        <div className="games-area">
          {/* <Racing canvasWidth={280} canvasHeight={280} cellSize={10} /> */}
          <Snake canvasWidth={280} canvasHeight={280} />
        </div>
      </div>
    </div>
  );
}

export default App;
