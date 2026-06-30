-- Update demo Manager and Employee login credentials
USE HRMS;
GO

UPDATE dbo.Users
SET Username = N'manager@uttishta.com', Email = N'manager@uttishta.com'
WHERE Email = N'Robins@yopmail.com' OR Username = N'Robins';

UPDATE dbo.Users
SET Username = N'employee@uttishta.com', Email = N'employee@uttishta.com'
WHERE Email = N'neerajk@yopmail.com' OR Username = N'Neeraj';

PRINT 'Updated demo logins - Manager: manager@uttishta.com | Employee: employee@uttishta.com';
GO
