import { useEffect, useState } from 'react';
import { leaveApi } from '../../api/client';
import '../../components/Layout.css';

export default function LeaveAwaitingPage() {
  const [requests, setRequests] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    leaveApi.getRequests({ status: 'Pending' }).then((r) => setRequests(r.data));
  }, []);

  return (
    <div className="panel">
      <h2>Awaiting Action — Leave Requests</h2>
      <table className="data-table">
        <thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Status</th></tr></thead>
        <tbody>
          {requests.map((l) => (
            <tr key={String(l.leaveRequestId)}>
              <td>{String(l.employeeName)}</td>
              <td>{String(l.leaveTypeName)}</td>
              <td>{String(l.startDate)}</td>
              <td>{String(l.endDate)}</td>
              <td>{String(l.totalDays)}</td>
              <td><span className="badge pending">{String(l.status)}</span></td>
            </tr>
          ))}
          {requests.length === 0 && <tr><td colSpan={6} style={{ color: '#94a3b8' }}>No pending requests.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
