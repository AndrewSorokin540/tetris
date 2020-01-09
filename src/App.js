import React from 'react';
import './App.css';

import Racing from './components/game-racing'
import Snake from './components/game-snake'

import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div className="games-container">
        <Router>
          <div className='router-links'>
            <Link to="/snake">Змейка</Link>
            <Link to="/racing">Гонки</Link>
          </div>
          <div className="game-area">
            <Route path='/' exact render={() => <h2>Выберите игру</h2>}/>
            <Route
              path='/racing'
              render={() => <Racing canvasWidth={280} canvasHeight={280} />}
            />
            <Route
              path='/snake'
              render={() => <Snake canvasWidth={280} canvasHeight={280} />}
            />
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
