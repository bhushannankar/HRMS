using HRMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMS.API.Data;

public class HrmsDbContext : DbContext
{
    public HrmsDbContext(DbContextOptions<HrmsDbContext> options) : base(options) { }

    public DbSet<Company> Companies => Set<Company>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<User> Users => Set<User>();
    public DbSet<Department> Departments => Set<Department>();
    public DbSet<Designation> Designations => Set<Designation>();
    public DbSet<OfficeShift> OfficeShifts => Set<OfficeShift>();
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<AttendanceRecord> AttendanceRecords => Set<AttendanceRecord>();
    public DbSet<LeaveType> LeaveTypes => Set<LeaveType>();
    public DbSet<LeaveBalance> LeaveBalances => Set<LeaveBalance>();
    public DbSet<LeaveRequest> LeaveRequests => Set<LeaveRequest>();
    public DbSet<Holiday> Holidays => Set<Holiday>();
    public DbSet<PayrollRun> PayrollRuns => Set<PayrollRun>();
    public DbSet<Payslip> Payslips => Set<Payslip>();
    public DbSet<Announcement> Announcements => Set<Announcement>();

    // Extended modules
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<Interview> Interviews => Set<Interview>();
    public DbSet<TrainingProgram> TrainingPrograms => Set<TrainingProgram>();
    public DbSet<TrainingEnrollment> TrainingEnrollments => Set<TrainingEnrollment>();
    public DbSet<Competency> Competencies => Set<Competency>();
    public DbSet<PerformanceAppraisal> PerformanceAppraisals => Set<PerformanceAppraisal>();
    public DbSet<PerformanceGoal> PerformanceGoals => Set<PerformanceGoal>();
    public DbSet<Asset> Assets => Set<Asset>();
    public DbSet<AssetAssignment> AssetAssignments => Set<AssetAssignment>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<WorkTask> Tasks => Set<WorkTask>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Meeting> Meetings => Set<Meeting>();
    public DbSet<Award> Awards => Set<Award>();
    public DbSet<Warning> Warnings => Set<Warning>();
    public DbSet<EmployeeDocument> EmployeeDocuments => Set<EmployeeDocument>();
    public DbSet<SupportTicket> SupportTickets => Set<SupportTicket>();
    public DbSet<Complaint> Complaints => Set<Complaint>();
    public DbSet<ExpenseClaim> ExpenseClaims => Set<ExpenseClaim>();
    public DbSet<TravelRequest> TravelRequests => Set<TravelRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Company>(e =>
        {
            e.ToTable("Companies");
            e.HasKey(x => x.CompanyId);
        });

        modelBuilder.Entity<Role>(e =>
        {
            e.ToTable("Roles");
            e.HasKey(x => x.RoleId);
        });

        modelBuilder.Entity<User>(e =>
        {
            e.ToTable("Users");
            e.HasKey(x => x.UserId);
            e.HasIndex(x => x.Email).IsUnique();
            e.HasIndex(x => x.Username).IsUnique();
            e.HasOne(x => x.Company).WithMany(c => c.Users).HasForeignKey(x => x.CompanyId);
            e.HasOne(x => x.Role).WithMany(r => r.Users).HasForeignKey(x => x.RoleId);
        });

        modelBuilder.Entity<Department>(e =>
        {
            e.ToTable("Departments");
            e.HasKey(x => x.DepartmentId);
        });

        modelBuilder.Entity<Designation>(e =>
        {
            e.ToTable("Designations");
            e.HasKey(x => x.DesignationId);
        });

        modelBuilder.Entity<OfficeShift>(e =>
        {
            e.ToTable("OfficeShifts");
            e.HasKey(x => x.OfficeShiftId);
        });

