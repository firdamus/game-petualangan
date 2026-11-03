import React, { useState } from 'react';

interface KoleksiModalProps {
  onClose: () => void;
  playSound: (freq?: number, type?: OscillatorType) => void;
}

interface ShapeItem {
  id: string;
  name: string;
  unlocked: boolean;
  icon: string;
  category: string;
  formulaL: string;
  formulaK: string;
  desc: string;
}

const SHAPES_DATA: ShapeItem[] = [
  {
    id: 's1',
    name: 'Segitiga Sama Sisi',
    unlocked: true,
    icon: '▲',
    category: 'Segitiga',
    formulaL: 'L = ½ × a × t',
    formulaK: 'K = 3 × s',
    desc: 'Memiliki 3 sisi sama panjang dan 3 sudut sama besar yaitu 60°.',
  },
  {
    id: 's2',
    name: 'Segitiga Siku-Siku',
    unlocked: true,
    icon: '📐',
    category: 'Segitiga',
    formulaL: 'L = ½ × a × t',
    formulaK: 'K = a + b + c',
    desc: 'Salah satu sudutnya tegak lurus membentuk 90° (teorema Pythagoras).',
  },
  {
    id: 's3',
    name: 'Persegi',
    unlocked: true,
    icon: '■',
    category: 'Segi Empat',
    formulaL: 'L = s × s',
    formulaK: 'K = 4 × s',
    desc: 'Keempat sisinya sama panjang dengan 4 sudut siku-siku 90°.',
  },
  {
    id: 's4',
    name: 'Persegi Panjang',
    unlocked: true,
    icon: '▭',
    category: 'Segi Empat',
    formulaL: 'L = p × l',
    formulaK: 'K = 2 × (p + l)',
    desc: 'Memiliki 2 pasang sisi sejajar yang berhadapan sama panjang.',
  },
  {
    id: 's5',
    name: 'Lingkaran',
    unlocked: true,
    icon: '●',
    category: 'Lingkaran',
    formulaL: 'L = π × r²',
    formulaK: 'K = 2 × π × r',
    desc: 'Memiliki 1 sisi lengkung berjarak sama ke titik pusat (jari-jari).',
  },
  {
    id: 's6',
    name: 'Jajar Genjang',
    unlocked: true,
    icon: '▱',
    category: 'Segi Empat',
    formulaL: 'L = a × t',
    formulaK: 'K = 2 × (a + b)',
    desc: 'Sisi yang berhadapan sejajar dan sama panjang, sudut sepihak 180°.',
  },
  {
    id: 's7',
    name: 'Belah Ketupat',
    unlocked: true,
    icon: '◆',
    category: 'Segi Empat',
    formulaL: 'L = ½ × d₁ × d₂',
    formulaK: 'K = 4 × s',
    desc: 'Keempat sisinya sama panjang, diagonal berpotongan tegak lurus.',
  },
  {
    id: 's8',
    name: 'Layang-Layang',
    unlocked: true,
    icon: '🪁',
    category: 'Segi Empat',
    formulaL: 'L = ½ × d₁ × d₂',
    formulaK: 'K = 2 × (a + b)',
    desc: 'Memiliki 2 pasang sisi bersebelahan yang sama panjang.',
  },
  // Locked shapes
  {
    id: 's9',
    name: 'Trapesium Sama Kaki',
    unlocked: false,
    icon: '🔒',
    category: 'Segi Empat',
    formulaL: 'L = ½ × (a + b) × t',
    formulaK: 'K = a + b + 2c',
    desc: 'Terbuka di Hutan Segi Empat (Level 8).',
  },
  {
    id: 's10',
    name: 'Trapesium Siku-siku',
    unlocked: false,
    icon: '🔒',
    category: 'Segi Empat',
    formulaL: 'L = ½ × (a + b) × t',
    formulaK: 'K = a + b + c + d',
    desc: 'Terbuka di Hutan Segi Empat (Level 12).',
  },
  {
    id: 's11',
    name: 'Segitiga Sama Kaki',
    unlocked: false,
    icon: '🔒',
    category: 'Segitiga',
    formulaL: 'L = ½ × a × t',
    formulaK: 'K = 2s + a',
    desc: 'Terbuka di Pegunungan Segitiga (Level 14).',
  },
  {
    id: 's12',
    name: 'Segi Lima (Pentagon)',
    unlocked: false,
    icon: '🔒',
    category: 'Poligon',
    formulaL: 'L = 1.72 × s²',
    formulaK: 'K = 5 × s',
    desc: 'Terbuka di Danau Lingkaran (Level 20).',
  },
];

export const KoleksiModal: React.FC<KoleksiModalProps> = ({ onClose, playSound }) => {
  const [selectedShape, setSelectedShape] = useState<ShapeItem>(SHAPES_DATA[0]);

  const unlockedCount = SHAPES_DATA.filter((s) => s.unlocked).length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card wide-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '24px' }}>📦</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px' }}>Koleksi Bentuk</h2>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Terbuka: <strong style={{ color: '#2563eb' }}>{unlockedCount} / 24</strong> Bentuk Geometri
              </div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div style={{ padding: '12px 16px', overflowY: 'auto', maxHeight: '68vh' }}>
          {/* Progress bar */}
          <div style={{ background: '#e2e8f0', borderRadius: '12px', height: '10px', overflow: 'hidden', marginBottom: '16px' }}>
            <div
              style={{
                width: `${(unlockedCount / 24) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #38bdf8, #2563eb)',
                borderRadius: '12px',
              }}
            />
          </div>

          {/* Grid shape items */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '16px',
          }}>
            {SHAPES_DATA.map((shape) => {
              const isSelected = selectedShape.id === shape.id;
              return (
                <button
                  key={shape.id}
                  type="button"
                  onClick={() => {
                    if (shape.unlocked) {
                      playSound(600);
                      setSelectedShape(shape);
                    } else {
                      playSound(300, 'sawtooth');
                    }
                  }}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 4px',
                    borderRadius: '14px',
                    border: isSelected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                    background: shape.unlocked
                      ? (isSelected ? '#eff6ff' : '#f8fafc')
                      : '#f1f5f9',
                    opacity: shape.unlocked ? 1 : 0.55,
                    cursor: shape.unlocked ? 'pointer' : 'not-allowed',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ fontSize: '22px', marginBottom: '4px' }}>{shape.icon}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    textAlign: 'center',
                    lineHeight: 1.15,
                    color: shape.unlocked ? '#1e293b' : '#94a3b8',
                  }}>
                    {shape.unlocked ? shape.name.split(' ')[0] : 'Terkunci'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Selected Shape Detail */}
          {selectedShape && selectedShape.unlocked && (
            <div style={{
              background: '#f8fafc',
              border: '2px solid #93c5fd',
              borderRadius: '18px',
              padding: '14px',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '32px' }}>{selectedShape.icon}</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#1e3a8a' }}>{selectedShape.name}</h3>
                  <span style={{
                    fontSize: '11px',
                    background: '#dbeafe',
                    color: '#1d4ed8',
                    padding: '2px 8px',
                    borderRadius: '8px',
                    fontWeight: 700,
                  }}>
                    {selectedShape.category}
                  </span>
                </div>
              </div>

              <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                {selectedShape.desc}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>Rumus Luas</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0369a1' }}>{selectedShape.formulaL}</div>
                </div>
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  padding: '8px 10px',
                  borderRadius: '10px',
                  border: '1px solid #cbd5e1',
                }}>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>Rumus Keliling</div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#15803d' }}>{selectedShape.formulaK}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Tutup Koleksi
          </button>
        </div>
      </div>
    </div>
  );
};
