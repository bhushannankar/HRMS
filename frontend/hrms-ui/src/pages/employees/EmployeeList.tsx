import { useCallback, useEffect, useState } from 'react';
import { employeesApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import AddEmployeeModal from './AddEmployeeModal';
import '../../components/Layout.css';
import './EmployeesModule.css';

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

export default function EmployeeList({ inactive = false }: { inactive?: boolean }) {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const isAdmin = user?.role === 'Admin';

  const load = useCallback(() => {
    employeesApi.getAll(inactive ? false : true).then((r) => setEmployees(r.data));
  }, [inactive]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <div className="panel">
        <div className="panel-header-row" style={{ marginBottom: 16 }}>
          <h2 style={{ margin: 0 }}>{inactive ? 'Inactive / Left Employees' : 'Employee Directory'}</h2>
          <div className="employee-list-actions">
            <span style={{ color: '#64748b', fontSize: '0.88rem' }}>{employees.length} record(s)</span>
            {isAdmin && !inactive && (
              <button type="button" className="btn btn-primary" onClick={() => setShowAdd(true)}>
                + Add Employee
              </button>
            )}
          </div>
        </div>
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
              <th>Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.employeeId}>
                <td>{e.employeeCode}</td>
                <td>{e.fullName}</td>
                <td>{e.email ?? '—'}</td>
                <td>{e.department ?? '—'}</td>
                <td>{e.designation ?? '—'}</td>
                <td>{e.managerName ?? '—'}</td>
                <td>{e.joinDate}</td>
                <td>₹{e.basicSalary.toLocaleString('en-IN')}</td>
                <td>
                  <span className={`badge ${e.isActive ? 'approved' : 'rejected'}`}>
                    {e.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr><td colSpan={9} style={{ color: '#94a3b8' }}>No employees found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AddEmployeeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={load}
      />
    </>
  );
}
