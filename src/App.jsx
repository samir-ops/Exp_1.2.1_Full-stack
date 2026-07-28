import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from './store/postsSlice';
import { setDbConfig } from './utils/mockDb';
import PostList from './components/PostList';
import PostComposer from './components/PostComposer';
import PlatformSettings from './components/PlatformSettings';
import ReduxInspector from './components/ReduxInspector';
import { Sparkles, Layers, Settings, Wifi, WifiOff } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const postsStatus = useSelector((state) => state.posts.status);

  const [tab, setTab] = useState('posts');
  const [modal, setModal] = useState({ open: false, post: null });
  const [latency, setLatency] = useState(600);
  const [errorRate, setErrorRate] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [online, setOnline] = useState(true);

  const showToast = (message, type = 'success') => {
    const id = Math.random().toString(36).slice(2, 8);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3000);
  };

  useEffect(() => {
    dispatch(fetchPosts()).unwrap().catch((err) => {
      const message = err instanceof Error ? err.message : 'Unknown error';
      showToast(message, 'error');
      setOnline(false);
    });
  }, [dispatch]);

  useEffect(() => {
    setDbConfig(latency, errorRate);
  }, [latency, errorRate]);

  useEffect(() => {
    setOnline(postsStatus !== 'failed');
  }, [postsStatus]);

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="brand-wrapper">
          <h1 className="app-title">
            ReduxFlow <Sparkles className="status-icon" style={{ display: 'inline', color: '#c084fc' }} />
          </h1>
          <p className="app-subtitle">Centralized Global State & Normalization Manager. Powered by Redux Toolkit.</p>
        </div>

        <div className="api-settings-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginRight: '0.5rem' }}>
            {online ? <Wifi size={14} style={{ color: 'var(--color-success)' }} /> : <WifiOff size={14} style={{ color: 'var(--color-error)' }} />}
            <span style={{ fontWeight: 600, color: online ? 'var(--color-success)' : 'var(--color-error)' }}>
              {online ? 'Store Synced' : 'Sync Error'}
            </span>
          </div>

          <div className="settings-group">
            <label htmlFor="latency-control">API Latency:</label>
            <input id="latency-control" type="range" min="0" max="3000" step="100" value={latency} onChange={(e) => setLatency(Number(e.target.value))} />
            <span style={{ minWidth: '45px', textAlign: 'right' }}>{latency}ms</span>
          </div>

          <div className="settings-group">
            <label htmlFor="error-control">Error Rate:</label>
            <input id="error-control" type="range" min="0" max="90" step="10" value={errorRate} onChange={(e) => setErrorRate(Number(e.target.value))} />
            <span style={{ minWidth: '30px', textAlign: 'right' }}>{errorRate}%</span>
          </div>
        </div>
      </header>

      <nav className="nav-tabs">
        <button className={`nav-tab-btn ${tab === 'posts' ? 'active' : ''}`} onClick={() => setTab('posts')}>
          <Layers size={16} /> Posts Board
        </button>
        <button className={`nav-tab-btn ${tab === 'platforms' ? 'active' : ''}`} onClick={() => setTab('platforms')}>
          <Settings size={16} /> Platform Configurator
        </button>
      </nav>

      <div className="dashboard-grid">
        <main>
          {tab === 'posts' ? (
            <PostList onEdit={(post) => setModal({ open: true, post })} onCreateNew={() => setModal({ open: true, post: null })} showToast={showToast} />
          ) : (
            <PlatformSettings showToast={showToast} />
          )}
        </main>

        <aside>
          <ReduxInspector />
        </aside>
      </div>

      {modal.open && <PostComposer editingPost={modal.post} close={() => setModal({ open: false, post: null })} />}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.type}`}>
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
