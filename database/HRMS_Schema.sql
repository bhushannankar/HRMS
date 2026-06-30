-- ============================================================
-- HRMS Database Schema for SQL Server
-- Mirrors HRMMitra-style HR Management System
-- Roles: Admin, Manager, Employee
-- ============================================================

IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'HRMS')
BEGIN
    CREATE DATABASE HRMS;
END
GO

USE HRMS;
GO

-- ============================================================
-- DROP EXISTING OBJECTS (for clean re-run in dev)
-- ============================================================
IF OBJECT_ID('dbo.Payslips', 'U') IS NOT NULL DROP TABLE dbo.Payslips;
IF OBJECT_ID('dbo.PayrollRuns', 'U') IS NOT NULL DROP TABLE dbo.PayrollRuns;
IF OBJECT_ID('dbo.LeaveRequests', 'U') IS NOT NULL DROP TABLE dbo.LeaveRequests;
IF OBJECT_ID('dbo.LeaveBalances', 'U') IS NOT NULL DROP TABLE dbo.LeaveBalances;
IF OBJECT_ID('dbo.LeaveTypes', 'U') IS NOT NULL DROP TABLE dbo.LeaveTypes;
IF OBJECT_ID('dbo.AttendanceRecords', 'U') IS NOT NULL DROP TABLE dbo.AttendanceRecords;
IF OBJECT_ID('dbo.Holidays', 'U') IS NOT NULL DROP TABLE dbo.Holidays;
IF OBJECT_ID('dbo.OfficeShifts', 'U') IS NOT NULL DROP TABLE dbo.OfficeShifts;
IF OBJECT_ID('dbo.Employees', 'U') IS NOT NULL DROP TABLE dbo.Employees;
IF OBJECT_ID('dbo.Designations', 'U') IS NOT NULL DROP TABLE dbo.Designations;
IF OBJECT_ID('dbo.Departments', 'U') IS NOT NULL DROP TABLE dbo.Departments;
IF OBJECT_ID('dbo.Announcements', 'U') IS NOT NULL DROP TABLE dbo.Announcements;
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL DROP TABLE dbo.Users;
IF OBJECT_ID('dbo.Roles', 'U') IS NOT NULL DROP TABLE dbo.Roles;
IF OBJECT_ID('dbo.Companies', 'U') IS NOT NULL DROP TABLE dbo.Companies;
GO

-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE dbo.Companies (
    CompanyId       INT IDENTITY(1,1) PRIMARY KEY,
    CompanyName     NVARCHAR(200) NOT NULL,
    LegalName       NVARCHAR(200) NULL,
    Email           NVARCHAR(150) NULL,
    Phone           NVARCHAR(30) NULL,
    Address         NVARCHAR(500) NULL,
    City            NVARCHAR(100) NULL,
    State           NVARCHAR(100) NULL,
    Country         NVARCHAR(100) NULL DEFAULT N'India',
    PostalCode      NVARCHAR(20) NULL,
    Website         NVARCHAR(200) NULL,
    LogoUrl         NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2 NULL
);

CREATE TABLE dbo.Roles (
    RoleId          INT IDENTITY(1,1) PRIMARY KEY,
    RoleName        NVARCHAR(50) NOT NULL UNIQUE,
    Description     NVARCHAR(200) NULL,
    IsActive        BIT NOT NULL DEFAULT 1
);

CREATE TABLE dbo.Users (
    UserId          INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    RoleId          INT NOT NULL,
    Username        NVARCHAR(100) NOT NULL,
    Email           NVARCHAR(150) NOT NULL,
    PasswordHash    NVARCHAR(500) NOT NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    LastLoginAt     DATETIME2 NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2 NULL,
    CONSTRAINT FK_Users_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Users_Roles FOREIGN KEY (RoleId) REFERENCES dbo.Roles(RoleId),
    CONSTRAINT UQ_Users_Email UNIQUE (Email),
    CONSTRAINT UQ_Users_Username UNIQUE (Username)
);

