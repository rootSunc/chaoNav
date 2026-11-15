/** A name seal, the way a letter gets signed where I grew up. */
export function Seal({ className = "" }: { readonly className?: string }) {
  return (
    <svg
      className={`seal ${className}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Chao"
    >
      <defs>
        <filter id="seal-rough" x="-6%" y="-6%" width="112%" height="112%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="11"
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.4" />
        </filter>
        <mask id="seal-mask">
          <rect width="100" height="100" rx="6" fill="#fff" />
          <g
            fill="#000"
            fontFamily="'Recursive Variable', sans-serif"
            fontWeight="900"
            fontSize="45"
            textAnchor="middle"
            style={{ fontVariationSettings: '"CASL" 1, "MONO" 0' }}
          >
            <text x="50" y="46" textLength="72" lengthAdjust="spacingAndGlyphs">
              CH
            </text>
            <text x="50" y="88" textLength="72" lengthAdjust="spacingAndGlyphs">
              AO
            </text>
          </g>
          <g fill="#000">
            <circle cx="9" cy="14" r="1.6" />
            <circle cx="91" cy="62" r="1.2" />
            <circle cx="16" cy="93" r="1.9" />
            <circle cx="78" cy="6" r="1.1" />
            <circle cx="94" cy="90" r="2.2" />
          </g>
        </mask>
      </defs>
      <g filter="url(#seal-rough)">
        <rect
          x="2"
          y="2"
          width="96"
          height="96"
          rx="6"
          fill="currentColor"
          mask="url(#seal-mask)"
        />
      </g>
    </svg>
  );
}
