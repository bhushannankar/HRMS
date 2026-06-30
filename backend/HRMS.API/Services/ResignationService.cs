using HRMS.API.Data;
using HRMS.API.DTOs;
using HRMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace HRMS.API.Services;

public class ResignationService
{
    private readonly HrmsDbContext _db;
    public ResignationService(HrmsDbContext db) => _db = db;

    private static readonly (string Name, string Category, string? Desc, int Order)[] DefaultTemplates =
    [
        ("Knowledge Transfer & Handover", "Manager", "Complete project handover to team/manager", 1),
        ("Return Company Assets", "IT", "Laptop, phone, and other assigned assets", 2),
        ("Revoke System & Email Access", "IT", "Disable AD, email, and application access", 3),
        ("Return ID Card / Access Badge", "Admin", "Physical access card return", 4),
        ("Clear Pending Expenses", "Finance", "Settle or approve pending expense claims", 5),
        ("Full & Final Settlement", "Finance", "Process FNF dues and deductions", 6),
        ("Exit Interview", "HR", "Conduct exit interview with employee", 7),
        ("Relieving / Experience Letter", "HR", "Issue relieving and experience letters", 8),
    ];

    public async Task EnsureTemplatesAsync(int companyId)
    {
        if (await _db.ExitFormalityTemplates.AnyAsync(t => t.CompanyId == companyId)) return;
        foreach (var (name, category, desc, order) in DefaultTemplates)
        {
            _db.ExitFormalityTemplates.Add(new ExitFormalityTemplate
            {
                CompanyId = companyId,
                ItemName = name,
                Category = category,
                Description = desc,
                SortOrder = order,
                IsMandatory = true,
                IsActive = true,
            });
        }
        await _db.SaveChangesAsync();
    }

    public async Task<List<ResignationListDto>> GetResignationsAsync(
        int companyId, string role, int? employeeId, string? status = null)
    {
        var q = _db.Resignations
            .Include(r => r.Employee).ThenInclude(e => e.Department)
            .Where(r => r.CompanyId == companyId);

        if (role == "Employee" && employeeId.HasValue)
            q = q.Where(r => r.EmployeeId == employeeId.Value);
        else if (role == "Manager" && employeeId.HasValue)
            q = q.Where(r => r.Employee.ManagerId == employeeId.Value || r.EmployeeId == employeeId.Value);

        if (!string.IsNullOrEmpty(status))
            q = q.Where(r => r.Status == status);

        return await q.OrderByDescending(r => r.CreatedAt)
            .Select(r => new ResignationListDto(
                r.ResignationId, r.EmployeeId,
                r.Employee.FirstName + " " + r.Employee.LastName,
                r.Employee.EmployeeCode, r.ResignationDate, r.ProposedLastWorkingDate,
                r.ResignationType, r.Status, r.NoticePeriodDays,
                r.ClearanceCompleted, r.FnFStatus))
            .ToListAsync();
    }

    public async Task<ResignationDetailDto?> GetByIdAsync(int companyId, int resignationId)
    {
        var r = await _db.Resignations
            .Include(x => x.Employee).ThenInclude(e => e.Department)
            .Include(x => x.Employee).ThenInclude(e => e.Designation)
            .Include(x => x.ExitFormalities)
            .FirstOrDefaultAsync(x => x.ResignationId == resignationId && x.CompanyId == companyId);
        if (r is null) return null;
        return MapDetail(r);
    }

    public async Task<ResignationDetailDto> CreateAsync(int companyId, int employeeId, CreateResignationRequest req)
    {
        var active = await _db.Resignations.AnyAsync(r =>
            r.EmployeeId == employeeId && r.Status != "Completed" && r.Status != "Withdrawn"
            && r.Status != "ManagerRejected" && r.Status != "HrRejected");
        if (active)
            throw new InvalidOperationException("An active resignation request already exists.");

        var r = new Resignation
        {
            CompanyId = companyId,
            EmployeeId = employeeId,
            ResignationDate = req.ResignationDate,
            ProposedLastWorkingDate = req.ProposedLastWorkingDate,
            Reason = req.Reason,
            ResignationType = string.IsNullOrWhiteSpace(req.ResignationType) ? "Voluntary" : req.ResignationType,
            NoticePeriodDays = req.NoticePeriodDays,
            Status = "Submitted",
            CreatedAt = DateTime.UtcNow,
        };
        _db.Resignations.Add(r);
        await _db.SaveChangesAsync();
        return (await GetByIdAsync(companyId, r.ResignationId))!;
    }

