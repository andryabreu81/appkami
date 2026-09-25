import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simular API Login
    if (email && password) {
      login({ name: 'Admin', email });
      navigate('/');
    }
  };

  return (
    <div className="login-wrapper">
      <div className="glass-panel login-box">
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <ShieldCheck size={48} color="#3b82f6" />
        </div>
        <h2>Bienvenido a AppKami</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Ingresa tus credenciales para continuar</p>
        
        <form onSubmit={handleLogin} className="flex-col" style={{ gap: 20, marginTop: 16 }}>
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            className="glass-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            className="glass-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="glass-button">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
