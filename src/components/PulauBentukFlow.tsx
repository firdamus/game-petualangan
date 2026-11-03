import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PlayerData } from '../types';

// Asset Images from the asset pack
import stageBg from '../assets/minigame/stage-bg.jpeg';
import charTriangleImg from '../assets/minigame/char-triangle.png';
import pauseBtnImg from '../assets/minigame/pause-btn.jpeg';
import coinBadgeImg from '../assets/minigame/coin-badge.jpeg';
import starsBadgeImg from '../assets/minigame/stars-badge.jpeg';
import shapeTriangleImg from '../assets/minigame/shape-triangle.png';
import shapeCubeImg from '../assets/minigame/shape-cube.png';

interface PulauBentukFlowProps {
  player: PlayerData;
  onClose: () => void;
  onWinReward: (stars: number, gems: number, exp: number) => void;
  showToast: (msg: string) => void;
  playSound: (freq?: number, type?: OscillatorType) => void;
}

type StageType = 'peta' | 'detail' | 'eksplorasi' | 'soal' | 'hasil';

interface CollectibleItem {
  id: string;
  type: 'coin' | 'shape-tri' | 'shape-cube' | 'shape-circle';
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  value: number;
  label: string;
}

const COLLECTIBLES_LIST: CollectibleItem[] = [
  { id: 'shape-tri', type: 'shape-tri', x: 22, y: 28, value: 5, label: '▲ Segitiga Kuning Ditemukan!' },
  { id: 'coin-1', type: 'coin', x: 27, y: 36, value: 2, label: '+2 Koin' },
  { id: 'shape-cube', type: 'shape-cube', x: 52, y: 45, value: 5, label: '■ Kubus Biru Ditemukan!' },
  { id: 'coin-2', type: 'coin', x: 48, y: 60, value: 2, label: '+2 Koin' },
  { id: 'coin-3', type: 'coin', x: 59, y: 62, value: 2, label: '+2 Koin' },
  { id: 'shape-circle', type: 'shape-circle', x: 80, y: 38, value: 5, label: '● Lingkaran Pink Ditemukan!' },
];

