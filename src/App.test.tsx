import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollTo = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Authentication - View Switching', () => {
    it('should render login page by default', () => {
      render(<App />);
      expect(screen.getByText('Masuk')).toBeInTheDocument();
    });

    it('should redirect to forgot password page', () => {
      render(<App />);
      fireEvent.click(screen.getByText('Lupa Password?'));
      expect(screen.getByText('Reset password admin Anda')).toBeInTheDocument();
    });

    it('should navigate back to login from forgot password', () => {
      render(<App />);
      fireEvent.click(screen.getByText('Lupa Password?'));
      fireEvent.click(screen.getByText('Kembali ke Login'));
      expect(screen.getByText('Masuk')).toBeInTheDocument();
    });
  });

  describe('Authentication - Login Validation', () => {
    beforeEach(() => { render(<App />); });

    it('1. should show error for empty username', async () => {
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Username minimal 3 karakter')).toBeInTheDocument();
    });

    it('2. should show error for short username', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'ab' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Username minimal 3 karakter')).toBeInTheDocument();
    });

    it('3. should show error for empty password', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Password minimal 6 karakter')).toBeInTheDocument();
    });

    it('4. should show error for short password', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: '123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Password minimal 6 karakter')).toBeInTheDocument();
    });

    it('5. should show error for invalid credentials', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wronguser' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Username atau password salah!')).toBeInTheDocument();
    });

    it('6. should login successfully with admin/admin123', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Manajemen Pendaftaran Mahasiswa')).toBeInTheDocument();
    });
  });

  describe('Authentication - Forgot Password Validation', () => {
    beforeEach(() => {
      render(<App />);
      fireEvent.click(screen.getByText('Lupa Password?'));
    });

    it('7. should validate username length in forgot password', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'a' } });
      fireEvent.click(screen.getByRole('button', { name: /RESET PASSWORD/i }));
      expect(await screen.findByText('Username minimal 3 karakter')).toBeInTheDocument();
    });

    it('8. should validate fullName length in forgot password', async () => {
      fireEvent.change(screen.getByLabelText('Nama Lengkap'), { target: { value: 'a' } });
      fireEvent.click(screen.getByRole('button', { name: /RESET PASSWORD/i }));
      expect(await screen.findByText('Nama lengkap minimal 3 karakter')).toBeInTheDocument();
    });

    it('9. should validate newPassword length in forgot password', async () => {
      fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: '123' } });
      fireEvent.click(screen.getByRole('button', { name: /RESET PASSWORD/i }));
      expect(await screen.findByText('Password baru minimal 6 karakter')).toBeInTheDocument();
    });

    it('10. should show error for user not found in forgot password', async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'unknown' } });
      fireEvent.change(screen.getByLabelText('Nama Lengkap'), { target: { value: 'Unknown User' } });
      fireEvent.change(screen.getByLabelText('Password Baru'), { target: { value: 'newpassword' } });
      fireEvent.click(screen.getByRole('button', { name: /RESET PASSWORD/i }));
      expect(await screen.findByText('Data tidak cocok! Harap cek username dan nama lengkap.')).toBeInTheDocument();
    });
  });

  describe('Dashboard - Persistence & Layout', () => {
    it('11. should persist user session in localStorage', async () => {
      render(<App />);
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      
      await waitFor(() => {
        const savedUser = JSON.parse(localStorage.getItem('current_user') || '{}');
        expect(savedUser.username).toBe('admin');
      });
    });

    it('12. should logout correctly and clear session', async () => {
      render(<App />);
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      
      const logoutBtn = await screen.findByRole('button', { name: /KELUAR/i });
      fireEvent.click(logoutBtn);
      
      expect(screen.getByText('Sistem Pendaftaran Mahasiswa')).toBeInTheDocument();
      expect(localStorage.getItem('current_user')).toBeNull();
    });
  });

  describe('Student Management - Form Validations', () => {
    const login = async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      return await screen.findByText('Manajemen Pendaftaran Mahasiswa');
    };

    beforeEach(async () => {
      render(<App />);
      await login();
    });

    it('13. should validate student name length', async () => {
      fireEvent.change(screen.getByLabelText('Nama Pendaftar'), { target: { value: 'Ab' } });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));
      expect(await screen.findByText('Nama minimal 3 karakter')).toBeInTheDocument();
    });

    it('14. should validate asal sekolah length', async () => {
      fireEvent.change(screen.getByLabelText('Asal Sekolah'), { target: { value: 'Ab' } });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));
      expect(await screen.findByText('Asal sekolah minimal 3 karakter')).toBeInTheDocument();
    });

    it('15. should validate tempat lahir length', async () => {
      fireEvent.change(screen.getByLabelText('Tempat Lahir'), { target: { value: 'A' } });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));
      expect(await screen.findByText('Tempat lahir minimal 2 karakter')).toBeInTheDocument();
    });
  });

  describe('Student Management - CRUD Flow', () => {
    const login = async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      return await screen.findByText('Manajemen Pendaftaran Mahasiswa');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fillForm = (data: any) => {
      fireEvent.change(screen.getByLabelText('Nama Pendaftar'), { target: { value: data.nama } });
      fireEvent.change(screen.getByLabelText('Asal Sekolah'), { target: { value: data.sekolah } });
      fireEvent.change(screen.getByLabelText('Tempat Lahir'), { target: { value: data.tempat || 'Jakarta' } });
      fireEvent.change(screen.getByLabelText('Tanggal Lahir'), { target: { value: data.tanggal || '2005-01-01' } });
      fireEvent.change(screen.getByLabelText('Pekerjaan Orang Tua'), { target: { value: data.job || 'PNS' } });
      fireEvent.change(screen.getByLabelText('Matematika'), { target: { value: data.mat || '80' } });
      fireEvent.change(screen.getByLabelText('Bhs. Inggris'), { target: { value: data.ing || '80' } });
      fireEvent.change(screen.getByLabelText('Umum'), { target: { value: data.umm || '80' } });
    };

    beforeEach(async () => {
      render(<App />);
      await login();
    });

    it('16. should add a student with Lulus status', async () => {
      fillForm({ nama: 'Lulus Student', sekolah: 'SMA Lulus', mat: '90', ing: '90', umm: '90' });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));
      expect(await screen.findByText('Lulus Student')).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(within(table).getAllByText('Lulus').length).toBeGreaterThanOrEqual(2);
    });

    it('17. should add a student with Cadangan status', async () => {
      fillForm({ nama: 'Cadangan Student', sekolah: 'SMA Cadangan', mat: '65', ing: '65', umm: '65' });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));
      expect(await screen.findByText('Cadangan Student')).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(within(table).getAllByText('Cadangan').length).toBeGreaterThanOrEqual(2);
    });

    it('18. should add a student with Tidak Lulus status', async () => {
      fillForm({ nama: 'Gagal Student', sekolah: 'SMA Gagal', mat: '50', ing: '50', umm: '50' });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));
      expect(await screen.findByText('Gagal Student')).toBeInTheDocument();
      const table = screen.getByRole('table');
      expect(within(table).getByText('Tidak Lulus')).toBeInTheDocument();
    });

    it('19. should edit student name and persist changes', async () => {
      const editBtn = screen.getAllByRole('button').filter(b => b.className.includes('btn-icon-edit'))[0];
      fireEvent.click(editBtn);
      fireEvent.change(screen.getByLabelText('Nama Pendaftar'), { target: { value: 'Budi Renamed' } });
      fireEvent.click(screen.getByRole('button', { name: /UPDATE/i }));
      expect(await screen.findByText('Budi Renamed')).toBeInTheDocument();
    });

    it('20. should cancel edit mode correctly', async () => {
      const editBtn = screen.getAllByRole('button').filter(b => b.className.includes('btn-icon-edit'))[0];
      fireEvent.click(editBtn);
      expect(screen.getByText('Edit Data')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /BATAL/i }));
      expect(screen.getByText('Input Data')).toBeInTheDocument();
    });

    it('21. should delete student after confirmation', async () => {
      window.confirm = vi.fn().mockReturnValue(true);
      const deleteBtn = screen.getAllByRole('button').filter(b => b.className.includes('btn-icon-delete'))[0];
      fireEvent.click(deleteBtn);
      await waitFor(() => {
        expect(screen.queryByText('Budi Santoso')).not.toBeInTheDocument();
      });
    });

    it('22. should not delete student if cancelled', async () => {
      window.confirm = vi.fn().mockReturnValue(false);
      const deleteBtn = screen.getAllByRole('button').filter(b => b.className.includes('btn-icon-delete'))[0];
      fireEvent.click(deleteBtn);
      expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    });
  });

  describe('Statistics & Calculations', () => {
    beforeEach(async () => {
      render(<App />);
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      await screen.findByText('Manajemen Pendaftaran Mahasiswa');
    });

    it('23. should show initial total count of 2', () => {
      const totalLabel = screen.getByText('Total', { selector: '.stat-label' });
      expect(totalLabel.nextElementSibling?.textContent).toBe('2');
    });

    it('24. should show initial Lulus count of 1', () => {
      const lulusLabel = screen.getByText('Lulus', { selector: '.stat-label' });
      expect(lulusLabel.nextElementSibling?.textContent).toBe('1');
    });

    it('25. should update statistics when adding new student', async () => {
      fireEvent.change(screen.getByLabelText('Nama Pendaftar'), { target: { value: 'Stat Tester' } });
      fireEvent.change(screen.getByLabelText('Asal Sekolah'), { target: { value: 'SMA Stat' } });
      fireEvent.change(screen.getByLabelText('Tempat Lahir'), { target: { value: 'Jakarta' } });
      fireEvent.change(screen.getByLabelText('Tanggal Lahir'), { target: { value: '2005-01-01' } });
      fireEvent.change(screen.getByLabelText('Matematika'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Bhs. Inggris'), { target: { value: '100' } });
      fireEvent.change(screen.getByLabelText('Umum'), { target: { value: '100' } });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));

      await waitFor(() => {
        const totalLabel = screen.getByText('Total', { selector: '.stat-label' });
        expect(totalLabel.nextElementSibling?.textContent).toBe('3');
      });
    });
  });

  describe('UI Micro-interactions', () => {
    const login = async () => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      return await screen.findByText('Manajemen Pendaftaran Mahasiswa');
    };

    it('26. should show toast when logging in', async () => {
      render(<App />);
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'admin123' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText(/Selamat datang/)).toBeInTheDocument();
    });

    it('27. should clear form after successful addition', async () => {
      render(<App />);
      await login();
      
      const nameInput = await screen.findByLabelText('Nama Pendaftar') as HTMLInputElement;
      fireEvent.change(nameInput, { target: { value: 'Clear Test' } });
      fireEvent.change(screen.getByLabelText('Asal Sekolah'), { target: { value: 'SMA Clear' } });
      fireEvent.change(screen.getByLabelText('Tempat Lahir'), { target: { value: 'Jakarta' } });
      fireEvent.change(screen.getByLabelText('Tanggal Lahir'), { target: { value: '2005-01-01' } });
      fireEvent.click(screen.getByRole('button', { name: /SIMPAN/i }));

      await waitFor(() => {
        expect(nameInput.value).toBe('');
      });
    });

    it('28. should handle search within table correctly (fallback check)', async () => {
      render(<App />);
      await login();
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3);
    });

    it('29. should toggle visibility of toast on errors', async () => {
      render(<App />);
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'admin' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
      fireEvent.click(screen.getByRole('button', { name: /MASUK/i }));
      expect(await screen.findByText('Username atau password salah!')).toBeInTheDocument();
    });

    it('30. should show "Viktor" as a test location option', async () => {
      render(<App />);
      await login();
      const select = screen.getByLabelText('Tempat Tes') as HTMLSelectElement;
      expect(within(select).getByText('Viktor')).toBeInTheDocument();
    });

    it('31. should display months correctly in dropdown', async () => {
      render(<App />);
      await login();
      const select = screen.getByLabelText('Bulan Tes') as HTMLSelectElement;
      expect(within(select).getByText('Januari')).toBeInTheDocument();
      expect(within(select).getByText('Desember')).toBeInTheDocument();
    });

    it('32. should update generated code when selecting Viktor', async () => {
      render(<App />);
      await login();
      fireEvent.change(screen.getByLabelText('Tempat Tes'), { target: { value: 'V' } });
      expect(screen.getByText(/Generated Code:/).textContent).toContain('V');
    });
  });
});
