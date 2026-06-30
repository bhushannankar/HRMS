import { useEffect, useState } from 'react';
import { attendanceApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

interface Attendance {
  attendanceId: number;
  employeeName: string;
  attendanceDate: string;
  clockIn: string | null;
  clockOut: string | null;
  status: string;
  workHours: number | null;
}

export default function Attendance() {
  const { user } = useAuth();
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);

  const employeeId = user?.employeeId;

  const load = () => {
    const params = employeeId && user?.role === 'Employee'
      ? { employeeId }
      : undefined;
    attendanceApi.getAll(params).then((r) => setRecords(r.data));
  };

  useEffect(() => { load(); }, [user]);

  const handleClockIn = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      await attendanceApi.clockIn(employeeId);
      load();
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    if (!employeeId) return;
    setLoading(true);
    try {
      await attendanceApi.clockOut(employeeId);
      load();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Attendance</h1>
        <p>Track clock-in, clock-out and attendance records</p>
      </div>

      {user?.role === 'Employee' && employeeId && (
        <div className="panel" style={{ marginBottom: 24 }}>
          <h2>Today's Attendance</h2>
          <div className="action-btns">
            <button className="btn btn-success" onClick={handleClockIn} disabled={loading}>Clock In</button>
            <button className="btn btn-danger" onClick={handleClockOut} disabled={loading}>Clock Out</button>
          </div>
        </div>
      )}

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Hours</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.attendanceId}>
                <td>{r.employeeName}</td>
                <td>{r.attendanceDate}</td>
                <td>{r.clockIn ? new Date(r.clockIn).toLocaleTimeString() : '-'}</td>
                <td>{r.clockOut ? new Date(r.clockOut).toLocaleTimeString() : '-'}</td>
                <td>{r.workHours?.toFixed(1) ?? '-'}</td>
                <td><span className="badge present">{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
