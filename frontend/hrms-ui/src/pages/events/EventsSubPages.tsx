import { useEffect, useState } from 'react';
import { eventsApi } from '../../api/client';
import '../../components/Layout.css';

export function EventsListPage() {
  const [events, setEvents] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { eventsApi.getEvents().then((r) => setEvents(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Events</h2>
      <table className="data-table">
        <thead><tr><th>Event</th><th>Date</th><th>Location</th><th>Description</th></tr></thead>
        <tbody>
          {events.map((e) => (
            <tr key={String(e.eventId)}>
              <td>{String(e.title)}</td>
              <td>{String(e.eventDate)}</td>
              <td>{String(e.location ?? '—')}</td>
              <td>{String(e.description ?? '—')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MeetingsListPage() {
  const [meetings, setMeetings] = useState<Record<string, unknown>[]>([]);
  useEffect(() => { eventsApi.getMeetings().then((r) => setMeetings(r.data)); }, []);
  return (
    <div className="panel">
      <h2>Meetings</h2>
      <table className="data-table">
        <thead><tr><th>Meeting</th><th>Date</th><th>Time</th><th>Organizer</th><th>Status</th></tr></thead>
        <tbody>
          {meetings.map((m) => (
            <tr key={String(m.meetingId)}>
              <td>{String(m.title)}</td>
              <td>{String(m.meetingDate)}</td>
              <td>{String(m.startTime)} – {String(m.endTime)}</td>
              <td>{String(m.organizerName)}</td>
              <td>{String(m.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
