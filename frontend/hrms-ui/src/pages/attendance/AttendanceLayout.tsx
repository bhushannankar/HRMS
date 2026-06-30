import ModuleLayout from '../../components/ModuleLayout';
import { attendanceModuleNav } from '../../config/moduleNav';
import { useAuth } from '../../context/AuthContext';

export default function AttendanceLayout() {
  const { user } = useAuth();
  return (
    <ModuleLayout
      title="Attendance"
      subtitle="Manage attendance, calendar, imports and regularization"
      navItems={user?.role === 'Admin' ? attendanceModuleNav : []}
    />
  );
}
