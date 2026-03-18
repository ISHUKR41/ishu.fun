/**
 * tvStreamRoutes.js — IPTV Stream Proxy for TV Page
 * 
 * Handles CORS bypass and M3U8 URL rewriting for Indian TV channels
 * Supports:
 * - M3U8 manifest proxying with URL rewriting
 * - TS segment proxying
 * - Multiple CDN fallbacks
 * - Caching for performance
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');

// Cache manifests for 30 seconds, segments for 5 minutes
const manifestCache = new NodeCache({ stdTTL: 30, checkperiod: 10 });
const segmentCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

/**
 * GET /stream-proxy — Proxy any IPTV stream URL
 * Query params:
 *   - url: The stream URL to proxy (required)
 */
router.get('/stream-proxy', async (req, res) => {
  try {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ success: false, error: 'URL parameter required' });
    }

    // Decode URL if it's encoded
    const decodedUrl = decodeURIComponent(url);
    console.log(`[Stream Proxy] Proxying: ${decodedUrl.substring(0, 100)}...`);

    // Check if it's an M3U8 manifest
    const isManifest = decodedUrl.includes('.m3u8') || decodedUrl.includes('.m3u');

    // Check cache first
    const cacheKey = `stream_${decodedUrl}`;
    const cached = isManifest ? manifestCache.get(cacheKey) : segmentCache.get(cacheKey);
    
    if (cached) {
      console.log('[Stream Proxy] Cache hit');
      if (isManifest) {
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      } else {
        res.setHeader('Content-Type', 'video/MP2T');
      }
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cache-Control', isManifest ? 'max-age=30' : 'max-age=300');
      return res.send(cached);
    }

    // Fetch the stream
    const response = await axios.get(decodedUrl, {
      timeout: 30000,
      responseType: isManifest ? 'text' : 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
      },
      validateStatus: (status) => status < 500,
    });

    if (response.status !== 200) {
      console.error(`[Stream Proxy] Failed: ${response.status}`);
      return res.status(response.status).json({ 
        success: false, 
        error: `Stream returned ${response.status}` 
      });
    }

    let content = response.data;

    // If it's an M3U8 manifest, rewrite URLs to go through our proxy
    if (isManifest && typeof content === 'string') {
      console.log('[Stream Proxy] Rewriting M3U8 URLs...');
      
      // Get base URL for relative paths
      const baseUrl = decodedUrl.substring(0, decodedUrl.lastIndexOf('/') + 1);
      
      // Rewrite relative URLs in manifest
      content = content.split('\n').map(line => {
        const trimmed = line.trim();
        
        // Skip comments and empty lines
        if (!trimmed || trimmed.startsWith('#')) {
          return line;
        }

        // Check if it's a URL line
        let targetUrl = trimmed;
        
        // Convert relative URLs to absolute
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = baseUrl + targetUrl;
        }

        // Wrap the URL through our proxy
        const proxiedUrl = `/api/stream-proxy?url=${encodeURIComponent(targetUrl)}`;
        return proxiedUrl;
      }).join('\n');
    }

    // Cache the content
    if (isManifest) {
      manifestCache.set(cacheKey, content);
    } else {
      segmentCache.set(cacheKey, content);
    }

    // Set appropriate headers
    if (isManifest) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    } else {
      res.setHeader('Content-Type', 'video/MP2T');
    }
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cache-Control', isManifest ? 'max-age=30' : 'max-age=300');
    
    res.send(content);
  } catch (error) {
    console.error('[Stream Proxy] Error:', error.message);
    
    // Return a more helpful error
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        success: false, 
        error: 'Stream connection timeout' 
      });
    }
    
    if (error.response) {
      return res.status(error.response.status).json({ 
        success: false, 
        error: `Stream error: ${error.response.status}` 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Failed to proxy stream' 
    });
  }
});

/**
 * OPTIONS /stream-proxy — Handle CORS preflight
 */
router.options('/stream-proxy', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.status(200).end();
});

module.exports = router;
