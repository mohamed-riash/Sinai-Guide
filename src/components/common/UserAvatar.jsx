import React from 'react';
import { UserRound } from 'lucide-react';

export const UserAvatar = ({ src, name = '', className = '' }) => (
  src ? (
    <img src={src} alt={name} loading="lazy" className={className} />
  ) : (
    <span role="img" aria-label={name ? `${name} profile image` : 'Profile image'} className={`inline-flex items-center justify-center bg-black/10 text-[var(--color-text-muted)] dark:bg-white/10 ${className}`}>
      <UserRound className="h-1/2 w-1/2" aria-hidden="true" />
    </span>
  )
);
