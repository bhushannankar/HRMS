# HRMS - Human Resource Management System

A full-stack HRMS application modeled after [HRMMitra](https://demo.hrmmitra.in/), built with **React**, **.NET 8 Web API**, **Entity Framework Core**, and **SQL Server**.

## Architecture

```
HRMS/
├── database/HRMS_Schema.sql    # SQL Server schema + seed data
├── backend/HRMS.API/           # .NET Web API + EF Core
└── frontend/hrms-ui/           # React (Vite + TypeScript)
```

## Features

| Module | Admin | Manager | Employee |
|--------|-------|---------|----------|
| Dashboard | ✅ | ✅ | ✅ |
| Employee Management | ✅ | Team view | — |
| Recruitment (ATS) | ✅ | ✅ | — |
| Training | ✅ | ✅ | ✅ |
| Performance (Appraisal & Goals) | ✅ | ✅ | Own |
| Attendance | ✅ | ✅ | Clock in/out |
| Leave Management | ✅ | Approve/Reject | Apply & view |
| Payroll / Payslips | ✅ | — | View own |
| Asset Management | ✅ | — | — |
| Projects & Tasks | ✅ | ✅ | My tasks |
| Events & Meetings | ✅ | ✅ | ✅ |
| Expense Claims | ✅ | Approve | Submit |
| Travel Requests | ✅ | Approve | Submit |
| Awards & Warnings | ✅ | Warnings view | Own awards |
| Documents | ✅ | — | Own |
| Support Tickets | ✅ | — | Create/view |
| Complaints | ✅ | — | File/view |
| Holidays | ✅ | — | — |
| Reports & Analytics | ✅ | ✅ | — |

## Demo Credentials

| Role | Username / Email | Password |
|------|------------------|----------|
| Admin | `Admin` | `123456` |
| Manager | `Robins@yopmail.com` | `123456` |
| Employee | `neerajk@yopmail.com` | `123456` |

## Prerequisites

- SQL Server (LocalDB or full instance)
- .NET 10 SDK
- Node.js 18+

## Database Setup

1. Open **SQL Server Management Studio** or run via `sqlcmd`.
2. Execute the script:

```bash
sqlcmd -S localhost -E -i database/HRMS_Schema.sql
sqlcmd -S localhost -E -i database/HRMS_Modules_Extension.sql
```

Or open `database/HRMS_Schema.sql` in SSMS and run it.

This creates the `HRMS` database with all tables, indexes, and demo seed data.

## Backend Setup

1. Update the connection string in `backend/HRMS.API/appsettings.json` if needed:

```json
"DefaultConnection": "Server=localhost;Database=HRMS;Trusted_Connection=True;TrustServerCertificate=True;"
```

2. Run the API:

```bash
cd backend/HRMS.API
dotnet run
```

API runs at `http://localhost:5074`. Swagger UI: `http://localhost:5074/swagger`

## Frontend Setup

```bash
cd frontend/hrms-ui
npm install
npm run dev
```

UI runs at `http://localhost:5173`

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/login` | Login (returns JWT) |
| `GET /api/dashboard/stats` | Dashboard statistics |
| `GET /api/employees` | List employees |
| `POST /api/employees` | Create employee (Admin) |
| `GET /api/attendance` | Attendance records |
| `POST /api/attendance/clock-in` | Clock in |
| `POST /api/attendance/clock-out` | Clock out |
| `GET /api/leave/types` | Leave types |
| `GET /api/leave/balances/{id}` | Leave balances |
| `GET /api/leave/requests` | Leave requests |
| `POST /api/leave/requests` | Apply for leave |
| `PUT /api/leave/requests/{id}/approve` | Approve leave |
| `GET /api/payroll/payslips/{id}` | Employee payslips |
| `GET /api/setup/departments` | Departments |
| `GET /api/setup/holidays` | Holidays |
| `GET /api/setup/announcements` | Announcements |

## Database Tables

**Core:** `Companies`, `Roles`, `Users`, `Departments`, `Designations`, `OfficeShifts`, `Employees`, `AttendanceRecords`, `LeaveTypes`, `LeaveBalances`, `LeaveRequests`, `Holidays`, `Announcements`, `PayrollRuns`, `Payslips`

**Extended:** `JobPostings`, `JobApplications`, `Interviews`, `TrainingPrograms`, `TrainingEnrollments`, `Competencies`, `PerformanceAppraisals`, `PerformanceGoals`, `Assets`, `AssetAssignments`, `Projects`, `Tasks`, `Events`, `Meetings`, `Awards`, `Warnings`, `EmployeeDocuments`, `SupportTickets`, `Complaints`, `ExpenseClaims`, `TravelRequests`
