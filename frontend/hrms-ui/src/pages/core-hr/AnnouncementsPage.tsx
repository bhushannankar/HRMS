import { useEffect, useState } from 'react';
import { setupApi } from '../../api/client';
import '../../components/Layout.css';

export default function AnnouncementsPage() {
  const [items, setItems] = useState<{ announcementId: number; title: string; content: string; startDate: string; endDate: string | null }[]>([]);

  useEffect(() => {
    setupApi.getAnnouncements().then((r) => setItems(r.data));
  }, []);

  return (
    <div className="panel">
      <h2>Announcements</h2>
      {items.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No announcements.</p>
      ) : (
        <div className="announcement-list">
          {items.map((a) => (
            <div key={a.announcementId} className="announcement-item" style={{ padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <strong>{a.title}</strong>
              <p style={{ margin: '6px 0', color: '#64748b' }}>{a.content}</p>
              <small style={{ color: '#94a3b8' }}>{a.startDate}{a.endDate ? ` → ${a.endDate}` : ''}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
