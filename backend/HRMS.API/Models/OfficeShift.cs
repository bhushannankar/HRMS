namespace HRMS.API.Models;

public class OfficeShift
{
    public int OfficeShiftId { get; set; }
    public int CompanyId { get; set; }
    public string ShiftName { get; set; } = string.Empty;
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public int GraceMinutes { get; set; } = 15;
    public bool IsActive { get; set; } = true;

    public Company Company { get; set; } = null!;
    public ICollection<Employee> Employees { get; set; } = [];
}
