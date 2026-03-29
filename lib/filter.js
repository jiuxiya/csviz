// lib/filter.js — Row filtering for CSV data (zero dependencies)
'use strict';

/**
 * Parse a filter expression into a predicate function.
 *
 * Supported syntax:
 *   "Column=value"        → exact match
 *   "Column!=value"       → not equal
 *   "Column>value"        → greater than (numeric)
 *   "Column>=value"       → greater than or equal
 *   "Column<value"        → less than
 *   "Column<=value"       → less than or equal
 *   "Column~=pattern"     → regex match
 *   "Column~!pattern"     → regex not match
 *   "Column"              → column is non-empty / truthy
 *
 * Multiple filters are AND-combined.
 *
 * @param {string[]} headers - Column names
 * @param {string[]} filterExprs - Array of filter expressions
 * @returns {Function} predicate(row: string[]) => boolean
 */
function buildFilter(headers, filterExprs) {
  if (!filterExprs || filterExprs.length === 0) {
    return () => true;
  }

  const predicates = filterExprs.map(expr => {
    // Try operators in order of longest first
    const ops = ['~!', '~=', '<=', '>=', '!=', '>', '<', '='];
    for (const op of ops) {
      const idx = expr.indexOf(op);
      if (idx > 0) {
        const col = expr.slice(0, idx).trim();
        const val = expr.slice(idx + op.length).trim();
        const colIdx = headers.indexOf(col);
        if (colIdx < 0) {
          process.stderr.write(`  ⚠ Filter: column "${col}" not found, skipping\n`);
          return () => true;
        }
        return buildPredicate(colIdx, op, val);
      }
    }

    // Bare column name → non-empty check
    const colIdx = headers.indexOf(expr.trim());
    if (colIdx >= 0) {
      return (row) => row[colIdx] != null && row[colIdx].trim() !== '';
    }

    process.stderr.write(`  ⚠ Invalid filter expression: "${expr}"\n`);
    return () => true;
  });

  return (row) => predicates.every(p => p(row));
}

function buildPredicate(colIdx, op, val) {
  switch (op) {
    case '=':
      return (row) => (row[colIdx] || '').trim() === val;
    case '!=':
      return (row) => (row[colIdx] || '').trim() !== val;
    case '>': {
      const num = parseFloat(val);
      return (row) => parseFloat(row[colIdx]) > num;
    }
    case '>=': {
      const num = parseFloat(val);
      return (row) => parseFloat(row[colIdx]) >= num;
    }
    case '<': {
      const num = parseFloat(val);
      return (row) => parseFloat(row[colIdx]) < num;
    }
    case '<=': {
      const num = parseFloat(val);
      return (row) => parseFloat(row[colIdx]) <= num;
    }
    case '~=': {
      const re = new RegExp(val);
      return (row) => re.test(row[colIdx] || '');
    }
    case '~!': {
      const re = new RegExp(val);
      return (row) => !re.test(row[colIdx] || '');
    }
    default:
      return () => true;
  }
}

/**
 * Apply filter expressions to parsed CSV data.
 * @param {object} data - { headers, rows, numericColumns }
 * @param {string[]} filterExprs - Filter expressions
 * @returns {object} filtered data with same shape
 */
function applyFilters(data, filterExprs) {
  if (!filterExprs || filterExprs.length === 0) return data;

  const predicate = buildFilter(data.headers, filterExprs);
  const filteredRows = data.rows.filter(predicate);

  // Recalculate numericColumns for filtered data
  const numericColumns = [];
  for (let col = 0; col < data.headers.length; col++) {
    const values = filteredRows.map(r => r[col]).filter(v => v != null && v !== '');
    if (values.length === 0) continue;
    const numCount = values.filter(v => {
      const cleaned = v.replace(/[$€£¥%,\s]/g, '').replace(/\((.+)\)/, '-$1');
      return cleaned !== '' && !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
    }).length;
    if (numCount / values.length >= 0.7) {
      numericColumns.push({ name: data.headers[col], index: col });
    }
  }

  return {
    headers: data.headers,
    rows: filteredRows,
    numericColumns,
  };
}

module.exports = { buildFilter, applyFilters };
