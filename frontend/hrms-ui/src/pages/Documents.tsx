import { useEffect, useState } from 'react';
import { documentsApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import '../components/Layout.css';

export default function Documents() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<Record<string, unknown>[]>([]);
  const eid = user?.role === 'Employee' ? user.employeeId ?? undefined : undefined;

  useEffect(() => { documentsApi.getAll(eid).then((r) => setDocs(r.data)); }, [user]);

  return (
    <div>
      <div className="page-header"><h1>Documents</h1><p>Employee official documents</p></div>
      <div className="panel">
        <table className="data-table"><thead><tr><th>Document</th><th>Type</th><th>Employee</th><th>Uploaded</th><th>File</th></tr></thead>
          <tbody>{docs.map((d) => <tr key={String(d.documentId)}><td>{String(d.documentName)}</td><td>{String(d.documentType)}</td><td>{String(d.employeeName)}</td><td>{new Date(String(d.uploadedAt)).toLocaleDateString()}</td><td>{String(d.fileUrl ?? '-')}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
