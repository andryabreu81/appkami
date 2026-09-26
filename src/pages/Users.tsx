import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Swal from 'sweetalert2';

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
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

  const fetchRoles = () => {
    api.get('/getroles')
      .then(res => setRoles(res.data.data || []))
      .catch(err => console.log('Error al obtener roles', err));
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
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
        Swal.fire('¡Actualizado!', 'El usuario ha sido actualizado correctamente.', 'success');
      } else {
        await api.post('/addusers', formData);
        Swal.fire('¡Agregado!', 'El usuario ha sido agregado correctamente.', 'success');
      }
      setIsModalOpen(false);
      fetchUsers(); // Recargamos la tabla
    } catch (error) {
      console.error("Error al guardar el usuario", error);
      Swal.fire('Error', 'Ocurrió un error al guardar el usuario', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡El usuario será eliminado permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/deleteuser/${id}`);
        fetchUsers();
        Swal.fire('¡Eliminado!', 'El usuario ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error al eliminar usuario", error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el usuario', 'error');
      }
    }
  };

  const handleToggleActive = async (user: any) => {
    const newActiveStatus = user.active === 1 ? 0 : 1;
    try {
      await api.put('/updateuser', { userId: user.id, active: newActiveStatus });
      fetchUsers();
      Swal.fire({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        icon: 'success',
        title: 'Estado actualizado'
      });
    } catch (error) {
      console.error("Error al actualizar estado", error);
      Swal.fire('Error', 'Ocurrió un error al actualizar el estado del usuario', 'error');
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
                  <button
                    onClick={() => handleToggleActive(u)}
                    className={u.active === 1 ? 'badge badge-success' : 'badge badge-danger'}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      fontFamily: 'inherit'
                    }}
                    title={u.active === 1 ? 'Desactivar' : 'Activar'}
                  >
                    {u.active === 1 ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {u.active === 1 ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => openEditModal(u)} title="Editar">
                    <Edit size={14} /> Editar
                  </button>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleDelete(u.id)} title="Eliminar">
                    <Trash2 size={14} /> Eliminar
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
                <label style={labelStyle}>Rol del Usuario</label>
                {/* <input style={inputStyle} type="number" name="role_id" value={formData.role_id} onChange={handleInputChange} required /> */}
                <select name="role_id" id="" value={formData.role_id} onChange={handleInputChange} style={inputStyle} required >
                  <option value="">Seleccione..</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.descripcion}</option>
                  ))}
                </select>
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
