//import { useState } from 'react'

function App() {
  // Dummy functions to stop React from crashing when you click buttons
  // We will build the actual logic for these later!
  const restartGame = () => console.log("Restart clicked");
  //const exitGame = () => console.log("Exit clicked");

  return (
    <div id="game-container">
      <div className="navbar">
        <button className="restart-btn" onClick={restartGame}>
          <img src="/assets/restart_btn.png" alt="Restart" style={{ float: 'left' }} />
        </button>
        <div className="option-btns">
          <button style={{ color: 'red' }}>Aggressive</button>
          <button style={{ color: 'gold' }}>Defensive</button>
        </div>
      </div>
      
      {/* 
        <div id="gameOverMenu">
          <img id="menu-bg" src="/assets/menu-bg.png" alt="" />
          <h1>Game Over!</h1>
          <p id="endScore">Score: </p>
          <button onClick={restartGame}>Restart</button>
          <button onClick={() => window.location.href='index.html'}>Main Menu</button>
          <button onClick={exitGame}>Exit</button>
        </div>
      */}
      
      <div id="gameArea">
        <p id="incScore"></p>
        <div id="powerBorder">
          <div id="powerBar"></div>
        </div>
        
        <div id="pitch">
          <img src="/assets/pitch.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
        <div id="ball">
          <img src="/assets/ball2.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
        <div id="batter">
          <img src="/assets/idle.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
        <div id="wicket">
          <img src="/assets/wicket.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
      </div>
    </div>
  );
}

export default App
