-- ============================================================
-- HRMS Extended Modules Script
-- Run AFTER HRMS_Schema.sql on existing HRMS database
-- Adds: Recruitment, Training, Performance, Assets, Projects,
--       Events, Awards, Documents, Tickets, Complaints, Expenses, Travel
-- ============================================================
USE HRMS;
GO

-- Drop in reverse FK order
IF OBJECT_ID('dbo.Interviews', 'U') IS NOT NULL DROP TABLE dbo.Interviews;
IF OBJECT_ID('dbo.JobApplications', 'U') IS NOT NULL DROP TABLE dbo.JobApplications;
IF OBJECT_ID('dbo.JobPostings', 'U') IS NOT NULL DROP TABLE dbo.JobPostings;
IF OBJECT_ID('dbo.TrainingEnrollments', 'U') IS NOT NULL DROP TABLE dbo.TrainingEnrollments;
IF OBJECT_ID('dbo.TrainingPrograms', 'U') IS NOT NULL DROP TABLE dbo.TrainingPrograms;
IF OBJECT_ID('dbo.PerformanceGoals', 'U') IS NOT NULL DROP TABLE dbo.PerformanceGoals;
IF OBJECT_ID('dbo.PerformanceAppraisals', 'U') IS NOT NULL DROP TABLE dbo.PerformanceAppraisals;
IF OBJECT_ID('dbo.Competencies', 'U') IS NOT NULL DROP TABLE dbo.Competencies;
IF OBJECT_ID('dbo.AssetAssignments', 'U') IS NOT NULL DROP TABLE dbo.AssetAssignments;
IF OBJECT_ID('dbo.Assets', 'U') IS NOT NULL DROP TABLE dbo.Assets;
IF OBJECT_ID('dbo.Tasks', 'U') IS NOT NULL DROP TABLE dbo.Tasks;
IF OBJECT_ID('dbo.Projects', 'U') IS NOT NULL DROP TABLE dbo.Projects;
IF OBJECT_ID('dbo.Meetings', 'U') IS NOT NULL DROP TABLE dbo.Meetings;
IF OBJECT_ID('dbo.Events', 'U') IS NOT NULL DROP TABLE dbo.Events;
IF OBJECT_ID('dbo.Awards', 'U') IS NOT NULL DROP TABLE dbo.Awards;
IF OBJECT_ID('dbo.Warnings', 'U') IS NOT NULL DROP TABLE dbo.Warnings;
IF OBJECT_ID('dbo.EmployeeDocuments', 'U') IS NOT NULL DROP TABLE dbo.EmployeeDocuments;
IF OBJECT_ID('dbo.SupportTickets', 'U') IS NOT NULL DROP TABLE dbo.SupportTickets;
IF OBJECT_ID('dbo.Complaints', 'U') IS NOT NULL DROP TABLE dbo.Complaints;
IF OBJECT_ID('dbo.ExpenseClaims', 'U') IS NOT NULL DROP TABLE dbo.ExpenseClaims;
IF OBJECT_ID('dbo.TravelRequests', 'U') IS NOT NULL DROP TABLE dbo.TravelRequests;
GO

-- RECRUITMENT
CREATE TABLE dbo.JobPostings (
    JobPostingId    INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    DepartmentId    INT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    Requirements    NVARCHAR(MAX) NULL,
    Vacancies       INT NOT NULL DEFAULT 1,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Open',
    PostedDate      DATE NOT NULL,
    ClosingDate     DATE NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_JobPostings_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_JobPostings_Departments FOREIGN KEY (DepartmentId) REFERENCES dbo.Departments(DepartmentId)
);

CREATE TABLE dbo.JobApplications (
    ApplicationId   INT IDENTITY(1,1) PRIMARY KEY,
    JobPostingId    INT NOT NULL,
    CandidateName   NVARCHAR(150) NOT NULL,
    Email           NVARCHAR(150) NOT NULL,
    Phone           NVARCHAR(30) NULL,
    ResumeUrl       NVARCHAR(500) NULL,
    ExperienceYears INT NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Applied',
    AppliedDate     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_JobApplications_Jobs FOREIGN KEY (JobPostingId) REFERENCES dbo.JobPostings(JobPostingId)
);

