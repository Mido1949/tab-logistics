export default function Logo({ width = 40, height = 40, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="100" height="100" rx="20" fill="url(#paint0_linear)" />
        {/* Crisp Central T stem merged with the box geometry */}
        <path d="M 32 32 H 68 V 44 H 56 V 68 H 44 V 44 H 32 V 32 Z" fill="white" />
        {/* Left Arrow (Swap/Distribute Indicator) */}
        <path d="M 39 48 L 27 56 L 39 64 Z" fill="white" />
        {/* Right Arrow (Swap/Distribute Indicator) */}
        <path d="M 61 48 L 73 56 L 61 64 Z" fill="white" />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
            <stop stopColor="#dc2626" />
            <stop offset="1" stopColor="#b91c1c" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
          تاب <span style={{ color: 'var(--primary)', fontWeight: '400' }}>لوجستيكس</span>
        </span>
      )}
    </div>
  );
}
