import { useEffect, useState } from 'react';
import { recruitmentApi } from '../api/client';
import '../components/Layout.css';

export default function Recruitment() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([]);
  const [applications, setApplications] = useState<Record<string, unknown>[]>([]);
  const [interviews, setInterviews] = useState<Record<string, unknown>[]>([]);

  useEffect(() => {
    recruitmentApi.getJobs().then((r) => setJobs(r.data));
    recruitmentApi.getApplications().then((r) => setApplications(r.data));
    recruitmentApi.getInterviews().then((r) => setInterviews(r.data));
  }, []);

  return (
    <div>
      <div className="page-header"><h1>Recruitment (ATS)</h1><p>Job postings, applications and interviews</p></div>
      <div className="panel"><h2>Open Positions</h2>
        <table className="data-table"><thead><tr><th>Title</th><th>Department</th><th>Vacancies</th><th>Status</th><th>Posted</th><th>Applications</th></tr></thead>
          <tbody>{jobs.map((j) => <tr key={String(j.jobPostingId)}><td>{String(j.title)}</td><td>{String(j.department ?? '-')}</td><td>{String(j.vacancies)}</td><td><span className="badge approved">{String(j.status)}</span></td><td>{String(j.postedDate)}</td><td>{String(j.applicationCount)}</td></tr>)}</tbody>
        </table></div>
      <div className="panel"><h2>Applications</h2>
        <table className="data-table"><thead><tr><th>Candidate</th><th>Job</th><th>Email</th><th>Experience</th><th>Status</th><th>Applied</th></tr></thead>
          <tbody>{applications.map((a) => <tr key={String(a.applicationId)}><td>{String(a.candidateName)}</td><td>{String(a.jobTitle)}</td><td>{String(a.email)}</td><td>{String(a.experienceYears ?? '-')} yrs</td><td><span className="badge pending">{String(a.status)}</span></td><td>{new Date(String(a.appliedDate)).toLocaleDateString()}</td></tr>)}</tbody>
        </table></div>
      <div className="panel"><h2>Interviews</h2>
        <table className="data-table"><thead><tr><th>Candidate</th><th>Interviewer</th><th>Scheduled</th><th>Status</th><th>Rating</th></tr></thead>
          <tbody>{interviews.map((i) => <tr key={String(i.interviewId)}><td>{String(i.candidateName)}</td><td>{String(i.interviewerName)}</td><td>{new Date(String(i.scheduledAt)).toLocaleString()}</td><td>{String(i.status)}</td><td>{String(i.rating ?? '-')}</td></tr>)}</tbody>
        </table></div>
    </div>
  );
}
