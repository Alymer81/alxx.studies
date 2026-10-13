export interface User {
  id: string;
  email: string;
  username: string;
  role: 'admin' | 'user';
  banned: boolean;
  canMessage?: boolean;
  avatarIndex: number;
  createdAt: string;
  banReason?: string;
  friends?: string[];
}

export interface FriendMessage {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  content: string;
  timestamp: string;
  maskedContent?: string;
  isBlurred?: boolean;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  fromUsername: string;
  toUserId: string;
  toUsername: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: string;
}

export interface GroupChat {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  memberIds: string[];
  createdAt: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  fromUserId: string;
  fromUsername: string;
  content: string;
  timestamp: string;
  maskedContent?: string;
  isBlurred?: boolean;
}

export interface FriendsSettings {
  filterMode: 'blur' | 'mask' | 'hide';
  allowRequests: boolean;
  onlineStatus: 'online' | 'invisible';
  soundAlerts: boolean;
}

export interface WidgetSettings {
  showScratchpad: boolean;
  showMindset: boolean;
  showWeather: boolean;
}

export interface Game {
  id: string | number;
  name?: string;
  title?: string;
  category?: string;
  cover?: string;
  thumbnail?: string;
  url?: string;
  embedUrl?: string;
  description?: string;
  tags?: string[];
  isCustom?: boolean;
  addedAt?: string;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon: string;
  pinned: boolean;
  isGlobal?: boolean;
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'anime';
  year: number;
  score: string;
  genres: string[];
  poster: string;
  backdrop: string;
  overview: string;
  embedUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface YouTubeTrack {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  artwork: string;
  playlistName: string;
}

export interface UpdateLog {
  id: string;
  version: string;
  title: string;
  category: 'Feature' | 'Games' | 'Improvements' | 'Fix';
  date: string;
  content: string[];
}

export type ViewType = 'home' | 'watch' | 'listen' | 'play' | 'ask' | 'friends' | 'settings' | 'admin';

export interface ThemeConfig {
  id: string;
  name: string;
  baseColor: string;
  accent: string;
  isDark?: boolean;
}

export interface DisguiseConfig {
  id: string;
  name: string;
  title: string;
  favicon: string;
}

export type ClockFont = 'modern' | 'digital' | 'serif' | 'bold' | 'retro';

export interface WallpaperConfig {
  id: string;
  name: string;
  url: string;
  type: 'preset' | 'custom' | 'gradient';
}
