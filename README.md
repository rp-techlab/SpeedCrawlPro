# 🚀 SpeedCrawl Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-Latest-45ba4b)](https://playwright.dev/)

> **An automated security-aware crawler for modern Single Page Applications (SPAs) that discovers routes, fills and submits complex multi-step React forms, captures runtime API endpoints, detects secrets, and generates multiple output formats for security testing workflows.**

[Features](#-features) • [Installation](#-installation) • [Quick Start](#-quick-start) • [Usage Examples](#-usage-examples) • [Output Formats](#-output-formats) • [Advanced Usage](#-advanced-usage) • [Troubleshooting](#-troubleshooting)

---

## 🎯 Overview

SpeedCrawl Pro is a powerful, Playwright-based web crawler designed specifically for modern Single Page Applications (React, Vue, Angular). It automatically discovers routes, fills and submits complex multi-step forms, captures runtime API endpoints, detects secrets, and generates multiple output formats optimized for security testing workflows.

### Perfect For

- 🔒 **Penetration Testers & Security Researchers** - Comprehensive application mapping
- 🐛 **Bug Bounty Hunters** - Fast reconnaissance and endpoint discovery
- 🤖 **Automated Security Pipelines** - CI/CD integration ready
- 📊 **API Discovery & Mapping** - Runtime endpoint extraction
- 🔍 **Secret Scanning** - Detect exposed credentials and API keys
- 🎯 **SPA Testing** - Native form automation for React, Vue, Angular

---

## ✨ Features

### 🎯 **SPA-Safe Form Automation**
- Native property descriptors for React Hook Form compatibility
- Smart checkbox, radio button, and select handling
- Multi-step form navigation and submission
- Faker.js integration for realistic test data

### 🔍 **Runtime Endpoint Discovery**
- Captures fetch/XHR API calls in real-time via injected hooks
- Monitors WebSocket connections
- Tracks GraphQL queries and mutations
- Records request/response headers and payloads

### 📦 **Deep JavaScript Analysis**
- Extracts hidden endpoints from minified chunks using AST parsing
- Identifies API routes in bundled JavaScript
- Discovers configuration files and environment variables
- Analyzes service worker and web worker files

### 🕵️ **Stealth Browser Control**
- Anti-detection with UA/WebGL spoofing
- Headful/headless modes
- Proxy support (HTTP/HTTPS/SOCKS)
- Custom headers and cookies

### 📊 **Multiple Output Formats**
- **JSON** - Complete structured results
- **JSONL** - Nuclei-compatible targets for vulnerability scanning
- **HAR** - HTTP Archive format for request replay
- **HTTP** - Raw HTTP request files for SQLMap and manual testing

### 🔐 **Advanced Security Features**
- Pattern-based secret detection (API keys, tokens, credentials)
- DOM and JavaScript source scanning
- Entropy-based detection for high-value secrets
- Configurable secret patterns

### 🌐 **Smart Scope Control**
- Same-origin policy enforcement
- Subdomain inclusion/exclusion with wildcard support
- File extension blocking for static assets
- Regex-based URL filtering

### 📈 **Real-time Progress**
- Live CLI progress bar with detailed statistics
- Request/response tracking
- Page count and depth monitoring
- Timing and performance metrics

---

## 📋 Prerequisites

Before installing SpeedCrawl Pro, ensure you have:

| Requirement | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ (recommended) or 18+ | Runtime environment |
| **Git** | Latest | Repository cloning |
| **Terminal** | Linux/macOS/WSL | Command execution |

> **Note**: Chromium browser will be installed automatically via Playwright

### Installing Node.js with NVM

If you don't have Node.js installed, we recommend using NVM (Node Version Manager):

```bash
# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Restart your terminal or reload the configuration
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null

# Install Node.js 20
nvm install 20
nvm use 20

# Verify installation
node -v  # Should show: v20.x.x
```

---

## 🔧 Installation

### Quick Install (Recommended)

```bash
# Install Node.js 20 with NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc 2>/dev/null || source ~/.zshrc 2>/dev/null
nvm install 20
nvm use 20
echo "20" > .nvmrc

# Clone the repository
git clone https://github.com/rpxsec/SpeedCrawlPro.git
cd SpeedCrawlPro

# Install dependencies
npm install

# Install Playwright Chromium browser
npx playwright install chromium
```

### Manual Installation

```bash
# 1. Clone the repository
git clone https://github.com/rpxsec/SpeedCrawlPro.git

# 2. Navigate to the directory
cd SpeedCrawlPro

# 3. Install dependencies
npm install

# 4. Install Playwright browsers
npx playwright install chromium

# 5. Verify installation
npx speedcrawl -h
```

### NPM Scripts (Convenience)

```bash
# Install Playwright browsers
npm run install-browsers

# Run with example URL
npm run crawl
```

---

## 🚀 Quick Start

### Basic Usage

```bash
# Minimal crawl with JSON output
npx speedcrawl -u https://example.com --formats json
```

### Common Scenarios

```bash
# 🔍 Deep scan with all output formats
npx speedcrawl -u https://example.com \
  --deep-js-analysis \
  --extract-secrets \
  --formats json,jsonl,har,http

# 🎯 SPA form testing with Faker data
npx speedcrawl -u https://app.example.com/login \
  --submit-forms \
  --use-faker \
  --formats json,jsonl,har

# 🕵️ Stealth mode with headful browser
npx speedcrawl -u https://example.com \
  --headful \
  --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  --request-delay 2000

# 🌐 Subdomain crawling with scope control
npx speedcrawl -u https://example.com \
  --include-subdomains "*.example.com" \
  --blocked-extensions "jpg,png,gif,css,woff,woff2"

# 🔐 Security-focused scan
npx speedcrawl -u https://example.com \
  --extract-secrets \
  --deep-js-analysis \
  --submit-forms \
  --formats json,jsonl
```

---

## 📖 Usage Examples

### 1. Bug Bounty Reconnaissance

```bash
# Comprehensive discovery for bug bounty targets
npx speedcrawl -u https://target.com \
  --pages 100 \
  --depth 5 \
  --include-subdomains "*.target.com" \
  --deep-js-analysis \
  --extract-secrets \
  --submit-forms \
  --use-faker \
  --formats json,jsonl,har,http \
  --request-delay 1000
```

### 2. API Endpoint Discovery

```bash
# Focus on discovering API endpoints
npx speedcrawl -u https://api.example.com \
  --pages 50 \
  --deep-js-analysis \
  --formats json,jsonl \
  --blocked-extensions "jpg,png,gif,svg,ico,css,woff"
```

### 3. Form Testing with Custom Data

Create an `input.json` file:

```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "SecureP@ss123",
  "phone": "+1234567890"
}
```

Run the crawler:

```bash
npx speedcrawl -u https://app.example.com/signup \
  --submit-forms \
  -i input.json \
  --formats json,har
```

### 4. Corporate Network Testing

```bash
# With proxy authentication
npx speedcrawl -u https://internal.company.com \
  --proxy http://user:pass@proxy.company.com:8080 \
  --no-ssl-check \
  --formats json,http
```

### 5. CI/CD Integration

```bash
# Automated security scanning in CI pipeline
npx speedcrawl -u $TARGET_URL \
  --pages 50 \
  --depth 3 \
  --extract-secrets \
  --formats jsonl \
  --timeout 120000 \
  -v 1
```

### 6. Debug Mode for Development

```bash
# Full debug output with headful browser
npx speedcrawl -u https://example.com \
  --debug \
  -v 3 \
  --headful \
  --pages 10
```

---

## 🎛️ CLI Options Reference

### Core Options

| Flag | Description | Default |
|------|-------------|---------|
| `-u, --url <url>` | **Required.** Target URL to crawl | - |
| `-p, --pages <number>` | Maximum pages to crawl | `50` |
| `-d, --depth <number>` | Maximum crawl depth | `3` |
| `--formats <formats>` | Output formats (comma-separated) | `json` |

**Format Options**: `json`, `jsonl`, `har`, `http`

### Scope Control

| Flag | Description | Default |
|------|-------------|---------|
| `--same-origin` | Only crawl same-origin URLs | `false` |
| `--include-subdomains <pattern>` | Include subdomains (e.g., `*.example.com`) | - |
| `--blocked-extensions <exts>` | Block file extensions (comma-separated) | - |

### Form Automation

| Flag | Description | Default |
|------|-------------|---------|
| `--submit-forms` | Enable form submission | `false` |
| `--use-faker` | Use Faker.js for form data | `false` |
| `-i, --input <file>` | Custom input data JSON file | - |

### Analysis Options

| Flag | Description | Default |
|------|-------------|---------|
| `--deep-js-analysis` | Enable deep JavaScript analysis | `false` |
| `--extract-secrets` | Enable secret detection | `false` |

### Browser Options

| Flag | Description | Default |
|------|-------------|---------|
| `--headful` | Run browser in headful mode | `false` |
| `--proxy <url>` | Proxy server URL | - |
| `--no-ssl-check` | Disable SSL certificate verification | `false` |
| `--user-agent <ua>` | Custom User-Agent string | Default Playwright UA |

### Performance & Logging

| Flag | Description | Default |
|------|-------------|---------|
| `--request-delay <ms>` | Delay between requests (milliseconds) | `0` |
| `--timeout <ms>` | Navigation timeout (milliseconds) | `30000` |
| `-v, --verbose <level>` | Verbosity level (0-3) | `1` |
| `--debug` | Enable debug mode | `false` |

### Help

```bash
# View all options
npx speedcrawl -h
npx speedcrawl --help
```

---

## 📊 Output Formats

SpeedCrawl Pro generates multiple output formats in the `./speedcrawl-output/` directory:

| Format | File | Description | Use Case |
|--------|------|-------------|----------|
| **JSON** | `speedcrawl-results.json` | Complete results with pages, forms, endpoints, secrets | General analysis, scripting |
| **JSONL** | `nuclei-targets.jsonl` | Nuclei-compatible request targets | Nuclei vulnerability scanning |
| **HAR** | `speedcrawl-requests.har` | HTTP Archive for all requests | Request replay, Burp Suite import |
| **HTTP** | `http-requests/*.http` | Raw HTTP request files | SQLMap, manual testing, automation |
| **Summary** | `summary.json` / `summary.md` | Human-readable statistics | Quick overview, reports |
| **Endpoints** | `endpoints.txt` | Discovered API endpoints (one per line) | API testing, fuzzing |
| **Secrets** | `secrets.txt` | Detected secrets (unmasked) | Security review, remediation |
| **URLs** | `all-urls.txt` | All discovered URLs (one per line) | Sitemap generation, URL analysis |
| **Technologies** | `technologies.txt` | Detected technologies and frameworks | Technology stack analysis |

### Example Output Structure

```
speedcrawl-output/
├── speedcrawl-results.json      # Main results file
├── nuclei-targets.jsonl         # Nuclei-compatible targets
├── speedcrawl-requests.har      # HTTP Archive
├── http-requests/               # Raw HTTP files
│   ├── request-001.http
│   ├── request-002.http
│   └── ...
├── summary.json                 # JSON summary
├── summary.md                   # Markdown summary
├── endpoints.txt                # API endpoints
├── secrets.txt                  # Detected secrets
├── all-urls.txt                 # All URLs
└── technologies.txt             # Detected technologies
```

### Sample Summary Output

```
# SpeedCrawl Summary

**Pages Crawled**: 47  
**Forms Found**: 3  
**Form Fields**: 18  
**HTTP Requests**: 142  
**API Endpoints**: 12  
**Secrets Detected**: 2  
**JS Chunks Analyzed**: 8  
**Duration**: 23.45s
```

---

## 🔌 Advanced Usage

### Integration with Security Tools

#### Nuclei Vulnerability Scanner

```bash
# 1. Crawl target and generate Nuclei targets
npx speedcrawl -u https://example.com --formats jsonl

# 2. Run Nuclei on discovered targets
nuclei -l speedcrawl-output/nuclei-targets.jsonl -t ~/nuclei-templates/
```

#### SQLMap Integration

```bash
# 1. Generate raw HTTP requests
npx speedcrawl -u https://example.com \
  --submit-forms \
  --formats http

# 2. Test with SQLMap
for file in speedcrawl-output/http-requests/*.http; do
    sqlmap -r "$file" --batch --level 5 --risk 3
done
```

#### Burp Suite Import

```bash
# 1. Generate HAR file
npx speedcrawl -u https://example.com --formats har

# 2. Import into Burp Suite
# Proxy > HTTP history > Right-click > Import > speedcrawl-requests.har
```

### Custom Secret Patterns

Create a `secret-patterns.json` file:

```json
{
  "patterns": [
    {
      "name": "Custom API Key",
      "pattern": "api_key_[a-zA-Z0-9]{32}",
      "severity": "high"
    },
    {
      "name": "Internal Token",
      "pattern": "INTERNAL_[A-Z0-9]{16}",
      "severity": "medium"
    }
  ]
}
```

### Programmatic Usage (Node.js)

```javascript
const { SpeedCrawl } = require('./lib/SpeedCrawl');

async function main() {
  const crawler = new SpeedCrawl({
    url: 'https://example.com',
    pages: 50,
    depth: 3,
    submitForms: true,
    useFaker: true,
    extractSecrets: true,
    deepJsAnalysis: true,
    formats: ['json', 'jsonl', 'har']
  });

  const results = await crawler.run();
  
  console.log(`Pages crawled: ${results.pages.length}`);
  console.log(`Endpoints found: ${results.endpoints.length}`);
  console.log(`Secrets detected: ${results.secrets.length}`);
}

main().catch(console.error);
```

---

## 🐛 Troubleshooting

### Common Issues and Solutions

#### ❌ Chromium browser not found

**Error:**
```
Error: Chromium browser not found
```

**Solution:**
```bash
# Install Playwright browsers
npx playwright install chromium

# Or use npm script
npm run install-browsers
```

---

#### ❌ SSL Certificate Error

**Error:**
```
Error: certificate has expired
```

**Solution:**
```bash
# Use --no-ssl-check flag
npx speedcrawl -u https://example.com --no-ssl-check --formats json
```

---

#### ❌ deviceScaleFactor Viewport Error

**Error:**
```
Error: deviceScaleFactor option is not supported with null viewport
```

**Solution:**
```bash
# Update to latest version
git pull origin main
npm install
```

---

#### ❌ React Forms Not Detecting Changes

**Problem:** React forms not detecting input changes

**Solution:**
SpeedCrawl Pro uses native property descriptors for React Hook Form compatibility. Ensure you're using the latest version:

```bash
git pull origin main
npm install
```

---

#### ❌ npx speedcrawl not found

**Error:**
```
Command 'speedcrawl' not found
```

**Solution:**
```bash
# Run from repository root
cd SpeedCrawlPro

# Or use explicit path
node bin/speedcrawl.js -h
```

---

#### ❌ Permission Issues

**Problem:** Permission denied errors during installation

**Solution:**
```bash
# Avoid using sudo with npm
# Ensure you're using NVM
nvm use 20

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

#### ⚠️ Slow Performance

**Tips for optimization:**

```bash
# Reduce scope
npx speedcrawl -u https://example.com -p 20 -d 2

# Block static assets
npx speedcrawl -u https://example.com \
  --blocked-extensions "jpg,png,gif,svg,ico,css,woff,woff2,ttf,eot"

# Add request delay for rate limiting
npx speedcrawl -u https://example.com --request-delay 500

# Disable heavy analysis
npx speedcrawl -u https://example.com \
  --formats json  # Skip HAR and HTTP generation
```

---

#### 🔍 Debug Mode

For detailed troubleshooting:

```bash
npx speedcrawl -u https://example.com \
  --debug \
  -v 3 \
  --headful \
  --pages 5
```

This will:
- Enable full debug logging
- Set maximum verbosity (level 3)
- Open visible browser window
- Limit to 5 pages for faster iteration

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/SpeedCrawlPro.git
   cd SpeedCrawlPro
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests for new features

5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your fork and branch

### Development Guidelines

- ✅ Preserve existing CLI flag names for backward compatibility
- ✅ Add tests for new features
- ✅ Follow Node.js 18+ compatibility
- ✅ Document new options in README
- ✅ Use meaningful commit messages
- ✅ Keep PRs focused and atomic

### Code Style

- Use ES6+ features
- Follow existing formatting conventions
- Add JSDoc comments for functions
- Keep functions small and focused

---

## 📄 License

SpeedCrawl Pro is licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2024 rpxsec

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Built with ❤️ using [Playwright](https://playwright.dev/)
- Inspired by modern web security testing needs
- Special thanks to the security research community
- Form automation inspired by React Hook Form patterns
- Secret detection patterns from community research

---

## 🔗 Resources

- **GitHub Repository**: [github.com/rpxsec/SpeedCrawlPro](https://github.com/rpxsec/SpeedCrawlPro)
- **Issues & Bugs**: [github.com/rpxsec/SpeedCrawlPro/issues](https://github.com/rpxsec/SpeedCrawlPro/issues)
- **Playwright Docs**: [playwright.dev](https://playwright.dev/)
- **Nuclei Templates**: [github.com/projectdiscovery/nuclei-templates](https://github.com/projectdiscovery/nuclei-templates)

---

## 📞 Support

If you encounter issues or have questions:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Search [existing issues](https://github.com/rpxsec/SpeedCrawlPro/issues)
3. Open a [new issue](https://github.com/rpxsec/SpeedCrawlPro/issues/new) with:
   - Node.js version (`node -v`)
   - Operating system
   - Command used
   - Error message
   - Debug output (`--debug -v 3`)

---

<div align="center">

Made with 🖤 by [rpxsec](https://github.com/rpxsec)

**[⬆ Back to Top](#-speedcrawl-pro)**

</div>
