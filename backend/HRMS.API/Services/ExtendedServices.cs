using HRMS.API.Data;
using HRMS.API.DTOs;
using HRMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMS.API.Services;

public class RecruitmentService
{
    private readonly HrmsDbContext _db;
    public RecruitmentService(HrmsDbContext db) => _db = db;

    public async Task<List<JobPostingDto>> GetJobsAsync(int companyId) =>
        await _db.JobPostings.Include(j => j.Department)
            .Where(j => j.CompanyId == companyId)
            .OrderByDescending(j => j.PostedDate)
            .Select(j => new JobPostingDto(j.JobPostingId, j.Title, j.Department != null ? j.Department.DepartmentName : null,
                j.Vacancies, j.Status, j.PostedDate, j.ClosingDate, j.Applications.Count))
            .ToListAsync();

    public async Task<JobPostingDto> CreateJobAsync(int companyId, CreateJobPostingRequest req)
    {
        var job = new JobPosting
        {
            CompanyId = companyId, Title = req.Title, DepartmentId = req.DepartmentId,
            Description = req.Description, Requirements = req.Requirements,
            Vacancies = req.Vacancies, PostedDate = req.PostedDate, ClosingDate = req.ClosingDate,
            CreatedAt = DateTime.UtcNow
        };
        _db.JobPostings.Add(job);
        await _db.SaveChangesAsync();
        return new JobPostingDto(job.JobPostingId, job.Title, null, job.Vacancies, job.Status, job.PostedDate, job.ClosingDate, 0);
    }

    public async Task<List<JobApplicationDto>> GetApplicationsAsync(int companyId, int? jobId = null)
    {
        var q = _db.JobApplications.Include(a => a.JobPosting)
            .Where(a => a.JobPosting.CompanyId == companyId);
        if (jobId.HasValue) q = q.Where(a => a.JobPostingId == jobId);
        return await q.OrderByDescending(a => a.AppliedDate)
            .Select(a => new JobApplicationDto(a.ApplicationId, a.JobPostingId, a.JobPosting.Title,
                a.CandidateName, a.Email, a.Phone, a.ExperienceYears, a.Status, a.AppliedDate))
            .ToListAsync();
    }

    public async Task<JobApplicationDto> CreateApplicationAsync(CreateJobApplicationRequest req)
    {
        var app = new JobApplication
        {
            JobPostingId = req.JobPostingId, CandidateName = req.CandidateName,
            Email = req.Email, Phone = req.Phone, ExperienceYears = req.ExperienceYears,
            AppliedDate = DateTime.UtcNow
        };
        _db.JobApplications.Add(app);
        await _db.SaveChangesAsync();
        var job = await _db.JobPostings.FindAsync(req.JobPostingId);
        return new JobApplicationDto(app.ApplicationId, app.JobPostingId, job!.Title,
            app.CandidateName, app.Email, app.Phone, app.ExperienceYears, app.Status, app.AppliedDate);
    }

    public async Task<List<InterviewDto>> GetInterviewsAsync(int companyId) =>
        await _db.Interviews.Include(i => i.Application).Include(i => i.Interviewer)
            .Where(i => i.Application.JobPosting.CompanyId == companyId)
            .OrderBy(i => i.ScheduledAt)
            .Select(i => new InterviewDto(i.InterviewId, i.Application.CandidateName,
                i.Interviewer.FirstName + " " + i.Interviewer.LastName, i.ScheduledAt, i.Status, i.Rating))
            .ToListAsync();
}

public class TrainingService
{
    private readonly HrmsDbContext _db;
    public TrainingService(HrmsDbContext db) => _db = db;

    public async Task<List<TrainingDto>> GetProgramsAsync(int companyId) =>
        await _db.TrainingPrograms.Where(t => t.CompanyId == companyId)
            .OrderByDescending(t => t.StartDate)
            .Select(t => new TrainingDto(t.TrainingId, t.Title, t.Trainer, t.StartDate, t.EndDate, t.Status, t.Enrollments.Count))
            .ToListAsync();