        modelBuilder.Entity<Employee>(e =>
        {
            e.ToTable("Employees");
            e.HasKey(x => x.EmployeeId);
            e.HasIndex(x => new { x.CompanyId, x.EmployeeCode }).IsUnique();
            e.HasOne(x => x.User).WithOne(u => u.Employee).HasForeignKey<Employee>(x => x.UserId);
            e.HasOne(x => x.Manager).WithMany(m => m.DirectReports).HasForeignKey(x => x.ManagerId).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<AttendanceRecord>(e =>
        {
            e.ToTable("AttendanceRecords");
            e.HasKey(x => x.AttendanceId);
            e.HasIndex(x => new { x.EmployeeId, x.AttendanceDate }).IsUnique();
        });

        modelBuilder.Entity<LeaveType>(e => e.ToTable("LeaveTypes"));
        modelBuilder.Entity<LeaveBalance>(e =>
        {
            e.ToTable("LeaveBalances");
            e.HasIndex(x => new { x.EmployeeId, x.LeaveTypeId, x.Year }).IsUnique();
        });

        modelBuilder.Entity<LeaveRequest>(e =>
        {
            e.ToTable("LeaveRequests");
            e.HasOne(x => x.Approver).WithMany().HasForeignKey(x => x.ApprovedBy).OnDelete(DeleteBehavior.Restrict);
        });

        modelBuilder.Entity<Holiday>(e => e.ToTable("Holidays"));
        modelBuilder.Entity<PayrollRun>(e => e.ToTable("PayrollRuns"));
        modelBuilder.Entity<Payslip>(e => e.ToTable("Payslips"));
        modelBuilder.Entity<Announcement>(e => e.ToTable("Announcements"));

        modelBuilder.Entity<JobPosting>(e => { e.ToTable("JobPostings"); e.HasKey(x => x.JobPostingId); });
        modelBuilder.Entity<JobApplication>(e => { e.ToTable("JobApplications"); e.HasKey(x => x.ApplicationId); });
        modelBuilder.Entity<Interview>(e =>
        {
            e.ToTable("Interviews");
            e.HasKey(x => x.InterviewId);
            e.HasOne(x => x.Interviewer).WithMany().HasForeignKey(x => x.InterviewerId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<TrainingProgram>(e => { e.ToTable("TrainingPrograms"); e.HasKey(x => x.TrainingId); });
        modelBuilder.Entity<TrainingEnrollment>(e =>
        {
            e.ToTable("TrainingEnrollments");
            e.HasKey(x => x.EnrollmentId);
            e.HasIndex(x => new { x.TrainingId, x.EmployeeId }).IsUnique();
        });
        modelBuilder.Entity<Competency>(e => { e.ToTable("Competencies"); e.HasKey(x => x.CompetencyId); });
        modelBuilder.Entity<PerformanceAppraisal>(e =>
        {
            e.ToTable("PerformanceAppraisals");
            e.HasKey(x => x.AppraisalId);
            e.HasOne(x => x.Reviewer).WithMany().HasForeignKey(x => x.ReviewerId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<PerformanceGoal>(e => { e.ToTable("PerformanceGoals"); e.HasKey(x => x.GoalId); });
        modelBuilder.Entity<Asset>(e =>
        {
            e.ToTable("Assets");
            e.HasKey(x => x.AssetId);
            e.HasIndex(x => new { x.CompanyId, x.AssetCode }).IsUnique();
        });
        modelBuilder.Entity<AssetAssignment>(e => { e.ToTable("AssetAssignments"); e.HasKey(x => x.AssignmentId); });
        modelBuilder.Entity<Project>(e =>
        {
            e.ToTable("Projects");
            e.HasKey(x => x.ProjectId);
            e.HasOne(x => x.Manager).WithMany().HasForeignKey(x => x.ManagerId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<WorkTask>(e =>
        {
            e.ToTable("Tasks");
            e.HasKey(x => x.TaskId);
            e.HasOne(x => x.Assignee).WithMany().HasForeignKey(x => x.AssignedTo).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Event>(e => { e.ToTable("Events"); e.HasKey(x => x.EventId); });
        modelBuilder.Entity<Meeting>(e =>
        {
            e.ToTable("Meetings");
            e.HasKey(x => x.MeetingId);
            e.HasOne(x => x.Organizer).WithMany().HasForeignKey(x => x.OrganizerId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<Award>(e => { e.ToTable("Awards"); e.HasKey(x => x.AwardId); });
        modelBuilder.Entity<Warning>(e =>
        {
            e.ToTable("Warnings");
            e.HasKey(x => x.WarningId);
            e.HasOne(x => x.Employee).WithMany().HasForeignKey(x => x.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<EmployeeDocument>(e => { e.ToTable("EmployeeDocuments"); e.HasKey(x => x.DocumentId); });
        modelBuilder.Entity<SupportTicket>(e => { e.ToTable("SupportTickets"); e.HasKey(x => x.TicketId); });
        modelBuilder.Entity<Complaint>(e => { e.ToTable("Complaints"); e.HasKey(x => x.ComplaintId); });
        modelBuilder.Entity<ExpenseClaim>(e =>
        {
            e.ToTable("ExpenseClaims");
            e.HasKey(x => x.ExpenseId);
            e.HasOne(x => x.Employee).WithMany().HasForeignKey(x => x.EmployeeId).OnDelete(DeleteBehavior.Restrict);
        });
        modelBuilder.Entity<TravelRequest>(e => { e.ToTable("TravelRequests"); e.HasKey(x => x.TravelId); });
    }
}
