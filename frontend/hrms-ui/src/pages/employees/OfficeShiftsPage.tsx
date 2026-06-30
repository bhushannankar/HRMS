import { useEffect, useState } from 'react';
import { setupApi } from '../../api/client';
import '../../components/Layout.css';

interface OfficeShift {
  officeShiftId: number;
  shiftName: string;
  startTime: string;
  endTime: string;
  graceMinutes: number;
  employeeCount: number;
}

export default function OfficeShiftsPage() {
  const [shifts, setShifts] = useState<OfficeShift[]>([]);

  useEffect(() => {
    setupApi.getOfficeShifts().then((r) => setShifts(r.data));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header-row" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Office Shifts</h2>
        <span style={{ color: '#64748b', fontSize: '0.88rem' }}>{shifts.length} shift(s)</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Shift Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Grace (mins)</th>
            <th>Employees</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((s, i) => (
            <tr key={s.officeShiftId}>
              <td>{i + 1}</td>
              <td><strong>{s.shiftName}</strong></td>
              <td>{s.startTime}</td>
              <td>{s.endTime}</td>
              <td>{s.graceMinutes}</td>
              <td>{s.employeeCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
