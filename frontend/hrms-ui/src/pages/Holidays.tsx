import { useEffect, useState } from 'react';
import { setupApi } from '../api/client';
import '../components/Layout.css';

interface Holiday {
  holidayId: number;
  holidayName: string;
  holidayDate: string;
  description: string | null;
}

export default function Holidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    setupApi.getHolidays().then((r) => setHolidays(r.data));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Holidays</h1>
        <p>Company holiday calendar</p>
      </div>

      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Holiday</th>
              <th>Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h.holidayId}>
                <td>{h.holidayName}</td>
                <td>{h.holidayDate}</td>
                <td>{h.description ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
