<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Zero_Deps-✅-success?style=for-the-badge" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-informational?style=for-the-badge" alt="Cross Platform"/>
</p>

<h1 align="center">🎬 csviz</h1>

<p align="center">
  <strong>Turn any CSV into beautiful terminal charts — bar, line, table, sparklines.</strong><br/>
  Watch mode · Row filters · JSON/YAML export · Zero dependencies
</p>

<p align="center">
  <a href="#-use-cases">Use Cases</a> •
  <a href="#-demo">Demo</a> •
  <a href="#-installation">Install</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-why-csviz">Why csviz</a> •
  <a href="#-faq">FAQ</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🎯 Use Cases

**Data Analysis** — Quickly visualize a CSV without opening Excel or Python. Pipe data from `curl`, `awk`, or any CLI tool directly into a chart.

```bash
# Visualize API response data
curl -s https://api.example.com/stats.csv | csviz -t bar -c "count"

# Chart log data extracted with awk
awk -F',' '{print $1","$4}' access.log | csviz -t line -y "response_time"
```

**Log Viewing** — Turn structured logs (CSV format) into readable tables or sparklines. Filter to specific log levels or time ranges.

```bash
# Filter error logs and show as table
csviz server.log.csv -f "level=ERROR" -f "status>=500"

# Watch a growing log file in real-time
csviz metrics.csv --watch -t line -y "latency,throughput"
```

**CSV Preview** — Instantly see what's inside a CSV file with proper formatting, auto-detected column types, and smart number formatting.

```bash
# Quick preview
csviz data.csv

# Compact view with filter
csviz users.csv --compact -f "active=true" -n 20
```

**Data Export** — Convert CSV to JSON or YAML without any extra tools.

```bash
csviz data.csv --export json > data.json
csviz data.csv --export yaml > data.yaml
```

---

## 🖥 Demo

### Table View
```
$ csviz examples/sample.csv

  ┌──────────┬─────────────┬─────────┬────────┬──────────┐
  │  Name    │  Department │ Revenue │ Growth │  Region  │
  ├──────────┼─────────────┼─────────┼────────┼──────────┤
  │  Alice   │ Engineering │  12,400 │    15  │    APAC  │
  │  Bob     │       Sales │   8,200 │    -3  │    EMEA  │
  │  Carol   │   Marketing │  23,100 │    42  │    APAC  │
  │  Dave    │ Engineering │  18,700 │    28  │ Americas │
  │  Eve     │       Sales │   5,500 │    -8  │    EMEA  │
  │  Frank   │   Marketing │  31,200 │    65  │ Americas │
  │  Grace   │ Engineering │   9,800 │    12  │    APAC  │
  │  Hank    │       Sales │  14,500 │    19  │ Americas │
  │  Ivy     │   Marketing │   7,300 │     5  │    EMEA  │
  │  Jack    │ Engineering │  27,800 │    51  │    APAC  │
  └──────────┴─────────────┴─────────┴────────┴──────────┘

  10 rows × 5 columns
```

### Bar Chart
```
$ csviz examples/sample.csv -t bar -c "Revenue"

  Revenue
  by Name · 10 items

  Alice   ████████████████████   12.4K
  Bob     █████████████          8.2K
  Carol   █████████████████████████████████████  23.1K
  Dave    ██████████████████████████████  18.7K
  Eve     ████████               5.5K
  Frank   ██████████████████████████████████████████████  31.2K
  Grace   ████████████████       9.8K
  Hank    ████████████████████  14.5K
  Ivy     ███████████            7.3K
  Jack    ██████████████████████████████████████████  27.8K

  Total: 158.5K  ·  Avg: 15.85K  ·  Min: 5.5K  ·  Max: 31.2K
```

### Filtered View
```
$ csviz examples/sample.csv -t bar -c "Revenue" -f "Region=APAC"

  Revenue
  by Name · 4 items

  Alice   ████████████████████████   12.4K
  Carol   ██████████████████████████████████████████████  23.1K
  Grace   ████████████████████       9.8K
  Jack    ████████████████████████████████████████████████████  27.8K

  Total: 73.1K  ·  Avg: 18.28K  ·  Min: 9.8K  ·  Max: 27.8K
```

### Sparkline
```
$ csviz examples/sample.csv -t spark -c "Growth"
Stock Price: ⡇⣤⢾⡷⣦⢧⡷⣤⢧⠇
```

---

## 📦 Installation

```bash
npm install -g csviz
```

Or use directly with npx (no install needed):

```bash
npx csviz data.csv
```

Requires **Node.js 16+**. No other dependencies.

---

## 🚀 Usage

### Basic

```bash
# Display a beautiful table
csviz data.csv

# Bar chart of a specific column
csviz data.csv -t bar -c "Revenue"

# Multi-line chart
csviz data.csv -t line -y "Price,Volume"

# Sparkline
csviz data.csv -t spark -c "Temperature"

# Pipe from stdin
cat data.csv | csviz -t bar -c "Sales"
```

### Filtering

```bash
# Single filter
csviz data.csv -f "Status=Active"

# Multiple filters (AND logic)
csviz data.csv -f "Region=APAC" -f "Revenue>10000"

# Regex filter
csviz data.csv -f "Name~=^A"

# Numeric comparison
csviz data.csv -f "Price>=100" -f "Price<=500"
```

**Filter operators:**

| Operator | Meaning | Example |
|----------|---------|---------|
| `=` | Exact match | `"Status=Active"` |
| `!=` | Not equal | `"Status!=Closed"` |
| `>` | Greater than | `"Price>100"` |
| `>=` | Greater or equal | `"Score>=80"` |
| `<` | Less than | `"Age<30"` |
| `<=` | Less or equal | `"Count<=10"` |
| `~=` | Regex match | `"Name~=^A"` |
| `~!` | Regex not match | `"Name~!test"` |

