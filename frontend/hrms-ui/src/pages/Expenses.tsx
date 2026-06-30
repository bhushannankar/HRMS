import { useEffect, useState } from 'react';
import { expensesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Expenses() {
  const { user } = useAuth();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [form, setForm] = useState({ category: '', amount: '', description: '', expenseDate: '' });
  const [showForm, setShowForm] = useState(false);
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager';

  const load = () => {
    const params = user?.role === 'Employee' ? { employeeId: user.employeeId ?? undefined } : canApprove ? { status: 'Pending' } : {};
    expensesApi.getAll(params).then((r) => setItems(r.data));
  };

  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await expensesApi.create({ category: form.category, amount: +form.amount, description: form.description, expenseDate: form.expenseDate });
    setShowForm(false);
    load();
  };

  const handleApprove = async (id: number, approve: boolean) => {
    if (!user?.employeeId) return;
    await expensesApi.approve(id, user.employeeId, approve);
    load();
  };

  return (
    <div>
      <div className="page-header"><h1>Expense Claims</h1><p>Submit and approve expense reimbursements</p></div>
      {user?.role === 'Employee' && (
        <button className="btn btn-primary" style={{ marginBottom: 16 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'New Expense'}</button>
      )}
      {showForm && (
        <div className="panel"><form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Category</label><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required /></div>
            <div className="form-group"><label>Amount (₹)</label><input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required /></div>
            <div className="form-group"><label>Date</label><input type="date" value={form.expenseDate} onChange={(e) => setForm({ ...form, expenseDate: e.target.value })} required /></div>
          </div>
          <div className="form-group"><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <button type="submit" className="btn btn-primary">Submit</button>
        </form></div>
      )}
      <div className="panel">
        <table className="data-table"><thead><tr><th>Employee</th><th>Category</th><th>Amount</th><th>Date</th><th>Status</th>{canApprove && <th>Actions</th>}</tr></thead>
          <tbody>{items.map((x) => (
            <tr key={String(x.expenseId)}>
              <td>{String(x.employeeName)}</td><td>{String(x.category)}</td><td>₹{Number(x.amount).toLocaleString()}</td>
              <td>{String(x.expenseDate)}</td><td><span className={`badge ${x.status === 'Pending' ? 'pending' : 'approved'}`}>{String(x.status)}</span></td>
              {canApprove && x.status === 'Pending' && (
                <td className="action-btns">
                  <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleApprove(Number(x.expenseId), true)}>Approve</button>
                  <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleApprove(Number(x.expenseId), false)}>Reject</button>
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
