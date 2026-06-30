namespace HRMS.API.Models;

public class JobPosting
{
    public int JobPostingId { get; set; }
    public int CompanyId { get; set; }
    public int? DepartmentId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Requirements { get; set; }
    public int Vacancies { get; set; } = 1;
    public string Status { get; set; } = "Open";
    public DateOnly PostedDate { get; set; }
    public DateOnly? ClosingDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public Company Company { get; set; } = null!;
    public Department? Department { get; set; }
    public ICollection<JobApplication> Applications { get; set; } = [];
}

public class JobApplication
{
    public int ApplicationId { get; set; }
    public int JobPostingId { get; set; }
    public string CandidateName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? ResumeUrl { get; set; }
    public int? ExperienceYears { get; set; }
    public string Status { get; set; } = "Applied";
    public DateTime AppliedDate { get; set; }
    public JobPosting JobPosting { get; set; } = null!;
    public ICollection<Interview> Interviews { get; set; } = [];
}

public class Interview
{
    public int InterviewId { get; set; }
    public int ApplicationId { get; set; }
    public int InterviewerId { get; set; }
    public DateTime ScheduledAt { get; set; }
    public string Status { get; set; } = "Scheduled";
    public string? Feedback { get; set; }
    public int? Rating { get; set; }
    public JobApplication Application { get; set; } = null!;
    public Employee Interviewer { get; set; } = null!;
}

public class TrainingProgram
{
    public int TrainingId { get; set; }
    public int CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Trainer { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int? MaxParticipants { get; set; }
    public string Status { get; set; } = "Planned";
    public DateTime CreatedAt { get; set; }
    public Company Company { get; set; } = null!;
    public ICollection<TrainingEnrollment> Enrollments { get; set; } = [];
}

public class TrainingEnrollment
{
    public int EnrollmentId { get; set; }
    public int TrainingId { get; set; }
    public int EmployeeId { get; set; }
    public string Status { get; set; } = "Enrolled";
    public decimal? Score { get; set; }
    public DateOnly? CompletedDate { get; set; }
    public DateTime EnrolledAt { get; set; }
    public TrainingProgram Training { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}

public class Competency
{
    public int CompetencyId { get; set; }
    public int CompanyId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public Company Company { get; set; } = null!;
}

public class PerformanceAppraisal
{
    public int AppraisalId { get; set; }
    public int EmployeeId { get; set; }
    public int ReviewerId { get; set; }
    public int PeriodYear { get; set; }
    public int PeriodQuarter { get; set; } = 1;
    public decimal? OverallRating { get; set; }
    public string Status { get; set; } = "Draft";
    public string? Comments { get; set; }
    public DateTime CreatedAt { get; set; }
    public Employee Employee { get; set; } = null!;
    public Employee Reviewer { get; set; } = null!;
}

public class PerformanceGoal
{
    public int GoalId { get; set; }
    public int EmployeeId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly? TargetDate { get; set; }
    public int Progress { get; set; }
    public string Status { get; set; } = "InProgress";
    public DateTime CreatedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}

public class Asset
{
    public int AssetId { get; set; }
    public int CompanyId { get; set; }
    public string AssetName { get; set; } = string.Empty;
    public string AssetCode { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? SerialNumber { get; set; }
    public DateOnly? PurchaseDate { get; set; }
    public decimal? PurchaseValue { get; set; }
    public string Status { get; set; } = "Available";
    public DateTime CreatedAt { get; set; }
    public Company Company { get; set; } = null!;
    public ICollection<AssetAssignment> Assignments { get; set; } = [];
}

public class AssetAssignment
{
    public int AssignmentId { get; set; }
    public int AssetId { get; set; }
    public int EmployeeId { get; set; }
    public DateOnly AssignedDate { get; set; }
    public DateOnly? ReturnDate { get; set; }
    public string Status { get; set; } = "Assigned";
    public string? Notes { get; set; }
    public Asset Asset { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}

public class Project
{
    public int ProjectId { get; set; }
    public int CompanyId { get; set; }
    public string ProjectName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? ManagerId { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string Status { get; set; } = "Active";
    public DateTime CreatedAt { get; set; }
    public Company Company { get; set; } = null!;
    public Employee? Manager { get; set; }
    public ICollection<WorkTask> Tasks { get; set; } = [];
}

public class WorkTask
{
    public int TaskId { get; set; }
    public int ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? AssignedTo { get; set; }
    public DateOnly? DueDate { get; set; }
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "ToDo";
    public DateTime CreatedAt { get; set; }
    public Project Project { get; set; } = null!;
    public Employee? Assignee { get; set; }
}

public class Event
{
    public int EventId { get; set; }
    public int CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly EventDate { get; set; }
    public string? Location { get; set; }
    public int CreatedBy { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public Company Company { get; set; } = null!;
}

public class Meeting
{
    public int MeetingId { get; set; }
    public int CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Agenda { get; set; }
    public DateOnly MeetingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int OrganizerId { get; set; }
    public string? Location { get; set; }
    public string Status { get; set; } = "Scheduled";
    public DateTime CreatedAt { get; set; }
    public Company Company { get; set; } = null!;
    public Employee Organizer { get; set; } = null!;
}

public class Award
{
    public int AwardId { get; set; }
    public int EmployeeId { get; set; }
    public string AwardName { get; set; } = string.Empty;
    public DateOnly AwardDate { get; set; }
    public string? Description { get; set; }
    public int? GivenBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}

public class Warning
{
    public int WarningId { get; set; }
    public int EmployeeId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string? Description { get; set; }
    public DateOnly WarningDate { get; set; }
    public string Severity { get; set; } = "Medium";
    public int IssuedBy { get; set; }
    public DateTime CreatedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}

public class EmployeeDocument
{
    public int DocumentId { get; set; }
    public int EmployeeId { get; set; }
    public string DocumentName { get; set; } = string.Empty;
    public string DocumentType { get; set; } = string.Empty;
    public string? FileUrl { get; set; }
    public DateTime UploadedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}

public class SupportTicket
{
    public int TicketId { get; set; }
    public int CompanyId { get; set; }
    public int EmployeeId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Priority { get; set; } = "Medium";
    public string Status { get; set; } = "Open";
    public int? AssignedTo { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Company Company { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}

public class Complaint
{
    public int ComplaintId { get; set; }
    public int EmployeeId { get; set; }
    public int? AgainstEmployeeId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Status { get; set; } = "Open";
    public DateTime CreatedAt { get; set; }
    public DateTime? ResolvedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}

public class ExpenseClaim
{
    public int ExpenseId { get; set; }
    public int EmployeeId { get; set; }
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string? Description { get; set; }
    public DateOnly ExpenseDate { get; set; }
    public string Status { get; set; } = "Pending";
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}

public class TravelRequest
{
    public int TravelId { get; set; }
    public int EmployeeId { get; set; }
    public string Destination { get; set; } = string.Empty;
    public string? Purpose { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal? EstimatedCost { get; set; }
    public string Status { get; set; } = "Pending";
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public Employee Employee { get; set; } = null!;
}
