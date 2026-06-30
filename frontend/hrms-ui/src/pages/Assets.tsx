import { useEffect, useState } from 'react';
import { assetsApi } from '../api/client';
import '../components/Layout.css';

export default function Assets() {
  const [assets, setAssets] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { assetsApi.getAll().then((r) => setAssets(r.data)); }, []);

  return (
    <div>
      <div className="page-header"><h1>Asset Management</h1><p>Company assets and assignments</p></div>
      <div className="panel">
        <table className="data-table"><thead><tr><th>Code</th><th>Name</th><th>Category</th><th>Status</th><th>Assigned To</th></tr></thead>
          <tbody>{assets.map((a) => <tr key={String(a.assetId)}><td>{String(a.assetCode)}</td><td>{String(a.assetName)}</td><td>{String(a.category ?? '-')}</td><td><span className={`badge ${a.status === 'Available' ? 'approved' : 'pending'}`}>{String(a.status)}</span></td><td>{String(a.assignedTo ?? '-')}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
