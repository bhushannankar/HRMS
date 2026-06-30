namespace HRMS.API.Models;

public class Company
{
    public int CompanyId { get; set; }
    public string CompanyName { get; set; } = string.Empty;
    public string? LegalName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }
    public string? State { get; set; }
    public string Country { get; set; } = "India";
    public string? PostalCode { get; set; }
    public string? Website { get; set; }
    public string? LogoUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public ICollection<User> Users { get; set; } = [];
    public ICollection<Department> Departments { get; set; } = [];
    public ICollection<Employee> Employees { get; set; } = [];
}
