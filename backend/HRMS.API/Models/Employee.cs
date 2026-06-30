namespace HRMS.API.Models;

public class Employee
{
    public int EmployeeId { get; set; }
    public int CompanyId { get; set; }
    public int UserId { get; set; }
    public string EmployeeCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? Gender { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Phone { get; set; }
    public int? DepartmentId { get; set; }
    public int? DesignationId { get; set; }
    public int? ManagerId { get; set; }
    public int? OfficeShiftId { get; set; }
    public DateOnly JoinDate { get; set; }
    public decimal BasicSalary { get; set; }
    public string? EmploymentType { get; set; }
    public string? ProfileImageUrl { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string? Country { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Company Company { get; set; } = null!;
    public User User { get; set; } = null!;
    public Department? Department { get; set; }
    public Designation? Designation { get; set; }
    public Employee? Manager { get; set; }
    public OfficeShift? OfficeShift { get; set; }
    public ICollection<Employee> DirectReports { get; set; } = [];
    public ICollection<AttendanceRecord> AttendanceRecords { get; set; } = [];
    public ICollection<LeaveRequest> LeaveRequests { get; set; } = [];
    public ICollection<LeaveBalance> LeaveBalances { get; set; } = [];
    public ICollection<Payslip> Payslips { get; set; } = [];
}
