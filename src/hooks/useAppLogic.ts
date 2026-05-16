import { useState, useEffect, useMemo } from 'react';
import type { Student, User, ToastState } from '../types';

export const useAppLogic = () => {
  // --- AUTH STATE ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : [{
      id: 'admin-1',
      username: 'admin',
      password: 'admin123',
      fullName: 'Administrator',
      role: 'admin'
    }];
  });

  const [authView, setAuthView] = useState<'login' | 'forgot'>('login');

  // --- STUDENT STATE ---
  const [students, setStudents] = useState<Student[]>(() => {
    const savedData = localStorage.getItem('pendaftaran_mahasiswa');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse localStorage data", e);
      }
    }
    return [
      {
        id: '1',
        kodePendaftaran: 'A1-423-5',
        namaPendaftaran: 'Budi Santoso',
        jenisKelamin: 'Laki-Laki',
        tempatLahir: 'Jakarta',
        tanggalLahir: '2005-05-15',
        asalSekolah: 'SMAN 1 Jakarta',
        pekerjaanOrtu: 'PNS',
        nilaiMatematika: 85,
        nilaiInggris: 80,
        nilaiUmum: 75,
        rataRata: 80,
        keterangan: 'Lulus',
        tempatTes: 'Gedung A',
        gelombang: 'Gelombang 1',
        bulanTes: 'Mei'
      },
      {
        id: '2',
        kodePendaftaran: 'B2-882-6',
        namaPendaftaran: 'Siti Aminah',
        jenisKelamin: 'Perempuan',
        tempatLahir: 'Bandung',
        tanggalLahir: '2005-06-20',
        asalSekolah: 'SMA 2 Bandung',
        pekerjaanOrtu: 'Wiraswasta',
        nilaiMatematika: 65,
        nilaiInggris: 62,
        nilaiUmum: 68,
        rataRata: 65,
        keterangan: 'Cadangan',
        tempatTes: 'Gedung B',
        gelombang: 'Gelombang 2',
        bulanTes: 'Juni'
      }
    ];
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [toast, setToast] = useState<ToastState>({
    message: '',
    visible: false,
    hiding: false
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('pendaftaran_mahasiswa', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('current_user');
  }, [currentUser]);

  // --- ACTIONS ---
  const showToast = (message: string) => {
    setToast({ message, visible: true, hiding: false });
    setTimeout(() => {
      setToast(prev => ({ ...prev, hiding: true }));
      setTimeout(() => {
        setToast({ message: '', visible: false, hiding: false });
      }, 300);
    }, 3000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast("Anda telah keluar.");
  };

  const deleteStudent = (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      setStudents(prev => prev.filter(s => s.id !== id));
      showToast("Data berhasil dihapus.");
    }
  };

  const stats = useMemo(() => {
    const total = students.length;
    const lulus = students.filter(s => s.keterangan === 'Lulus').length;
    const tidakLulus = students.filter(s => s.keterangan === 'Tidak Lulus').length;
    return { total, lulus, tidakLulus };
  }, [students]);

  return {
    currentUser, setCurrentUser,
    users, setUsers,
    authView, setAuthView,
    students, setStudents,
    editingId, setEditingId,
    generatedCode, setGeneratedCode,
    toast, setToast,
    showToast, handleLogout, deleteStudent, stats
  };
};
