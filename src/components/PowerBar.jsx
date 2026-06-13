export default function PowerBar({ curr_stats, sliderPos }) {
  return (
    <div className="powerBar-box">
      {curr_stats.map((stat, index) => (
        <div key={index} className={`segment ${stat.name}`} style={{width: `${stat.prob}%`}}>
          {stat.outcome}
        </div>
      ))}
      <div className="slider" id="moving-slider" style={{ left: `${sliderPos}%` }}></div>
    </div>
  );
}