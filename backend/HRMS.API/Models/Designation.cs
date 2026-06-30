namespace HRMS.API.Models;

public class Designation
{
    public int DesignationId { get; set; }
    public int CompanyId { get; set; }
    public string DesignationName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public Company Company { get; set; } = null!;
    public ICollection<Employee> Employees { get; set; } = [];
}
