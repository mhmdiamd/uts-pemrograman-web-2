import React from 'react';
import type { User } from '../../types';
import { UserProfile } from '../molecules';

interface Props {
  user: User;
  onLogout: () => void;
}

export const NavBar: React.FC<Props> = ({ user, onLogout }) => (
  <nav className="nav-bar animate-in">
    <UserProfile user={user} />
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <a href="/tests/" className="auth-link" style={{ fontSize: '0.875rem' }}>Test Report</a>
      <a href="/coverage/" className="auth-link" style={{ fontSize: '0.875rem' }}>Coverage</a>
      <a href="/e2e/" className="auth-link" style={{ fontSize: '0.875rem' }}>E2E Report</a>
      <button onClick={onLogout} className="btn btn-secondary logout-btn" style={{ flex: 'none', padding: '0.5rem 1rem' }}>KELUAR</button>
    </div>
  </nav>
);
