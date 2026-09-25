import React from 'react';
import { Users, Building2, Landmark, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Total Usuarios', value: '1,248', icon: <Users size={24} color="#60a5fa" /> },
    { label: 'Locales Activos', value: '12', icon: <Building2 size={24} color="#a78bfa" /> },
    { label: 'Transferencias (Mes)', value: '$42,500', icon: <Landmark size={24} color="#34d399" /> },
    { label: 'Roles de Sistema', value: '5', icon: <ShieldCheck size={24} color="#fbbf24" /> },
  ];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Dashboard General</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, marginBottom: 40 }}>
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ padding: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 600 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-panel" style={{ padding: 24, minHeight: 400 }}>
        <h3>Actividad Reciente</h3>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Módulo de estadísticas en construcción.</p>
      </div>
    </div>
  );
};

export default Dashboard;
