#!/usr/bin/env node

/**
 * SpeedCrawl Pro v22.2 - COMPLETE CLI (updated defaults)
 * - Default formats: json (JSONL is opt-in)
 * - Expanded blocked-extensions to skip assets by default
 * - Compatible with per-request http-requests/each and top-level http.raw
 */

const { Command } = require('commander');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Core
const { CrawlEngine } = require('../src/core/CrawlEngine');
const { ConfigManager } = require('../src/utils/ConfigManager');
const { Logger } = require('../src/utils/Logger');

const program = new Command();

// Version and description
program
  .name('speedcrawl')
  .description('SpeedCrawl Pro - Professional web security crawler')
  .version('22.2.0');

// CLI Options
program
  .requiredOption('-u, --url <url>', 'Target URL to crawl')
  .option('-d, --depth <n>', 'Maximum crawl depth (1-10)', '3')
  .option('-p, --pages <n>', 'Maximum pages to crawl (1-10000)', '100')
  .option('-o, --output <dir>', 'Output directory', './speedcrawl-output')
  .option('-v, --verbose <n>', 'Verbosity level (0-3)', '1')
  .option('-i, --input <file>', 'JSON file with form input data')

  // Output formats
  // Default is json only (jsonl is opt-in; http batch is opt-in)
  .option('--formats <list>', 'Output formats: json,jsonl,har,http', 'json')

  // Form options
  .option('--submit-forms', 'Submit forms automatically', false)
  .option('--use-faker', 'Use Faker for realistic data', true)
  .option('--form-delay <ms>', 'Delay before filling forms', '1000')

  // Analysis options
  .option('--deep-js-analysis', 'Enable JavaScript AST parsing', false)
  .option('--extract-secrets', 'Scan for API keys and secrets', true)
  .option('--include-subdomains <pattern>', 'Include subdomain pattern (e.g., *.example.com)')

  // Browser options
  .option('--headful', 'Show browser window', false)
  .option('--user-agent <ua>', 'Custom User-Agent')
  .option('--proxy <url>', 'HTTP/HTTPS proxy URL')
  .option('--no-ssl-check', 'Ignore SSL certificate errors', false)

  // Performance
  .option('--request-delay <ms>', 'Delay between requests', '1000')
  .option('--timeout <ms>', 'Page load timeout', '30000')
  .option('--threads <n>', 'Concurrent pages', '1')

  // Filtering
  .option('--blocked-extensions <list>', 'Skip file extensions', 'jpg,png,gif,css,woff,woff2,svg,ico,js,map')
  .option('--same-origin', 'Only crawl same origin', false)

  // Advanced
  .option('--evasion-mode', 'Enable bot evasion techniques', false)
  .option('--debug', 'Enable debug logging', false);

// Parse and run
program.parse();

