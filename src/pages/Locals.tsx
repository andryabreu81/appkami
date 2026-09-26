import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Swal from 'sweetalert2';

const LocalsPage = () => {
  const [locals, setLocals] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    user_id: ''
  });

  const fetchLocals = () => {
    api.get('/getlocals')
      .then(res => setLocals(res.data.data || []))
      .catch(err => console.log('Backend no conectado aún'));
  };

  const fetchUsers = () => {
    api.get('/getusers')
      .then(res => setUsers(res.data.data || []))
      .catch(err => console.log('Error al cargar usuarios'));
  };

  useEffect(() => {
    fetchLocals();
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ 
      ...formData, 
      [name]: name === 'user_id' ? parseInt(value) || '' : value 
    });
  };

  const openAddModal = () => {
    setFormData({ name: '', address: '', user_id: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (local: any) => {
    setFormData({
      name: local.name,
      address: local.address,
      user_id: local.user?.id || ''
    });
    setEditingId(local.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put('/updatelocal', { ...formData, localId: editingId });
        Swal.fire('¡Actualizado!', 'El local ha sido actualizado correctamente.', 'success');
      } else {
        await api.post('/addlocal', formData);
        Swal.fire('¡Agregado!', 'El local ha sido agregado correctamente.', 'success');
      }
      setIsModalOpen(false);
      fetchLocals();
    } catch (error) {
      console.error("Error al guardar el local", error);
      Swal.fire('Error', 'Ocurrió un error al guardar el local', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡El local será eliminado permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/deletelocal/${id}`);
        fetchLocals();
        Swal.fire('¡Eliminado!', 'El local ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error al eliminar local", error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el local', 'error');
      }
    }
  };

  const handleToggleActive = async (local: any) => {
    const newActiveStatus = local.active === 1 ? 0 : 1;
    try {
      await api.put('/updatelocal', { localId: local.id, active: newActiveStatus });
      fetchLocals();
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
      Swal.fire('Error', 'Ocurrió un error al actualizar el estado del local', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestión de Locales</h2>
        <button className="glass-button" style={{ width: 'auto' }} onClick={openAddModal}>
          + Nuevo Local
        </button>
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
              <th>Acciones</th>
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
                  <button
                    onClick={() => handleToggleActive(l)}
                    className={l.active === 1 ? 'badge badge-success' : 'badge badge-danger'}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      fontFamily: 'inherit'
                    }}
                    title={l.active === 1 ? 'Desactivar' : 'Activar'}
                  >
                    {l.active === 1 ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {l.active === 1 ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => openEditModal(l)} title="Editar">
                    <Edit size={14} /> Editar
                  </button>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleDelete(l.id)} title="Eliminar">
                    <Trash2 size={14} /> Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No hay locales registrados o el backend está desconectado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className="glass-table-container">
            <h3>{editingId ? 'Editar Local' : 'Agregar Nuevo Local'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={labelStyle}>Nombre del Local</label>
                <input style={inputStyle} type="text" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>Dirección</label>
                <input style={inputStyle} type="text" name="address" value={formData.address} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>Administrador Asignado</label>
                <select name="user_id" value={formData.user_id} onChange={handleInputChange} style={inputStyle} required>
                  <option value="">Seleccione un administrador...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} {u.lastname}</option>
                  ))}
                </select>
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

export default LocalsPage;
