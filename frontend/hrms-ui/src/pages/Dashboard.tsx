import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  AdditionsAttritionChart,
  AgeDistributionChart,
  AttendanceOverviewChart,
  CtcByLocationChart,
  DepartmentChart,
  formatCtc,
  GenderDistributionChart,
} from '../components/DashboardCharts';
import '../components/Layout.css';
import './Dashboard.css';

interface Widget { label: string; value: number; color?: string; icon?: string }
interface LeaveItem { leaveRequestId: number; employeeName: string; leaveType: string; startDate: string; endDate: string; status: string }
interface AttendanceItem { employeeName: string; clockIn: string | null; clockOut: string | null; status: string }
interface TaskItem { title: string; projectName: string; dueDate: string | null; status: string; priority: string }
interface HolidayItem { holidayName: string; holidayDate: string }
interface AnnouncementItem { title: string; content: string; startDate: string }
interface LeaveBalance { leaveTypeName: string; total: number; used: number; remaining: number }
interface PayslipSummary { month: number; year: number; netSalary: number; paymentStatus: string }
interface LabelCount { label: string; count: number }
interface LocationCtc { location: string; employeeCount: number; annualCtc: number }
interface CtcDept { departmentName: string; employeeCount: number; annualCtc: number }
interface CtcLocDept { location: string; departmentName: string; employeeCount: number; annualCtc: number }
interface MonthlyMovement { month: string; additions: number; attrition: number }
interface AttendanceStatus { label: string; count: number; percent: number; type: string }
interface CalendarEvent { title: string; date: string; eventType: string }

interface RoleDashboard {
  role: string;
  admin?: AdminDash;
  manager?: ManagerDash;
  employee?: EmployeeDash;
}

interface AdminDash {
  statCards: Widget[];
  employeesByDepartment: { departmentName: string; count: number }[];
  pendingLeaves: LeaveItem[];
  todayAttendance: AttendanceItem[];
  upcomingHolidays: HolidayItem[];
  announcements: AnnouncementItem[];
  totalEmployees: number;
  leftEmployees: number;
  presentToday: number;
  onLeaveToday: number;
  onWfhToday: number;
  absentToday: number;
  pendingExpenses: number;
  openJobs: number;
  openTickets: number;
  activeProjects: number;
  genderDistribution: LabelCount[];
  ageDistribution: LabelCount[];
  ctcByLocation: LocationCtc[];
  additionsAndAttrition: MonthlyMovement[];
  ctcByDepartment: CtcDept[];
  ctcByLocationDept: CtcLocDept[];
  attendanceStatusCards: AttendanceStatus[];
  calendarEvents: CalendarEvent[];
}

interface ManagerDash {
  statCards: Widget[];
  pendingApprovals: LeaveItem[];
  teamAttendanceToday: AttendanceItem[];
  teamTasks: TaskItem[];
  announcements: AnnouncementItem[];
  pendingExpenses: number;
  pendingTravel: number;
  upcomingMeetings: number;
}

interface EmployeeDash {
  statCards: Widget[];
  leaveBalances: LeaveBalance[];
  myLeaveRequests: LeaveItem[];
  latestPayslip: PayslipSummary | null;
  myTasks: TaskItem[];
  upcomingHolidays: HolidayItem[];
  announcements: AnnouncementItem[];
  clockedInToday: boolean;
  clockedOutToday: boolean;
  todayClockIn: string | null;
}

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function StatCards({ cards }: { cards: Widget[] }) {
  return (
    <div className="dashboard-stat-grid">
      {cards.map((c) => (
        <div key={c.label} className={`dash-widget dash-widget-${c.color ?? 'blue'}`}>
          <div className="dash-widget-label">{c.label}</div>
          <div className="dash-widget-value">{c.value}</div>
        </div>
      ))}
    </div>
  );
}

