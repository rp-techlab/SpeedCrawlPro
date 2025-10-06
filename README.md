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



    Quick install

    Usage examples

    Output formats

    Troubleshooting

Requirements

    Node.js 20+ recommended (works on 18+)

    Git installed

    Linux/macOS/WSL terminal

Installation

    Install Node 20 with nvm, clone the repo, install dependencies, and install the Playwright browser.

bash
# Install NVM (if not installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null

# Use Node 20
nvm install 20
nvm use 20
echo "20" > .nvmrc
node -v

# Clone and install
git clone https://github.com/rpxsec/SpeedCrawlPro.git
cd SpeedCrawlPro
npm install

# Install Playwright browser
npx playwright install chromium
# or: npm run install-browsers

Quick start

    Minimal crawl with JSON output to speedcrawl-output.

bash
npx speedcrawl -u https://example.com --formats json

    Headful debug with deep JS analysis and JSONL streaming.

bash
npx speedcrawl -u https://example.com --headful --deep-js-analysis --formats json,jsonl

    SPA forms with faker and replay artifacts.

bash
npx speedcrawl -u https://app.example.com/login --submit-forms --use-faker --formats json,jsonl,har,http

CLI options

    Core: -u/--url, -p/--pages, -d/--depth, --formats json,jsonl,har,http.

    Scope: --same-origin, --include-subdomains "*.example.com", --blocked-extensions "jpg,png,css,woff".

    Forms: --submit-forms, --use-faker, -i/--input input.json.

    Analysis: --deep-js-analysis, --extract-secrets.

    Browser: --headful, --proxy http://user:pass@host:8080, --no-ssl-check, --user-agent UA.

    Perf/Log: --request-delay ms, --timeout ms, -v 0..3, --debug.

For full help:

bash
npx speedcrawl -h

Output files

    speedcrawl-results.json: main results (pages, forms, endpoints, secrets).

    nuclei-targets.jsonl: nuclei‑compatible request targets.

    speedcrawl-requests.har: HTTP Archive of requests.

    http-requests/*.http: raw HTTP for SQLMap/manual replay.

    summary.json and summary.md: run statistics and counts.

    endpoints.txt, secrets.txt, all-urls.txt, technologies.txt: quick review lists.

Tips

    Use --no-ssl-check on self‑signed TLS targets.

    Use --proxy for corporate networks (http/https/socks supported).

    Reduce scope with -p and -d to avoid heavy runs.

    Reinstall browsers if Chromium fails: npx playwright install chromium.

Troubleshooting

    Chromium missing: npx playwright install chromium.

    npx speedcrawl not found: run from repo root or node bin/speedcrawl.js -h.

    Headful error about deviceScaleFactor + viewport: update BrowserManager to avoid deviceScaleFactor when viewport is null (fix included in latest code).

    Permission issues: avoid sudo; ensure nvm use 20 before npm install.

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

