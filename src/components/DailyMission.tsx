import type { FC } from 'react';
import type { Mission } from '../types';

interface DailyMissionProps {
  mission: Mission;
  onAdvanceMission: () => void;
}

export const DailyMission: FC<DailyMissionProps> = ({
  mission,
  onAdvanceMission,
}) => {
  const percent = Math.min(100, Math.round((mission.current / mission.target) * 100));

  return (
    <div 
      className="daily-mission-card" 
      onClick={onAdvanceMission}
      role="button"
      tabIndex={0}
      title="Klik untuk selesaikan misi / ambil hadiah!"
    >
      <div className="mission-icon-wrap">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          <path d="m9 14 2 2 4-4" />
        </svg>
      </div>

      <div className="mission-content">
        <div className="mission-header-row">
          <span className="mission-title">{mission.title}</span>
          <svg className="mission-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
        <p className="mission-desc">{mission.desc}</p>
        <div className="mission-progress-row">
          <div className="mission-progress-track">
            <div 
              className="mission-progress-fill" 
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="mission-progress-text">
            {mission.current}/{mission.target}
          </span>
        </div>
      </div>
    </div>
  );
};
