SpeedCrawl Pro 🚀 — SPA Security Crawler

A Playwright‑powered, security‑aware crawler for modern SPAs that fills React‑controlled forms safely, maps runtime API endpoints, detects secrets, and emits JSON/JSONL/HAR/HTTP outputs for workflows and CI pipelines.
Highlights ✨

    React‑safe form automation with native setters for value/checked, proper select change commits, and guarded POST detection.

Runtime endpoint capture via injected fetch/XHR hooks combined with deep JS chunk analysis for hidden APIs.

Stealth headful/headless browser control, CSP bypass, proxy support, UA/WebGL hardening, and optional SSL ignore.

Streaming JSONL, HAR, raw HTTP, and summaries in a deterministic output directory structure.
Table of Contents 📚

    Installation and Setup

Quick Start

Usage and Examples

SPA Forms Guide

Endpoint Discovery

Outputs and Artifacts

Configuration Behavior

Browser and Stealth

Troubleshooting

License
Installation and Setup 🧱

    Requirements: Node.js 20 via nvm is recommended for modern Playwright and SPA automation, while engines specify >=16 in package.json.

Playwright browsers must be installed before first run to make Chromium available.

Setup

bash
git clone <your-repo-url> speedcrawl-pro
cd speedcrawl-pro
nvm install 20
nvm use 20
node -v   # should be v20.x
npm install
npm run install-browsers   # or: npx playwright install

The CLI entry is bin/speedcrawl.js and is exposed as the speedcrawl command via the package.json bin mapping.
Quick Start ⚡

    Minimal crawl with JSON output: npx speedcrawl -u https://example.com --formats json.

Headful SPA analysis with deep JS scanning: npx speedcrawl -u https://example.com --headful --deep-js-analysis --formats json,jsonl.

Self‑signed targets with proxy routing: npx speedcrawl -u https://internal.example --proxy "http://user:pass@127.0.0.1:8080" --no-ssl-check --formats json,har,http.
Usage and Examples 🧭

Core flags

    -u/--url: target URL is required and drives initial scope.

-p/--pages and -d/--depth: bound page count and crawl depth.

--formats json,jsonl,har,http: select output reporters and formats.

Scope and filtering

    --same-origin confines links to the exact origin of the start URL.

--include-subdomains extends scope to subdomains under the base host.

--blocked-extensions "jpg,png,css,woff": skip asset types at enqueue time.

Forms and analysis

    --submit-forms enables form submit attempts on discovered forms.

--use-faker allows realistic input generation where Faker is available.

--deep-js-analysis enables chunk parsing for static endpoint discovery.

Network and browser

    --proxy supports http(s)/socks with optional authentication.

--no-ssl-check allows ignoreHTTPSErrors in stealth contexts.

--headful launches a visible window with devtools and proper viewport null.
SPA Forms Guide 📝

    Native setters: value and checked are set via property descriptors to ensure React Hook Form state is updated, followed by input/change/blur events.

Checkables: checkboxes and radios are toggled explicitly with event dispatch to commit state in controlled components.

Selects: the first non‑empty option is preferred and a change event is fired to persist selection.

Submission: visible, enabled submit buttons are preferred with JS click fallback and a guarded wait for non‑analytics POST detection.
Endpoint Discovery 🎯

    Runtime: injected fetch/XHR hooks append requests to window.__speedcrawl_requests and EndpointAnalyzer aggregates method, path, and URL for analysis.

Static: JSChunkAnalyzer enumerates chunk URLs and parses code via AST/regex to extract hidden endpoints, methods, and parameters when deep analysis is enabled.

Union: the engine merges runtime and static endpoints, dedupes by path, and includes counts in summary outputs.
Outputs and Artifacts 📦

    Streaming JSONL: requests‑stream.jsonl is appended during crawl to avoid high memory usage.

HAR: speedcrawl-requests.har enables broad tooling and replay analysis.

Raw HTTP: http-requests/*.http contains one file per request for SQLMap/manual testing.

JSON/JSONL: speedcrawl-results.json and nuclei-targets.jsonl for automation workflows.

Summaries: summary.json and plain summary.md list pages, forms, fields, requests, endpoints, secrets, JS chunks, and duration.
Configuration Behavior ⚙️

    Aliases: pages→maxPages, depth→maxDepth, input/customInputData preserved, headful→headless:false, deepJsAnalysis→deepJSAnalysis, and noSslCheck/sslCheck:false→noSSLCheck.

Blocked extensions: CSV/array forms are normalized once and enforced during enqueue filtering.

All flags are retained without renaming, with normalization applied centrally for stable downstream consumption.
Browser and Stealth 🕵️

    Chromium launch: honors headless and headful with devtools enabled and viewport null for visible sessions.

SSL and CSP: ignoreHTTPSErrors is gated by noSSLCheck and bypassCSP is enabled for robust injection and evaluation.

Anti‑bot: navigator.webdriver false, UA‑CH brand cleanup, WebGL spoofing, and permissions patches reduce trivial detection.

Request hooks: a lightweight init script captures fetch/XHR to populate window.__speedcrawl_requests across all pages.
Crawl Flow 🔁

    Queue: breadth‑first within maxPages/maxDepth, dedupes links, strips hashes, and ignores javascript:/mailto:/tel: schemes.

Scope: same‑origin with optional include‑subdomains; blocked extensions filtered at add‑time.

Per page: detect tech, deep analyze chunks (opt‑in), process forms, capture endpoints, scan secrets, stream requests, and emit progress events.
Troubleshooting 🧩

    Missing browsers: rerun npx playwright install or npm run install-browsers if Chromium cannot launch.

SSL errors: add --no-ssl-check to allow stealth contexts to ignore certificate issues on self‑signed targets.

Outputs missing: ensure --formats includes json/jsonl/har/http and the output directory is writable.
License 📄

    MIT License as declared in package.json.

Notes for Contributors 🤝

    Preserve existing flag names; introduce only non‑breaking alias normalization in ConfigManager to keep cross‑file contracts stable.

Favor small, localized changes with Node 18+ compatibility and Playwright alignment, validated by CLI runs and generated artifacts.

If a fully themed README with badges and screenshots is desired, assets can be added later without changing any CLI flag or module contract documented above.
