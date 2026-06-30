import ModuleLayout from '../../components/ModuleLayout';
import { leaveModuleNav } from '../../config/moduleNav';
import { useAuth } from '../../context/AuthContext';

export default function LeaveLayout() {
  const { user } = useAuth();
  return (
    <ModuleLayout
      title="Leave Management"
      subtitle="Leave requests, approvals and access configuration"
      navItems={user?.role === 'Admin' ? leaveModuleNav : []}
    />
  );
}
