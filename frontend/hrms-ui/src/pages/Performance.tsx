import { useEffect, useState } from 'react';
import { performanceApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Performance() {
  const { user } = useAuth();
  const [competencies, setCompetencies] = useState<Record<string, unknown>[]>([]);
  const [appraisals, setAppraisals] = useState<Record<string, unknown>[]>([]);
  const [goals, setGoals] = useState<Record<string, unknown>[]>([]);
  const eid = user?.role === 'Employee' ? user.employeeId ?? undefined : undefined;

  useEffect(() => {
    performanceApi.getCompetencies().then((r) => setCompetencies(r.data));
    performanceApi.getAppraisals(eid).then((r) => setAppraisals(r.data));
    performanceApi.getGoals(eid).then((r) => setGoals(r.data));
  }, [user]);

  return (
    <div>
      <div className="page-header"><h1>Performance Management</h1><p>Appraisals, goals and competencies</p></div>
      <div className="card-grid">
        {competencies.map((c) => <div key={String(c.competencyId)} className="stat-card"><h3>{String(c.name)}</h3><p style={{ margin: 0, color: '#666', fontSize: '0.85rem' }}>{String(c.description)}</p></div>)}
      </div>
      <div className="panel"><h2>Appraisals</h2>
        <table className="data-table"><thead><tr><th>Employee</th><th>Reviewer</th><th>Period</th><th>Rating</th><th>Status</th></tr></thead>
          <tbody>{appraisals.map((a) => <tr key={String(a.appraisalId)}><td>{String(a.employeeName)}</td><td>{String(a.reviewerName)}</td><td>Q{String(a.periodQuarter)} {String(a.periodYear)}</td><td>{String(a.overallRating ?? '-')}</td><td><span className="badge approved">{String(a.status)}</span></td></tr>)}</tbody>
        </table></div>
      <div className="panel"><h2>Goals (OKRs)</h2>
        <table className="data-table"><thead><tr><th>Title</th><th>Employee</th><th>Target</th><th>Progress</th><th>Status</th></tr></thead>
          <tbody>{goals.map((g) => <tr key={String(g.goalId)}><td>{String(g.title)}</td><td>{String(g.employeeName)}</td><td>{String(g.targetDate ?? '-')}</td><td>{String(g.progress)}%</td><td>{String(g.status)}</td></tr>)}</tbody>
        </table></div>
    </div>
  );
}
