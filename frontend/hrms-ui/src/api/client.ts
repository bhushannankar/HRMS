import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5214/api';

const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('hrms_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface LoginResponse {
  token: string;
  userId: number;
  employeeId: number | null;
  username: string;
  email: string;
  role: string;
  fullName: string;
  companyId: number;
  companyName: string;
}

export const authApi = {
  login: (usernameOrEmail: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { usernameOrEmail, password }),
};

export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
  getDashboard: () => api.get('/dashboard'),
};

export const employeesApi = {
  getAll: (isActive?: boolean) =>
    api.get('/employees', { params: isActive !== undefined ? { isActive } : {} }),
  getById: (id: number) => api.get(`/employees/${id}`),
  getOrgChart: () => api.get('/employees/org-chart'),
  create: (data: unknown) => api.post('/employees', data),
};

export const attendanceApi = {
  getAll: (params?: { employeeId?: number; from?: string; to?: string }) =>
    api.get('/attendance', { params }),
  clockIn: (employeeId: number) => api.post(`/attendance/clock-in?employeeId=${employeeId}`),
  clockOut: (employeeId: number) => api.post(`/attendance/clock-out?employeeId=${employeeId}`),
};

export const leaveApi = {
  getTypes: () => api.get('/leave/types'),
  getBalances: (employeeId: number, year?: number) =>
    api.get(`/leave/balances/${employeeId}`, { params: { year } }),
  getRequests: (params?: { employeeId?: number; status?: string }) =>
    api.get('/leave/requests', { params }),
  createRequest: (employeeId: number, data: unknown) =>
    api.post(`/leave/requests?employeeId=${employeeId}`, data),
  approve: (id: number, approverEmployeeId: number) =>
    api.put(`/leave/requests/${id}/approve?approverEmployeeId=${approverEmployeeId}`, {}),
  reject: (id: number, approverEmployeeId: number, rejectionReason?: string) =>
    api.put(`/leave/requests/${id}/reject?approverEmployeeId=${approverEmployeeId}`, { rejectionReason }),
};

export const payrollApi = {
  getPayslips: (employeeId: number) => api.get(`/payroll/payslips/${employeeId}`),
};

export const setupApi = {
  getDepartments: () => api.get('/setup/departments'),
  getDesignations: () => api.get('/setup/designations'),
  getOfficeShifts: () => api.get('/setup/office-shifts'),
  getRoles: () => api.get('/setup/roles'),
  getHolidays: () => api.get('/setup/holidays'),
  getAnnouncements: () => api.get('/setup/announcements'),
};

export const recruitmentApi = {
  getJobs: () => api.get('/recruitment/jobs'),
  getApplications: (jobId?: number) => api.get('/recruitment/applications', { params: { jobId } }),
  getInterviews: () => api.get('/recruitment/interviews'),
};

export const trainingApi = {
  getAll: () => api.get('/training'),
  getEnrollments: (employeeId?: number) => api.get('/training/enrollments', { params: { employeeId } }),
  enroll: (trainingId: number, employeeId: number) =>
    api.post(`/training/enroll?trainingId=${trainingId}&employeeId=${employeeId}`),
};

export const performanceApi = {
  getCompetencies: () => api.get('/performance/competencies'),
  getAppraisals: (employeeId?: number) => api.get('/performance/appraisals', { params: { employeeId } }),
  getGoals: (employeeId?: number) => api.get('/performance/goals', { params: { employeeId } }),
};

export const assetsApi = { getAll: () => api.get('/assets') };
export const projectsApi = {
  getAll: () => api.get('/projects'),
  getTasks: (employeeId?: number) => api.get('/projects/tasks', { params: { employeeId } }),
};
export const eventsApi = {
  getEvents: () => api.get('/events'),
  getMeetings: () => api.get('/events/meetings'),
};
export const awardsApi = {
  getAwards: (employeeId?: number) => api.get('/awards', { params: { employeeId } }),
  getWarnings: () => api.get('/awards/warnings'),
};
export const documentsApi = {
  getAll: (employeeId?: number) => api.get('/documents', { params: { employeeId } }),
};
export const ticketsApi = {
  getAll: (employeeId?: number) => api.get('/tickets', { params: { employeeId } }),
  create: (data: { employeeId: number; subject: string; description?: string; priority: string }) =>
    api.post('/tickets', data),
};
export const complaintsApi = {
  getAll: (employeeId?: number) => api.get('/complaints', { params: { employeeId } }),
  create: (data: { employeeId: number; subject: string; description?: string; againstEmployeeId?: number }) =>
    api.post('/complaints', data),
};
export const expensesApi = {
  getAll: (params?: { employeeId?: number; status?: string }) => api.get('/expenses', { params }),
  create: (data: { category: string; amount: number; description?: string; expenseDate: string }) =>
    api.post('/expenses', data),
  approve: (id: number, approverId: number, approve = true) =>
    api.put(`/expenses/${id}/approve?approverId=${approverId}&approve=${approve}`),
};
export const travelApi = {
  getAll: (params?: { employeeId?: number; status?: string }) => api.get('/travel', { params }),
  create: (data: { destination: string; purpose?: string; startDate: string; endDate: string; estimatedCost?: number }) =>
    api.post('/travel', data),
  approve: (id: number, approverId: number, approve = true) =>
    api.put(`/travel/${id}/approve?approverId=${approverId}&approve=${approve}`),
};
export const resignationsApi = {
  getAll: (status?: string) => api.get('/resignations', { params: { status } }),
  getById: (id: number) => api.get(`/resignations/${id}`),
  create: (data: {
    resignationDate: string;
    proposedLastWorkingDate: string;
    reason?: string;
    resignationType?: string;
    noticePeriodDays?: number;
  }) => api.post('/resignations', data),
  adminCreate: (employeeId: number, data: unknown) =>
    api.post(`/resignations/admin?employeeId=${employeeId}`, data),
  managerAction: (id: number, approve: boolean, remarks?: string) =>
    api.put(`/resignations/${id}/manager-action?approve=${approve}`, { remarks }),
  hrAction: (id: number, approve: boolean, remarks?: string) =>
    api.put(`/resignations/${id}/hr-action?approve=${approve}`, { remarks }),
  exitInterview: (id: number, notes?: string) =>
    api.put(`/resignations/${id}/exit-interview`, { notes }),
  updateFormality: (id: number, formalityId: number, isCompleted: boolean, remarks?: string) =>
    api.put(`/resignations/${id}/formalities/${formalityId}`, { isCompleted, remarks }),
  updateFnF: (id: number, fnfStatus: string, fnfAmount?: number) =>
    api.put(`/resignations/${id}/fnf`, { fnfStatus, fnfAmount }),
  complete: (id: number) => api.put(`/resignations/${id}/complete`, {}),
  withdraw: (id: number) => api.put(`/resignations/${id}/withdraw`, {}),
};

export const reportsApi = { getSummary: () => api.get('/reports/summary') };

export default api;
