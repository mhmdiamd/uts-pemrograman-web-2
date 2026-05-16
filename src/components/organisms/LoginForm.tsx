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
  const [showPassword, setShowPassword] = React.useState(false);
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
            placeholder="Masukkan username"
          />
          {errors.username && <span className="error-text">{errors.username.message}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input-container">
            <input 
              id="password"
              type={showPassword ? "text" : "password"} 
              {...register('password')}
              className={`form-control ${errors.password ? 'is-invalid' : ''}`}
              style={{ paddingRight: '2.5rem' }}
              placeholder="Masukkan password"
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
