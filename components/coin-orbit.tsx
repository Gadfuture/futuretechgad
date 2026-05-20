import { supportedAssets } from "@/lib/site-content";

export function CoinOrbit() {
  return (
    <div className="orbit-scene" aria-hidden="true">
      <div className="orbit-glow" />
      {supportedAssets.map((asset, index) => (
        <div
          key={asset}
          className="coin"
          style={
            {
              "--delay": `${index * 1.7}s`,
              "--rotation": `${index * 51}deg`
            } as React.CSSProperties
          }
        >
          <span className={`coin-face coin-${asset.toLowerCase()}`}>{asset}</span>
        </div>
      ))}
      <div className="phone-core">
        <strong>FTG</strong>
        <span>LIVE</span>
      </div>
    </div>
  );
}
