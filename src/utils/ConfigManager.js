// src/utils/ConfigManager.js
/**
 * SpeedCrawl Pro v22.0 - ConfigManager (aliases + faker options)
 * - Normalizes CLI aliases:
 *   - headful → headless:false
 *   - deepJsAnalysis → deepJSAnalysis
 *   - --no-ssl-check (noSslCheck) and --ssl-check false → noSSLCheck:true
 *   - pages/depth → maxPages/maxDepth
 *   - input/customInputData aliases
 *   - includeSubdomains passthrough
 * - Adds faker options:
 *   - fakerLocale (string), fakerFallbackLocales (array of strings)
 *   - fakerSeed (number), fakerRefDate (string | Date)
 *   - fakerUnique (boolean)
 */
class ConfigManager {
  constructor(options = {}) {
    // Normalize incoming options
    const normalized = { ...options };

    // Deep JS analysis alias
    if (normalized.deepJsAnalysis != null && normalized.deepJSAnalysis == null) {
      normalized.deepJSAnalysis = normalized.deepJsAnalysis;
    }

    // SSL bypass aliases
    if (normalized.noSslCheck != null && normalized.noSSLCheck == null) {
      normalized.noSSLCheck = normalized.noSslCheck;
    }
    if (normalized.sslCheck === false) {
      normalized.noSSLCheck = true;
    }

    // Pages/Depth synonyms
    if (normalized.pages != null && normalized.maxPages == null) normalized.maxPages = normalized.pages;
    if (normalized.depth != null && normalized.maxDepth == null) normalized.maxDepth = normalized.depth;

    // Input data aliases
    if (normalized.inputData != null && normalized.customInputData == null) normalized.customInputData = normalized.inputData;
    if (normalized.input != null && normalized.customInputData == null) normalized.customInputData = normalized.input;

    // Headful override for headless (default headless unless headful is set)
    const wantHeadless = (typeof normalized.headless === 'boolean') ? normalized.headless : true;
    const headless = normalized.headful ? false : wantHeadless;

    // Build final config
    this.config = {
      // Core
      url: normalized.url || null,
      maxPages: Number(normalized.maxPages ?? 100),
      maxDepth: Number(normalized.maxDepth ?? 3),
      timeout: Number(normalized.timeout ?? 30000),

      // Output
      outputDir: normalized.outputDir || normalized.output || './speedcrawl-output',
      formats: this.parseFormats(normalized.formats),

      // Input data
      customInputData: normalized.customInputData ?? null,

      // Feature toggles
      submitForms: !!normalized.submitForms,
      useFaker: normalized.useFaker !== false,
      deepJSAnalysis: !!normalized.deepJSAnalysis,
      extractSecrets: normalized.extractSecrets !== false,

      // Browser/session
      headless,
      noSSLCheck: !!normalized.noSSLCheck,
      debug: !!normalized.debug,
      verbose: Number(normalized.verbose ?? 1),
      userAgent: normalized.userAgent || null,
      proxy: normalized.proxy || null,
      requestDelay: Number(normalized.requestDelay ?? 1000),

      // Scope/evasion
      blockedExtensions: this.normalizeBlocked(normalized.blockedExtensions),
      sameOrigin: !!normalized.sameOrigin,
      includeSubdomains: normalized.includeSubdomains || false,
      evasionMode: !!normalized.evasionMode,

      // Faker options (v10)
      fakerLocale: normalized.fakerLocale || null,
      fakerFallbackLocales: Array.isArray(normalized.fakerFallbackLocales)
        ? normalized.fakerFallbackLocales
        : (typeof normalized.fakerFallbackLocales === 'string'
            ? normalized.fakerFallbackLocales.split(',').map(s => s.trim()).filter(Boolean)
            : []),
      fakerSeed: normalized.fakerSeed != null ? Number(normalized.fakerSeed) : null,
      fakerRefDate: normalized.fakerRefDate || null,
      fakerUnique: normalized.fakerUnique === true
    };
  }

  parseFormats(formats) {
    if (!formats) return ['json', 'jsonl'];
    if (Array.isArray(formats)) return formats;
    return String(formats).split(',').map(s => s.trim()).filter(Boolean);
  }

  normalizeBlocked(value) {
    if (!value) return ['jpg','png','gif','css','woff','woff2','svg'];
    if (Array.isArray(value)) return value.map(String).map(s => s.trim()).filter(Boolean);
    return String(value).split(',').map(s => s.trim()).filter(Boolean);
  }

  get(key, fallback) {
    return this.config[key] != null ? this.config[key] : fallback;
  }

  set(key, value) {
    this.config[key] = value;
  }
}

module.exports = { ConfigManager };