    public async Task<TrainingDto> CreateProgramAsync(int companyId, CreateTrainingRequest req)
    {
        var t = new TrainingProgram
        {
            CompanyId = companyId, Title = req.Title, Description = req.Description,
            Trainer = req.Trainer, StartDate = req.StartDate, EndDate = req.EndDate,
            MaxParticipants = req.MaxParticipants, CreatedAt = DateTime.UtcNow
        };
        _db.TrainingPrograms.Add(t);
        await _db.SaveChangesAsync();
        return new TrainingDto(t.TrainingId, t.Title, t.Trainer, t.StartDate, t.EndDate, t.Status, 0);
    }

    public async Task<List<EnrollmentDto>> GetEnrollmentsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.TrainingEnrollments.Include(e => e.Training).Include(e => e.Employee)
            .Where(e => e.Training.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(e => e.EmployeeId == employeeId);
        return await q.Select(e => new EnrollmentDto(e.EnrollmentId, e.Training.Title,
            e.Employee.FirstName + " " + e.Employee.LastName, e.Status, e.Score)).ToListAsync();
    }

    public async Task<bool> EnrollAsync(int trainingId, int employeeId)
    {
        if (await _db.TrainingEnrollments.AnyAsync(e => e.TrainingId == trainingId && e.EmployeeId == employeeId))
            return false;
        _db.TrainingEnrollments.Add(new TrainingEnrollment { TrainingId = trainingId, EmployeeId = employeeId, EnrolledAt = DateTime.UtcNow });
        await _db.SaveChangesAsync();
        return true;
    }
}

public class PerformanceService
{
    private readonly HrmsDbContext _db;
    public PerformanceService(HrmsDbContext db) => _db = db;

    public async Task<List<CompetencyDto>> GetCompetenciesAsync(int companyId) =>
        await _db.Competencies.Where(c => c.CompanyId == companyId && c.IsActive)
            .Select(c => new CompetencyDto(c.CompetencyId, c.Name, c.Description)).ToListAsync();

    public async Task<List<AppraisalDto>> GetAppraisalsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.PerformanceAppraisals.Include(a => a.Employee).Include(a => a.Reviewer)
            .Where(a => a.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(a => a.EmployeeId == employeeId);
        return await q.OrderByDescending(a => a.PeriodYear).ThenByDescending(a => a.PeriodQuarter)
            .Select(a => new AppraisalDto(a.AppraisalId, a.Employee.FirstName + " " + a.Employee.LastName,
                a.Reviewer.FirstName + " " + a.Reviewer.LastName, a.PeriodYear, a.PeriodQuarter,
                a.OverallRating, a.Status, a.Comments)).ToListAsync();
    }

    public async Task<AppraisalDto> CreateAppraisalAsync(CreateAppraisalRequest req)
    {
        var a = new PerformanceAppraisal
        {
            EmployeeId = req.EmployeeId, ReviewerId = req.ReviewerId,
            PeriodYear = req.PeriodYear, PeriodQuarter = req.PeriodQuarter,
            OverallRating = req.OverallRating, Comments = req.Comments, Status = "Completed",
            CreatedAt = DateTime.UtcNow
        };
        _db.PerformanceAppraisals.Add(a);
        await _db.SaveChangesAsync();
        var emp = await _db.Employees.FindAsync(req.EmployeeId);
        var rev = await _db.Employees.FindAsync(req.ReviewerId);
        return new AppraisalDto(a.AppraisalId, $"{emp!.FirstName} {emp.LastName}", $"{rev!.FirstName} {rev.LastName}",
            a.PeriodYear, a.PeriodQuarter, a.OverallRating, a.Status, a.Comments);
    }

    public async Task<List<GoalDto>> GetGoalsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.PerformanceGoals.Include(g => g.Employee).Where(g => g.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(g => g.EmployeeId == employeeId);
        return await q.Select(g => new GoalDto(g.GoalId, g.Title, g.Description, g.TargetDate, g.Progress, g.Status,
            g.Employee.FirstName + " " + g.Employee.LastName)).ToListAsync();
    }
}

public class AssetService
{
    private readonly HrmsDbContext _db;
    public AssetService(HrmsDbContext db) => _db = db;

