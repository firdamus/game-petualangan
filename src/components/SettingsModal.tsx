import React from 'react';

interface SettingsModalProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onResetProgress: () => void;
  onCheatCurrency: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onResetProgress,
  onCheatCurrency,
  onClose,
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pengaturan Game</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="settings-content">
          <div className="setting-item">
            <div className="setting-label-wrap">
              <span className="setting-title">Efek Suara (SFX)</span>
              <span className="setting-desc">Suara tombol dan tantangan</span>
            </div>
            <button 
              type="button" 
              className={`toggle-switch ${soundEnabled ? 'active' : ''}`}
              onClick={onToggleSound}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          <div className="setting-item">
            <div className="setting-label-wrap">
              <span className="setting-title">Musik Latar (BGM)</span>
              <span className="setting-desc">Melodi riang petualangan</span>
            </div>
            <button 
              type="button" 
              className={`toggle-switch ${musicEnabled ? 'active' : ''}`}
              onClick={onToggleMusic}
            >
              <div className="toggle-thumb" />
            </button>
          </div>

          <div className="setting-divider" />

          <div className="developer-tools">
            <h3>Pintasan & Pengujian</h3>
            <div className="dev-buttons">
              <button 
                type="button" 
                className="btn-shortcut"
                onClick={onCheatCurrency}
              >
                ➕ Tambah +100 ⭐ & +50 💎
              </button>
              <button 
                type="button" 
                className="btn-danger-outline"
                onClick={onResetProgress}
              >
                🔄 Reset Data Game
              </button>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
