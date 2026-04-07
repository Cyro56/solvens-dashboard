"use client";

import React from 'react';

export const MolaLogo: React.FC<{ size?: number }> = ({ size = 32 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/solvens_logo.svg"
        alt="Solvens Logo"
        width={size}
        height={size}
        style={{ 
          filter: 'invert(87%) sepia(49%) saturate(836%) hue-rotate(104deg) brightness(101%) contrast(101%) drop-shadow(0 0 8px rgba(56, 251, 219, 0.4))',
          objectFit: 'contain',
          transform: 'scale(1.5)'
        }}
      />
      <span style={{ 
        fontFamily: 'Outfit', 
        fontSize: '24px', 
        fontWeight: 700, 
        letterSpacing: '0.22em',
        color: 'var(--text-primary)',
        textTransform: 'uppercase',
        marginTop: '2px'
      }}>
        Solvens
      </span>
    </div>
  );
};
