-- ============================================================
-- HRMS Resignation & Exit Formalities Module
-- Run on existing HRMS database (after HRMS_Schema.sql)
-- ============================================================
USE HRMS;
GO

IF OBJECT_ID('dbo.ResignationExitFormalities', 'U') IS NOT NULL DROP TABLE dbo.ResignationExitFormalities;
IF OBJECT_ID('dbo.Resignations', 'U') IS NOT NULL DROP TABLE dbo.Resignations;
IF OBJECT_ID('dbo.ExitFormalityTemplates', 'U') IS NOT NULL DROP TABLE dbo.ExitFormalityTemplates;
GO

CREATE TABLE dbo.ExitFormalityTemplates (
    TemplateId      INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId       INT NOT NULL,
    ItemName        NVARCHAR(200) NOT NULL,
    Category        NVARCHAR(50) NOT NULL,
    Description     NVARCHAR(500) NULL,
    SortOrder       INT NOT NULL DEFAULT 0,
    IsMandatory     BIT NOT NULL DEFAULT 1,
    IsActive        BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_ExitTemplates_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId)
);

CREATE TABLE dbo.Resignations (
    ResignationId           INT IDENTITY(1,1) PRIMARY KEY,
    CompanyId               INT NOT NULL,
    EmployeeId              INT NOT NULL,
    ResignationDate         DATE NOT NULL,
    ProposedLastWorkingDate DATE NOT NULL,
    ActualLastWorkingDate   DATE NULL,
    Reason                  NVARCHAR(1000) NULL,
    ResignationType         NVARCHAR(50) NOT NULL DEFAULT N'Voluntary',
    NoticePeriodDays        INT NULL,
    Status                  NVARCHAR(50) NOT NULL DEFAULT N'Submitted',
    ManagerRemarks          NVARCHAR(500) NULL,
    ManagerActionBy         INT NULL,
    ManagerActionAt         DATETIME2 NULL,
    HrRemarks               NVARCHAR(500) NULL,
    HrActionBy              INT NULL,
    HrActionAt              DATETIME2 NULL,
    ExitInterviewCompleted  BIT NOT NULL DEFAULT 0,
    ExitInterviewNotes      NVARCHAR(MAX) NULL,
    FnFStatus               NVARCHAR(30) NULL,
    FnFAmount               DECIMAL(18,2) NULL,
    FnFProcessedAt          DATETIME2 NULL,
    ClearanceCompleted      BIT NOT NULL DEFAULT 0,
    CreatedAt               DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt               DATETIME2 NULL,
    CONSTRAINT FK_Resignations_Companies FOREIGN KEY (CompanyId) REFERENCES dbo.Companies(CompanyId),
    CONSTRAINT FK_Resignations_Employee FOREIGN KEY (EmployeeId) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Resignations_ManagerAction FOREIGN KEY (ManagerActionBy) REFERENCES dbo.Employees(EmployeeId),
    CONSTRAINT FK_Resignations_HrAction FOREIGN KEY (HrActionBy) REFERENCES dbo.Employees(EmployeeId)
);

CREATE TABLE dbo.ResignationExitFormalities (
    FormalityId     INT IDENTITY(1,1) PRIMARY KEY,
    ResignationId   INT NOT NULL,
    TemplateId      INT NULL,
    ItemName        NVARCHAR(200) NOT NULL,
    Category        NVARCHAR(50) NOT NULL,
    IsMandatory     BIT NOT NULL DEFAULT 1,
    IsCompleted     BIT NOT NULL DEFAULT 0,
    CompletedBy     INT NULL,
    CompletedAt     DATETIME2 NULL,
    Remarks         NVARCHAR(500) NULL,
    CONSTRAINT FK_ResignFormalities_Resignation FOREIGN KEY (ResignationId) REFERENCES dbo.Resignations(ResignationId) ON DELETE CASCADE,
    CONSTRAINT FK_ResignFormalities_Template FOREIGN KEY (TemplateId) REFERENCES dbo.ExitFormalityTemplates(TemplateId),
    CONSTRAINT FK_ResignFormalities_CompletedBy FOREIGN KEY (CompletedBy) REFERENCES dbo.Employees(EmployeeId)
);

CREATE INDEX IX_Resignations_Employee ON dbo.Resignations(EmployeeId);
CREATE INDEX IX_Resignations_Status ON dbo.Resignations(CompanyId, Status);
GO

-- Seed default exit formality templates for company 1 (Uttishta)
IF NOT EXISTS (SELECT 1 FROM dbo.ExitFormalityTemplates WHERE CompanyId = 1)
BEGIN
    INSERT INTO dbo.ExitFormalityTemplates (CompanyId, ItemName, Category, Description, SortOrder, IsMandatory) VALUES
    (1, N'Knowledge Transfer & Handover', N'Manager', N'Complete project handover to team/manager', 1, 1),
    (1, N'Return Company Assets', N'IT', N'Laptop, phone, and other assigned assets', 2, 1),
    (1, N'Revoke System & Email Access', N'IT', N'Disable AD, email, and application access', 3, 1),
    (1, N'Return ID Card / Access Badge', N'Admin', N'Physical access card return', 4, 1),
    (1, N'Clear Pending Expenses', N'Finance', N'Settle or approve pending expense claims', 5, 1),
    (1, N'Full & Final Settlement', N'Finance', N'Process FNF dues and deductions', 6, 1),
    (1, N'Exit Interview', N'HR', N'Conduct exit interview with employee', 7, 1),
    (1, N'Relieving / Experience Letter', N'HR', N'Issue relieving and experience letters', 8, 1);
END
GO
