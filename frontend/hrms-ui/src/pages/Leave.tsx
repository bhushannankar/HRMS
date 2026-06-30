import { useEffect, useState } from 'react';
import { leaveApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

interface LeaveType { leaveTypeId: number; leaveTypeName: string; daysPerYear: number; }
interface LeaveBalance { leaveTypeName: string; totalDays: number; usedDays: number; remainingDays: number; }
interface LeaveRequest {
  leaveRequestId: number;
  employeeName: string;
  leaveTypeName: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  status: string;
}

export default function Leave() {
  const { user } = useAuth();
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ leaveTypeId: 0, startDate: '', endDate: '', reason: '' });

  const employeeId = user?.employeeId;
  const canApprove = user?.role === 'Admin' || user?.role === 'Manager';

  const load = () => {
    leaveApi.getTypes().then((r) => setTypes(r.data));
    const reqParams = employeeId && user?.role === 'Employee' ? { employeeId } :
      canApprove ? { status: 'Pending' } : {};
    leaveApi.getRequests(reqParams).then((r) => setRequests(r.data));
    if (employeeId) leaveApi.getBalances(employeeId).then((r) => setBalances(r.data));
  };

  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId) return;
    await leaveApi.createRequest(employeeId, {
      leaveTypeId: form.leaveTypeId,
      startDate: form.startDate,
      endDate: form.endDate,
      reason: form.reason,
    });
    setShowForm(false);
    load();
  };

  const handleApprove = async (id: number) => {
    if (!employeeId) return;
    await leaveApi.approve(id, employeeId);
    load();
  };

  const handleReject = async (id: number) => {
    if (!employeeId) return;
    await leaveApi.reject(id, employeeId, 'Rejected by manager');
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h1>{canApprove ? 'Leave Management' : 'My Leave'}</h1>
        <p>Apply for leave and track balances</p>
      </div>

      {balances.length > 0 && (
        <div className="card-grid">
          {balances.map((b) => (
            <div key={b.leaveTypeName} className="stat-card">
              <h3>{b.leaveTypeName}</h3>
              <div className="value">{b.remainingDays} / {b.totalDays}</div>
              <small style={{ color: '#666' }}>Remaining days</small>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'Employee' && (
        <div style={{ marginBottom: 20 }}>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Apply for Leave'}
          </button>
        </div>
      )}

      {showForm && (
        <div className="panel">
          <h2>New Leave Request</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Leave Type</label>
                <select value={form.leaveTypeId} onChange={(e) => setForm({ ...form, leaveTypeId: +e.target.value })} required>
                  <option value={0}>Select type</option>
                  {types.map((t) => <option key={t.leaveTypeId} value={t.leaveTypeId}>{t.leaveTypeName}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary">Submit Request</button>
          </form>
        </div>
      )}

      <div className="panel">
        <h2>{canApprove ? 'Pending Approvals' : 'My Requests'}</h2>
        <table className="data-table">
          <thead>
            <tr>
              {canApprove && <th>Employee</th>}
              <th>Type</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              {canApprove && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.leaveRequestId}>
                {canApprove && <td>{r.employeeName}</td>}
                <td>{r.leaveTypeName}</td>
                <td>{r.startDate}</td>
                <td>{r.endDate}</td>
                <td>{r.totalDays}</td>
                <td>{r.reason ?? '-'}</td>
                <td><span className={`badge ${r.status.toLowerCase()}`}>{r.status}</span></td>
                {canApprove && r.status === 'Pending' && (
                  <td className="action-btns">
                    <button className="btn btn-success" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleApprove(r.leaveRequestId)}>Approve</button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleReject(r.leaveRequestId)}>Reject</button>
                  </td>
                )}
                {canApprove && r.status !== 'Pending' && <td>-</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
