import { useState, useEffect, useRef } from 'react';

const agg_stats = [
  { outcome: '1', prob: 10, name: 'one' },
  { outcome: '2', prob: 10, name: 'two' },
  { outcome: '3', prob: 5, name: 'three' },
  { outcome: '4', prob: 10, name: 'four' },
  { outcome: 'Wicket', prob: 40, name: 'wicket' },
  { outcome: '6', prob: 15, name: 'six' },
  { outcome: '0', prob: 10, name: 'zero' }
];

const def_stats = [
  { outcome: '1', prob: 20, name: 'one' },
  { outcome: '2', prob: 15, name: 'two' },
  { outcome: '3', prob: 10, name: 'three' },
  { outcome: '4', prob: 10, name: 'four' },
  { outcome: 'Wicket', prob: 20, name: 'wicket' },
  { outcome: '6', prob: 5, name: 'six' },
  { outcome: '0', prob: 20, name: 'zero' }
];

function getShotOutcome(sliderPos, curr_stats) {
  let outcome = null;

  if (sliderPos <= curr_stats[0].prob)
    outcome = curr_stats[0].outcome;
  else if (sliderPos <= curr_stats[0].prob + curr_stats[1].prob)
    outcome = curr_stats[1].outcome;
  else if (sliderPos <= curr_stats[0].prob + curr_stats[1].prob + curr_stats[2].prob)
    outcome = curr_stats[2].outcome;
  else if (sliderPos <= curr_stats[0].prob + curr_stats[1].prob + curr_stats[2].prob + curr_stats[3].prob)
    outcome = curr_stats[3].outcome;
  else if (sliderPos <= curr_stats[0].prob + curr_stats[1].prob + curr_stats[2].prob + curr_stats[3].prob + curr_stats[4].prob)
    outcome = curr_stats[4].outcome;
  else if (sliderPos <= curr_stats[0].prob + curr_stats[1].prob + curr_stats[2].prob + curr_stats[3].prob + curr_stats[4].prob + curr_stats[5].prob)
    outcome = curr_stats[5].outcome;
  else
    outcome = curr_stats[6].outcome;

  return outcome;
}

function App() {
  // VARIABLES
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsDone, setBallsDone] = useState(0);
  const [sliderPos, setSliderPosition] = useState(0);
  const [battingStyle, setBattingStyle] = useState('Aggressive');
  const [gameOver, setGameOver] = useState(false);
  const [ballCoords, setBallCoords] = useState({ top: 48, right: -1 }); 
  const [batterSprite, setBatterSprite] = useState('idle.png');

  const maxWickets = 2;
  const curr_stats = battingStyle === 'Aggressive' ? agg_stats : def_stats;
  const direction = useRef(1);    // 1 for right, -1 for left
  const shot_playing = useRef(false);

  /* Slider Movement Loop */
  useEffect(() => {
    const sliderLoop = setInterval(() => {
      setSliderPosition((prevPos) => {
        let newPos;
        
        if (prevPos >= 98)
          direction.current = -1;
        if (prevPos <= 0)
          direction.current = 1;
        
        if (shot_playing.current)
          newPos = prevPos;
        else
          newPos = prevPos + direction.current;

        return newPos;
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

  const playShot = () => {
    if (gameOver || shot_playing.current) return;
    
    // Stop slider and animations start
    shot_playing.current = true;

    // Variables for ball animation
    const g = 9.81;
    const v0 = 300;
    const angle = 0;
    const angleRad = angle * (Math.PI / 180);
    const topOffset = 50;
    let t = 0;
    let x = 0;
    let y = topOffset;
    let direction = 1;

    console.log("Ball is pitching...");
    setBallCoords({ top: y, right: x }); // Example of moving the ball
    const pitchingLoop = setInterval(() => {
      x = (v0 * Math.cos(angleRad) * t) * direction;
      y = (topOffset - (v0 * Math.sin(angleRad) * t - 0.5 * g * t * t)) * direction;
      t += 0.1;
      console.log(x, y);

      setBallCoords((prevCoords) => {
        if (prevCoords.right >= 900) {
          clearInterval(pitchingLoop);
          return prevCoords;
        }
        return { top: y, right: x };
      });
    }, 20);

    setTimeout(() => {
      console.log("Batter swings!");
      // Change the batter image state to trigger the swing animation
      setBatterSprite('swing.png'); 

      // --- PHASE 3: THE HIT & TRAJECTORY ---
      setTimeout(() => {
         console.log("Ball goes flying!");
         // This is where you will use your atan2 angle math to send the ball to the boundary!
         setBallCoords({ top: 10, right: 10 }); // Example of the ball flying towards the boundary

         // --- PHASE 4: RESET FOR NEXT BALL ---
         setTimeout(() => {
           // Update score, balls bowled, and reset the pitch
           shot_playing.current = false;
           setBatterSprite('idle.png');
           setBallCoords({ top: topOffset, right: 0 });
         }, 1000); // Reset after 1 second of flying

      }, 500); // 200ms after the swing starts, the bat hits the ball

    }, 800); // 800ms after pitch starts

    const outcome = getShotOutcome(sliderPos, curr_stats);
    if (outcome === 'Wicket') {
      setWickets(wickets + 1);
      if (wickets + 1 >= maxWickets) {
        setGameOver(true);
      }
    }
    else {
      const addRuns = Number(outcome);
      setRuns(runs + addRuns);
    }
    setBallsDone(ballsDone + 1);
  };

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
        {/* Play Shot Button */}
        <button className="playShot-btn" onClick={playShot}>
          <img src="/assets/playShot.png" alt="Play Shot" style={{ width: '100%', height: '100%' }}/>
        </button>

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
        <div id="ball" style={{ top: `${ballCoords.top}%`, right: `${ballCoords.right}px` }}>
          <img src="/assets/ball2.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
        <div id="batter">
          <img src="/assets/idle.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
        <div id="wicket">
          <img src={`/assets/${batterSprite}`} alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
        </div>
      </div>
    </div>
  );
}

export default App