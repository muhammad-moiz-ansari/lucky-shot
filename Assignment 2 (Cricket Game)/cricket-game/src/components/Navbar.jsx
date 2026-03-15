import { forwardRef } from 'react';

const Navbar = forwardRef(({ restartGame, battingStyle, setBattingStyle }, ref) => {
  return (
    <div className="navbar" ref={ref}>
      <button className="restart-btn" onClick={restartGame}>
        <img src="/assets/restart1.png" alt="Restart" style={{ width: '100%', height: '100%' }} />
      </button>
      <div className="option-btns">
        <button 
          className={battingStyle === 'Aggressive' ? 'button-pressed' : ''} 
          style={{ color: 'red' }} 
          onClick={() => setBattingStyle('Aggressive')}
        >
          Aggressive
        </button>
        <button 
          className={battingStyle === 'Defensive' ? 'button-pressed' : ''} 
          style={{ color: 'gold' }} 
          onClick={() => setBattingStyle('Defensive')}
        >
          Defensive
        </button>
      </div>
    </div>
  );
});

export default Navbar;