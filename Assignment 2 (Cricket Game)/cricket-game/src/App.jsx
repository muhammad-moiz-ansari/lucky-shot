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

function animateBatterShot(setBatterSprite) {
  //let shotAnimation = true;
  let i = 1;

  const shotLoop = setInterval(() => {
    setBatterSprite("shot_sprites/" + i + ".png");
    i++;
    if (i > 8) {
      clearInterval(shotLoop);
    }
  }, 18);
}

function getShotVelocity(outcome) {
  if (outcome == '1') {
    return { vx: 250, vy: 10 };
  } 
  else if (outcome == '2') {
    return { vx: 300, vy: 15 };
  } 
  else if (outcome == '3') {
    return { vx: 350, vy: 20 };
  } 
  else if (outcome == '4') {
    return { vx: 400, vy: 30 };
  } 
  else if (outcome == '6') {
    return { vx: 500, vy: 50 };
  } 
  else if (outcome == 'Wicket') {
    return { vx: 200, vy: 5 };
  } 
  else { // '0'
    return { vx: 200, vy: 5 };
  }
}

// Knock the wicket down
function animateWicket(wicketRef) {
  if (wicketRef.current) {
    // Smooth physics transition
    wicketRef.current.style.transition = "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    
    // Rotate it backwards and push it to the left (flying stumps!)
    // We keep translateY(-50%) because we used that in your CSS to center it
    wicketRef.current.style.transform = "translateY(-80%) rotate(-75deg) translateX(-50px)";
  }
}

// Stand the wicket back up for the next ball
function resetWicket(wicketRef) {
  if (wicketRef.current) {
    wicketRef.current.style.transition = "none";
    // Reset back to the default CSS
    wicketRef.current.style.transform = "translateY(-50%)"; 
  }
}

// Update Game State
function updateGameState(outcome, runs, setRuns, wickets, setWickets, ballsDone, setBallsDone, setGameOver, maxWickets, gameAreaRef, navBarRef) {
  if (outcome === 'Wicket') {
    setWickets(wickets + 1);
    if (wickets + 1 >= maxWickets) {
      triggerGameOver(setGameOver, gameAreaRef, navBarRef);
    }
  }
  else {
    const addRuns = Number(outcome);
    setRuns(runs + addRuns);
  }
  setBallsDone(ballsDone + 1);
  if (ballsDone + 1 >= 12) {
    triggerGameOver(setGameOver, gameAreaRef, navBarRef);
  }
}

// Game Over
function triggerGameOver(setGameOver, gameAreaRef, navBarRef) {
  setGameOver(true);
  if (gameAreaRef.current) {
    gameAreaRef.current.classList.add("dimmed");
  }
  if (navBarRef.current) {
    navBarRef.current.classList.add("dimmed");
  }
}

function resetGameVisuals(gameAreaRef, navBarRef) {
  if (gameAreaRef.current) {
    gameAreaRef.current.classList.remove("dimmed");
  }
  if (navBarRef.current) {
    navBarRef.current.classList.remove("dimmed");
  }
}


