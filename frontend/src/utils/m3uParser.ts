// M3U Playlist Parser for IPTV Channels
import type { Channel } from '@/data/indianChannels';

export interface M3UEntry {
  name: string;
  url: string;
  tvgId?: string;
  tvgName?: string;
  tvgLogo?: string;
  groupTitle?: string;
  tvgLanguage?: string;
  tvgCountry?: string;
}

/**
 * Parse M3U playlist content into structured channel data
 */
export function parseM3U(content: string): M3UEntry[] {
  const lines = content.split('\n').map(line => line.trim());
  const entries: M3UEntry[] = [];
  
  let currentEntry: Partial<M3UEntry> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF line
      const match = line.match(/#EXTINF:-?\d+\s*(.*?),(.*)$/);
      if (match) {
        const attributes = match[1];
        const name = match[2].trim();
        
        currentEntry = { name };
        
        // Parse attributes
        const tvgId = attributes.match(/tvg-id="([^"]*)"/)?.[1];
        const tvgName = attributes.match(/tvg-name="([^"]*)"/)?.[1];
        const tvgLogo = attributes.match(/tvg-logo="([^"]*)"/)?.[1];
        const groupTitle = attributes.match(/group-title="([^"]*)"/)?.[1];
        const tvgLanguage = attributes.match(/tvg-language="([^"]*)"/)?.[1];
        const tvgCountry = attributes.match(/tvg-country="([^"]*)"/)?.[1];
        
        if (tvgId) currentEntry.tvgId = tvgId;
        if (tvgName) currentEntry.tvgName = tvgName;
        if (tvgLogo) currentEntry.tvgLogo = tvgLogo;
        if (groupTitle) currentEntry.groupTitle = groupTitle;
        if (tvgLanguage) currentEntry.tvgLanguage = tvgLanguage;
        if (tvgCountry) currentEntry.tvgCountry = tvgCountry;
      }
    } else if (line && !line.startsWith('#') && currentEntry.name) {
      // This is the URL line
      currentEntry.url = line;
      entries.push(currentEntry as M3UEntry);
      currentEntry = {};
    }
  }
  
  return entries;
}
