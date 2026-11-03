import React from 'react';

interface IslandInfo {
  id: number;
  name: string;
  subtitle: string;
  icon: string;
  levels: string;
  status: 'active' | 'locked';
  description: string;
  topics: string[];
}

const ISLANDS_LIST: Record<number, IslandInfo> = {
  1: {
    id: 1,
    name: 'Pulau Bentuk',
    subtitle: 'Mengenal bentuk dasar',
    icon: '🏝️',
    levels: 'Level 1 - 3',
    status: 'active',
    description: 'Wilayah pertama tempatmu memulai petualangan matematika! Di pulau ini, kamu akan mengenal bentuk dasar seperti segitiga, persegi, dan lingkaran dalam kehidupan nyata.',
    topics: ['Pengenalan Segitiga', 'Pengenalan Persegi & Lingkaran', 'Benda-benda di Sekitar Kita'],
  },
  2: {
    id: 2,
    name: 'Hutan Segi Empat',
    subtitle: 'Sisi, sudut dan jenis-jenisnya',
    icon: '🌲',
    levels: 'Level 4 - 12',
    status: 'locked',
    description: 'Hutan lebat nan magis yang dipenuhi rahasia bangun segi empat beraturan dan tak beraturan.',
    topics: ['Sifat Persegi Panjang', 'Jajar Genjang & Belah Ketupat', 'Trapesium & Layang-Layang'],
  },
  3: {
    id: 3,
    name: 'Pegunungan Segitiga',
    subtitle: 'Jenis segitiga dan keliling',
    icon: '⛰️',
    levels: 'Level 13 - 18',
    status: 'locked',
    description: 'Puncak-puncak bersalju tempat mempelajari segitiga sama sisi, sama kaki, siku-siku, serta cara menghitung kelilingnya.',
    topics: ['Segitiga Berdasarkan Sisi', 'Segitiga Berdasarkan Sudut', 'Rumus Keliling Segitiga'],
  },
  4: {
    id: 4,
    name: 'Danau Lingkaran',
    subtitle: 'Jari-jari, diameter dan luas',
    icon: '🌊',
    levels: 'Level 19 - 24',
    status: 'locked',
    description: 'Danau melingkar indah dengan air terjun bercahaya. Kuasai konstanta Pi (π), jari-jari (r), dan diameter (d)!',
    topics: ['Jari-jari & Diameter', 'Keliling Lingkaran (2πr)', 'Luas Lingkaran (πr²)'],
  },
  5: {
    id: 5,
    name: 'Kastil Geometri',
    subtitle: 'Gabungan bentuk dan luas',
    icon: '🏰',
    levels: 'Level 25 - 30',
    status: 'locked',
    description: 'Kastil megah di puncak langit, tempat tantangan pamungkas matematika! Gabungan seluruh bentuk dan rumus luas gabungan.',
    topics: ['Luas Bangun Gabungan', 'Soal Cerita Pemecahan Masalah', 'Gelar Master Geometri'],
  },
};

interface IslandDetailModalProps {
  islandId: number;
  onClose: () => void;
}

export const IslandDetailModal: React.FC<IslandDetailModalProps> = ({ islandId, onClose }) => {
  const island = ISLANDS_LIST[islandId] || ISLANDS_LIST[1];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>{island.icon}</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>{island.name}</h2>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{island.levels}</div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: island.status === 'active' ? '#eff6ff' : '#f8fafc',
            border: island.status === 'active' ? '2px solid #93c5fd' : '1.5px solid #e2e8f0',
            borderRadius: '16px',
            padding: '14px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1' }}>
                {island.subtitle}
              </span>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '8px',
                background: island.status === 'active' ? '#dcfce7' : '#fee2e2',
                color: island.status === 'active' ? '#166534' : '#991b1b',
              }}>
                {island.status === 'active' ? 'Wilayah Aktif ✅' : 'Terkunci 🔒'}
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.45, margin: 0 }}>
              {island.description}
            </p>
          </div>

          <div>
            <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#475569' }}>
              Materi yang Dipelajari:
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {island.topics.map((topic, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#f8fafc',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#1e293b',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ color: '#3b82f6' }}>🔹</span>
                  <span>{topic}</span>
                </div>
              ))}
            </div>
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
