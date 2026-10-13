import { ThemeConfig, DisguiseConfig, Bookmark, YouTubeTrack, WallpaperConfig, MediaItem } from '../types';

export const THEMES: ThemeConfig[] = [
  { id: 'boba', name: 'Boba (Original)', baseColor: '#ddb98f', accent: '#8A5631' },
  { id: 'matcha', name: 'Matcha Tea', baseColor: '#d4e8cb', accent: '#0C825F' },
  { id: 'strawberry', name: 'Strawberry Milk', baseColor: '#ffd3e0', accent: '#D2386C' },
  { id: 'taro', name: 'Taro Slate', baseColor: '#1f1b2c', accent: '#7A4CE0', isDark: true },
  { id: 'mango', name: 'Mango Pudding', baseColor: '#ffe2a3', accent: '#C2621B' },
  { id: 'sky', name: 'Sky Pastel', baseColor: '#c6e2fb', accent: '#2F6BEB' },
  { id: 'dark_academia', name: 'Dark Academia', baseColor: '#14110f', accent: '#c4a482', isDark: true },
  { id: 'cyber', name: 'Cyber Slate', baseColor: '#0a0f14', accent: '#2fe0b0', isDark: true },
  { id: 'midnight', name: 'Midnight', baseColor: '#090b10', accent: '#7AA7FF', isDark: true },
  { id: 'light', name: 'Minimal Light', baseColor: '#eaeef4', accent: '#1E2530' },
  { id: 'dark', name: 'Charcoal Dark', baseColor: '#090b10', accent: '#E0B48C', isDark: true },
];

export const ACCENTS: [string, string][] = [
  ['#0C825F', '#5FD3A0'], // Emerald
  ['#2F6BEB', '#7AA7FF'], // Sapphire
  ['#7A4CE0', '#B39BFF'], // Amethyst
  ['#D2386C', '#FF8FB1'], // Rose
  ['#C2621B', '#FFA866'], // Amber
  ['#1E2530', '#E6EAF0'], // Mono
  ['#8A5631', '#E0B48C'], // Boba Brown
];

export const CLOCK_FONTS = [
  { id: 'modern', name: 'Modern Sans', styleClass: 'font-sans font-extrabold tracking-tight' },
  { id: 'digital', name: 'Tech Monospace', styleClass: 'font-mono font-bold tracking-widest' },
  { id: 'serif', name: 'Editorial Serif', styleClass: 'font-serif font-bold italic' },
  { id: 'bold', name: 'Heavy Impact', styleClass: 'font-sans font-black uppercase tracking-tighter' },
  { id: 'retro', name: 'Retro Arcade', styleClass: 'font-mono font-bold tracking-wider' },
];

export const WALLPAPERS: WallpaperConfig[] = [
  {
    id: 'gradient',
    name: 'Dynamic Ambient Mesh',
    url: '',
    type: 'gradient'
  },
  {
    id: 'lofi_night',
    name: 'Cozy Study Night',
    url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&auto=format&fit=crop&q=80',
    type: 'preset'
  },
  {
    id: 'minimal_mountain',
    name: 'Dusk Mountain Mist',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80',
    type: 'preset'
  },
  {
    id: 'rainy_cafe',
    name: 'Rainy Cafe Window',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1920&auto=format&fit=crop&q=80',
    type: 'preset'
  },
  {
    id: 'cyber_streets',
    name: 'Cyberpunk Neon Rain',
    url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&auto=format&fit=crop&q=80',
    type: 'preset'
  },
  {
    id: 'tokyo_dusk',
    name: 'Pastel Sunset Sky',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1920&auto=format&fit=crop&q=80',
    type: 'preset'
  }
];

export const DISGUISES: DisguiseConfig[] = [
  {
    id: 'none',
    name: 'Default (alxx.studies)',
    title: 'alxx.studies',
    favicon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎓</text></svg>"
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    favicon: 'https://ssl.gstatic.com/classroom/favicon.png'
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    favicon: 'https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png'
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico'
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico'
  },
  {
    id: 'desmos',
    name: 'Desmos Calculator',
    title: 'Desmos | Graphing Calculator',
    favicon: 'https://www.desmos.com/favicon.ico'
  },
  {
    id: 'edpuzzle',
    name: 'Edpuzzle',
    title: 'Edpuzzle',
    favicon: 'https://edpuzzle.com/favicon.ico'
  }
];

export const DEFAULT_BOOKMARKS: Bookmark[] = [
  { id: '1', title: 'YouTube', url: 'https://www.youtube.com', icon: '📺', pinned: true },
  { id: '2', title: 'Discord', url: 'https://discord.com/app', icon: '💬', pinned: true },
  { id: '3', title: 'Reddit', url: 'https://www.reddit.com', icon: '👾', pinned: true },
  { id: '4', title: 'Spotify', url: 'https://open.spotify.com', icon: '🎧', pinned: true },
  { id: '5', title: 'Desmos', url: 'https://www.desmos.com/calculator', icon: '📈', pinned: false },
  { id: '6', title: 'Quizlet', url: 'https://quizlet.com', icon: '🃏', pinned: false },
  { id: '7', title: 'Wikipedia', url: 'https://en.wikipedia.org', icon: '📚', pinned: false },
  { id: '8', title: 'GitHub', url: 'https://github.com', icon: '🐙', pinned: false },
];

