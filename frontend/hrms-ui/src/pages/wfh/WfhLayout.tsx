import ModuleLayout from '../../components/ModuleLayout';
import { wfhModuleNav } from '../../config/moduleNav';

export default function WfhLayout() {
  return (
    <ModuleLayout
      title="Work From Home"
      subtitle="WFH requests, approvals and configuration"
      navItems={wfhModuleNav}
    />
  );
}
