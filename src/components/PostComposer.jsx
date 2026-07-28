import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addPost, updatePost } from '../store/postsSlice';
import { selectPlatformEntities, selectSelectedPlatforms, toggleSelectedPlatform } from '../store/platformsSlice';
import { Save, RefreshCw, X, AlertCircle } from 'lucide-react';

const CATEGORIES = ['Engineering', 'Marketing', 'Design', 'Content', 'Other'];

function PostComposer({ editingPost, close }) {
  const dispatch = useDispatch();
  const platformEntities = useSelector(selectPlatformEntities);
  const selectedPlatforms = useSelector(selectSelectedPlatforms);
  const postsStatus = useSelector((state) => state.posts.status);

  const [form, setForm] = useState({ title: '', content: '', category: 'Engineering', status: 'Draft', scheduledDate: '' });
  const [errors, setErrors] = useState({});
  const isSaving = postsStatus === 'loading';

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];

    if (editingPost) {
      setForm({
        title: editingPost.title || '',
        content: editingPost.content || '',
        category: editingPost.category || 'Engineering',
        status: editingPost.status || 'Draft',
        scheduledDate: editingPost.scheduledDate || ''
      });
      editingPost.platforms?.forEach((id) => {
        if (!selectedPlatforms.includes(id)) dispatch(toggleSelectedPlatform(id));
      });
    } else {
      setForm({ title: '', content: '', category: 'Engineering', status: 'Draft', scheduledDate: defaultDate });
    }
    setErrors({});
  }, [editingPost, dispatch]);

  const updateField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (!form.content.trim()) nextErrors.content = 'Post content cannot be empty.';

    const activePlatforms = selectedPlatforms.filter((id) => platformEntities[id]?.active);
    if (activePlatforms.length === 0) nextErrors.platforms = 'Select at least one active channel.';

    activePlatforms.forEach((id) => {
      const platform = platformEntities[id];
      if (platform && form.content.length > platform.charLimit) {
        nextErrors[id] = `${platform.name} limit exceeded (${form.content.length}/${platform.charLimit}).`;
      }
    });

    if (form.status === 'Scheduled' && !form.scheduledDate) nextErrors.scheduledDate = 'Scheduled date is required.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      scheduledDate: form.status === 'Scheduled' ? form.scheduledDate : '',
      platforms: selectedPlatforms.filter((id) => platformEntities[id]?.active)
    };

    const action = editingPost ? updatePost({ ...payload, id: editingPost.id }) : addPost(payload);
    dispatch(action).unwrap().then(() => close());
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editingPost ? 'Edit Normalized Post' : 'Compose Normalized Post'}</h2>
          <button type="button" onClick={close} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="composer-form">
          <div className="form-group">
            <label htmlFor="post-title">Post Title</label>
            <input id="post-title" type="text" className="form-control" placeholder="e.g. Redux Toolkit Architecture Guide" value={form.title} onChange={(e) => updateField('title', e.target.value)} disabled={isSaving} />
            {errors.title && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.title}</div>}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <label htmlFor="post-content" style={{ margin: 0 }}>Content Body</label>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{form.content.length} chars</span>
            </div>
            <textarea id="post-content" className="form-control" rows={4} placeholder="Compose your post text..." value={form.content} onChange={(e) => updateField('content', e.target.value)} disabled={isSaving} style={{ resize: 'vertical', minHeight: '80px' }} />
            {errors.content && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.content}</div>}
          </div>

          <div className="form-group">
            <label>Social Publishing Channels</label>
            <div className="form-platforms">
              {Object.values(platformEntities).map((platform) => {
                const active = selectedPlatforms.includes(platform.id);
                const className = active && platform.active ? `platform-checkbox active-${platform.id === 'x' ? 'x' : platform.id === 'facebook' ? 'fb' : platform.id === 'instagram' ? 'ig' : 'li'}` : 'platform-checkbox';
                const limitExceeded = form.content.length > platform.charLimit;
                return (
                  <button
                    key={platform.id}
                    type="button"
                    className={className}
                    onClick={() => dispatch(toggleSelectedPlatform(platform.id))}
                    disabled={!platform.active || isSaving}
                    style={{ borderStyle: limitExceeded && active ? 'dashed' : 'solid', borderColor: limitExceeded && active ? 'var(--color-error)' : undefined }}
                  >
                    <span>{platform.name}</span>
                    <span style={{ fontSize: '0.7rem', color: limitExceeded && active ? 'var(--color-error)' : 'var(--text-muted)' }}>({platform.charLimit})</span>
                  </button>
                );
              })}
            </div>
            {errors.platforms && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '6px' }}>{errors.platforms}</div>}
            {Object.values(platformEntities).map((platform) => (
              selectedPlatforms.includes(platform.id) && platform.active && form.content.length > platform.charLimit ? (
                <div key={platform.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--color-error)', fontSize: '0.75rem', marginTop: '4px' }}>
                  <AlertCircle size={12} />
                  <span>{platform.name} limit exceeded ({form.content.length}/{platform.charLimit} max).</span>
                </div>
              ) : null
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-group">
            <div>
              <label htmlFor="post-category">Category</label>
              <select id="post-category" className="form-control select-filter" style={{ width: '100%', padding: '0.55rem 0.75rem' }} value={form.category} onChange={(e) => updateField('category', e.target.value)} disabled={isSaving}>
                {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="post-status">Status</label>
              <select id="post-status" className="form-control select-filter" style={{ width: '100%', padding: '0.55rem 0.75rem' }} value={form.status} onChange={(e) => updateField('status', e.target.value)} disabled={isSaving}>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          {form.status === 'Scheduled' && (
            <div className="form-group">
              <label htmlFor="post-schedule">Scheduled Publish Date</label>
              <input id="post-schedule" type="date" className="form-control" value={form.scheduledDate} onChange={(e) => updateField('scheduledDate', e.target.value)} disabled={isSaving} />
              {errors.scheduledDate && <div style={{ color: 'var(--color-error)', fontSize: '0.8rem', marginTop: '4px' }}>{errors.scheduledDate}</div>}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={close} disabled={isSaving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? <><RefreshCw className="status-icon" style={{ animation: 'spin 1.5s linear infinite' }} size={16} /> Saving...</> : <><Save size={16} /> Save Post</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostComposer;
