import ModuleLayout from '../../components/ModuleLayout';
import { taxModuleNav } from '../../config/moduleNav';

export default function TaxLayout() {
  return (
    <ModuleLayout
      title="Income Tax"
      subtitle="Tax slabs, declarations, Form 16 and TDS reports"
      navItems={taxModuleNav}
    />
  );
}
