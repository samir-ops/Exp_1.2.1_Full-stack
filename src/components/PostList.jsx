import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllPosts, deletePost, addPost, resetPostsDatabase } from '../store/postsSlice';
import { Search, Calendar, Edit2, Trash2, Copy, Layers, Database } from 'lucide-react';

function PostList({ onEdit, onCreateNew, showToast }) {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const postsStatus = useSelector((state) => state.posts.status);
  const postsError = useSelector((state) => state.posts.error);

  const [filters, setFilters] = useState({ search: '', platform: 'all', category: 'all', status: 'all', sortBy: 'updatedAt' });

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusClass = (value) => ({ Draft: 'tag-status-draft', Scheduled: 'tag-status-scheduled', Published: 'tag-status-published' }[value] || '');

  const updateFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const handleDelete = (id) => {
    dispatch(deletePost(id)).unwrap().then(() => showToast('Post deleted successfully.', 'success')).catch((err) => showToast(err, 'error'));
  };

  const handleDuplicate = (post) => {
    dispatch(addPost({ title: `Copy of ${post.title}`, content: post.content, category: post.category, status: post.status, scheduledDate: post.scheduledDate, platforms: post.platforms })).unwrap().then(() => showToast('Post duplicated successfully.', 'success')).catch((err) => showToast(err, 'error'));
  };

  const handleResetDefaults = () => {
    dispatch(resetPostsDatabase()).unwrap().then(() => showToast('Database reset to defaults.', 'success')).catch((err) => showToast(err, 'error'));
  };

  const filteredPosts = posts
    .filter((post) => {
      const searchText = filters.search.toLowerCase().trim();
      const matchSearch = !searchText || post.title.toLowerCase().includes(searchText) || post.content.toLowerCase().includes(searchText);
      const matchPlatform = filters.platform === 'all' || (post.platforms || []).includes(filters.platform);
      const matchCategory = filters.category === 'all' || post.category === filters.category;
      const matchStatus = filters.status === 'all' || post.status === filters.status;
      return matchSearch && matchPlatform && matchCategory && matchStatus;
    })
    .sort((a, b) => (filters.sortBy === 'title' ? a.title.localeCompare(b.title) : new Date(b.updatedAt) - new Date(a.updatedAt)));

  return (
    <div className="glass-panel" style={{ height: '100%' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <Layers size={20} style={{ color: 'var(--color-primary)' }} /> Normalized Posts Board
        </h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn-secondary" onClick={handleResetDefaults} title="Reset database to default seed posts" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} disabled={postsStatus === 'loading'}>
            <Database size={14} /> Reset Data
          </button>
          <button className="btn-primary" onClick={onCreateNew} disabled={postsStatus === 'loading'}>+ Create Post</button>
        </div>
      </div>

      <div className="filter-bar">
        <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" className="search-input" placeholder="Search by title/content..." value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} style={{ paddingLeft: '2.25rem' }} />
        </div>

        <select className="select-filter" value={filters.platform} onChange={(e) => updateFilter('platform', e.target.value)}>
          <option value="all">All Channels</option>
          <option value="x">X / Twitter</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
        </select>

        <select className="select-filter" value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Engineering">Engineering</option>
          <option value="Marketing">Marketing</option>
          <option value="Design">Design</option>
          <option value="Content">Content</option>
          <option value="Other">Other</option>
        </select>

        <select className="select-filter" value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="Draft">Draft</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Published">Published</option>
        </select>

        <select className="select-filter" value={filters.sortBy} onChange={(e) => updateFilter('sortBy', e.target.value)}>
          <option value="updatedAt">Sort: Last Updated</option>
          <option value="title">Sort: Title A-Z</option>
        </select>
      </div>

      {postsStatus === 'failed' && (
        <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid var(--color-error)', borderRadius: 'var(--radius-sm)', color: 'var(--color-error)', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
          <strong>Error:</strong> {postsError || 'Unable to communicate with the store backend.'}
        </div>
      )}

      <div className="post-list-container">
        {postsStatus === 'loading' && posts.length === 0 ? (
          <>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
            <div className="skeleton-card"></div>
          </>
        ) : filteredPosts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', border: '1px dashed var(--border-light)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.01)' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>No posts found. Change your filter query or compose a new post.</p>
            <button className="btn-secondary" style={{ margin: '0 auto' }} onClick={() => setFilters({ search: '', platform: 'all', category: 'all', status: 'all', sortBy: 'updatedAt' })}>Clear All Filters</button>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-card-header">
                <div>
                  <h4 className="post-card-title">{post.title}</h4>
                  <div className="post-meta-row">
                    <span className="post-tag">{post.category}</span>
                    <span className={`post-tag ${getStatusClass(post.status)}`}>{post.status}</span>
                    <div className="platform-icons-row">
                      {(post.platforms || []).map((platform) => (
                        <div key={platform} className={`platform-indicator ${platform}`} title={`Target channel: ${platform.toUpperCase()}`}>
                          {platform.substring(0, 1).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="post-actions">
                  <button className="btn-secondary" style={{ padding: '0.4rem', border: 'none' }} onClick={() => handleDuplicate(post)} title="Duplicate Post"><Copy size={14} /></button>
                  <button className="btn-secondary" style={{ padding: '0.4rem', border: 'none' }} onClick={() => onEdit(post)} title="Edit Post"><Edit2 size={14} /></button>
                  <button className="btn-danger" style={{ padding: '0.4rem', border: 'none' }} onClick={() => handleDelete(post.id)} title="Delete Post"><Trash2 size={14} /></button>
                </div>
              </div>

              <p className="post-card-body">{post.content}</p>

              <div className="post-card-footer">
                <span>Updated: {formatTime(post.updatedAt)}</span>
                {post.scheduledDate && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#c084fc', fontWeight: '500' }}>
                    <Calendar size={12} /> Scheduled: {post.scheduledDate}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostList;
