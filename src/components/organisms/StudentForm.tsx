import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Student } from '../../types';
import { JOBS, PLACES, MONTHS } from '../../constants';
import { calculateStatus } from '../../utils/studentLogic';

const studentSchema = z.object({
  namaPendaftaran: z.string().min(3, 'Nama minimal 3 karakter'),
  jenisKelamin: z.enum(['Laki-Laki', 'Perempuan']),
  tempatLahir: z.string().min(2, 'Tempat lahir minimal 2 karakter'),
  tanggalLahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  asalSekolah: z.string().min(3, 'Asal sekolah minimal 3 karakter'),
  pekerjaanOrtu: z.string().min(1, 'Pekerjaan orang tua wajib diisi'),
  nilaiMatematika: z.number().min(0).max(100),
  nilaiInggris: z.number().min(0).max(100),
  nilaiUmum: z.number().min(0).max(100),
  tempatTesKey: z.string(),
  gelombangNum: z.string(),
  bulanTesIndex: z.number().min(1).max(12),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface Props {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
  generatedCode: string;
  setGeneratedCode: (code: string) => void;
  onShowToast: (msg: string) => void;
}

export const StudentForm: React.FC<Props> = ({ 
  students, setStudents, editingId, setEditingId, generatedCode, setGeneratedCode, onShowToast 
}) => {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      jenisKelamin: 'Laki-Laki',
      pekerjaanOrtu: JOBS[0],
      nilaiMatematika: 0,
      nilaiInggris: 0,
      nilaiUmum: 0,
      tempatTesKey: 'A',
      gelombangNum: '1',
      bulanTesIndex: new Date().getMonth() + 1
    }
  });

  const watchedTempatTesKey = watch('tempatTesKey');
  const watchedGelombangNum = watch('gelombangNum');
  const watchedBulanTesIndex = watch('bulanTesIndex');

  useEffect(() => {
    if (!editingId) {
      const randomId = Math.floor(100 + Math.random() * 900);
      const code = `${watchedTempatTesKey}${watchedGelombangNum}-${randomId}-${watchedBulanTesIndex}`;
      setGeneratedCode(code);
    }
  }, [watchedTempatTesKey, watchedGelombangNum, watchedBulanTesIndex, editingId, setGeneratedCode]);

  useEffect(() => {
    if (editingId) {
      const student = students.find(s => s.id === editingId);
      if (student) {
        const tKey = Object.keys(PLACES).find(key => PLACES[key] === student.tempatTes) || 'A';
        const gNum = student.gelombang.replace('Gelombang ', '');
        const bIndex = MONTHS.indexOf(student.bulanTes) + 1;

        reset({
          namaPendaftaran: student.namaPendaftaran,
          jenisKelamin: student.jenisKelamin,
          tempatLahir: student.tempatLahir,
          tanggalLahir: student.tanggalLahir,
          asalSekolah: student.asalSekolah,
          pekerjaanOrtu: student.pekerjaanOrtu,
          nilaiMatematika: student.nilaiMatematika,
          nilaiInggris: student.nilaiInggris,
          nilaiUmum: student.nilaiUmum,
          tempatTesKey: tKey,
          gelombangNum: gNum,
          bulanTesIndex: bIndex
        });
      }
    }
  }, [editingId, students, reset]);

  const onSubmit = (data: StudentFormValues) => {
    const { rataRata, keterangan } = calculateStatus(
      data.nilaiMatematika,
      data.nilaiInggris,
      data.nilaiUmum
    );

    if (editingId) {
      setStudents(prev => prev.map(s => s.id === editingId ? {
        ...s,
        namaPendaftaran: data.namaPendaftaran,
        jenisKelamin: data.jenisKelamin,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        asalSekolah: data.asalSekolah,
        pekerjaanOrtu: data.pekerjaanOrtu,
        nilaiMatematika: data.nilaiMatematika,
        nilaiInggris: data.nilaiInggris,
        nilaiUmum: data.nilaiUmum,
        rataRata,
        keterangan,
        tempatTes: PLACES[data.tempatTesKey],
        gelombang: `Gelombang ${data.gelombangNum}`,
        bulanTes: MONTHS[data.bulanTesIndex - 1]
      } : s));
      onShowToast(`Berhasil memperbarui ${data.namaPendaftaran}!`);
      setEditingId(null);
    } else {
      const newStudent: Student = {
        id: Math.random().toString(36).substr(2, 9),
        kodePendaftaran: generatedCode,
        namaPendaftaran: data.namaPendaftaran,
        jenisKelamin: data.jenisKelamin,
        tempatLahir: data.tempatLahir,
        tanggalLahir: data.tanggalLahir,
        asalSekolah: data.asalSekolah,
        pekerjaanOrtu: data.pekerjaanOrtu,
        nilaiMatematika: data.nilaiMatematika,
        nilaiInggris: data.nilaiInggris,
        nilaiUmum: data.nilaiUmum,
        rataRata,
        keterangan,
        tempatTes: PLACES[data.tempatTesKey],
        gelombang: `Gelombang ${data.gelombangNum}`,
        bulanTes: MONTHS[data.bulanTesIndex - 1]
      };
      setStudents(prev => [newStudent, ...prev]);
      onShowToast(`Berhasil menambahkan ${data.namaPendaftaran}!`);
    }
    reset();
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 className="card-title" style={{ margin: 0 }}>{editingId ? 'Edit Data' : 'Input Data'}</h2>
        <div style={{ background: 'var(--primary)', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 600 }}>
          {editingId ? 'EDITING' : `COUNT: ${students.length}`}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="namaPendaftaran">Nama Pendaftar</label>
          <input 
            id="namaPendaftaran"
            type="text" 
            {...register('namaPendaftaran')}
            className={`form-control ${errors.namaPendaftaran ? 'is-invalid' : ''}`}
          />
          {errors.namaPendaftaran && <span className="error-text">{errors.namaPendaftaran.message}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="jenisKelamin">Jenis Kelamin</label>
            <select id="jenisKelamin" {...register('jenisKelamin')} className="form-control">
              <option value="Laki-Laki">Laki-Laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="asalSekolah">Asal Sekolah</label>
            <input 
              id="asalSekolah"
              type="text" 
              {...register('asalSekolah')}
              className={`form-control ${errors.asalSekolah ? 'is-invalid' : ''}`}
            />
            {errors.asalSekolah && <span className="error-text">{errors.asalSekolah.message}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tempatLahir">Tempat Lahir</label>
            <input id="tempatLahir" type="text" {...register('tempatLahir')} className={`form-control ${errors.tempatLahir ? 'is-invalid' : ''}`} />
            {errors.tempatLahir && <span className="error-text">{errors.tempatLahir.message}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="tanggalLahir">Tanggal Lahir</label>
            <input id="tanggalLahir" type="date" {...register('tanggalLahir')} className={`form-control ${errors.tanggalLahir ? 'is-invalid' : ''}`} />
            {errors.tanggalLahir && <span className="error-text">{errors.tanggalLahir.message}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="pekerjaanOrtu">Pekerjaan Orang Tua</label>
          <select id="pekerjaanOrtu" {...register('pekerjaanOrtu')} className="form-control">
            {JOBS.map(job => <option key={job} value={job}>{job}</option>)}
          </select>
        </div>

        <div className="card" style={{ background: 'rgba(99, 102, 241, 0.03)', padding: '1rem', marginBottom: '1.5rem', border: '1px dashed var(--primary)' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary)' }}>Konfigurasi Pendaftaran</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tempatTesKey">Tempat Tes</label>
              <select id="tempatTesKey" {...register('tempatTesKey')} className="form-control">
                <option value="A">Gedung A</option>
                <option value="B">Gedung B</option>
                <option value="V">Viktor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="gelombangNum">Gelombang</label>
              <select id="gelombangNum" {...register('gelombangNum')} className="form-control">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="bulanTesIndex">Bulan Tes</label>
            <select id="bulanTesIndex" {...register('bulanTesIndex', { valueAsNumber: true })} className="form-control">
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
              <label htmlFor="nilaiMatematika">Matematika</label>
              <input id="nilaiMatematika" type="number" {...register('nilaiMatematika', { valueAsNumber: true })} className="form-control" min="0" max="100" />
            </div>
            <div className="form-group">
              <label htmlFor="nilaiInggris">Bhs. Inggris</label>
              <input id="nilaiInggris" type="number" {...register('nilaiInggris', { valueAsNumber: true })} className="form-control" min="0" max="100" />
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label htmlFor="nilaiUmum">Umum</label>
            <input id="nilaiUmum" type="number" {...register('nilaiUmum', { valueAsNumber: true })} className="form-control" min="0" max="100" />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editingId ? 'UPDATE' : 'SIMPAN'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); reset(); }}>BATAL</button>
        </div>
      </form>
    </div>
  );
};
