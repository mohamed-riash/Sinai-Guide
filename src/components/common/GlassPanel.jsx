import React from 'react';

export const GlassPanel = ({ children, className = '', ...props }) => {
  return (
    <div className={`glass-panel p-6 overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};
