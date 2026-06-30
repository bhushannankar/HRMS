using HRMS.API.Data;
using HRMS.API.DTOs;
using HRMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMS.API.Services;

public class AuthService
{
    private readonly HrmsDbContext _db;
    private readonly JwtService _jwt;

    public AuthService(HrmsDbContext db, JwtService jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var login = request.UsernameOrEmail.Trim();
        var user = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.Company)
            .Include(u => u.Employee)
            .FirstOrDefaultAsync(u =>
                u.IsActive &&
                (u.Username == login || u.Email.ToLower() == login.ToLower()));

        if (user is null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return null;

        user.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        var fullName = user.Employee != null
            ? $"{user.Employee.FirstName} {user.Employee.LastName}"
            : user.Username;

        var token = _jwt.GenerateToken(user.UserId, user.Username, user.Email, user.Role.RoleName, user.CompanyId, user.Employee?.EmployeeId);

        return new LoginResponse(
            token,
            user.UserId,
            user.Employee?.EmployeeId,
            user.Username,
            user.Email,
            user.Role.RoleName,
            fullName,
            user.CompanyId,
            user.Company.CompanyName);
    }
}

public class DashboardService
{
    private readonly HrmsDbContext _db;

    public DashboardService(HrmsDbContext db) => _db = db;

    public async Task<DashboardStatsDto> GetStatsAsync(int companyId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var totalEmployees = await _db.Employees.CountAsync(e => e.CompanyId == companyId && e.IsActive);
        var presentToday = await CountPresentAsync(companyId, today);
        var onLeave = await CountOnLeaveAsync(companyId, today);
        var pendingLeaves = await _db.LeaveRequests
            .CountAsync(l => l.Status == "Pending" && l.Employee.CompanyId == companyId);
        var departments = await _db.Departments.CountAsync(d => d.CompanyId == companyId && d.IsActive);
        return new DashboardStatsDto(totalEmployees, presentToday, onLeave, pendingLeaves, departments);
    }

    public async Task<RoleDashboardResponse> GetRoleDashboardAsync(int companyId, string role, int? employeeId)
    {
        return role switch
        {
            "Admin" => new RoleDashboardResponse("Admin", await GetAdminDashboardAsync(companyId), null, null),
            "Manager" when employeeId.HasValue => new RoleDashboardResponse("Manager", null, await GetManagerDashboardAsync(companyId, employeeId.Value), null),
            _ when employeeId.HasValue => new RoleDashboardResponse("Employee", null, null, await GetEmployeeDashboardAsync(companyId, employeeId.Value)),
            _ => new RoleDashboardResponse(role, await GetAdminDashboardAsync(companyId), null, null)
        };
    }

    private async Task<int> CountPresentAsync(int companyId, DateOnly today) =>
        await _db.AttendanceRecords.CountAsync(a =>
            a.AttendanceDate == today && a.Status == "Present" && a.Employee.CompanyId == companyId);

    private async Task<int> CountOnLeaveAsync(int companyId, DateOnly today) =>
        await _db.LeaveRequests.CountAsync(l =>
            l.Status == "Approved" && l.StartDate <= today && l.EndDate >= today &&
            l.Employee.CompanyId == companyId);

    private async Task<List<DashboardAnnouncementItemDto>> GetAnnouncementsAsync(int companyId) =>
        await _db.Announcements
            .Where(a => a.CompanyId == companyId && a.IsActive)
            .OrderByDescending(a => a.CreatedAt)
            .Take(5)
            .Select(a => new DashboardAnnouncementItemDto(a.Title, a.Content, a.StartDate))
            .ToListAsync();

