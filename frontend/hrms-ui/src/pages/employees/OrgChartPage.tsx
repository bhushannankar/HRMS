import { useEffect, useState } from 'react';
import { employeesApi } from '../../api/client';
import '../../components/Layout.css';
import './EmployeesModule.css';

interface OrgNode {
  employeeId: number;
  name: string;
  designation: string | null;
  department: string | null;
  managerId: number | null;
  reports: OrgNode[];
}

function OrgBranch({ node, isRoot = false }: { node: OrgNode; isRoot?: boolean }) {
  return (
    <div className="org-branch">
      <div className={`org-node${isRoot ? ' root' : ''}`}>
        <div className="org-node-name">{node.name}</div>
        {node.designation && <div className="org-node-role">{node.designation}</div>}
        {node.department && <div className="org-node-dept">{node.department}</div>}
      </div>
      {node.reports.length > 0 && (
        <div className="org-children">
          {node.reports.map((child) => (
            <OrgBranch key={child.employeeId} node={child} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrgChartPage() {
  const [roots, setRoots] = useState<OrgNode[]>([]);

  useEffect(() => {
    employeesApi.getOrgChart().then((r) => setRoots(r.data));
  }, []);

  return (
    <div className="panel">
      <div className="panel-header-row" style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Organization Chart</h2>
        <span style={{ color: '#64748b', fontSize: '0.88rem' }}>Reporting hierarchy</span>
      </div>
      {roots.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No organization data available.</p>
      ) : (
        <div className="org-chart">
          {roots.map((root) => (
            <OrgBranch key={root.employeeId} node={root} isRoot />
          ))}
        </div>
      )}
    </div>
  );
}
