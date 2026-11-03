import { useState, type FC, type FormEvent } from 'react';
import type { PlayerData } from '../types';

interface ProfileModalProps {
  player: PlayerData;
  onSave: (updated: Partial<PlayerData>) => void;
  onClose: () => void;
}

const AVAILABLE_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=Rizki&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=Budi&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts/svg?seed=Gamer&backgroundColor=d1d4f9',
];

export const ProfileModal: FC<ProfileModalProps> = ({
  player,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(player.name);
  const [role, setRole] = useState(player.role);
  const [avatar, setAvatar] = useState(player.avatar);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim() || 'Siswa', role, avatar });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ubah Profil Siswa</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-selection-section">
            <label className="form-label">Pilih Avatar:</label>
            <div className="avatar-grid">
              {AVAILABLE_AVATARS.map((avUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`avatar-choice ${avatar === avUrl ? 'selected' : ''}`}
                  onClick={() => setAvatar(avUrl)}
                >
                  <img src={avUrl} alt={`Avatar ${idx}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nama Siswa / Panggilan:</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Rizki"
              maxLength={20}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gelar / Peran:</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="Siswa">Siswa</option>
              <option value="Petualang Cilik">Petualang Cilik</option>
              <option value="Master Geometri">Master Geometri</option>
              <option value="Juara Matematika">Juara Matematika</option>
            </select>
          </div>

          <div className="profile-stats-summary">
            <div className="stat-badge">
              <span className="stat-label">Level</span>
              <span className="stat-value">{player.level}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-label">Bintang ⭐</span>
              <span className="stat-value">{player.stars}</span>
            </div>
            <div className="stat-badge">
              <span className="stat-label">Berlian 💎</span>
              <span className="stat-value">{player.gems}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
