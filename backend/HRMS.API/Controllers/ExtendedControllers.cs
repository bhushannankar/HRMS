using System.Security.Claims;
using HRMS.API.DTOs;
using HRMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class RecruitmentController : ControllerBase
{
    private readonly RecruitmentService _svc;
    public RecruitmentController(RecruitmentService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet("jobs")]
    public async Task<ActionResult<List<JobPostingDto>>> GetJobs() => Ok(await _svc.GetJobsAsync(CompanyId));

    [HttpPost("jobs")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<JobPostingDto>> CreateJob([FromBody] CreateJobPostingRequest req) =>
        Ok(await _svc.CreateJobAsync(CompanyId, req));

    [HttpGet("applications")]
    public async Task<ActionResult<List<JobApplicationDto>>> GetApplications([FromQuery] int? jobId) =>
        Ok(await _svc.GetApplicationsAsync(CompanyId, jobId));

    [HttpPost("applications")]
    public async Task<ActionResult<JobApplicationDto>> CreateApplication([FromBody] CreateJobApplicationRequest req) =>
        Ok(await _svc.CreateApplicationAsync(req));

    [HttpGet("interviews")]
    public async Task<ActionResult<List<InterviewDto>>> GetInterviews() =>
        Ok(await _svc.GetInterviewsAsync(CompanyId));
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TrainingController : ControllerBase
{
    private readonly TrainingService _svc;
    public TrainingController(TrainingService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<TrainingDto>>> GetPrograms() =>
        Ok(await _svc.GetProgramsAsync(CompanyId));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<TrainingDto>> Create([FromBody] CreateTrainingRequest req) =>
        Ok(await _svc.CreateProgramAsync(CompanyId, req));

    [HttpGet("enrollments")]
    public async Task<ActionResult<List<EnrollmentDto>>> GetEnrollments([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetEnrollmentsAsync(CompanyId, eid));
    }

    [HttpPost("enroll")]
    public async Task<IActionResult> Enroll([FromQuery] int trainingId, [FromQuery] int employeeId)
    {
        var ok = await _svc.EnrollAsync(trainingId, employeeId);
        return ok ? NoContent() : BadRequest();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PerformanceController : ControllerBase
{
    private readonly PerformanceService _svc;
    public PerformanceController(PerformanceService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet("competencies")]
    public async Task<ActionResult<List<CompetencyDto>>> GetCompetencies() =>
        Ok(await _svc.GetCompetenciesAsync(CompanyId));

    [HttpGet("appraisals")]
    public async Task<ActionResult<List<AppraisalDto>>> GetAppraisals([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetAppraisalsAsync(CompanyId, eid));
    }

    [HttpPost("appraisals")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<AppraisalDto>> CreateAppraisal([FromBody] CreateAppraisalRequest req) =>
        Ok(await _svc.CreateAppraisalAsync(req));

    [HttpGet("goals")]
    public async Task<ActionResult<List<GoalDto>>> GetGoals([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetGoalsAsync(CompanyId, eid));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AssetsController : ControllerBase
{
    private readonly AssetService _svc;
    public AssetsController(AssetService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet]
    public async Task<ActionResult<List<AssetDto>>> GetAll() => Ok(await _svc.GetAssetsAsync(CompanyId));

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<AssetDto>> Create([FromBody] CreateAssetRequest req) =>
        Ok(await _svc.CreateAssetAsync(CompanyId, req));

    [HttpPost("{assetId:int}/assign")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Assign(int assetId, [FromQuery] int employeeId)
    {
        var ok = await _svc.AssignAssetAsync(assetId, employeeId);
        return ok ? NoContent() : BadRequest();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly ProjectService _svc;
    public ProjectsController(ProjectService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<ProjectDto>>> GetProjects() =>
        Ok(await _svc.GetProjectsAsync(CompanyId));

    [HttpGet("tasks")]
    public async Task<ActionResult<List<TaskDto>>> GetTasks([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetTasksAsync(CompanyId, eid));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EventsController : ControllerBase
{
    private readonly EventService _svc;
    public EventsController(EventService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet]
    public async Task<ActionResult<List<EventDto>>> GetEvents() =>
        Ok(await _svc.GetEventsAsync(CompanyId));

    [HttpGet("meetings")]
    public async Task<ActionResult<List<MeetingDto>>> GetMeetings() =>
        Ok(await _svc.GetMeetingsAsync(CompanyId));
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AwardsController : ControllerBase
{
    private readonly HrOpsService _svc;
    public AwardsController(HrOpsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<AwardDto>>> GetAwards([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetAwardsAsync(CompanyId, eid));
    }

    [HttpGet("warnings")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<ActionResult<List<WarningDto>>> GetWarnings() =>
        Ok(await _svc.GetWarningsAsync(CompanyId));
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class DocumentsController : ControllerBase
{
    private readonly HrOpsService _svc;
    public DocumentsController(HrOpsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<DocumentDto>>> GetAll([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetDocumentsAsync(CompanyId, eid));
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TicketsController : ControllerBase
{
    private readonly HrOpsService _svc;
    public TicketsController(HrOpsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<TicketDto>>> GetAll([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetTicketsAsync(CompanyId, eid));
    }

    [HttpPost]
    public async Task<ActionResult<TicketDto>> Create([FromBody] CreateTicketRequest req)
    {
        var eid = EmployeeId ?? req.EmployeeId;
        return Ok(await _svc.CreateTicketAsync(CompanyId, eid, req.Subject, req.Description, req.Priority));
    }
}

public record CreateTicketRequest(int EmployeeId, string Subject, string? Description, string Priority);

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ComplaintsController : ControllerBase
{
    private readonly HrOpsService _svc;
    public ComplaintsController(HrOpsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<ComplaintDto>>> GetAll([FromQuery] int? employeeId)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        return Ok(await _svc.GetComplaintsAsync(CompanyId, eid));
    }

    [HttpPost]
    public async Task<ActionResult<ComplaintDto>> Create([FromBody] CreateComplaintRequest req)
    {
        var eid = EmployeeId ?? req.EmployeeId;
        return Ok(await _svc.CreateComplaintAsync(eid, req.Subject, req.Description, req.AgainstEmployeeId));
    }
}

public record CreateComplaintRequest(int EmployeeId, string Subject, string? Description, int? AgainstEmployeeId);

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExpensesController : ControllerBase
{
    private readonly HrOpsService _svc;
    public ExpensesController(HrOpsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<ExpenseDto>>> GetAll([FromQuery] int? employeeId, [FromQuery] string? status)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        var st = User.IsInRole("Employee") ? null : status;
        return Ok(await _svc.GetExpensesAsync(CompanyId, eid, st));
    }

    [HttpPost]
    public async Task<ActionResult<ExpenseDto>> Create([FromBody] CreateExpenseRequest req)
    {
        if (!EmployeeId.HasValue) return BadRequest();
        return Ok(await _svc.CreateExpenseAsync(EmployeeId.Value, req));
    }

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Approve(int id, [FromQuery] int approverId, [FromQuery] bool approve = true)
    {
        var ok = await _svc.ApproveExpenseAsync(id, approverId, approve);
        return ok ? NoContent() : BadRequest();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TravelController : ControllerBase
{
    private readonly HrOpsService _svc;
    public TravelController(HrOpsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);
    private int? EmployeeId => int.TryParse(User.FindFirstValue("employeeId"), out var id) ? id : null;

    [HttpGet]
    public async Task<ActionResult<List<TravelDto>>> GetAll([FromQuery] int? employeeId, [FromQuery] string? status)
    {
        var eid = User.IsInRole("Employee") ? EmployeeId : employeeId;
        var st = User.IsInRole("Employee") ? null : status;
        return Ok(await _svc.GetTravelAsync(CompanyId, eid, st));
    }

    [HttpPost]
    public async Task<ActionResult<TravelDto>> Create([FromBody] CreateTravelRequest req)
    {
        if (!EmployeeId.HasValue) return BadRequest();
        return Ok(await _svc.CreateTravelAsync(EmployeeId.Value, req));
    }

    [HttpPut("{id:int}/approve")]
    [Authorize(Roles = "Admin,Manager")]
    public async Task<IActionResult> Approve(int id, [FromQuery] int approverId, [FromQuery] bool approve = true)
    {
        var ok = await _svc.ApproveTravelAsync(id, approverId, approve);
        return ok ? NoContent() : BadRequest();
    }
}

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportsController : ControllerBase
{
    private readonly ReportsService _svc;
    public ReportsController(ReportsService svc) => _svc = svc;
    private int CompanyId => int.Parse(User.FindFirstValue("companyId")!);

    [HttpGet("summary")]
    public async Task<ActionResult<ReportsSummaryDto>> GetSummary() =>
        Ok(await _svc.GetSummaryAsync(CompanyId));
}
