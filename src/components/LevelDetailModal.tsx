import React from 'react';

interface LevelDetailModalProps {
  levelNumber: number;
  onPlay: (levelNum: number) => void;
  onClose: () => void;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  levelNumber,
  onPlay,
  onClose,
}) => {
  const isCompleted = levelNumber === 1;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>🏝️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Level {levelNumber}</h2>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Pulau Bentuk</div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '20px 18px', textAlign: 'center' }}>
          {/* Visual star badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '74px',
            height: '74px',
            borderRadius: '50%',
            background: isCompleted ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'linear-gradient(135deg, #60a5fa, #2563eb)',
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: 900,
            boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
            marginBottom: '12px',
            border: '4px solid #ffffff',
          }}>
            {levelNumber}
          </div>

          <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0f172a' }}>
            {levelNumber === 1 ? 'Mengenal Bentuk Dasar' : 'Sisi & Sudut Bangun Datar'}
          </h3>

          {/* Stars display */}
          <div style={{ fontSize: '24px', color: isCompleted ? '#f59e0b' : '#cbd5e1', marginBottom: '14px' }}>
            {isCompleted ? '★★★' : '☆☆☆'}
          </div>

          <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.45, margin: '0 0 16px 0' }}>
            {levelNumber === 1
              ? 'Tantangan mengenali sifat dasar segitiga, persegi, dan lingkaran dalam kehidupan sehari-hari.'
              : 'Uji kemampuanmu menghitung banyak sisi, sudut siku-siku, dan sifat-sifat bangun datar!'}
          </p>

          <div style={{
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '12px',
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '18px',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>HADIAH</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>
                ⭐ +30
              </div>
            </div>
            <div style={{ borderLeft: '1px solid #e2e8f0' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>BERLIAN</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>
                💎 +3
              </div>
            </div>
            <div style={{ borderLeft: '1px solid #e2e8f0' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>EXP</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#7c3aed', marginTop: '2px' }}>
                ⚡ +25
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '16px' }}
            onClick={() => onPlay(levelNumber)}
          >
            {isCompleted ? 'Mainkan Lagi 🔄' : 'Mulai Petualangan! 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};
