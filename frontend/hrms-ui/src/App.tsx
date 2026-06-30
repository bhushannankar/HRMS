import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import AdminRoute from './pages/AdminRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import OnboardingPage from './pages/OnboardingPage';
import HRCalendarPage from './pages/HRCalendarPage';
import PlaceholderPage from './pages/PlaceholderPage';
import EmployeesLayout from './pages/employees/EmployeesLayout';
import EmployeeList from './pages/employees/EmployeeList';
import EmployeeDirectoryPage from './pages/employees/EmployeeDirectoryPage';
import ReportingHeadPage from './pages/employees/ReportingHeadPage';
import DepartmentsPage from './pages/employees/DepartmentsPage';
import DesignationsPage from './pages/employees/DesignationsPage';
import OfficeShiftsPage from './pages/employees/OfficeShiftsPage';
import RolesPage from './pages/employees/RolesPage';
import PoliciesPage from './pages/employees/PoliciesPage';
import ImportEmployeesPage from './pages/employees/ImportEmployeesPage';
import OrgChartPage from './pages/employees/OrgChartPage';
import AttendanceLayout from './pages/attendance/AttendanceLayout';
import LeaveLayout from './pages/leave/LeaveLayout';
import LeaveAwaitingPage from './pages/leave/LeaveAwaitingPage';
import LeaveDashboardPage from './pages/leave/LeaveDashboardPage';
import PayrollLayout from './pages/payroll/PayrollLayout';
import TaxLayout from './pages/tax/TaxLayout';
import WfhLayout from './pages/wfh/WfhLayout';
import ReportsLayout from './pages/reports/ReportsLayout';
import PerformanceLayout from './pages/performance/PerformanceLayout';
import SettingsLayout from './pages/settings/SettingsLayout';
import CompanySettingsPage from './pages/settings/CompanySettingsPage';
import AnnouncementsPage from './pages/core-hr/AnnouncementsPage';
import ResignationsPage from './pages/core-hr/ResignationsPage';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Holidays from './pages/Holidays';
import Recruitment from './pages/Recruitment';
import Training from './pages/Training';
import Performance from './pages/Performance';
import Assets from './pages/Assets';
import Projects from './pages/Projects';
import Events from './pages/Events';
import Awards from './pages/Awards';
import Documents from './pages/Documents';
import Tickets from './pages/Tickets';
import Complaints from './pages/Complaints';
import Expenses from './pages/Expenses';
import Travel from './pages/Travel';
import Reports from './pages/Reports';
import { EmployeesReportPage, SalaryReportPage, PayrollReportPage, LeaveReportPage, AttendanceReportPage } from './pages/reports/ReportSubPages';
import { KpiPage, AppraisalPage, GoalsPage } from './pages/performance/PerformanceSubPages';
import { MeetingsListPage } from './pages/events/EventsSubPages';
import { TasksListPage } from './pages/tasks/TasksListPage';
import './index.css';

