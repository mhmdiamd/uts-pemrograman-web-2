import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '../../types';

const forgotPasswordSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface Props {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onShowToast: (msg: string) => void;
  onSwitchView: () => void;
}

export const ForgotPasswordForm: React.FC<Props> = ({ users, setUsers, onShowToast, onSwitchView }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onForgot = (data: ForgotPasswordFormValues) => {
    const userIndex = users.findIndex(u => u.username === data.username && u.fullName.toLowerCase() === data.fullName.toLowerCase());
    
    if (userIndex !== -1) {
      const updatedUsers = [...users];
      updatedUsers[userIndex].password = data.newPassword;
      setUsers(updatedUsers);
      onShowToast("Password berhasil diperbarui! Silakan login.");
      onSwitchView();
      reset();
    } else {
      onShowToast("Data tidak cocok! Harap cek username dan nama lengkap.");
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Lupa Password</h2>
        <p>Reset password admin Anda</p>
      </div>
      <form onSubmit={handleSubmit(onForgot)}>
        <div className="form-group">
          <label htmlFor="forgot-username">Username</label>
          <input 
            id="forgot-username"
            type="text" 
            {...register('username')}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            placeholder="Masukkan username"
          />
          {errors.username && <span className="error-text">{errors.username.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="forgot-fullName">Nama Lengkap</label>
          <input 
            id="forgot-fullName"
            type="text" 
            {...register('fullName')}
            className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
            placeholder="Masukkan nama lengkap Anda"
          />
          {errors.fullName && <span className="error-text">{errors.fullName.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="forgot-newPassword">Password Baru</label>
          <div className="password-input-container">
            <input 
              id="forgot-newPassword"
              type={showPassword ? "text" : "password"} 
              {...register('newPassword')}
              className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
              placeholder="Masukkan password baru"
              style={{ paddingRight: '2.5rem' }}
            />
            <button 
              type="button" 
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          {errors.newPassword && <span className="error-text">{errors.newPassword.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          RESET PASSWORD
        </button>
        <div className="auth-switch">
          <span className="auth-link" onClick={onSwitchView}>Kembali ke Login</span>
        </div>
      </form>
    </div>
  );
};
