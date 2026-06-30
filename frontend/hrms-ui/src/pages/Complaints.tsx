import { useEffect, useState } from 'react';
import { complaintsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Complaints() {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({ subject: '', description: '' });
  const [showForm, setShowForm] = useState(false);

  const load = () => complaintsApi.getAll(user?.role === 'Employee' ? user.employeeId ?? undefined : undefined).then((r) => setItems(r.data));

  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employeeId) return;
    await complaintsApi.create({ employeeId: user.employeeId, ...form });
    setShowForm(false);
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>Complaints</h1><p>Employee grievance management</p></div>
      {user?.role === 'Employee' && (
        <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'File Complaint'}</button>
      )}
      {showForm && (
        <div className="panel"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required /></div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form></div>
      )}
      <div className="panel">
        <table className="data-table"><thead><tr><th>Employee</th><th>Subject</th><th>Status</th><th>Filed</th></tr></thead>
          <tbody>{items.map((c) => <tr key={String(c.complaintId)}><td>{String(c.employeeName)}</td><td>{String(c.subject)}</td><td><span className="badge pending">{String(c.status)}</span></td><td>{new Date(String(c.createdAt)).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
