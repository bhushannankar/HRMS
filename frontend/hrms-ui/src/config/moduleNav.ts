import type { ModuleNavItem } from '../components/ModuleLayout';

export const attendanceModuleNav: ModuleNavItem[] = [
  { to: '/calendar', label: 'HR Calendar', icon: '📅' },
  { to: '/attendance', label: 'Manage Attendance', icon: '🕐', end: true },
  { to: '/attendance/update', label: 'Update Attendance', icon: '✏️' },
  { to: '/attendance/import', label: 'Import Attendance', icon: '📥' },
  { to: '/attendance/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/attendance/regularize', label: 'Regularize', icon: '🔄' },
];

export const leaveModuleNav: ModuleNavItem[] = [
  { to: '/leave', label: 'Manage Leaves', icon: '🏖️', end: true },
  { to: '/leave/awaiting', label: 'Awaiting Action', icon: '⏳' },
  { to: '/leave/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/leave/access-rights', label: 'Access Rights', icon: '🔐' },
];

export const payrollModuleNav: ModuleNavItem[] = [
  { to: '/payroll', label: 'Payroll & Payslips', icon: '💰', end: true },
  { to: '/payroll/final-attendance', label: 'Final Attendance', icon: '📋' },
  { to: '/payroll/hold-history', label: 'Hold History', icon: '⏸️' },
  { to: '/payroll/fnf-history', label: 'FNF History', icon: '📤' },
  { to: '/payroll/payment-history', label: 'Payment History', icon: '📜' },
  { to: '/payroll/import-ctc', label: 'Import CTC', icon: '📥' },
];

export const taxModuleNav: ModuleNavItem[] = [
  { to: '/tax/slabs', label: 'Tax Slabs', icon: '📊', end: true },
  { to: '/tax/assessment', label: 'Assessment', icon: '📝' },
  { to: '/tax/form16', label: 'Form 16', icon: '📄' },
  { to: '/tax/declaration', label: 'IT Declaration', icon: '📋' },
  { to: '/tax/reports', label: 'Tax Reports', icon: '📈' },
];

export const reportsModuleNav: ModuleNavItem[] = [
  { to: '/reports', label: 'Summary', icon: '📊', end: true },
  { to: '/reports/employees', label: 'Employees', icon: '👥' },
  { to: '/reports/salary', label: 'Salary', icon: '💵' },
  { to: '/reports/payroll', label: 'Payroll', icon: '💰' },
  { to: '/reports/leave', label: 'Leave', icon: '🏖️' },
  { to: '/reports/attendance', label: 'Attendance', icon: '🕐' },
];

export const performanceModuleNav: ModuleNavItem[] = [
  { to: '/performance', label: 'Overview', icon: '⭐', end: true },
  { to: '/performance/kpi', label: 'KPI', icon: '🎯' },
  { to: '/performance/appraisal', label: 'Appraisal', icon: '📝' },
  { to: '/performance/goals', label: 'Goals (OKRs)', icon: '🏁' },
];

export const settingsModuleNav: ModuleNavItem[] = [
  { to: '/settings/company', label: 'Company Master', icon: '🏢', end: true },
  { to: '/settings/constants', label: 'Constants', icon: '📐' },
  { to: '/settings/custom-fields', label: 'Custom Fields', icon: '🧩' },
  { to: '/settings/email-templates', label: 'Email Templates', icon: '✉️' },
  { to: '/settings/theme', label: 'Theme', icon: '🎨' },
  { to: '/settings/backup', label: 'Database Backup', icon: '💾' },
];

export const wfhModuleNav: ModuleNavItem[] = [
  { to: '/wfh', label: 'Manage WFH', icon: '🏠', end: true },
  { to: '/wfh/apply', label: 'Bulk Approval', icon: '✅' },
  { to: '/wfh/percentage', label: 'WFH %', icon: '📊' },
  { to: '/wfh/config', label: 'Configuration', icon: '⚙️' },
];
