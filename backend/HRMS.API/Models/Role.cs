namespace HRMS.API.Models;

public class Role
{
    public int RoleId { get; set; }
    public string RoleName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<User> Users { get; set; } = [];
}
