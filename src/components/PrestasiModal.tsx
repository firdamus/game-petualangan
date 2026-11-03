import React from 'react';

interface PrestasiModalProps {
  onClaimReward: (stars: number) => void;
  onClose: () => void;
}

const ACHIEVEMENTS = [
  { id: 1, title: 'Langkah Pertama', desc: 'Mulai petualangan bangun datar pertamamu', reward: 20, done: true, claimed: true },
  { id: 2, title: 'Pakar Segitiga', desc: 'Jawab 3 pertanyaan segitiga dengan tepat', reward: 35, done: true, claimed: false },
  { id: 3, title: 'Kolektor Bintang Emas', desc: 'Kumpulkan total 150 bintang petualangan', reward: 50, done: false, claimed: false },
  { id: 4, title: 'Penjelajah Rajin', desc: 'Selesaikan 5 misi harian dengan sempurna', reward: 75, done: false, claimed: false },
];

export const PrestasiModal: React.FC<PrestasiModalProps> = ({ onClaimReward, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Prestasi & Piala 🏆</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="prestasi-list">
          {ACHIEVEMENTS.map((item) => (
            <div key={item.id} className="prestasi-card">
              <div className="prestasi-icon">{item.done ? '🎖️' : '🔒'}</div>
              <div className="prestasi-details">
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
                <span className="reward-tag">Hadiah: ⭐ {item.reward}</span>
              </div>
              <button
                type="button"
                className={`prestasi-claim-btn ${item.done && !item.claimed ? 'can-claim' : 'claimed'}`}
                disabled={!item.done || item.claimed}
                onClick={() => onClaimReward(item.reward)}
              >
                {item.claimed ? 'Selesai' : item.done ? 'Klaim' : 'Belum'}
              </button>
            </div>
          ))}
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
