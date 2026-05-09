import React, { useState, useMemo, useEffect } from 'react';

interface Student {
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
  // Derived fields
  rataRata: number;
  keterangan: string;
  tempatTes: string;
  gelombang: string;
  bulanTes: string;
}

const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const PLACES: Record<string, string> = {
  'A': 'Gedung A',
  'B': 'Gedung B',
  'V': 'Viktor'
};

const JOBS = [
  'PNS', 'Pegawai Swasta', 'Wiraswasta', 'TNI/Polri', 'Buruh', 'Lainnya'
];

const App: React.FC = () => {
  // Initialize state from localStorage or use dummy data if empty
  const [students, setStudents] = useState<Student[]>(() => {
    const savedData = localStorage.getItem('pendaftaran_mahasiswa');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse localStorage data", e);
      }
    }
    // Default dummy data if nothing is saved
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
      },
      {
        id: '3',
        kodePendaftaran: 'V3-112-7',
        namaPendaftaran: 'Andi Wijaya',
        jenisKelamin: 'Laki-Laki',
        tempatLahir: 'Tangerang',
        tanggalLahir: '2005-07-10',
        asalSekolah: 'SMK 1 Tangerang',
        pekerjaanOrtu: 'Pegawai Swasta',
        nilaiMatematika: 50,
        nilaiInggris: 45,
        nilaiUmum: 55,
        rataRata: 50,
        keterangan: 'Tidak Lulus',
        tempatTes: 'Viktor',
        gelombang: 'Gelombang 3',
        bulanTes: 'Juli'
      }
    ];
  });

  // Save to localStorage whenever students change
  useEffect(() => {
    localStorage.setItem('pendaftaran_mahasiswa', JSON.stringify(students));
  }, [students]);
  const [formData, setFormData] = useState({
    namaPendaftaran: '',
    jenisKelamin: 'Laki-Laki' as 'Laki-Laki' | 'Perempuan',
    tempatLahir: '',
    tanggalLahir: '',
    asalSekolah: '',
    pekerjaanOrtu: JOBS[0],
    nilaiMatematika: 0,
    nilaiInggris: 0,
    nilaiUmum: 0,
    // Fields for code generation
    tempatTesKey: 'A',
    gelombangNum: '1',
    bulanTesIndex: new Date().getMonth() + 1
  });

  const [generatedCode, setGeneratedCode] = useState('');
  const [toast, setToast] = useState<{ message: string, visible: boolean, hiding: boolean }>({
    message: '',
    visible: false,
    hiding: false
  });

  const showToast = (message: string) => {
    setToast({ message, visible: true, hiding: false });
    setTimeout(() => {
      setToast(prev => ({ ...prev, hiding: true }));
      setTimeout(() => {
        setToast({ message: '', visible: false, hiding: false });
      }, 300);
    }, 3000);
  };

  // Auto-generate code whenever relevant fields change
  useEffect(() => {
    const randomId = Math.floor(100 + Math.random() * 900);
    const code = `${formData.tempatTesKey}${formData.gelombangNum}-${randomId}-${formData.bulanTesIndex}`;
    setGeneratedCode(code);
  }, [formData.tempatTesKey, formData.gelombangNum, formData.bulanTesIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('nilai') || name === 'bulanTesIndex' ? Number(value) : value
    }));
  };

  const calculateStatus = (mat: number, ing: number, umum: number) => {
    const rataRata = (mat + ing + umum) / 3;
    let keterangan = 'Tidak Lulus';
    if (rataRata >= 70) keterangan = 'Lulus';
    else if (rataRata >= 60) keterangan = 'Cadangan';
    return { rataRata, keterangan };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { rataRata, keterangan } = calculateStatus(
      formData.nilaiMatematika,
      formData.nilaiInggris,
      formData.nilaiUmum
    );

    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      kodePendaftaran: generatedCode,
      namaPendaftaran: formData.namaPendaftaran,
      jenisKelamin: formData.jenisKelamin,
      tempatLahir: formData.tempatLahir,
      tanggalLahir: formData.tanggalLahir,
      asalSekolah: formData.asalSekolah,
      pekerjaanOrtu: formData.pekerjaanOrtu,
      nilaiMatematika: formData.nilaiMatematika,
      nilaiInggris: formData.nilaiInggris,
      nilaiUmum: formData.nilaiUmum,
      rataRata,
      keterangan,
      tempatTes: PLACES[formData.tempatTesKey],
      gelombang: `Gelombang ${formData.gelombangNum}`,
      bulanTes: MONTHS[formData.bulanTesIndex - 1]
    };

    setStudents(prev => [newStudent, ...prev]);
    showToast(`Berhasil menambahkan ${formData.namaPendaftaran}!`);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      namaPendaftaran: '',
      jenisKelamin: 'Laki-Laki',
      tempatLahir: '',
      tanggalLahir: '',
      asalSekolah: '',
      pekerjaanOrtu: JOBS[0],
      nilaiMatematika: 0,
      nilaiInggris: 0,
      nilaiUmum: 0,
      tempatTesKey: 'A',
      gelombangNum: '1',
      bulanTesIndex: new Date().getMonth() + 1
    });
  };

  const stats = useMemo(() => {
    const total = students.length;
    const lulus = students.filter(s => s.keterangan === 'Lulus').length;
    const tidakLulus = students.filter(s => s.keterangan === 'Tidak Lulus').length;
    return { total, lulus, tidakLulus };
  }, [students]);

  return (
    <div className="container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <header className="animate-in">
        <h1>Sistem Pendaftaran Mahasiswa</h1>
        <p>Created by Muhamad Ilham Darmawan | NIM: 221011401327</p>
      </header>

      <main className="app-grid">
        <section className="animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>Input Data</h2>
              <div style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
                COUNT: {students.length}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama Pendaftar</label>
                <input 
                  type="text" 
                  name="namaPendaftaran" 
                  className="form-control" 
                  value={formData.namaPendaftaran}
                  onChange={handleInputChange}
                  required 
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Jenis Kelamin</label>
                  <select name="jenisKelamin" className="form-control" value={formData.jenisKelamin} onChange={handleInputChange}>
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Asal Sekolah</label>
                  <input 
                    type="text" 
                    name="asalSekolah" 
                    className="form-control" 
                    value={formData.asalSekolah}
                    onChange={handleInputChange}
                    required 
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tempat Lahir</label>
                  <input type="text" name="tempatLahir" className="form-control" value={formData.tempatLahir} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Tanggal Lahir</label>
                  <input type="date" name="tanggalLahir" className="form-control" value={formData.tanggalLahir} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-group">
                <label>Pekerjaan Orang Tua</label>
                <select name="pekerjaanOrtu" className="form-control" value={formData.pekerjaanOrtu} onChange={handleInputChange}>
                  {JOBS.map(job => <option key={job} value={job}>{job}</option>)}
                </select>
              </div>

              <div className="card" style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', marginBottom: '1.5rem', border: '1px dashed var(--primary)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>Konfigurasi Pendaftaran</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Tempat Tes</label>
                    <select name="tempatTesKey" className="form-control" value={formData.tempatTesKey} onChange={handleInputChange}>
                      <option value="A">Gedung A</option>
                      <option value="B">Gedung B</option>
                      <option value="V">Viktor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Gelombang</label>
                    <select name="gelombangNum" className="form-control" value={formData.gelombangNum} onChange={handleInputChange}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Bulan Tes</label>
                  <select name="bulanTesIndex" className="form-control" value={formData.bulanTesIndex} onChange={handleInputChange}>
                    {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                  </select>
                </div>
                <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                  Generated Code: <strong style={{ color: 'var(--primary)', fontFamily: 'monospace' }}>{generatedCode}</strong>
                </div>
              </div>

              <div className="card" style={{ background: 'white', padding: '1rem', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>Nilai Tes</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Matematika</label>
                    <input type="number" name="nilaiMatematika" className="form-control" min="0" max="100" value={formData.nilaiMatematika} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Bhs. Inggris</label>
                    <input type="number" name="nilaiInggris" className="form-control" min="0" max="100" value={formData.nilaiInggris} onChange={handleInputChange} required />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Umum</label>
                  <input type="number" name="nilaiUmum" className="form-control" min="0" max="100" value={formData.nilaiUmum} onChange={handleInputChange} required />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">SIMPAN</button>
                <button type="button" className="btn btn-secondary" onClick={handleReset}>RESET</button>
              </div>
            </form>
          </div>
        </section>

        <section className="animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
            <div className="stat-card">
              <div className="stat-label">Total</div>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card lulus">
              <div className="stat-label">Lulus</div>
              <div className="stat-value">{stats.lulus}</div>
            </div>
            <div className="stat-card tidak">
              <div className="stat-label">Tidak Lulus</div>
              <div className="stat-value">{stats.tidakLulus}</div>
            </div>
          </div>

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
                  </tr>
                </thead>
                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Belum ada data.</td>
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
                          <span className={`badge badge-${s.keterangan.toLowerCase().replace(' ', '-')}`}>
                            {s.keterangan}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="footer animate-in">
        <p>Created by <strong>Muhamad Ilham Darmawan</strong></p>
        <p>NIM : 221011401327 | Kelas : 07TPLE001</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.6 }}>&copy; 2026 UTS Pemrograman Web 2</p>
      </footer>

      {toast.visible && (
        <div className="toast-container">
          <div className={`toast ${toast.hiding ? 'hiding' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--success)' }}><polyline points="20 6 9 17 4 12"></polyline></svg>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
