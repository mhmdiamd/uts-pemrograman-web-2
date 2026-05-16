import React from 'react';
import type { User } from '../../types';

export const StatCard: React.FC<{ label: string; value: number; variant?: 'lulus' | 'tidak' }> = ({ label, value, variant }) => (
  <div className={`stat-card ${variant || ''}`}>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
  </div>
);

export const UserProfile: React.FC<{ user: User }> = ({ user }) => (
  <div className="user-profile">
    <div className="avatar">{user.fullName.charAt(0)}</div>
    <div>
      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>{user.fullName}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.role.toUpperCase()}</div>
    </div>
  </div>
);
