namespace HRMS.API.Models;

public class Payslip
{
    public int PayslipId { get; set; }
    public int PayrollRunId { get; set; }
    public int EmployeeId { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Allowances { get; set; }
    public decimal Deductions { get; set; }
    public decimal NetSalary { get; set; }
    public string PaymentStatus { get; set; } = "Pending";
    public DateTime GeneratedAt { get; set; }

    public PayrollRun PayrollRun { get; set; } = null!;
    public Employee Employee { get; set; } = null!;
}
