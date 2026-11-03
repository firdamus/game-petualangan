export interface PlayerData {
  name: string;
  role: string;
  avatar: string;
  level: number;
  exp: number;
  maxExp: number;
  stars: number;
  gems: number;
}

export interface Mission {
  id: string;
  title: string;
  desc: string;
  current: number;
  target: number;
  completed: boolean;
  rewardStars: number;
  rewardGems: number;
}

export interface ShapeInfo {
  id: string;
  name: string;
  color: string;
  icon: string;
  rumusLuas: string;
  rumusKeliling: string;
  sifat: string[];
}

export type TabType = 'beranda' | 'peta' | 'prestasi' | 'materi' | 'profil';