function App() {
  // VARIABLES
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [ballsDone, setBallsDone] = useState(0);
  const [sliderPos, setSliderPosition] = useState(0);
  const [battingStyle, setBattingStyle] = useState('Aggressive');
  const [gameOver, setGameOver] = useState(false);
  const [isMainMenu, setIsMainMenu] = useState(true);
  const [ballCoords, setBallCoords] = useState({ top: 48, right: -100 }); 
  const [batterSprite, setBatterSprite] = useState('idle.png');

  const maxWickets = 2;
  const curr_stats = battingStyle === 'Aggressive' ? agg_stats : def_stats;
  const direction = useRef(1);    // 1 for right, -1 for left
  const shot_playing = useRef(false);

  // For batter's coordinates during the shot for trajectory calculations
  const gameAreaRef = useRef(null);
  const navBarRef = useRef(null);
  const batterRef = useRef(null);
  const wicketRef = useRef(null);

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
    setIsMainMenu(false);
    resetGameVisuals(gameAreaRef, navBarRef);
  };

  const goToMenu = () => {
    setIsMainMenu(true);
    setGameOver(false);
    resetGameVisuals(gameAreaRef, navBarRef);
  };

  const exitGame = () => {
    window.close();
  };

  const playShot = () => {
    if (gameOver || shot_playing.current) return;
    
    // Stop slider and animations start
    shot_playing.current = true;

    // Grabbing batter's coordinates for trajectory calculations
    const gameBox = gameAreaRef.current.getBoundingClientRect();
    const batterBox = batterRef.current.getBoundingClientRect();
    
    // Batter's distance from the right side!
    const batterDistanceFromRight = gameBox.width - (batterBox.left - gameBox.left + batterBox.width * 0.8);

    // Wicket's distance from the right side!
    const wicketDistanceFromRight = gameBox.width - (wicketRef.current.getBoundingClientRect().left - gameBox.left + wicketRef.current.getBoundingClientRect().width);

    const outcome = getShotOutcome(sliderPos, curr_stats);

    // Variable for ball miss or hit
    let miss = false;
    let waitDuration = 1000; // Default wait duration for runs
    if (outcome === 'Wicket')
      miss = true;
    else if (outcome === '0')
      waitDuration = 1400; // Longer wait bcz ball is slow
    else if (outcome === '1')
      waitDuration = 1100;
    

    // Variables for ball animation
    const groundLvl = 90;
    const bounce = 1.6;
    const friction = 0.99;
    const g = 9.81;
    const speedMultiplier = 0.26; 
    const v0 = gameBox.width * speedMultiplier;
    const topOffset = 60;
    const dt = 0.1;
    let x = -100;
    let y = topOffset;
    let vx = v0;
    let vy = 0;

    //////////////////////////////////
    //                              //
    //       --- PITCHING ---       //
    //                              //
    //////////////////////////////////
    console.log("Ball is pitching...");
    let hasSwung = false;
    let hasHitWicket = false;

    setBallCoords({ top: y, right: x }); // Example of moving the ball
    const pitchingLoop = setInterval(() => {
      vy -= g * dt;
      x += vx * dt;   
      y -= vy * dt;   
      console.log(x, y, vy);

      if (y >= groundLvl) {
        //console.log("Ball bounces at " + x, y);
        y  = groundLvl;
        vy -= vy * bounce;
        vx *= friction;
      }

      // --- THE DYNAMIC DISTANCE TRIGGER ---
      // If the ball crosses the threshold(to be hit position) and the batter hasn't swung yet...
      if (!hasSwung && x >= (batterDistanceFromRight - 20)) {
        hasSwung = true;
        console.log("Batter swings!");
        animateBatterShot(setBatterSprite); 

        // --- THE HIT ---
        if (!miss) {
          // Give the sprite animation a split second to reach the "contact" frame
          setTimeout(() => {
            console.log("Ball goes flying!");
            clearInterval(pitchingLoop); // Stop the pitching physics entirely
            
            ///////////////////////////////////
            //                               //
            // --- THE RETURN TRAJECTORY --- //
            //                               //
            ///////////////////////////////////

            // Getting new velocities based on the shot outcome
            const { vx: returnVx, vy: returnVy } = getShotVelocity(outcome);
            vx = returnVx;
            vy = returnVy;
            
            // Ball returning animation loop
            setBallCoords({ top: y, right: x });
            const returnLoop = setInterval(() => {
              vy -= g * dt;
              x -= vx * dt;   
              y -= vy * dt;   
              console.log(x, y, vy);

              if (y >= groundLvl) {
                y  = groundLvl;
                vy -= vy * bounce;
                vx *= friction;
              }

              setBallCoords((prevCoords) => {
                if (prevCoords.right <= -100) {
                  clearInterval(returnLoop);
                  return prevCoords;
                }
                return { top: y, right: x };
              });
            }, 20);

            // --- BATTER RESET AFTER HIT ---
            setTimeout(() => {
              shot_playing.current = false;
              setBatterSprite('idle.png');
              setBallCoords({ top: topOffset, right: -100 });

              // Update game state
              updateGameState(outcome, runs, setRuns, wickets, setWickets, ballsDone, setBallsDone, setGameOver, maxWickets, gameAreaRef, navBarRef);
            }, waitDuration); 

          }, 10); // Adjust this delay (10ms) so the ball shoots off exactly when the bat hits it visually
        }
        
      }
      // --- THE MISS (WICKET) ---
      if (miss && !hasHitWicket && x >= wicketDistanceFromRight) {
        hasHitWicket = true;
        console.log("Ball missed! It's a wicket.");
        animateWicket(wicketRef); 
        
        // --- BATTER RESET AFTER WICKET ---
        setTimeout(() => {
          shot_playing.current = false;
          setBatterSprite('idle.png');
          setBallCoords({ top: topOffset, right: -100 });
          resetWicket(wicketRef);

          // Update game state
          updateGameState(outcome, runs, setRuns, wickets, setWickets, ballsDone, setBallsDone, setGameOver, maxWickets, gameAreaRef, navBarRef);
        }, 1500); // Let the player see brocken wickets and be sad :) 
      }

      setBallCoords((prevCoords) => {
        console.log(x, y);
        if (prevCoords.right >= 2000) {
          clearInterval(pitchingLoop);
          return prevCoords;
        }
        return { top: y, right: x };
      });
    }, 20);
  };

  return (
    <div id="game-container">
      {/* =========================================
                 SCREEN 1: MAIN MENU 
      =========================================== */}
      {isMainMenu && (
        <>
          <img id="bg-img" src="/assets/bg-main.png" alt=""/>
          <div id="main-menu">
            <img id="menu-bg" src="/assets/menu-bg.png" alt=""/>
            <img id="menu-logo" src="/assets/logo.png" alt="Archer Icon"/>
            <button onClick={restartGame}>Start Game</button>
            <button onClick={exitGame}>Exit Game</button>
          </div>
        </>
      )}

      {/* =========================================
                 SCREEN 3: THE GAME SCREEN 
      =========================================== */}
      {/* We only render the game if we are NOT on the main menu */}
      {!isMainMenu && (
      <>
        {/* Navbar */}
        <div className="navbar" ref={navBarRef}>
          <button className="restart-btn" onClick={restartGame}>
            <img src="/assets/restart1.png" alt="Restart" style={{ width: '100%', height: '100%' }} />
          </button>
          <div className="option-btns">
            <button className={battingStyle === 'Aggressive' ? 'button-pressed' : ''} style={{ color: 'red' }} onClick={() => setBattingStyle('Aggressive')}>
              Aggressive
            </button>
            <button className={battingStyle === 'Defensive' ? 'button-pressed' : ''} style={{ color: 'gold' }} onClick={() => setBattingStyle('Defensive')}>
              Defensive
            </button>
          </div>
        </div>
        
        {/* =========================================
                  SCREEN 2: GAME OVER 
        =========================================== */}
        {!isMainMenu && gameOver && (
          <div id="gameOverMenu">
            <img id="menu-bg" src="/assets/menu-bg.png" alt="" />
            <h1>Game Over!</h1>
            <p style={{ marginBottom: '0px' }}>Score: {runs}</p>
            <p style={{ margin: '0px' }}>Wickets gone: {wickets}</p>
            <p style={{ marginTop: '0px' }}>Balls left: {12 - ballsDone}</p>
            <button onClick={restartGame}>Restart</button>
            <button onClick={goToMenu}>Main Menu</button>
            <button onClick={exitGame}>Exit</button>
          </div>
        )}
        <div style={{display: 'none'}}>
          {gameOver.toString()}
        </div>
        
        <div id="gameArea" ref={gameAreaRef}>
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
          <div id="batter" ref={batterRef}>
            <img src={`/assets/${batterSprite}`} alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
          </div>
          <div id="wicket" ref={wicketRef}>
            <img src="/assets/wicket.png" alt="" style={{ width: '100%', height: '100%', position: 'inherit' }} />
          </div>
        </div>
      </>
      )}
    </div>
  );
}

export default App