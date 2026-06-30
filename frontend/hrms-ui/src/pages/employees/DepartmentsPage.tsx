import { useEffect, useState } from 'react';
import { setupApi } from '../../api/client';
import '../../components/Layout.css';

interface Department {
  departmentId: number;
  departmentName: string;
  description: string | null;
  employeeCount: number;
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);

  useEffect(() => {
    setupApi.getDepartments().then((r) => setDepartments(r.data));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header-row" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Departments</h2>
        <span style={{ color: '#64748b', fontSize: '0.88rem' }}>{departments.length} department(s)</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Department Name</th>
            <th>Description</th>
            <th>Employees</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((d, i) => (
            <tr key={d.departmentId}>
              <td>{i + 1}</td>
              <td><strong>{d.departmentName}</strong></td>
              <td>{d.description ?? '—'}</td>
              <td>{d.employeeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
