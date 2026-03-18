// Indian TV Channels Data - Comprehensive List
// Sources: iptv-org, Free-TV/IPTV, and other public IPTV repositories

export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  language: string;
  streamUrl: string;
  broadcaster: string;
  isHD: boolean;
  isFTA: boolean;
}

export const CHANNEL_CATEGORIES = [
  'General Entertainment',
  'Movies',
  'News',
  'Sports',
  'Kids',
  'Music',
  'Devotional',
  'Documentary',
  'Regional',
  'Lifestyle'
] as const;

export const CHANNEL_LANGUAGES = [
  'Hindi',
  'English',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Kannada',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Punjabi',
  'Odia',
  'Assamese',
  'Bhojpuri',
  'Urdu'
] as const;

// Channel data will be loaded dynamically from M3U playlists
export const IPTV_SOURCES = [
  'https://iptv-org.github.io/iptv/countries/in.m3u',
  'https://raw.githubusercontent.com/Free-TV/IPTV/master/playlists/playlist_india.m3u8',
  'https://iptv-org.github.io/iptv/index.m3u'
];