### Export

```bash
# Export to JSON
csviz data.csv --export json > output.json

# Export to YAML
csviz data.csv --export yaml > output.yaml

# Filter + export
csviz data.csv -f "Region=APAC" --export json
```

### Watch Mode

```bash
# Watch a file and auto-refresh the chart
csviz data.csv --watch -t bar -c "Revenue"

# Watch with filters
csviz data.csv --watch -f "status=running" -t line -y "latency"
```

Press `Ctrl+C` to stop watching.

### All Options

| Option | Short | Description |
|--------|-------|-------------|
| `--type <type>` | `-t` | Chart type: `table` (default), `bar`, `line`, `spark` |
| `--column <col>` | `-c` | Column to visualize |
| `--x-column <col>` | `-x` | X-axis column (line chart) |
| `--y-column <col>` | `-y` | Y-axis column(s), comma-separated |
| `--rows <n>` | `-n` | Max rows to display (default: 30) |
| `--width <n>` | `-W` | Chart width in characters |
| `--height <n>` | `-H` | Chart height in characters |
| `--title <title>` | | Custom chart title |
| `--compact` | | Compact table mode (no borders) |
| `--color <scheme>` | | Color scheme: `auto`, `256`, `16`, `none` |
| `--filter <expr>` | `-f` | Filter rows (repeatable). See operators above |
| `--export <fmt>` | `-e` | Export as `json` or `yaml` (no chart) |
| `--watch` | | Watch file for changes, auto-refresh |
| `--version` | `-v` | Show version |
| `--help` | `-h` | Show help |

---

## 🤔 Why csviz?

| Feature | csviz | csvlook (csvkit) | miller | visidata |
|---------|-------|-------------------|--------|----------|
| Bar charts | ✅ | ❌ | ❌ | Basic |
| Line charts (Braille) | ✅ | ❌ | ❌ | ✅ |
| Sparklines | ✅ | ❌ | ❌ | ❌ |
| Row filtering | ✅ | ✅ (via csvgrep) | ✅ | ✅ |
| JSON/YAML export | ✅ | ❌ | ✅ | ❌ |
| File watch mode | ✅ | ❌ | ❌ | ❌ |
| Zero dependencies | ✅ | ❌ (Python) | ❌ (Go) | ❌ (Python) |
| Install size | ~25 KB | ~2 MB | ~15 MB | ~3 MB |
| Unix pipe friendly | ✅ | ✅ | ✅ | ❌ |

**csviz is the fastest way to see your CSV data.** No Python, no heavy frameworks — just one file and Node.js.

---

## ❓ FAQ

**Q: Does it work on Windows?**
A: Yes, csviz works on Windows, macOS, and Linux. Unicode rendering depends on your terminal — Windows Terminal and PowerShell 7+ work great.

**Q: What about very large CSV files?**
A: csviz reads the entire file into memory. For files under ~100 MB this is fine. Use `--rows` to limit display, and `--filter` to narrow down data before charting.

**Q: Can I use a different delimiter (semicolon, tab)?**
A: Yes — csviz auto-detects delimiters (comma, semicolon, tab, pipe). No configuration needed.

**Q: Does it handle messy CSV files?**
A: csviz handles quoted fields, escaped quotes, BOM markers, and mixed line endings. If your CSV is RFC 4180 compliant, it'll work.

**Q: Why no dark/light theme toggle?**
A: csviz auto-detects your terminal's color support and adjusts accordingly. The output looks great on both dark and light backgrounds.

**Q: Can I use csviz as a library?**
A: Yes! Each module in `lib/` is independently importable:

```javascript
const { CSVParser } = require('csviz/lib/parser');
const { renderTable } = require('csviz/lib/table');
const { exportData } = require('csviz/lib/export');
const { applyFilters } = require('csviz/lib/filter');
```

---

## 🛠 Tech Details

- **Parser**: Character-by-character parser handles quoted fields, custom delimiters, BOM, and mixed line endings
- **Colors**: Auto-detects terminal color support (256-color, 16-color, or monochrome), falls back gracefully
- **Charts**: Unicode Braille dots for high-resolution (2×4 per character) line charts, box-drawing for tables
- **Performance**: Efficient parsing, no streaming overhead for typical file sizes
- **Zero deps**: No `node_modules` black hole — the entire tool is ~25 KB

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repo and clone your fork
2. **Create a branch**: `git checkout -b feature/my-feature`
3. **Make your changes** — keep it zero-dependency
4. **Test manually**: `node bin/csviz.js examples/sample.csv -t bar`
5. **Commit**: Write clear commit messages
6. **Push** and open a Pull Request

### Ideas for contributions

- 🎨 New chart types (scatter, pie, heatmap)
- 📊 Stats mode (show mean, median, stddev, percentiles)
- 📁 Directory mode (chart all CSVs in a folder)
- 🌐 CSV from URL (`csviz https://example.com/data.csv`)
- 📋 Clipboard output (copy chart to clipboard)
- 🧪 Test suite

### Guidelines

- **Zero dependencies** — this is a core design principle. If you need a dependency, it probably belongs in a separate tool.
- **Cross-platform** — test on macOS, Linux, and Windows if possible.
- **Small is beautiful** — keep the codebase lean and readable.

---

## 📄 License

MIT — use it however you like.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/nadonghuang">nadonghuang</a>
  <br/>
  <sub>If csviz makes your terminal prettier, give it a ⭐!</sub>
</p>