CREATE TABLE dbo.Interviews (
    InterviewId     INT IDENTITY(1,1) PRIMARY KEY,
    ApplicationId   INT NOT NULL,
    InterviewerId   INT NOT NULL,
    ScheduledAt     DATETIME2 NOT NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Scheduled',
    Feedback        NVARCHAR(MAX) NULL,
    Rating          INT NULL,
    CONSTRAINT FK_Interviews_Applications FOREIGN KEY (ApplicationId) REFERENCES dbo.JobApplications(ApplicationId),
    CONSTRAINT FK_Interviews_Interviewer FOREIGN KEY (InterviewerId) REFERENCES dbo.Employees(EmployeeId)
);

-- TRAINING
CREATE TABLE dbo.TrainingPrograms (
    TrainingId      INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    Trainer         NVARCHAR(150) NULL,
    StartDate       DATE NOT NULL,
    EndDate         DATE NULL,
    MaxParticipants INT NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Planned',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Training_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.TrainingEnrollments (
    EnrollmentId    INT IDENTITY(1,1) PRIMARY KEY,
    TrainingId      INT NOT NULL,
    EmployeeId      INT NOT NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Enrolled',
    Score           DECIMAL(5,2) NULL,
    CompletedDate   DATE NULL,
    EnrolledAt      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Enrollments_Training FOREIGN KEY (TrainingId) REFERENCES dbo.TrainingPrograms(TrainingId),
    CONSTRAINT FK_Enrollments_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT UQ_Enrollment UNIQUE (TrainingId, EmployeeId)
);

-- PERFORMANCE
CREATE TABLE dbo.Competencies (
    CompetencyId    INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    Name            NVARCHAR(150) NOT NULL,
    Description     NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Competencies_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.PerformanceAppraisals (
    AppraisalId     INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    ReviewerId      INT NOT NULL,
    PeriodYear      INT NOT NULL,
    PeriodQuarter   INT NOT NULL DEFAULT 1,
    OverallRating   DECIMAL(3,1) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Draft',
    Comments        NVARCHAR(MAX) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Appraisals_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Appraisals_Reviewer FOREIGN KEY (ReviewerId) REFERENCES dbo.Employees(EmployeeId)
);

CREATE TABLE dbo.PerformanceGoals (
    GoalId          INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    TargetDate      DATE NULL,
    Progress        INT NOT NULL DEFAULT 0,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'InProgress',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Goals_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId)
);

-- ASSETS
CREATE TABLE dbo.Assets (
    AssetId         INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    AssetName       NVARCHAR(200) NOT NULL,
    AssetCode       NVARCHAR(50) NOT NULL,
    Category        NVARCHAR(100) NULL,
    SerialNumber    NVARCHAR(100) NULL,
    PurchaseDate    DATE NULL,
    PurchaseValue   DECIMAL(18,2) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Available',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Assets_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT UQ_AssetCode UNIQUE (CompanyId, AssetCode)
);

CREATE TABLE dbo.AssetAssignments (
    AssignmentId    INT IDENTITY(1,1) PRIMARY KEY,
    AssetId         INT NOT NULL,
    EmployeeId      INT NOT NULL,
    AssignedDate    DATE NOT NULL,
    ReturnDate      DATE NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Assigned',
    Notes           NVARCHAR(500) NULL,
    CONSTRAINT FK_Assignments_Asset FOREIGN KEY (AssetId) REFERENCES dbo.Assets(AssetId),
    CONSTRAINT FK_Assignments_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId)
);

-- PROJECTS & TASKS
CREATE TABLE dbo.Projects (
    ProjectId       INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    ProjectName     NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    ManagerId       INT NULL,
    StartDate       DATE NULL,
    EndDate         DATE NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Active',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Projects_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Projects_Manager FOREIGN KEY (ManagerId) REFERENCES dbo.Employees(EmployeeId)
);

CREATE TABLE dbo.Tasks (
    TaskId          INT IDENTITY(1,1) PRIMARY KEY,
    ProjectId       INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    AssignedTo      INT NULL,
    DueDate         DATE NULL,
    Priority        NVARCHAR(20) NOT NULL DEFAULT N'Medium',
    Status          NVARCHAR(30) NOT NULL DEFAULT N'ToDo',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Tasks_Project FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(ProjectId),
    CONSTRAINT FK_Tasks_Assignee FOREIGN KEY (AssignedTo) REFERENCES dbo.Employees(EmployeeId)
);

