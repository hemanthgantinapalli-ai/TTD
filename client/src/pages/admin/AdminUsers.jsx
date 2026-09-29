import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/adminService';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getUsers();
      if (res?.data) {
        setUsers(res.data);
      }
    } catch (err) {
      console.warn('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    try {
      await adminService.updateUser(user._id, { status: newStatus });
      toast.success(`User ${user.name} is now ${newStatus}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleRoleChange = async (user, newRole) => {
    try {
      await adminService.updateUser(user._id, { role: newRole });
      toast.success(`Role for ${user.name} changed to ${newRole}`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update role');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>👥</span>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#4A0E1C', margin: 0, fontFamily: 'Cinzel, serif' }}>
              Registered Devotees & Staff
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: '#6B615C', marginTop: '4px' }}>
            User management, permission assignments, and verification status for devotees.
          </p>
        </div>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E0D4C0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#FAF0F2', borderBottom: '2px solid #E0D4C0', textAlign: 'left' }}>
              <th style={{ padding: '14px 16px' }}>Devotee Name</th>
              <th style={{ padding: '14px 16px' }}>Contact Info</th>
              <th style={{ padding: '14px 16px' }}>Role</th>
              <th style={{ padding: '14px 16px' }}>Status</th>
              <th style={{ padding: '14px 16px' }}>Total Bookings</th>
              <th style={{ padding: '14px 16px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid #EDE6D9' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: u.role === 'admin' ? '#4A0E1C' : '#E3C05C', color: u.role === 'admin' ? '#F2DEA2' : '#4A0E1C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                      {u.name?.charAt(0) || 'D'}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#2B2320' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#6B615C' }}>ID: {u._id}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <div>📞 {u.phone}</div>
                  <div style={{ fontSize: '11px', color: '#6B615C' }}>✉️ {u.email}</div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u, e.target.value)}
                    style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #D8CBB8',
                      background: u.role === 'admin' ? '#320710' : '#fff',
                      color: u.role === 'admin' ? '#F2DEA2' : '#2B2320',
                      fontWeight: 600,
                    }}
                  >
                    <option value="devotee">Devotee</option>
                    <option value="admin">Administrator</option>
                  </select>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: '12px',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      background: u.status === 'Active' ? '#EBF5EF' : '#FDECEA',
                      color: u.status === 'Active' ? '#2E7D46' : '#B3261E',
                    }}
                  >
                    {u.status || 'Active'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontWeight: 600 }}>
                  {u.totalBookings || 0} Yatras
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <button
                    onClick={() => handleToggleStatus(u)}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #D8CBB8',
                      background: '#fff',
                      color: u.status === 'Active' ? '#B3261E' : '#2E7D46',
                      cursor: 'pointer',
                    }}
                  >
                    {u.status === 'Active' ? 'Suspend' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