function HrCalendar({ events }: { events: CalendarEvent[] }) {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDay = events.reduce<Record<number, CalendarEvent[]>>((acc, e) => {
    const d = new Date(e.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      (acc[day] ??= []).push(e);
    }
    return acc;
  }, {});

  const typeColor: Record<string, string> = {
    Holiday: '#16a34a',
    Leave: '#0ea5e9',
    Event: '#1e3a5f',
    Meeting: '#0d9488',
  };

  return (
    <div className="hr-calendar">
      <div className="hr-cal-toolbar">
        <button type="button" onClick={() => {
          if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
          else setViewMonth((m) => m - 1);
        }}>‹</button>
        <span>{MONTHS[viewMonth + 1]} {viewYear}</span>
        <button type="button" onClick={() => {
          if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
          else setViewMonth((m) => m + 1);
        }}>›</button>
        <button type="button" className="hr-cal-today" onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); }}>
          Current Month
        </button>
      </div>
      <div className="hr-cal-legend">
        {Object.entries(typeColor).map(([type, color]) => (
          <span key={type}><i style={{ background: color }} /> {type}</span>
        ))}
      </div>
      <div className="hr-cal-grid">
        {DAY_HEADERS.map((d) => <div key={d} className="hr-cal-head">{d}</div>)}
        {cells.map((day, i) => (
          <div key={i} className={`hr-cal-cell${day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear() ? ' today' : ''}`}>
            {day && (
              <>
                <span className="hr-cal-day">{day}</span>
                <div className="hr-cal-dots">
                  {(eventsByDay[day] ?? []).slice(0, 3).map((e, j) => (
                    <span key={j} className="hr-cal-dot" style={{ background: typeColor[e.eventType] ?? '#64748b' }} title={e.title} />
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function LeaveTable({ items, showEmployee = true }: { items: LeaveItem[]; showEmployee?: boolean }) {
  if (items.length === 0) return <p className="empty-widget">No records.</p>;
  return (
    <table className="data-table dash-table">
      <thead>
        <tr>
          {showEmployee && <th>Employee</th>}
          <th>Type</th>
          <th>From</th>
          <th>To</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((l) => (
          <tr key={l.leaveRequestId}>
            {showEmployee && <td>{l.employeeName}</td>}
            <td>{l.leaveType}</td>
            <td>{l.startDate}</td>
            <td>{l.endDate}</td>
            <td><span className={`badge ${l.status.toLowerCase()}`}>{l.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AttendanceTable({ items }: { items: AttendanceItem[] }) {
  if (items.length === 0) return <p className="empty-widget">No attendance records today.</p>;
  return (
    <table className="data-table dash-table">
      <thead><tr><th>Employee</th><th>In</th><th>Out</th><th>Status</th></tr></thead>
      <tbody>
        {items.map((a, i) => (
          <tr key={i}>
            <td>{a.employeeName}</td>
            <td>{a.clockIn ?? '—'}</td>
            <td>{a.clockOut ?? '—'}</td>
            <td><span className="badge present">{a.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TaskTable({ items }: { items: TaskItem[] }) {
  if (items.length === 0) return <p className="empty-widget">No open tasks.</p>;
  return (
    <table className="data-table dash-table">
      <thead><tr><th>Task</th><th>Project</th><th>Due</th><th>Priority</th><th>Status</th></tr></thead>
      <tbody>
        {items.map((t, i) => (
          <tr key={i}>
            <td>{t.title}</td>
            <td>{t.projectName}</td>
            <td>{t.dueDate ?? '—'}</td>
            <td>{t.priority}</td>
            <td><span className="badge pending">{t.status}</span></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function AnnouncementsList({ items }: { items: AnnouncementItem[] }) {
  if (items.length === 0) return <p className="empty-widget">No announcements.</p>;
  return (
    <div className="announcement-list">
      {items.map((a, i) => (
        <div key={i} className="announcement-item">
          <strong>{a.title}</strong>
          <p>{a.content}</p>
        </div>
      ))}
    </div>
  );
}

function HolidaysList({ items }: { items: HolidayItem[] }) {
  if (items.length === 0) return <p className="empty-widget">No upcoming holidays.</p>;
  return (
    <ul className="holiday-list">
      {items.map((h, i) => (
        <li key={i}><span className="holiday-date">{h.holidayDate}</span> {h.holidayName}</li>
      ))}
    </ul>
  );
}

function AdminDashboard({ data }: { data: AdminDash }) {
  return (
    <>
      {/* Quick action cards — HRMMitra style */}
      <div className="xin-quick-grid">
        <Link to="/employees" className="xin-quick-card employees">
          <div className="xin-quick-top">
            <div>
              <div className="xin-quick-label">Employees</div>
              <div className="xin-quick-number">{data.totalEmployees}</div>
            </div>
            {data.leftEmployees > 0 && (
              <span className="xin-quick-badge warn">Left Employees {data.leftEmployees}</span>
            )}
          </div>
          <span className="xin-quick-link">View Employees →</span>
        </Link>

        <Link to="/leave" className="xin-quick-card leave">
          <div className="xin-quick-top">
            <div>
              <div className="xin-quick-label">Leave</div>
              <div className="xin-quick-sub">Management</div>
            </div>
            <span className="xin-quick-badge">{data.pendingLeaves.length} Pending</span>
          </div>
          <span className="xin-quick-link">View Application →</span>
        </Link>

        <Link to="/holidays" className="xin-quick-card holidays">
          <div className="xin-quick-top">
            <div>
              <div className="xin-quick-label">Office</div>
              <div className="xin-quick-sub">Holidays</div>
            </div>
            <span className="xin-quick-badge">{data.upcomingHolidays.length} Upcoming</span>
          </div>
          <span className="xin-quick-link">View →</span>
        </Link>

        <Link to="/attendance" className="xin-quick-card attendance">
          <div className="xin-quick-top">
            <div>
              <div className="xin-quick-label">Manage</div>
              <div className="xin-quick-sub">Attendance</div>
            </div>
            <span className="xin-quick-badge">{data.presentToday} Present</span>
          </div>
          <span className="xin-quick-link">Date wise attendance →</span>
        </Link>
      </div>

      {/* Charts row — Chart.js */}
      <div className="dashboard-charts-grid">
        <div className="panel dash-chart-panel">
          <h2>Department</h2>
          <DepartmentChart data={data.employeesByDepartment} />
        </div>
        <div className="panel dash-chart-panel">
          <h2>Annual CTC By Location</h2>
          <CtcByLocationChart data={data.ctcByLocation} />
        </div>
        <div className="panel dash-chart-panel">
          <h2>Age Distribution</h2>
          <AgeDistributionChart data={data.ageDistribution} />
        </div>
        <div className="panel dash-chart-panel">
          <h2>Additions &amp; Attrition</h2>
          <AdditionsAttritionChart data={data.additionsAndAttrition} />
        </div>
        <div className="panel dash-chart-panel">
          <h2>Gender Distribution</h2>
          <GenderDistributionChart data={data.genderDistribution} />
        </div>
        <div className="panel dash-chart-panel">
          <h2>Today&apos;s Attendance Overview</h2>
          <AttendanceOverviewChart data={data.attendanceStatusCards} />
        </div>
      </div>

      {/* CTC tables */}
      <div className="dashboard-row">
        <div className="panel">
          <h2>Annual CTC By Department</h2>
          <table className="data-table dash-table">
            <thead><tr><th>Department</th><th>Employees</th><th>Annual CTC</th></tr></thead>
            <tbody>
              {data.ctcByDepartment.map((r) => (
                <tr key={r.departmentName}>
                  <td>{r.departmentName}</td>
                  <td>{r.employeeCount}</td>
                  <td>{formatCtc(r.annualCtc)}</td>
                </tr>
              ))}
              {data.ctcByDepartment.length === 0 && (
                <tr><td colSpan={3} className="empty-widget">No data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h2>Annual CTC By Location &amp; Department</h2>
          <table className="data-table dash-table">
            <thead><tr><th>Location</th><th>Department</th><th>Employees</th><th>Annual CTC</th></tr></thead>
            <tbody>
              {data.ctcByLocationDept.map((r, i) => (
                <tr key={i}>
                  <td>{r.location}</td>
                  <td>{r.departmentName}</td>
                  <td>{r.employeeCount}</td>
                  <td>{formatCtc(r.annualCtc)}</td>
                </tr>
              ))}
              {data.ctcByLocationDept.length === 0 && (
                <tr><td colSpan={4} className="empty-widget">No data.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance status cards */}
      <div className="xin-attend-grid">
        {data.attendanceStatusCards.map((card) => (
          <div key={card.type} className={`xin-attend-card ${card.type}`}>
            <div className="xin-attend-top">
              <div>
                <div className="xin-attend-label">{card.label}</div>
                <div className="xin-attend-number">{card.count}</div>
              </div>
              <span className="xin-attend-badge">{card.type}</span>
            </div>
            <div className="xin-progress-wrap">
              <div className="xin-progress-track">
                <div className="xin-progress-fill" style={{ width: `${card.percent}%` }} />
              </div>
              <div className="xin-progress-meta">
                <span>{card.label.split(' ').slice(-2).join(' ')} Status</span>
                <span>{card.percent}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HR Calendar */}
      <div className="panel dash-calendar-panel">
        <h2>HR Calendar</h2>
        <HrCalendar events={data.calendarEvents} />
      </div>

      {/* Secondary stats + tables */}
      <StatCards cards={data.statCards} />

      <div className="dashboard-row">
        <div className="panel">
          <div className="panel-header-row">
            <h2>Pending Leave Requests</h2>
            <Link to="/leave" className="panel-link">Manage →</Link>
          </div>
          <LeaveTable items={data.pendingLeaves} />
        </div>
        <div className="panel">
          <div className="panel-header-row">
            <h2>Today&apos;s Attendance</h2>
            <Link to="/attendance" className="panel-link">View all →</Link>
          </div>
          <AttendanceTable items={data.todayAttendance} />
        </div>
      </div>

      <div className="dashboard-row">
        <div className="panel">
          <div className="panel-header-row">
            <h2>Upcoming Holidays</h2>
            <Link to="/holidays" className="panel-link">View all →</Link>
          </div>
          <HolidaysList items={data.upcomingHolidays} />
        </div>
        <div className="panel">
          <h2>Announcements</h2>
          <AnnouncementsList items={data.announcements} />
        </div>
      </div>
    </>
  );
}

function ManagerDashboard({ data }: { data: ManagerDash }) {
  return (
    <>
      <StatCards cards={data.statCards} />
      <div className="dashboard-quick-links">
        {data.pendingExpenses > 0 && (
          <Link to="/expenses" className="quick-alert">🧾 {data.pendingExpenses} expense(s) awaiting approval</Link>
        )}
        {data.pendingTravel > 0 && (
          <Link to="/travel" className="quick-alert">✈️ {data.pendingTravel} travel request(s) awaiting approval</Link>
        )}
        {data.upcomingMeetings > 0 && (
          <Link to="/events" className="quick-alert">📅 {data.upcomingMeetings} upcoming meeting(s)</Link>
        )}
      </div>
      <div className="dashboard-row">
        <div className="panel">
          <div className="panel-header-row">
            <h2>Leave Approvals</h2>
            <Link to="/leave" className="panel-link">Review →</Link>
          </div>
          <LeaveTable items={data.pendingApprovals} />
        </div>
        <div className="panel">
          <div className="panel-header-row">
            <h2>Team Attendance Today</h2>
            <Link to="/attendance" className="panel-link">View all →</Link>
          </div>
          <AttendanceTable items={data.teamAttendanceToday} />
        </div>
      </div>
      <div className="dashboard-row">
        <div className="panel">
          <div className="panel-header-row">
            <h2>Team Tasks</h2>
            <Link to="/projects" className="panel-link">View projects →</Link>
          </div>
          <TaskTable items={data.teamTasks} />
        </div>
        <div className="panel">
          <h2>Announcements</h2>
          <AnnouncementsList items={data.announcements} />
        </div>
      </div>
    </>
  );
}

function EmployeeDashboard({ data }: { data: EmployeeDash }) {
  return (
    <>
      <div className="attendance-status-card">
        <div className="attendance-status-info">
          <h3>Today&apos;s Attendance</h3>
          {data.clockedInToday ? (
            <p>Clocked in at <strong>{data.todayClockIn}</strong>{data.clockedOutToday ? ' · Day complete' : ' · Still working'}</p>
          ) : (
            <p>You have not clocked in yet today.</p>
          )}
        </div>
        <Link to="/attendance" className="btn btn-primary">Go to Attendance</Link>
      </div>
      <StatCards cards={data.statCards} />
      <div className="dashboard-row">
        <div className="panel">
          <h2>Leave Balances</h2>
          <div className="leave-balance-grid">
            {data.leaveBalances.map((b) => (
              <div key={b.leaveTypeName} className="leave-balance-card">
                <div className="leave-balance-type">{b.leaveTypeName}</div>
                <div className="leave-balance-remaining">{b.remaining}</div>
                <div className="leave-balance-sub">of {b.total} days</div>
              </div>
            ))}
          </div>
          <Link to="/leave" className="panel-link" style={{ marginTop: 12, display: 'inline-block' }}>Apply for leave →</Link>
        </div>
        <div className="panel">
          <h2>Latest Payslip</h2>
          {data.latestPayslip ? (
            <div className="payslip-widget">
              <div className="payslip-period">{MONTHS[data.latestPayslip.month]} {data.latestPayslip.year}</div>
              <div className="payslip-amount">₹{data.latestPayslip.netSalary.toLocaleString()}</div>
              <span className="badge approved">{data.latestPayslip.paymentStatus}</span>
              <Link to="/payroll" className="panel-link" style={{ marginTop: 12, display: 'inline-block' }}>View payslips →</Link>
            </div>
          ) : (
            <p className="empty-widget">No payslips available.</p>
          )}
        </div>
      </div>
      <div className="dashboard-row">
        <div className="panel">
          <div className="panel-header-row">
            <h2>My Leave Requests</h2>
            <Link to="/leave" className="panel-link">View all →</Link>
          </div>
          <LeaveTable items={data.myLeaveRequests} showEmployee={false} />
        </div>
        <div className="panel">
          <div className="panel-header-row">
            <h2>My Tasks</h2>
            <Link to="/projects" className="panel-link">View all →</Link>
          </div>
          <TaskTable items={data.myTasks} />
        </div>
      </div>
      <div className="dashboard-row">
        <div className="panel">
          <h2>Upcoming Holidays</h2>
          <HolidaysList items={data.upcomingHolidays} />
        </div>
        <div className="panel">
          <h2>Announcements</h2>
          <AnnouncementsList items={data.announcements} />
        </div>
      </div>
    </>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [dash, setDash] = useState<RoleDashboard | null>(null);

  useEffect(() => {
    dashboardApi.getDashboard().then((r) => setDash(r.data));
  }, [user]);

  const title = user?.role === 'Admin' ? 'HR Dashboard' :
    user?.role === 'Manager' ? 'Manager Dashboard' : 'My Dashboard';

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>{title}</h1>
        <p>Welcome back, {user?.fullName}</p>
      </div>
      {dash?.admin && <AdminDashboard data={dash.admin} />}
      {dash?.manager && <ManagerDashboard data={dash.manager} />}
      {dash?.employee && <EmployeeDashboard data={dash.employee} />}
      {!dash && <p style={{ color: '#666' }}>Loading dashboard...</p>}
    </div>
  );
}
