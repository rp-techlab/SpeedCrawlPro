// src/core/CrawlEngine.js
const { EventEmitter } = require('events');
const path = require('path');
const fs = require('fs');

const { BrowserManager } = require('./BrowserManager');
const { FormProcessor } = require('../forms/FormProcessor');
const { CAPTCHAHandler } = require('../evasion/CAPTCHAHandler');
const { ModernTechDetector } = require('../discovery/ModernTechDetector');
const { JSChunkAnalyzer } = require('../discovery/JSChunkAnalyzer');
const { EndpointAnalyzer } = require('../discovery/EndpointAnalyzer');
const { SecretDetector } = require('../security/SecretDetector');

const { StreamWriter } = require('../output/StreamWriter');
const { HTTPFormatter } = require('../output/HTTPFormatter');
const { NetworkCapture } = require('../network/NetworkCapture');

class CrawlEngine extends EventEmitter {
  constructor(config, logger) {
    super();
    this.config = config;
    this.logger = logger;

    this.browserManager = null;
    this.formProcessor = new FormProcessor(config, logger);
    this.captchaHandler = new CAPTCHAHandler(config, logger);
    this.techDetector = new ModernTechDetector(config, logger);
    this.jsAnalyzer = new JSChunkAnalyzer(config, logger);
    this.endpointAnalyzer = new EndpointAnalyzer(config, logger);
    this.secretDetector = new SecretDetector(config, logger);

    this.streamWriter = new StreamWriter(config, logger);
    this.httpFormatter = new HTTPFormatter(config, logger);
    this.capture = null;

    this.requests = [];
    this.totalRequestCount = 0;
    this.processedUrls = new Set();

    this.results = {
      startTime: null,
      endTime: null,
      duration: 0,
      pages: [],
      forms: 0,
      fieldsProcessed: 0,
      requests: [],
      requestCount: 0,
      technologies: [],
      endpoints: [],
      secrets: [],
      jsChunks: 0
    };
  }

  async initialize() {
    this.logger.info('Initializing engine...');
    this.browserManager = new BrowserManager(this.config, this.logger);
    await this.browserManager.initialize();
  }

  setupMonitor(context) {
    this.capture = new NetworkCapture(this.config, this.logger, this.streamWriter, this.httpFormatter);
    this.capture.attach(context);

    context.on('request', (req) => {
      const data = {
        url: req.url(),
        method: req.method(),
        headers: req.headers(),
        postData: req.postData(),
        timestamp: Date.now()
      };
      this.totalRequestCount++;
      this.requests.push(data);
      if (this.requests.length > 200) this.requests.shift();
    });
  }

  async start() {
    this.results.startTime = Date.now();
    const startUrl = this.config.get('url');
    if (!startUrl) throw new Error('No URL provided');

    try {
      await this.initialize();
      const context = await this.browserManager.newStealthContext({
        ignoreHTTPSErrors: !!this.config.get('noSSLCheck'),
        bypassCSP: true
      });
      this.setupMonitor(context);
      await this.crawlPages(context, startUrl);
      this.results.endTime = Date.now();
      this.results.duration = this.results.endTime - this.results.startTime;
      this.results.requests = this.requests.slice(-200);
      this.results.requestCount = this.totalRequestCount;
      await this.generateOutputs();
      if (this.capture) await this.capture.flush();
      this.printSummary();
      return this.results;
    } finally {
      await this.cleanup();
    }
  }

  async crawl(url) {
    if (url && url !== this.config.get('url')) this.config.set('url', url);
    return this.start();
  }

  async crawlPages(context, startUrl) {
    const queue = [{ url: startUrl, depth: 0 }];
    const maxPages = Number(this.config.get('maxPages'));
    const maxDepth = Number(this.config.get('maxDepth'));
    const origin = new URL(startUrl).origin;
    const baseHost = new URL(startUrl).hostname;
    let fails = 0;

    while (queue.length && this.results.pages.length < maxPages) {
      const { url, depth } = queue.shift();
      if (this.processedUrls.has(url) || depth > maxDepth) continue;
      if (fails >= 5) break;

      this.logger.info(`Processing: ${url}`);
      const page = await context.newPage();

      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: this.config.get('timeout') });
        if (this.config.get('headless')) {
          try { await page.waitForLoadState('networkidle', { timeout: 10000 }); } catch {}
          await page.waitForTimeout(2500);
        } else {
          await page.waitForTimeout(1500);
        }

        try { await this.captchaHandler.handleCaptcha(page); } catch {}

        try {
          const tech = await this.techDetector.detectTechnologies(page);
          if (tech) {
            for (const k of ['frameworks', 'libraries', 'cms']) {
              if (Array.isArray(tech[k])) tech[k].forEach(t => t && this.results.technologies.push(t));
            }
          }
        } catch {}

        if (this.config.get('deepJSAnalysis')) {
          try {
            const js = await this.jsAnalyzer.analyzeChunks(page);
            this.results.jsChunks += js?.chunksAnalyzed || 0;
            if (Array.isArray(js?.endpoints)) js.endpoints.forEach(ep => ep?.endpoint && this.results.endpoints.push(ep.endpoint));
          } catch {}
        }

        try {
          const r = await this.formProcessor.processForm(page);
          this.results.fieldsProcessed += r?.fieldsProcessed || 0;
          if (r?.submitted) this.results.forms += 1;
        } catch {}

        try {
          const eps = await this.endpointAnalyzer.analyzeEndpoints(page);
          if (Array.isArray(eps?.endpoints)) eps.endpoints.forEach(ep => ep?.endpoint && this.results.endpoints.push(ep.endpoint));
        } catch {}

