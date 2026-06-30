import { useEffect, useState } from 'react';
import { projectsApi } from '../../api/client';
import '../../components/Layout.css';

export function TasksListPage() {
  const [tasks, setTasks] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { projectsApi.getTasks().then((r) => setTasks(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Tasks</h2>
      <table className="data-table">
        <thead><tr><th>Task</th><th>Project</th><th>Assignee</th><th>Due</th><th>Priority</th><th>Status</th></tr></thead>
        <tbody>
          {tasks.map((t) => (
            <tr key={String(t.taskId)}>
              <td>{String(t.title)}</td>
              <td>{String(t.projectName)}</td>
              <td>{String(t.assigneeName ?? '—')}</td>
              <td>{String(t.dueDate ?? '—')}</td>
              <td>{String(t.priority)}</td>
              <td><span className="badge pending">{String(t.status)}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
