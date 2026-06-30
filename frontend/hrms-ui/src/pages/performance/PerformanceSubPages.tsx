import { useEffect, useState } from 'react';
import { performanceApi } from '../../api/client';
import '../../components/Layout.css';

export function KpiPage() {
  const [competencies, setCompetencies] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { performanceApi.getCompetencies().then((r) => setCompetencies(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Performance Indicators (KPI)</h2>
      <div className="card-grid">
        {competencies.map((c) => (
          <div key={String(c.competencyId)} className="stat-card">
            <h3>{String(c.name)}</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>{String(c.description)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AppraisalPage() {
  const [appraisals, setAppraisals] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { performanceApi.getAppraisals().then((r) => setAppraisals(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Performance Appraisal</h2>
      <table className="data-table">
        <thead><tr><th>Employee</th><th>Reviewer</th><th>Period</th><th>Rating</th><th>Status</th></tr></thead>
        <tbody>
          {appraisals.map((a) => (
            <tr key={String(a.appraisalId)}>
              <td>{String(a.employeeName)}</td>
              <td>{String(a.reviewerName)}</td>
              <td>Q{String(a.periodQuarter)} {String(a.periodYear)}</td>
              <td>{String(a.overallRating ?? '—')}</td>
              <td>{String(a.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function GoalsPage() {
  const [goals, setGoals] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { performanceApi.getGoals().then((r) => setGoals(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Track Goals (OKRs)</h2>
      <table className="data-table">
        <thead><tr><th>Goal</th><th>Employee</th><th>Target</th><th>Progress</th><th>Status</th></tr></thead>
        <tbody>
          {goals.map((g) => (
            <tr key={String(g.goalId)}>
              <td>{String(g.title)}</td>
              <td>{String(g.employeeName)}</td>
              <td>{String(g.targetDate ?? '—')}</td>
              <td>{String(g.progress)}%</td>
              <td>{String(g.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
