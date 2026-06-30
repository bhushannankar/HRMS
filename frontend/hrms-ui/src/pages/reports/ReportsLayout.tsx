import ModuleLayout from '../../components/ModuleLayout';
import { reportsModuleNav } from '../../config/moduleNav';
import { useAuth } from '../../context/AuthContext';

export default function ReportsLayout() {
  const { user } = useAuth();
  return (
    <ModuleLayout
      title="HR Reports"
      subtitle="Organization-wide HR analytics and reports"
      navItems={user?.role === 'Admin' ? reportsModuleNav : []}
    />
  );
}
