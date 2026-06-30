import { useEffect, useState } from 'react';
import { payrollApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

interface Payslip {
  payslipId: number;
  payPeriodMonth: number;
  payPeriodYear: number;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentStatus: string;
}

const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Payroll() {
  const { user } = useAuth();
  const [payslips, setPayslips] = useState<Payslip[]>([]);

  useEffect(() => {
    if (user?.employeeId) {
      payrollApi.getPayslips(user.employeeId).then((r) => setPayslips(r.data));
    }
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <h1>Payroll & Payslips</h1>
        <p>View salary breakdown and payment history</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Basic Salary</th>
              <th>Allowances</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {payslips.map((p) => (
              <tr key={p.payslipId}>
                <td>{months[p.payPeriodMonth]} {p.payPeriodYear}</td>
                <td>₹{p.basicSalary.toLocaleString()}</td>
                <td>₹{p.allowances.toLocaleString()}</td>
                <td>₹{p.deductions.toLocaleString()}</td>
                <td><strong>₹{p.netSalary.toLocaleString()}</strong></td>
                <td><span className="badge approved">{p.paymentStatus}</span></td>
              </tr>
            ))}
            {payslips.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: '#666' }}>No payslips available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
