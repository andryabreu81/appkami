import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import Swal from 'sweetalert2';

const RolesPage = () => {
  const [roles, setRoles] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    role_code: '',
    descripcion: ''
  });

  const fetchRoles = () => {
    api.get('/getroles')
      .then(res => setRoles(res.data.data || []))
      .catch(err => console.log('Backend no conectado aún', err));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const openAddModal = () => {
    setFormData({ role_code: '', descripcion: '' });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (rol: any) => {
    setFormData({
      role_code: rol.role_code,
      descripcion: rol.descripcion
    });
    setEditingId(rol.id);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put('/updaterol', { ...formData, rolId: editingId });
        Swal.fire('¡Actualizado!', 'El rol ha sido actualizado correctamente.', 'success');
      } else {
        await api.post('/addrol', formData);
        Swal.fire('¡Agregado!', 'El rol ha sido agregado correctamente.', 'success');
      }
      setIsModalOpen(false);
      fetchRoles();
    } catch (error) {
      console.error("Error al guardar el rol", error);
      Swal.fire('Error', 'Ocurrió un error al guardar el rol', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: "¡El rol será eliminado permanentemente!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/deleterol/${id}`);
        fetchRoles();
        Swal.fire('¡Eliminado!', 'El rol ha sido eliminado.', 'success');
      } catch (error) {
        console.error("Error al eliminar rol", error);
        Swal.fire('Error', 'Ocurrió un error al eliminar el rol', 'error');
      }
    }
  };

  const handleToggleActive = async (rol: any) => {
    const newActiveStatus = rol.active === 1 ? 0 : 1;
    try {
      await api.put('/updaterol', { rolId: rol.id, active: newActiveStatus });
      fetchRoles();
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
      Swal.fire('Error', 'Ocurrió un error al actualizar el estado del rol', 'error');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">Gestión de Roles</h2>
        <button className="glass-button" style={{ width: 'auto' }} onClick={openAddModal}>
          + Nuevo Rol
        </button>
      </div>

      <div className="glass-table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Código</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {roles.length > 0 ? roles.map((r: any) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.role_code}</td>
                <td>{r.descripcion}</td>
                <td>
                  <button
                    onClick={() => handleToggleActive(r)}
                    className={r.active === 1 ? 'badge badge-success' : 'badge badge-danger'}
                    style={{
                      border: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      fontFamily: 'inherit'
                    }}
                    title={r.active === 1 ? 'Desactivar' : 'Activar'}
                  >
                    {r.active === 1 ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    {r.active === 1 ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td style={{ display: 'flex', gap: '8px' }}>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => openEditModal(r)} title="Editar">
                    <Edit size={14} /> Editar
                  </button>
                  <button className="glass-button" style={{ padding: '4px 10px', fontSize: '12px', borderColor: '#ef4444', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={() => handleDelete(r.id)} title="Eliminar">
                    <Trash2 size={14} /> Eliminar
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                  No hay roles registrados o el backend está desconectado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle} className="glass-table-container">
            <h3>{editingId ? 'Editar Rol' : 'Agregar Nuevo Rol'}</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
              <div>
                <label style={labelStyle}>Código</label>
                <input style={inputStyle} type="text" name="role_code" value={formData.role_code} onChange={handleInputChange} required />
              </div>
              <div>
                <label style={labelStyle}>Descripción</label>
                <input style={inputStyle} type="text" name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
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

export default RolesPage;
