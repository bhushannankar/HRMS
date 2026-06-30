namespace HRMS.API.Models;

public class AttendanceRecord
{
    public int AttendanceId { get; set; }
    public int EmployeeId { get; set; }
    public DateOnly AttendanceDate { get; set; }
    public DateTime? ClockIn { get; set; }
    public DateTime? ClockOut { get; set; }
    public string Status { get; set; } = "Present";
    public decimal? WorkHours { get; set; }
    public string? Remarks { get; set; }
    public DateTime CreatedAt { get; set; }

    public Employee Employee { get; set; } = null!;
}