CREATE TABLE dbo.Departments (
    DepartmentId    INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    DepartmentName  NVARCHAR(150) NOT NULL,
    Description     NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Departments_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.Designations (
    DesignationId   INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    DesignationName NVARCHAR(150) NOT NULL,
    Description     NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Designations_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.Employees (
    EmployeeId      INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    UserId          INT NOT NULL UNIQUE,
    EmployeeCode    NVARCHAR(50) NOT NULL,
    FirstName       NVARCHAR(100) NOT NULL,
    LastName        NVARCHAR(100) NOT NULL,
    Gender          NVARCHAR(20) NULL,
    DateOfBirth     DATE NULL,
    Phone           NVARCHAR(30) NULL,
    DepartmentId    INT NULL,
    DesignationId   INT NULL,
    ManagerId       INT NULL,
    OfficeShiftId   INT NULL,
    JoinDate        DATE NOT NULL,
    BasicSalary     DECIMAL(18,2) NOT NULL DEFAULT 0,
    EmploymentType  NVARCHAR(50) NULL DEFAULT N'Full-Time',
    ProfileImageUrl NVARCHAR(500) NULL,
    Address         NVARCHAR(500) NULL,
    City            NVARCHAR(100) NULL,
    State           NVARCHAR(100) NULL,
    Country         NVARCHAR(100) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt       DATETIME2 NULL,
    CONSTRAINT FK_Employees_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Employees_Users FOREIGN KEY (UserId) REFERENCES dbo.Users(UserId),
    CONSTRAINT FK_Employees_Departments FOREIGN KEY (DepartmentId) REFERENCES dbo.Departments(DepartmentId),
    CONSTRAINT FK_Employees_Designations FOREIGN KEY (DesignationId) REFERENCES dbo.Designations(DesignationId),
    CONSTRAINT FK_Employees_Manager FOREIGN KEY (ManagerId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT UQ_Employees_Code UNIQUE (CompanyId, EmployeeCode)
);

CREATE TABLE dbo.OfficeShifts (
    OfficeShiftId   INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    ShiftName       NVARCHAR(100) NOT NULL,
    StartTime       TIME NOT NULL,
    EndTime         TIME NOT NULL,
    GraceMinutes    INT NOT NULL DEFAULT 15,
    IsActive        BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_OfficeShifts_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

ALTER TABLE dbo.Employees
    ADD CONSTRAINT FK_Employees_OfficeShifts FOREIGN KEY (OfficeShiftId) REFERENCES dbo.OfficeShifts(OfficeShiftId);

CREATE TABLE dbo.Holidays (
    HolidayId       INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    HolidayName     NVARCHAR(150) NOT NULL,
    HolidayDate     DATE NOT NULL,
    Description     NVARCHAR(500) NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_Holidays_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.AttendanceRecords (
    AttendanceId    INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    AttendanceDate  DATE NOT NULL,
    ClockIn         DATETIME2 NULL,
    ClockOut        DATETIME2 NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Present', -- Present, Absent, HalfDay, Late, OnLeave
    WorkHours       DECIMAL(5,2) NULL,
    Remarks         NVARCHAR(500) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Attendance_Employees FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT UQ_Attendance_Employee_Date UNIQUE (EmployeeId, AttendanceDate)
);

CREATE TABLE dbo.LeaveTypes (
    LeaveTypeId     INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    LeaveTypeName   NVARCHAR(100) NOT NULL,
    DaysPerYear     INT NOT NULL DEFAULT 0,
    IsPaid          BIT NOT NULL DEFAULT 1,
    IsActive        BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_LeaveTypes_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.LeaveBalances (
    LeaveBalanceId  INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    LeaveTypeId     INT NOT NULL,
    Year            INT NOT NULL,
    TotalDays       DECIMAL(5,2) NOT NULL DEFAULT 0,
    UsedDays        DECIMAL(5,2) NOT NULL DEFAULT 0,
    CONSTRAINT FK_LeaveBalances_Employees FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_LeaveBalances_LeaveTypes FOREIGN KEY (LeaveTypeId) REFERENCES dbo.LeaveTypes(LeaveTypeId),
    CONSTRAINT UQ_LeaveBalance UNIQUE (EmployeeId, LeaveTypeId, Year)
);

CREATE TABLE dbo.LeaveRequests (
    LeaveRequestId  INT IDENTITY(1,1) PRIMARY KEY,
    EmployeeId      INT NOT NULL,
    LeaveTypeId     INT NOT NULL,
    StartDate       DATE NOT NULL,
    EndDate         DATE NOT NULL,
    TotalDays       DECIMAL(5,2) NOT NULL,
    Reason          NVARCHAR(1000) NULL,
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Pending', -- Pending, Approved, Rejected, Cancelled
    ApprovedBy      INT NULL,
    ApprovedAt      DATETIME2 NULL,
    RejectionReason NVARCHAR(500) NULL,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_LeaveRequests_Employees FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_LeaveRequests_LeaveTypes FOREIGN KEY (LeaveTypeId) REFERENCES dbo.LeaveTypes(LeaveTypeId),
    CONSTRAINT FK_LeaveRequests_Approver FOREIGN KEY (ApprovedBy) REFERENCES dbo.Employees(EmployeeId)
);

CREATE TABLE dbo.PayrollRuns (
    PayrollRunId    INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    PayPeriodMonth  INT NOT NULL,
    PayPeriodYear   INT NOT NULL,
    RunDate         DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    Status          NVARCHAR(30) NOT NULL DEFAULT N'Draft', -- Draft, Processed, Paid
    ProcessedBy     INT NULL,
    CONSTRAINT FK_PayrollRuns_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT UQ_PayrollRun_Period UNIQUE (CompanyId, PayPeriodMonth, PayPeriodYear)
);

CREATE TABLE dbo.Payslips (
    PayslipId       INT IDENTITY(1,1) PRIMARY KEY,
    PayrollRunId    INT NOT NULL,
    EmployeeId      INT NOT NULL,
    BasicSalary     DECIMAL(18,2) NOT NULL DEFAULT 0,
    Allowances      DECIMAL(18,2) NOT NULL DEFAULT 0,
    Deductions      DECIMAL(18,2) NOT NULL DEFAULT 0,
    NetSalary       DECIMAL(18,2) NOT NULL DEFAULT 0,
    PaymentStatus   NVARCHAR(30) NOT NULL DEFAULT N'Pending',
    GeneratedAt     DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Payslips_PayrollRuns FOREIGN KEY (PayrollRunId) REFERENCES dbo.PayrollRuns(PayrollRunId),
    CONSTRAINT FK_Payslips_Employees FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT UQ_Payslip_Employee_Run UNIQUE (PayrollRunId, EmployeeId)
);

CREATE TABLE dbo.Announcements (
    AnnouncementId  INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    Title           NVARCHAR(200) NOT NULL,
    Content         NVARCHAR(MAX) NOT NULL,
    StartDate       DATE NOT NULL,
    EndDate         DATE NULL,
    CreatedBy       INT NOT NULL,
    IsActive        BIT NOT NULL DEFAULT 1,
    CreatedAt       DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_Announcements_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Announcements_Creator FOREIGN KEY (CreatedBy) REFERENCES dbo.Users(UserId)
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IX_Employees_DepartmentId ON dbo.Employees(DepartmentId);
CREATE INDEX IX_Employees_ManagerId ON dbo.Employees(ManagerId);
CREATE INDEX IX_AttendanceRecords_Date ON dbo.AttendanceRecords(AttendanceDate);
CREATE INDEX IX_LeaveRequests_Status ON dbo.LeaveRequests(Status);
CREATE INDEX IX_LeaveRequests_EmployeeId ON dbo.LeaveRequests(EmployeeId);
GO

-- ============================================================
-- SEED DATA
-- Password for all demo users: 123456
-- BCrypt hash generated for "123456"
-- ============================================================

-- BCrypt hash for password "123456" (cost factor 11)
DECLARE @Hash123456 NVARCHAR(500) = N'$2a$11$0EN9aQcYM0XViWXtOQoXIu3iJ14vqk8IZ3IcObgEaCAqqVW.Yaiwi';

-- Roles
INSERT INTO dbo.Roles (RoleName, Description) VALUES
    (N'Admin', N'System administrator with full access'),
    (N'Manager', N'Department manager - team oversight and approvals'),
    (N'Employee', N'Standard employee self-service access');

-- Company
INSERT INTO dbo.Companies (CompanyName, LegalName, Email, Phone, Address, City, State, Country)
VALUES (N'Uttishta IT Solutions', N'Uttishta IT Solutions', N'info@uttishta.com', N'+91-11-00000000',
        N'Corporate Office', N'New Delhi', N'Delhi', N'India');

DECLARE @CompanyId INT = SCOPE_IDENTITY();

-- Departments
INSERT INTO dbo.Departments (CompanyId, DepartmentName, Description) VALUES
    (@CompanyId, N'Human Resources', N'HR and people operations'),
    (@CompanyId, N'Information Technology', N'IT and software development'),
    (@CompanyId, N'Finance', N'Finance and accounting'),
    (@CompanyId, N'Sales', N'Sales and business development');

-- Designations
INSERT INTO dbo.Designations (CompanyId, DesignationName, Description) VALUES
    (@CompanyId, N'HR Administrator', N'HR admin role'),
    (@CompanyId, N'IT Manager', N'IT department manager'),
    (@CompanyId, N'Software Developer', N'Developer role'),
    (@CompanyId, N'Finance Executive', N'Finance team member');

-- Office Shifts
INSERT INTO dbo.OfficeShifts (CompanyId, ShiftName, StartTime, EndTime, GraceMinutes) VALUES
    (@CompanyId, N'General Shift', '09:00:00', '18:00:00', 15),
    (@CompanyId, N'Morning Shift', '08:00:00', '17:00:00', 10);

DECLARE @ShiftId INT = (SELECT TOP 1 OfficeShiftId FROM dbo.OfficeShifts WHERE CompanyId = @CompanyId);

-- Leave Types
INSERT INTO dbo.LeaveTypes (CompanyId, LeaveTypeName, DaysPerYear, IsPaid) VALUES
    (@CompanyId, N'Casual Leave', 12, 1),
    (@CompanyId, N'Sick Leave', 10, 1),
    (@CompanyId, N'Earned Leave', 15, 1),
    (@CompanyId, N'Unpaid Leave', 0, 0);

-- Holidays (sample 2026)
INSERT INTO dbo.Holidays (CompanyId, HolidayName, HolidayDate, Description) VALUES
    (@CompanyId, N'Republic Day', '2026-01-26', N'National holiday'),
    (@CompanyId, N'Independence Day', '2026-08-15', N'National holiday'),
    (@CompanyId, N'Gandhi Jayanti', '2026-10-02', N'National holiday');

-- Users
INSERT INTO dbo.Users (CompanyId, RoleId, Username, Email, PasswordHash) VALUES
    (@CompanyId, 1, N'Admin', N'admin@hrms.local', @Hash123456),
    (@CompanyId, 2, N'manager@uttishta.com', N'manager@uttishta.com', @Hash123456),
    (@CompanyId, 3, N'employee@uttishta.com', N'employee@uttishta.com', @Hash123456);

DECLARE @AdminUserId INT = (SELECT UserId FROM dbo.Users WHERE Username = N'Admin');
DECLARE @ManagerUserId INT = (SELECT UserId FROM dbo.Users WHERE Email = N'manager@uttishta.com');
DECLARE @EmployeeUserId INT = (SELECT UserId FROM dbo.Users WHERE Email = N'employee@uttishta.com');

-- Employees
INSERT INTO dbo.Employees (CompanyId, UserId, EmployeeCode, FirstName, LastName, Gender, DepartmentId, DesignationId, OfficeShiftId, JoinDate, BasicSalary, Phone, EmploymentType)
VALUES
    (@CompanyId, @AdminUserId, N'EMP001', N'System', N'Administrator', N'Male', 1, 1, @ShiftId, '2020-01-01', 80000.00, N'+91-9000000001', N'Full-Time'),
    (@CompanyId, @ManagerUserId, N'EMP002', N'Robin', N'Sharma', N'Male', 2, 2, @ShiftId, '2021-06-15', 65000.00, N'+91-9000000002', N'Full-Time'),
    (@CompanyId, @EmployeeUserId, N'EMP003', N'Neeraj', N'Kumar', N'Male', 2, 3, @ShiftId, '2022-03-01', 45000.00, N'+91-9000000003', N'Full-Time');

DECLARE @ManagerEmpId INT = (SELECT EmployeeId FROM dbo.Employees WHERE EmployeeCode = N'EMP002');
DECLARE @EmployeeEmpId INT = (SELECT EmployeeId FROM dbo.Employees WHERE EmployeeCode = N'EMP003');

-- Set reporting manager for employee
UPDATE dbo.Employees SET ManagerId = @ManagerEmpId WHERE EmployeeId = @EmployeeEmpId;

-- Leave Balances (2026)
INSERT INTO dbo.LeaveBalances (EmployeeId, LeaveTypeId, Year, TotalDays, UsedDays)
SELECT e.EmployeeId, lt.LeaveTypeId, 2026, lt.DaysPerYear, 0
FROM dbo.Employees e
CROSS JOIN dbo.LeaveTypes lt
WHERE lt.CompanyId = @CompanyId AND lt.DaysPerYear > 0;

-- Sample attendance (last 5 working days for demo employee)
INSERT INTO dbo.AttendanceRecords (EmployeeId, AttendanceDate, ClockIn, ClockOut, Status, WorkHours)
VALUES
    (@EmployeeEmpId, CAST(DATEADD(DAY, -4, GETDATE()) AS DATE), DATEADD(HOUR, 9, CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME2)), DATEADD(HOUR, 18, CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME2)), N'Present', 8.0),
    (@EmployeeEmpId, CAST(DATEADD(DAY, -3, GETDATE()) AS DATE), DATEADD(HOUR, 9, CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME2)), DATEADD(HOUR, 18, CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME2)), N'Present', 8.0),
    (@EmployeeEmpId, CAST(DATEADD(DAY, -2, GETDATE()) AS DATE), DATEADD(HOUR, 9, CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME2)), DATEADD(HOUR, 18, CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME2)), N'Present', 8.0),
    (@ManagerEmpId, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), DATEADD(HOUR, 9, CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME2)), DATEADD(HOUR, 18, CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME2)), N'Present', 8.0),
    (@EmployeeEmpId, CAST(DATEADD(DAY, -1, GETDATE()) AS DATE), DATEADD(HOUR, 9, CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME2)), DATEADD(HOUR, 18, CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME2)), N'Present', 8.0);