    private async Task<List<DashboardHolidayItemDto>> GetUpcomingHolidaysAsync(int companyId, int limit = 5)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        return await _db.Holidays
            .Where(h => h.CompanyId == companyId && h.IsActive && h.HolidayDate >= today)
            .OrderBy(h => h.HolidayDate)
            .Take(limit)
            .Select(h => new DashboardHolidayItemDto(h.HolidayName, h.HolidayDate))
            .ToListAsync();
    }

    public async Task<AdminDashboardDto> GetAdminDashboardAsync(int companyId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var year = today.Year;
        var totalEmployees = await _db.Employees.CountAsync(e => e.CompanyId == companyId && e.IsActive);
        var leftEmployees = await _db.Employees.CountAsync(e => e.CompanyId == companyId && !e.IsActive);
        var presentToday = await CountPresentAsync(companyId, today);
        var onLeave = await CountOnLeaveAsync(companyId, today);
        var onWfh = await _db.AttendanceRecords.CountAsync(a =>
            a.AttendanceDate == today && a.Status == "WFH" && a.Employee.CompanyId == companyId);
        var absentToday = Math.Max(0, totalEmployees - presentToday - onLeave - onWfh);
        var pendingLeaves = await _db.LeaveRequests.CountAsync(l => l.Status == "Pending" && l.Employee.CompanyId == companyId);
        var departments = await _db.Departments.CountAsync(d => d.CompanyId == companyId && d.IsActive);
        var openJobs = await _db.JobPostings.CountAsync(j => j.CompanyId == companyId && j.Status == "Open");
        var openTickets = await _db.SupportTickets.CountAsync(t => t.CompanyId == companyId && t.Status == "Open");
        var pendingExpenses = await _db.ExpenseClaims.CountAsync(e => e.Status == "Pending" && e.Employee.CompanyId == companyId);
        var activeProjects = await _db.Projects.CountAsync(p => p.CompanyId == companyId && p.Status == "Active");

        var statCards = new List<DashboardWidgetDto>
        {
            new("Total Employees", totalEmployees, "blue", "employees"),
            new("Departments", departments, "purple", "departments"),
            new("Present Today", presentToday, "green", "present"),
            new("Absent Today", absentToday, "red", "absent"),
            new("On Leave", onLeave, "orange", "leave"),
            new("Pending Leaves", pendingLeaves, "yellow", "pending-leave"),
            new("Open Jobs", openJobs, "blue", "jobs"),
            new("Open Tickets", openTickets, "purple", "tickets"),
            new("Pending Expenses", pendingExpenses, "orange", "expenses"),
            new("Active Projects", activeProjects, "green", "projects")
        };

        var byDept = await _db.Employees
            .Where(e => e.CompanyId == companyId && e.IsActive && e.DepartmentId != null)
            .GroupBy(e => e.Department!.DepartmentName)
            .Select(g => new DepartmentCountDto(g.Key, g.Count()))
            .ToListAsync();

        var pendingLeaveList = await _db.LeaveRequests
            .Include(l => l.Employee).Include(l => l.LeaveType)
            .Where(l => l.Status == "Pending" && l.Employee.CompanyId == companyId)
            .OrderByDescending(l => l.CreatedAt).Take(8)
            .Select(l => new DashboardLeaveItemDto(l.LeaveRequestId,
                l.Employee.FirstName + " " + l.Employee.LastName,
                l.LeaveType.LeaveTypeName, l.StartDate, l.EndDate, l.Status))
            .ToListAsync();

        var todayAttendance = await _db.AttendanceRecords
            .Include(a => a.Employee)
            .Where(a => a.AttendanceDate == today && a.Employee.CompanyId == companyId)
            .OrderByDescending(a => a.ClockIn)
            .Take(10)
            .Select(a => new DashboardAttendanceItemDto(
                a.Employee.FirstName + " " + a.Employee.LastName,
                a.ClockIn.HasValue ? a.ClockIn.Value.ToString("HH:mm") : null,
                a.ClockOut.HasValue ? a.ClockOut.Value.ToString("HH:mm") : null,
                a.Status))
            .ToListAsync();

        var activeEmps = await _db.Employees
            .Include(e => e.Department)
            .Where(e => e.CompanyId == companyId && e.IsActive)
            .ToListAsync();

        var genderDistribution = activeEmps
            .GroupBy(e => string.IsNullOrWhiteSpace(e.Gender) ? "Not Specified" : e.Gender!)
            .Select(g => new DashboardLabelCountDto(g.Key, g.Count()))
            .OrderByDescending(g => g.Count)
            .ToList();

        var ageDistribution = activeEmps
            .Select(e =>
            {
                if (!e.DateOfBirth.HasValue) return "Not Specified";
                var age = today.Year - e.DateOfBirth.Value.Year;
                if (e.DateOfBirth.Value > today.AddYears(-age)) age--;
                return age switch
                {
                    < 26 => "18-25",
                    < 36 => "26-35",
                    < 46 => "36-45",
                    < 56 => "46-55",
                    _ => "56+"
                };
            })
            .GroupBy(a => a)
            .Select(g => new DashboardLabelCountDto(g.Key, g.Count()))
            .OrderBy(g => g.Label)
            .ToList();

        var ctcByLocation = activeEmps
            .GroupBy(e => string.IsNullOrWhiteSpace(e.City) ? "Not Specified" : e.City!)
            .Select(g => new DashboardLocationCtcDto(g.Key, g.Count(), g.Sum(e => e.BasicSalary * 12)))
            .OrderByDescending(c => c.AnnualCtc)
            .ToList();

        var ctcByDepartment = activeEmps
            .Where(e => e.Department != null)
            .GroupBy(e => e.Department!.DepartmentName)
            .Select(g => new DashboardCtcByDepartmentDto(g.Key, g.Count(), g.Sum(e => e.BasicSalary * 12)))
            .OrderByDescending(c => c.AnnualCtc)
            .ToList();

        var ctcByLocationDept = activeEmps
            .Where(e => e.Department != null)
            .GroupBy(e => (
                Location: string.IsNullOrWhiteSpace(e.City) ? "Not Specified" : e.City!,
                Dept: e.Department!.DepartmentName))
            .Select(g => new DashboardCtcByLocationDeptDto(g.Key.Location, g.Key.Dept, g.Count(), g.Sum(e => e.BasicSalary * 12)))
            .OrderBy(c => c.Location).ThenBy(c => c.DepartmentName)
            .ToList();

        var allEmps = await _db.Employees.Where(e => e.CompanyId == companyId).ToListAsync();
        var monthNames = new[] { "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };
        var additionsAndAttrition = Enumerable.Range(1, 12).Select(m =>
        {
            var additions = allEmps.Count(e => e.JoinDate.Year == year && e.JoinDate.Month == m);
            var attrition = allEmps.Count(e => !e.IsActive && e.UpdatedAt.HasValue &&
                e.UpdatedAt.Value.Year == year && e.UpdatedAt.Value.Month == m);
            return new DashboardMonthlyMovementDto(monthNames[m - 1], additions, attrition);
        }).ToList();

        decimal Pct(int count) => totalEmployees > 0 ? Math.Round((decimal)count / totalEmployees * 100, 1) : 0;
        var attendanceStatusCards = new List<DashboardAttendanceStatusDto>
        {
            new("Employee Absent Today", absentToday, Pct(absentToday), "absent"),
            new("Employee Present Today", presentToday, Pct(presentToday), "present"),
            new("Employee On Leave", onLeave, Pct(onLeave), "leave"),
            new("Employee On WFH", onWfh, Pct(onWfh), "wfh")
        };

        var monthStart = new DateOnly(today.Year, today.Month, 1);
        var monthEnd = monthStart.AddMonths(1).AddDays(-1);
        var calendarEvents = new List<DashboardCalendarEventDto>();

        var holidays = await _db.Holidays
            .Where(h => h.CompanyId == companyId && h.IsActive && h.HolidayDate >= monthStart && h.HolidayDate <= monthEnd)
            .ToListAsync();
        calendarEvents.AddRange(holidays.Select(h => new DashboardCalendarEventDto(h.HolidayName, h.HolidayDate, "Holiday")));

        var leaves = await _db.LeaveRequests
            .Include(l => l.Employee).Include(l => l.LeaveType)
            .Where(l => l.Employee.CompanyId == companyId && l.Status == "Approved" &&
                l.StartDate <= monthEnd && l.EndDate >= monthStart)
            .ToListAsync();
        foreach (var l in leaves)
        {
            var start = l.StartDate < monthStart ? monthStart : l.StartDate;
            var end = l.EndDate > monthEnd ? monthEnd : l.EndDate;
            for (var d = start; d <= end; d = d.AddDays(1))
                calendarEvents.Add(new DashboardCalendarEventDto(
                    $"{l.Employee.FirstName} {l.Employee.LastName} - {l.LeaveType.LeaveTypeName}", d, "Leave"));
        }

        var events = await _db.Events
            .Where(e => e.CompanyId == companyId && e.IsActive && e.EventDate >= monthStart && e.EventDate <= monthEnd)
            .ToListAsync();
        calendarEvents.AddRange(events.Select(e => new DashboardCalendarEventDto(e.Title, e.EventDate, "Event")));

        var meetings = await _db.Meetings
            .Where(m => m.CompanyId == companyId && m.MeetingDate >= monthStart && m.MeetingDate <= monthEnd)
            .ToListAsync();
        calendarEvents.AddRange(meetings.Select(m => new DashboardCalendarEventDto(m.Title, m.MeetingDate, "Meeting")));

        return new AdminDashboardDto(statCards, byDept, pendingLeaveList, todayAttendance,
            await GetUpcomingHolidaysAsync(companyId), await GetAnnouncementsAsync(companyId),
            absentToday, openJobs, openTickets, pendingExpenses, activeProjects,
            totalEmployees, leftEmployees, presentToday, onLeave, onWfh,
            genderDistribution, ageDistribution, ctcByLocation, additionsAndAttrition,
            ctcByDepartment, ctcByLocationDept, attendanceStatusCards, calendarEvents);
    }

    public async Task<ManagerDashboardDto> GetManagerDashboardAsync(int companyId, int managerEmployeeId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var teamIds = await _db.Employees
            .Where(e => e.CompanyId == companyId && e.IsActive && (e.ManagerId == managerEmployeeId || e.EmployeeId == managerEmployeeId))
            .Select(e => e.EmployeeId)
            .ToListAsync();

        var teamSize = teamIds.Count;
        var presentToday = await _db.AttendanceRecords.CountAsync(a =>
            teamIds.Contains(a.EmployeeId) && a.AttendanceDate == today && a.Status == "Present");
        var onLeave = await _db.LeaveRequests.CountAsync(l =>
            teamIds.Contains(l.EmployeeId) && l.Status == "Approved" && l.StartDate <= today && l.EndDate >= today);
        var pendingApprovals = await _db.LeaveRequests.CountAsync(l =>
            l.Status == "Pending" && teamIds.Contains(l.EmployeeId));
        var pendingExpenses = await _db.ExpenseClaims.CountAsync(e =>
            e.Status == "Pending" && teamIds.Contains(e.EmployeeId));
        var pendingTravel = await _db.TravelRequests.CountAsync(t =>
            t.Status == "Pending" && teamIds.Contains(t.EmployeeId));
        var upcomingMeetings = await _db.Meetings.CountAsync(m =>
            m.CompanyId == companyId && m.MeetingDate >= today && m.Status == "Scheduled");

        var statCards = new List<DashboardWidgetDto>
        {
            new("Team Members", teamSize, "blue", "team"),
            new("Present Today", presentToday, "green", "present"),
            new("On Leave", onLeave, "orange", "leave"),
            new("Leave Approvals", pendingApprovals, "yellow", "approvals"),
            new("Expense Approvals", pendingExpenses, "orange", "expenses"),
            new("Travel Approvals", pendingTravel, "purple", "travel"),
            new("Upcoming Meetings", upcomingMeetings, "blue", "meetings")
        };

        var approvalList = await _db.LeaveRequests
            .Include(l => l.Employee).Include(l => l.LeaveType)
            .Where(l => l.Status == "Pending" && teamIds.Contains(l.EmployeeId))
            .OrderBy(l => l.StartDate).Take(8)
            .Select(l => new DashboardLeaveItemDto(l.LeaveRequestId,
                l.Employee.FirstName + " " + l.Employee.LastName,
                l.LeaveType.LeaveTypeName, l.StartDate, l.EndDate, l.Status))
            .ToListAsync();

        var teamAttendance = await _db.AttendanceRecords
            .Include(a => a.Employee)
            .Where(a => teamIds.Contains(a.EmployeeId) && a.AttendanceDate == today)
            .Select(a => new DashboardAttendanceItemDto(
                a.Employee.FirstName + " " + a.Employee.LastName,
                a.ClockIn.HasValue ? a.ClockIn.Value.ToString("HH:mm") : null,
                a.ClockOut.HasValue ? a.ClockOut.Value.ToString("HH:mm") : null,
                a.Status))
            .ToListAsync();

        var teamTasks = await _db.Tasks
            .Include(t => t.Project).Include(t => t.Assignee)
            .Where(t => t.AssignedTo != null && teamIds.Contains(t.AssignedTo.Value) && t.Status != "Done")
            .OrderBy(t => t.DueDate)
            .Take(8)
            .Select(t => new DashboardTaskItemDto(t.Title, t.Project.ProjectName, t.DueDate, t.Status, t.Priority))
            .ToListAsync();

        return new ManagerDashboardDto(statCards, approvalList, teamAttendance, teamTasks,
            await GetAnnouncementsAsync(companyId), pendingExpenses, pendingTravel, upcomingMeetings);
    }

    public async Task<EmployeeDashboardDto> GetEmployeeDashboardAsync(int companyId, int employeeId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var year = today.Year;

        var attendance = await _db.AttendanceRecords
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.AttendanceDate == today);

        var leaveBalances = await _db.LeaveBalances
            .Include(lb => lb.LeaveType)
            .Where(lb => lb.EmployeeId == employeeId && lb.Year == year)
            .Select(lb => new DashboardLeaveBalanceWidgetDto(
                lb.LeaveType.LeaveTypeName, lb.TotalDays, lb.UsedDays, lb.TotalDays - lb.UsedDays))
            .ToListAsync();

        var myLeaves = await _db.LeaveRequests
            .Include(l => l.LeaveType)
            .Where(l => l.EmployeeId == employeeId)
            .OrderByDescending(l => l.CreatedAt).Take(5)
            .Select(l => new DashboardLeaveItemDto(l.LeaveRequestId, "Me",
                l.LeaveType.LeaveTypeName, l.StartDate, l.EndDate, l.Status))
            .ToListAsync();

        var latestPayslip = await _db.Payslips
            .Include(p => p.PayrollRun)
            .Where(p => p.EmployeeId == employeeId)
            .OrderByDescending(p => p.PayrollRun.PayPeriodYear)
            .ThenByDescending(p => p.PayrollRun.PayPeriodMonth)
            .Select(p => new DashboardPayslipSummaryDto(
                p.PayrollRun.PayPeriodMonth, p.PayrollRun.PayPeriodYear, p.NetSalary, p.PaymentStatus))
            .FirstOrDefaultAsync();

        var myTasks = await _db.Tasks
            .Include(t => t.Project)
            .Where(t => t.AssignedTo == employeeId && t.Status != "Done")
            .OrderBy(t => t.DueDate).Take(6)
            .Select(t => new DashboardTaskItemDto(t.Title, t.Project.ProjectName, t.DueDate, t.Status, t.Priority))
            .ToListAsync();

        var trainingCount = await _db.TrainingEnrollments.CountAsync(e => e.EmployeeId == employeeId && e.Status == "Enrolled");
        var awardsCount = await _db.Awards.CountAsync(a => a.EmployeeId == employeeId);
        var pendingLeaves = myLeaves.Count(l => l.Status == "Pending");
        var monthPresent = await _db.AttendanceRecords.CountAsync(a =>
            a.EmployeeId == employeeId && a.AttendanceDate.Month == today.Month &&
            a.AttendanceDate.Year == today.Year && a.Status == "Present");

        var statCards = new List<DashboardWidgetDto>
        {
            new("Present This Month", monthPresent, "green", "present"),
            new("Pending Leaves", pendingLeaves, "yellow", "leave"),
            new("Open Tasks", myTasks.Count, "blue", "tasks"),
            new("Trainings", trainingCount, "purple", "training"),
            new("Awards", awardsCount, "orange", "awards")
        };

        return new EmployeeDashboardDto(statCards, leaveBalances, myLeaves, latestPayslip, myTasks,
            await GetUpcomingHolidaysAsync(companyId, 4), await GetAnnouncementsAsync(companyId),
            attendance?.ClockIn != null, attendance?.ClockOut != null,
            attendance?.ClockIn?.ToString("HH:mm"), trainingCount, awardsCount);
    }
}

