import React, { useState } from 'react';

interface GameHeroProps {
  onStartAdventure: () => void;
  onExploreShapes: () => void;
}

export const GameHero: React.FC<GameHeroProps> = ({
  onStartAdventure,
  onExploreShapes,
}) => {
  const [characterMood, setCharacterMood] = useState<'happy' | 'excited' | 'wink'>('happy');

  const handleCharacterClick = () => {
    const moods: ('happy' | 'excited' | 'wink')[] = ['happy', 'excited', 'wink'];
    const nextMood = moods[(moods.indexOf(characterMood) + 1) % moods.length];
    setCharacterMood(nextMood);
  };

  return (
    <div className="game-hero-container">
      {/* 3D TITLE LOGO */}
      <div className="title-logo-container">
        {/* Dekorasi Bentuk Geometris di Belakang Judul */}
        <div className="title-shapes-backdrop">
          <div className="deco-shape deco-triangle"></div>
          <div className="deco-shape deco-flag"></div>
          <div className="deco-shape deco-circle"></div>
          <div className="deco-shape deco-square"></div>
        </div>

        <div className="title-box">
          <h1 className="title-top">Petualangan</h1>
          <h1 className="title-main">Bangun Datar</h1>
          <div className="title-ribbon">
            <span>Jelajahi Dunia, Temukan Bentuknya!</span>
          </div>
        </div>
      </div>

      {/* TOMBOL UTAMA: MULAI PETUALANGAN */}
      <div className="main-play-btn-wrapper">
        <button 
          type="button" 
          className="btn-mulai-petualangan"
          onClick={onStartAdventure}
        >
          <div className="play-icon-circle">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <span className="play-btn-text">Mulai Petualangan</span>
        </button>
      </div>

      {/* AREA ILUSTRASI KARAKTER & ALAM */}
      <div className="hero-scene">
        {/* Papan Kayu 'Kenali Bangun Datar' di Kiri */}
        <button 
          type="button" 
          className="wooden-signboard"
          onClick={onExploreShapes}
          title="Klik untuk belajar aneka bangun datar"
        >
          <div className="sign-board">
            <span className="sign-line1">Kenali</span>
            <span className="sign-line2">Bangun Datar</span>
            <span className="sign-arrow">❯</span>
          </div>
          <div className="sign-post sign-post-left"></div>
          <div className="sign-post sign-post-right"></div>
        </button>

        {/* Karakter Utama: Si Segitiga Petualang */}
        <div 
          className="character-triangle-walker"
          onClick={handleCharacterClick}
          title="Klik aku untuk ganti ekspresi!"
        >
          {/* Tas Ransel Biru */}
          <div className="character-backpack">
            <div className="backpack-strap"></div>
            <div className="backpack-buckle"></div>
          </div>

          {/* Badan Segitiga Kuning */}
          <div className="triangle-body">
            {/* Mata */}
            <div className="character-eyes">
              {characterMood === 'wink' ? (
                <>
                  <div className="character-eye eye-wink">^</div>
                  <div className="character-eye eye-open">
                    <div className="pupil"></div>
                    <div className="pupil-highlight"></div>
                  </div>
                </>
              ) : (
                <>
                  <div className="character-eye eye-open">
                    <div className="pupil"></div>
                    <div className="pupil-highlight"></div>
                  </div>
                  <div className="character-eye eye-open">
                    <div className="pupil"></div>
                    <div className="pupil-highlight"></div>
                  </div>
                </>
              )}
            </div>

            {/* Mulut */}
            <div className={`character-mouth ${characterMood === 'excited' ? 'mouth-excited' : 'mouth-smile'}`}>
              <div className="tongue"></div>
            </div>

            {/* Pipi Merona */}
            <div className="character-blush blush-left"></div>
            <div className="character-blush blush-right"></div>
          </div>

          {/* Tangan */}
          <div className="character-arm arm-left"></div>
          <div className="character-arm arm-right"></div>

          {/* Kaki dan Sepatu Boots */}
          <div className="character-leg leg-left">
            <div className="boot"></div>
          </div>
          <div className="character-leg leg-right">
            <div className="boot"></div>
          </div>
        </div>

        {/* Teman-teman Bentuk Lain di Sebelah Kanan (Lingkaran, Persegi, Prisma) */}
        <div className="shape-friends">
          {/* Si Lingkaran Merah */}
          <div className="friend-circle" title="Lingkaran Merah">
            <div className="friend-eyes grumpy-eyes">
              <span>●</span>
              <span>●</span>
            </div>
            <div className="friend-mouth grumpy-mouth">─</div>
          </div>

          {/* Si Persegi Biru */}
          <div className="friend-square" title="Persegi Biru">
            <div className="friend-eyes curious-eyes">
              <span>●</span>
              <span>●</span>
            </div>
            <div className="friend-mouth curious-mouth">_</div>
          </div>

          {/* Si Segitiga Ungu */}
          <div className="friend-triangle" title="Segitiga Ungu">
            <div className="friend-eyes sleepy-eyes">
              <span>^</span>
              <span>^</span>
            </div>
            <div className="friend-mouth sleepy-mouth">v</div>
          </div>
        </div>
      </div>
    </div>
  );
};
