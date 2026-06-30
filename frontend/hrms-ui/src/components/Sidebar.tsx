import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getNavForRole } from '../config/navConfig';
import './Sidebar.css';

interface SidebarProps {
  collapsed: boolean;
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
              <NavLink
                key={link.to}
                to={link.to}
                title={collapsed ? link.label : undefined}
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <span className="nav-icon">{link.icon}</span>
                {!collapsed && <span className="nav-label">{link.label}</span>}
              </NavLink>
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