public class EmployeeService
{
    private readonly HrmsDbContext _db;

    public EmployeeService(HrmsDbContext db) => _db = db;

    public async Task<List<EmployeeDto>> GetAllAsync(int companyId, int? managerId = null)
    {
        var query = _db.Employees
            .Include(e => e.User)
            .Include(e => e.Department)
            .Include(e => e.Designation)
            .Include(e => e.Manager)
            .Where(e => e.CompanyId == companyId);

        if (managerId.HasValue)
            query = query.Where(e => e.ManagerId == managerId || e.EmployeeId == managerId);

        return await query
            .OrderBy(e => e.FirstName)
            .Select(e => ToDto(e))
            .ToListAsync();
    }

    public async Task<EmployeeDto?> GetByIdAsync(int id, int companyId)
    {
        var e = await _db.Employees
            .Include(x => x.User)
            .Include(x => x.Department)
            .Include(x => x.Designation)
            .Include(x => x.Manager)
            .FirstOrDefaultAsync(x => x.EmployeeId == id && x.CompanyId == companyId);
        return e is null ? null : ToDto(e);
    }

    public async Task<EmployeeDto> CreateAsync(int companyId, CreateEmployeeRequest req)
    {
        var role = await _db.Roles.FirstAsync(r => r.RoleName == req.RoleName);
        var user = new User
        {
            CompanyId = companyId,
            RoleId = role.RoleId,
            Username = req.Username,
            Email = req.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.Password),
            CreatedAt = DateTime.UtcNow
        };
        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var employee = new Employee
        {
            CompanyId = companyId,
            UserId = user.UserId,
            EmployeeCode = req.EmployeeCode,
            FirstName = req.FirstName,
            LastName = req.LastName,
            DepartmentId = req.DepartmentId,
            DesignationId = req.DesignationId,
            ManagerId = req.ManagerId,
            OfficeShiftId = req.OfficeShiftId,
            JoinDate = req.JoinDate,
            BasicSalary = req.BasicSalary,
            Phone = req.Phone,
            CreatedAt = DateTime.UtcNow
        };
        _db.Employees.Add(employee);
        await _db.SaveChangesAsync();

