#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { CSVParser } = require('../lib/parser');
const { renderTable } = require('../lib/table');
const { renderBar } = require('../lib/bar');
const { renderLine } = require('../lib/line');
const { renderSparkline } = require('../lib/line');

const USAGE = `
🎬 csviz — Beautiful CSV visualization in your terminal

Usage: csviz <file> [options]

Options:
  -t, --type <type>    Chart type: table (default), bar, line, spark
  -c, --column <col>   Column to chart (for bar/line)
  -x, --x-column <col> X-axis column (for line)
  -y, --y-column <col> Y-axis column(s) for line chart (comma-separated)
  -n, --rows <n>       Max rows to display (default: 30)
  -W, --width <n>      Chart width in characters
  -H, --height <n>     Chart height in characters
  --title <title>      Chart title
  --compact            Compact table mode (no borders)
  --color <scheme>     Color scheme: auto,256,16,none
  -h, --help           Show this help

Examples:
  csviz data.csv                           # Show table
  csviz data.csv -t bar -c "Revenue"       # Bar chart
  csviz data.csv -t line -y "Price,Volume" # Line chart
  csviz data.csv -t spark -c "Temp"        # Sparkline

 stdin: cat data.csv | csviz -t bar -c "Sales"
`.trim();

function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { type: 'table' };
  const positional = [];

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '-t' || a === '--type') { opts.type = args[++i]; }
    else if (a === '-c' || a === '--column') { opts.column = args[++i]; }
    else if (a === '-x' || a === '--x-column') { opts.xColumn = args[++i]; }
    else if (a === '-y' || a === '--y-column') { opts.yColumns = args[++i].split(','); }
    else if (a === '-n' || a === '--rows') { opts.maxRows = parseInt(args[++i]); }
    else if (a === '-W' || a === '--width') { opts.width = parseInt(args[++i]); }
    else if (a === '-H' || a === '--height') { opts.height = parseInt(args[++i]); }
    else if (a === '--title') { opts.title = args[++i]; }
    else if (a === '--compact') { opts.compact = true; }
    else if (a === '--color') { opts.colorScheme = args[++i]; }
    else if (a === '-h' || a === '--help') { console.log(USAGE); process.exit(0); }
    else if (!a.startsWith('-')) { positional.push(a); }
  }

  return { ...opts, file: positional[0] || null };
}

function main() {
  const opts = parseArgs(process.argv);

  // Read CSV
  const input = opts.file ? fs.readFileSync(opts.file, 'utf-8') : fs.readFileSync('/dev/stdin', 'utf-8');
  const data = CSVParser.parse(input);

  if (data.headers.length === 0) {
    console.error('Error: No data found. Check your CSV format.');
    process.exit(1);
  }

  // Render
  switch (opts.type) {
    case 'bar':
      console.log(renderBar(data, { valueColumn: opts.column, ...opts }));
      break;
    case 'line':
      console.log(renderLine(data, { yColumns: opts.yColumns, xColumn: opts.xColumn, ...opts }));
      break;
    case 'spark':
    case 'sparkline':
      const col = opts.column || (data.numericColumns[0] && data.numericColumns[0].name);
      if (!col) { console.error('Error: No numeric column found for sparkline'); process.exit(1); }
      const ci = data.headers.indexOf(col);
      const values = data.rows.map(r => CSVParser.toNumber(r[ci])).filter(v => !isNaN(v));
      console.log(renderSparkline(values, opts));
      break;
    case 'table':
    default:
      console.log(renderTable(data, opts));
  }
}

main();
