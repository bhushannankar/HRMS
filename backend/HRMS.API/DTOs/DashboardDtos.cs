namespace HRMS.API.DTOs;

public record DashboardWidgetDto(string Label, int Value, string? Color = null, string? Icon = null);

public record DepartmentCountDto(string DepartmentName, int Count);

public record DashboardLeaveItemDto(
    int LeaveRequestId,
    string EmployeeName,
    string LeaveType,
    DateOnly StartDate,
    DateOnly EndDate,
    string Status
);

public record DashboardAttendanceItemDto(
    string EmployeeName,
    string? ClockIn,
    string? ClockOut,
    string Status
);

public record DashboardTaskItemDto(string Title, string ProjectName, DateOnly? DueDate, string Status, string Priority);

public record DashboardPayslipSummaryDto(int Month, int Year, decimal NetSalary, string PaymentStatus);

public record DashboardLeaveBalanceWidgetDto(string LeaveTypeName, decimal Total, decimal Used, decimal Remaining);

public record DashboardHolidayItemDto(string HolidayName, DateOnly HolidayDate);

public record DashboardAnnouncementItemDto(string Title, string Content, DateOnly StartDate);

public record DashboardLabelCountDto(string Label, int Count);

public record DashboardLocationCtcDto(string Location, int EmployeeCount, decimal AnnualCtc);

public record DashboardCtcByDepartmentDto(string DepartmentName, int EmployeeCount, decimal AnnualCtc);

public record DashboardCtcByLocationDeptDto(string Location, string DepartmentName, int EmployeeCount, decimal AnnualCtc);

public record DashboardMonthlyMovementDto(string Month, int Additions, int Attrition);

public record DashboardAttendanceStatusDto(string Label, int Count, decimal Percent, string Type);

public record DashboardCalendarEventDto(string Title, DateOnly Date, string EventType);

public record AdminDashboardDto(
    List<DashboardWidgetDto> StatCards,
    List<DepartmentCountDto> EmployeesByDepartment,
    List<DashboardLeaveItemDto> PendingLeaves,
    List<DashboardAttendanceItemDto> TodayAttendance,
    List<DashboardHolidayItemDto> UpcomingHolidays,
    List<DashboardAnnouncementItemDto> Announcements,
    int AbsentToday,
    int OpenJobs,
    int OpenTickets,
    int PendingExpenses,
    int ActiveProjects,
    int TotalEmployees,
    int LeftEmployees,
    int PresentToday,
    int OnLeaveToday,
    int OnWfhToday,
    List<DashboardLabelCountDto> GenderDistribution,
    List<DashboardLabelCountDto> AgeDistribution,
    List<DashboardLocationCtcDto> CtcByLocation,
    List<DashboardMonthlyMovementDto> AdditionsAndAttrition,
    List<DashboardCtcByDepartmentDto> CtcByDepartment,
    List<DashboardCtcByLocationDeptDto> CtcByLocationDept,
    List<DashboardAttendanceStatusDto> AttendanceStatusCards,
    List<DashboardCalendarEventDto> CalendarEvents
);

public record ManagerDashboardDto(
    List<DashboardWidgetDto> StatCards,
    List<DashboardLeaveItemDto> PendingApprovals,
    List<DashboardAttendanceItemDto> TeamAttendanceToday,
    List<DashboardTaskItemDto> TeamTasks,
    List<DashboardAnnouncementItemDto> Announcements,
    int PendingExpenses,
    int PendingTravel,
    int UpcomingMeetings
);

public record EmployeeDashboardDto(
    List<DashboardWidgetDto> StatCards,
    List<DashboardLeaveBalanceWidgetDto> LeaveBalances,
    List<DashboardLeaveItemDto> MyLeaveRequests,
    DashboardPayslipSummaryDto? LatestPayslip,
    List<DashboardTaskItemDto> MyTasks,
    List<DashboardHolidayItemDto> UpcomingHolidays,
    List<DashboardAnnouncementItemDto> Announcements,
    bool ClockedInToday,
    bool ClockedOutToday,
    string? TodayClockIn,
    int TrainingEnrolled,
    int AwardsCount
);

public record RoleDashboardResponse(
    string Role,
    AdminDashboardDto? Admin,
    ManagerDashboardDto? Manager,
    EmployeeDashboardDto? Employee
);