        await SeedLeaveBalancesAsync(employee.EmployeeId, companyId);
        return (await GetByIdAsync(employee.EmployeeId, companyId))!;
    }

    private async Task SeedLeaveBalancesAsync(int employeeId, int companyId)
    {
        var year = DateTime.Today.Year;
        var types = await _db.LeaveTypes.Where(lt => lt.CompanyId == companyId && lt.DaysPerYear > 0).ToListAsync();
        foreach (var lt in types)
        {
            _db.LeaveBalances.Add(new LeaveBalance
            {
                EmployeeId = employeeId,
                LeaveTypeId = lt.LeaveTypeId,
                Year = year,
                TotalDays = lt.DaysPerYear
            });
        }
        await _db.SaveChangesAsync();
    }

    private static EmployeeDto ToDto(Employee e) => new(
        e.EmployeeId,
        e.EmployeeCode,
        e.FirstName,
        e.LastName,
        $"{e.FirstName} {e.LastName}",
        e.User?.Email,
        e.Phone,
        e.Department?.DepartmentName,
        e.Designation?.DesignationName,
        e.Manager != null ? $"{e.Manager.FirstName} {e.Manager.LastName}" : null,
        e.JoinDate,
        e.BasicSalary,
        e.IsActive);
}

public class AttendanceService
{
    private readonly HrmsDbContext _db;

