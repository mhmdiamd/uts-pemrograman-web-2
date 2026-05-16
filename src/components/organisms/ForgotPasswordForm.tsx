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
          <input 
            id="forgot-newPassword"
            type="password" 
            {...register('newPassword')}
            className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
            placeholder="Masukkan password baru"
          />
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
