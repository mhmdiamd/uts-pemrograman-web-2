export interface Student {
  id: string;
  kodePendaftaran: string;
  namaPendaftaran: string;
  jenisKelamin: 'Laki-Laki' | 'Perempuan';
  tempatLahir: string;
  tanggalLahir: string;
  asalSekolah: string;
  pekerjaanOrtu: string;
  nilaiMatematika: number;
  nilaiInggris: number;
  nilaiUmum: number;
  rataRata: number;
  keterangan: string;
  tempatTes: string;
  gelombang: string;
  bulanTes: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  role: 'admin';
}

export interface ToastState {
  message: string;
  visible: boolean;
  hiding: boolean;
}