    public AttendanceService(HrmsDbContext db) => _db = db;

    public async Task<List<AttendanceDto>> GetRecordsAsync(int companyId, int? employeeId, DateOnly? from, DateOnly? to)
    {
        var query = _db.AttendanceRecords
            .Include(a => a.Employee)
            .Where(a => a.Employee.CompanyId == companyId);

        if (employeeId.HasValue) query = query.Where(a => a.EmployeeId == employeeId);
        if (from.HasValue) query = query.Where(a => a.AttendanceDate >= from);
        if (to.HasValue) query = query.Where(a => a.AttendanceDate <= to);

        return await query.OrderByDescending(a => a.AttendanceDate)
            .Select(a => new AttendanceDto(
                a.AttendanceId, a.EmployeeId,
                a.Employee.FirstName + " " + a.Employee.LastName,
                a.AttendanceDate, a.ClockIn, a.ClockOut, a.Status, a.WorkHours))
            .ToListAsync();
    }

    public async Task<AttendanceDto> ClockInAsync(int employeeId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var record = await _db.AttendanceRecords
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.AttendanceDate == today);

        if (record is null)
        {
            record = new AttendanceRecord
            {
                EmployeeId = employeeId,
                AttendanceDate = today,
                ClockIn = DateTime.Now,
                Status = "Present",
                CreatedAt = DateTime.UtcNow
            };
            _db.AttendanceRecords.Add(record);
        }
        else if (record.ClockIn is null)
        {
            record.ClockIn = DateTime.Now;
            record.Status = "Present";
        }

