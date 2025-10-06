// src/output/StreamWriter.js
const fs = require('fs');
const path = require('path');
const { HTTPFormatter } = require('./HTTPFormatter');

class StreamWriter {
  constructor(config, logger) {
    this.config = config;
    this.logger = logger;
    this.outputDir = this.config.get('outputDir') || this.config.get('output') || './speedcrawl-output';
    this.formats = this.config.get('formats') || [];
    this.httpFormatter = new HTTPFormatter(config, logger);
    this.ensureDirectories();
    this.streamFile = path.join(this.outputDir, 'requests-stream.jsonl');
    this.eventJsonlFile = null; // created only if jsonl is enabled
    this.seq = 1;
  }

  ensureDirectories() {
    if (!fs.existsSync(this.outputDir)) fs.mkdirSync(this.outputDir, { recursive: true });
    if (this.formats.includes('jsonl')) {
      const d = path.join(this.outputDir, 'jsonl');
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    }
    if (this.formats.includes('har')) {
      const d = path.join(this.outputDir, 'har');
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    }
    // Always create per-request dir for .http files
    const eachDir = path.join(this.outputDir, 'http-requests', 'each');
    if (!fs.existsSync(eachDir)) fs.mkdirSync(eachDir, { recursive: true });
    // Helpful text outputs
    ['endpoints', 'secrets'].forEach(n => {
      const d = path.join(this.outputDir, n);
      if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
    });
  }

  appendRequest(request) {
    try {
      fs.appendFileSync(this.streamFile, JSON.stringify(request) + '\n', 'utf8');
    } catch (e) {
      this.logger?.debug?.(`Append request error: ${e.message}`);
    }
  }

  appendScanLine(entry) {
    if (!this.formats.includes('jsonl')) return;
    try {
      if (!this.eventJsonlFile) {
        const ts = new Date().toISOString().replace(/[:.]/g, '-');
        this.eventJsonlFile = path.join(this.outputDir, 'jsonl', `network_${ts}.jsonl`);
      }
      fs.appendFileSync(this.eventJsonlFile, JSON.stringify(entry) + '\n', 'utf8');
    } catch (e) {
      this.logger?.debug?.(`JSONL append error: ${e.message}`);
    }
  }

  async writeJSONL(data) {
    if (!this.formats.includes('jsonl')) return null;
    const entries = Array.isArray(data?.entries) ? data.entries
                  : Array.isArray(data?.requests) ? data.requests
                  : Array.isArray(data?.pages) ? data.pages
                  : [];
    return this.httpFormatter.writeJSONLFile(entries, this.outputDir);
  }

  async writeHAR({ requests }) {
    if (!this.formats.includes('har')) return null;
    return this.httpFormatter.writeHARFile(requests || [], this.outputDir);
  }

  async writeHTTP({ requests }) {
    if (!this.formats.includes('http')) return null;
    return this.httpFormatter.writeHTTPFile({ requests: requests || [] }, this.outputDir);
  }

  // Single best request written to top-level http.raw
  async writeHTTPRawSingle(requestRecord) {
    try {
      const raw = this.httpFormatter.formatHTTPRequest(requestRecord);
      const file = path.join(this.outputDir, 'http.raw');
      fs.writeFileSync(file, raw, 'utf8');
      this.logger?.success?.(`http.raw written: ${file}`);
      return file;
    } catch (e) {
      this.logger?.error?.(`http.raw write error: ${e.message}`);
      return null;
    }
  }

  // One request per file with numeric sequence only
  async writeHTTPSingle(requestRecord) {
    try {
      const raw = this.httpFormatter.formatHTTPRequest(requestRecord);
      const seq = String(this.seq++).padStart(6, '0');
      const file = path.join(this.outputDir, 'http-requests', 'each', `${seq}.http`);
      fs.writeFileSync(file, raw, 'utf8');
      return file;
    } catch (e) {
      this.logger?.debug?.(`HTTP single write error: ${e.message}`);
      return null;
    }
  }

  cleanup() {}
}

module.exports = { StreamWriter };
