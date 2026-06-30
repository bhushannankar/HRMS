using System.Security.Claims;
using HRMS.API.DTOs;
using HRMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _auth;

    public AuthController(AuthService auth) => _auth = auth;

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        var result = await _auth.LoginAsync(request);
        if (result is null) return Unauthorized(new { message = "Invalid username or password." });
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboard;

    public DashboardController(DashboardService dashboard) => _dashboard = dashboard;

    [HttpGet("stats")]
    public async Task<ActionResult<DashboardStatsDto>> GetStats()
    {
        var companyId = int.Parse(User.FindFirstValue("companyId")!);
        return Ok(await _dashboard.GetStatsAsync(companyId));
    }

    [HttpGet]
    public async Task<ActionResult<RoleDashboardResponse>> GetDashboard()
    {
        var companyId = int.Parse(User.FindFirstValue("companyId")!);
        var role = User.FindFirstValue(ClaimTypes.Role)!;
        int? employeeId = int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;
        return Ok(await _dashboard.GetRoleDashboardAsync(companyId, role, employeeId));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly EmployeeService _employees;

    public EmployeesController(EmployeeService employees) => _employees = employees;

    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private string Role => User.FindFirstValue(ClaimTypes.Role)!;
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<EmployeeDto>>> GetAll([FromQuery] bool? isActive)
    {
        int? managerFilter = Role == "Manager" ? EmployeeId : null;
        return Ok(await _employees.GetAllAsync(CompanyId, managerFilter, isActive));
    }

    [HttpGet("org-chart")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<OrgChartNodeDto>>> GetOrgChart() =>
        Ok(await _employees.GetOrgChartAsync(CompanyId));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<EmployeeDto>> GetById(int id)
    {
        var emp = await _employees.GetByIdAsync(id, CompanyId);
        return emp is null ? NotFound() : Ok(emp);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EmployeeDto>> Create([FromBody] CreateEmployeeRequest request)
    {
        try
        {
            var emp = await _employees.CreateAsync(CompanyId, request);
            return CreatedAtAction(nameof(GetById), new { id = emp.EmployeeId }, emp);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly AttendanceService _attendance;

    public AttendanceController(AttendanceService attendance) => _attendance = attendance;

    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet]
    public async Task<ActionResult<List<AttendanceDto>>> Get(
        [FromQuery] int? employeeId,
        [FromQuery] DateOnly? from,
        [FromQuery] DateOnly? to)
    {
        return Ok(await _attendance.GetRecordsAsync(CompanyId, employeeId, from, to));
    }

    [HttpPost("clock-in")]
    public async Task<ActionResult<AttendanceDto>> ClockIn([FromQuery] int employeeId)
    {
        return Ok(await _attendance.ClockInAsync(employeeId));
    }

    [HttpPost("clock-out")]
    public async Task<ActionResult<AttendanceDto>> ClockOut([FromQuery] int employeeId)
    {
        return Ok(await _attendance.ClockOutAsync(employeeId));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class LeaveController : ControllerBase
{
    private readonly LeaveService _leave;

    public LeaveController(LeaveService leave) => _leave = leave;

    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet("types")]
    public async Task<ActionResult<List<LeaveTypeDto>>> GetTypes() =>
        Ok(await _leave.GetLeaveTypesAsync(CompanyId));

    [HttpGet("balances/{employeeId:int}")]
    public async Task<ActionResult<List<LeaveBalanceDto>>> GetBalances(int employeeId, [FromQuery] int? year) =>
        Ok(await _leave.GetBalancesAsync(employeeId, year ?? DateTime.Today.Year));

    [HttpGet("requests")]
    public async Task<ActionResult<List<LeaveRequestDto>>> GetRequests(
        [FromQuery] int? employeeId,
        [FromQuery] string? status) =>
        Ok(await _leave.GetRequestsAsync(CompanyId, employeeId, status));

    [HttpPost("requests")]
    public async Task<ActionResult<LeaveRequestDto>> CreateRequest(
        [FromQuery] int employeeId,
        [FromBody] CreateLeaveRequest request)
    {
        var result = await _leave.CreateRequestAsync(employeeId, request);
        return Ok(result);
    }

    [HttpPut("requests/{id:int}/approve")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Approve(int id, [FromQuery] int approverEmployeeId, [FromBody] ApproveLeaveRequest body)
    {
        var ok = await _leave.ApproveAsync(id, approverEmployeeId, true, null);
        return ok ? NoContent() : BadRequest();
    }

    [HttpPut("requests/{id:int}/reject")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Reject(int id, [FromQuery] int approverEmployeeId, [FromBody] ApproveLeaveRequest body)
    {
        var ok = await _leave.ApproveAsync(id, approverEmployeeId, false, body.RejectionReason);
        return ok ? NoContent() : BadRequest();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PayrollController : ControllerBase
{
    private readonly PayrollService _payroll;

    public PayrollController(PayrollService payroll) => _payroll = payroll;

    [HttpGet("payslips/{employeeId:int}")]
    public async Task<ActionResult<List<PayslipDto>>> GetPayslips(int employeeId) =>
        Ok(await _payroll.GetPayslipsAsync(employeeId));
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SetupController : ControllerBase
{
    private readonly SetupService _setup;

    public SetupController(SetupService setup) => _setup = setup;

    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet("departments")]
    public async Task<ActionResult<List<DepartmentDto>>> GetDepartments() =>
        Ok(await _setup.GetDepartmentsAsync(CompanyId));

    [HttpGet("designations")]
    public async Task<ActionResult<List<DesignationDto>>> GetDesignations() =>
        Ok(await _setup.GetDesignationsAsync(CompanyId));

    [HttpGet("office-shifts")]
    public async Task<ActionResult<List<OfficeShiftDto>>> GetOfficeShifts() =>
        Ok(await _setup.GetOfficeShiftsAsync(CompanyId));

    [HttpGet("roles")]
    public async Task<ActionResult<List<SystemRoleDto>>> GetRoles() =>
        Ok(await _setup.GetRolesAsync());

    [HttpGet("holidays")]
    public async Task<ActionResult<List<HolidayDto>>> GetHolidays() =>
        Ok(await _setup.GetHolidaysAsync(CompanyId));

    [HttpGet("announcements")]
    public async Task<ActionResult<List<AnnouncementDto>>> GetAnnouncements() =>
        Ok(await _setup.GetAnnouncementsAsync(CompanyId));
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProfileController : ControllerBase
{
    private readonly ProfileService _profile;
    public ProfileController(ProfileService profile) => _profile = profile;

    private int UserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private string Role => User.FindFirstValue(ClaimTypes.Role)!;

    [HttpGet("me")]
    public async Task<ActionResult<ProfileDto>> GetMyProfile()
    {
        var profile = await _profile.GetProfileAsync(UserId, CompanyId, Role);
        return profile is null ? NotFound() : Ok(profile);
    }

    [HttpPut("me")]
    public async Task<ActionResult<ProfileDto>> UpdateMyProfile([FromBody] UpdateProfileRequest request)
    {
        try
        {
            var profile = await _profile.UpdateProfileAsync(UserId, CompanyId, Role, request);
            return profile is null ? NotFound() : Ok(profile);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("me/password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var ok = await _profile.ChangePasswordAsync(UserId, CompanyId, request);
        return ok ? NoContent() : BadRequest(new { message = "Current password is incorrect or new password is invalid." });
    }
}