        await _db.SaveChangesAsync();
        return new AttendanceDto(record.AttendanceId, record.EmployeeId,
            record.Employee.FirstName + " " + record.Employee.LastName,
            record.AttendanceDate, record.ClockIn, record.ClockOut, record.Status, record.WorkHours);
    }

    public async Task<AttendanceDto> ClockOutAsync(int employeeId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        var record = await _db.AttendanceRecords
            .Include(a => a.Employee)
            .FirstOrDefaultAsync(a => a.EmployeeId == employeeId && a.AttendanceDate == today)
            ?? throw new InvalidOperationException("No clock-in found for today.");

        record.ClockOut = DateTime.Now;
        if (record.ClockIn.HasValue)
            record.WorkHours = (decimal)(record.ClockOut.Value - record.ClockIn.Value).TotalHours;

        await _db.SaveChangesAsync();
        return new AttendanceDto(record.AttendanceId, record.EmployeeId,
            record.Employee.FirstName + " " + record.Employee.LastName,
            record.AttendanceDate, record.ClockIn, record.ClockOut, record.Status, record.WorkHours);
    }
}

public class LeaveService
{
    private readonly HrmsDbContext _db;

    public LeaveService(HrmsDbContext db) => _db = db;

    public async Task<List<LeaveTypeDto>> GetLeaveTypesAsync(int companyId) =>
        await _db.LeaveTypes.Where(lt => lt.CompanyId == companyId && lt.IsActive)
            .Select(lt => new LeaveTypeDto(lt.LeaveTypeId, lt.LeaveTypeName, lt.DaysPerYear, lt.IsPaid))
            .ToListAsync();

