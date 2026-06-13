export default function PlayShotButton({ playShot }) {
  return (
    <button className="playShot-btn" onClick={playShot}>
      <img src="/assets/playShot.png" alt="Play Shot" style={{ width: '100%', height: '100%' }}/>
    </button>
  );
}