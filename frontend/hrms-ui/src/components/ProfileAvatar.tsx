import './ProfileAvatar.css';

interface ProfileAvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: number;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?';
}

export default function ProfileAvatar({ name, imageUrl, size = 40, className = '' }: ProfileAvatarProps) {
  const initials = getInitials(name);
  const style = { width: size, height: size, fontSize: size * 0.38 };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`profile-avatar profile-avatar-img ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      className={`profile-avatar profile-avatar-initials ${className}`}
      style={style}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}
