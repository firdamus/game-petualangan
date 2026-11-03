import React, { useState } from 'react';

interface GamePlayModalProps {
  levelNumber?: number;
  onWinReward: (stars: number, gems: number, exp: number) => void;
  onClose: () => void;
}

interface Question {
  question: string;
  shapeVisual: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const LEVEL_QUESTIONS: Record<number, Question[]> = {
  1: [
    {
      question: 'Bangun datar manakah yang memiliki 3 sisi dan 3 sudut?',
      shapeVisual: '▲',
      options: ['Persegi', 'Segitiga', 'Lingkaran', 'Persegi Panjang'],
      correctIndex: 1,
      explanation: 'Hebat! Segitiga selalu memiliki 3 sisi lurus dan 3 sudut.',
    },
    {
      question: 'Benda apakah di bawah ini yang berbentuk Lingkaran?',
      shapeVisual: '●',
      options: ['Papan Tulis', 'Roda Sepeda', 'Buku Tulis', 'Atap Rumah'],
      correctIndex: 1,
      explanation: 'Tepat sekali! Roda sepeda berbentuk lingkaran sempurna.',
    },
    {
      question: 'Bangun datar yang memiliki 4 sisi sama panjang dan 4 sudut siku-siku adalah...',
      shapeVisual: '■',
      options: ['Persegi', 'Trapesium', 'Segitiga', 'Lingkaran'],
      correctIndex: 0,
      explanation: 'Luar biasa! Persegi memiliki 4 sisi yang sama persis panjangnya.',
    },
  ],
  2: [
    {
      question: 'Berapa banyak sudut siku-siku (90 derajat) yang dimiliki sebuah Persegi Panjang?',
      shapeVisual: '▭',
      options: ['2 sudut', '3 sudut', '4 sudut', 'Tidak ada'],
      correctIndex: 2,
      explanation: 'Tepat! Persegi panjang memiliki 4 sudut yang semuanya 90° (siku-siku).',
    },
    {
      question: 'Jika keliling persegi adalah 20 cm, berapakah panjang setiap sisinya? (K = 4 × s)',
      shapeVisual: '■',
      options: ['4 cm', '5 cm', '10 cm', '8 cm'],
      correctIndex: 1,
      explanation: 'Benar! s = K ÷ 4 = 20 ÷ 4 = 5 cm.',
    },
    {
      question: 'Segitiga dengan dua sisi yang sama panjang disebut segitiga...',
      shapeVisual: '▲',
      options: ['Sama Sisi', 'Sama Kaki', 'Sembarang', 'Siku-Siku'],
      correctIndex: 1,
      explanation: 'Pintar! Segitiga sama kaki memiliki 2 sisi dan 2 sudut yang sama besar.',
    },
  ],
};

export const GamePlayModal: React.FC<GamePlayModalProps> = ({
  levelNumber = 1,
  onWinReward,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const activeQuestions = LEVEL_QUESTIONS[levelNumber] || LEVEL_QUESTIONS[1];
  const q = activeQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedAnswer(idx);
    setIsAnswered(true);

    const isCorrect = idx === q.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < activeQuestions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setGameFinished(true);
      const finalScore = score;
      const rewardStars = finalScore * 10;
      const rewardGems = Math.ceil(rewardStars / 10);
      onWinReward(rewardStars, rewardGems, 25);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card play-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🏝️</span>
            <div>
              <h2 style={{ margin: 0, fontSize: '17px' }}>Level {levelNumber}: Pulau Bentuk</h2>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Petualangan Geometri</div>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {!gameFinished ? (
          <div className="game-quiz-box">
            <div className="quiz-progress-indicator">
              Pertanyaan {currentIdx + 1} dari {activeQuestions.length}
            </div>

            <div className="quiz-visual-symbol">
              {q.shapeVisual}
            </div>

            <h3 className="quiz-question-text">{q.question}</h3>

            <div className="quiz-options-list">
              {q.options.map((option, idx) => {
                let btnClass = 'quiz-option-btn';
                if (isAnswered) {
                  if (idx === q.correctIndex) {
                    btnClass += ' option-correct';
                  } else if (idx === selectedAnswer) {
                    btnClass += ' option-wrong';
                  }
                }

                return (
                  <button
                    key={option}
                    type="button"
                    className={btnClass}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                  >
                    <span className="opt-number">{String.fromCharCode(65 + idx)}.</span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {isAnswered && (
              <div className="quiz-feedback">
                {selectedAnswer === q.correctIndex ? (
                  <div className="text-success">🎉 Jawaban Kamu Benar!</div>
                ) : (
                  <div className="text-danger">❌ Belum Tepat, Semangat!</div>
                )}
                <p className="quiz-explanation">{q.explanation}</p>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleNext}
                >
                  {currentIdx + 1 < activeQuestions.length ? 'Lanjut ➔' : 'Lihat Hasil 🏆'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="game-result-box">
            <div className="result-trophy">
              {score >= 2 ? '🌟' : '👍'}
            </div>
            <h2>{score === activeQuestions.length ? 'Luar Biasa Sempurna!' : 'Petualangan Selesai!'}</h2>
            <p>
              Kamu menjawab benar <strong>{score}</strong> dari <strong>{activeQuestions.length}</strong> pertanyaan!
            </p>

            <div className="rewards-earned">
              <span className="reward-chip">⭐ +{score * 10} Bintang</span>
              <span className="reward-chip">💎 +{Math.max(1, score)} Berlian</span>
              <span className="reward-chip">⚡ +25 EXP</span>
            </div>

            <button type="button" className="btn-primary" onClick={onClose}>
              Lanjut Petualangan 🗺️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
