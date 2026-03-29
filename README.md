<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Zero_Deps-✅-success?style=for-the-badge" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux%20%7C%20Windows-informational?style=for-the-badge" alt="Cross Platform"/>
</p>

<h1 align="center">🎬 csviz</h1>

<p align="center">
  <strong>Turn any CSV into beautiful terminal charts — bar, line, table, sparklines.</strong><br/>
  Zero dependencies. Pure Unicode. Gorgeous output.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-examples">Examples</a> •
  <a href="#-license">License</a>
</p>

---

## ✨ Features

- 📊 **Bar Charts** — Horizontal bars with color gradients
- 📈 **Line Charts** — Braille-based high-resolution sparklines & multi-line plots
- 📋 **Data Tables** — Beautiful Unicode tables with alternating rows
- ⚡ **Sparklines** — Single-line inline charts
- 🎨 **Color Themes** — Auto-detect terminal colors (256-color, 16-color, or monochrome)
- 📏 **Smart Scaling** — Automatic axis scaling with nice tick values
- 🔢 **Number Formatting** — Auto-detect numeric columns, smart formatting
- 🚀 **Zero Dependencies** — No npm packages needed, pure Node.js

## 📦 Installation

```bash
npm install -g csviz
```

Or use directly with npx:

```bash
npx csviz data.csv
```

## 🚀 Usage

```bash
# Display a beautiful table
csviz data.csv

# Bar chart
csviz data.csv -t bar -c "Revenue"

# Line chart with multiple series
csviz data.csv -t line -y "Price,Volume"

# Sparkline
csviz data.csv -t spark -c "Temperature"

# Pipe from stdin
cat data.csv | csviz -t bar -c "Sales"

# Custom title and size
csviz data.csv -t bar -c "Revenue" --title "Q4 Revenue" --width 60
```

### Options

| Option | Short | Description |
|--------|-------|-------------|
| `--type <type>` | `-t` | Chart type: `table`, `bar`, `line`, `spark` |
| `--column <col>` | `-c` | Column to visualize |
| `--x-column <col>` | `-x` | X-axis column (line chart) |
| `--y-column <col>` | `-y` | Y-axis column(s), comma-separated |
| `--rows <n>` | `-n` | Max rows to display (default: 30) |
| `--width <n>` | `-W` | Chart width in characters |
| `--height <n>` | `-H` | Chart height in characters |
| `--title <title>` | | Custom chart title |
| `--compact` | | Compact table mode (no borders) |
| `--color <scheme>` | | Color scheme: `auto`, `256`, `16`, `none` |

## 🖼 Examples

### Table View
```
  ┌─────────┬──────────┬──────────┐
  │  Name   │ Revenue  │ Growth   │
  ├─────────┼──────────┼──────────┤
  │ Alice   │  $12,400 │    +15%  │
  │  Bob    │   $8,200 │     -3%  │
  │ Carol   │  $23,100 │    +42%  │
  └─────────┴──────────┴──────────┘

  3 rows × 3 columns
```

### Bar Chart
```
  Revenue by Region
  ╭──────────────────────────────────────╮
  │ 🏙 NYC     ██████████████████  $45.2K │
  │ 🌉 SF      ██████████████     $38.1K │
  │ 🏔 Denver  ████████           $21.7K │
  │ 🌴 Miami   ██████████████     $36.5K │
  ╰──────────────────────────────────────╯
```

### Sparkline
```
  Stock Price: ⡇⣤⢾⡷⣦⢧⡷⣤⢧⠇
```

## 🛠 Tech Details

- **Parser**: Handles quoted fields, custom delimiters, BOM, mixed line endings
- **Colors**: Auto-detects terminal color support, falls back gracefully
- **Performance**: Streams large files, memory-efficient parsing
- **Unicode**: Box-drawing characters, Braille plots, emoji support

## 📄 License

MIT — use it however you like.

---

<p align="center">
  Made with ⚡ by <a href="https://github.com/nadonghuang">nadonghuang</a>
  <br/>
  <sub>If csviz makes your terminal prettier, give it a ⭐!</sub>
</p>
