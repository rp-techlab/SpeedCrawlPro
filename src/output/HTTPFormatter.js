// src/output/HTTPFormatter.js
const fs = require('fs');
const path = require('path');

class HTTPFormatter {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
  }

  formatHTTPRequest(requestData) {
    try {
      const method = requestData.method || 'GET';
      const url = new URL(requestData.url);
      const origHeaders = requestData.headers || {};
      const hasBody = requestData.postData != null && requestData.postData !== '';
      const bodyStr = hasBody
        ? (typeof requestData.postData === 'string' ? requestData.postData : JSON.stringify(requestData.postData))
        : '';
      const bodyLen = hasBody ? Buffer.byteLength(bodyStr, 'utf8') : 0;

      // Normalize headers: remove host/content-length; add Connection if missing
      const hdrs = {};
      for (const [k, v] of Object.entries(origHeaders)) {
        const lk = String(k).toLowerCase();
        if (lk === 'host' || lk === 'content-length') continue;
        hdrs[k] = v;
      }
      if (hasBody) {
        // Add content-type if looks like JSON and header missing
        const hasCT = Object.keys(hdrs).some(k => k.toLowerCase() === 'content-type');
        if (!hasCT && (bodyStr.trim().startsWith('{') || bodyStr.trim().startsWith('['))) {
          hdrs['Content-Type'] = 'application/json';
        }
        hdrs['Content-Length'] = String(bodyLen);
      }
      if (!Object.keys(hdrs).some(k => k.toLowerCase() === 'connection')) {
        hdrs['Connection'] = 'close';
      }

      let http = `${method} ${url.pathname}${url.search} HTTP/1.1\r\n`;
      http += `Host: ${url.host}\r\n`;
      for (const [k, v] of Object.entries(hdrs)) {
        http += `${k}: ${v}\r\n`;
      }
      http += `\r\n`;
      if (hasBody) http += bodyStr;
      return http;
    } catch (e) {
      this.logger?.debug?.(`req fmt error: ${e.message}`);
      return '';
    }
  }

  async writeJSONLFile(entries, outputDir) {
    try {
      const dir = path.join(outputDir, 'jsonl');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const file = path.join(dir, `crawl_${ts}.jsonl`);
      fs.writeFileSync(file, entries.map(e => JSON.stringify(e)).join('\n') + '\n', 'utf8');
      this.logger?.success?.(`JSONL written: ${file}`);
      return file;
    } catch (e) {
      this.logger?.error?.(`JSONL write error: ${e.message}`);
      return null;
    }
  }

  async writeHARFile(requests, outputDir) {
    try {
      const dir = path.join(outputDir, 'har');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const file = path.join(dir, `requests_${ts}.har`);
      const log = {
        log: {
          version: '1.2',
          creator: { name: 'SpeedCrawl', version: '22.2' },
          entries: (requests || []).map(r => ({
            startedDateTime: new Date(r.timestamp || Date.now()).toISOString(),
            request: {
              method: r.method || 'GET',
              url: r.url,
              httpVersion: 'HTTP/1.1',
              headers: Object.entries(r.headers || {}).map(([name, value]) => ({ name, value })),
              queryString: [],
              headersSize: -1,
              bodySize: (r.postData && String(r.postData).length) || 0,
              postData: r.postData ? { mimeType: this._contentType(r.headers), text: String(r.postData) } : undefined
            },
            response: {
              status: (r.response && r.response.status) || 0,
              statusText: (r.response && r.response.statusText) || '',
              httpVersion: 'HTTP/1.1',
              headers: Object.entries((r.response && r.response.headers) || {}).map(([name, value]) => ({ name, value })),
              headersSize: -1,
              bodySize: ((r.response && r.response.body) && String(r.response.body).length) || -1
            },
            cache: {},
            timings: { send: 0, wait: 0, receive: 0 }
          }))
        }
      };
      fs.writeFileSync(file, JSON.stringify(log, null, 2), 'utf8');
      this.logger?.success?.(`HAR written: ${file}`);
      return file;
    } catch (e) {
      this.logger?.error?.(`HAR write error: ${e.message}`);
      return null;
    }
  }

  async writeHTTPFile(data, outputDir) {
    try {
      const dir = path.join(outputDir, 'http-requests');
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const file = path.join(dir, `requests_${ts}.http`);
      let content = '';
      for (const req of data.requests || []) {
        content += this.formatHTTPRequest(req);
        content += '\n\n---\n\n';
      }
      fs.writeFileSync(file, content, 'utf8');
      return file;
    } catch (e) {
      this.logger?.error?.(`HTTP write error: ${e.message}`);
      return null;
    }
  }

  _contentType(headers) {
    const h = headers || {};
    for (const k of Object.keys(h)) if (k.toLowerCase() === 'content-type') return h[k];
    return 'application/json';
  }
}

module.exports = { HTTPFormatter };
