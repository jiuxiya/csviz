// lib/export.js — Export CSV data to JSON / YAML (zero dependencies)
'use strict';

/**
 * Convert parsed CSV data to JSON string.
 * @param {object} data - { headers, rows }
 * @param {object} [opts]
 * @param {boolean} [opts.pretty=true] - Pretty-print with 2-space indent
 * @returns {string}
 */
function toJSON(data, opts = {}) {
  const { headers, rows } = data;
  const pretty = opts.pretty !== false;

  const objects = rows.map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] != null ? row[i] : '';
    });
    return obj;
  });

  return pretty ? JSON.stringify(objects, null, 2) : JSON.stringify(objects);
}

/**
 * Convert parsed CSV data to a YAML-compatible string.
 * Note: This is a simple serializer (no external YAML lib needed).
 * Handles strings with special characters by quoting them.
 * @param {object} data - { headers, rows }
 * @returns {string}
 */
function toYAML(data) {
  const { headers, rows } = data;
  const lines = [];

  rows.forEach((row, ri) => {
    if (ri === 0) {
      lines.push(`- # Row 1`);
    } else {
      lines.push(`- # Row ${ri + 1}`);
    }
    headers.forEach((h, ci) => {
      const val = row[ci] != null ? row[ci] : '';
      const needsQuote = /[:{}\[\],&*?|>!%#`@\\]/.test(val) ||
        val.includes('\n') ||
        (val.match(/"/g) || []).length > 0;
      const escaped = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      lines.push(`  ${h}: ${needsQuote ? `"${escaped}"` : val}`);
    });
  });

  return lines.join('\n') + '\n';
}

/**
 * Export data to the given format.
 * @param {object} data - Parsed CSV data
 * @param {string} format - 'json' or 'yaml'
 * @param {object} [opts] - Format-specific options
 * @returns {string}
 */
function exportData(data, format, opts = {}) {
  switch ((format || '').toLowerCase()) {
    case 'json':
      return toJSON(data, opts);
    case 'yaml':
    case 'yml':
      return toYAML(data);
    default:
      throw new Error(`Unknown export format: ${format}. Supported: json, yaml`);
  }
}

module.exports = { exportData, toJSON, toYAML };
