/**
 * tvStreamRoutes.js — IPTV Stream Proxy for TV Page (v2)
 * 
 * Handles CORS bypass and M3U8 URL rewriting for Indian TV channels.
 * v2 improvements:
 * - Smarter referrer detection for 15+ Indian OTT platforms
 * - Better User-Agent rotation for stream providers
 * - Increased timeout for segment proxying
 * - Support for chunked streaming of .ts segments
 * - Cache headers for better performance
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const NodeCache = require('node-cache');
const http = require('http');
const https = require('https');

// Cache manifests for 30 seconds, segments for 5 minutes
const manifestCache = new NodeCache({ stdTTL: 30, checkperiod: 10 });
const segmentCache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Connection pooling for better performance
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 150,
  maxFreeSockets: 30,
  timeout: 60000,
});

const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 150,
  maxFreeSockets: 30,
  timeout: 60000,
  rejectUnauthorized: false, // Allow self-signed certs for some Indian CDNs
});

// Platform-specific referrers for major Indian OTT platforms
function getReferer(url) {
  const u = url.toLowerCase();
  if (u.includes('jiocinema') || u.includes('jiocin') || u.includes('jio.com')) return 'https://www.jiocinema.com/';
  if (u.includes('hotstar') || u.includes('hstar') || u.includes('disneyplushotstar')) return 'https://www.hotstar.com/';
  if (u.includes('sonyliv') || u.includes('sony.in') || u.includes('sonyentertainment')) return 'https://www.sonyliv.com/';
  if (u.includes('zee5') || u.includes('zeenews') || u.includes('zeeentertainment')) return 'https://www.zee5.com/';
  if (u.includes('voot') || u.includes('colorstv') || u.includes('colors.') || u.includes('nick.')) return 'https://www.voot.com/';
  if (u.includes('mxplayer') || u.includes('mxmedia')) return 'https://www.mxplayer.in/';
  if (u.includes('aha') || u.includes('ahatamil')) return 'https://www.aha.video/';
  if (u.includes('shemaroome') || u.includes('shemaroo')) return 'https://www.shemaroome.com/';
  if (u.includes('erosnow') || u.includes('erosdigital')) return 'https://erosnow.com/';
  if (u.includes('hungama') || u.includes('hungamaplay')) return 'https://www.hungama.com/';
  if (u.includes('sun') && (u.includes('sunnxt') || u.includes('sun-') || u.includes('sunnetwork'))) return 'https://www.sunnxt.com/';
  if (u.includes('doordarshan') || u.includes('ddindia') || u.includes('ddnational')) return 'https://www.ddindia.gov.in/';
  if (u.includes('indiatvnews') || u.includes('indiatv')) return 'https://www.indiatvnews.com/';
  if (u.includes('aajtak') || u.includes('indiatoday')) return 'https://www.aajtak.in/';
  if (u.includes('ndtv')) return 'https://www.ndtv.com/';
  if (u.includes('abplive') || u.includes('abpnews')) return 'https://news.abplive.com/';
  if (u.includes('tv9') || u.includes('tv9telugu') || u.includes('tv9marathi')) return 'https://www.tv9telugu.com/';
  if (u.includes('timesnow') || u.includes('times network') || u.includes('timesofindi')) return 'https://www.timesnow.tv/';
  if (u.includes('news18') || u.includes('news-18') || u.includes('cnn-news18')) return 'https://www.news18.com/';
  if (u.includes('cnbctv18') || u.includes('cnbc-tv18')) return 'https://www.cnbctv18.com/';
  if (u.includes('republic') || u.includes('republictv')) return 'https://www.republicworld.com/';
  if (u.includes('eetv') || u.includes('etv') || u.includes('etvbharat')) return 'https://www.etvbharat.com/';
  if (u.includes('ibtimes') || u.includes('ingenuity-media')) return 'https://www.ibtimes.co.in/';
  if (u.includes('9xm') || u.includes('9xmedia') || u.includes('9xchannel')) return 'https://www.9xm.in/';
  if (u.includes('mtv') || u.includes('mtvindian') || u.includes('viacom18')) return 'https://www.mtvindia.com/';
  if (u.includes('pogo') || u.includes('cartoonnetwork') || u.includes('toonnetwork')) return 'https://www.cartoonnetwork.in/';
  if (u.includes('discovery') || u.includes('discoverychan') || u.includes('tlcme')) return 'https://www.discovery.com/';
  if (u.includes('natgeo') || u.includes('nationalgeographic')) return 'https://www.nationalgeographic.com/';
  if (u.includes('history') || u.includes('historytv18')) return 'https://www.historytv18.com/';
  if (u.includes('fox') || u.includes('foxnetworks')) return 'https://www.foxnetworks.in/';
  if (u.includes('star') || u.includes('starplus') || u.includes('starmovies') || u.includes('starworld')) return 'https://www.hotstar.com/';
  if (u.includes('akamaized.net') || u.includes('cloudfront.net') || u.includes('fastly')) return undefined; // CDN — no referer needed
  return undefined;
}

// Rotating User-Agent pool (mimics real browser requests)
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:132.0) Gecko/20100101 Firefox/132.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
];

let uaIndex = 0;
function nextUserAgent() {
  return USER_AGENTS[uaIndex++ % USER_AGENTS.length];
}

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

    const decodedUrl = decodeURIComponent(url);
    console.log(`[Stream Proxy] Proxying: ${decodedUrl.substring(0, 120)}`);

    const isManifest = decodedUrl.includes('.m3u8') || decodedUrl.includes('.m3u');
    const isSegment = decodedUrl.includes('.ts') || decodedUrl.includes('.aac') || decodedUrl.includes('.mp4');

    // Check cache first
    const cacheKey = `stream_${decodedUrl}`;
    const cached = isManifest ? manifestCache.get(cacheKey) : (isSegment ? segmentCache.get(cacheKey) : null);

    if (cached) {
      console.log('[Stream Proxy] Cache hit');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cache-Control', isManifest ? 'max-age=30' : 'max-age=300');
      if (isManifest) res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      else if (isSegment) res.setHeader('Content-Type', 'video/MP2T');
      return res.send(cached);
    }

    // Smart referrer based on URL
    const referrer = getReferer(decodedUrl);

    const response = await axios.get(decodedUrl, {
      timeout: isSegment ? 20000 : 30000,
      responseType: isManifest ? 'text' : 'arraybuffer',
      httpAgent: decodedUrl.startsWith('http:') ? httpAgent : undefined,
      httpsAgent: decodedUrl.startsWith('https:') ? httpsAgent : undefined,
      headers: {
        'User-Agent': nextUserAgent(),
        'Accept': isManifest
          ? 'application/vnd.apple.mpegurl, application/x-mpegURL, */*'
          : 'video/MP2T, video/*, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8,hi;q=0.7',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        ...(referrer ? { 'Referer': referrer, 'Origin': new URL(referrer).origin } : {}),
      },
      validateStatus: (status) => status < 500,
      maxRedirects: 10,
    });

    if (response.status === 403 || response.status === 401) {
      console.warn(`[Stream Proxy] Auth required: ${response.status} for ${decodedUrl.substring(0, 80)}`);
      return res.status(response.status).json({ success: false, error: `Stream requires authentication: ${response.status}` });
    }

    if (response.status !== 200) {
      console.error(`[Stream Proxy] Failed: ${response.status}`);
      return res.status(response.status).json({ success: false, error: `Stream returned ${response.status}` });
    }

    let content = response.data;

    // Rewrite M3U8 manifest URLs to go through our proxy
    if (isManifest && typeof content === 'string') {
      console.log('[Stream Proxy] Rewriting M3U8 URLs...');
      const baseUrl = decodedUrl.substring(0, decodedUrl.lastIndexOf('/') + 1);

      content = content.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return line;

        let targetUrl = trimmed;
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
          targetUrl = baseUrl + targetUrl;
        }

        return `/api/stream-proxy?url=${encodeURIComponent(targetUrl)}`;
      }).join('\n');

      manifestCache.set(cacheKey, content);
    } else if (isSegment && Buffer.isBuffer(content)) {
      segmentCache.set(cacheKey, content);
    }

    // Response headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Content-Type');

    if (isManifest) {
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Cache-Control', 'max-age=30, public');
    } else if (isSegment) {
      res.setHeader('Content-Type', 'video/MP2T');
      res.setHeader('Cache-Control', 'max-age=300, public');
    } else {
      const ct = response.headers['content-type'];
      if (ct) res.setHeader('Content-Type', ct);
      res.setHeader('Cache-Control', 'max-age=60, public');
    }

    res.send(content);

  } catch (error) {
    console.error('[Stream Proxy] Error:', error.message);

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({ success: false, error: 'Stream connection timeout' });
    }
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({ success: false, error: 'Stream server refused connection' });
    }
    if (error.response) {
      return res.status(error.response.status || 502).json({ success: false, error: `Stream error: ${error.response.status}` });
    }

    res.status(500).json({ success: false, error: 'Failed to proxy stream: ' + error.message });
  }
});

/**
 * OPTIONS /stream-proxy — Handle CORS preflight
 */
router.options('/stream-proxy', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.status(200).end();
});

/**
 * HEAD /stream-proxy — Support HEAD requests for stream probing
 */
router.head('/stream-proxy', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
  res.status(200).end();
});

module.exports = router;