    public async Task<List<LeaveBalanceDto>> GetBalancesAsync(int employeeId, int year) =>
        await _db.LeaveBalances
            .Include(lb => lb.LeaveType)
            .Where(lb => lb.EmployeeId == employeeId && lb.Year == year)
            .Select(lb => new LeaveBalanceDto(
                lb.LeaveTypeId, lb.LeaveType.LeaveTypeName,
                lb.TotalDays, lb.UsedDays, lb.TotalDays - lb.UsedDays))
            .ToListAsync();

    public async Task<List<LeaveRequestDto>> GetRequestsAsync(int companyId, int? employeeId, string? status)
    {
        var query = _db.LeaveRequests
            .Include(l => l.Employee)
            .Include(l => l.LeaveType)
            .Where(l => l.Employee.CompanyId == companyId);

        if (employeeId.HasValue) query = query.Where(l => l.EmployeeId == employeeId);
        if (!string.IsNullOrEmpty(status)) query = query.Where(l => l.Status == status);

        return await query.OrderByDescending(l => l.CreatedAt)
            .Select(l => new LeaveRequestDto(
                l.LeaveRequestId, l.EmployeeId,
                l.Employee.FirstName + " " + l.Employee.LastName,
                l.LeaveType.LeaveTypeName, l.StartDate, l.EndDate,
                l.TotalDays, l.Reason, l.Status, l.CreatedAt))
            .ToListAsync();
    }

