import { useEffect, useState } from 'react';
import { employeesApi } from '../../api/client';
import '../../components/Layout.css';

interface Employee {
  employeeId: number;
  employeeCode: string;
  fullName: string;
  email: string | null;
  department: string | null;
  designation: string | null;
  phone: string | null;
}

export default function EmployeeDirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    employeesApi.getAll(true).then((r) => setEmployees(r.data));
  }, []);

  return (
    <div className="card-grid">
      {employees.map((e) => (
        <div key={e.employeeId} className="stat-card">
          <h3>{e.fullName}</h3>
          <p style={{ margin: '4px 0', color: '#64748b', fontSize: '0.85rem' }}>{e.employeeCode}</p>
          <p style={{ margin: 0, fontSize: '0.88rem' }}>{e.designation ?? '—'}</p>
          <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#2563eb' }}>{e.department ?? '—'}</p>
          <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{e.email}</p>
        </div>
      ))}
    </div>
  );
}