(async () => {
  const options = program.opts();

  // Initialize logger
  const logger = new Logger({
    level: parseInt(options.verbose),
    enableColors: true,
    enableDebug: options.debug
  });

  try {
    // Banner
    logger.info('');
    logger.info('╔════════════════════════════════════════════════════════════════════╗');
    logger.info('║ SpeedCrawl Pro v22.2                                               ║');
    logger.info('║ 🧠 Intelligent Auto-Detection | 🎭 Faker | 📱 SPA | 🌐 Subdomains    ║');
    logger.info('╚════════════════════════════════════════════════════════════════════╝');
    logger.info('');

    // Validate URL
    try {
      new URL(options.url);
    } catch (error) {
      logger.error('❌ Invalid URL format');
      process.exit(1);
    }

    // Check Faker availability
    let fakerAvailable = false;
    try {
      require('@faker-js/faker');
      fakerAvailable = true;
      logger.info('🎭 Faker detected - realistic data generation enabled');
    } catch {
      logger.warn('⚠️ Faker not installed - using basic data generation');
    }

    // Load input data if provided
    let inputData = null;
    if (options.input) {
      try {
        const inputPath = path.resolve(options.input);
        if (fs.existsSync(inputPath)) {
          const rawData = fs.readFileSync(inputPath, 'utf8');
          inputData = JSON.parse(rawData);
          logger.info(`📄 Loaded input data from: ${options.input}`);
          logger.debug(` Fields: ${Object.keys(inputData).join(', ')}`);
        } else {
          logger.warn(`⚠️ Input file not found: ${options.input}`);
        }
      } catch (error) {
        logger.error(`❌ Failed to load input file: ${error.message}`);
        process.exit(1);
      }
    }

    // Determine output directory
    let outputDir = options.output;
    if (outputDir === './speedcrawl-output') {
      try {
        const urlObj = new URL(options.url);
        const domain = urlObj.hostname.replace(/[^a-zA-Z0-9.-]/g, '-');
        outputDir = `./speedcrawl-output/${domain}`;
      } catch {}
    }

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Determine User-Agent
    const userAgent = options.userAgent ||
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

    // Build configuration
    const config = new ConfigManager({
      // Core
      url: options.url,
      maxDepth: parseInt(options.depth),
      maxPages: parseInt(options.pages),
      outputDir: outputDir,
      timeout: parseInt(options.timeout),
      debug: options.debug,

      // Outputs
      formats: options.formats.split(',').map(f => f.trim()).filter(Boolean),

      // Input data
      customInputData: inputData,

      // Request settings
      requestDelay: parseInt(options.requestDelay || 1000),
      userAgent: userAgent,

      // Crawling behavior
      sameOrigin: options.sameOrigin,
      includeSubdomains: options.includeSubdomains || false,
      blockedExtensions: options.blockedExtensions.split(',').map(e => e.trim()).filter(Boolean),
      noSSLCheck: options.noSslCheck,

      // Features
      submitForms: options.submitForms,
      useFaker: options.useFaker && fakerAvailable,
      deepJSAnalysis: options.deepJsAnalysis,
      extractSecrets: options.extractSecrets,

      // Browser
      headless: !options.headful,
      evasionMode: options.evasionMode,
      proxy: options.proxy,

      // Performance
      threads: parseInt(options.threads || 1)
    });

    // Summary
    logger.info('📋 Configuration Summary:');
    logger.info(` 🎯 Target: ${options.url}`);
    logger.info(` 📊 Scope: ${options.pages} pages, depth ${options.depth}`);
    logger.info(` 📁 Output: ${outputDir}`);
    logger.info(` 📄 Formats: ${options.formats}`);
    logger.info(` 🔧 Features:`);
    logger.info(`   • Form Submission: ${options.submitForms ? 'ENABLED' : 'disabled'}`);
    logger.info(`   • Faker Data: ${fakerAvailable && options.useFaker ? 'ENABLED' : 'disabled'}`);
    logger.info(`   • JS Analysis: ${options.deepJsAnalysis ? 'ENABLED' : 'disabled'}`);
    logger.info(`   • Secret Detection: ${options.extractSecrets ? 'ENABLED' : 'disabled'}`);
    if (inputData) logger.info(`   • Custom Input: LOADED (${Object.keys(inputData).length} fields)`);
    if (options.proxy) logger.info(`   • Proxy: ${options.proxy}`);
    if (options.includeSubdomains) logger.info(`   • Subdomains: ${options.includeSubdomains}`);
    logger.info('');

    // Initialize and start
    const crawler = new CrawlEngine(config, logger);
    await crawler.initialize();

    const startTime = Date.now();
    logger.info('🚀 Starting intelligent crawl...');
    logger.info('');

    const results = await crawler.crawl(options.url);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    // Summary
    logger.info('');
    logger.info('═══════════════════════════════════════════════════════════════════');
    logger.info('📊 CRAWL SUMMARY');
    logger.info('═══════════════════════════════════════════════════════════════════');
    logger.info(`✅ Pages Crawled: ${results.pages.length}`);
    logger.info(`📝 Forms Processed: ${results.forms}`);
    logger.info(`⌨️  Fields Filled: ${results.fieldsProcessed}`);
    logger.info(`📡 HTTP Requests: ${results.requestCount}`);
    logger.info(`🔐 Secrets Found: ${(results.secrets || []).length}`);
    logger.info(`🔧 Technologies: ${results.technologies.length}`);
    logger.info(`⏱️  Duration: ${duration}s`);
    logger.info('═══════════════════════════════════════════════════════════════════');
    logger.info('');
    logger.info('✅ Crawl completed successfully!');
    logger.info(`📂 Results: ${outputDir}`);
    logger.info('');
    process.exit(0);
  } catch (error) {
    logger.error('');
    logger.error('═══════════════════════════════════════════════════════════════════');
    logger.error('❌ CRAWL FAILED');
    logger.error('═══════════════════════════════════════════════════════════════════');
    logger.error(`Error: ${error.message}`);
    if (options.debug) {
      logger.error('');
      logger.error('Stack trace:');
      logger.error(error.stack);
    }
    logger.error('═══════════════════════════════════════════════════════════════════');
    logger.error('');
    process.exit(1);
  }
})();
