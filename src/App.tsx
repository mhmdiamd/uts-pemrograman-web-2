import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { Blob, Toast } from './components/atoms';
import { LoginForm, ForgotPasswordForm, StudentForm, StudentTable, StatsGrid, NavBar } from './components/organisms';
import type { Student } from './types';

const App: React.FC = () => {
  const {
    currentUser, setCurrentUser,
    users, setUsers,
    authView, setAuthView,
    students, setStudents,
    editingId, setEditingId,
    generatedCode, setGeneratedCode,
    toast,
    showToast, handleLogout, deleteStudent, stats
  } = useAppLogic();

  // --- RENDER HELPERS ---
  if (!currentUser) {
    return (
      <div className="container">
        <Blob className="blob-1" />
        <Blob className="blob-2" />
        
        <header className="animate-in">
          <h1>Tugas Testing QA</h1>
          <p>Sistem Pendaftaran Mahasiswa</p>
        </header>

        <div className="auth-container animate-in">
          {authView === 'login' ? (
            <LoginForm 
              users={users} 
              onSuccess={setCurrentUser} 
              onShowToast={showToast} 
              onSwitchView={() => setAuthView('forgot')} 
            />
          ) : (
            <ForgotPasswordForm 
              users={users} 
              setUsers={setUsers} 
              onShowToast={showToast} 
              onSwitchView={() => setAuthView('login')} 
            />
          )}
        </div>

        {toast.visible && <Toast message={toast.message} hiding={toast.hiding} />}
      </div>
    );
  }

  const handleEdit = (student: Student) => {
    setEditingId(student.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <Blob className="blob-1" />
      <Blob className="blob-2" />

      <NavBar user={currentUser} onLogout={handleLogout} />

      <header className="animate-in">
        <h1>Tugas Testing QA</h1>
        <p>Manajemen Pendaftaran Mahasiswa</p>
      </header>

      <main className="app-grid">
        <section className="animate-in" style={{ animationDelay: '0.1s' }}>
          <StudentForm 
            students={students}
            setStudents={setStudents}
            editingId={editingId}
            setEditingId={setEditingId}
            generatedCode={generatedCode}
            setGeneratedCode={setGeneratedCode}
            onShowToast={showToast}
          />
        </section>

        <section className="animate-in" style={{ animationDelay: '0.2s' }}>
          <StatsGrid 
            total={stats.total} 
            lulus={stats.lulus} 
            tidakLulus={stats.tidakLulus} 
          />
          <StudentTable 
            students={students} 
            onEdit={handleEdit} 
            onDelete={deleteStudent} 
          />
        </section>
      </main>
      
      <footer className="footer animate-in">
        <p>Created by <strong>Muhamad Ilham & Oktaviyanus</strong></p>
        <p>Tugas Testing & QA | Kelas : 07TPLE001</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.6 }}>&copy; 2026 Tugas Testing QA</p>
      </footer>

      {toast.visible && <Toast message={toast.message} hiding={toast.hiding} />}
    </div>
  );
};

export default App;
