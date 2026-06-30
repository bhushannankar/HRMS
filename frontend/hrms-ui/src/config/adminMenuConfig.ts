import type { NavSection } from './navConfig';

/** Full HRMMitra admin sidebar — https://demo.hrmmitra.in/admin/dashboard */
export const adminNav: NavSection[] = [
  {
    items: [{ to: '/dashboard', label: 'Dashboard', icon: '▣' }],
  },
  {
    items: [
      {
        to: '/onboarding',
        label: 'Onboarding',
        icon: '📝',
        children: [
          { to: '/onboarding', label: 'Add Employee', icon: '➕' },
        ],
      },
    ],
  },
  {
    title: 'Employees',
    items: [
      {
        to: '/employees',
        label: 'Employees',
        icon: '👥',
        children: [
          { to: '/employees', label: 'Manage Employees', icon: '👥' },
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
          { to: '/employees/audit-trail', label: 'Employee Audit Trail', icon: '📋' },
          { to: '/employees/access', label: 'Employee Access', icon: '🔑' },
        ],
      },
    ],
  },
  {
    title: 'Time & Attendance',
    items: [
      {
        to: '/attendance',
        label: 'Attendance',
        icon: '🕐',
        children: [
          { to: '/calendar', label: 'HR Calendar', icon: '📅' },
          { to: '/attendance', label: 'Manage Attendance', icon: '🕐' },
          { to: '/attendance/update', label: 'Update Attendance', icon: '✏️' },
          { to: '/attendance/import', label: 'Import Attendance', icon: '📥' },
          { to: '/attendance/notifications', label: 'Attendance Notification', icon: '🔔' },
          { to: '/attendance/regularize', label: 'Regularize Attendance', icon: '🔄' },
          { to: '/holidays', label: 'Holidays', icon: '🎉' },
          { to: '/expenses', label: 'Expense Management', icon: '🧾' },
          { to: '/travel', label: 'Tour / Travel', icon: '✈️' },
        ],
      },
      {
        to: '/leave',
        label: 'Leave',
        icon: '🏖️',
        children: [
          { to: '/leave', label: 'Manage Leaves', icon: '🏖️' },
          { to: '/leave/awaiting', label: 'Awaiting Action', icon: '⏳' },
          { to: '/leave/dashboard', label: 'Leave Dashboard', icon: '📊' },
          { to: '/leave/access-rights', label: 'Leave Access Rights', icon: '🔐' },
        ],
      },
      {
        to: '/shifts',
        label: 'Shift Roster',
        icon: '⏰',
        children: [
          { to: '/employees/office-shifts', label: 'Shift Roster', icon: '⏰' },
          { to: '/shifts/planning', label: 'Shift Planning', icon: '📆' },
        ],
      },
      {
        to: '/wfh',
        label: 'Work From Home',
        icon: '🏠',
        children: [
          { to: '/wfh', label: 'Manage WFH', icon: '🏠' },
          { to: '/wfh/apply', label: 'Bulk Approval WFH', icon: '✅' },
          { to: '/wfh/percentage', label: 'WFH Percentage', icon: '📊' },
          { to: '/wfh/config', label: 'WFH Configuration', icon: '⚙️' },
        ],
      },
    ],
  },
  {
    title: 'Payroll & Tax',
    items: [
      {
        to: '/payroll',
        label: 'Payroll',
        icon: '💰',
        children: [
          { to: '/payroll', label: 'Payroll & Payslips', icon: '💰' },
          { to: '/payroll/final-attendance', label: 'Final Attendance', icon: '📋' },
          { to: '/payroll/hold-history', label: 'Hold Payroll History', icon: '⏸️' },
          { to: '/payroll/fnf-history', label: 'FNF Payroll History', icon: '📤' },
          { to: '/payroll/payment-history', label: 'Payment History', icon: '📜' },
          { to: '/payroll/import-ctc', label: 'Import CTC / Arrear', icon: '📥' },
        ],
      },
      {
        to: '/tax',
        label: 'Income Tax',
        icon: '🧮',
        children: [
          { to: '/tax/slabs', label: 'Tax Slab Master', icon: '📊' },
          { to: '/tax/assessment', label: 'Tax Assessment', icon: '📝' },
          { to: '/tax/form16', label: 'Form 16', icon: '📄' },
          { to: '/tax/declaration', label: 'IT Declaration', icon: '📋' },
          { to: '/tax/reports', label: 'Income Tax Reports', icon: '📈' },
        ],
      },
    ],
  },
  {
    title: 'Core HR',
    items: [
      {
        to: '/core-hr',
        label: 'Core HR',
        icon: '🏛️',
        children: [
          { to: '/awards', label: 'Awards', icon: '🏆' },
          { to: '/core-hr/warnings', label: 'Warnings', icon: '⚠️' },
          { to: '/core-hr/transfers', label: 'Transfers', icon: '🔀' },
          { to: '/core-hr/resignations', label: 'Resignations', icon: '📤' },
          { to: '/core-hr/promotions', label: 'Promotions', icon: '📈' },
          { to: '/complaints', label: 'Complaints', icon: '📢' },
          { to: '/core-hr/announcements', label: 'Announcements', icon: '📣' },
          { to: '/recruitment', label: 'Recruitment (ATS)', icon: '📋' },
          { to: '/training', label: 'Training', icon: '🎓' },
          { to: '/assets', label: 'Assets', icon: '💻' },
          { to: '/documents', label: 'Official Documents', icon: '📄' },
        ],
      },
    ],
  },
  {
    title: 'Reports',
    items: [
      {
        to: '/reports',
        label: 'HR Reports',
        icon: '📈',
        children: [
          { to: '/reports', label: 'Summary Dashboard', icon: '📊' },
          { to: '/reports/employees', label: 'Employees Report', icon: '👥' },
          { to: '/reports/salary', label: 'Salary Report', icon: '💵' },
          { to: '/reports/payroll', label: 'Payroll Report', icon: '💰' },
          { to: '/reports/leave', label: 'Leave Report', icon: '🏖️' },
          { to: '/reports/attendance', label: 'Attendance Report', icon: '🕐' },
        ],
      },
    ],
  },
  {
    title: 'Workplace',
    items: [
      {
        to: '/events',
        label: 'Events & Meetings',
        icon: '📅',
        children: [
          { to: '/events', label: 'Events', icon: '🎪' },
          { to: '/events/meetings', label: 'Meetings', icon: '🤝' },
        ],
      },
      {
        to: '/tasks',
        label: 'Task Management',
        icon: '✅',
        children: [
          { to: '/projects', label: 'Projects', icon: '📁' },
          { to: '/tasks/list', label: 'Tasks', icon: '☑️' },
          { to: '/tasks/templates', label: 'Templates', icon: '📝' },
          { to: '/tasks/workflow', label: 'Workflow', icon: '🔁' },
        ],
      },
      {
        to: '/performance',
        label: 'Performance',
        icon: '⭐',
        children: [
          { to: '/performance', label: 'Overview', icon: '⭐' },
          { to: '/performance/kpi', label: 'Performance Indicator (KPI)', icon: '🎯' },
          { to: '/performance/appraisal', label: 'Performance Appraisal', icon: '📝' },
          { to: '/performance/goals', label: 'Track Goals (OKRs)', icon: '🏁' },
        ],
      },
      { to: '/tickets', label: 'Support Tickets', icon: '🎫' },
      { to: '/field-tracking', label: 'Field Staff Tracking', icon: '📍' },
    ],
  },
  {
    title: 'Configuration',
    items: [
      {
        to: '/settings',
        label: 'Settings',
        icon: '⚙️',
        children: [
          { to: '/settings/company', label: 'Company Master', icon: '🏢' },
          { to: '/settings/constants', label: 'Constants', icon: '📐' },
          { to: '/settings/custom-fields', label: 'Custom Fields', icon: '🧩' },
          { to: '/employees/roles', label: 'Access Rights', icon: '🔐' },
          { to: '/settings/email-templates', label: 'Email Templates', icon: '✉️' },
          { to: '/settings/theme', label: 'Theme Settings', icon: '🎨' },
          { to: '/settings/backup', label: 'Database Backup', icon: '💾' },
        ],
      },
    ],
  },
];

export const adminRoutes: string[] = [
  '/dashboard', '/onboarding', '/employees', '/calendar',
  '/attendance', '/leave', '/shifts', '/wfh', '/payroll', '/tax',
  '/core-hr', '/awards', '/complaints', '/recruitment', '/training',
  '/assets', '/documents', '/reports', '/events', '/tasks', '/projects',
  '/performance', '/tickets', '/field-tracking', '/settings',
  '/holidays', '/expenses', '/travel',
];
