import { useState, useEffect, useRef } from 'react';

const agg_stats = [
  { outcome: 'Wicket', prob: 40, name: 'wicket' },
  { outcome: '0', prob: 10, name: 'zero' },
  { outcome: '1', prob: 10, name: 'one' },
  { outcome: '2', prob: 10, name: 'two' },
  { outcome: '3', prob: 5, name: 'three' },
  { outcome: '4', prob: 10, name: 'four' },
  { outcome: '6', prob: 15, name: 'six' }
];

const def_stats = [
  { outcome: 'Wicket', prob: 20, name: 'wicket' },
  { outcome: '0', prob: 20, name: 'zero' },
  { outcome: '1', prob: 20, name: 'one' },
  { outcome: '2', prob: 15, name: 'two' },
  { outcome: '3', prob: 10, name: 'three' },
  { outcome: '4', prob: 10, name: 'four' },
  { outcome: '6', prob: 5, name: 'six' }
];


function App() {
  // VARIABLES
  const [runs, setRuns] = useState(60);
  const [wickets, setWickets] = useState(0);
  const [ballsDone, setBallsDone] = useState(0);
  const [sliderPos, setSliderPosition] = useState(0);
  const [battingStyle, setBattingStyle] = useState('Aggressive');
  const [gameOver, setGameOver] = useState(false);

  const curr_stats = battingStyle === 'Aggressive' ? agg_stats : def_stats;
  const direction = useRef(1);    // 1 for right, -1 for left

  /* Slider Movement Loop */
  useEffect(() => {
    const sliderLoop = setInterval(() => {
      setSliderPosition((prevPos) => {
        if (prevPos >= 98)
          direction.current = -1;
        if (prevPos <= 0)
          direction.current = 1;

        return prevPos + direction.current;
      });
    }, 15);
    return () => clearInterval(sliderLoop);
  }, []);

  const restartGame = () => {
    setRuns(0);
    setWickets(0);
    setBallsDone(0);
    setSliderPosition(0);
    direction.current = 1;
    //setBattingStyle('Aggressive');
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
          <button style={{ color: 'red' }} onClick={() => setBattingStyle('Aggressive')}>
            Aggressive
          </button>
          <button style={{ color: 'gold' }} onClick={() => setBattingStyle('Defensive')}>
            Defensive
          </button>
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
        {gameOver.toString()}
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
          {curr_stats.map((stat, index) => (
            <div key={index} className={`segment ${stat.name}`} style={{width: `${stat.prob}%`}}>
              {stat.outcome}
            </div>
          ))}
          
          <div className="slider" id="moving-slider" style={{ left: `${sliderPos}%` }}></div>
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