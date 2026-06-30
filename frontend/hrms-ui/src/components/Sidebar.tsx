import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNavForRole, type NavItem } from '../config/navConfig';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
}

function NavItemLink({ link, collapsed }: { link: NavItem; collapsed: boolean }) {
  const location = useLocation();
  const hasChildren = link.children && link.children.length > 0;
  const isChildActive = hasChildren && link.children!.some(
    (c) => location.pathname === c.to || location.pathname.startsWith(`${c.to}/`),
  );
  const [open, setOpen] = useState(isChildActive);

  if (!hasChildren) {
    return (
      <NavLink
        to={link.to}
        end
        title={collapsed ? link.label : undefined}
        className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
      >
        <span className="nav-icon">{link.icon}</span>
        {!collapsed && <span className="nav-label">{link.label}</span>}
      </NavLink>
    );
  }

  if (collapsed) {
    return (
      <>
        <NavLink
          to={link.to}
          title={link.label}
          className={({ isActive }) => `nav-link${isActive || isChildActive ? ' active' : ''}`}
        >
          <span className="nav-icon">{link.icon}</span>
        </NavLink>
        {link.children!.map((child) => (
          <NavLink
            key={child.to}
            to={child.to}
            end={child.to === '/employees' || child.to === '/onboarding'}
            title={child.label}
            className={({ isActive }) => `nav-link nav-sublink-collapsed${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{child.icon}</span>
          </NavLink>
        ))}
      </>
    );
  }

  return (
    <div className={`nav-group${open || isChildActive ? ' open' : ''}`}>
      <button
        type="button"
        className={`nav-link nav-group-toggle${isChildActive ? ' active' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open || isChildActive}
      >
        <span className="nav-icon">{link.icon}</span>
        <span className="nav-label">{link.label}</span>
        <span className="nav-chevron" aria-hidden="true">{open || isChildActive ? '▾' : '▸'}</span>
      </button>
      {(open || isChildActive) && (
        <div className="nav-submenu">
          {link.children!.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              end={child.to === '/employees' || child.to === '/onboarding'}
              className={({ isActive }) => `nav-link nav-sublink${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon">{child.icon}</span>
              <span className="nav-label">{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const sections = getNavForRole(user?.role ?? 'Employee');
  const initials = user?.fullName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() ?? '?';

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">H</div>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <h2>HRMS</h2>
            <span>{user?.companyName}</span>
            <span className="role-badge">{user?.role}</span>
          </div>
        )}
      </div>
      <nav className="sidebar-nav">
        {sections.map((section, idx) => (
          <div key={section.title ?? `section-${idx}`} className="nav-section">
            {section.title && !collapsed && (
              <div className="nav-section-title">{section.title}</div>
            )}
            {section.items.map((link) => (
              <NavItemLink key={link.to + link.label} link={link} collapsed={collapsed} />
            ))}
          </div>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-info" title={collapsed ? user?.fullName : undefined}>
          <div className="user-avatar">{initials}</div>
          {!collapsed && (
            <div className="user-details">
              <strong>{user?.fullName}</strong>
              <span>{user?.email}</span>
            </div>
          )}
        </div>
        <button
          type="button"
          className="logout-btn"
          onClick={logout}
          title={collapsed ? 'Logout' : undefined}
        >
          {collapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </aside>
  );
}
