import React from 'react';

export const GlassCard = ({ children, className = '', hover = true, onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 overflow-hidden ${hover ? 'hover:-translate-y-1 hover:shadow-xl' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
