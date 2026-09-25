import React, { useEffect, useState } from 'react';
import api from '../services/api';

const RolesPage = () => {
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    api.get('/getroles')
      .then(res => setRoles(res.data.data))
      .catch(err => console.log('Backend no conectado aún'));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestión de Roles</h2>
        <button className="glass-button" style={{ width: 'auto' }}>+ Nuevo Rol</button>
      </div>

      <div className="glass-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? roles.map((r: any) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.role_code}</td>
                <td>{r.descripcion}</td>
                <td>
                  <span className={r.active === 1 ? 'badge badge-success' : 'badge badge-danger'}>
                    {r.active === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No hay roles registrados o el backend está desconectado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolesPage;
