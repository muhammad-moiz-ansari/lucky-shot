export default function FieldElements({ ballCoords, batterSprite, batterRef, wicketRef }) {
  return (
    <>
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
    </>
  );
}