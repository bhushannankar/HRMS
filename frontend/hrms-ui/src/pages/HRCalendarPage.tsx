import { useEffect, useState } from 'react';
import { dashboardApi } from '../api/client';
import '../components/Layout.css';
import './employees/EmployeesModule.css';

interface CalendarEvent { title: string; date: string; eventType: string }

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const typeColor: Record<string, string> = {
  Holiday: '#16a34a', Leave: '#0ea5e9', Event: '#1e3a5f', Meeting: '#0d9488',
};

export default function HRCalendarPage() {
  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    dashboardApi.getDashboard().then((r) => {
      if (r.data.admin?.calendarEvents) setEvents(r.data.admin.calendarEvents);
    });
  }, []);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const eventsByDay = events.reduce<Record<number, CalendarEvent[]>>((acc, e) => {
    const d = new Date(e.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      (acc[day] ??= []).push(e);
    }
    return acc;
  }, {});

  return (
    <div className="panel dash-calendar-panel">
      <h2>HR Calendar</h2>
      <p style={{ color: '#64748b', marginBottom: 16 }}>Holidays, leave, events and meetings</p>
      <div className="hr-calendar">
        <div className="hr-cal-toolbar">
          <button type="button" onClick={() => {
            if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
            else setViewMonth((m) => m - 1);
          }}>‹</button>
          <span>{MONTHS[viewMonth + 1]} {viewYear}</span>
          <button type="button" onClick={() => {
            if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
            else setViewMonth((m) => m + 1);
          }}>›</button>
          <button type="button" className="hr-cal-today" onClick={() => { setViewYear(now.getFullYear()); setViewMonth(now.getMonth()); }}>
            Current Month
          </button>
        </div>
        <div className="hr-cal-legend">
          {Object.entries(typeColor).map(([type, color]) => (
            <span key={type}><i style={{ background: color }} /> {type}</span>
          ))}
        </div>
        <div className="hr-cal-grid">
          {DAY_HEADERS.map((d) => <div key={d} className="hr-cal-head">{d}</div>)}
          {cells.map((day, i) => (
            <div key={i} className={`hr-cal-cell${day === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear() ? ' today' : ''}`}>
              {day && (
                <>
                  <span className="hr-cal-day">{day}</span>
                  <div className="hr-cal-dots">
                    {(eventsByDay[day] ?? []).slice(0, 4).map((e, j) => (
                      <span key={j} className="hr-cal-dot" style={{ background: typeColor[e.eventType] ?? '#64748b' }} title={e.title} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
