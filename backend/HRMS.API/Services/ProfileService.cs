using HRMS.API.Data;
using HRMS.API.DTOs;
using Microsoft.EntityFrameworkCore;

namespace HRMS.API.Services;

public class ProfileService
{
    private readonly HrmsDbContext _db;
    public ProfileService(HrmsDbContext db) => _db = db;

    public async Task<ProfileDto?> GetProfileAsync(int userId, int companyId, string role)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.Company)
            .Include(u => u.Employee)!.ThenInclude(e => e!.Department)
            .Include(u => u.Employee)!.ThenInclude(e => e!.Designation)
            .Include(u => u.Employee)!.ThenInclude(e => e!.Manager)
            .Include(u => u.Employee)!.ThenInclude(e => e!.OfficeShift)
            .FirstOrDefaultAsync(u => u.UserId == userId && u.CompanyId == companyId);

        if (user is null) return null;
        return MapProfile(user, role);
    }

    public async Task<ProfileDto?> UpdateProfileAsync(int userId, int companyId, string role, UpdateProfileRequest req)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .Include(u => u.Company)
            .Include(u => u.Employee)!.ThenInclude(e => e!.Department)
            .Include(u => u.Employee)!.ThenInclude(e => e!.Designation)
            .Include(u => u.Employee)!.ThenInclude(e => e!.Manager)
            .Include(u => u.Employee)!.ThenInclude(e => e!.OfficeShift)
            .FirstOrDefaultAsync(u => u.UserId == userId && u.CompanyId == companyId);

        if (user is null) return null;

        if (!string.IsNullOrWhiteSpace(req.Email))
        {
            var email = req.Email.Trim();
            if (await _db.Users.AnyAsync(u =>
                    u.UserId != userId && u.CompanyId == companyId &&
                    u.Email.ToLower() == email.ToLower()))
                throw new InvalidOperationException("Email is already in use.");

            user.Email = email;
            user.UpdatedAt = DateTime.UtcNow;
        }

        if (user.Employee is not null)
        {
            user.Employee.Phone = req.Phone?.Trim();
            user.Employee.Address = req.Address?.Trim();
            user.Employee.City = req.City?.Trim();
            user.Employee.State = req.State?.Trim();
            user.Employee.Country = req.Country?.Trim();
            user.Employee.UpdatedAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return MapProfile(user, role);
    }

    public async Task<bool> ChangePasswordAsync(int userId, int companyId, ChangePasswordRequest req)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.UserId == userId && u.CompanyId == companyId);
        if (user is null) return false;
        if (!BCrypt.Net.BCrypt.Verify(req.CurrentPassword, user.PasswordHash)) return false;
        if (string.IsNullOrWhiteSpace(req.NewPassword) || req.NewPassword.Length < 6) return false;

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    private static ProfileDto MapProfile(Models.User user, string role)
    {
        var emp = user.Employee;
        var fullName = emp != null ? $"{emp.FirstName} {emp.LastName}" : user.Username;
        var showSalary = role is "Admin" or "Manager";

        return new ProfileDto(
            user.UserId,
            emp?.EmployeeId,
            user.Username,
            user.Email,
            user.Role.RoleName,
            fullName,
            user.Company.CompanyName,
            emp?.EmployeeCode,
            emp?.FirstName,
            emp?.LastName,
            emp?.Phone,
            emp?.Gender,
            emp?.DateOfBirth,
            emp?.Department?.DepartmentName,
            emp?.Designation?.DesignationName,
            emp?.Manager != null ? $"{emp.Manager.FirstName} {emp.Manager.LastName}" : null,
            emp?.OfficeShift?.ShiftName,
            emp?.JoinDate,
            emp?.EmploymentType,
            emp?.Address,
            emp?.City,
            emp?.State,
            emp?.Country,
            emp?.ProfileImageUrl,
            showSalary ? emp?.BasicSalary : null,
            user.LastLoginAt);
    }
}
