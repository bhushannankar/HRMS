import '../../components/Layout.css';
import './EmployeesModule.css';

export default function PoliciesPage() {
  return (
    <div className="panel">
      <h2>Company Policy</h2>
      <div className="policy-content">
        <h3>Code of Conduct</h3>
        <p>
          All employees are expected to maintain professional behavior, respect colleagues,
          and follow company guidelines at all times.
        </p>
        <h3>Attendance Policy</h3>
        <p>
          Employees must clock in and out daily. Late arrivals beyond the grace period may be
          recorded. Work-from-home must be pre-approved by the reporting manager.
        </p>
        <h3>Leave Policy</h3>
        <p>
          Leave requests should be submitted in advance through the HRMS portal. Approved leave
          balances are visible on the employee dashboard.
        </p>
        <h3>Data Privacy</h3>
        <p>
          Employee personal and payroll information is confidential and accessible only to
          authorized HR personnel and the employee concerned.
        </p>
      </div>
    </div>
  );
}
