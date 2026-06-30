import { useEffect, useState } from 'react';
import { projectsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Projects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Record<string, unknown>[]>([]);
  const [tasks, setTasks] = useState<Record<string, unknown>[]>([]);
  const eid = user?.role === 'Employee' ? user.employeeId ?? undefined : undefined;

  useEffect(() => {
    projectsApi.getAll().then((r) => setProjects(r.data));
    projectsApi.getTasks(eid).then((r) => setTasks(r.data));
  }, [user]);

  return (
    <div>
      <div className="page-header"><h1>Projects & Tasks</h1><p>Project tracking and task management</p></div>
      <div className="panel"><h2>Projects</h2>
        <table className="data-table"><thead><tr><th>Project</th><th>Manager</th><th>Status</th><th>Start</th><th>End</th><th>Tasks</th></tr></thead>
          <tbody>{projects.map((p) => <tr key={String(p.projectId)}><td>{String(p.projectName)}</td><td>{String(p.managerName ?? '-')}</td><td><span className="badge approved">{String(p.status)}</span></td><td>{String(p.startDate ?? '-')}</td><td>{String(p.endDate ?? '-')}</td><td>{String(p.taskCount)}</td></tr>)}</tbody>
        </table></div>
      <div className="panel"><h2>Tasks</h2>
        <table className="data-table"><thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Due</th><th>Priority</th><th>Status</th></tr></thead>
          <tbody>{tasks.map((t) => <tr key={String(t.taskId)}><td>{String(t.title)}</td><td>{String(t.projectName)}</td><td>{String(t.assigneeName ?? '-')}</td><td>{String(t.dueDate ?? '-')}</td><td>{String(t.priority)}</td><td><span className="badge pending">{String(t.status)}</span></td></tr>)}</tbody>
        </table></div>
    </div>
  );
}
