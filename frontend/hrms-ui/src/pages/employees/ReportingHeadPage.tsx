import { useEffect, useState } from 'react';
import { employeesApi } from '../../api/client';
import '../../components/Layout.css';

interface Employee {
  employeeId: number;
  fullName: string;
  department: string | null;
  designation: string | null;
  managerName: string | null;
}

export default function ReportingHeadPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    employeesApi.getAll(true).then((r) => setEmployees(r.data));
  }, []);

  return (
    <div className="panel">
      <h2>Reporting Head</h2>
      <table className="data-table">
        <thead>
          <tr><th>Employee</th><th>Department</th><th>Designation</th><th>Reporting Manager</th></tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.employeeId}>
              <td>{e.fullName}</td>
              <td>{e.department ?? '—'}</td>
              <td>{e.designation ?? '—'}</td>
              <td>{e.managerName ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
