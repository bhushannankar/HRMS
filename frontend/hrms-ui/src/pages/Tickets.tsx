import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({ subject: '', description: '', priority: 'Medium' });
  const [showForm, setShowForm] = useState(false);

  const load = () => ticketsApi.getAll(user?.role === 'Employee' ? user.employeeId ?? undefined : undefined).then((r) => setTickets(r.data));

  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.employeeId) return;
    await ticketsApi.create({ employeeId: user.employeeId, ...form });
    setShowForm(false);
    setForm({ subject: '', description: '', priority: 'Medium' });
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>Support Tickets</h1><p>IT and HR support requests</p></div>
      <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Ticket'}</button>
      {showForm && (
        <div className="panel"><form onSubmit={handleSubmit}>
          <div className="form-group"><label>Subject</label><input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required /></div>
          <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div className="form-group"><label>Priority</label><select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}><option>Low</option><option>Medium</option><option>High</option></select></div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form></div>
      )}
      <div className="panel">
        <table className="data-table"><thead><tr><th>Employee</th><th>Subject</th><th>Priority</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>{tickets.map((t) => <tr key={String(t.ticketId)}><td>{String(t.employeeName)}</td><td>{String(t.subject)}</td><td><span className={`badge ${t.priority === 'High' ? 'rejected' : 'pending'}`}>{String(t.priority)}</span></td><td>{String(t.status)}</td><td>{new Date(String(t.createdAt)).toLocaleDateString()}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
