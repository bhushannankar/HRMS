import { useEffect, useState } from 'react';
import { setupApi } from '../../api/client';
import '../../components/Layout.css';

interface Designation {
  designationId: number;
  designationName: string;
  description: string | null;
}

export default function DesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);

  useEffect(() => {
    setupApi.getDesignations().then((r) => setDesignations(r.data));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header-row" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Designations</h2>
        <span style={{ color: '#64748b', fontSize: '0.88rem' }}>{designations.length} designation(s)</span>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Designation</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {designations.map((d, i) => (
            <tr key={d.designationId}>
              <td>{i + 1}</td>
              <td><strong>{d.designationName}</strong></td>
              <td>{d.description ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
