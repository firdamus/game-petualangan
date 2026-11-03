import { useState, type FC } from 'react';
import type { ShapeInfo } from '../types';

interface MateriModalProps {
  onClose: () => void;
}

const SHAPES_DATA: ShapeInfo[] = [
  {
    id: 'segitiga',
    name: 'Segitiga',
    color: '#eab308',
    icon: '▲',
    rumusLuas: 'L = ½ × alas × tinggi',
    rumusKeliling: 'K = sisi + sisi + sisi',
    sifat: [
      'Mempunyai 3 sisi dan 3 titik sudut',
      'Jumlah ketiga sudutnya selalu 180°',
      'Ada segitiga sama sisi, sama kaki, dan siku-siku',
    ],
  },
  {
    id: 'persegi',
    name: 'Persegi',
    color: '#3b82f6',
    icon: '■',
    rumusLuas: 'L = sisi × sisi (s²)',
    rumusKeliling: 'K = 4 × sisi (4s)',
    sifat: [
      'Semua 4 sisinya memiliki panjang yang sama',
      'Memiliki 4 sudut siku-siku (90°)',
      'Memiliki 4 sumbu simetri putar dan lipat',
    ],
  },
  {
    id: 'persegi-panjang',
    name: 'Persegi Panjang',
    color: '#10b981',
    icon: '▬',
    rumusLuas: 'L = panjang × lebar',
    rumusKeliling: 'K = 2 × (panjang + lebar)',
    sifat: [
      'Sisi yang berhadapan sama panjang dan sejajar',
      'Memiliki 4 sudut siku-siku (90°)',
      'Memiliki 2 simetri lipat dan putar',
    ],
  },
  {
    id: 'lingkaran',
    name: 'Lingkaran',
    color: '#ef4444',
    icon: '●',
    rumusLuas: 'L = π × r² (π = 22/7 atau 3.14)',
    rumusKeliling: 'K = 2 × π × r atau π × d',
    sifat: [
      'Memiliki 1 titik pusat di tengah',
      'Jarak pusat ke tepi disebut jari-jari (r)',
      'Memiliki simetri putar dan lipat tak terhingga',
    ],
  },
  {
    id: 'trapesium',
    name: 'Trapesium',
    color: '#8b5cf6',
    icon: '⏢',
    rumusLuas: 'L = ½ × (a + b) × tinggi',
    rumusKeliling: 'K = jumlah semua sisi',
    sifat: [
      'Memiliki sepasang sisi yang sejajar',
      'Ada trapesium sama kaki, siku-siku, dan sembarang',
    ],
  },
];

export const MateriModal: FC<MateriModalProps> = ({ onClose }) => {
  const [selectedShape, setSelectedShape] = useState<ShapeInfo>(SHAPES_DATA[0]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card wide-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Kenali Bangun Datar</h2>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="materi-layout">
          {/* Daftar Tab Bentuk */}
          <div className="shape-tabs-list">
            {SHAPES_DATA.map((shape) => (
              <button
                key={shape.id}
                type="button"
                className={`shape-tab-btn ${selectedShape.id === shape.id ? 'active' : ''}`}
                onClick={() => setSelectedShape(shape)}
                style={{
                  borderLeftColor: selectedShape.id === shape.id ? shape.color : 'transparent',
                }}
              >
                <span className="shape-tab-icon" style={{ color: shape.color }}>
                  {shape.icon}
                </span>
                <span className="shape-tab-name">{shape.name}</span>
              </button>
            ))}
          </div>

          {/* Detail Bentuk yang Dipilih */}
          <div className="shape-detail-card">
            <div className="shape-preview-banner" style={{ backgroundColor: `${selectedShape.color}15` }}>
              <span className="shape-huge-icon" style={{ color: selectedShape.color }}>
                {selectedShape.icon}
              </span>
              <h3 style={{ color: selectedShape.color }}>{selectedShape.name}</h3>
            </div>

            <div className="shape-formulas">
              <div className="formula-box">
                <span className="formula-tag">Rumus Luas:</span>
                <span className="formula-text">{selectedShape.rumusLuas}</span>
              </div>
              <div className="formula-box">
                <span className="formula-tag">Rumus Keliling:</span>
                <span className="formula-text">{selectedShape.rumusKeliling}</span>
              </div>
            </div>

            <div className="shape-properties">
              <h4>Sifat-Sifat Utama:</h4>
              <ul>
                {selectedShape.sifat.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-primary" onClick={onClose}>
            Tutup Materi
          </button>
        </div>
      </div>
    </div>
  );
};