-- EVENTS & MEETINGS
CREATE TABLE dbo.Events (
    EventId         INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    EventDate       DATE NOT NULL,
    Location        NVARCHAR(200) NULL,
    CreatedBy       INT NOT NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Events_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Events_Creator FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
);

CREATE TABLE dbo.Meetings (
    MeetingId       INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Agenda          NVARCHAR(MAX) NULL,
    MeetingDate     DATE NOT NULL,
    StartTime       TIME NOT NULL,
    EndTime         TIME NOT NULL,
    OrganizerId     INT NOT NULL,
    Location        NVARCHAR(200) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Scheduled',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Meetings_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Meetings_Organizer FOREIGN KEY (OrganizerId) REFERENCES dbo.Employees(EmployeeId)
);

-- AWARDS & WARNINGS
CREATE TABLE dbo.Awards (
    AwardId         INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    AwardName       NVARCHAR(200) NOT NULL,
    AwardDate       DATE NOT NULL,
    Description     NVARCHAR(500) NULL,
    GivenBy         INT NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Awards_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Awards_Giver FOREIGN KEY (GivenBy) REFERENCES dbo.Employees(EmployeeId)
);

CREATE TABLE dbo.Warnings (
    WarningId       INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    Subject         NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    WarningDate     DATE NOT NULL,
    Severity        NVARCHAR(30) NOT NULL DEFAULT N'Medium',
    IssuedBy        INT NOT NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Warnings_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Warnings_Issuer FOREIGN KEY (IssuedBy) REFERENCES dbo.Employees(EmployeeId)
);

-- DOCUMENTS
CREATE TABLE dbo.EmployeeDocuments (
    DocumentId      INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    DocumentName    NVARCHAR(200) NOT NULL,
    DocumentType    NVARCHAR(100) NOT NULL,
    FileUrl         NVARCHAR(500) NULL,
    UploadedAt      DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Documents_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId)
);

-- SUPPORT TICKETS
CREATE TABLE dbo.SupportTickets (
    TicketId        INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    EmployeeId      INT NOT NULL,
    Subject         NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    Priority        NVARCHAR(20) NOT NULL DEFAULT N'Medium',
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Open',
    AssignedTo      INT NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ResolvedAt      DATETIME2 NULL,
    CONSTRAINT FK_Tickets_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Tickets_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Tickets_Assignee FOREIGN KEY (AssignedTo) REFERENCES dbo.Employees(EmployeeId)
);

-- COMPLAINTS
CREATE TABLE dbo.Complaints (
    ComplaintId     INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    AgainstEmployeeId INT NULL,
    Subject         NVARCHAR(200) NOT NULL,
    Description     NVARCHAR(MAX) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Open',
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    ResolvedAt      DATETIME2 NULL,
    CONSTRAINT FK_Complaints_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Complaints_Against FOREIGN KEY (AgainstEmployeeId) REFERENCES dbo.Employees(EmployeeId)
);

-- EXPENSES
CREATE TABLE dbo.ExpenseClaims (
    ExpenseId       INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    Category        NVARCHAR(100) NOT NULL,
    Amount          DECIMAL(18,2) NOT NULL,
    Description     NVARCHAR(500) NULL,
    ExpenseDate     DATE NOT NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Pending',
    ApprovedBy      INT NULL,
    ApprovedAt      DATETIME2 NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Expenses_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Expenses_Approver FOREIGN KEY (ApprovedBy) REFERENCES dbo.Employees(EmployeeId)
);

-- TRAVEL
CREATE TABLE dbo.TravelRequests (
    TravelId        INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    Destination     NVARCHAR(200) NOT NULL,
    Purpose         NVARCHAR(500) NULL,
    StartDate       DATE NOT NULL,
    EndDate         DATE NOT NULL,
    EstimatedCost   DECIMAL(18,2) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Pending',
    ApprovedBy      INT NULL,
    ApprovedAt      DATETIME2 NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Travel_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Travel_Approver FOREIGN KEY (ApprovedBy) REFERENCES dbo.Employees(EmployeeId)
);
GO

