import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageCircle, Send, Bookmark, Share2, 
  MessageSquare, Globe, Heart as FBHeart, ThumbsUp, MoreHorizontal, Check
} from 'lucide-react';

function PlatformPreview({ content, mediaFiles, selectedPlatforms, hashtags }) {
  const [activeTab, setActiveTab] = useState('');

  // Auto-sync active tab when selected platforms change
  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      if (!selectedPlatforms.includes(activeTab)) {
        setActiveTab(selectedPlatforms[0]);
      }
    } else {
      setActiveTab('');
    }
  }, [selectedPlatforms, activeTab]);

  if (selectedPlatforms.length === 0 || !activeTab) {
    return (
      <div className="glass-panel fade-in" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          <Share2 size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto 1rem auto' }} />
          <h3>Live Mockup Preview</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Select a platform above to view live mockup previews.</p>
        </div>
      </div>
    );
  }

  // Parse text content to highlight hashtags, mentions, and links
  const renderFormattedText = (text) => {
    if (!text) return null;
    const tokens = text.split(/(\s+)/);
    return tokens.map((token, idx) => {
      if (token.startsWith('#')) {
        return <span key={idx} className="hashtag" style={{ color: 'inherit', fontWeight: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}>{token}</span>;
      }
      if (token.startsWith('@')) {
        return <span key={idx} className="mention" style={{ color: activeTab === 'x' ? 'var(--brand-x)' : 'var(--color-primary-hover)', cursor: 'pointer' }}>{token}</span>;
      }
      if (token.startsWith('http://') || token.startsWith('https://')) {
        return <span key={idx} className="mention" style={{ textDecoration: 'underline', color: 'var(--brand-linkedin)', cursor: 'pointer' }}>{token}</span>;
      }
      return token;
    });
  };

  return (
    <div className="glass-panel fade-in">
      <h2 className="panel-title">
        <span>Live Feed Preview</span>
      </h2>

      {/* Tabs list matching selected networks */}
      <div className="preview-tabs">
        {selectedPlatforms.map((platformId) => {
          let tabLabel = platformId.toUpperCase();
          if (platformId === 'x') tabLabel = 'X (Twitter)';
          if (platformId === 'facebook') tabLabel = 'Facebook';
          if (platformId === 'instagram') tabLabel = 'Instagram';
          if (platformId === 'linkedin') tabLabel = 'LinkedIn';

          return (
            <button
              key={platformId}
              onClick={() => setActiveTab(platformId)}
              className={`preview-tab-btn ${activeTab === platformId ? 'active' : ''} ${platformId}-theme`}
            >
              {tabLabel}
            </button>
          );
        })}
      </div>

      {/* Live Mockup Feed Viewport */}
      <div className="mockup-viewport">
        <div className="mockup-header-bar">
          <span>{activeTab.toUpperCase()} POST SIMULATION</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></span>
          </div>
        </div>

        <div className="mockup-content-body">
          {activeTab === 'x' && (
            <div className="mockup-x">
              <div className="x-post-header">
                <div className="x-avatar">
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>OP</div>
                </div>
                <div className="x-user-info">
                  <span className="x-name">
                    Omni Creator
                    <span style={{ background: 'var(--brand-x)', color: '#fff', borderRadius: '50%', width: '12px', height: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', marginLeft: '2px' }}>✓</span>
                  </span>
                  <span className="x-handle">@omni_hub · Just now</span>
                </div>
              </div>

              <div className="x-post-text">
                {renderFormattedText(content) || <span style={{ color: '#71767b', fontStyle: 'italic' }}>Compose content to preview...</span>}
              </div>

              {mediaFiles.length > 0 && (
                <div className="x-media-grid">
                  <MediaCollage media={mediaFiles} maxItems={4} />
                </div>
              )}

              <div className="x-actions-row">
                <span style={{ display: 'inline-flex', gap: '4px', fontSize: '12px' }}><MessageCircle size={14} /> 0</span>
                <span style={{ display: 'inline-flex', gap: '4px', fontSize: '12px' }}><Share2 size={14} /> 0</span>
                <span style={{ display: 'inline-flex', gap: '4px', fontSize: '12px', color: '#f91880' }}><Heart size={14} /> 0</span>
                <span style={{ display: 'inline-flex', gap: '4px', fontSize: '12px' }}><Bookmark size={14} /></span>
              </div>
            </div>
          )}

          {activeTab === 'facebook' && (
            <div className="mockup-fb">
              <div className="fb-header">
                <div className="fb-avatar">
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #1877f2, #3b82f6)', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff', fontWeight: 'bold' }}>OP</div>
                </div>
                <div className="fb-user-details">
                  <span className="fb-name">Omni Creator</span>
                  <div className="fb-time-privacy">
                    <span>Just now</span>
                    <span>·</span>
                    <Globe size={11} />
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', color: '#b0b3b8' }}>
                  <MoreHorizontal size={16} />
                </div>
              </div>

              <div className="fb-post-text">
                {renderFormattedText(content) || <span style={{ color: '#8a8d91', fontStyle: 'italic' }}>Compose content to preview...</span>}
              </div>

              {mediaFiles.length > 0 && (
                <div className="fb-media-grid">
                  <MediaCollage media={mediaFiles} maxItems={5} />
                </div>
              )}

              <div className="fb-actions-bar">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><ThumbsUp size={16} /> Like</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><MessageSquare size={16} /> Comment</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Share2 size={16} /> Share</span>
              </div>
            </div>
          )}

          {activeTab === 'instagram' && (
            <div className="mockup-ig">
              <div className="ig-header">
                <div className="ig-avatar">
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743)', padding: '1px' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#000', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: 'bold' }}>OP</div>
                  </div>
                </div>
                <span className="ig-username">omni_creator</span>
                <div style={{ marginLeft: 'auto' }}>
                  <MoreHorizontal size={14} />
                </div>
              </div>

              <div className="ig-viewport">
                {mediaFiles.length > 0 ? (
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {mediaFiles[0].type === 'image' ? (
                      <img src={mediaFiles[0].url} alt="IG Post" className="ig-media-image" />
                    ) : (
                      <video src={mediaFiles[0].url} className="ig-media-image" controls muted />
                    )}
                    {mediaFiles.length > 1 && (
                      <div className="ig-carousel-dots">
                        {mediaFiles.slice(0, 5).map((_, idx) => (
                          <div key={idx} className={`ig-carousel-dot ${idx === 0 ? 'active' : ''}`}></div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="ig-placeholder-msg">
                    <p style={{ color: 'var(--color-error)', fontWeight: 600, marginBottom: '0.5rem' }}>Media Required</p>
                    <p style={{ fontSize: '0.8rem' }}>Instagram requires at least 1 image or video file to publish.</p>
                  </div>
                )}
              </div>

              <div className="ig-action-bar">
                <div style={{ display: 'flex', gap: '10px' }}>
                  <Heart size={18} />
                  <MessageCircle size={18} />
                  <Send size={18} />
                </div>
                <Bookmark size={18} style={{ marginLeft: 'auto' }} />
              </div>

              <div className="ig-likes-label">0 likes</div>

              <div className="ig-caption-block">
                <span className="ig-caption-username">omni_creator</span>
                <span className="ig-caption-text">
                  {renderFormattedText(content) || <span style={{ color: '#8e8e8e', fontStyle: 'italic' }}>Compose content...</span>}
                </span>
              </div>
            </div>
          )}

          {activeTab === 'linkedin' && (
            <div className="mockup-li">
              <div className="li-header">
                <div className="li-avatar">
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#475569', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#fff', fontWeight: 'bold' }}>OP</div>
                </div>
                <div className="li-user-details">
                  <span className="li-name">Omni Creator</span>
                  <span className="li-headline">Digital Content Strategy Lead</span>
                  <div className="li-time-status">
                    <span>Just now · 🌐</span>
                  </div>
                </div>
              </div>

              <div className="li-post-text">
                {renderFormattedText(content) || <span style={{ color: '#8b8b8b', fontStyle: 'italic' }}>Compose content to preview...</span>}
              </div>

              {mediaFiles.length > 0 && (
                <div className="li-media-box">
                  <MediaCollage media={mediaFiles} maxItems={1} />
                </div>
              )}

              <div className="li-actions-row">
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><ThumbsUp size={16} /> Like</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><MessageSquare size={16} /> Comment</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Share2 size={16} /> Share</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Subcomponent to render dynamic media collage grid matching layout specifications
function MediaCollage({ media, maxItems = 4 }) {
  const displayItems = media.slice(0, maxItems);
  const remainingCount = media.length - maxItems;

  let gridTemplate = '1fr';
  if (displayItems.length === 2) gridTemplate = '1fr 1fr';
  if (displayItems.length === 3) gridTemplate = '2fr 1fr';
  if (displayItems.length >= 4) gridTemplate = '1fr 1fr';

  return (
    <div 
      className="media-collage" 
      style={{ 
        gridTemplateColumns: gridTemplate,
        maxHeight: '320px',
      }}
    >
      {/* 2-column or multi-grid layout */}
      {displayItems.length === 3 ? (
        <>
          <div style={{ gridRow: 'span 2', overflow: 'hidden' }}>
            <CollageMediaElement item={displayItems[0]} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <CollageMediaElement item={displayItems[1]} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <CollageMediaElement item={displayItems[2]} />
          </div>
        </>
      ) : (
        displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1 && remainingCount > 0;
          return (
            <div key={item.id} style={{ position: 'relative', overflow: 'hidden' }}>
              <CollageMediaElement item={item} />
              {isLast && (
                <div className="collage-overlay">
                  +{remainingCount}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function CollageMediaElement({ item }) {
  if (item.type === 'image') {
    return <img src={item.url} className="collage-item" alt="Collage thumb" />;
  } else {
    return (
      <div style={{ width: '100%', height: '100%', background: '#000' }}>
        <video src={item.url} className="collage-item" muted autoPlay loop playsInline />
      </div>
    );
  }
}

export default PlatformPreview;
