export default function GameOverMenu({ runs, wickets, ballsDone, restartGame, goToMenu, exitGame }) {
  return (
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
  );
}