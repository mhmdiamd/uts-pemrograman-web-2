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
    <button onClick={onLogout} className="btn btn-secondary" style={{ flex: 'none', padding: '0.5rem 1rem' }}>KELUAR</button>
  </nav>
);
