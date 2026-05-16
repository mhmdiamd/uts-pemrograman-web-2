import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { User } from '../../types';

const loginSchema = z.object({
  username: z.string().min(3, 'Username minimal 3 karakter'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface Props {
  users: User[];
  onSuccess: (user: User) => void;
  onShowToast: (msg: string) => void;
  onSwitchView: () => void;
}

export const LoginForm: React.FC<Props> = ({ users, onSuccess, onShowToast, onSwitchView }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    const user = users.find(u => u.username === data.username && u.password === data.password);
    if (user) {
      onSuccess(user);
      onShowToast(`Selamat datang, ${user.fullName}!`);
      reset();
    } else {
      onShowToast("Username atau password salah!");
    }
  };

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Masuk</h2>
        <p>Silakan login untuk mengelola data</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            id="username"
            type="text" 
            {...register('username')}
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
          />
          {errors.username && <span className="error-text">{errors.username.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            id="password"
            type="password" 
            {...register('password')}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
          />
          {errors.password && <span className="error-text">{errors.password.message}</span>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          MASUK
        </button>
        <div className="auth-switch">
          <span className="auth-link" onClick={onSwitchView}>Lupa Password?</span>
        </div>
      </form>
    </div>
  );
};