    public async Task<ResignationDetailDto?> ManagerActionAsync(
        int companyId, int resignationId, int managerId, bool approve, string? remarks, bool adminOverride = false)
    {
        var r = await _db.Resignations
            .Include(x => x.Employee)
            .Include(x => x.ExitFormalities)
            .FirstOrDefaultAsync(x => x.ResignationId == resignationId && x.CompanyId == companyId);
        if (r is null || r.Status != "Submitted") return null;
        if (!adminOverride && r.Employee.ManagerId != managerId) return null;

        r.Status = approve ? "ManagerApproved" : "ManagerRejected";
        r.ManagerRemarks = remarks;
        r.ManagerActionBy = managerId;
        r.ManagerActionAt = DateTime.UtcNow;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapDetail(r);
    }

    public async Task<ResignationDetailDto?> HrActionAsync(
        int companyId, int resignationId, int hrEmployeeId, bool approve, string? remarks)
    {
        var r = await _db.Resignations
            .Include(x => x.Employee).ThenInclude(e => e.Department)
            .Include(x => x.Employee).ThenInclude(e => e.Designation)
            .Include(x => x.ExitFormalities)
            .FirstOrDefaultAsync(x => x.ResignationId == resignationId && x.CompanyId == companyId);
        if (r is null || r.Status != "ManagerApproved") return null;

        if (approve)
        {
            await EnsureTemplatesAsync(companyId);
            r.Status = "ExitInProgress";
            if (!r.ExitFormalities.Any())
            {
                var templates = await _db.ExitFormalityTemplates
                    .Where(t => t.CompanyId == companyId && t.IsActive)
                    .OrderBy(t => t.SortOrder)
                    .ToListAsync();
                foreach (var t in templates)
                {
                    r.ExitFormalities.Add(new ResignationExitFormality
                    {
                        TemplateId = t.TemplateId,
                        ItemName = t.ItemName,
                        Category = t.Category,
                        IsMandatory = t.IsMandatory,
                    });
                }
            }
            r.FnFStatus ??= "Pending";
        }
        else
        {
            r.Status = "HrRejected";
        }

        r.HrRemarks = remarks;
        r.HrActionBy = hrEmployeeId;
        r.HrActionAt = DateTime.UtcNow;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapDetail(r);
    }

    public async Task<ResignationDetailDto?> AdminCreateForEmployeeAsync(
        int companyId, int employeeId, CreateResignationRequest req, int adminEmployeeId)
    {
        var detail = await CreateAsync(companyId, employeeId, req);
        var r = await _db.Resignations
            .Include(x => x.Employee).ThenInclude(e => e.Department)
            .Include(x => x.Employee).ThenInclude(e => e.Designation)
            .Include(x => x.ExitFormalities)
            .FirstAsync(x => x.ResignationId == detail.ResignationId);

        r.Status = "ManagerApproved";
        r.ManagerActionBy = adminEmployeeId;
        r.ManagerActionAt = DateTime.UtcNow;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return await HrActionAsync(companyId, r.ResignationId, adminEmployeeId, true, "Initiated by HR/Admin");
    }

    public async Task<ResignationDetailDto?> UpdateExitInterviewAsync(
        int companyId, int resignationId, ExitInterviewRequest req)
    {
        var r = await LoadDetail(companyId, resignationId);
        if (r is null || r.Status != "ExitInProgress") return null;
        r.ExitInterviewCompleted = true;
        r.ExitInterviewNotes = req.Notes;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await TryCompleteClearance(r);
        return MapDetail(r);
    }

