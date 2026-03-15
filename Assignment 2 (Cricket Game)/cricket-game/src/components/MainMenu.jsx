export default function MainMenu({ restartGame, exitGame }) {
  return (
    <>
      <img id="bg-img" src="/assets/bg-main.png" alt=""/>
      <div id="main-menu">
        <img id="menu-bg" src="/assets/menu-bg.png" alt=""/>
        <img id="menu-logo" src="/assets/logo.png" alt="Archer Icon"/>
        <button onClick={restartGame}>Start Game</button>
        <button onClick={exitGame}>Exit Game</button>
      </div>
    </>
  );
}