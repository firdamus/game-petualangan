import React, { useState } from 'react';
import petaBg from '../assets/peta-bg.png';
import type { PlayerData, Mission, TabType } from '../types';
import { LevelDetailModal } from './LevelDetailModal';
import { IslandDetailModal } from './IslandDetailModal';
import { KoleksiModal } from './KoleksiModal';
import { DailyMissionModal } from './DailyMissionModal';
import { PulauBentukFlow } from './PulauBentukFlow';

interface PetaScreenProps {
  player: PlayerData;
  mission: Mission;
  onBack: () => void;
  onNavigateTab: (tab: TabType) => void;
  onPlayLevel: (levelNum: number) => void;
  onAddStars: (amount: number) => void;
  onAddGems: (amount: number) => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onOpenMateri: () => void;
  onOpenPrestasi: () => void;
  showToast: (msg: string) => void;
  playSound: (freq?: number, type?: OscillatorType) => void;
}

export const PetaScreen: React.FC<PetaScreenProps> = ({
  player,
  mission,
  onBack,
  onNavigateTab,
  onPlayLevel,
  onAddStars,
  onAddGems,
  onOpenProfile,
  onOpenSettings,
  onOpenMateri,
  onOpenPrestasi,
  showToast,
  playSound,
}) => {
  // Modal states within map
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedIsland, setSelectedIsland] = useState<number | null>(null);
  const [showKoleksi, setShowKoleksi] = useState(false);
  const [showMission, setShowMission] = useState(false);
  const [showPulauBentukFlow, setShowPulauBentukFlow] = useState(false);
  const [shakingNode, setShakingNode] = useState<string | null>(null);
  const [characterBubble, setCharacterBubble] = useState<string | null>(null);

  const handleLockedClick = (nodeId: string, levelName: string, hint?: string) => {
    playSound(260, 'sawtooth');
    setShakingNode(nodeId);
    setTimeout(() => setShakingNode(null), 500);
    showToast(hint || `🔒 ${levelName} masih terkunci! Selesaikan level sebelumnya terlebih dahulu.`);
  };

  const handleCharacterClick = () => {
    playSound(720, 'triangle');
    const quotes = [
      `👋 Semangat ${player.name}! Ayo taklukkan Pulau Bentuk!`,
      `🎒 Siap berpetualang ${player.name}? Ayo klik Level 2 sekarang!`,
      `⭐ Hebat, kamu sudah Level ${player.level}! Ayo kumpulkan lebih banyak bintang!`,
    ];
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    setCharacterBubble(quote);
    setTimeout(() => setCharacterBubble(null), 3500);
  };

  return (
    <div className="pure-game-image-wrapper">
      {/* 100% Exact High-Resolution Background Graphic */}
      <img
        src={petaBg}
        alt="Peta Petualangan Bangun Datar"
        className="pure-game-image"
      />

      {/* Floating Character Speech Bubble */}
      {characterBubble && (
        <div
          style={{
            position: 'absolute',
            top: '21.5%',
            left: '12%',
            maxWidth: '52%',
            background: 'rgba(255, 255, 255, 0.96)',
            color: '#1e3a8a',
            fontSize: '11px',
            fontWeight: 800,
            padding: '6px 10px',
            borderRadius: '12px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            border: '2px solid #38bdf8',
            zIndex: 35,
            animation: 'popUp 0.2s ease-out',
            pointerEvents: 'none',
          }}
        >
          {characterBubble}
        </div>
      )}

      {/* Subtle Interactive Indicators */}
      {/* Pulsing indicator for active Level 2 */}
      <div
        className="active-level-pulse"
        style={{
          position: 'absolute',
          top: '25.6%',
          left: '26.7%',
          width: '7.2%',
          height: '4.1%',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 8,
        }}
      />

      {/* Glowing border indicator for completed Level 1 */}
      <div
        className="completed-level-glow"
        style={{
          position: 'absolute',
          top: '25.6%',
          left: '12.1%',
          width: '7.2%',
          height: '4.1%',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 8,
        }}
      />

      {/* Shortcut Pill to Pulau Bentuk Flow */}
      <button
        type="button"
        onClick={() => {
          playSound(750);
          setShowPulauBentukFlow(true);
        }}
        style={{
          position: 'absolute',
          top: '30.5%',
          left: '8%',
          background: 'rgba(37, 99, 235, 0.92)',
          color: '#ffffff',
          border: '1.5px solid #ffffff',
          borderRadius: '16px',
          padding: '3px 8px',
          fontSize: '10px',
          fontWeight: 800,
          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
          cursor: 'pointer',
          zIndex: 25,
          animation: 'pulse 1.8s infinite',
        }}
        title="Buka Alur Lengkap Pulau Bentuk"
      >
        🎮 Alur Level 1
      </button>

      {/* ==========================================================
          HOTSPOTS INTERAKTIF PETA PETUALANGAN
          ========================================================== */}

      {/* TOP BAR */}
      {/* 1. Profil Siswa */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-profile"
        onClick={() => {
          playSound(550);
          onOpenProfile();
        }}
        title="Profil Siswa Rizki"
      />

      {/* 2. Tambah Bintang ⭐ */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-stars"
        onClick={() => {
          playSound(820);
          onAddStars(10);
        }}
        title="Tambah 10 Bintang"
      />

      {/* 3. Tambah Berlian 💎 */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-gems"
        onClick={() => {
          playSound(920);
          onAddGems(5);
        }}
        title="Tambah 5 Berlian"
      />

      {/* 4. Pengaturan ⚙️ */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-settings"
        onClick={() => {
          playSound(550);
          onOpenSettings();
        }}
        title="Pengaturan Game"
      />

      {/* SUB-HEADER */}
      {/* 5. Tombol Kembali < */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-back"
        onClick={() => {
          playSound(480);
          onBack();
        }}
        title="Kembali ke Beranda"
      />

      {/* 6. Banner Peta Petualangan */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-title-banner"
        onClick={() => {
          playSound(600);
          showToast('🗺️ Peta Petualangan: Jelajahi 5 pulau geometri dan taklukkan semua level!');
        }}
        title="Peta Petualangan"
      />

      {/* 7. Misi Hari Ini */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-daily-mission"
        onClick={() => {
          playSound(680);
          setShowMission(true);
        }}
        title="Misi Hari Ini"
      />

      {/* ==========================================================
          PULAU 1: PULAU BENTUK (Mengenal Bentuk Dasar)
          ========================================================== */}
      {/* Pulau 1 Banner */}
      <button
        type="button"
        className="invisible-hotspot hotspot-island-1-banner"
        onClick={() => {
          playSound(620);
          setSelectedIsland(1);
        }}
        title="Pulau Bentuk - Mengenal bentuk dasar"
      />

      {/* Karakter Segitiga Kuning Beransel */}
      <button
        type="button"
        className="invisible-hotspot hotspot-peta-character"
        onClick={handleCharacterClick}
        title="Si Segitiga Petualang"
      />

      {/* Level 1 (Completed ★★★) - Membuka Alur Petualangan Lengkap */}
      <button
        type="button"
        className="invisible-hotspot hotspot-level-1"
        onClick={() => {
          playSound(750);
          setShowPulauBentukFlow(true);
        }}
        title="Level 1 - Gerbang Pulau Bentuk (Buka Alur Petualangan)"
      />

      {/* Level 2 (Active/Current) */}
      <button
        type="button"
        className="invisible-hotspot hotspot-level-2"
        onClick={() => {
          playSound(850);
          setSelectedLevel(2);
        }}
        title="Level 2 - Sisi & Sudut Bangun Datar (Level Aktif)"
      />

      {/* Level 3 (Locked) */}
      <button
        type="button"
        className={`invisible-hotspot hotspot-level-3 ${shakingNode === 'lvl-3' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('lvl-3', 'Level 3', '🔒 Level 3 Terkunci! Selesaikan Level 2 untuk membuka petualangan ini.')}
        title="Level 3 (Terkunci)"
      />

      {/* ==========================================================
          PULAU 2: HUTAN SEGI EMPAT (Sisi, Sudut dan Jenis-jenisnya)
          ========================================================== */}
      {/* Pulau 2 Banner */}
      <button
        type="button"
        className="invisible-hotspot hotspot-island-2-banner"
        onClick={() => {
          playSound(620);
          setSelectedIsland(2);
        }}
        title="Hutan Segi Empat"
      />

      {/* Level nodes on Island 2 */}
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-7 ${shakingNode === 'node-7' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-7', 'Level 7', '🔒 Hutan Segi Empat terbuka setelah menyelesaikan Pulau Bentuk!')}
        title="Level 7 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-8a ${shakingNode === 'node-8a' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-8a', 'Level 8', '🔒 Selesaikan level sebelumnya untuk membuka Level 8!')}
        title="Level 8 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-9 ${shakingNode === 'node-9' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-9', 'Level 9', '🔒 Level 9 masih terkunci!')}
        title="Level 9 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-8b ${shakingNode === 'node-8b' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-8b', 'Level 8', '🔒 Level 8 masih terkunci!')}
        title="Level 8 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-12a ${shakingNode === 'node-12a' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-12a', 'Level 12', '🔒 Level 12 masih terkunci!')}
        title="Level 12 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-12b ${shakingNode === 'node-12b' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-12b', 'Level 12', '🔒 Level 12 masih terkunci!')}
        title="Level 12 (Terkunci)"
      />

      {/* ==========================================================
          PULAU 3: PEGUNUNGAN SEGITIGA (Jenis Segitiga dan Keliling)
          ========================================================== */}
      {/* Pulau 3 Banner */}
      <button
        type="button"
        className="invisible-hotspot hotspot-island-3-banner"
        onClick={() => {
          playSound(620);
          setSelectedIsland(3);
        }}
        title="Pegunungan Segitiga"
      />

      {/* Level nodes on Island 3 */}
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-13 ${shakingNode === 'node-13' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-13', 'Level 13', '🔒 Pegunungan Segitiga terbuka setelah Hutan Segi Empat!')}
        title="Level 13 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-14 ${shakingNode === 'node-14' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-14', 'Level 14')}
        title="Level 14 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-15 ${shakingNode === 'node-15' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-15', 'Level 15')}
        title="Level 15 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-16 ${shakingNode === 'node-16' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-16', 'Level 16')}
        title="Level 16 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-17 ${shakingNode === 'node-17' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-17', 'Level 17')}
        title="Level 17 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-18 ${shakingNode === 'node-18' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-18', 'Level 18')}
        title="Level 18 (Terkunci)"
      />

      {/* ==========================================================
          PULAU 4: DANAU LINGKARAN (Jari-jari, Diameter dan Luas)
          ========================================================== */}
      {/* Pulau 4 Banner */}
      <button
        type="button"
        className="invisible-hotspot hotspot-island-4-banner"
        onClick={() => {
          playSound(620);
          setSelectedIsland(4);
        }}
        title="Danau Lingkaran"
      />

      {/* Level nodes on Island 4 */}
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-19 ${shakingNode === 'node-19' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-19', 'Level 19', '🔒 Danau Lingkaran terbuka mulai Level 19!')}
        title="Level 19 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-20 ${shakingNode === 'node-20' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-20', 'Level 20')}
        title="Level 20 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-21 ${shakingNode === 'node-21' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-21', 'Level 21')}
        title="Level 21 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-22 ${shakingNode === 'node-22' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-22', 'Level 22')}
        title="Level 22 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-23 ${shakingNode === 'node-23' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-23', 'Level 23')}
        title="Level 23 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-24 ${shakingNode === 'node-24' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-24', 'Level 24')}
        title="Level 24 (Terkunci)"
      />

      {/* ==========================================================
          PULAU 5: KASTIL GEOMETRI (Gabungan Bentuk dan Luas)
          ========================================================== */}
      {/* Pulau 5 Banner */}
      <button
        type="button"
        className="invisible-hotspot hotspot-island-5-banner"
        onClick={() => {
          playSound(620);
          setSelectedIsland(5);
        }}
        title="Kastil Geometri"
      />

      {/* Level nodes on Island 5 */}
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-25 ${shakingNode === 'node-25' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-25', 'Level 25', '🔒 Kastil Geometri adalah tantangan pamungkas!')}
        title="Level 25 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-26 ${shakingNode === 'node-26' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-26', 'Level 26')}
        title="Level 26 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-27 ${shakingNode === 'node-27' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-27', 'Level 27')}
        title="Level 27 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-28 ${shakingNode === 'node-28' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-28', 'Level 28')}
        title="Level 28 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-29 ${shakingNode === 'node-29' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-29', 'Level 29')}
        title="Level 29 (Terkunci)"
      />
      <button
        type="button"
        className={`invisible-hotspot hotspot-node-30 ${shakingNode === 'node-30' ? 'shake-animation' : ''}`}
        onClick={() => handleLockedClick('node-30', 'Level 30')}
        title="Level 30 (Terkunci)"
      />

      {/* ==========================================================
          KOLEKSI BENTUK (Pojok Kiri Bawah)
          ========================================================== */}
      <button
        type="button"
        className="invisible-hotspot hotspot-koleksi-bentuk"
        onClick={() => {
          playSound(680);
          setShowKoleksi(true);
        }}
        title="Koleksi Bentuk (8/24)"
      />

      {/* ==========================================================
          BILAH NAVIGASI BAWAH (5 TAB)
          ========================================================== */}
      <div className="bottom-nav-hotspots">
        <button
          type="button"
          className="invisible-nav-hotspot"
          onClick={() => {
            playSound(500);
            onNavigateTab('beranda');
          }}
          title="Beranda"
        />
        <button
          type="button"
          className="invisible-nav-hotspot"
          onClick={() => {
            playSound(500);
            showToast('🗺️ Anda berada di Peta Petualangan');
          }}
          title="Peta (Aktif)"
        />
        <button
          type="button"
          className="invisible-nav-hotspot"
          onClick={() => {
            playSound(500);
            onOpenPrestasi();
          }}
          title="Prestasi"
        />
        <button
          type="button"
          className="invisible-nav-hotspot"
          onClick={() => {
            playSound(500);
            onOpenMateri();
          }}
          title="Materi"
        />
        <button
          type="button"
          className="invisible-nav-hotspot"
          onClick={() => {
            playSound(500);
            onOpenProfile();
          }}
          title="Profil"
        />
      </div>

      {/* ==========================================================
          MODAL INTERAKTIF PADA PETA
          ========================================================== */}
      {showPulauBentukFlow && (
        <PulauBentukFlow
          player={player}
          onClose={() => setShowPulauBentukFlow(false)}
          onWinReward={(stars, gems, exp) => {
            onAddStars(stars);
            onAddGems(gems);
            showToast(`⭐ +${stars} Skor Bintang, 💎 +${gems} Berlian, ⚡ +${exp} EXP!`);
          }}
          showToast={showToast}
          playSound={playSound}
        />
      )}

      {selectedLevel !== null && (
        <LevelDetailModal
          levelNumber={selectedLevel}
          onPlay={(lvl) => {
            setSelectedLevel(null);
            if (lvl === 1) {
              setShowPulauBentukFlow(true);
            } else {
              onPlayLevel(lvl);
            }
          }}
          onClose={() => setSelectedLevel(null)}
        />
      )}

      {selectedIsland !== null && (
        <IslandDetailModal
          islandId={selectedIsland}
          onClose={() => setSelectedIsland(null)}
        />
      )}

      {showKoleksi && (
        <KoleksiModal
          playSound={playSound}
          onClose={() => setShowKoleksi(false)}
        />
      )}

      {showMission && (
        <DailyMissionModal
          mission={mission}
          onClose={() => setShowMission(false)}
        />
      )}
    </div>
  );
};
