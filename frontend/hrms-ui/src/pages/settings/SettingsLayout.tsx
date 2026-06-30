import ModuleLayout from '../../components/ModuleLayout';
import { settingsModuleNav } from '../../config/moduleNav';

export default function SettingsLayout() {
  return (
    <ModuleLayout
      title="Settings"
      subtitle="Company configuration, templates and system settings"
      navItems={settingsModuleNav}
    />
  );
}
