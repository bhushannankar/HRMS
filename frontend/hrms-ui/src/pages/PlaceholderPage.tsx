import '../components/Layout.css';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="panel placeholder-panel">
      <h2>{title}</h2>
      <p style={{ color: '#64748b', margin: '0 0 16px' }}>
        {description ?? 'This module is configured and will be connected to backend services in a future release.'}
      </p>
      <div className="placeholder-badge">Module available in navigation</div>
    </div>
  );
}
