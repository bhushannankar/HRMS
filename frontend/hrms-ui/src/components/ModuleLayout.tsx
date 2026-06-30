import { NavLink, Outlet } from 'react-router-dom';
import './ModuleLayout.css';

export interface ModuleNavItem {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
}

interface ModuleLayoutProps {
  title: string;
  subtitle: string;
  navItems: ModuleNavItem[];
}

export default function ModuleLayout({ title, subtitle, navItems }: ModuleLayoutProps) {
  return (
    <div className="module-page">
      <div className="page-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {navItems.length > 1 && (
        <nav className="module-subnav" aria-label={`${title} submenu`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `module-subnav-link${isActive ? ' active' : ''}`}
            >
              <span className="module-subnav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
      <Outlet />
    </div>
  );
}