    public async Task<List<AssetDto>> GetAssetsAsync(int companyId)
    {
        var assets = await _db.Assets.Where(a => a.CompanyId == companyId).ToListAsync();
        var assignments = await _db.AssetAssignments
            .Include(a => a.Employee)
            .Where(a => a.Status == "Assigned")
            .ToListAsync();
        return assets.Select(a =>
        {
            var assign = assignments.FirstOrDefault(x => x.AssetId == a.AssetId);
            var assignedTo = assign != null ? $"{assign.Employee.FirstName} {assign.Employee.LastName}" : null;
            return new AssetDto(a.AssetId, a.AssetName, a.AssetCode, a.Category, a.Status, assignedTo);
        }).ToList();
    }

    public async Task<AssetDto> CreateAssetAsync(int companyId, CreateAssetRequest req)
    {
        var a = new Asset
        {
            CompanyId = companyId, AssetName = req.AssetName, AssetCode = req.AssetCode,
            Category = req.Category, SerialNumber = req.SerialNumber,
            PurchaseDate = req.PurchaseDate, PurchaseValue = req.PurchaseValue, CreatedAt = DateTime.UtcNow
        };
        _db.Assets.Add(a);
        await _db.SaveChangesAsync();
        return new AssetDto(a.AssetId, a.AssetName, a.AssetCode, a.Category, a.Status, null);
    }

    public async Task<bool> AssignAssetAsync(int assetId, int employeeId)
    {
        var asset = await _db.Assets.FindAsync(assetId);
        if (asset is null) return false;
        _db.AssetAssignments.Add(new AssetAssignment
        {
            AssetId = assetId, EmployeeId = employeeId,
            AssignedDate = DateOnly.FromDateTime(DateTime.Today), Status = "Assigned"
        });
        asset.Status = "Assigned";
        await _db.SaveChangesAsync();
        return true;
    }
}

public class ProjectService
{
    private readonly HrmsDbContext _db;
    public ProjectService(HrmsDbContext db) => _db = db;

    public async Task<List<ProjectDto>> GetProjectsAsync(int companyId) =>
        await _db.Projects.Include(p => p.Manager).Where(p => p.CompanyId == companyId)
            .Select(p => new ProjectDto(p.ProjectId, p.ProjectName,
                p.Manager != null ? p.Manager.FirstName + " " + p.Manager.LastName : null,
                p.Status, p.StartDate, p.EndDate, p.Tasks.Count)).ToListAsync();

    public async Task<List<TaskDto>> GetTasksAsync(int companyId, int? employeeId = null)
    {
        var q = _db.Tasks.Include(t => t.Project).Include(t => t.Assignee)
            .Where(t => t.Project.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(t => t.AssignedTo == employeeId);
        return await q.Select(t => new TaskDto(t.TaskId, t.ProjectId, t.Project.ProjectName, t.Title,
            t.Assignee != null ? t.Assignee.FirstName + " " + t.Assignee.LastName : null,
            t.DueDate, t.Priority, t.Status)).ToListAsync();
    }
}

public class EventService
{
    private readonly HrmsDbContext _db;
    public EventService(HrmsDbContext db) => _db = db;

    public async Task<List<EventDto>> GetEventsAsync(int companyId) =>
        await _db.Events.Where(e => e.CompanyId == companyId && e.IsActive)
            .OrderBy(e => e.EventDate)
            .Select(e => new EventDto(e.EventId, e.Title, e.Description, e.EventDate, e.Location)).ToListAsync();

    public async Task<List<MeetingDto>> GetMeetingsAsync(int companyId) =>
        await _db.Meetings.Include(m => m.Organizer).Where(m => m.CompanyId == companyId)
            .OrderBy(m => m.MeetingDate)
            .Select(m => new MeetingDto(m.MeetingId, m.Title, m.Agenda, m.MeetingDate,
                m.StartTime.ToString(@"hh\:mm"), m.EndTime.ToString(@"hh\:mm"),
                m.Organizer.FirstName + " " + m.Organizer.LastName, m.Location, m.Status)).ToListAsync();
}

public class HrOpsService
{
    private readonly HrmsDbContext _db;
    public HrOpsService(HrmsDbContext db) => _db = db;

