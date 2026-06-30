import { useEffect, useState } from 'react';
import { setupApi } from '../../api/client';
import '../../components/Layout.css';

interface SystemRole {
  roleId: number;
  roleName: string;
  description: string | null;
  userCount: number;
}

export default function RolesPage() {
  const [roles, setRoles] = useState<SystemRole[]>([]);

  useEffect(() => {
    setupApi.getRoles().then((r) => setRoles(r.data));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header-row" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Setup Roles</h2>
        <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Access rights &amp; user roles</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Role</th>
            <th>Description</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((r, i) => (
            <tr key={r.roleId}>
              <td>{i + 1}</td>
              <td><strong>{r.roleName}</strong></td>
              <td>{r.description ?? '—'}</td>
              <td>{r.userCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
