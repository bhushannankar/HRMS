import { useEffect, useState } from 'react';
import { leaveApi } from '../../api/client';
import '../../components/Layout.css';

export default function LeaveDashboardPage() {
  const [requests, setRequests] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    leaveApi.getRequests().then((r) => setRequests(r.data));
  }, []);

  const pending = requests.filter((r) => r.status === 'Pending').length;
  const approved = requests.filter((r) => r.status === 'Approved').length;
  const rejected = requests.filter((r) => r.status === 'Rejected').length;

  return (
    <div>
      <div className="card-grid">
        <div className="stat-card orange"><h3>Pending</h3><div className="value">{pending}</div></div>
        <div className="stat-card green"><h3>Approved</h3><div className="value">{approved}</div></div>
        <div className="stat-card"><h3>Rejected</h3><div className="value">{rejected}</div></div>
        <div className="stat-card purple"><h3>Total Requests</h3><div className="value">{requests.length}</div></div>
      </div>
    </div>
  );
}