    public async Task<ResignationDetailDto?> UpdateFormalityAsync(
        int companyId, int resignationId, int formalityId, int completedBy, CompleteFormalityRequest req)
    {
        var r = await LoadDetail(companyId, resignationId);
        if (r is null || r.Status != "ExitInProgress") return null;
        var f = r.ExitFormalities.FirstOrDefault(x => x.FormalityId == formalityId);
        if (f is null) return null;

        f.IsCompleted = req.IsCompleted;
        f.Remarks = req.Remarks;
        f.CompletedBy = req.IsCompleted ? completedBy : null;
        f.CompletedAt = req.IsCompleted ? DateTime.UtcNow : null;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await TryCompleteClearance(r);
        return MapDetail(r);
    }

    public async Task<ResignationDetailDto?> UpdateFnFAsync(int companyId, int resignationId, FnFRequest req)
    {
        var r = await LoadDetail(companyId, resignationId);
        if (r is null || r.Status != "ExitInProgress") return null;
        r.FnFStatus = req.FnFStatus;
        r.FnFAmount = req.FnFAmount;
        r.FnFProcessedAt = req.FnFStatus == "Completed" ? DateTime.UtcNow : r.FnFProcessedAt;
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        await TryCompleteClearance(r);
        return MapDetail(r);
    }

    public async Task<ResignationDetailDto?> CompleteResignationAsync(int companyId, int resignationId)
    {
        var r = await LoadDetail(companyId, resignationId);
        if (r is null || r.Status != "ExitInProgress" || !r.ClearanceCompleted) return null;

        r.Status = "Completed";
        r.ActualLastWorkingDate = r.ProposedLastWorkingDate;
        r.UpdatedAt = DateTime.UtcNow;

        var emp = await _db.Employees.FindAsync(r.EmployeeId);
        if (emp is not null)
        {
            emp.IsActive = false;
            emp.UpdatedAt = DateTime.UtcNow;
            var user = await _db.Users.FindAsync(emp.UserId);
            if (user is not null) user.IsActive = false;
        }

        await _db.SaveChangesAsync();
        return MapDetail(r);
    }

    public async Task<bool> WithdrawAsync(int companyId, int resignationId, int employeeId)
    {
        var r = await _db.Resignations.FirstOrDefaultAsync(x =>
            x.ResignationId == resignationId && x.CompanyId == companyId && x.EmployeeId == employeeId);
        if (r is null || r.Status is not ("Submitted" or "ManagerApproved")) return false;
        r.Status = "Withdrawn";
        r.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    private async Task<Resignation?> LoadDetail(int companyId, int resignationId) =>
        await _db.Resignations
            .Include(x => x.Employee).ThenInclude(e => e.Department)
            .Include(x => x.Employee).ThenInclude(e => e.Designation)
            .Include(x => x.ExitFormalities)
            .FirstOrDefaultAsync(x => x.ResignationId == resignationId && x.CompanyId == companyId);

    private async Task TryCompleteClearance(Resignation r)
    {
        var mandatoryDone = r.ExitFormalities.Where(f => f.IsMandatory).All(f => f.IsCompleted);
        var fnfDone = r.FnFStatus == "Completed";
        if (mandatoryDone && r.ExitInterviewCompleted && fnfDone)
        {
            r.ClearanceCompleted = true;
            r.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }
    }

    private static ResignationDetailDto MapDetail(Resignation r) => new(
        r.ResignationId, r.EmployeeId,
        r.Employee.FirstName + " " + r.Employee.LastName,
        r.Employee.EmployeeCode,
        r.Employee.Department?.DepartmentName,
        r.Employee.Designation?.DesignationName,
        r.ResignationDate, r.ProposedLastWorkingDate, r.ActualLastWorkingDate,
        r.Reason, r.ResignationType, r.NoticePeriodDays, r.Status,
        r.ManagerRemarks, r.HrRemarks, r.ExitInterviewCompleted, r.ExitInterviewNotes,
        r.FnFStatus, r.FnFAmount, r.ClearanceCompleted,
        r.ExitFormalities.OrderBy(f => f.Category).ThenBy(f => f.ItemName)
            .Select(f => new ExitFormalityDto(
                f.FormalityId, f.ItemName, f.Category, f.IsMandatory,
                f.IsCompleted, null, f.CompletedAt, f.Remarks))
            .ToList());
}