        try {
          const html = await page.content();
          await this.secretDetector.scanContent(html, url);
          const scripts = await page.$$eval('script[src]', s => s.map(x => x.src).filter(y => y && /\.js(\?|$)/.test(y)));
          for (const sc of scripts.slice(0, 20)) {
            try {
              const code = await page.evaluate(async u => { try { return await (await fetch(u)).text(); } catch { return null; } }, sc);
              if (code) await this.secretDetector.scanContent(code, sc);
            } catch {}
          }
          this.results.secrets = this.secretDetector.getAllSecrets();
        } catch {}

        let links = [];
        try {
          links = await page.evaluate(() => {
            const out = new Set();
            document.querySelectorAll('a[href]').forEach(a => {
              const h = a.getAttribute('href') || '';
              if (!h || h.startsWith('javascript:') || h.startsWith('#') || h.startsWith('mailto:') || h.startsWith('tel:')) return;
              try { out.add(new URL(a.href).href.split('#')[0]); } catch {}
            });
            return Array.from(out);
          });
        } catch {}

        for (const link of links) {
          try {
            const u = new URL(link);
            if (this.config.get('sameOrigin') && u.origin !== origin) {
              const allowSubs = this.config.get('includeSubdomains');
              const endsWithBase = u.hostname === baseHost || u.hostname.endsWith(`.${baseHost}`);
              if (!(allowSubs && endsWithBase)) continue;
            }
            if (this.processedUrls.has(link)) continue;
            const ext = (link.split('.').pop() || '').toLowerCase().split('?')[0];
            if ((this.config.get('blockedExtensions') || []).includes(ext)) continue;
            queue.push({ url: link, depth: depth + 1 });
          } catch {}
        }

        const title = await page.title().catch(() => 'Untitled');
        this.results.pages.push({ url, depth, title, linksFound: links.length, timestamp: Date.now() });
        this.processedUrls.add(url);

        this.emit('page-processed', {
          pagesProcessed: this.results.pages.length,
          currentUrl: url,
          duration: ((Date.now() - this.results.startTime) / 1000).toFixed(1)
        });

        fails = 0;
      } catch (err) {
        fails++;
        this.logger.warn(`Failed: ${url} - ${err.message}`);
      }

      try { await page.close(); } catch {}
      await this._wait(this.config.get('requestDelay'));
    }
  }

  async generateOutputs() {
    const outputDir = this.config.get('outputDir');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    let allRequests = [];
    const streamFile = path.join(outputDir, 'requests-stream.jsonl');
    if (fs.existsSync(streamFile)) {
      try {
        allRequests = fs.readFileSync(streamFile, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
      } catch { allRequests = this.requests; }
    } else {
      allRequests = this.requests;
    }

    const uniqueEndpoints = [...new Set(this.results.endpoints)].filter(Boolean);
    fs.writeFileSync(path.join(outputDir, 'endpoints.txt'), uniqueEndpoints.join('\n') || 'No endpoints');

    const uniqueTech = [...new Set(this.results.technologies)].filter(Boolean);
    fs.writeFileSync(path.join(outputDir, 'technologies.txt'), uniqueTech.join('\n') || 'None');

    fs.writeFileSync(path.join(outputDir, 'all-urls.txt'), Array.from(this.processedUrls).join('\n'));

    const secretsContent = (this.results.secrets || []).length > 0
      ? this.results.secrets.map(s => `[${s.type}] ${s.value}\n  Source: ${s.source}`).join('\n\n')
      : 'No secrets found';
    fs.writeFileSync(path.join(outputDir, 'secrets.txt'), secretsContent);

    const summary = {
      crawl: {
        startTime: new Date(this.results.startTime).toISOString(),
        endTime: new Date(this.results.endTime).toISOString(),
        duration: `${(this.results.duration / 1000).toFixed(2)}s`,
        pagesProcessed: this.results.pages.length,
        totalRequests: allRequests.length
      },
      findings: {
        forms: this.results.forms,
        fieldsProcessed: this.results.fieldsProcessed,
        secrets: (this.results.secrets || []).length,
        endpoints: uniqueEndpoints.length,
        technologies: uniqueTech.length,
        jsChunks: this.results.jsChunks
      }
    };
    fs.writeFileSync(path.join(outputDir, 'summary.json'), JSON.stringify(summary, null, 2));

    const md = [
      `# SpeedCrawl Summary`,
      ``,
      `- Pages: ${this.results.pages.length}`,
      `- Forms: ${this.results.forms}`,
      `- Fields: ${this.results.fieldsProcessed}`,
      `- Requests: ${allRequests.length}`,
      `- Endpoints: ${uniqueEndpoints.length}`,
      `- Secrets: ${(this.results.secrets || []).length}`,
      `- JS Chunks: ${this.results.jsChunks}`,
      `- Duration: ${(this.results.duration / 1000).toFixed(2)}s`
    ].join('\n');
    fs.writeFileSync(path.join(outputDir, 'summary.md'), md);

    const formats = this.config.get('formats') || [];
    if (formats.includes('jsonl')) await this.streamWriter.writeJSONL({ requests: allRequests });
    if (formats.includes('har')) await this.streamWriter.writeHAR({ requests: allRequests });
    // HTTP is flushed in capture.flush()
  }

  printSummary() {
    this.logger.info('');
    this.logger.info('Summary ready.');
    this.logger.info(`Results: ${this.config.get('outputDir')}`);
  }

  async _wait(ms) { return new Promise(r => setTimeout(r, Number(ms || 0))); }

  async cleanup() {
    try {
      if (this.streamWriter?.cleanup) this.streamWriter.cleanup();
      if (this.browserManager) await this.browserManager.close();
    } catch {}
  }
}

module.exports = { CrawlEngine };
