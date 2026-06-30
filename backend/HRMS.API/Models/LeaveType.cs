namespace HRMS.API.Models;

public class LeaveType
{
    public int LeaveTypeId { get; set; }
    public int CompanyId { get; set; }
    public string LeaveTypeName { get; set; } = string.Empty;
    public int DaysPerYear { get; set; }
    public bool IsPaid { get; set; } = true;
    public bool IsActive { get; set; } = true;

    public Company Company { get; set; } = null!;
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = [];
    public ICollection<LeaveBalance> LeaveBalances { get; set; } = [];
}
