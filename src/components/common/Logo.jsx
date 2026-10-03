import React from 'react';

export const Logo = ({ className = 'h-10 w-10', alt = 'Sinai Guide' }) => (
  <img
    src="/assets/pwa/logo-512.png"
    alt={alt}
    className={`object-contain ${className}`}
  />
);