const ph = (title: string, desc?: string) => <PlaceholderPage title={title} description={desc} />;

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/employees" element={<EmployeesLayout />}>
              <Route index element={<EmployeeList />} />
              <Route element={<AdminRoute />}>
                <Route path="inactive" element={<EmployeeList inactive />} />
                <Route path="directory" element={<EmployeeDirectoryPage />} />
                <Route path="reporting" element={<ReportingHeadPage />} />
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="designations" element={<DesignationsPage />} />
                <Route path="office-shifts" element={<OfficeShiftsPage />} />
                <Route path="roles" element={<RolesPage />} />
                <Route path="policies" element={<PoliciesPage />} />
                <Route path="import" element={<ImportEmployeesPage />} />
                <Route path="org-chart" element={<OrgChartPage />} />
                <Route path="bonus" element={ph('Employee Bonus')} />
                <Route path="audit-trail" element={ph('Employee Audit Trail')} />
                <Route path="access" element={ph('Employee Access')} />
              </Route>
            </Route>

            <Route path="/attendance" element={<AttendanceLayout />}>
              <Route index element={<Attendance />} />
              <Route element={<AdminRoute />}>
                <Route path="update" element={ph('Update Attendance')} />
                <Route path="import" element={ph('Import Attendance')} />
                <Route path="notifications" element={ph('Attendance Notifications')} />
                <Route path="regularize" element={ph('Regularize Attendance')} />
              </Route>
            </Route>

            <Route path="/leave" element={<LeaveLayout />}>
              <Route index element={<Leave />} />
              <Route element={<AdminRoute />}>
                <Route path="awaiting" element={<LeaveAwaitingPage />} />
                <Route path="dashboard" element={<LeaveDashboardPage />} />
                <Route path="access-rights" element={ph('Leave Access Rights')} />
              </Route>
            </Route>

            <Route path="/payroll" element={<PayrollLayout />}>
              <Route index element={<Payroll />} />
              <Route element={<AdminRoute />}>
                <Route path="final-attendance" element={ph('Final Attendance')} />
                <Route path="hold-history" element={ph('Hold Payroll History')} />
                <Route path="fnf-history" element={ph('FNF Payroll History')} />
                <Route path="payment-history" element={ph('Payment History')} />
                <Route path="import-ctc" element={ph('Import CTC / Arrear')} />
              </Route>
            </Route>

            <Route path="/performance" element={<PerformanceLayout />}>
              <Route index element={<Performance />} />
              <Route path="kpi" element={<KpiPage />} />
              <Route path="appraisal" element={<AppraisalPage />} />
              <Route path="goals" element={<GoalsPage />} />
            </Route>

            <Route path="/reports" element={<ReportsLayout />}>
              <Route index element={<Reports />} />
              <Route element={<AdminRoute />}>
                <Route path="employees" element={<EmployeesReportPage />} />
                <Route path="salary" element={<SalaryReportPage />} />
                <Route path="payroll" element={<PayrollReportPage />} />
                <Route path="leave" element={<LeaveReportPage />} />
                <Route path="attendance" element={<AttendanceReportPage />} />
              </Route>
            </Route>

            <Route path="/holidays" element={<Holidays />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/training" element={<Training />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/events" element={<Events />} />
            <Route path="/awards" element={<Awards />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/tickets" element={<Tickets />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/travel" element={<Travel />} />
            <Route path="/tasks/list" element={<TasksListPage />} />
            <Route path="/core-hr/resignations" element={<ResignationsPage />} />

            <Route element={<AdminRoute />}>
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/calendar" element={<HRCalendarPage />} />
              <Route path="/shifts/planning" element={ph('Shift Planning')} />
              <Route path="/wfh" element={<WfhLayout />}>
                <Route index element={ph('Manage WFH')} />
                <Route path="apply" element={ph('Bulk Approval WFH')} />
                <Route path="percentage" element={ph('WFH Percentage')} />
                <Route path="config" element={ph('WFH Configuration')} />
              </Route>
              <Route path="/tax" element={<TaxLayout />}>
                <Route index element={<Navigate to="/tax/slabs" replace />} />
                <Route path="slabs" element={ph('Tax Slab Master')} />
                <Route path="assessment" element={ph('Tax Assessment')} />
                <Route path="form16" element={ph('Form 16')} />
                <Route path="declaration" element={ph('IT Declaration')} />
                <Route path="reports" element={ph('Income Tax Reports')} />
              </Route>
              <Route path="/core-hr/announcements" element={<AnnouncementsPage />} />
              <Route path="/core-hr/warnings" element={ph('Warnings')} />
              <Route path="/core-hr/transfers" element={ph('Transfers')} />
              <Route path="/core-hr/promotions" element={ph('Promotions')} />
              <Route path="/events/meetings" element={<MeetingsListPage />} />
              <Route path="/tasks/templates" element={ph('Task Templates')} />
              <Route path="/tasks/workflow" element={ph('Workflow')} />
              <Route path="/field-tracking" element={ph('Field Staff Tracking')} />
              <Route path="/settings" element={<SettingsLayout />}>
                <Route index element={<Navigate to="/settings/company" replace />} />
                <Route path="company" element={<CompanySettingsPage />} />
                <Route path="constants" element={ph('Constants')} />
                <Route path="custom-fields" element={ph('Custom Fields')} />
                <Route path="email-templates" element={ph('Email Templates')} />
                <Route path="theme" element={ph('Theme Settings')} />
                <Route path="backup" element={ph('Database Backup')} />
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
