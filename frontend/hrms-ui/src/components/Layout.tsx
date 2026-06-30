import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isRouteAllowed } from '../config/navConfig';
import Sidebar from '../components/Sidebar';
import './Layout.css';

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export default function Layout() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => localStorage.getItem('sidebarCollapsed') === 'true',
  );

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed));
  }, [sidebarCollapsed]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (user && !isRouteAllowed(user.role, location.pathname)) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleSidebar = () => setSidebarCollapsed((c) => !c);

  return (
    <div className={`layout${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
      <Sidebar collapsed={sidebarCollapsed} />
      <div className="layout-body">
        <header className="app-header">
          <button
            type="button"
            className="sidebar-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand menu' : 'Collapse menu'}
            aria-expanded={!sidebarCollapsed}
          >
            <HamburgerIcon />
          </button>
          <div className="app-header-title">
            <span className="app-header-company">{user?.companyName}</span>
          </div>
          <div className="app-header-user">
            <span className="app-header-name">{user?.fullName}</span>
            <span className="app-header-role">{user?.role}</span>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
