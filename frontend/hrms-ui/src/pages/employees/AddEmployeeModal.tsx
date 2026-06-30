import { useEffect, useState } from 'react';
import { employeesApi, setupApi } from '../../api/client';
import '../../components/Layout.css';
import './EmployeesModule.css';

interface Department { departmentId: number; departmentName: string }
interface Designation { designationId: number; designationName: string }
interface OfficeShift { officeShiftId: number; shiftName: string }
interface SystemRole { roleName: string }
interface ManagerOption { employeeId: number; fullName: string }

export interface AddEmployeeFormData {
  employeeCode: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  departmentId: string;
  designationId: string;
  managerId: string;
  officeShiftId: string;
  joinDate: string;
  basicSalary: string;
  roleName: string;
}

const emptyForm = (): AddEmployeeFormData => ({
  employeeCode: '',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '123456',
  phone: '',
  departmentId: '',
  designationId: '',
  managerId: '',
  officeShiftId: '',
  joinDate: new Date().toISOString().slice(0, 10),
  basicSalary: '',
  roleName: 'Employee',
});

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddEmployeeModal({ open, onClose, onCreated }: AddEmployeeModalProps) {
  const [form, setForm] = useState<AddEmployeeFormData>(emptyForm);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [shifts, setShifts] = useState<OfficeShift[]>([]);
  const [roles, setRoles] = useState<SystemRole[]>([]);
  const [managers, setManagers] = useState<ManagerOption[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(emptyForm());
    setError('');
    Promise.all([
      setupApi.getDepartments(),
      setupApi.getDesignations(),
      setupApi.getOfficeShifts(),
      setupApi.getRoles(),
      employeesApi.getAll(true),
    ]).then(([dept, des, shift, role, emps]) => {
      setDepartments(dept.data);
      setDesignations(des.data);
      setShifts(shift.data);
      setRoles(role.data);
      setManagers(emps.data.map((e: ManagerOption) => ({
        employeeId: e.employeeId,
        fullName: e.fullName,
      })));
      const nextCode = `EMP${String(emps.data.length + 1).padStart(3, '0')}`;
      setForm((f) => ({ ...f, employeeCode: nextCode }));
    });
  }, [open]);

  if (!open) return null;

  const set = (field: keyof AddEmployeeFormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await employeesApi.create({
        employeeCode: form.employeeCode.trim(),
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone.trim() || null,
        departmentId: form.departmentId ? +form.departmentId : null,
        designationId: form.designationId ? +form.designationId : null,
        managerId: form.managerId ? +form.managerId : null,
        officeShiftId: form.officeShiftId ? +form.officeShiftId : null,
        joinDate: form.joinDate,
        basicSalary: parseFloat(form.basicSalary) || 0,
        roleName: form.roleName,
      });
      onCreated();
      onClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to create employee. Please check all fields.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2>Add Employee</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          {error && <p className="error-msg">{error}</p>}

          <h3 className="form-section-title">Personal Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Employee Code *</label>
              <input value={form.employeeCode} onChange={(e) => set('employeeCode', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Join Date *</label>
              <input type="date" value={form.joinDate} onChange={(e) => set('joinDate', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>First Name *</label>
              <input value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91-9000000000" />
            </div>
            <div className="form-group">
              <label>Basic Salary (₹) *</label>
              <input type="number" min="0" step="0.01" value={form.basicSalary} onChange={(e) => set('basicSalary', e.target.value)} required />
            </div>
          </div>

          <h3 className="form-section-title">Job Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Department</label>
              <select value={form.departmentId} onChange={(e) => set('departmentId', e.target.value)}>
                <option value="">Select department</option>
                {departments.map((d) => (
                  <option key={d.departmentId} value={d.departmentId}>{d.departmentName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Designation</label>
              <select value={form.designationId} onChange={(e) => set('designationId', e.target.value)}>
                <option value="">Select designation</option>
                {designations.map((d) => (
                  <option key={d.designationId} value={d.designationId}>{d.designationName}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Reporting Manager</label>
              <select value={form.managerId} onChange={(e) => set('managerId', e.target.value)}>
                <option value="">None</option>
                {managers.map((m) => (
                  <option key={m.employeeId} value={m.employeeId}>{m.fullName}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Office Shift</label>
              <select value={form.officeShiftId} onChange={(e) => set('officeShiftId', e.target.value)}>
                <option value="">Select shift</option>
                {shifts.map((s) => (
                  <option key={s.officeShiftId} value={s.officeShiftId}>{s.shiftName}</option>
                ))}
              </select>
            </div>
          </div>

          <h3 className="form-section-title">Login Account</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input value={form.username} onChange={(e) => set('username', e.target.value)} required autoComplete="off" />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} required minLength={6} />
            </div>
            <div className="form-group">
              <label>System Role *</label>
              <select value={form.roleName} onChange={(e) => set('roleName', e.target.value)} required>
                {roles.map((r) => (
                  <option key={r.roleName} value={r.roleName}>{r.roleName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
