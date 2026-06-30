namespace HRMS.API.DTOs;

public record LoginRequest(string UsernameOrEmail, string Password);

public record LoginResponse(
    string Token,
    int UserId,
    int? EmployeeId,
    string Username,
    string Email,
    string Role,
    string FullName,
    int CompanyId,
    string CompanyName
);

public record DashboardStatsDto(
    int TotalEmployees,
    int PresentToday,
    int OnLeaveToday,
    int PendingLeaveRequests,
    int TotalDepartments
);

public record EmployeeDto(
    int EmployeeId,
    string EmployeeCode,
    string FirstName,
    string LastName,
    string FullName,
    string? Email,
    string? Phone,
    string? Department,
    string? Designation,
    string? ManagerName,
    DateOnly JoinDate,
    decimal BasicSalary,
    bool IsActive
);

public record CreateEmployeeRequest(
    string Username,
    string Email,
    string Password,
    string EmployeeCode,
    string FirstName,
    string LastName,
    int? DepartmentId,
    int? DesignationId,
    int? ManagerId,
    int? OfficeShiftId,
    DateOnly JoinDate,
    decimal BasicSalary,
    string? Phone,
    string RoleName
);

public record DepartmentDto(int DepartmentId, string DepartmentName, string? Description, int EmployeeCount);
public record DesignationDto(int DesignationId, string DesignationName, string? Description);
public record OfficeShiftDto(int OfficeShiftId, string ShiftName, string StartTime, string EndTime, int GraceMinutes, int EmployeeCount);
public record SystemRoleDto(int RoleId, string RoleName, string? Description, int UserCount);
public record OrgChartNodeDto(
    int EmployeeId,
    string Name,
    string? Designation,
    string? Department,
    int? ManagerId,
    IReadOnlyList<OrgChartNodeDto> Reports
);

public record AttendanceDto(
    int AttendanceId,
    int EmployeeId,
    string EmployeeName,
    DateOnly AttendanceDate,
    DateTime? ClockIn,
    DateTime? ClockOut,
    string Status,
    decimal? WorkHours
);

public record ClockRequest(DateTime? Timestamp);

public record LeaveTypeDto(int LeaveTypeId, string LeaveTypeName, int DaysPerYear, bool IsPaid);

public record LeaveBalanceDto(
    int LeaveTypeId,
    string LeaveTypeName,
    decimal TotalDays,
    decimal UsedDays,
    decimal RemainingDays
);

public record LeaveRequestDto(
    int LeaveRequestId,
    int EmployeeId,
    string EmployeeName,
    string LeaveTypeName,
    DateOnly StartDate,
    DateOnly EndDate,
    decimal TotalDays,
    string? Reason,
    string Status,
    DateTime CreatedAt
);

public record CreateLeaveRequest(int LeaveTypeId, DateOnly StartDate, DateOnly EndDate, string? Reason);

public record ApproveLeaveRequest(string? RejectionReason);

public record PayslipDto(
    int PayslipId,
    int PayPeriodMonth,
    int PayPeriodYear,
    decimal BasicSalary,
    decimal Allowances,
    decimal Deductions,
    decimal NetSalary,
    string PaymentStatus,
    DateTime GeneratedAt
);

public record AnnouncementDto(int AnnouncementId, string Title, string Content, DateOnly StartDate, DateOnly? EndDate, DateTime CreatedAt);

public record HolidayDto(int HolidayId, string HolidayName, DateOnly HolidayDate, string? Description);

public record ProfileDto(
    int UserId,
    int? EmployeeId,
    string Username,
    string Email,
    string Role,
    string FullName,
    string CompanyName,
    string? EmployeeCode,
    string? FirstName,
    string? LastName,
    string? Phone,
    string? Gender,
    DateOnly? DateOfBirth,
    string? Department,
    string? Designation,
    string? ManagerName,
    string? ShiftName,
    DateOnly? JoinDate,
    string? EmploymentType,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? ProfileImageUrl,
    decimal? BasicSalary,
    DateTime? LastLoginAt
);

public record UpdateProfileRequest(
    string? Phone,
    string? Address,
    string? City,
    string? State,
    string? Country,
    string? Email
);

public record ChangePasswordRequest(string CurrentPassword, string NewPassword);
