namespace HRMS.API.Models;

public class LeaveBalance
{
    public int LeaveBalanceId { get; set; }
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public int Year { get; set; }
    public decimal TotalDays { get; set; }
    public decimal UsedDays { get; set; }

    public Employee Employee { get; set; } = null!;
    public LeaveType LeaveType { get; set; } = null!;
}
