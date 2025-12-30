interface LogoProps {
  className?: string;
}

export default function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#A855F7', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      {/* Mountain/Triangle base */}
      <path
        d="M 100 60 L 140 120 L 60 120 Z"
        fill="url(#logoGradient)"
        opacity="0.9"
      />
      
      {/* Sun circle */}
      <circle
        cx="100"
        cy="50"
        r="20"
        fill="url(#logoGradient)"
        opacity="0.8"
      />
      
      {/* Sun rays */}
      <g stroke="url(#logoGradient)" strokeWidth="3" strokeLinecap="round" opacity="0.7">
        <line x1="100" y1="20" x2="100" y2="10" />
        <line x1="120" y1="30" x2="127" y2="23" />
        <line x1="130" y1="50" x2="140" y2="50" />
        <line x1="120" y1="70" x2="127" y2="77" />
        <line x1="80" y1="70" x2="73" y2="77" />
        <line x1="70" y1="50" x2="60" y2="50" />
        <line x1="80" y1="30" x2="73" y2="23" />
      </g>
      
      {/* Base platform */}
      <rect
        x="50"
        y="120"
        width="100"
        height="8"
        rx="4"
        fill="url(#logoGradient)"
        opacity="0.6"
      />
    </svg>
  );
}
