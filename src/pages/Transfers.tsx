import React, { useEffect, useState } from 'react';
import api from '../services/api';

const TransfersPage = () => {
  const [transfers, setTransfers] = useState<any[]>([]);

  useEffect(() => {
    api.get('/gettransfers')
      .then(res => setTransfers(res.data.data))
      .catch(err => console.log('Backend no conectado aún'));
  }, []);

  const formatCurrency = (val: string) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(Number(val));
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Transferencias</h2>
        <button className="glass-button" style={{ width: 'auto' }}>+ Nueva Transferencia</button>
      </div>

      <div className="glass-table-container">
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Empleado</th>
              <th>Local</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {transfers.length > 0 ? transfers.map((t: any) => (
              <tr key={t.id}>
                <td>{new Date(t.fecha).toLocaleDateString()}</td>
                <td>{t.employee ? `${t.employee.nombre} ${t.employee.apellido}` : 'Desconocido'}</td>
                <td>{t.local?.name || 'Desconocido'}</td>
                <td>{t.tipo_pago}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(t.monto)}</td>
                <td>
                  <span className={t.estado === 'Aprobada' ? 'badge badge-success' : t.estado === 'Pendiente' ? 'badge badge-warning' : 'badge badge-danger'}>
                    {t.estado}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No hay transferencias o el backend está desconectado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransfersPage;
