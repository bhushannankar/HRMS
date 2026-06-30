import { useEffect, useState } from 'react';
import { employeesApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

interface Employee {
  employeeId: number;
  employeeCode: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  department: string | null;
  designation: string | null;
  managerName: string | null;
  joinDate: string;
  basicSalary: number;
  isActive: boolean;
}

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    employeesApi.getAll().then((r) => setEmployees(r.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>{user?.role === 'Manager' ? 'My Team' : 'Employees'}</h1>
        <p>Manage employee records and profiles</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Manager</th>
              <th>Join Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.employeeCode}</td>
                <td>{e.fullName}</td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                <td>{e.designation}</td>
                <td>{e.managerName ?? '-'}</td>
                <td>{e.joinDate}</td>
                <td>
                  <span className={`badge ${e.isActive ? 'approved' : 'rejected'}`}>
                    {e.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
