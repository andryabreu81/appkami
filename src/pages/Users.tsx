import React, { useEffect, useState } from 'react';
import api from '../services/api';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    role_id: 1,
    password: ''
  });

  const fetchUsers = () => {
    api.get('/getusers')
      .then(res => setUsers(res.data.data || []))
      .catch(err => console.log('Backend no conectado aún', err));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'role_id' ? parseInt(value) : value 
    });
  };

  const openAddModal = () => {
    setFormData({ name: '', lastname: '', email: '', role_id: 1, password: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setFormData({
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      role_id: user.role_id || (user.role && user.role.id) || 1,
      password: '' // Se deja vacío para que sea opcional
    });
    setEditingId(user.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Estructura de actualización que requiere tu controlador en NestJS
        const payload: any = { ...formData, userId: editingId };
        if (!payload.password) {
          delete payload.password; // Si no escribe contraseña nueva, no la enviamos
        }
        await api.put('/updateuser', payload);
      } else {
        await api.post('/addusers', formData);
      }
      setIsModalOpen(false);
      fetchUsers(); // Recargamos la tabla
    } catch (error) {
      console.error("Error al guardar el usuario", error);
      alert("Ocurrió un error al guardar el usuario");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      try {
        await api.delete(`/deleteuser/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Error al eliminar usuario", error);
        alert("Ocurrió un error al eliminar el usuario");
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestión de Usuarios</h2>
        <button className="glass-button" style={{ width: 'auto' }} onClick={openAddModal}>
          + Nuevo Usuario
        </button>
      </div>

      <div className="glass-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th> {/* <-- Nueva columna añadida */}
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map((u: any) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.lastname}</td>
                <td>{u.email}</td>
                <td>{u.role?.descripcion || 'Sin rol'}</td>
                <td>
                  <span className={u.active === 1 ? 'badge badge-success' : 'badge badge-danger'}>
                    {u.active === 1 ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => openEditModal(u)}>
                    Editar
                  </button>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#ef4444', color: '#ef4444' }} onClick={() => handleDelete(u.id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No hay usuarios registrados o el backend está desconectado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal emergente para Agregar y Editar */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className="glass-table-container">
            <h3>{editingId ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={labelStyle}>Nombre</label>
                <input style={inputStyle} type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>Apellido</label>
                <input style={inputStyle} type="text" name="lastname" value={formData.lastname} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>ID del Rol</label>
                <input style={inputStyle} type="number" name="role_id" value={formData.role_id} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>{editingId ? 'Nueva Contraseña (opcional)' : 'Contraseña'}</label>
                <input style={inputStyle} type="password" name="password" value={formData.password} onChange={handleInputChange} required={!editingId} />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' }}>
                <button type="button" className="glass-button" onClick={() => setIsModalOpen(false)}>Cancelar</button>
                <button type="submit" className="glass-button" style={{ backgroundColor: 'rgba(99, 102, 241, 0.2)' }}>Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos en línea para aislar el diseño del modal
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#1e293b',
  padding: '30px',
  borderRadius: '12px',
  width: '100%',
  maxWidth: '450px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.1)'
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontSize: '14px',
  color: '#94a3b8'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #334155',
  backgroundColor: 'rgba(15, 23, 42, 0.5)',
  color: 'white',
  boxSizing: 'border-box',
  outline: 'none'
};

export default UsersPage;
