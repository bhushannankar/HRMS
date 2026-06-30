import { useEffect, useState } from 'react';
import { employeesApi, reportsApi } from '../../api/client';
import '../../components/Layout.css';

export function EmployeesReportPage() {
  const [employees, setEmployees] = useState<unknown[]>([]);
  useEffect(() => { employeesApi.getAll(true).then((r) => setEmployees(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Employees Report</h2>
      <p style={{ color: '#64748b' }}>{employees.length} active employees</p>
      <table className="data-table">
        <thead><tr><th>Code</th><th>Name</th><th>Department</th><th>Designation</th><th>Join Date</th></tr></thead>
        <tbody>
          {(employees as Record<string, unknown>[]).map((e) => (
            <tr key={String(e.employeeId)}>
              <td>{String(e.employeeCode)}</td>
              <td>{String(e.fullName)}</td>
              <td>{String(e.department ?? '—')}</td>
              <td>{String(e.designation ?? '—')}</td>
              <td>{String(e.joinDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SalaryReportPage() {
  const [employees, setEmployees] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { employeesApi.getAll(true).then((r) => setEmployees(r.data)); }, []);
  const total = employees.reduce((s, e) => s + Number(e.basicSalary ?? 0), 0);
  return (
    <div className="panel">
      <h2>Employee Salary Report</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>Total monthly basic salary: ₹{total.toLocaleString('en-IN')}</p>
      <table className="data-table">
        <thead><tr><th>Employee</th><th>Department</th><th>Basic Salary</th><th>Annual CTC</th></tr></thead>
        <tbody>
          {employees.map((e) => (
            <tr key={String(e.employeeId)}>
              <td>{String(e.fullName)}</td>
              <td>{String(e.department ?? '—')}</td>
              <td>₹{Number(e.basicSalary).toLocaleString('en-IN')}</td>
              <td>₹{(Number(e.basicSalary) * 12).toLocaleString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PayrollReportPage() {
  const [summary, setSummary] = useState<Record<string, number> | null>(null);
  useEffect(() => { reportsApi.getSummary().then((r) => setSummary(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Payroll Report</h2>
      <div className="card-grid">
        <div className="stat-card"><h3>Active Projects</h3><div className="value">{summary?.activeProjects ?? 0}</div></div>
        <div className="stat-card orange"><h3>Pending Expenses</h3><div className="value">{summary?.pendingExpenses ?? 0}</div></div>
      </div>
    </div>
  );
}

export function LeaveReportPage() {
  return <div className="panel"><h2>Leave Report</h2><p style={{ color: '#64748b' }}>View leave balances and usage from the Leave module.</p></div>;
}

export function AttendanceReportPage() {
  return <div className="panel"><h2>Attendance Report</h2><p style={{ color: '#64748b' }}>Daily and monthly attendance summaries from attendance records.</p></div>;
}
