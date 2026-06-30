import '../../components/Layout.css';
import './EmployeesModule.css';

const CSV_TEMPLATE = `EmployeeCode,FirstName,LastName,Email,Phone,Department,Designation,JoinDate,BasicSalary,Role
EMP004,Jane,Doe,jane@company.com,+91-9000000004,Information Technology,Software Engineer,2026-01-15,50000,Employee`;

export default function ImportEmployeesPage() {
  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="import-panel">
      <div className="panel">
        <h2>Import Employees</h2>
        <p style={{ color: '#64748b', marginBottom: 16 }}>
          Bulk import employee records from Excel/CSV — matching HRMMitra import workflow.
        </p>
        <ol className="import-steps">
          <li>Download the CSV template</li>
          <li>Fill in employee details (one row per employee)</li>
          <li>Upload the completed file</li>
          <li>Review and confirm import</li>
        </ol>
        <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
          <button type="button" className="btn btn-outline" onClick={downloadTemplate}>
            Download Template
          </button>
          <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
            Upload CSV
            <input
              type="file"
              accept=".csv,.xlsx,.xls"
              hidden
              onChange={() => alert('Import processing will be connected to the API in a future release.')}
            />
          </label>
        </div>
      </div>
      <div className="panel">
        <h2>Import Guidelines</h2>
        <ul style={{ color: '#475569', lineHeight: 1.8, paddingLeft: 20 }}>
          <li>Employee code must be unique</li>
          <li>Department and designation must exist in the system</li>
          <li>Join date format: YYYY-MM-DD</li>
          <li>Role must be Admin, Manager, or Employee</li>
          <li>Duplicate emails will be skipped</li>
        </ul>
      </div>
    </div>
  );
}
