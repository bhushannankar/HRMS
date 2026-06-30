import { useCallback, useEffect, useState } from 'react';
import { employeesApi, resignationsApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import '../../components/Layout.css';
import './Resignations.css';

interface ResignationListItem {
  resignationId: number;
  employeeId: number;
  employeeName: string;
  employeeCode: string;
  resignationDate: string;
  proposedLastWorkingDate: string;
  resignationType: string;
  status: string;
  noticePeriodDays: number | null;
  clearanceCompleted: boolean;
  fnfStatus: string | null;
}

interface ExitFormality {
  formalityId: number;
  itemName: string;
  category: string;
  isMandatory: boolean;
  isCompleted: boolean;
  completedAt: string | null;
  remarks: string | null;
}

interface ResignationDetail extends ResignationListItem {
  department: string | null;
  designation: string | null;
  actualLastWorkingDate: string | null;
  reason: string | null;
  managerRemarks: string | null;
  hrRemarks: string | null;
  exitInterviewCompleted: boolean;
  exitInterviewNotes: string | null;
  fnfAmount: number | null;
  exitFormalities: ExitFormality[];
}

const STATUS_CLASS: Record<string, string> = {
  Submitted: 'pending',
  ManagerApproved: 'info',
  ManagerRejected: 'rejected',
  ExitInProgress: 'info',
  HrRejected: 'rejected',
  Completed: 'approved',
  Withdrawn: 'muted',
};

const today = () => new Date().toISOString().slice(0, 10);

export default function ResignationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin';
  const isManager = user?.role === 'Manager';
  const isEmployee = user?.role === 'Employee';

  const [list, setList] = useState<ResignationListItem[]>([]);
  const [selected, setSelected] = useState<ResignationDetail | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showApply, setShowApply] = useState(false);
  const [showAdminCreate, setShowAdminCreate] = useState(false);
  const [employees, setEmployees] = useState<{ employeeId: number; fullName: string; employeeCode: string }[]>([]);
  const [actionRemarks, setActionRemarks] = useState('');
  const [fnfAmount, setFnfAmount] = useState('');
  const [exitNotes, setExitNotes] = useState('');
  const [adminEmployeeId, setAdminEmployeeId] = useState('');
  const [form, setForm] = useState({
    resignationDate: today(),
    proposedLastWorkingDate: '',
    reason: '',
    resignationType: 'Voluntary',
    noticePeriodDays: '30',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const loadList = useCallback(() => {
    resignationsApi.getAll(statusFilter || undefined).then((r) => setList(r.data));
  }, [statusFilter]);

  const loadDetail = async (id: number) => {
    const r = await resignationsApi.getById(id);
    setSelected(r.data);
    setExitNotes(r.data.exitInterviewNotes ?? '');
    setFnfAmount(r.data.fnfAmount != null ? String(r.data.fnfAmount) : '');
  };

  useEffect(() => { loadList(); }, [loadList]);

  useEffect(() => {
    if (isAdmin && showAdminCreate) {
      employeesApi.getAll(true).then((r) => setEmployees(r.data));
    }
  }, [isAdmin, showAdminCreate]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await resignationsApi.create({
        resignationDate: form.resignationDate,
        proposedLastWorkingDate: form.proposedLastWorkingDate,
        reason: form.reason,
        resignationType: form.resignationType,
        noticePeriodDays: Number(form.noticePeriodDays) || undefined,
      });
      setShowApply(false);
      loadList();
    } catch {
      setError('Could not submit resignation. You may already have an active request.');
    } finally {
      setSaving(false);
    }
  };

  const handleAdminCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmployeeId) return;
    setSaving(true);
    try {
      await resignationsApi.adminCreate(Number(adminEmployeeId), {
        resignationDate: form.resignationDate,
        proposedLastWorkingDate: form.proposedLastWorkingDate,
        reason: form.reason,
        resignationType: form.resignationType,
        noticePeriodDays: Number(form.noticePeriodDays) || undefined,
      });
      setShowAdminCreate(false);
      loadList();
    } finally {
      setSaving(false);
    }
  };

  const refreshDetail = async () => {
    if (selected) await loadDetail(selected.resignationId);
    loadList();
  };

  return (
    <div className="resignations-page">
      <div className="page-header">
        <h1>Employee Resignations</h1>
        <p>Resignation requests, approvals and exit formalities clearance</p>
      </div>

      <div className="resign-toolbar">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="resign-filter">
          <option value="">All statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="ManagerApproved">Manager Approved</option>
          <option value="ExitInProgress">Exit In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Withdrawn">Withdrawn</option>
        </select>
        {isEmployee && (
          <button type="button" className="btn btn-primary" onClick={() => setShowApply(!showApply)}>
            {showApply ? 'Cancel' : '+ Submit Resignation'}
          </button>
        )}
        {isAdmin && (
          <button type="button" className="btn btn-secondary" onClick={() => setShowAdminCreate(!showAdminCreate)}>
            {showAdminCreate ? 'Cancel' : '+ Initiate Exit (Admin)'}
          </button>
        )}
      </div>

      {showApply && (
        <div className="panel resign-form-panel">
          <h2>Submit Resignation</h2>
          {error && <p className="resign-error">{error}</p>}
          <form onSubmit={handleApply} className="resign-form">
            <div className="form-row">
              <div className="form-group">
                <label>Resignation Date</label>
                <input type="date" value={form.resignationDate} onChange={(e) => setForm({ ...form, resignationDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Last Working Date</label>
                <input type="date" value={form.proposedLastWorkingDate} onChange={(e) => setForm({ ...form, proposedLastWorkingDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Notice Period (days)</label>
                <input type="number" value={form.noticePeriodDays} onChange={(e) => setForm({ ...form, noticePeriodDays: e.target.value })} />
              </div>
            </div>
            <div className="form-group">
              <label>Type</label>
              <select value={form.resignationType} onChange={(e) => setForm({ ...form, resignationType: e.target.value })}>
                <option value="Voluntary">Voluntary</option>
                <option value="Retirement">Retirement</option>
              </select>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Submitting...' : 'Submit'}</button>
          </form>
        </div>
      )}

      {showAdminCreate && (
        <div className="panel resign-form-panel">
          <h2>Initiate Employee Exit</h2>
          <p style={{ color: '#64748b', marginBottom: 16 }}>Creates resignation and starts exit formalities immediately.</p>
          <form onSubmit={handleAdminCreate} className="resign-form">
            <div className="form-group">
              <label>Employee</label>
              <select value={adminEmployeeId} onChange={(e) => setAdminEmployeeId(e.target.value)} required>
                <option value="">Select employee</option>
                {employees.map((emp) => (
                  <option key={emp.employeeId} value={emp.employeeId}>{emp.employeeCode} — {emp.fullName}</option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Resignation Date</label>
                <input type="date" value={form.resignationDate} onChange={(e) => setForm({ ...form, resignationDate: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Last Working Date</label>
                <input type="date" value={form.proposedLastWorkingDate} onChange={(e) => setForm({ ...form, proposedLastWorkingDate: e.target.value })} required />
              </div>
            </div>
            <div className="form-group">
              <label>Reason</label>
              <textarea rows={2} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Processing...' : 'Start Exit Process'}</button>
          </form>
        </div>
      )}

      <div className="resign-layout">
        <div className="panel resign-list-panel">
          <h2>Resignation Requests</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Resignation</th>
                <th>LWD</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.resignationId} className={selected?.resignationId === r.resignationId ? 'selected-row' : ''}>
                  <td>
                    <strong>{r.employeeName}</strong>
                    <div className="resign-sub">{r.employeeCode}</div>
                  </td>
                  <td>{r.resignationDate}</td>
                  <td>{r.proposedLastWorkingDate}</td>
                  <td><span className={`badge ${STATUS_CLASS[r.status] ?? 'pending'}`}>{r.status}</span></td>
                  <td>
                    <button type="button" className="btn btn-sm" onClick={() => loadDetail(r.resignationId)}>View</button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr><td colSpan={5} style={{ color: '#94a3b8' }}>No resignation records.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {selected && (
          <div className="panel resign-detail-panel">
            <h2>{selected.employeeName}</h2>
            <p className="resign-meta">{selected.designation} · {selected.department}</p>

            <div className="resign-info-grid">
              <div><span>Type</span><strong>{selected.resignationType}</strong></div>
              <div><span>Resignation Date</span><strong>{selected.resignationDate}</strong></div>
              <div><span>Last Working Date</span><strong>{selected.proposedLastWorkingDate}</strong></div>
              <div><span>Notice Period</span><strong>{selected.noticePeriodDays ?? '—'} days</strong></div>
              <div><span>Status</span><strong><span className={`badge ${STATUS_CLASS[selected.status] ?? 'pending'}`}>{selected.status}</span></strong></div>
              <div><span>FNF</span><strong>{selected.fnfStatus ?? '—'}</strong></div>
            </div>

            {selected.reason && (
              <div className="resign-reason">
                <strong>Reason</strong>
                <p>{selected.reason}</p>
              </div>
            )}

            {(isManager || isAdmin) && selected.status === 'Submitted' && (
              <div className="resign-actions">
                <h3>Manager Approval</h3>
                <textarea rows={2} placeholder="Remarks (optional)" value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} />
                <div className="resign-action-btns">
                  <button type="button" className="btn btn-primary" onClick={async () => { await resignationsApi.managerAction(selected.resignationId, true, actionRemarks); setActionRemarks(''); refreshDetail(); }}>Approve</button>
                  <button type="button" className="btn btn-danger" onClick={async () => { await resignationsApi.managerAction(selected.resignationId, false, actionRemarks); setActionRemarks(''); refreshDetail(); }}>Reject</button>
                </div>
              </div>
            )}

            {isAdmin && selected.status === 'ManagerApproved' && (
              <div className="resign-actions">
                <h3>HR Approval — Start Exit Formalities</h3>
                <textarea rows={2} placeholder="HR remarks" value={actionRemarks} onChange={(e) => setActionRemarks(e.target.value)} />
                <div className="resign-action-btns">
                  <button type="button" className="btn btn-primary" onClick={async () => { await resignationsApi.hrAction(selected.resignationId, true, actionRemarks); setActionRemarks(''); refreshDetail(); }}>Approve &amp; Start Clearance</button>
                  <button type="button" className="btn btn-danger" onClick={async () => { await resignationsApi.hrAction(selected.resignationId, false, actionRemarks); setActionRemarks(''); refreshDetail(); }}>Reject</button>
                </div>
              </div>
            )}

            {isEmployee && (selected.status === 'Submitted' || selected.status === 'ManagerApproved') && selected.employeeId === user?.employeeId && (
              <div className="resign-actions">
                <button type="button" className="btn btn-secondary" onClick={async () => { await resignationsApi.withdraw(selected.resignationId); setSelected(null); loadList(); }}>Withdraw Resignation</button>
              </div>
            )}

            {selected.status === 'ExitInProgress' && (
              <>
                <div className="resign-exit-section">
                  <h3>Exit Formalities Checklist</h3>
                  <div className="exit-checklist">
                    {selected.exitFormalities.map((f) => (
                      <div key={f.formalityId} className={`exit-item${f.isCompleted ? ' done' : ''}`}>
                        <label className="exit-item-label">
                          {isAdmin ? (
                            <input
                              type="checkbox"
                              checked={f.isCompleted}
                              onChange={async (e) => {
                                await resignationsApi.updateFormality(selected.resignationId, f.formalityId, e.target.checked, f.remarks ?? undefined);
                                refreshDetail();
                              }}
                            />
                          ) : (
                            <span className={`exit-check${f.isCompleted ? ' checked' : ''}`}>{f.isCompleted ? '✓' : '○'}</span>
                          )}
                          <span>
                            <strong>{f.itemName}</strong>
                            <span className="exit-cat">{f.category}</span>
                            {f.isMandatory && <span className="exit-mandatory">Required</span>}
                          </span>
                        </label>
                        {f.remarks && <p className="exit-remarks">{f.remarks}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {isAdmin && (
                  <div className="resign-actions">
                    <h3>Exit Interview</h3>
                    <textarea rows={3} value={exitNotes} onChange={(e) => setExitNotes(e.target.value)} placeholder="Exit interview notes" />
                    {!selected.exitInterviewCompleted && (
                      <button type="button" className="btn btn-secondary" style={{ marginTop: 8 }} onClick={async () => { await resignationsApi.exitInterview(selected.resignationId, exitNotes); refreshDetail(); }}>
                        Mark Exit Interview Done
                      </button>
                    )}
                    {selected.exitInterviewCompleted && <p className="resign-done-tag">✓ Exit interview completed</p>}

                    <h3 style={{ marginTop: 20 }}>Full &amp; Final Settlement</h3>
                    <div className="form-row">
                      <div className="form-group">
                        <label>FNF Amount (₹)</label>
                        <input type="number" value={fnfAmount} onChange={(e) => setFnfAmount(e.target.value)} />
                      </div>
                    </div>
                    <div className="resign-action-btns">
                      <button type="button" className="btn btn-secondary" onClick={async () => { await resignationsApi.updateFnF(selected.resignationId, 'InProgress', fnfAmount ? Number(fnfAmount) : undefined); refreshDetail(); }}>Mark FNF In Progress</button>
                      <button type="button" className="btn btn-primary" onClick={async () => { await resignationsApi.updateFnF(selected.resignationId, 'Completed', fnfAmount ? Number(fnfAmount) : undefined); refreshDetail(); }}>Complete FNF</button>
                    </div>

                    {selected.clearanceCompleted && (
                      <div className="resign-complete-banner">
                        <p>All exit formalities cleared. Ready to finalize separation.</p>
                        <button type="button" className="btn btn-primary" onClick={async () => { await resignationsApi.complete(selected.resignationId); refreshDetail(); }}>
                          Complete Resignation &amp; Deactivate Employee
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {selected.status === 'Completed' && (
              <div className="resign-complete-banner success">
                <p>Resignation completed. Employee has been deactivated.</p>
                {selected.actualLastWorkingDate && <p>Actual LWD: {selected.actualLastWorkingDate}</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
