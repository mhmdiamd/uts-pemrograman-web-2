import React from 'react';
import type { Student } from '../../types';
import { Badge } from '../atoms';

interface Props {
  students: Student[];
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentTable: React.FC<Props> = ({ students, onEdit, onDelete }) => {
  return (
    <div className="card table-card">
      <h2 className="card-title">Data Mahasiswa</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Kode</th>
              <th>Nama</th>
              <th>JK</th>
              <th>Lokasi</th>
              <th>MAT</th>
              <th>ING</th>
              <th>UMM</th>
              <th>AVG</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Belum ada data.</td>
              </tr>
            ) : (
              students.map(s => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, fontSize: '0.75rem' }}>{s.kodePendaftaran}</td>
                  <td>{s.namaPendaftaran}</td>
                  <td>{s.jenisKelamin[0]}</td>
                  <td>
                    <div style={{ fontSize: '0.75rem' }}>{s.tempatTes}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{s.gelombang}</div>
                  </td>
                  <td>{s.nilaiMatematika}</td>
                  <td>{s.nilaiInggris}</td>
                  <td>{s.nilaiUmum}</td>
                  <td style={{ fontWeight: 700 }}>{s.rataRata.toFixed(1)}</td>
                  <td>
                    <Badge type={s.keterangan}>{s.keterangan}</Badge>
                  </td>
                  <td>
                    <div className="action-cell">
                      <button className="btn-icon btn-icon-edit" onClick={() => onEdit(s)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                      </button>
                      <button className="btn-icon btn-icon-delete" onClick={() => onDelete(s.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