export const PulauBentukFlow: React.FC<PulauBentukFlowProps> = ({
  player,
  onClose,
  onWinReward,
  showToast,
  playSound,
}) => {
  // Current active screen stage (defaults to 'detail' as in level flow)
  const [stage, setStage] = useState<StageType>('detail');
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);
  const [showPauseModal, setShowPauseModal] = useState<boolean>(false);

  // ==========================================================
  // EKSPLORASI & MINI GAME STATE (SCREEN 3)
  // ==========================================================
  const [coins, setCoins] = useState<number>(12); // starts at 12 as shown in reference
  const [collectedShapes, setCollectedShapes] = useState<number>(3); // starts at 3/5 as shown in reference
  const [charX, setCharX] = useState<number>(24); // starting X on Island 1
  const [charY, setCharY] = useState<number>(26); // starting Y ground height
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [facingRight, setFacingRight] = useState<boolean>(true);
  const [isHurt, setIsHurt] = useState<boolean>(false);
  const [splashEffect, setSplashEffect] = useState<boolean>(false);
  const [reachedFlag, setReachedFlag] = useState<boolean>(false);
  const [activeBtnRing, setActiveBtnRing] = useState<'left' | 'right' | 'jump' | null>(null);

  // Collected items tracking
  const [collectedItemIds, setCollectedItemIds] = useState<string[]>([]);
  // Floating particle feedback
  const [floatingFeedback, setFloatingFeedback] = useState<{ text: string; x: number; y: number } | null>(null);

  // Interval ref for continuous hold-to-move
  const moveIntervalRef = useRef<number | null>(null);
  const charXRef = useRef<number>(24);
  const charYRef = useRef<number>(26);
  const isJumpingRef = useRef<boolean>(false);

  useEffect(() => {
    charXRef.current = charX;
  }, [charX]);

  useEffect(() => {
    charYRef.current = charY;
  }, [charY]);

  useEffect(() => {
    isJumpingRef.current = isJumping;
  }, [isJumping]);

  // ==========================================================
  // SOAL & HASIL STATE (SCREEN 4 & 5)
  // ==========================================================
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(45);
  const [quizAnswered, setQuizAnswered] = useState<boolean>(false);

  // Ground collision helper
  const getGroundY = useCallback((x: number): number => {
    // Island 1 (Lower Left Platform): x: 6% - 36%
    if (x >= 6 && x <= 36) return 26;
    // Island 2 (Central Floating Island): x: 39% - 64%
    if (x >= 39 && x <= 64) return 40;
    // Island 3 (Right Checkpoint Island): x: 68% - 94%
    if (x >= 68 && x <= 94) return 26;
    // Chasm / Water Gap
    return -10;
  }, []);

  // Check collision with collectible items
  const checkItemPickups = useCallback((x: number, y: number) => {
    COLLECTIBLES_LIST.forEach((item) => {
      if (collectedItemIds.includes(item.id)) return;
      const dx = Math.abs(x - item.x);
      const dy = Math.abs(y - item.y);
      if (dx < 10 && dy < 14) {
        setCollectedItemIds((prev) => [...prev, item.id]);
        if (item.type === 'coin') {
          playSound(880, 'sine');
          setCoins((c) => c + item.value);
        } else {
          playSound(980, 'triangle');
          setCollectedShapes((s) => Math.min(5, s + 1));
        }
        setFloatingFeedback({ text: item.label, x: item.x, y: item.y + 10 });
        setTimeout(() => setFloatingFeedback(null), 1400);
      }
    });
  }, [collectedItemIds, playSound]);

  // Check goal reaching or fall hazards
  const checkHazardsAndGoal = useCallback((x: number, _y: number, jumping: boolean) => {
    // Reached Flag Checkpoint on right island
    if (x >= 74) {
      if (!reachedFlag) {
        setReachedFlag(true);
        playSound(1050, 'triangle');
        showToast('🚩 Titik tantangan tercapai!');
      }
    }

    // Fall into water chasm
    if (!jumping) {
      const ground = getGroundY(x);
      if (ground < 0) {
        setIsHurt(true);
        setSplashEffect(true);
        playSound(320, 'sine');
        showToast('💧 Terpeleset ke air terjun! Respawn aman di pulau.');
        setTimeout(() => {
          setCharX(20);
          setCharY(26);
          setSplashEffect(false);
          setIsHurt(false);
        }, 550);
      }
    }
  }, [reachedFlag, getGroundY, playSound, showToast]);

  // Update character coordinate
  const updateCharacterPos = useCallback((newX: number) => {
    const clampedX = Math.max(6, Math.min(92, newX));
    setCharX(clampedX);

    if (!isJumpingRef.current) {
      const ground = getGroundY(clampedX);
      if (ground >= 0) {
        setCharY(ground);
      }
    }

    checkItemPickups(clampedX, charYRef.current);
    checkHazardsAndGoal(clampedX, charYRef.current, isJumpingRef.current);
  }, [getGroundY, checkItemPickups, checkHazardsAndGoal]);

  // Move left
  const moveLeftStep = useCallback(() => {
    setFacingRight(false);
    playSound(420);
    const nextX = Math.max(6, charXRef.current - 4);
    updateCharacterPos(nextX);
  }, [playSound, updateCharacterPos]);

  // Move right
  const moveRightStep = useCallback(() => {
    setFacingRight(true);
    playSound(450);
    const nextX = Math.min(92, charXRef.current + 4);
    updateCharacterPos(nextX);
  }, [playSound, updateCharacterPos]);

  // Hold-to-move pointer handlers (prevents double fire with onClick)
  const handleStartMoveLeft = () => {
    setActiveBtnRing('left');
    moveLeftStep();
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = window.setInterval(moveLeftStep, 90);
  };

  const handleStartMoveRight = () => {
    setActiveBtnRing('right');
    moveRightStep();
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    moveIntervalRef.current = window.setInterval(moveRightStep, 90);
  };

  const handleStopMove = () => {
    setActiveBtnRing(null);
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  // Jump Action (Lompat)
  const handleJump = useCallback(() => {
    if (isJumpingRef.current) return;
    setActiveBtnRing('jump');
    setTimeout(() => setActiveBtnRing(null), 300);
    playSound(620, 'triangle');
    setIsJumping(true);

    const startGround = getGroundY(charXRef.current);
    const jumpApex = (startGround > 0 ? startGround : 26) + 24;

    // Upward arc
    setCharY(jumpApex);

    // Land on ground
    setTimeout(() => {
      const currentX = charXRef.current;
      const landingGround = getGroundY(currentX);
      if (landingGround >= 0) {
        setCharY(landingGround);
      } else {
        setCharY(4);
      }
      setIsJumping(false);
      checkItemPickups(currentX, landingGround >= 0 ? landingGround : 4);
      checkHazardsAndGoal(currentX, landingGround >= 0 ? landingGround : 4, false);
    }, 400);
  }, [playSound, getGroundY, checkItemPickups, checkHazardsAndGoal]);

  // Keyboard navigation for Desktop / Arrow keys / WASD
  useEffect(() => {
    if (stage !== 'eksplorasi') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveLeftStep();
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveRightStep();
      } else if (e.key === 'ArrowUp' || e.key === ' ' || e.key === 'w' || e.key === 'W') {
        handleJump();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stage, moveLeftStep, moveRightStep, handleJump]);

  // Timer for Screen 4 (Soal)
  useEffect(() => {
    if (stage !== 'soal') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(interval);
  }, [stage]);

  const handleFinishEksplorasi = () => {
    playSound(750);
    showToast('🚀 Menuju Titik Tantangan Soal!');
    setStage('soal');
  };

  // 5 Questions for Screen 4 (Matching reference designs & examples)
  const quizList = [
    {
      question: 'Benda di bawah ini berbentuk apa?',
      targetType: 'house',
      targetName: 'Rumah (Atap & Dinding)',
      options: [
        { label: 'Segitiga', icon: '▲', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Persegi', icon: '■', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Persegi Panjang', icon: '▬', color: '#10b981', bg: '#d1fae5' },
        { label: 'Lingkaran', icon: '●', color: '#ec4899', bg: '#fce7f3' },
      ],
      correctIndex: 1, // Persegi (matches the checkmark in the image)
      explanation: 'Dinding dan bentuk utama rumah adalah Persegi dengan 4 sisi sama panjang!',
    },
    {
      question: 'Atap rumah pada gambar di bawah ini berbentuk apa?',
      targetType: 'roof',
      targetName: 'Atap Rumah Merah',
      options: [
        { label: 'Segitiga', icon: '▲', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Persegi', icon: '■', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Persegi Panjang', icon: '▬', color: '#10b981', bg: '#d1fae5' },
        { label: 'Lingkaran', icon: '●', color: '#ec4899', bg: '#fce7f3' },
      ],
      correctIndex: 0,
      explanation: 'Atap rumah memiliki 3 sisi lurus dan 3 sudut lancip, yaitu Segitiga!',
    },
    {
      question: 'Berapa banyak sisi yang dimiliki oleh bangun datar Segitiga?',
      targetType: 'triangle-sides',
      targetName: 'Ciri Segitiga',
      options: [
        { label: '3 sisi', icon: '3', color: '#10b981', bg: '#d1fae5' },
        { label: '4 sisi', icon: '4', color: '#3b82f6', bg: '#dbeafe' },
        { label: '5 sisi', icon: '5', color: '#f59e0b', bg: '#fef3c7' },
        { label: '6 sisi', icon: '6', color: '#8b5cf6', bg: '#ede9fe' },
      ],
      correctIndex: 0,
      explanation: 'Segitiga selalu dibentuk oleh tepat 3 sisi lurus dan 3 sudut!',
    },
    {
      question: 'Manakah di bawah ini benda yang berbentuk Lingkaran?',
      targetType: 'circle-item',
      targetName: 'Benda Lingkaran',
      options: [
        { label: 'Jam Dinding Bundar', icon: '⏰', color: '#ec4899', bg: '#fce7f3' },
        { label: 'Tenda Segitiga', icon: '⛺', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Buku Tulis', icon: '📘', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Papan Catur Persegi', icon: '♟️', color: '#64748b', bg: '#f1f5f9' },
      ],
      correctIndex: 0,
      explanation: 'Jam dinding bundar berbentuk lingkaran sempurna tanpa sudut!',
    },
    {
      question: 'Bentuk bangun datar apa yang tepat untuk bingkai jendela rumah?',
      targetType: 'window-shape',
      targetName: 'Jendela Rumah',
      options: [
        { label: 'Persegi', icon: '■', color: '#3b82f6', bg: '#dbeafe' },
        { label: 'Segitiga', icon: '▲', color: '#f59e0b', bg: '#fef3c7' },
        { label: 'Lingkaran', icon: '●', color: '#ec4899', bg: '#fce7f3' },
        { label: 'Trapesium', icon: '⏢', color: '#8b5cf6', bg: '#ede9fe' },
      ],
      correctIndex: 0,
      explanation: 'Bingkai jendela rumah memiliki 4 sisi sama panjang dan sudut siku-siku (Persegi)!',
    },
  ];

  const currentQuiz = quizList[questionIndex] || quizList[0];

  const handleSelectQuizOption = (idx: number) => {
    if (quizAnswered) return;
    setSelectedOption(idx);
    setQuizAnswered(true);

    if (idx === currentQuiz.correctIndex) {
      playSound(880);
      setQuizScore((s) => s + 1);
    } else {
      playSound(300, 'sawtooth');
    }
  };

  const handleNextQuiz = () => {
    playSound(520);
    if (questionIndex + 1 < quizList.length) {
      setQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setQuizAnswered(false);
    } else {
      setStage('hasil');
    }
  };

  const handleClaimReward = () => {
    playSound(950);
    onWinReward(460, 5, 100);
    showToast('🎉 Selamat! Level 1 Berhasil Diselesaikan! +460 Skor, +100 XP!');
    onClose();
  };

  return (
    <div className="flow-container-fullscreen">
      {/* ==========================================================
          TOP NAVIGATION STEP SELECTOR (Fleksibel & Bersih)
          ========================================================== */}
      <div className="flow-stage-tabs-header">
        <div className="flow-stage-tabs-scroll">
          <button
            type="button"
            className={`flow-tab-btn ${stage === 'peta' ? 'active' : ''}`}
            onClick={() => { playSound(480); setStage('peta'); }}
          >
            1. Peta Dunia
          </button>
          <button
            type="button"
            className={`flow-tab-btn ${stage === 'detail' ? 'active' : ''}`}
            onClick={() => { playSound(480); setStage('detail'); }}
          >
            2. Detail Level
          </button>
          <button
            type="button"
            className={`flow-tab-btn ${stage === 'eksplorasi' ? 'active' : ''}`}
            onClick={() => { playSound(480); setStage('eksplorasi'); }}
          >
            3. Eksplorasi 🎮
          </button>
          <button
            type="button"
            className={`flow-tab-btn ${stage === 'soal' ? 'active' : ''}`}
            onClick={() => { playSound(480); setStage('soal'); }}
          >
            4. Soal / Kuis
          </button>
          <button
            type="button"
            className={`flow-tab-btn ${stage === 'hasil' ? 'active' : ''}`}
            onClick={() => { playSound(480); setStage('hasil'); }}
          >
            5. Hasil Level
          </button>
        </div>

        <button
          type="button"
          className="flow-rules-pill-btn"
          onClick={() => { playSound(620); setShowRuleModal(true); }}
        >
          📖 Panduan
        </button>

        <button
          type="button"
          className="flow-close-btn"
          onClick={onClose}
          title="Tutup Petualangan"
        >
          ✕
        </button>
      </div>

      {/* ==========================================================
          1. SCREEN 1: PETA DUNIA (PULAU BENTUK)
          ========================================================== */}
      {stage === 'peta' && (
        <div className="stage-screen-body stage-peta-view">
          <div className="game-top-bar-transparent">
            <div className="avatar-chip">
              <img src={player.avatar} alt="Avatar" className="chip-avatar-img" />
              <div className="chip-info">
                <span className="chip-name">{player.name}</span>
                <span className="chip-level">Level {player.level}</span>
              </div>
            </div>

            <div className="currency-pill star-pill">
              <span>⭐</span>
              <strong>{player.stars}</strong>
            </div>

            <div className="currency-pill gem-pill">
              <span>💎</span>
              <strong>{player.gems}</strong>
            </div>
          </div>

          <div className="stage-title-banner-wooden">
            <button type="button" className="round-back-btn" onClick={onClose}>
              ‹
            </button>
            <div className="wooden-banner-box">
              <span className="wooden-main-text">Pulau Bentuk</span>
              <span className="wooden-sub-text">Mengenali bentuk dasar</span>
            </div>
          </div>

          <div className="map-island-viewport">
            <div className="level-nodes-container">
              <button
                type="button"
                className="map-node-button node-active"
                onClick={() => {
                  playSound(700);
                  setStage('detail');
                }}
              >
                <span className="node-num">1</span>
                <div className="node-stars">★★★</div>
              </button>

              <div className="map-character-avatar" onClick={() => playSound(650)}>
                <img
                  src={charTriangleImg}
                  alt="Si Segitiga"
                  style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                />
              </div>

              {[2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  className="map-node-button node-locked"
                  onClick={() => {
                    playSound(300, 'sawtooth');
                    showToast(`🔒 Level ${num} terkunci! Selesaikan level sebelumnya.`);
                  }}
                >
                  <span>🔒 {num}</span>
                </button>
              ))}
            </div>

            <div className="hadiah-dunia-card">
              <div className="hadiah-header">
                <strong>Hadiah Dunia</strong>
                <span className="progress-badge">1/6</span>
              </div>
              <div className="hadiah-shapes-row">
                <span style={{ color: '#f59e0b', fontSize: '18px' }}>▲</span>
                <span style={{ color: '#3b82f6', fontSize: '18px' }}>■</span>
                <span style={{ color: '#ec4899', fontSize: '18px' }}>●</span>
                <div className="hadiah-prog-bar">
                  <div className="prog-bar-fill" style={{ width: '16.6%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="screen-caption-footer">
            <strong>1. Peta Dunia:</strong> Pilih dunia dan level. Level 1 sudah terbuka, tekan untuk masuk petualangan!
          </div>
        </div>
      )}

      {/* ==========================================================
          2. SCREEN 2: DETAIL LEVEL (GERBANG PULAU BENTUK)
          ========================================================== */}
      {stage === 'detail' && (
        <div className="stage-screen-body stage-detail-view">
          <div className="detail-top-bar">
            <button type="button" className="round-back-btn" onClick={() => setStage('peta')}>
              ‹
            </button>
            <div className="top-counters">
              <div className="counter-chip">
                <span>⭐</span>
                <strong>{player.stars}</strong>
              </div>
              <div className="counter-chip" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <img src={coinBadgeImg} alt="Koin" style={{ height: '18px', objectFit: 'contain' }} />
                <strong>{coins}</strong>
              </div>
            </div>
          </div>

          <div className="detail-title-card">
            <div className="wooden-banner-box large-banner">
              <span className="wooden-main-text">Level 1</span>
              <div className="blue-ribbon-tag">Gerbang Pulau Bentuk</div>
            </div>
          </div>

          <div className="objective-white-card">
            <div className="tujuan-title">Tujuan:</div>
            <p className="tujuan-desc">
              Mengenali persegi, segitiga, persegi panjang, dan lingkaran.
            </p>

            <div className="detail-star-row">
              <span className="star-empty">★</span>
              <span className="star-empty">★</span>
              <span className="star-empty">★</span>
              <span className="star-empty">★</span>
            </div>

            <div className="detail-badges-row">
              <span className="badge-pill">⏱️ 3-5 menit</span>
              <span className="badge-pill">🎯 3 tantangan</span>
            </div>
          </div>

          <div className="detail-character-showcase">
            <img
              src={charTriangleImg}
              alt="Mascot Si Segitiga"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 10px 18px rgba(0,0,0,0.25))',
                animation: 'bounce 2.2s infinite ease-in-out',
              }}
            />
          </div>

          <div className="detail-action-footer">
            <button
              type="button"
              className="btn-mulai-glossy"
              onClick={() => {
                playSound(800, 'triangle');
                setStage('eksplorasi');
              }}
            >
              Mulai Petualangan 🎮
            </button>
          </div>

          <div className="screen-caption-footer">
            <strong>2. Detail Level:</strong> Informasi tujuan, estimasi waktu, dan tantangan. Tekan Mulai untuk bermain!
          </div>
        </div>
      )}

      {/* ==========================================================
          3. SCREEN 3: EKSPLORASI & KUMPULKAN (MINI GAME REAL DARI FOTO ASSET)
          ========================================================== */}
      {stage === 'eksplorasi' && (
        <div className="stage-screen-body stage-eksplorasi-view">
          {/* Container Frame Game Eksplorasi Bersih & Jernih menggunakan Foto Asli */}
          <div
            className="pure-game-image-wrapper minigame-frame"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              backgroundColor: '#38bdf8',
            }}
          >
            {/* Foto Asli Mini Game (100% Jelas, Resolusi Penuh & Tajam) */}
            <img
              src={stageBg}
              alt="Eksplorasi Pulau Bentuk Mini Game"
              className="pure-game-image eksplorasi-image-crisp"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill',
                display: 'block',
                userSelect: 'none',
              }}
            />

            {/* ==========================================================
                DYNAMIC HUD OVERLAYS (TERHUBUNG KE STATE GAME)
                ========================================================== */}

            {/* 1. Hotspot Tombol Pause */}
            <button
              type="button"
              className="invisible-hotspot hotspot-eksplorasi-pause"
              onClick={() => {
                playSound(500);
                setShowPauseModal(true);
              }}
              title="Jeda Game"
            />

            {/* 2. Dynamic Live Coin Counter Badge */}
            <div
              className="hotspot-eksplorasi-coin"
              onClick={() => {
                playSound(880);
                setCoins((c) => c + 2);
                showToast(`🪙 Koin bertambah! Total: ${coins + 2}`);
              }}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 22,
              }}
              title="Koin Terkumpul"
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: 900,
                  marginLeft: '14px',
                  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
                }}
              >
                {coins}
              </span>
            </div>

            {/* 3. Live Shape Mission Counter Badge (3/5 -> 4/5 -> 5/5) */}
            <div
              className="hotspot-eksplorasi-card"
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '12px',
                pointerEvents: 'none',
                zIndex: 22,
              }}
            >
              <span
                style={{
                  color: '#1e3a8a',
                  fontSize: '13px',
                  fontWeight: 900,
                  background: 'rgba(255,255,255,0.92)',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                }}
              >
                {collectedShapes}/5
              </span>
            </div>

            {/* ==========================================================
                INTERACTIVE COLLECTIBLE SHAPES & COINS ON STAGE
                ========================================================== */}

            {/* Collectible 1: Yellow Triangle (Pulau Kiri Bawah) */}
            {!collectedItemIds.includes('shape-tri') && (
              <div
                className="stage-collectible-wrapper"
                style={{
                  position: 'absolute',
                  left: '16%',
                  bottom: '26%',
                  zIndex: 15,
                  cursor: 'pointer',
                  animation: 'itemPulse 2s infinite ease-in-out',
                }}
                onClick={() => checkItemPickups(22, 28)}
                title="▲ Klik untuk ambil Segitiga Kuning!"
              >
                <img
                  src={shapeTriangleImg}
                  alt="Segitiga Kuning"
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.9))',
                  }}
                />
              </div>
            )}

            {/* Collectible 2: Blue Cube (Pulau Melayang Tengah) */}
            {!collectedItemIds.includes('shape-cube') && (
              <div
                className="stage-collectible-wrapper"
                style={{
                  position: 'absolute',
                  left: '49%',
                  bottom: '44%',
                  zIndex: 15,
                  cursor: 'pointer',
                  animation: 'itemPulse 2.2s infinite ease-in-out',
                }}
                onClick={() => checkItemPickups(52, 45)}
                title="■ Klik untuk ambil Kubus Biru!"
              >
                <img
                  src={shapeCubeImg}
                  alt="Kubus Biru"
                  style={{
                    width: '34px',
                    height: '34px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.9))',
                  }}
                />
              </div>
            )}

            {/* Collectible 3: Coin 1 (Mid air kiri) */}
            {!collectedItemIds.includes('coin-1') && (
              <div
                style={{
                  position: 'absolute',
                  left: '26%',
                  bottom: '36%',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'rgba(250, 204, 21, 0.4)',
                  boxShadow: '0 0 10px #facc15',
                  cursor: 'pointer',
                  zIndex: 16,
                  animation: 'pulse 1.6s infinite',
                }}
                onClick={() => checkItemPickups(27, 36)}
                title="🪙 Koin Emas"
              />
            )}

            {/* Collectible 4: Coin 2 (Mid air atas) */}
            {!collectedItemIds.includes('coin-2') && (
              <div
                style={{
                  position: 'absolute',
                  left: '47%',
                  bottom: '60%',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'rgba(250, 204, 21, 0.4)',
                  boxShadow: '0 0 10px #facc15',
                  cursor: 'pointer',
                  zIndex: 16,
                  animation: 'pulse 1.8s infinite',
                }}
                onClick={() => checkItemPickups(48, 60)}
                title="🪙 Koin Emas"
              />
            )}

            {/* Collectible 5: Coin 3 (Mid air atas) */}
            {!collectedItemIds.includes('coin-3') && (
              <div
                style={{
                  position: 'absolute',
                  left: '58%',
                  bottom: '62%',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'rgba(250, 204, 21, 0.4)',
                  boxShadow: '0 0 10px #facc15',
                  cursor: 'pointer',
                  zIndex: 16,
                  animation: 'pulse 2s infinite',
                }}
                onClick={() => checkItemPickups(59, 62)}
                title="🪙 Koin Emas"
              />
            )}

            {/* Hotspot Bendera Merah / Titik Akhir Checkpoint */}
            <button
              type="button"
              className="invisible-hotspot hotspot-stage-red-flag"
              onClick={() => {
                playSound(1050, 'triangle');
                setReachedFlag(true);
                showToast('🚩 Titik tantangan tercapai! Tekan Lanjut ke Soal!');
              }}
              title="🚩 Pos Checkpoint Tantangan"
            />

            {/* ==========================================================
                DYNAMIC PLAYABLE CHARACTER ("Si Segitiga")
                ========================================================== */}
            <div
              className={`player-character-sprite ${isHurt ? 'sprite-hurt-shake' : ''}`}
              style={{
                position: 'absolute',
                left: `${charX}%`,
                bottom: `${charY}%`,
                zIndex: 20,
                cursor: 'pointer',
                transform: facingRight ? 'none' : 'scaleX(-1)',
                transition: isJumping
                  ? 'bottom 0.4s cubic-bezier(0.25, 1, 0.5, 1), left 0.12s linear'
                  : 'bottom 0.18s ease-in, left 0.08s linear',
              }}
              onClick={() => {
                playSound(720, 'triangle');
                handleJump();
              }}
              title="Si Segitiga Petualang (Tekan untuk Loncat!)"
            >
              <img
                src={charTriangleImg}
                alt="Si Segitiga"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain',
                  filter: isHurt
                    ? 'drop-shadow(0 0 10px #ef4444)'
                    : 'drop-shadow(0 6px 12px rgba(0,0,0,0.35))',
                }}
              />
              <div className="character-moving-halo" />
            </div>

            {/* Water Splash Animation upon slipping into water */}
            {splashEffect && (
              <div
                className="water-splash-animation"
                style={{
                  position: 'absolute',
                  left: `${charX}%`,
                  bottom: '6%',
                  zIndex: 25,
                  fontSize: '16px',
                  fontWeight: 900,
                  color: '#38bdf8',
                  textShadow: '0 2px 8px #ffffff',
                  animation: 'popUp 0.4s ease-out',
                }}
              >
                💦 SPLASH!
              </div>
            )}

            {/* Floating Particle Toast (Points / Item Pickup) */}
            {floatingFeedback && (
              <div
                className="floating-particle-toast"
                style={{
                  position: 'absolute',
                  left: `${floatingFeedback.x}%`,
                  bottom: `${floatingFeedback.y}%`,
                  zIndex: 30,
                  background: 'rgba(15, 23, 42, 0.88)',
                  color: '#facc15',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  border: '1px solid #facc15',
                  whiteSpace: 'nowrap',
                  animation: 'floatUp 1.2s ease-out',
                }}
              >
                {floatingFeedback.text}
              </div>
            )}

            {/* ==========================================================
                VIRTUAL TOUCH CONTROLS (TOMBOL PERSIS SEPERTI FOTO)
                ========================================================== */}
            {/* Tombol Kiri */}
            <button
              type="button"
              className="invisible-hotspot hotspot-control-left"
              onPointerDown={handleStartMoveLeft}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              title="Geser Kiri (Tahan / Tap)"
            />

            {/* Tombol Kanan */}
            <button
              type="button"
              className="invisible-hotspot hotspot-control-right"
              onPointerDown={handleStartMoveRight}
              onPointerUp={handleStopMove}
              onPointerLeave={handleStopMove}
              title="Geser Kanan (Tahan / Tap)"
            />

            {/* Tombol Loncat (Up Arrow) */}
            <button
              type="button"
              className="invisible-hotspot hotspot-control-jump"
              onClick={handleJump}
              title="Loncat (Lompat)"
            />

            {/* Feedback Visual Ring saat tombol ditekan */}
            {activeBtnRing === 'left' && <div className="button-press-active-ring ring-left" />}
            {activeBtnRing === 'right' && <div className="button-press-active-ring ring-right" />}
            {activeBtnRing === 'jump' && <div className="button-press-active-ring ring-jump" />}

            {/* Banner Menuju Soal Tantangan saat Checkpoint Tercapai atau 5/5 Bentuk */}
            {(reachedFlag || collectedShapes >= 5) && (
              <div className="stage-checkpoint-finish-banner">
                <button
                  type="button"
                  className="btn-lanjut-soal-banner"
                  onClick={handleFinishEksplorasi}
                >
                  🏁 Tantangan Selesai! Masuk Soal ➔
                </button>
              </div>
            )}
          </div>

          <div className="screen-caption-footer">
            <strong>3. Eksplorasi & Kumpulkan:</strong> Gunakan tombol arah & loncat untuk menjelajah pulau, kumpulkan bangun datar, dan capai bendera merah!
          </div>
        </div>
      )}

      {/* ==========================================================
          4. SCREEN 4: SOAL / TANTANGAN
          ========================================================== */}
      {stage === 'soal' && (
        <div className="stage-screen-body stage-soal-view">
          <div className="quiz-top-bar">
            <button
              type="button"
              className="round-pause-btn"
              onClick={() => {
                playSound(500);
                setShowPauseModal(true);
              }}
            >
              ⏸
            </button>
            <div className="timer-pill">
              ⏱️ <strong>{timeLeft}s</strong>
            </div>
            <div className="quiz-prog-indicator">
              <strong>{questionIndex + 1}/5</strong>
            </div>
          </div>

          <div className="quiz-top-progress-bar">
            <div
              className="prog-fill"
              style={{ width: `${((questionIndex + 1) / 5) * 100}%` }}
            />
          </div>

          <div className="quiz-main-card">
            <h3 className="quiz-header-text">{currentQuiz.question}</h3>

            {/* Illustrated House Visual matching Screen 4 design */}
            <div className="quiz-illustration-box">
              <svg width="180" height="150" viewBox="0 0 200 170">
                <ellipse cx="100" cy="155" rx="80" ry="12" fill="#86efac" opacity="0.6" />

                {/* Red Triangular Roof (Segitiga) */}
                <polygon
                  points="100,20 175,75 25,75"
                  fill="#ef4444"
                  stroke="#b91c1c"
                  strokeWidth="3.5"
                  strokeLinejoin="round"
                />
                <rect x="140" y="30" width="14" height="25" fill="#991b1b" rx="2" />

                {/* Main House Walls (Persegi) */}
                <rect
                  x="45"
                  y="75"
                  width="110"
                  height="75"
                  fill="#fed7aa"
                  stroke="#ea580c"
                  strokeWidth="3.5"
                />

                {/* Blue Square Window (Persegi) */}
                <rect
                  x="110"
                  y="92"
                  width="32"
                  height="32"
                  fill="#60a5fa"
                  stroke="#1d4ed8"
                  strokeWidth="2.5"
                  rx="3"
                />
                <line x1="126" y1="92" x2="126" y2="124" stroke="#ffffff" strokeWidth="2" />
                <line x1="110" y1="108" x2="142" y2="108" stroke="#ffffff" strokeWidth="2" />

                {/* Brown Door (Persegi Panjang) */}
                <rect
                  x="60"
                  y="95"
                  width="28"
                  height="55"
                  fill="#a16207"
                  stroke="#713f12"
                  strokeWidth="2.5"
                  rx="2"
                />
                <circle cx="82" cy="122" r="2.5" fill="#facc15" />
              </svg>
            </div>

            {/* 4 Colored Option Buttons matching the design */}
            <div className="quiz-options-group">
              {currentQuiz.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuiz.correctIndex;

                let optClass = 'quiz-styled-option-btn';
                if (quizAnswered) {
                  if (isCorrect) optClass += ' option-state-correct';
                  else if (isSelected) optClass += ' option-state-wrong';
                }

                return (
                  <button
                    key={opt.label}
                    type="button"
                    className={optClass}
                    style={{
                      borderLeft: `6px solid ${opt.color}`,
                    }}
                    onClick={() => handleSelectQuizOption(idx)}
                  >
                    <span className="opt-shape-symbol" style={{ color: opt.color }}>
                      {opt.icon}
                    </span>
                    <span className="opt-shape-name">{opt.label}</span>
                    {quizAnswered && isCorrect && (
                      <span className="opt-check-badge">✔</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {quizAnswered && (
              <div className="quiz-explanation-box">
                <p className="explanation-text">{currentQuiz.explanation}</p>
                <button
                  type="button"
                  className="btn-next-question"
                  onClick={handleNextQuiz}
                >
                  {questionIndex + 1 < quizList.length ? 'Soal Berikutnya ➔' : 'Lihat Hasil Level 🏆'}
                </button>
              </div>
            )}
          </div>

          <div className="screen-caption-footer">
            <strong>4. Soal / Tantangan:</strong> Pilih jawaban yang benar. Jika salah, muncul penjelasan edukatif dan kesempatan mencoba lagi!
          </div>
        </div>
      )}

      {/* ==========================================================
          5. SCREEN 5: HASIL LEVEL (VICTORY SCREEN)
          ========================================================== */}
      {stage === 'hasil' && (
        <div className="stage-screen-body stage-hasil-view">
          <div className="confetti-sky-layer">
            <span className="confetti c1">🎊</span>
            <span className="confetti c2">✨</span>
            <span className="confetti c3">🎉</span>
            <span className="confetti c4">⭐</span>
          </div>

          <div className="victory-stars-banner">
            <img
              src={starsBadgeImg}
              alt="3 Stars"
              style={{ height: '42px', objectFit: 'contain', filter: 'drop-shadow(0 0 12px #facc15)' }}
            />
          </div>

          <div className="victory-title-ribbon">
            Level Selesai!
          </div>

          <div className="victory-mascot-center">
            <img
              src={charTriangleImg}
              alt="Mascot Victory"
              style={{
                width: '130px',
                height: '130px',
                objectFit: 'contain',
                animation: 'bounce 1.5s infinite ease-in-out',
                filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))',
              }}
            />
          </div>

          <div className="victory-score-card">
            <div className="score-row">
              <div className="score-item">
                <span className="score-icon">⭐</span>
                <span className="score-label">Skor</span>
                <strong className="score-val">460</strong>
              </div>
            </div>

            <div className="score-row">
              <div className="score-item">
                <span className="score-icon xp-circle">XP</span>
                <span className="score-label">XP</span>
                <strong className="score-val text-purple">+100</strong>
              </div>
            </div>

            <div className="score-row">
              <div className="score-item">
                <span className="score-icon check-circle">✔</span>
                <span className="score-label">Jawaban</span>
                <strong className="score-val text-green">
                  {Math.max(4, quizScore + 3)} benar / 5
                </strong>
              </div>
            </div>
          </div>

          <div className="victory-action-buttons">
            <button
              type="button"
              className="btn-lanjutkan-green"
              onClick={handleClaimReward}
            >
              Lanjutkan ➔
            </button>
            <button
              type="button"
              className="btn-ulangi-outline"
              onClick={() => {
                playSound(500);
                setStage('eksplorasi');
                setCoins(12);
                setCollectedItemIds([]);
                setCollectedShapes(3);
                setQuizScore(0);
                setQuestionIndex(0);
                setSelectedOption(null);
                setQuizAnswered(false);
                setCharX(24);
                setCharY(26);
                setReachedFlag(false);
              }}
            >
              🔄 Ulangi
            </button>
          </div>

          <div className="screen-caption-footer">
            <strong>5. Hasil Level:</strong> Menampilkan perolehan skor, bintang, XP, dan koin. Tekan Lanjutkan untuk menyimpan progresmu!
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL PAUSE || (EKSPLORASI)
          ========================================================== */}
      {showPauseModal && (
        <div className="modal-overlay" onClick={() => setShowPauseModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src={pauseBtnImg} alt="Pause" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                <h2 style={{ margin: 0 }}>Game Dijeda</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowPauseModal(false)}>✕</button>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button type="button" className="btn-primary" onClick={() => setShowPauseModal(false)}>
                Lanjutkan Permainan ▶
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowPauseModal(false);
                  setCharX(24);
                  setCharY(26);
                  setCollectedItemIds([]);
                  setCollectedShapes(3);
                  setCoins(12);
                  setReachedFlag(false);
                  showToast('🔄 Eksplorasi diulang dari awal!');
                }}
              >
                🔄 Ulangi Eksplorasi
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setShowPauseModal(false);
                  setStage('soal');
                }}
              >
                Langsung ke Soal Tantangan ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================
          MODAL: PANDUAN & CONTOH SOAL DI PULAU BENTUK
          ========================================================== */}
      {showRuleModal && (
        <div className="modal-overlay" onClick={() => setShowRuleModal(false)}>
          <div className="modal-card wide-card rule-modal-scroll" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>📋</span>
                <h2 style={{ margin: 0, fontSize: '18px' }}>Panduan & Contoh Soal</h2>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setShowRuleModal(false)}>✕</button>
            </div>

            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto', maxHeight: '72vh' }}>
              <div style={{ background: '#f0f9ff', border: '1.5px solid #bae6fd', borderRadius: '16px', padding: '14px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#0369a1' }}>
                  Contoh Soal di Pulau Bentuk
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>1. Identifikasi bentuk</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0' }}>Manakah benda yang berbentuk lingkaran?</div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '20px' }}>
                      <span title="Bola Sepak">⚽</span>
                      <span title="Tenda Segitiga">⛺</span>
                      <span title="Jam Dinding">⏰</span>
                      <span title="Buku">📘</span>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>2. Klasifikasi bentuk</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0' }}>Pilih semua benda yang berbentuk persegi panjang!</div>
                    <div style={{ display: 'flex', gap: '8px', fontSize: '20px' }}>
                      <span title="Meja">🪑</span>
                      <span title="Keju">🧀</span>
                      <span title="Pintu">🚪</span>
                      <span title="Buku">📓</span>
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>3. Ciri-ciri bentuk</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0' }}>Berapa banyak sisi yang dimiliki oleh segitiga?</div>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800 }}>✔ 3 sisi</div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '10px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7' }}>4. Penerapan dalam kehidupan</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, margin: '4px 0' }}>Bentuk bangun datar apa yang tepat untuk jendela ini?</div>
                    <div style={{ fontSize: '12px', color: '#16a34a', fontWeight: 800 }}>✔ Persegi</div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '16px', padding: '14px' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#15803d' }}>
                  Ringkasan Rule & Scoring
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #dcfce7' }}>
                    <span>📝 Soal per level</span>
                    <strong>5 soal</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #dcfce7' }}>
                    <span>✔ Jawaban benar</span>
                    <strong style={{ color: '#16a34a' }}>+100 poin</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #dcfce7' }}>
                    <span>❌ Jawaban salah</span>
                    <span style={{ color: '#dc2626' }}>0 poin (ada penjelasan edukatif & coba lagi)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #dcfce7' }}>
                    <span>🔺 Bonus eksplorasi</span>
                    <strong style={{ color: '#ca8a04' }}>+10 poin / collectible</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #dcfce7' }}>
                    <span>⭐ Bonus tanpa petunjuk</span>
                    <strong style={{ color: '#ea580c' }}>+50 poin</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                    <span>❤️ Nyawa</span>
                    <span style={{ color: '#15803d' }}>Tidak ada hukuman permanen (respawn aman)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-primary" onClick={() => setShowRuleModal(false)}>
                Tutup Panduan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
