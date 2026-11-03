import type { FC } from 'react';
import type { PlayerData } from '../types';

interface HeaderProps {
  player: PlayerData;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onAddStars: () => void;
  onAddGems: () => void;
}

export const Header: FC<HeaderProps> = ({
  player,
  onOpenProfile,
  onOpenSettings,
  onAddStars,
  onAddGems,
}) => {
  const expPercent = Math.min(100, Math.round((player.exp / player.maxExp) * 100));

  return (
    <header className="game-header">
      {/* Profil Siswa */}
      <button 
        type="button" 
        className="profile-pill" 
        onClick={onOpenProfile}
        title="Klik untuk ubah profil & nama"
      >
        <div className="profile-avatar-wrap">
          <img
            src={player.avatar}
            alt={player.name}
            className="profile-avatar-img"
          />
        </div>
        <div className="profile-info">
          <span className="profile-role">{player.role}</span>
          <span className="profile-name">{player.name}</span>
          <div className="profile-exp-bar">
            <div 
              className="profile-exp-fill" 
              style={{ width: `${expPercent}%` }}
            />
          </div>
          <span className="profile-level-badge">Level {player.level}</span>
        </div>
      </button>

      {/* Mata Uang & Pengaturan */}
      <div className="header-actions">
        {/* Bintang / Star */}
        <div className="currency-pill star-pill">
          <span className="currency-icon">⭐</span>
          <span className="currency-amount">{player.stars}</span>
          <button 
            type="button" 
            className="currency-add-btn" 
            onClick={onAddStars}
            title="Tambah Bintang"
          >
            +
          </button>
        </div>

        {/* Berlian / Diamond */}
        <div className="currency-pill gem-pill">
          <span className="currency-icon">💎</span>
          <span className="currency-amount">{player.gems}</span>
          <button 
            type="button" 
            className="currency-add-btn" 
            onClick={onAddGems}
            title="Tambah Berlian"
          >
            +
          </button>
        </div>

        {/* Tombol Pengaturan */}
        <button 
          type="button" 
          className="settings-btn" 
          onClick={onOpenSettings}
          title="Pengaturan Game"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        </button>
      </div>
    </header>
  );
};
