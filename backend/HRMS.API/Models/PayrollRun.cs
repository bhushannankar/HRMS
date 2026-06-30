namespace HRMS.API.Models;

public class PayrollRun
{
    public int PayrollRunId { get; set; }
    public int CompanyId { get; set; }
    public int PayPeriodMonth { get; set; }
    public int PayPeriodYear { get; set; }
    public DateTime RunDate { get; set; }
    public string Status { get; set; } = "Draft";
    public int? ProcessedBy { get; set; }

    public Company Company { get; set; } = null!;
    public ICollection<Payslip> Payslips { get; set; } = [];
}