-- SEED DATA
DECLARE @CompanyId INT = (SELECT TOP 1 CompanyId FROM dbo.Companies);
DECLARE @AdminEmp INT = (SELECT EmployeeId FROM dbo.Employees WHERE EmployeeCode = N'EMP001');
DECLARE @MgrEmp INT = (SELECT EmployeeId FROM dbo.Employees WHERE EmployeeCode = N'EMP002');
DECLARE @EmpEmp INT = (SELECT EmployeeId FROM dbo.Employees WHERE EmployeeCode = N'EMP003');
DECLARE @AdminUser INT = (SELECT UserId FROM dbo.Users WHERE Username = N'Admin');
DECLARE @DeptIT INT = (SELECT DepartmentId FROM dbo.Departments WHERE DepartmentName = N'Information Technology');

-- Recruitment
INSERT INTO dbo.JobPostings (CompanyId, DepartmentId, Title, Description, Requirements, Vacancies, Status, PostedDate, ClosingDate)
VALUES (@CompanyId, @DeptIT, N'Senior Software Developer', N'Build HRMS features', N'5+ years .NET/React', 2, N'Open', CAST(GETDATE() AS DATE), DATEADD(MONTH, 2, CAST(GETDATE() AS DATE)));

DECLARE @JobId INT = SCOPE_IDENTITY();
INSERT INTO dbo.JobApplications (JobPostingId, CandidateName, Email, Phone, ExperienceYears, Status)
VALUES (@JobId, N'Priya Singh', N'priya@example.com', N'+91-9000000100', 6, N'Applied'),
       (@JobId, N'Amit Verma', N'amit@example.com', N'+91-9000000101', 4, N'Shortlisted');

DECLARE @AppId INT = (SELECT TOP 1 ApplicationId FROM dbo.JobApplications WHERE JobPostingId = @JobId ORDER BY ApplicationId DESC);
INSERT INTO dbo.Interviews (ApplicationId, InterviewerId, ScheduledAt, Status)
VALUES (@AppId, @MgrEmp, DATEADD(DAY, 3, GETDATE()), N'Scheduled');

-- Training
INSERT INTO dbo.TrainingPrograms (CompanyId, Title, Description, Trainer, StartDate, EndDate, MaxParticipants, Status)
VALUES (@CompanyId, N'Workplace Safety', N'Annual safety training', N'HR Team', DATEADD(DAY, 7, CAST(GETDATE() AS DATE)), DATEADD(DAY, 8, CAST(GETDATE() AS DATE)), 50, N'Planned'),
       (@CompanyId, N'Leadership Skills', N'Manager development program', N'External Trainer', DATEADD(MONTH, 1, CAST(GETDATE() AS DATE)), DATEADD(MONTH, 1, DATEADD(DAY, 2, CAST(GETDATE() AS DATE))), 20, N'Planned');

DECLARE @TrainingId INT = (SELECT TOP 1 TrainingId FROM dbo.TrainingPrograms WHERE CompanyId = @CompanyId);
INSERT INTO dbo.TrainingEnrollments (TrainingId, EmployeeId, Status) VALUES (@TrainingId, @EmpEmp, N'Enrolled');

-- Performance
INSERT INTO dbo.Competencies (CompanyId, Name, Description) VALUES
    (@CompanyId, N'Technical Skills', N'Job-related technical competence'),
    (@CompanyId, N'Communication', N'Written and verbal communication'),
    (@CompanyId, N'Teamwork', N'Collaboration and team contribution');

INSERT INTO dbo.PerformanceAppraisals (EmployeeId, ReviewerId, PeriodYear, PeriodQuarter, OverallRating, Status, Comments)
VALUES (@EmpEmp, @MgrEmp, YEAR(GETDATE()), 2, 4.2, N'Completed', N'Good performance this quarter');

INSERT INTO dbo.PerformanceGoals (EmployeeId, Title, Description, TargetDate, Progress, Status)
VALUES (@EmpEmp, N'Complete HRMS module', N'Deliver recruitment module', DATEADD(MONTH, 2, CAST(GETDATE() AS DATE)), 60, N'InProgress');

