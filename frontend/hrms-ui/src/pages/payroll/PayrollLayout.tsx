import ModuleLayout from '../../components/ModuleLayout';
import { payrollModuleNav } from '../../config/moduleNav';
import { useAuth } from '../../context/AuthContext';

export default function PayrollLayout() {
  const { user } = useAuth();
  return (
    <ModuleLayout
      title="Payroll"
      subtitle="Payroll processing, payslips and payment history"
      navItems={user?.role === 'Admin' ? payrollModuleNav : []}
    />
  );
}
