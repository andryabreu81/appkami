import React, { useEffect, useState } from 'react';
import api from '../services/api';

const LocalsPage = () => {
  const [locals, setLocals] = useState<any[]>([]);

  useEffect(() => {
    api.get('/getlocals')
      .then(res => setLocals(res.data.data))
      .catch(err => console.log('Backend no conectado aún'));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestión de Locales</h2>
        <button className="glass-button" style={{ width: 'auto' }}>+ Nuevo Local</button>
      </div>

      <div className="glass-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Administrador</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {locals.length > 0 ? locals.map((l: any) => (
              <tr key={l.id}>
                <td>{l.id}</td>
                <td>{l.name}</td>
                <td>{l.address}</td>
                <td>{l.user ? `${l.user.name} ${l.user.lastname}` : 'Sin Asignar'}</td>
                <td>
                  <span className={l.active === 1 ? 'badge badge-success' : 'badge badge-danger'}>
                    {l.active === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No hay locales registrados o el backend está desconectado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LocalsPage;
