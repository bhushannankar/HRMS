namespace HRMS.API.Models;

public class Announcement
{
    public int AnnouncementId { get; set; }
    public int CompanyId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public int CreatedBy { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; }

    public Company Company { get; set; } = null!;
    public User Creator { get; set; } = null!;
}
