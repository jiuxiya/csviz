// lib/watch.js — File watcher for --watch mode (zero dependencies, uses fs.watch)
'use strict';

const fs = require('fs');
const path = require('path');

/**
 * Watch a CSV file for changes and invoke callback with updated data.
 * Debounces rapid successive changes (e.g. editor save writes).
 *
 * @param {string} filePath - Path to the CSV file
 * @param {Function} onChange - Called with (filePath) on each detected change
 * @param {object} [opts]
 * @param {number} [opts.debounceMs=300] - Debounce interval in ms
 * @returns {Function} stop() to close the watcher
 */
function watchFile(filePath, onChange, opts = {}) {
  const debounceMs = opts.debounceMs || 300;
  let timer = null;
  let lastSize = -1;

  // Initial fire
  try {
    const stat = fs.statSync(filePath);
    lastSize = stat.size;
  } catch (_) { /* file might not exist yet */ }

  const watcher = fs.watch(filePath, { persistent: true }, (event) => {
    if (event !== 'change' && event !== 'rename') return;

    // Debounce
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        const stat = fs.statSync(filePath);
        if (stat.size !== lastSize || event === 'rename') {
          lastSize = stat.size;
          onChange(filePath);
        }
      } catch (err) {
        // File might be temporarily gone during save; retry once
        setTimeout(() => {
          try {
            const stat = fs.statSync(filePath);
            lastSize = stat.size;
            onChange(filePath);
          } catch (_) { /* ignore */ }
        }, 200);
      }
      timer = null;
    }, debounceMs);
  });

  watcher.on('error', (err) => {
    process.stderr.write(`\n  ⚠ Watch error: ${err.message}\n`);
  });

  return function stop() {
    if (timer) clearTimeout(timer);
    watcher.close();
  };
}

module.exports = { watchFile };
