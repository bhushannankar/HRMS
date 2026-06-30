import { useAuth } from '../../context/AuthContext';
import '../../components/Layout.css';

export default function CompanySettingsPage() {
  const { user } = useAuth();
  return (
    <div className="panel">
      <h2>Company Master</h2>
      <table className="data-table">
        <tbody>
          <tr><th style={{ width: 200 }}>Company Name</th><td>{user?.companyName}</td></tr>
          <tr><th>Company ID</th><td>{user?.companyId}</td></tr>
          <tr><th>Legal Name</th><td>Uttishta IT Solutions</td></tr>
          <tr><th>Country</th><td>India</td></tr>
        </tbody>
      </table>
    </div>
  );
}
