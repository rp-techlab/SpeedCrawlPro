// src/network/NetworkCapture.js
class NetworkCapture {
  constructor(config, logger, streamWriter, httpFormatter) {
    this.config = config;
    this.logger = logger;
    this.streamWriter = streamWriter;
    this.httpFormatter = httpFormatter;
    this.reqMap = new Map();
    this.pairs = [];
    this.formats = this.config.get('formats') || [];
    this.assetExt = new Set(['.js', '.css', '.map']);
  }

  attach(context) {
    context.on('request', (req) => {
      try {
        const r = {
          method: req.method(),
          url: req.url(),
          headers: req.headers() || {},
          postData: req.postData() || '',
          ts: Date.now()
        };

        // Always append to generic stream for counts
        this.streamWriter.appendRequest({ ...r, timestamp: r.ts });

        // Skip asset types for raw outputs
        if (this._isAsset(r.url)) {
          this.reqMap.set(req, r);
          return;
        }

        // Immediately write per-request raw .http
        this.streamWriter.writeHTTPSingle(r).catch(() => {});
        this.reqMap.set(req, r);
      } catch (e) {
        this.logger?.debug?.(`request capture error: ${e.message}`);
      }
    });

    context.on('response', async (res) => {
      try {
        const req = res.request();
        const base = this.reqMap.get(req) || {
          method: req.method(),
          url: req.url(),
          headers: req.headers() || {},
          postData: req.postData() || '',
          ts: Date.now()
        };

        // Keep only non-asset for best selection
        if (!this._isAsset(base.url)) {
          this.pairs.push({ method: base.method, url: base.url, headers: base.headers, postData: base.postData });
        }

        // Append JSONL line only for non-assets and only if enabled
        if (this.formats.includes('jsonl') && !this._isAsset(base.url)) {
          try {
            this.streamWriter.appendScanLine({
              timestamp: new Date(base.ts || Date.now()).toISOString(),
              request: {
                method: base.method,
                endpoint: base.url,
                tag: null,
                attribute: null,
                source: null,
                raw: this.httpFormatter.formatHTTPRequest(base)
              },
              response: {
                status_code: res.status(),
                headers: this._headersSnake(await res.allHeaders().catch(() => res.headers())),
                body: '',
                technologies: [],
                raw: ''
              }
            });
          } catch {}
        }
      } catch (e) {
        this.logger?.debug?.(`response capture error: ${e.message}`);
      }
    });
  }

  async flush() {
    try {
      // Choose best non-asset request for http.raw
      const candidates = this.pairs.filter(r => !this._isAsset(r.url));
      if (candidates.length > 0) {
        const best = candidates
          .map(r => ({ r, score: this._score(r) }))
          .sort((a, b) => b.score - a.score)[0].r;
        await this.streamWriter.writeHTTPRawSingle(best);
      }
      // Optional batch writer if requested
      if (this.formats.includes('http') && this.pairs.length > 0) {
        await this.streamWriter.writeHTTP({ requests: candidates });
      }
    } catch (e) {
      this.logger?.debug?.(`flush error: ${e.message}`);
    }
  }

  _isAsset(u) {
    try {
      const { pathname } = new URL(u);
      const dot = pathname.lastIndexOf('.');
      if (dot === -1) return false;
      const ext = pathname.slice(dot).toLowerCase();
      return this.assetExt.has(ext);
    } catch { return false; }
  }

  _score(r) {
    let s = 0;
    const url = new URL(r.url);
    const qcnt = Array.from(url.searchParams.keys()).length;
    const body = r.postData || '';
    const ct = this._contentType(r.headers);
    const isForm = /application\/x-www-form-urlencoded/i.test(ct) && /[=&]/.test(body);
    const isJSON = /application\/json/i.test(ct) && (body.trim().startsWith('{') || body.trim().startsWith('['));
    if (r.method === 'POST') s += 5;
    if (isForm) s += 5;
    if (isJSON) s += 4;
    if (qcnt > 0) s += Math.min(3, qcnt);
    return s;
  }

  _headersSnake(headers) {
    const out = {};
    for (const [k, v] of Object.entries(headers || {})) out[String(k).toLowerCase().replace(/-/g, '_')] = v;
    return out;
  }

  _contentType(headers) {
    for (const k of Object.keys(headers || {})) if (k.toLowerCase() === 'content-type') return headers[k];
    return '';
  }
}

module.exports = { NetworkCapture };