-- Assets
INSERT INTO dbo.Assets (CompanyId, AssetName, AssetCode, Category, SerialNumber, PurchaseDate, PurchaseValue, Status)
VALUES (@CompanyId, N'Dell Laptop', N'AST001', N'IT Equipment', N'DL-2024-001', '2024-01-15', 75000.00, N'Assigned'),
       (@CompanyId, N'iPhone 14', N'AST002', N'Mobile', N'IP-2024-002', '2024-03-01', 85000.00, N'Available');

INSERT INTO dbo.AssetAssignments (AssetId, EmployeeId, AssignedDate, Status)
SELECT AssetId, @EmpEmp, CAST(GETDATE() AS DATE), N'Assigned' FROM dbo.Assets WHERE AssetCode = N'AST001';

-- Projects & Tasks
INSERT INTO dbo.Projects (CompanyId, ProjectName, Description, ManagerId, StartDate, EndDate, Status)
VALUES (@CompanyId, N'HRMS Development', N'Build internal HRMS', @MgrEmp, CAST(GETDATE() AS DATE), DATEADD(MONTH, 6, CAST(GETDATE() AS DATE)), N'Active');

DECLARE @ProjectId INT = SCOPE_IDENTITY();
INSERT INTO dbo.Tasks (ProjectId, Title, Description, AssignedTo, DueDate, Priority, Status)
VALUES (@ProjectId, N'API Development', N'Build REST APIs', @EmpEmp, DATEADD(WEEK, 2, CAST(GETDATE() AS DATE)), N'High', N'InProgress'),
       (@ProjectId, N'UI Design', N'React frontend pages', @EmpEmp, DATEADD(WEEK, 3, CAST(GETDATE() AS DATE)), N'Medium', N'ToDo');

-- Events & Meetings
INSERT INTO dbo.Events (CompanyId, Title, Description, EventDate, Location, CreatedBy)
VALUES (@CompanyId, N'Annual Day', N'Company annual celebration', DATEADD(MONTH, 3, CAST(GETDATE() AS DATE)), N'Head Office', @AdminUser);

INSERT INTO dbo.Meetings (CompanyId, Title, Agenda, MeetingDate, StartTime, EndTime, OrganizerId, Location, Status)
VALUES (@CompanyId, N'Sprint Planning', N'Q3 sprint planning', DATEADD(DAY, 2, CAST(GETDATE() AS DATE)), '10:00:00', '11:30:00', @MgrEmp, N'Conference Room A', N'Scheduled');

-- Awards & Warnings
INSERT INTO dbo.Awards (EmployeeId, AwardName, AwardDate, Description, GivenBy)
VALUES (@EmpEmp, N'Employee of the Month', DATEADD(MONTH, -1, CAST(GETDATE() AS DATE)), N'Outstanding contribution', @MgrEmp);

-- Documents
INSERT INTO dbo.EmployeeDocuments (EmployeeId, DocumentName, DocumentType, FileUrl)
VALUES (@EmpEmp, N'Offer Letter', N'Employment', N'/docs/offer-letter.pdf'),
       (@EmpEmp, N'ID Proof', N'Identity', N'/docs/id-proof.pdf');

-- Tickets
INSERT INTO dbo.SupportTickets (CompanyId, EmployeeId, Subject, Description, Priority, Status)
VALUES (@CompanyId, @EmpEmp, N'VPN Access Issue', N'Cannot connect to VPN from home', N'High', N'Open');

-- Expenses
INSERT INTO dbo.ExpenseClaims (EmployeeId, Category, Amount, Description, ExpenseDate, Status)
VALUES (@EmpEmp, N'Travel', 2500.00, N'Client visit cab fare', DATEADD(DAY, -5, CAST(GETDATE() AS DATE)), N'Pending');

-- Travel
INSERT INTO dbo.TravelRequests (EmployeeId, Destination, Purpose, StartDate, EndDate, EstimatedCost, Status)
VALUES (@EmpEmp, N'Mumbai', N'Client meeting', DATEADD(DAY, 14, CAST(GETDATE() AS DATE)), DATEADD(DAY, 16, CAST(GETDATE() AS DATE)), 15000.00, N'Pending');

GO
PRINT 'HRMS extended modules created and seeded successfully.';
GO
