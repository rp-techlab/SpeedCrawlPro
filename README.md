text
<h1 align="center">
  🚀 SpeedCrawl Pro
</h1>

<h4 align="center">Next-Generation SPA Security Crawler for Penetration Testing</h4>

<p align="center">
<a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/license-MIT-_red.svg"></a>
<a href="https://github.com/rpxsec/SpeedCrawlPro/releases"><img src="https://img.shields.io/github/v/release/rpxsec/SpeedCrawlPro"></a>
<a href="https://nodejs.org"><img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen"></a>
<a href="https://github.com/rpxsec/SpeedCrawlPro"><img src="https://img.shields.io/github/stars/rpxsec/SpeedCrawlPro"></a>
<a href="https://github.com/rpxsec/SpeedCrawlPro/issues"><img src="https://img.shields.io/github/issues/rpxsec/SpeedCrawlPro"></a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage-examples">Usage Examples</a> •
  <a href="#-output-formats">Output</a> •
  <a href="#-troubleshooting">Troubleshooting</a>
</p>

---

## 🎯 What is SpeedCrawl Pro?

**SpeedCrawl Pro** is a powerful, Playwright-based web crawler designed specifically for **modern Single Page Applications** (React, Vue, Angular). It automatically discovers routes, fills and submits complex multi-step forms, captures runtime API endpoints, detects secrets, and generates multiple output formats for security testing workflows.

**Perfect for:**
- 🔒 Penetration testers and security researchers
- 🐛 Bug bounty hunters
- 🤖 Automated security pipelines
- 📊 API discovery and mapping
- 🔍 Secret scanning in web applications

---

## ✨ Features

- **🎯 SPA-Safe Form Automation** — Native property descriptors for React Hook Form with smart checkbox/radio/select handling
- **🔍 Runtime Endpoint Discovery** — Captures fetch/XHR API calls in real-time via injected hooks
- **📦 Deep JavaScript Analysis** — Extracts hidden endpoints from minified chunks using AST parsing
- **🕵️ Stealth Browser Control** — Anti-detection with UA/WebGL spoofing, headful/headless modes
- **📊 Multiple Output Formats** — JSON, JSONL (Nuclei-compatible), HAR, raw HTTP requests
- **🔐 Secrets Detection** — Scans for API keys, tokens, credentials in DOM and JS
- **🌐 Smart Scope Control** — Same-origin, subdomain filtering, asset blocking
- **📈 Real-time Progress** — Live CLI progress bar with detailed statistics

---

## 📥 Installation

### Prerequisites

- **Node.js 20+** (recommended) or Node.js 18+
- **Git** installed on your system
- **Chromium browser** will be installed automatically via Playwright

### Step 1: Install Node.js with NVM

Install NVM (if not already installed)

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
Restart terminal or run:

source ~/.bashrc
Install Node.js 20

nvm install 20
nvm use 20
Verify installation

node -v
Should show: v20.x.x

text

### Step 2: Clone the Repository

Clone from GitHub

git clone https://github.com/rpxsec/SpeedCrawlPro.git
Navigate to directory

cd SpeedCrawlPro

text

### Step 3: Install Dependencies

Install npm packages

npm install
Install Playwright browsers (Chromium)

npm run install-browsers
or

npx playwright install chromium

text

### Step 4: Verify Installation

Run a test crawl

npx speedcrawl -u https://example.com --formats json
Check output directory

ls -la speedcrawl-output/

text

**Expected output:**

✅ STEALTH browser launched
📄 Crawling: https://example.com
✅ Crawl completed in 5.23s
📊 Output saved to: ./speedcrawl-output

text

---

## 🚀 Quick Start

### Basic Web Crawl

npx speedcrawl -u https://example.com --formats json,jsonl

text

### Crawl with Form Submission

npx speedcrawl -u https://app.example.com/login
--submit-forms
--use-faker
--formats json,jsonl,har