    public async Task<LeaveRequestDto> CreateRequestAsync(int employeeId, CreateLeaveRequest req)
    {
        var days = req.EndDate.DayNumber - req.StartDate.DayNumber + 1;
        var entity = new LeaveRequest
        {
            EmployeeId = employeeId,
            LeaveTypeId = req.LeaveTypeId,
            StartDate = req.StartDate,
            EndDate = req.EndDate,
            TotalDays = days,
            Reason = req.Reason,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };
        _db.LeaveRequests.Add(entity);
        await _db.SaveChangesAsync();

        var created = await _db.LeaveRequests
            .Include(l => l.Employee)
            .Include(l => l.LeaveType)
            .FirstAsync(l => l.LeaveRequestId == entity.LeaveRequestId);

        return new LeaveRequestDto(
            created.LeaveRequestId, created.EmployeeId,
            created.Employee.FirstName + " " + created.Employee.LastName,
            created.LeaveType.LeaveTypeName, created.StartDate, created.EndDate,
            created.TotalDays, created.Reason, created.Status, created.CreatedAt);
    }

    public async Task<bool> ApproveAsync(int requestId, int approverEmployeeId, bool approve, string? rejectionReason)
    {
        var request = await _db.LeaveRequests
            .Include(l => l.Employee)
            .FirstOrDefaultAsync(l => l.LeaveRequestId == requestId);
        if (request is null || request.Status != "Pending") return false;

        request.ApprovedBy = approverEmployeeId;
        request.ApprovedAt = DateTime.UtcNow;
        request.Status = approve ? "Approved" : "Rejected";
        request.RejectionReason = approve ? null : rejectionReason;

        if (approve)
        {
            var year = request.StartDate.Year;
            var balance = await _db.LeaveBalances.FirstOrDefaultAsync(lb =>
                lb.EmployeeId == request.EmployeeId &&
                lb.LeaveTypeId == request.LeaveTypeId &&
                lb.Year == year);
            if (balance != null)
                balance.UsedDays += request.TotalDays;
        }

        await _db.SaveChangesAsync();
        return true;
    }
}

public class PayrollService
{
    private readonly HrmsDbContext _db;

    public PayrollService(HrmsDbContext db) => _db = db;

    public async Task<List<PayslipDto>> GetPayslipsAsync(int employeeId) =>
        await _db.Payslips
            .Include(p => p.PayrollRun)
            .Where(p => p.EmployeeId == employeeId)
            .OrderByDescending(p => p.PayrollRun.PayPeriodYear)
            .ThenByDescending(p => p.PayrollRun.PayPeriodMonth)
            .Select(p => new PayslipDto(
                p.PayslipId, p.PayrollRun.PayPeriodMonth, p.PayrollRun.PayPeriodYear,
                p.BasicSalary, p.Allowances, p.Deductions, p.NetSalary, p.PaymentStatus, p.GeneratedAt))
            .ToListAsync();
}

public class SetupService
{
    private readonly HrmsDbContext _db;

    public SetupService(HrmsDbContext db) => _db = db;

    public async Task<List<DepartmentDto>> GetDepartmentsAsync(int companyId) =>
        await _db.Departments.Where(d => d.CompanyId == companyId && d.IsActive)
            .Select(d => new DepartmentDto(d.DepartmentId, d.DepartmentName, d.Description,
                d.Employees.Count(e => e.IsActive)))
            .ToListAsync();

    public async Task<List<DesignationDto>> GetDesignationsAsync(int companyId) =>
        await _db.Designations.Where(d => d.CompanyId == companyId && d.IsActive)
            .Select(d => new DesignationDto(d.DesignationId, d.DesignationName, d.Description))
            .ToListAsync();

    public async Task<List<HolidayDto>> GetHolidaysAsync(int companyId) =>
        await _db.Holidays.Where(h => h.CompanyId == companyId && h.IsActive)
            .OrderBy(h => h.HolidayDate)
            .Select(h => new HolidayDto(h.HolidayId, h.HolidayName, h.HolidayDate, h.Description))
            .ToListAsync();

    public async Task<List<AnnouncementDto>> GetAnnouncementsAsync(int companyId) =>
        await _db.Announcements.Where(a => a.CompanyId == companyId && a.IsActive)
            .OrderByDescending(a => a.CreatedAt)
            .Select(a => new AnnouncementDto(a.AnnouncementId, a.Title, a.Content, a.StartDate, a.EndDate, a.CreatedAt))
            .ToListAsync();
}
