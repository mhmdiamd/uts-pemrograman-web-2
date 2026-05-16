import React from 'react';
import { StatCard } from '../molecules';

interface Props {
  total: number;
  lulus: number;
  tidakLulus: number;
}

export const StatsGrid: React.FC<Props> = ({ total, lulus, tidakLulus }) => (
  <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
    <StatCard label="Total" value={total} />
    <StatCard label="Lulus" value={lulus} variant="lulus" />
    <StatCard label="Tidak Lulus" value={tidakLulus} variant="tidak" />
  </div>
);
