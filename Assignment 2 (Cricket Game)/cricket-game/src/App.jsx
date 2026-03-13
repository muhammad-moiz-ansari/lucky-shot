import { useState } from 'react';

function App() {
  // VARIABLES
  /*
  */
  const [runs, setRuns] = useState(60);
  const [wickets, setWickets] = useState(0);
  const [ballsDone, setBallsDone] = useState(0);
  const [power, setPower] = useState(0);
  const [battingStyle, setBattingStyle] = useState('Defensive');
  const [gameOver, setGameOver] = useState(false);

  // Dummy functions to stop React from crashing when you click buttons
  const restartGame = () => {
    /*
    */
    setRuns(0);
    setWickets(0);
    setBallsDone(0);
    setPower(0);
    setBattingStyle('Defensive');
    setGameOver(false);
  };
  //const exitGame = () => console.log("Exit clicked");

  return (
    <div id="game-container">
      {/* Navbar */}
      <div className="navbar">
        <button className="restart-btn" onClick={restartGame}>
          <img src="/assets/restart_btn.png" alt="Restart" style={{ float: 'left' }} />
        </button>
        <div className="option-btns">
          <button style={{ color: 'red' }}>Aggressive</button>
          <button style={{ color: 'gold' }}>Defensive</button>
        </div>
      </div>
      
      {/* Gameover Menu */}
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
      <div style={{display: 'none'}}>
        {power}{battingStyle}{gameOver.toString()}
      </div>
      
      <div id="gameArea">
        {/* Score Board */}
        <div id="scoreBoard">
          {/* Left Side: The Blue Runs Box */}
          <div className="board-left">
              <span className="runs-text">
                  {runs}
              </span>
          </div>
          {/* Right Side: Balls and Wickets Stats */}
          <div className="board-right">
              {/* Balls Left Row */}
              <div className="stat-row">
                  <div className="ball-icon"></div>
                  <span className="stat-text">
                      {12 - ballsDone}
                  </span>
              </div>
              
              {/* Wickets Row */}
              <div className="stat-row">
                  <div className="wicket-icon"></div>
                  <span className="stat-text">
                      {wickets}
                  </span>
              </div>
          </div>
        </div>

        {/* Power Bar */}
        <div className="powerBar-box">
          <div className="segment wicket" style={{ width: '40%' }}>Wicket</div>
          <div className="segment zero" style={{ width: '10%' }}>0</div>
          <div className="segment one" style={{ width: '10%' }}>1</div>
          <div className="segment two" style={{ width: '10%' }}>2</div>
          <div className="segment three" style={{ width: '5%' }}>3</div>
          <div className="segment four" style={{ width: '10%' }}>4</div>
          <div className="segment six" style={{ width: '15%' }}>6</div>
          
          <div className="slider" id="moving-slider"></div>
        </div>
        
        {/* Field */}
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