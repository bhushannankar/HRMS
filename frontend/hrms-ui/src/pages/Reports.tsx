import { useEffect, useState } from 'react';
import { reportsApi } from '../api/client';
import '../components/Layout.css';

export default function Reports() {
  const [summary, setSummary] = useState<Record<string, number> | null>(null);

  useEffect(() => { reportsApi.getSummary().then((r) => setSummary(r.data)); }, []);

  const items = summary ? [
    { label: 'Open Job Postings', value: summary.openJobs, color: '' },
    { label: 'Pending Applications', value: summary.pendingApplications, color: 'orange' },
    { label: 'Active Trainings', value: summary.activeTrainings, color: 'green' },
    { label: 'Open Support Tickets', value: summary.openTickets, color: 'purple' },
    { label: 'Pending Expenses', value: summary.pendingExpenses, color: 'orange' },
    { label: 'Pending Travel', value: summary.pendingTravel, color: 'orange' },
    { label: 'Active Projects', value: summary.activeProjects, color: 'green' },
    { label: 'Total Assets', value: summary.totalAssets, color: '' },
    { label: 'Open Complaints', value: summary.openComplaints, color: 'purple' },
    { label: 'Upcoming Events', value: summary.upcomingEvents, color: 'green' },
  ] : [];

  return (
    <div>
      <div className="page-header"><h1>Reports & Analytics</h1><p>Organization-wide HR metrics summary</p></div>
      <div className="card-grid">
        {items.map((item) => (
          <div key={item.label} className={`stat-card ${item.color}`}>
            <h3>{item.label}</h3>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
