namespace HRMS.API.DTOs;

// Recruitment
public record JobPostingDto(int JobPostingId, string Title, string? Department, int Vacancies, string Status, DateOnly PostedDate, DateOnly? ClosingDate, int ApplicationCount);
public record CreateJobPostingRequest(string Title, int? DepartmentId, string? Description, string? Requirements, int Vacancies, DateOnly PostedDate, DateOnly? ClosingDate);
public record JobApplicationDto(int ApplicationId, int JobPostingId, string JobTitle, string CandidateName, string Email, string? Phone, int? ExperienceYears, string Status, DateTime AppliedDate);
public record CreateJobApplicationRequest(int JobPostingId, string CandidateName, string Email, string? Phone, int? ExperienceYears);
public record InterviewDto(int InterviewId, string CandidateName, string InterviewerName, DateTime ScheduledAt, string Status, int? Rating);

// Training
public record TrainingDto(int TrainingId, string Title, string? Trainer, DateOnly StartDate, DateOnly? EndDate, string Status, int EnrolledCount);
public record CreateTrainingRequest(string Title, string? Description, string? Trainer, DateOnly StartDate, DateOnly? EndDate, int? MaxParticipants);
public record EnrollmentDto(int EnrollmentId, string TrainingTitle, string EmployeeName, string Status, decimal? Score);

// Performance
public record CompetencyDto(int CompetencyId, string Name, string? Description);
public record AppraisalDto(int AppraisalId, string EmployeeName, string ReviewerName, int PeriodYear, int PeriodQuarter, decimal? OverallRating, string Status, string? Comments);
public record CreateAppraisalRequest(int EmployeeId, int ReviewerId, int PeriodYear, int PeriodQuarter, decimal? OverallRating, string? Comments);
public record GoalDto(int GoalId, string Title, string? Description, DateOnly? TargetDate, int Progress, string Status, string? EmployeeName);

// Assets
public record AssetDto(int AssetId, string AssetName, string AssetCode, string? Category, string Status, string? AssignedTo);
public record CreateAssetRequest(string AssetName, string AssetCode, string? Category, string? SerialNumber, DateOnly? PurchaseDate, decimal? PurchaseValue);

// Projects
public record ProjectDto(int ProjectId, string ProjectName, string? ManagerName, string Status, DateOnly? StartDate, DateOnly? EndDate, int TaskCount);
public record TaskDto(int TaskId, int ProjectId, string ProjectName, string Title, string? AssigneeName, DateOnly? DueDate, string Priority, string Status);

// Events
public record EventDto(int EventId, string Title, string? Description, DateOnly EventDate, string? Location);
public record MeetingDto(int MeetingId, string Title, string? Agenda, DateOnly MeetingDate, string StartTime, string EndTime, string OrganizerName, string? Location, string Status);

// HR Ops
public record AwardDto(int AwardId, string EmployeeName, string AwardName, DateOnly AwardDate, string? Description);
public record WarningDto(int WarningId, string EmployeeName, string Subject, DateOnly WarningDate, string Severity);
public record DocumentDto(int DocumentId, string DocumentName, string DocumentType, string? FileUrl, DateTime UploadedAt, string? EmployeeName);
public record TicketDto(int TicketId, string EmployeeName, string Subject, string Priority, string Status, DateTime CreatedAt);
public record ComplaintDto(int ComplaintId, string EmployeeName, string Subject, string Status, DateTime CreatedAt);
public record ExpenseDto(int ExpenseId, string EmployeeName, string Category, decimal Amount, DateOnly ExpenseDate, string Status, string? Description);
public record CreateExpenseRequest(string Category, decimal Amount, string? Description, DateOnly ExpenseDate);
public record TravelDto(int TravelId, string EmployeeName, string Destination, string? Purpose, DateOnly StartDate, DateOnly EndDate, decimal? EstimatedCost, string Status);
public record CreateTravelRequest(string Destination, string? Purpose, DateOnly StartDate, DateOnly EndDate, decimal? EstimatedCost);

// Resignations
public record ResignationListDto(
    int ResignationId, int EmployeeId, string EmployeeName, string EmployeeCode,
    DateOnly ResignationDate, DateOnly ProposedLastWorkingDate, string ResignationType,
    string Status, int? NoticePeriodDays, bool ClearanceCompleted, string? FnFStatus);

public record ExitFormalityDto(
    int FormalityId, string ItemName, string Category, bool IsMandatory,
    bool IsCompleted, string? CompletedByName, DateTime? CompletedAt, string? Remarks);

public record ResignationDetailDto(
    int ResignationId, int EmployeeId, string EmployeeName, string EmployeeCode,
    string? Department, string? Designation, DateOnly ResignationDate,
    DateOnly ProposedLastWorkingDate, DateOnly? ActualLastWorkingDate, string? Reason,
    string ResignationType, int? NoticePeriodDays, string Status,
    string? ManagerRemarks, string? HrRemarks, bool ExitInterviewCompleted,
    string? ExitInterviewNotes, string? FnFStatus, decimal? FnFAmount,
    bool ClearanceCompleted, List<ExitFormalityDto> ExitFormalities);

public record CreateResignationRequest(
    DateOnly ResignationDate, DateOnly ProposedLastWorkingDate, string? Reason,
    string ResignationType, int? NoticePeriodDays);

public record ResignationActionRequest(string? Remarks);
public record ExitInterviewRequest(string? Notes);
public record FnFRequest(string FnFStatus, decimal? FnFAmount);
public record CompleteFormalityRequest(bool IsCompleted, string? Remarks);

// Reports
public record ReportsSummaryDto(
    int OpenJobs, int PendingApplications, int ActiveTrainings, int OpenTickets,
    int PendingExpenses, int PendingTravel, int ActiveProjects, int TotalAssets,
    int OpenComplaints, int UpcomingEvents
);
