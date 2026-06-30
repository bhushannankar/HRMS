/** HRMMitra employee submenus */
import type { ModuleNavItem } from '../components/ModuleLayout';

export const employeeModuleNav: ModuleNavItem[] = [
  { to: '/employees', label: 'Manage Employees', icon: '👥', end: true },
  { to: '/employees/inactive', label: 'Awaiting Employees', icon: '⏳' },
  { to: '/employees/directory', label: 'Employee Directory', icon: '📇' },
  { to: '/employees/reporting', label: 'Reporting Head', icon: '🔗' },
  { to: '/employees/import', label: 'Import Employees', icon: '📥' },
  { to: '/employees/org-chart', label: 'Organization Chart', icon: '🌳' },
  { to: '/employees/departments', label: 'Departments', icon: '🏢' },
  { to: '/employees/designations', label: 'Designations', icon: '🎖️' },
  { to: '/employees/office-shifts', label: 'Office Shifts', icon: '🕐' },
  { to: '/employees/roles', label: 'Setup Roles', icon: '🔐' },
  { to: '/employees/policies', label: 'Company Policy', icon: '📜' },
  { to: '/employees/bonus', label: 'Employee Bonus', icon: '🎁' },
  { to: '/employees/audit-trail', label: 'Audit Trail', icon: '📋' },
  { to: '/employees/access', label: 'Employee Access', icon: '🔑' },
];