export const YOUTUBE_TRACKS: YouTubeTrack[] = [
  {
    id: 'lofi-girl',
    title: 'beats to relax/study to',
    artist: 'Lofi Girl',
    youtubeId: 'jfKfPfyJRdk',
    artwork: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    playlistName: 'Lofi Focus'
  },
  {
    id: 'synthwave-chill',
    title: 'Synthwave Chill Radio (Coding & Focus)',
    artist: 'Lofi Girl / Synthwave',
    youtubeId: '4xDzrJKXOOY',
    artwork: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
    playlistName: 'Cyber Synth'
  },
  {
    id: 'ghibli-piano',
    title: 'Ghibli Piano & Violin Relaxing Melodies',
    artist: 'Studio Ghibli Peaceful',
    youtubeId: 'W16_lC7mKxQ',
    artwork: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    playlistName: 'Piano & Strings'
  },
  {
    id: 'cafe-jazz',
    title: 'Rainy Cafe Cozy Bossa & Jazz Beats',
    artist: 'Coffee Shop Vibes',
    youtubeId: 'Dx5qFachd3A',
    artwork: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=80',
    playlistName: 'Rainy Cafe'
  },
  {
    id: 'deep-focus',
    title: 'Deep Focus Alpha Waves (ADHD / Study Flow)',
    artist: 'Brainwave Lab',
    youtubeId: 'WPni755-Krg',
    artwork: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=80',
    playlistName: 'Alpha Flow'
  },
  {
    id: 'anime-chill',
    title: 'Anime Lofi Chill Hiphop Mix',
    artist: 'ChilledCow Classics',
    youtubeId: '5qap5aO4i9A',
    artwork: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80',
    playlistName: 'Anime Lo-Fi'
  }
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'interstellar',
    title: 'Interstellar',
    type: 'movie',
    year: 2014,
    score: '8.7',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/rAiYTsqJJR9asvkNxGmJa06KoNk.jpg',
    overview: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    embedUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E'
  },
  {
    id: 'arcane',
    title: 'Arcane: League of Legends',
    type: 'tv',
    year: 2021,
    score: '9.0',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    poster: 'https://image.tmdb.org/t/p/w500/fq2daM3Yl4fEuhV6QvN1PzQ5bH0.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/v2vG4dD8V9Y4mD6cE2P5N9vG7z0.jpg',
    overview: 'Set in the utopian Piltover and the oppressed underground of Zaun, the story follows the origins of two iconic League champions.',
    embedUrl: 'https://www.youtube.com/embed/fXmAurh012s'
  },
  {
    id: 'spirited-away',
    title: 'Spirited Away',
    type: 'anime',
    year: 2001,
    score: '8.6',
    genres: ['Anime', 'Fantasy', 'Family'],
    poster: 'https://image.tmdb.org/t/p/w500/393mhwsRJ0f01v3h8Z21Y66rC0q.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/mSDsSDwaP3E7dEfUPWy4J0djt4O.jpg',
    overview: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits.',
    embedUrl: 'https://www.youtube.com/embed/ByXuk9QqQkk'
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    type: 'movie',
    year: 2023,
    score: '8.9',
    genres: ['Biography', 'Drama', 'History'],
    poster: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
    overview: 'The story of J. Robert Oppenheimer\'s role in the development of the atomic bomb during World War II.',
    embedUrl: 'https://www.youtube.com/embed/uYPbbksJxIg'
  },
  {
    id: 'frieren',
    title: 'Frieren: Beyond Journey\'s End',
    type: 'anime',
    year: 2023,
    score: '9.1',
    genres: ['Anime', 'Fantasy', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/dqzenchTd7lp5zht7BdlqM7R45b.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/t5zCBSB5xMDKcDqe91qR40vEsm3.jpg',
    overview: 'After defeating the Demon King, elf mage Frieren embarks on a nostalgic pilgrimage to understand mortal human bonds.',
    embedUrl: 'https://www.youtube.com/embed/ZEkW_MUp3-8'
  },
  {
    id: 'spider-verse',
    title: 'Spider-Man: Across the Spider-Verse',
    type: 'movie',
    year: 2023,
    score: '8.7',
    genres: ['Animation', 'Action', 'Adventure'],
    poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    backdrop: 'https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg',
    overview: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    embedUrl: 'https://www.youtube.com/embed/cqGjhVJWtEg'
  }
];

export const AVATAR_GRADIENTS = [
  'from-amber-400 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-purple-400 to-indigo-600',
  'from-cyan-400 to-blue-600',
  'from-stone-600 to-stone-900',
];
