import { useEffect, useState } from 'react';
import { profileApi, type ProfileData } from '../api/client';
import { useAuth } from '../context/AuthContext';
import ProfileAvatar from '../components/ProfileAvatar';
import '../components/Layout.css';
import './Profile.css';

type Tab = 'personal' | 'job' | 'password';

export default function ProfilePage() {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [tab, setTab] = useState<Tab>('personal');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [contact, setContact] = useState({
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const load = () => {
    profileApi.getMe().then((r) => {
      setProfile(r.data);
      setContact({
        email: r.data.email ?? '',
        phone: r.data.phone ?? '',
        address: r.data.address ?? '',
        city: r.data.city ?? '',
        state: r.data.state ?? '',
        country: r.data.country ?? '',
      });
    });
  };

  useEffect(() => { load(); }, []);

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const r = await profileApi.updateMe(contact);
      setProfile(r.data);
      updateUser({ email: r.data.email, fullName: r.data.fullName });
      setMessage('Profile updated successfully.');
    } catch {
      setError('Could not update profile. Email may already be in use.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    setSaving(true);
    try {
      await profileApi.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage('Password changed successfully.');
    } catch {
      setError('Current password is incorrect.');
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <div className="panel"><p style={{ color: '#94a3b8' }}>Loading profile...</p></div>;
  }

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>View and update your personal information</p>
      </div>

      <div className="profile-hero panel">
        <ProfileAvatar
          name={profile.fullName}
          imageUrl={profile.profileImageUrl}
          size={80}
          className="profile-hero-avatar"
        />
        <div className="profile-hero-info">
          <h2>{profile.fullName}</h2>
          <p>{profile.designation ?? profile.role} · {profile.department ?? profile.companyName}</p>
          <div className="profile-hero-tags">
            <span className="profile-tag">{profile.role}</span>
            {profile.employeeCode && <span className="profile-tag muted">{profile.employeeCode}</span>}
          </div>
        </div>
      </div>

      {message && <div className="profile-alert success">{message}</div>}
      {error && <div className="profile-alert error">{error}</div>}

      <div className="profile-tabs">
        <button type="button" className={tab === 'personal' ? 'active' : ''} onClick={() => setTab('personal')}>Personal Info</button>
        <button type="button" className={tab === 'job' ? 'active' : ''} onClick={() => setTab('job')}>Job Details</button>
        <button type="button" className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>Change Password</button>
      </div>

      {tab === 'personal' && (
        <div className="panel">
          <h2>Contact &amp; Address</h2>
          <form onSubmit={handleSaveContact} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+91-..." />
              </div>
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea rows={2} value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
            </div>
            <div className="form-row profile-form-row-3">
              <div className="form-group">
                <label>City</label>
                <input value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
              </div>
              <div className="form-group">
                <label>State</label>
                <input value={contact.state} onChange={(e) => setContact({ ...contact, state: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input value={contact.country} onChange={(e) => setContact({ ...contact, country: e.target.value })} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      )}

      {tab === 'job' && (
        <div className="panel">
          <h2>Employment Information</h2>
          <div className="profile-detail-grid">
            <div><span>Username</span><strong>{profile.username}</strong></div>
            <div><span>Employee Code</span><strong>{profile.employeeCode ?? '—'}</strong></div>
            <div><span>Department</span><strong>{profile.department ?? '—'}</strong></div>
            <div><span>Designation</span><strong>{profile.designation ?? '—'}</strong></div>
            <div><span>Reporting Manager</span><strong>{profile.managerName ?? '—'}</strong></div>
            <div><span>Office Shift</span><strong>{profile.shiftName ?? '—'}</strong></div>
            <div><span>Join Date</span><strong>{profile.joinDate ?? '—'}</strong></div>
            <div><span>Employment Type</span><strong>{profile.employmentType ?? '—'}</strong></div>
            <div><span>Gender</span><strong>{profile.gender ?? '—'}</strong></div>
            <div><span>Date of Birth</span><strong>{profile.dateOfBirth ?? '—'}</strong></div>
            <div><span>Company</span><strong>{profile.companyName}</strong></div>
            <div><span>Last Login</span><strong>{profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleString() : '—'}</strong></div>
            {profile.basicSalary != null && (
              <div><span>Basic Salary</span><strong>₹{profile.basicSalary.toLocaleString()}</strong></div>
            )}
          </div>
          <p className="profile-readonly-note">Job details are managed by HR. Contact your administrator to request changes.</p>
        </div>
      )}

      {tab === 'password' && (
        <div className="panel">
          <h2>Change Password</h2>
          <form onSubmit={handleChangePassword} className="profile-form profile-password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required autoComplete="current-password" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required minLength={6} autoComplete="new-password" />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required minLength={6} autoComplete="new-password" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
