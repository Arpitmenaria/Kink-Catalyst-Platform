import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateProfile, updateEducation } from '../../store/slices/profileSlice';
import { consumeJustSelectedPlan } from '../../store/slices/plansSlice';
import { showToast } from '../../store/slices/toastSlice';
import { CustomDatePicker } from './DateTimePicker';
import './ProfilePage.css';
import './OnboardingForm.css';

// Latest allowed DOB = today − 18 years (must be 18+, no future dates).
const MAX_DOB = (() => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 18);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

const Chevron = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
);
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" y1="11" x2="10" y2="17" /><line x1="14" y1="11" x2="14" y2="17" /></svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
);

function newEdu() {
  return { id: `new_${Date.now()}`, school: '', degree: '', years: '', type: 'University' };
}

const Req = () => <span className="ob-req">*</span>;

export default function OnboardingForm() {
  const dispatch = useDispatch();
  const { profile } = useSelector(s => s.profile);
  const { user: authUser } = useSelector(s => s.auth);

  const [bio,    setBio]    = useState('');
  const [form,   setForm]   = useState({ name: '', dob: '', gender: '', status: '', location: '', phone: '', website: '' });
  const [edu,    setEdu]    = useState([]);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const email = profile?.email ?? authUser?.email ?? '';

  useEffect(() => { dispatch(fetchUserProfile()); }, [dispatch]);

  // Seed any fields the user already has (e.g. name from signup).
  useEffect(() => {
    if (!profile) return;
    setBio(profile.bio ?? '');
    setForm({
      name:     profile.fullName ?? authUser?.fullName ?? '',
      dob:      profile.dateOfBirth ? String(profile.dateOfBirth).slice(0, 10) : '',
      gender:   profile.gender ?? '',
      status:   profile.relationshipStatus ?? '',
      location: profile.location ?? '',
      phone:    profile.phone ?? '',
      website:  profile.website ?? '',
    });
    if (Array.isArray(profile.education) && profile.education.length) {
      setEdu(profile.education.map(e => ({ id: e._id ?? e.id ?? `e_${Math.random()}`, school: e.school ?? '', degree: e.degree ?? '', years: e.years ?? '', type: e.type ?? 'University' })));
    }
  }, [profile, authUser]);

  const setField = (k, v) => { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: false })); };

  async function handleSave() {
    const errs = {};
    if (!form.name.trim())     errs.name = true;
    if (!form.gender)          errs.gender = true;
    if (!form.location.trim()) errs.location = true;
    if (Object.keys(errs).length) {
      setErrors(errs);
      dispatch(showToast({ message: 'Please fill in the required fields (marked *).', type: 'error' }));
      return;
    }

    setSaving(true);
    try {
      const res = await dispatch(updateProfile({
        bio,
        fullName:           form.name.trim(),
        dateOfBirth:        form.dob || undefined,
        gender:             form.gender,
        relationshipStatus: form.status,
        location:           form.location.trim(),
        phone:              form.phone,
        website:            form.website,
      }));
      // Don't advance to the feed if the save failed (toastSlice shows the error).
      if (updateProfile.rejected.match(res)) return;
      const cleanEdu = edu.filter(e => e.school.trim() || e.degree.trim());
      if (cleanEdu.length) await dispatch(updateEducation(cleanEdu));
      dispatch(consumeJustSelectedPlan()); // → App renders HomePage (feed)
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="ob-page">
      <div className="ob-card">
        <div className="ob-header">
          <h1 className="ob-title">Complete your profile</h1>
          <p className="ob-subtitle">Tell us a bit about yourself to get started.</p>
        </div>

        {/* Overview */}
        <section className="ob-section">
          <h2 className="ob-section-title">Overview</h2>
          <textarea
            className="about-bio-textarea"
            placeholder="Write a short bio about yourself"
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
          />
        </section>

        {/* Personal Information */}
        <section className="ob-section">
          <h2 className="ob-section-title">Personal Information</h2>
          <div className="ob-grid">
            <div className="ob-field">
              <label className="ob-label">Full Name <Req /></label>
              <input
                className={`about-info-row-input${errors.name ? ' ob-input--error' : ''}`}
                value={form.name}
                placeholder="Your full name"
                onChange={e => setField('name', e.target.value)}
              />
            </div>

            <div className="ob-field">
              <label className="ob-label">Date of Birth</label>
              <CustomDatePicker
                value={form.dob}
                onChange={e => setField('dob', e.target.value)}
                placeholder="Select date of birth"
                max={MAX_DOB}
              />
            </div>

            <div className="ob-field">
              <label className="ob-label">Gender <Req /></label>
              <div className={`about-select-wrap${errors.gender ? ' ob-input--error' : ''}`}>
                <select className="about-select" value={form.gender} onChange={e => setField('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <Chevron />
              </div>
            </div>

            <div className="ob-field">
              <label className="ob-label">Relationship Status</label>
              <div className="about-select-wrap">
                <select className="about-select" value={form.status} onChange={e => setField('status', e.target.value)}>
                  <option value="">Select status</option>
                  <option value="Single">Single</option>
                  <option value="In a relationship">In a relationship</option>
                  <option value="Married">Married</option>
                  <option value="It's complicated">It&apos;s complicated</option>
                </select>
                <Chevron />
              </div>
            </div>

            <div className="ob-field">
              <label className="ob-label">Location <Req /></label>
              <input
                className={`about-info-row-input${errors.location ? ' ob-input--error' : ''}`}
                value={form.location}
                placeholder="City, Country"
                onChange={e => setField('location', e.target.value)}
              />
            </div>

            <div className="ob-field">
              <label className="ob-label">Email</label>
              <input className="about-info-row-input" value={email} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }} />
            </div>

            <div className="ob-field">
              <label className="ob-label">Phone</label>
              <input className="about-info-row-input" value={form.phone} placeholder="Phone number" onChange={e => setField('phone', e.target.value)} />
            </div>

            <div className="ob-field">
              <label className="ob-label">Website</label>
              <input className="about-info-row-input" value={form.website} placeholder="https://" onChange={e => setField('website', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="ob-section">
          <h2 className="ob-section-title">Education</h2>
          <div className="about-edu-edit-list">
            {edu.map((item, idx) => (
              <div key={item.id ?? idx} className="about-edu-edit-card">
                <div className="about-edu-edit-card-header">
                  <span className="about-edu-edit-card-num">Education {idx + 1}</span>
                  <button className="about-edu-remove-btn" type="button" title="Remove" onClick={() => setEdu(d => d.filter((_, i) => i !== idx))}><TrashIcon /></button>
                </div>
                <div className="about-edu-edit-grid">
                  <div className="about-edu-edit-field">
                    <label className="about-edu-edit-label">School / University</label>
                    <input className="about-edu-edit-input" value={item.school} placeholder="e.g. Massachusetts Institute of Technology" onChange={e => setEdu(d => d.map((x, i) => i === idx ? { ...x, school: e.target.value } : x))} />
                  </div>
                  <div className="about-edu-edit-field">
                    <label className="about-edu-edit-label">Type</label>
                    <div className="about-select-wrap">
                      <select className="about-select" value={item.type} onChange={e => setEdu(d => d.map((x, i) => i === idx ? { ...x, type: e.target.value } : x))}>
                        <option value="University">University</option>
                        <option value="High School">High School</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Online Course">Online Course</option>
                        <option value="Bootcamp">Bootcamp</option>
                      </select>
                      <Chevron />
                    </div>
                  </div>
                  <div className="about-edu-edit-field">
                    <label className="about-edu-edit-label">Degree / Certificate</label>
                    <input className="about-edu-edit-input" value={item.degree} placeholder="e.g. B.Sc Computer Science" onChange={e => setEdu(d => d.map((x, i) => i === idx ? { ...x, degree: e.target.value } : x))} />
                  </div>
                  <div className="about-edu-edit-field">
                    <label className="about-edu-edit-label">Years</label>
                    <input className="about-edu-edit-input" value={item.years} placeholder="e.g. 2018 – 2022" onChange={e => setEdu(d => d.map((x, i) => i === idx ? { ...x, years: e.target.value } : x))} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="ob-add-edu" onClick={() => setEdu(d => [...d, newEdu()])}>
              <PlusIcon /> Add Education
            </button>
          </div>
        </section>

        <div className="ob-footer">
          <button className="ob-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save & Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}
