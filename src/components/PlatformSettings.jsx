import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllPlatforms, togglePlatformActiveState, updatePlatformCharacterLimit } from '../store/platformsSlice';
import { Settings, Check, HelpCircle } from 'lucide-react';

function PlatformSettings({ showToast }) {
  const dispatch = useDispatch();
  const platforms = useSelector(selectAllPlatforms);

  const handleToggleActive = (id, name) => {
    const platform = platforms.find((item) => item.id === id);
    dispatch(togglePlatformActiveState(id));
    showToast(`${name} channel ${platform.active ? 'disabled' : 'enabled'}.`, 'success');
  };

  const handleLimitChange = (id, value) => {
    dispatch(updatePlatformCharacterLimit({ id, charLimit: value }));
  };

  return (
    <div className="glass-panel" style={{ minHeight: '500px' }}>
      <div className="panel-header">
        <h2 className="panel-title">
          <Settings size={20} style={{ color: 'var(--color-primary)' }} /> Redux Platform Configurator
        </h2>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        This panel updates the Redux platform slice, and the composer reads those values immediately.
      </p>

      <div className="platform-settings-grid">
        {platforms.map((platform) => (
          <div key={platform.id} className="platform-setting-card" style={{ opacity: platform.active ? 1 : 0.65 }}>
            <div className="card-header-row">
              <span style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{platform.name}</span>
              <label className="switch-control" title={`Toggle status for ${platform.name}`}>
                <input type="checkbox" checked={platform.active} onChange={() => handleToggleActive(platform.id, platform.name)} />
                <span className="switch-slider"></span>
              </label>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                <span style={{ color: 'var(--text-secondary)' }}>Character Limit</span>
                <span style={{ color: platform.active ? '#c084fc' : 'var(--text-muted)' }}>{platform.charLimit} chars</span>
              </div>
              <input type="range" min="50" max="5000" step="50" value={platform.charLimit} onChange={(e) => handleLimitChange(platform.id, e.target.value)} disabled={!platform.active} style={{ width: '100%', accentColor: 'var(--color-primary)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              <Check size={10} style={{ color: platform.active ? 'var(--color-success)' : 'var(--text-muted)' }} />
              <span>{platform.active ? 'Accepting composals' : 'Inactive state'}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'rgba(139, 92, 246, 0.03)', border: '1px solid rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'start' }}>
        <HelpCircle size={16} style={{ color: 'var(--color-primary)', marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          <strong>Tip:</strong> Toggle channels and watch the live Redux state update on the right.
        </div>
      </div>
    </div>
  );
}

export default PlatformSettings;
