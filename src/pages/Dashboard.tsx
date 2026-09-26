import React, { useEffect, useState } from 'react';
import { Users, Building2, Landmark, ShieldCheck } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState({
    usersCount: 0,
    localsCount: 0,
    transfersSum: 0,
    rolesCount: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, localsRes, transfersRes, rolesRes] = await Promise.all([
          api.get('/getusers'),
          api.get('/getlocals'),
          api.get('/gettransfers'),
          api.get('/getroles')
        ]);

        const users = usersRes.data.data || [];
        const locals = localsRes.data.data || [];
        const transfers = transfersRes.data.data || [];
        const roles = rolesRes.data.data || [];

        const activeLocalsCount = locals.filter((l: any) => l.active === 1).length;
        
        const totalTransfers = transfers.reduce((acc: number, t: any) => acc + parseFloat(t.monto || 0), 0);

        setData({
          usersCount: users.length,
          localsCount: activeLocalsCount,
          transfersSum: totalTransfers,
          rolesCount: roles.length
        });
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(value);
  };

  const stats = [
    { label: 'Total Usuarios', value: data.usersCount.toString(), icon: <Users size={24} color="#60a5fa" /> },
    { label: 'Locales Activos', value: data.localsCount.toString(), icon: <Building2 size={24} color="#a78bfa" /> },
    { label: 'Transferencias', value: formatCurrency(data.transfersSum), icon: <Landmark size={24} color="#34d399" /> },
    { label: 'Roles de Sistema', value: data.rolesCount.toString(), icon: <ShieldCheck size={24} color="#fbbf24" /> },
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
