import { useEffect, useState } from 'react';
import { travelApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Travel() {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({ destination: '', purpose: '', startDate: '', endDate: '', estimatedCost: '' });
  const [showForm, setShowForm] = useState(false);
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager';

  const load = () => {
    const params = user?.role === 'Employee' ? { employeeId: user.employeeId ?? undefined } : canApprove ? { status: 'Pending' } : {};
    travelApi.getAll(params).then((r) => setItems(r.data));
  };

  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await travelApi.create({ destination: form.destination, purpose: form.purpose, startDate: form.startDate, endDate: form.endDate, estimatedCost: form.estimatedCost ? +form.estimatedCost : undefined });
    setShowForm(false);
    load();
  };

  const handleApprove = async (id: number, approve: boolean) => {
    if (!user?.employeeId) return;
    await travelApi.approve(id, user.employeeId, approve);
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>Travel Requests</h1><p>Business travel approvals</p></div>
      {user?.role === 'Employee' && (
        <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Request Travel'}</button>
      )}
      {showForm && (
        <div className="panel"><form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Destination</label><input value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required /></div>
            <div className="form-group"><label>Start Date</label><input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required /></div>
            <div className="form-group"><label>End Date</label><input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required /></div>
            <div className="form-group"><label>Est. Cost (₹)</label><input type="number" value={form.estimatedCost} onChange={(e) => setForm({ ...form, estimatedCost: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Purpose</label><input value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form></div>
      )}
      <div className="panel">
        <table className="data-table"><thead><tr><th>Employee</th><th>Destination</th><th>Dates</th><th>Cost</th><th>Status</th>{canApprove && <th>Actions</th>}</tr></thead>
          <tbody>{items.map((x) => (
            <tr key={String(x.travelId)}>
              <td>{String(x.employeeName)}</td><td>{String(x.destination)}</td>
              <td>{String(x.startDate)} - {String(x.endDate)}</td>
              <td>{x.estimatedCost ? `₹${Number(x.estimatedCost).toLocaleString()}` : '-'}</td>
              <td><span className={`badge ${x.status === 'Pending' ? 'pending' : 'approved'}`}>{String(x.status)}</span></td>
              {canApprove && x.status === 'Pending' && (
                <td className="action-btns">
                  <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleApprove(Number(x.travelId), true)}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleApprove(Number(x.travelId), false)}>Reject</button>
                </td>
              )}
              {canApprove && x.status !== 'Pending' && <td>-</td>}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
