export default function ScoreBoard({ runs, ballsDone, wickets }) {
  return (
    <div id="scoreBoard">
      <div className="board-left">
          <span className="runs-text">{runs}</span>
      </div>
      <div className="board-right">
          <div className="stat-row">
              <div className="ball-icon"></div>
              <span className="stat-text">{12 - ballsDone}</span>
          </div>
          <div className="stat-row">
              <div className="wicket-icon"></div>
              <span className="stat-text">{wickets}</span>
          </div>
      </div>
    </div>
  );
}