    public async Task<List<AwardDto>> GetAwardsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.Awards.Include(a => a.Employee).Where(a => a.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(a => a.EmployeeId == employeeId);
        return await q.OrderByDescending(a => a.AwardDate)
            .Select(a => new AwardDto(a.AwardId, a.Employee.FirstName + " " + a.Employee.LastName,
                a.AwardName, a.AwardDate, a.Description)).ToListAsync();
    }

    public async Task<List<WarningDto>> GetWarningsAsync(int companyId) =>
        await _db.Warnings.Include(w => w.Employee).Where(w => w.Employee.CompanyId == companyId)
            .Select(w => new WarningDto(w.WarningId, w.Employee.FirstName + " " + w.Employee.LastName,
                w.Subject, w.WarningDate, w.Severity)).ToListAsync();

    public async Task<List<DocumentDto>> GetDocumentsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.EmployeeDocuments.Include(d => d.Employee).Where(d => d.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(d => d.EmployeeId == employeeId);
        return await q.OrderByDescending(d => d.UploadedAt)
            .Select(d => new DocumentDto(d.DocumentId, d.DocumentName, d.DocumentType, d.FileUrl, d.UploadedAt,
                d.Employee.FirstName + " " + d.Employee.LastName)).ToListAsync();
    }

    public async Task<List<TicketDto>> GetTicketsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.SupportTickets.Include(t => t.Employee).Where(t => t.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(t => t.EmployeeId == employeeId);
        return await q.OrderByDescending(t => t.CreatedAt)
            .Select(t => new TicketDto(t.TicketId, t.Employee.FirstName + " " + t.Employee.LastName,
                t.Subject, t.Priority, t.Status, t.CreatedAt)).ToListAsync();
    }

    public async Task<TicketDto> CreateTicketAsync(int companyId, int employeeId, string subject, string? description, string priority)
    {
        var t = new SupportTicket { CompanyId = companyId, EmployeeId = employeeId, Subject = subject, Description = description, Priority = priority, CreatedAt = DateTime.UtcNow };
        _db.SupportTickets.Add(t);
        await _db.SaveChangesAsync();
        var emp = await _db.Employees.FindAsync(employeeId);
        return new TicketDto(t.TicketId, $"{emp!.FirstName} {emp.LastName}", t.Subject, t.Priority, t.Status, t.CreatedAt);
    }

