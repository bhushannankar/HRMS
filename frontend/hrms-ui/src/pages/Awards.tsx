import { useEffect, useState } from 'react';
import { awardsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Awards() {
  const { user } = useAuth();
  const [awards, setAwards] = useState<Record<string, unknown>[]>([]);
  const [warnings, setWarnings] = useState<Record<string, unknown>[]>([]);
  const eid = user?.role === 'Employee' ? user.employeeId ?? undefined : undefined;

  useEffect(() => {
    awardsApi.getAwards(eid).then((r) => setAwards(r.data));
    if (user?.role !== 'Employee') awardsApi.getWarnings().then((r) => setWarnings(r.data));
  }, [user]);

  return (
    <div>
      <div className="page-header"><h1>Awards & Warnings</h1><p>Employee recognition and disciplinary records</p></div>
      <div className="panel"><h2>Awards</h2>
        <table className="data-table"><thead><tr><th>Employee</th><th>Award</th><th>Date</th><th>Description</th></tr></thead>
          <tbody>{awards.map((a) => <tr key={String(a.awardId)}><td>{String(a.employeeName)}</td><td>{String(a.awardName)}</td><td>{String(a.awardDate)}</td><td>{String(a.description ?? '-')}</td></tr>)}</tbody>
        </table></div>
      {user?.role !== 'Employee' && (
        <div className="panel"><h2>Warnings</h2>
          <table className="data-table"><thead><tr><th>Employee</th><th>Subject</th><th>Date</th><th>Severity</th></tr></thead>
            <tbody>{warnings.map((w) => <tr key={String(w.warningId)}><td>{String(w.employeeName)}</td><td>{String(w.subject)}</td><td>{String(w.warningDate)}</td><td><span className="badge rejected">{String(w.severity)}</span></td></tr>)}</tbody>
          </table></div>
      )}
    </div>
  );
}
