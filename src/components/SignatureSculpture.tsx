// A projected, twisted torus. SVG keeps the sculpture crisp and independent of WebGL.
const TAU = Math.PI * 2;
function project(u: number, v: number) {
  const radius = 117 + 43 * Math.cos(v);
  const x = radius * Math.cos(u);
  const y = radius * Math.sin(u);
  const z = 43 * Math.sin(v) + 26 * Math.sin(u * 2);
  const ry = y * Math.cos(0.91) - z * Math.sin(0.91);
  const rz = y * Math.sin(0.91) + z * Math.cos(0.91);
  const angle = -0.57;
  return {
    x: 250 + (x * Math.cos(angle) - ry * Math.sin(angle)) * 1.18,
    y: 231 + (x * Math.sin(angle) + ry * Math.cos(angle)) * 1.18,
    z: rz,
  };
}
const rings = Array.from({ length: 100 }, (_, i) => {
  const u = (i / 100) * TAU;
  const points = Array.from({ length: 65 }, (_, j) =>
    project(u, (j / 64) * TAU),
  );
  return {
    depth: project(u, 0).z,
    d:
      points
        .map((p, j) => `${j ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
        .join(" ") + "Z",
  };
}).sort((a, b) => a.depth - b.depth);
export function SignatureSculpture() {
  return (
    <div
      className="sculpture"
      aria-label="An abstract, slowly floating wire sculpture"
      role="img"
    >
      <div className="sculpture-halo" />
      <div className="sculpture-grid" />
      <span className="art-cross cross-one">+</span>
      <span className="art-cross cross-two">+</span>
      <span className="art-coordinate">60°10′ N &nbsp; 24°56′ E</span>
      <svg
        className="sculpture-object"
        viewBox="0 0 500 460"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="wire"
            x1=".1"
            y1="0"
            x2=".9"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop stopColor="#ebeee7" />
            <stop offset=".4" stopColor="#929b91" />
            <stop offset=".7" stopColor="#343c37" />
            <stop offset="1" stopColor="#b5bdb1" />
          </linearGradient>
        </defs>
        {rings.map((ring, i) => (
          <path
            key={i}
            d={ring.d}
            fill="var(--sculpture-fill)"
            stroke="url(#wire)"
            strokeWidth=".8"
            opacity={0.65 + ((ring.depth + 150) / 300) * 0.35}
          />
        ))}
      </svg>
      <div className="art-caption">
        <span className="art-dot" />
        <span>ALWAYS A WORK IN PROGRESS</span>
        <span className="art-edition">FIG. 01</span>
      </div>
    </div>
  );
}