text

### Visible Browser Mode (Debug)

npx speedcrawl -u https://example.com
--headful
--deep-js-analysis
-v 2

text

---

## 📖 Usage Examples

### 1. Basic Crawl with Scope Limits

npx speedcrawl
-u https://example.com
-p 100
-d 3
--formats json,jsonl

text

**Explanation:**
- `-u`: Target URL
- `-p 100`: Maximum 100 pages
- `-d 3`: Maximum depth of 3 levels
- `--formats`: Output formats

### 2. SPA Form Testing with Faker Data

npx speedcrawl
-u https://app.example.com/register
--submit-forms
--use-faker
--same-origin
--formats json,jsonl,har,http

text

**What it does:**
- Fills forms with realistic fake data (email, names, etc.)
- Submits forms and captures responses
- Generates HAR file for request replay
- Creates raw HTTP files for SQLMap

### 3. Deep JavaScript Analysis for API Discovery

npx speedcrawl
-u https://app.example.com
--deep-js-analysis
--extract-secrets
--formats json,jsonl
-v 2

text

**Features:**
- Parses JavaScript chunks for hidden endpoints
- Extracts API routes from minified code
- Detects secrets (API keys, tokens)
- Verbose logging level 2

### 4. Proxy + SSL Ignore for Internal Testing

npx speedcrawl
-u https://internal.company.local
--proxy "http://user:pass@proxy.company.local:8080"
--no-ssl-check
--same-origin
--formats json,har

text

**Use case:**
- Internal pentesting through corporate proxy
- Self-signed certificates
- Authenticated proxy support

### 5. Subdomain Crawling with Asset Filtering

npx speedcrawl
-u https://example.com
--same-origin
--include-subdomains "*.example.com"
--blocked-extensions "jpg,png,gif,css,woff,woff2"
-p 500
--formats json,jsonl

text

**Explanation:**
- Crawls main domain + subdomains
- Skips image and font files
- Limits to 500 pages

### 6. Custom Input Data for Forms

Create `input.json`:

{
"email": "test@example.com",
"username": "testuser",
"password": "Test123!@#"
}

text

Run with custom data:

npx speedcrawl
-u https://app.example.com/login
--submit-forms
-i input.json
--formats json,har

text

---

## 🎛️ Command-Line Options

Usage: speedcrawl [options]

Options:
-u, --url <url> Target URL (required)
-p, --pages <number> Max pages to crawl (default: 100)
-d, --depth <number> Max crawl depth (default: 3)
-o, --output <dir> Output directory (default: ./speedcrawl-output)
--formats <formats> Output formats: json,jsonl,har,http (default: json,jsonl)

Scope:
--same-origin Only crawl same-origin links
--include-subdomains <pattern> Include subdomains (e.g., *.example.com)
--blocked-extensions <list> Skip file extensions (comma-separated)

Forms:
--submit-forms Enable form submission
--use-faker Use Faker.js for realistic form data
-i, --input <file> Custom input data JSON file

Analysis:
--deep-js-analysis Enable deep JavaScript chunk analysis
--extract-secrets Scan for secrets and tokens

Browser:
--headful Launch visible browser with devtools
--headless Headless mode (default)
--proxy <url> Proxy URL (http/https/socks5)
--no-ssl-check Ignore SSL certificate errors
--user-agent <string> Custom user agent

Performance:
--request-delay <ms> Delay between requests (default: 1000)
--timeout <ms> Page navigation timeout (default: 30000)

Output:
-v, --verbose <level> Verbosity level 0-3 (default: 1)
--debug Enable debug logging
-h, --help Display help
--version Display version

text

---

## 📄 Output Formats

SpeedCrawl Pro generates multiple output formats in `./speedcrawl-output/`:

| Format | File | Description | Use Case |
|--------|------|-------------|----------|
| **JSON** | `speedcrawl-results.json` | Complete results with pages, forms, endpoints | General analysis, scripting |
| **JSONL** | `nuclei-targets.jsonl` | Nuclei-compatible request targets | Nuclei vulnerability scanning |
| **HAR** | `speedcrawl-requests.har` | HTTP Archive for all requests | Request replay, analysis tools |
| **HTTP** | `http-requests/*.http` | Raw HTTP request files | SQLMap, manual testing |
| **Summary** | `summary.json` / `summary.md` | Human-readable statistics | Quick overview |
| **Endpoints** | `endpoints.txt` | Discovered API endpoints | API testing |
| **Secrets** | `secrets.txt` | Detected secrets (unmasked) | Security review |
| **URLs** | `all-urls.txt` | All discovered URLs | Sitemap, URL analysis |

### Example Summary Output

SpeedCrawl Summary

    Pages: 47

    Forms: 3

    Fields: 18

    Requests: 142

    Endpoints: 12

    Secrets: 2

    JS Chunks: 8

    Duration: 23.45s

text

---

## 🔧 Troubleshooting

### Issue: Browser Not Found

**Error:**

Error: Chromium browser not found

text

**Solution:**

Install Playwright browsers

npx playwright install chromium
Or use npm script

npm run install-browsers

text

### Issue: SSL Certificate Errors

**Error:**

Error: certificate has expired

text

**Solution:**

Use --no-ssl-check flag

npx speedcrawl -u https://example.com --no-ssl-check --formats json

text

### Issue: Headful Mode Window Not Showing

**Error:**

deviceScaleFactor option is not supported with null viewport

text

**Solution:**
This is fixed in the latest version. Update BrowserManager.js or pull latest code:

git pull origin main
npm install

text

### Issue: Forms Not Being Filled

**Problem:** React forms not detecting input changes

**Solution:**
SpeedCrawl Pro uses native property descriptors for React Hook Form compatibility. Ensure you're using the latest version:

git pull origin main

text

For custom input data:

npx speedcrawl -u https://app.example.com/form
--submit-forms
-i input.json

text

### Issue: Proxy Connection Fails

**Error:**

Error: connect ECONNREFUSED

text

**Solution:**

Test proxy format

npx speedcrawl -u https://example.com
--proxy "http://username:password@proxy-host:8080"
--no-ssl-check
For SOCKS proxy

npx speedcrawl -u https://example.com
--proxy "socks5://proxy-host:1080"

text

### Issue: Out of Memory

**Error:**

JavaScript heap out of memory

text

**Solution:**

Increase Node.js memory limit

NODE_OPTIONS="--max-old-space-size=4096" npx speedcrawl -u https://example.com
Or reduce crawl scope

npx speedcrawl -u https://example.com -p 50 -d 2

text

---

## 📝 Advanced Configuration

### Custom User Agent

npx speedcrawl -u https://example.com
--user-agent "Mozilla/5.0 (Custom Bot) SpeedCrawl/1.0"

text

### Request Delay for Rate Limiting

npx speedcrawl -u https://example.com
--request-delay 2000
--timeout 60000

text

### Debug Mode with Verbose Logging

npx speedcrawl -u https://example.com
--debug
-v 3
--headful

text

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Development guidelines:**
- Preserve existing CLI flag names
- Add tests for new features
- Follow Node.js 18+ compatibility
- Document new options in README

---

## 📜 License

SpeedCrawl Pro is licensed under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Built with [Playwright](https://playwright.dev/)
- Inspired by modern web security testing needs
- Special thanks to the security research community

---

<div align="center">

**Made with 🖤 by [rpxsec](https://github.com/rpxsec)**

[Report Bug](https://github.com/rpxsec/SpeedCrawlPro/issues) · [Request Feature](https://github.com/rpxsec/SpeedCrawlPro/issues) · [Documentation](https://github.com/rpxsec/SpeedCrawlPro)

</div>

