import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';
import { PLATFORMS } from '../App';

function ValidationSummary({ reports, selectedPlatforms, hasInput }) {
  if (selectedPlatforms.length === 0) {
    return (
      <div className="validation-panel fade-in" style={{ borderColor: 'var(--color-error)' }}>
        <div className="validation-item error">
          <XCircle size={16} className="status-icon" />
          <span>Please select at least one social media platform.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="validation-panel fade-in">
      <div className="validation-header">
        <span>Channel Compliance Validation</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>
          Real-time check
        </span>
      </div>

      <div className="validation-list">
        {selectedPlatforms.map((platformId) => {
          const report = reports[platformId];
          const platformMeta = PLATFORMS[platformId];

          if (!report) return null;

          const hasErrors = report.errors.length > 0;
          const hasWarnings = report.warnings.length > 0;
          const hasInfo = report.info.length > 0;

          // Determine status category
          let statusClass = 'success';
          let StatusIcon = CheckCircle2;
          let iconColor = 'var(--color-success)';

          if (hasErrors) {
            statusClass = 'error';
            StatusIcon = XCircle;
            iconColor = 'var(--color-error)';
          } else if (hasWarnings) {
            statusClass = 'warning';
            StatusIcon = AlertTriangle;
            iconColor = 'var(--color-warning)';
          }

          return (
            <div
              key={platformId}
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.03)',
                paddingBottom: '0.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  marginBottom: '0.25rem',
                  color: isSelectedColor(platformId),
                }}
              >
                <StatusIcon size={16} className="status-icon" style={{ color: iconColor }} />
                <span>{platformMeta.name}</span>
              </div>

              {/* Error messages */}
              {report.errors.map((err, index) => (
                <div key={`err-${index}`} className="validation-item error" style={{ paddingLeft: '1.25rem', marginBottom: '0.2rem' }}>
                  <XCircle size={12} className="status-icon" style={{ marginTop: '3px' }} />
                  <span>{err}</span>
                </div>
              ))}

              {/* Warning messages */}
              {report.warnings.map((warn, index) => (
                <div key={`warn-${index}`} className="validation-item warning" style={{ paddingLeft: '1.25rem', marginBottom: '0.2rem' }}>
                  <AlertTriangle size={12} className="status-icon" style={{ marginTop: '3px' }} />
                  <span>{warn}</span>
                </div>
              ))}

              {/* Info messages */}
              {report.info.map((inf, index) => (
                <div key={`info-${index}`} className="validation-item success" style={{ paddingLeft: '1.25rem', marginBottom: '0.2rem', color: 'var(--text-muted)' }}>
                  <Info size={12} className="status-icon" style={{ color: 'var(--color-info)', marginTop: '3px' }} />
                  <span>{inf}</span>
                </div>
              ))}

              {/* Compliant state fallback */}
              {!hasErrors && !hasWarnings && (
                <div
                  className="validation-item success"
                  style={{ paddingLeft: '1.25rem', color: 'var(--color-success)', opacity: hasInput ? 1 : 0.6 }}
                >
                  <CheckCircle2 size={12} className="status-icon" style={{ marginTop: '3px' }} />
                  <span>Ready to post</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Map platform names to their CSS custom property color values
function isSelectedColor(platform) {
  switch (platform) {
    case 'x':
      return 'var(--brand-x)';
    case 'facebook':
      return 'var(--brand-facebook)';
    case 'instagram':
      return '#f43f5e';
    case 'linkedin':
      return 'var(--brand-linkedin)';
    default:
      return 'var(--text-primary)';
  }
}

export default ValidationSummary;
