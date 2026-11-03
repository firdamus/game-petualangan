import React from 'react';
import type { Mission } from '../types';

interface DailyMissionModalProps {
  mission: Mission;
  onClaim?: () => void;
  onClose: () => void;
}

export const DailyMissionModal: React.FC<DailyMissionModalProps> = ({
  mission,
  onClaim,
  onClose,
}) => {
  const percent = Math.min(100, Math.round((mission.current / mission.target) * 100));
  const isReady = mission.current >= mission.target && !mission.completed;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📋</span>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Misi Hari Ini</h2>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{
            background: '#eff6ff',
            border: '2px solid #bfdbfe',
            borderRadius: '16px',
            padding: '14px',
          }}>
            <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#1e3a8a' }}>
              {mission.title}
            </h4>
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#334155' }}>
              {mission.desc}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
              <span style={{ color: '#64748b' }}>Progres Misi</span>
              <span style={{ color: '#2563eb' }}>{mission.current} / {mission.target}</span>
            </div>

            <div style={{ background: '#cbd5e1', borderRadius: '10px', height: '12px', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${percent}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #38bdf8, #22c55e)',
                  borderRadius: '10px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          <div style={{
            background: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 700 }}>HADIAH MISI</div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#d97706' }}>
                  ⭐ +{mission.rewardStars}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7' }}>
                  💎 +{mission.rewardGems}
                </span>
              </div>
            </div>

            {isReady && onClaim && (
              <button
                type="button"
                onClick={onClaim}
                style={{
                  background: '#22c55e',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(34, 197, 94, 0.35)',
                }}
              >
                Klaim! 🎉
              </button>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
