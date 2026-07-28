import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { registerActionListener } from '../store';
import { Terminal, Database, Clock, RefreshCw } from 'lucide-react';

function ReduxInspector() {
  const [activeTab, setActiveTab] = useState('state'); // 'state' | 'actions'
  const [actions, setActions] = useState([]);
  const [selectedActionId, setSelectedActionId] = useState(null);

  // Get live current state of the store
  const currentState = useSelector((state) => state);

  // Register listener for dispatched actions
  useEffect(() => {
    registerActionListener((history) => {
      setActions(history);
    });
    return () => registerActionListener(null);
  }, []);

  // Syntax highlighting converter for JSON
  const syntaxHighlight = (jsonObj) => {
    let json = JSON.stringify(jsonObj, null, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'json-number';
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'json-key';
          } else {
            cls = 'json-string';
          }
        } else if (/true|false/.test(match)) {
          cls = 'json-boolean';
        } else if (/null/.test(match)) {
          cls = 'json-null';
        }
        return `<span class="${cls}">${match}</span>`;
      }
    );
  };

  // Find selected snapshot
  const getInspectedState = () => {
    if (selectedActionId) {
      const act = actions.find(a => a.id === selectedActionId);
      if (act) return act.stateSnapshot;
    }
    return currentState;
  };

  return (
    <div className="redux-inspector glass-panel">
      <div className="panel-header" style={{ marginBottom: '0.75rem', paddingBottom: '0.5rem' }}>
        <h3 className="panel-title">
          <Terminal size={18} style={{ color: '#c084fc' }} />
          Redux State Store
        </h3>
        {selectedActionId && (
          <button 
            className="btn-secondary" 
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '3px' }}
            onClick={() => setSelectedActionId(null)}
          >
            <RefreshCw size={10} />
            Go to Live State
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="inspector-tabs">
        <button
          className={`inspector-tab-btn ${activeTab === 'state' ? 'active' : ''}`}
          onClick={() => setActiveTab('state')}
        >
          <Database size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Normalized Schema Tree
        </button>
        <button
          className={`inspector-tab-btn ${activeTab === 'actions' ? 'active' : ''}`}
          onClick={() => setActiveTab('actions')}
        >
          <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
          Dispatched Action Log ({actions.length})
        </button>
      </div>

      {/* Tab 1: State tree view */}
      {activeTab === 'state' && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontStyle: 'italic' }}>
            {selectedActionId ? (
              <span style={{ color: 'var(--color-warning)' }}>
                Viewing state snapshot immediately after action dispatch.
              </span>
            ) : (
              'Viewing active real-time normalized state tree.'
            )}
          </div>
          <pre
            className="json-pre-box"
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(getInspectedState()) }}
          />
        </div>
      )}

      {/* Tab 2: Action list view */}
      {activeTab === 'actions' && (
        <div className="action-log-list">
          {actions.length === 0 ? (
            <p style={{ fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', margin: '2rem 0' }}>
              No actions dispatched yet. Try writing content or toggling platforms to trigger actions.
            </p>
          ) : (
            [...actions].reverse().map((act) => (
              <div
                key={act.id}
                className={`action-log-item ${selectedActionId === act.id ? 'active' : ''}`}
                onClick={() => setSelectedActionId(act.id)}
              >
                <div className="action-name-row">
                  <span style={{ color: act.isThunkMeta ? 'var(--text-muted)' : '#c084fc' }}>
                    {act.type}
                  </span>
                  <span>{act.timestamp}</span>
                </div>
                {act.payload && (
                  <div className="action-meta">
                    <strong>Payload:</strong> {JSON.stringify(act.payload)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        Note: Posts are stored in normalized maps `ids` and `entities`.
      </div>
    </div>
  );
}

export default ReduxInspector;
