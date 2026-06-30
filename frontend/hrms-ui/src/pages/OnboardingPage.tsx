import { useState } from 'react';
import EmployeeList from './employees/EmployeeList';
import AddEmployeeModal from './employees/AddEmployeeModal';
import '../components/Layout.css';

export default function OnboardingPage() {
  const [showAdd, setShowAdd] = useState(true);

  return (
    <div>
      <div className="page-header">
        <h1>Employee Onboarding</h1>
        <p>Add new employees to the organization</p>
      </div>
      <div className="panel" style={{ marginBottom: 20 }}>
        <p style={{ margin: '0 0 16px', color: '#64748b' }}>
          Use the form below to onboard a new employee with login credentials, job details, and leave balances.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => setShowAdd(true)}>
          + Add New Employee
        </button>
      </div>
      <EmployeeList />
      <AddEmployeeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => setShowAdd(false)}
      />
    </div>
  );
}