-- Sample leave request
INSERT INTO dbo.LeaveRequests (EmployeeId, LeaveTypeId, StartDate, EndDate, TotalDays, Reason, Status)
VALUES (@EmployeeEmpId, 1, DATEADD(DAY, 7, CAST(GETDATE() AS DATE)), DATEADD(DAY, 8, CAST(GETDATE() AS DATE)), 2, N'Personal work', N'Pending');

-- Announcements
INSERT INTO dbo.Announcements (CompanyId, Title, Content, StartDate, EndDate, CreatedBy)
VALUES (@CompanyId, N'Welcome to HRMS', N'Welcome to the HR Management System. Please update your profile and review company policies.', CAST(GETDATE() AS DATE), DATEADD(MONTH, 1, CAST(GETDATE() AS DATE)), @AdminUserId);

-- Payroll sample
INSERT INTO dbo.PayrollRuns (CompanyId, PayPeriodMonth, PayPeriodYear, Status, ProcessedBy)
VALUES (@CompanyId, MONTH(GETDATE()), YEAR(GETDATE()), N'Processed', @AdminUserId);

DECLARE @PayrollRunId INT = SCOPE_IDENTITY();

INSERT INTO dbo.Payslips (PayrollRunId, EmployeeId, BasicSalary, Allowances, Deductions, NetSalary, PaymentStatus)
SELECT @PayrollRunId, EmployeeId, BasicSalary, BasicSalary * 0.10, BasicSalary * 0.05, BasicSalary * 1.05, N'Paid'
FROM dbo.Employees WHERE CompanyId = @CompanyId;

GO

PRINT 'HRMS database schema and seed data created successfully.';
PRINT 'Demo logins - Admin: Admin / 123456 | Manager: manager@uttishta.com / 123456 | Employee: employee@uttishta.com / 123456';
GO
