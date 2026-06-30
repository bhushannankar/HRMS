import ModuleLayout from '../../components/ModuleLayout';
import { employeeModuleNav } from '../../config/employeeModuleNav';
import { useAuth } from '../../context/AuthContext';

export default function EmployeesLayout() {
  const { user } = useAuth();
  return (
    <ModuleLayout
      title="Employees"
      subtitle="Manage employee records, organization structure and HR setup"
      navItems={user?.role === 'Admin' ? employeeModuleNav : []}
    />
  );
}
