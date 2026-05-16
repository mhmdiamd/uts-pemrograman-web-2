import React from 'react';

export const Toast: React.FC<{ message: string; hiding: boolean }> = ({ message, hiding }) => (
  <div className="toast-container">
    <div className={`toast ${hiding ? 'hiding' : ''}`}>
      {message}
    </div>
  </div>
);

export const Badge: React.FC<{ type: string; children: React.ReactNode }> = ({ type, children }) => (
  <span className={`badge badge-${type.toLowerCase().replace(' ', '-')}`}>
    {children}
  </span>
);

export const Blob: React.FC<{ className: string }> = ({ className }) => (
  <div className={`blob ${className}`}></div>
);
