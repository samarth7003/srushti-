import React from "react";

export const LogoIcon = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} transition-transform duration-300`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Premium Metallic Gold Gradient */}
        <linearGradient id="goldLogoGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#C5A880" />
          <stop offset="25%" stopColor="#EAD8C0" />
          <stop offset="50%" stopColor="#A88960" />
          <stop offset="75%" stopColor="#FFF5E6" />
          <stop offset="100%" stopColor="#B09060" />
        </linearGradient>
        {/* Star Glow Radial Gradient */}
        <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="25%" stopColor="#FFF5E6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Monogram S - Stylized double-loop ribbon */}
      <g stroke="url(#goldLogoGradient)" strokeLinecap="round" strokeLinejoin="round">
        {/* Outer Ribbon line of the S monogram */}
        <path 
          d="M 64,36 C 64,21 44,21 38,30 C 32,39 32,48 50,54 L 62,58 C 80,64 80,73 74,82 C 68,91 48,91 42,78" 
          strokeWidth="6.5"
        />
        
        {/* Inner parallel line of the S monogram to create the luxury double-stripe look */}
        <path 
          d="M 54,40 C 54,31 43,31 40,35 C 37,39 37,45 49,49 L 61,53 C 73,57 73,63 68,67 C 63,71 53,71 49,63" 
          strokeWidth="4.5"
        />

        {/* Dynamic diagonal connection */}
        <path 
          d="M 36,46 L 70,58" 
          strokeWidth="5" 
          opacity="0.9"
        />
      </g>

      {/* Star sparkle at the top right curve intersection */}
      <g transform="translate(60, 31)">
        {/* Glow */}
        <circle cx="0" cy="0" r="12" fill="url(#sparkleGlow)" opacity="0.85" />
        
        {/* Sparkle rays */}
        <path 
          d="M 0,-15 L 0,15 M -15,0 L 15,0" 
          stroke="url(#goldLogoGradient)" 
          strokeWidth="1.5" 
        />
        <path 
          d="M -8,-8 L 8,8 M -8,8 L 8,-8" 
          stroke="url(#goldLogoGradient)" 
          strokeWidth="1" 
        />
        
        {/* Core highlight dot */}
        <circle cx="0" cy="0" r="2" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