    public async Task<List<ComplaintDto>> GetComplaintsAsync(int companyId, int? employeeId = null)
    {
        var q = _db.Complaints.Include(c => c.Employee).Where(c => c.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(c => c.EmployeeId == employeeId);
        return await q.OrderByDescending(c => c.CreatedAt)
            .Select(c => new ComplaintDto(c.ComplaintId, c.Employee.FirstName + " " + c.Employee.LastName,
                c.Subject, c.Status, c.CreatedAt)).ToListAsync();
    }

    public async Task<ComplaintDto> CreateComplaintAsync(int employeeId, string subject, string? description, int? againstEmployeeId)
    {
        var c = new Complaint { EmployeeId = employeeId, Subject = subject, Description = description, AgainstEmployeeId = againstEmployeeId, CreatedAt = DateTime.UtcNow };
        _db.Complaints.Add(c);
        await _db.SaveChangesAsync();
        var emp = await _db.Employees.FindAsync(employeeId);
        return new ComplaintDto(c.ComplaintId, $"{emp!.FirstName} {emp.LastName}", c.Subject, c.Status, c.CreatedAt);
    }

    public async Task<List<ExpenseDto>> GetExpensesAsync(int companyId, int? employeeId = null, string? status = null)
    {
        var q = _db.ExpenseClaims.Include(e => e.Employee).Where(e => e.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(e => e.EmployeeId == employeeId);
        if (!string.IsNullOrEmpty(status)) q = q.Where(e => e.Status == status);
        return await q.OrderByDescending(e => e.ExpenseDate)
            .Select(e => new ExpenseDto(e.ExpenseId, e.Employee.FirstName + " " + e.Employee.LastName,
                e.Category, e.Amount, e.ExpenseDate, e.Status, e.Description)).ToListAsync();
    }

    public async Task<ExpenseDto> CreateExpenseAsync(int employeeId, CreateExpenseRequest req)
    {
        var e = new ExpenseClaim { EmployeeId = employeeId, Category = req.Category, Amount = req.Amount, Description = req.Description, ExpenseDate = req.ExpenseDate, CreatedAt = DateTime.UtcNow };
        _db.ExpenseClaims.Add(e);
        await _db.SaveChangesAsync();
        var emp = await _db.Employees.FindAsync(employeeId);
        return new ExpenseDto(e.ExpenseId, $"{emp!.FirstName} {emp.LastName}", e.Category, e.Amount, e.ExpenseDate, e.Status, e.Description);
    }

    public async Task<bool> ApproveExpenseAsync(int expenseId, int approverId, bool approve)
    {
        var e = await _db.ExpenseClaims.FindAsync(expenseId);
        if (e is null || e.Status != "Pending") return false;
        e.Status = approve ? "Approved" : "Rejected";
        e.ApprovedBy = approverId;
        e.ApprovedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<List<TravelDto>> GetTravelAsync(int companyId, int? employeeId = null, string? status = null)
    {
        var q = _db.TravelRequests.Include(t => t.Employee).Where(t => t.Employee.CompanyId == companyId);
        if (employeeId.HasValue) q = q.Where(t => t.EmployeeId == employeeId);
        if (!string.IsNullOrEmpty(status)) q = q.Where(t => t.Status == status);
        return await q.OrderByDescending(t => t.StartDate)
            .Select(t => new TravelDto(t.TravelId, t.Employee.FirstName + " " + t.Employee.LastName,
                t.Destination, t.Purpose, t.StartDate, t.EndDate, t.EstimatedCost, t.Status)).ToListAsync();
    }

    public async Task<TravelDto> CreateTravelAsync(int employeeId, CreateTravelRequest req)
    {
        var t = new TravelRequest { EmployeeId = employeeId, Destination = req.Destination, Purpose = req.Purpose, StartDate = req.StartDate, EndDate = req.EndDate, EstimatedCost = req.EstimatedCost, CreatedAt = DateTime.UtcNow };
        _db.TravelRequests.Add(t);
        await _db.SaveChangesAsync();
        var emp = await _db.Employees.FindAsync(employeeId);
        return new TravelDto(t.TravelId, $"{emp!.FirstName} {emp.LastName}", t.Destination, t.Purpose, t.StartDate, t.EndDate, t.EstimatedCost, t.Status);
    }

    public async Task<bool> ApproveTravelAsync(int travelId, int approverId, bool approve)
    {
        var t = await _db.TravelRequests.FindAsync(travelId);
        if (t is null || t.Status != "Pending") return false;
        t.Status = approve ? "Approved" : "Rejected";
        t.ApprovedBy = approverId;
        t.ApprovedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }
}

public class ReportsService
{
    private readonly HrmsDbContext _db;
    public ReportsService(HrmsDbContext db) => _db = db;

    public async Task<ReportsSummaryDto> GetSummaryAsync(int companyId)
    {
        var today = DateOnly.FromDateTime(DateTime.Today);
        return new ReportsSummaryDto(
            await _db.JobPostings.CountAsync(j => j.CompanyId == companyId && j.Status == "Open"),
            await _db.JobApplications.CountAsync(a => a.Status == "Applied" && a.JobPosting.CompanyId == companyId),
            await _db.TrainingPrograms.CountAsync(t => t.CompanyId == companyId && t.Status != "Completed"),
            await _db.SupportTickets.CountAsync(t => t.CompanyId == companyId && t.Status == "Open"),
            await _db.ExpenseClaims.CountAsync(e => e.Status == "Pending" && e.Employee.CompanyId == companyId),
            await _db.TravelRequests.CountAsync(t => t.Status == "Pending" && t.Employee.CompanyId == companyId),
            await _db.Projects.CountAsync(p => p.CompanyId == companyId && p.Status == "Active"),
            await _db.Assets.CountAsync(a => a.CompanyId == companyId),
            await _db.Complaints.CountAsync(c => c.Status == "Open" && c.Employee.CompanyId == companyId),
            await _db.Events.CountAsync(e => e.CompanyId == companyId && e.EventDate >= today)
        );
    }
}
