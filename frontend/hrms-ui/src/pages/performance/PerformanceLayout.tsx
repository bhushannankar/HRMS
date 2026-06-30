import ModuleLayout from '../../components/ModuleLayout';
import { performanceModuleNav } from '../../config/moduleNav';
import { useAuth } from '../../context/AuthContext';

export default function PerformanceLayout() {
  const { user } = useAuth();
  return (
    <ModuleLayout
      title="Performance Management"
      subtitle="KPIs, appraisals and goal tracking"
      navItems={user?.role === 'Admin' || user?.role === 'Manager' ? performanceModuleNav : []}
    />
  );
}
