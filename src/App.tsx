import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Users, Building2, Landmark, ShieldCheck, LogOut } from 'lucide-react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import RolesPage from './pages/Roles';
import LocalsPage from './pages/Locals';
import TransfersPage from './pages/Transfers';
import './index.css';

// Auth Context
const AuthContext = createContext<{ user: any, login: (u: any) => void, logout: () => void } | null>(null);

export const useAuth = () => useContext(AuthContext)!;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  
  const login = (u: any) => setUser(u);
  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// Layout Component
const Layout = () => {
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <div className="app-container">
      <nav className="sidebar glass-panel">
        <h1>AppKami</h1>
        
        <Link to="/" className={`nav-item ${isActive('/')}`}>
          <Landmark size={20} /> Dashboard
        </Link>
        <Link to="/users" className={`nav-item ${isActive('/users')}`}>
          <Users size={20} /> Usuarios
        </Link>
        <Link to="/roles" className={`nav-item ${isActive('/roles')}`}>
          <ShieldCheck size={20} /> Roles
        </Link>
        <Link to="/locals" className={`nav-item ${isActive('/locals')}`}>
          <Building2 size={20} /> Locales
        </Link>
        <Link to="/transfers" className={`nav-item ${isActive('/transfers')}`}>
          <Landmark size={20} /> Transferencias
        </Link>

        <div style={{ flex: 1 }}></div>
        <button className="nav-item" onClick={logout} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#f87171' }}>
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </nav>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// Protected Route Wrapper
const ProtectedRoute = () => {
  const { user } = useAuth();
  return user ? <Layout /> : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/locals" element={<LocalsPage />} />
            <Route path="/transfers" element={<TransfersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
