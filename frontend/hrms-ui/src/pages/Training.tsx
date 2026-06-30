import { useEffect, useState } from 'react';
import { trainingApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Training() {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Record<string, unknown>[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    trainingApi.getAll().then((r) => setPrograms(r.data));
    trainingApi.getEnrollments(user?.role === 'Employee' ? user.employeeId ?? undefined : undefined)
      .then((r) => setEnrollments(r.data));
  }, [user]);

  return (
    <div>
      <div className="page-header"><h1>Training</h1><p>Training programs and enrollments</p></div>
      <div className="panel"><h2>Programs</h2>
        <table className="data-table"><thead><tr><th>Title</th><th>Trainer</th><th>Start</th><th>End</th><th>Status</th><th>Enrolled</th></tr></thead>
          <tbody>{programs.map((p) => <tr key={String(p.trainingId)}><td>{String(p.title)}</td><td>{String(p.trainer ?? '-')}</td><td>{String(p.startDate)}</td><td>{String(p.endDate ?? '-')}</td><td><span className="badge approved">{String(p.status)}</span></td><td>{String(p.enrolledCount)}</td></tr>)}</tbody>
        </table></div>
      <div className="panel"><h2>Enrollments</h2>
        <table className="data-table"><thead><tr><th>Training</th><th>Employee</th><th>Status</th><th>Score</th></tr></thead>
          <tbody>{enrollments.map((e) => <tr key={String(e.enrollmentId)}><td>{String(e.trainingTitle)}</td><td>{String(e.employeeName)}</td><td>{String(e.status)}</td><td>{String(e.score ?? '-')}</td></tr>)}</tbody>
        </table></div>
    </div>
  );
}
