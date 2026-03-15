import { useState, useEffect, useRef } from 'react';

// COMPONENTS
import MainMenu from './components/MainMenu';
import GameOverMenu from './components/GameOverMenu';
import Navbar from './components/Navbar';
import ScoreBoard from './components/ScoreBoard';
import PowerBar from './components/PowerBar';
import PlayShotButton from './components/PlayShotButton';
import FieldElements from './components/FieldElements';
import CommentaryBox from './components/CommentaryBox';


const commentaryLines = {
  '0': ["Solid defense, no run.", "Played straight to the fielder.", "A dot ball, building the pressure."],
  '1': ["Just a single, rotating the strike.", "Tapped away for a quick run.", "Easy single taken there."],
  '2': ["Pushed into the gap, they'll come back for two.", "Good running between the wickets!", "Nicely timed, easy two runs."],
  '3': ["Brilliant placement! They push hard for three.", "Excellent running, saving a boundary but getting three.", "Three runs added to the total."],
  '4': ["Shot! One bounce and over the ropes for four!", "Cracking drive! That's a boundary.", "Threaded through the gap beautifully for four."],
  '6': ["BOOM! Out of the park for a massive SIX!", "He's absolutely smashed that one! Six runs!", "High, handsome, and into the stands!"],
  'Wicket': ["OUT! Knocked him over!", "He's gone! The stumps are shattered!", "What a delivery! The batter has no answer."]
};

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
  const [commentary, setCommentary] = useState("Welcome to Lucky Shot! Press Play Shot to begin.");
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
    }, 10);   // Adjust this for slider speed (lower is faster)
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
    setCommentary("Welcome to Lucky Shot! Press Play Shot to begin.");
  };

  const goToMenu = () => {
    setIsMainMenu(true);
    setGameOver(false);
    resetGameVisuals(gameAreaRef, navBarRef);
    setCommentary("Welcome to Lucky Shot! Press Play Shot to begin.");
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

    // Generating commentary
    const lines = commentaryLines[outcome];
    const randomLine = lines[Math.floor(Math.random() * lines.length)];
    setCommentary(randomLine);

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
      
      {/* SCREEN 1: MAIN MENU */}
      {isMainMenu && (
        <MainMenu restartGame={restartGame} exitGame={exitGame} />
      )}

      {/* SCREEN 2: THE GAME SCREEN */}
      {!isMainMenu && (
      <>
        <Navbar 
          ref={navBarRef}
          restartGame={restartGame} 
          battingStyle={battingStyle} 
          setBattingStyle={setBattingStyle} 
        />
        
        {/* SCREEN 3: GAME OVER (Overlays the game) */}
        {gameOver && (
          <GameOverMenu 
            runs={runs} 
            wickets={wickets} 
            ballsDone={ballsDone} 
            restartGame={restartGame} 
            goToMenu={goToMenu} 
            exitGame={exitGame} 
          />
        )}
        
        <div id="gameArea" ref={gameAreaRef}>
          <CommentaryBox commentary={commentary} />

          <PlayShotButton playShot={playShot} />

          <ScoreBoard runs={runs} ballsDone={ballsDone} wickets={wickets} />
          
          <PowerBar curr_stats={curr_stats} sliderPos={sliderPos} />
          
          <FieldElements 
            ballCoords={ballCoords} 
            batterSprite={batterSprite} 
            batterRef={batterRef} 
            wicketRef={wicketRef} 
          />
        </div>
      </>
      )}
    </div>
  );
}

export default App;