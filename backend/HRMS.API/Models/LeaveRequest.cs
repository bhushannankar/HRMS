namespace HRMS.API.Models;

public class LeaveRequest
{
    public int LeaveRequestId { get; set; }
    public int EmployeeId { get; set; }
    public int LeaveTypeId { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal TotalDays { get; set; }
    public string? Reason { get; set; }
    public string Status { get; set; } = "Pending";
    public int? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public DateTime CreatedAt { get; set; }

    public Employee Employee { get; set; } = null!;
    public LeaveType LeaveType { get; set; } = null!;
    public Employee? Approver { get; set; }
}
