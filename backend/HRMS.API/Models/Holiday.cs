namespace HRMS.API.Models;

public class Holiday
{
    public int HolidayId { get; set; }
    public int CompanyId { get; set; }
    public string HolidayName { get; set; } = string.Empty;
    public DateOnly HolidayDate { get; set; }
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    public Company Company { get; set; } = null!;
}
