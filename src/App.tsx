import { useState, useCallback } from 'react';
import './App.css';
import gameBg from './assets/game-bg.jpg';
import type { PlayerData, Mission, TabType } from './types';
import { ProfileModal } from './components/ProfileModal';
import { SettingsModal } from './components/SettingsModal';
import { MateriModal } from './components/MateriModal';
import { GamePlayModal } from './components/GamePlayModal';
import { PetaScreen } from './components/PetaScreen';
import { PrestasiModal } from './components/PrestasiModal';

export default function App() {
  // Tab Aktif (Beranda atau Peta Petualangan)
  const [currentTab, setCurrentTab] = useState<TabType>('beranda');

  // Data Pemain
  const [player, setPlayer] = useState<PlayerData>({
    name: 'Rizki',
    role: 'Siswa',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
    level: 3,
    exp: 65,
    maxExp: 100,
    stars: 120,
    gems: 45,
  });

  // Misi Harian
  const [mission, setMission] = useState<Mission>({
    id: 'm1',
    title: 'Misi Hari Ini',
    desc: 'Selesaikan 3 level dengan nilai sempurna',
    current: 1,
    target: 3,
    completed: false,
    rewardStars: 50,
    rewardGems: 5,
  });

  // Modal Aktif
  const [activeModal, setActiveModal] = useState<
    'profile' | 'settings' | 'materi' | 'game' | 'prestasi' | null
  >(null);

  // Level permainan yang dipilih
  const [currentGameLevel, setCurrentGameLevel] = useState<number>(1);

  // Audio & Notifikasi
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2500);
  }, []);

  const playSound = useCallback((freq = 520, type: OscillatorType = 'sine') => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {
      // Audio fallback
    }
  }, [soundEnabled]);

  const handleAddStars = useCallback((amount: number) => {
    setPlayer((prev) => {
      const nextStars = prev.stars + amount;
      showToast(`⭐ Bintang bertambah +${amount}! (Total: ${nextStars})`);
      return { ...prev, stars: nextStars };
    });
  }, [showToast]);

  const handleAddGems = useCallback((amount: number) => {
    setPlayer((prev) => {
      const nextGems = prev.gems + amount;
      showToast(`💎 Berlian bertambah +${amount}! (Total: ${nextGems})`);
      return { ...prev, gems: nextGems };
    });
  }, [showToast]);

  const handleWinReward = (rewardStars: number, rewardGems: number, expGained: number) => {
    playSound(900);
    setPlayer((prev) => {
      let newExp = prev.exp + expGained;
      let newLevel = prev.level;
      if (newExp >= prev.maxExp) {
        newLevel += 1;
        newExp = newExp - prev.maxExp;
        showToast(`🎊 NAIK LEVEL! Sekarang Level ${newLevel}!`);
      }
      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        stars: prev.stars + rewardStars,
        gems: prev.gems + rewardGems,
      };
    });

    // Update mission progress
    setMission((m) => {
      const nextCurrent = Math.min(m.target, m.current + 1);
      return {
        ...m,
        current: nextCurrent,
        completed: nextCurrent >= m.target,
      };
    });
  };

  const handleTabClick = (tab: TabType) => {
    playSound(500);
    if (tab === 'peta') {
      setCurrentTab('peta');
      showToast('🗺️ Membuka Peta Petualangan...');
    } else if (tab === 'beranda') {
      setCurrentTab('beranda');
      showToast('🏠 Anda berada di Beranda');
    } else if (tab === 'prestasi') {
      setActiveModal('prestasi');
    } else if (tab === 'materi') {
      setActiveModal('materi');
    } else if (tab === 'profil') {
      setActiveModal('profile');
    }
  };

  const handlePlayLevel = (lvlNum: number) => {
    setCurrentGameLevel(lvlNum);
    setActiveModal('game');
  };

  return (
    <div className="mobile-app-wrapper">
      {/* Toast Notifikasi */}
      {toastMessage && (
        <div className="game-toast-banner">
          {toastMessage}
        </div>
      )}

      {/* Frame Layar Game Murni Satu Gambar Asli */}
      <main className="game-screen-frame">
        {currentTab === 'peta' ? (
          /* ==========================================================
             TAMPILAN PETA PETUALANGAN (IDENTIK & INTERAKTIF)
             ========================================================== */
          <PetaScreen
            player={player}
            mission={mission}
            onBack={() => {
              setCurrentTab('beranda');
              showToast('🏠 Kembali ke Beranda');
            }}
            onNavigateTab={handleTabClick}
            onPlayLevel={handlePlayLevel}
            onAddStars={handleAddStars}
            onAddGems={handleAddGems}
            onOpenProfile={() => setActiveModal('profile')}
            onOpenSettings={() => setActiveModal('settings')}
            onOpenMateri={() => setActiveModal('materi')}
            onOpenPrestasi={() => setActiveModal('prestasi')}
            showToast={showToast}
            playSound={playSound}
          />
        ) : (
          /* ==========================================================
             TAMPILAN BERANDA UTAMA
             ========================================================== */
          <div className="pure-game-image-wrapper">
            {/* Gambar Asli Tanpa Timpaan Apapun */}
            <img
              src={gameBg}
              alt="Petualangan Bangun Datar"
              className="pure-game-image"
            />

            {/* Area Interaktif Tak Kasat Mata (Seamless & Transparan) */}
            {/* 1. Profil Siswa */}
            <button
              type="button"
              className="invisible-hotspot hotspot-profile"
              onClick={() => {
                playSound(550);
                setActiveModal('profile');
              }}
              title="Profil Siswa"
            />

            {/* 2. Tambah Bintang */}
            <button
              type="button"
              className="invisible-hotspot hotspot-star"
              onClick={() => {
                playSound(600);
                handleAddStars(10);
              }}
              title="Tambah Bintang"
            />

            {/* 3. Tambah Berlian */}
            <button
              type="button"
              className="invisible-hotspot hotspot-gem"
              onClick={() => {
                playSound(880);
                handleAddGems(5);
              }}
              title="Tambah Berlian"
            />

            {/* 4. Pengaturan */}
            <button
              type="button"
              className="invisible-hotspot hotspot-settings"
              onClick={() => {
                playSound(550);
                setActiveModal('settings');
              }}
              title="Pengaturan"
            />

            {/* 5. Misi Hari Ini */}
            <button
              type="button"
              className="invisible-hotspot hotspot-mission"
              onClick={() => {
                playSound(720);
                showToast(`📋 Misi Hari Ini: ${mission.desc} (${mission.current}/${mission.target})`);
              }}
              title="Misi Hari Ini"
            />

            {/* 6. Tombol Mulai Petualangan -> Membuka Peta Petualangan */}
            <button
              type="button"
              className="invisible-hotspot hotspot-play"
              onClick={() => {
                playSound(800, 'triangle');
                setCurrentTab('peta');
                showToast('🗺️ Membuka Peta Petualangan...');
              }}
              title="Mulai Petualangan"
            />

            {/* 7. Papan Kayu Kenali Bangun Datar */}
            <button
              type="button"
              className="invisible-hotspot hotspot-signboard"
              onClick={() => {
                playSound(650);
                setActiveModal('materi');
              }}
              title="Kenali Bangun Datar"
            />

            {/* 8. Karakter Segitiga */}
            <button
              type="button"
              className="invisible-hotspot hotspot-character"
              onClick={() => {
                playSound(700);
                showToast('👋 Halo! Aku Si Segitiga Petualang! Ayo buka Peta untuk berpetualang!');
              }}
              title="Si Segitiga"
            />

            {/* 9. Navigasi Bawah */}
            <div className="bottom-nav-hotspots">
              <button
                type="button"
                className="invisible-nav-hotspot"
                onClick={() => handleTabClick('beranda')}
                title="Beranda"
              />
              <button
                type="button"
                className="invisible-nav-hotspot"
                onClick={() => handleTabClick('peta')}
                title="Peta"
              />
              <button
                type="button"
                className="invisible-nav-hotspot"
                onClick={() => handleTabClick('prestasi')}
                title="Prestasi"
              />
              <button
                type="button"
                className="invisible-nav-hotspot"
                onClick={() => handleTabClick('materi')}
                title="Materi"
              />
              <button
                type="button"
                className="invisible-nav-hotspot"
                onClick={() => handleTabClick('profil')}
                title="Profil"
              />
            </div>
          </div>
        )}
      </main>

      {/* ==========================================================
          MODAL INTERAKTIF GLOBAL
          ========================================================== */}
      {activeModal === 'profile' && (
        <ProfileModal
          player={player}
          onSave={(updated) => {
            setPlayer((prev) => ({ ...prev, ...updated }));
            showToast('✅ Profil berhasil diperbarui!');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'settings' && (
        <SettingsModal
          soundEnabled={soundEnabled}
          musicEnabled={musicEnabled}
          onToggleSound={() => setSoundEnabled((v) => !v)}
          onToggleMusic={() => setMusicEnabled((v) => !v)}
          onResetProgress={() => {
            setPlayer({
              name: 'Rizki',
              role: 'Siswa',
              avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4',
              level: 3,
              exp: 65,
              maxExp: 100,
              stars: 120,
              gems: 45,
            });
            setMission((m) => ({ ...m, current: 1, completed: false }));
            showToast('🔄 Data game di-reset!');
          }}
          onCheatCurrency={() => {
            setPlayer((p) => ({ ...p, stars: p.stars + 100, gems: p.gems + 50 }));
            showToast('🎁 Bonus: +100 ⭐ & +50 💎!');
          }}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'materi' && (
        <MateriModal onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'game' && (
        <GamePlayModal
          levelNumber={currentGameLevel}
          onWinReward={handleWinReward}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'prestasi' && (
        <PrestasiModal
          onClaimReward={(reward) => {
            playSound(950);
            setPlayer((p) => ({ ...p, stars: p.stars + reward }));
            showToast(`🏆 Klaim ⭐ +${reward} Bintang!`);
          }}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
