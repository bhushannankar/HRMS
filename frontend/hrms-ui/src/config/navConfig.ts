import { adminNav, adminRoutes } from './adminMenuConfig';

export interface NavItem {
  to: string;
  label: string;
  icon: string;
  children?: NavItem[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

/** Admin / Company panel — full HRMMitra-style menu (see adminMenuConfig.ts) */
export { adminNav };

/** Manager panel — team oversight & approvals */
export const managerNav: NavSection[] = [
  {
    items: [{ to: '/dashboard', label: 'Dashboard', icon: '▣' }],
  },
  {
    title: 'My Team',
    items: [
      { to: '/employees', label: 'Team Members', icon: '👥' },
      { to: '/attendance', label: 'Team Attendance', icon: '🕐' },
      { to: '/leave', label: 'Leave Approvals', icon: '🏖️' },
    ],
  },
  {
    title: 'Talent',
    items: [
      { to: '/recruitment', label: 'Recruitment', icon: '📋' },
      { to: '/training', label: 'Training', icon: '🎓' },
      { to: '/performance', label: 'Performance', icon: '⭐' },
    ],
  },
  {
    title: 'Work',
    items: [
      { to: '/projects', label: 'Projects & Tasks', icon: '📁' },
      { to: '/events', label: 'Events & Meetings', icon: '📅' },
    ],
  },
  {
    title: 'Approvals',
    items: [
      { to: '/expenses', label: 'Expense Claims', icon: '🧾' },
      { to: '/travel', label: 'Travel Requests', icon: '✈️' },
      { to: '/core-hr/resignations', label: 'Resignations', icon: '📤' },
    ],
  },
  {
    title: 'Reports',
    items: [{ to: '/reports', label: 'Team Reports', icon: '📈' }],
  },
];

/** Employee self-service panel */
export const employeeNav: NavSection[] = [
  {
    items: [{ to: '/dashboard', label: 'Dashboard', icon: '▣' }],
  },
  {
    title: 'My Work',
    items: [
      { to: '/attendance', label: 'Attendance', icon: '🕐' },
      { to: '/leave', label: 'Leave Request', icon: '🏖️' },
      { to: '/projects', label: 'My Tasks', icon: '📁' },
    ],
  },
  {
    title: 'Pay & Benefits',
    items: [{ to: '/payroll', label: 'Payslip', icon: '💰' }],
  },
  {
    title: 'Growth',
    items: [
      { to: '/training', label: 'Training', icon: '🎓' },
      { to: '/performance', label: 'My Performance', icon: '⭐' },
      { to: '/awards', label: 'Awards', icon: '🏆' },
    ],
  },
  {
    title: 'Requests',
    items: [
      { to: '/travel', label: 'Travel Request', icon: '✈️' },
      { to: '/expenses', label: 'Expense Claim', icon: '🧾' },
      { to: '/core-hr/resignations', label: 'Resignation', icon: '📤' },
    ],
  },
  {
    title: 'Self Service',
    items: [
      { to: '/documents', label: 'My Documents', icon: '📄' },
      { to: '/tickets', label: 'Support Tickets', icon: '🎫' },
      { to: '/complaints', label: 'Complaints', icon: '📢' },
      { to: '/events', label: 'Events', icon: '📅' },
    ],
  },
];

export function getNavForRole(role: string): NavSection[] {
  if (role === 'Admin') return adminNav;
  if (role === 'Manager') return managerNav;
  return employeeNav;
}

/** Routes each role may access (blocks direct URL entry) */
export const roleRoutes: Record<string, string[]> = {
  Admin: adminRoutes,
  Manager: [
    '/dashboard', '/employees', '/attendance', '/leave', '/recruitment', '/training',
    '/performance', '/projects', '/events', '/expenses', '/travel', '/reports',
    '/core-hr',
  ],
  Employee: [
    '/dashboard', '/attendance', '/leave', '/payroll', '/training', '/performance',
    '/projects', '/events', '/expenses', '/travel', '/awards', '/documents',
    '/tickets', '/complaints', '/core-hr',
  ],
};

export function isRouteAllowed(role: string, path: string): boolean {
  const allowed = roleRoutes[role] ?? roleRoutes.Employee;
  return allowed.some((route) => path === route || path.startsWith(`${route}/`));
}
