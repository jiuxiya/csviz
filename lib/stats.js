// lib/stats.js — 统计计算工具

'use strict';

const Stats = {
  min(arr) { return Math.min(...arr); },
  max(arr) { return Math.max(...arr); },
  mean(arr) { return arr.reduce((s, v) => s + v, 0) / arr.length; },
  median(arr) {
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  },
  sum(arr) { return arr.reduce((s, v) => s + v, 0); },
  variance(arr) {
    const m = Stats.mean(arr);
    return arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  },
  stddev(arr) { return Math.sqrt(Stats.variance(arr)); },

  /**
   * 计算"漂亮"的刻度值（适合图表轴）
   */
  niceScale(min, max, maxTicks = 8) {
    const range = max - min || Math.abs(max) || 1;
    const roughStep = range / maxTicks;
    const magnitude = Math.pow(10, Math.floor(Math.log10(roughStep)));
    const residual = roughStep / magnitude;

    let niceStep;
    if (residual <= 1.5) niceStep = magnitude;
    else if (residual <= 3) niceStep = 2 * magnitude;
    else if (residual <= 7) niceStep = 5 * magnitude;
    else niceStep = 10 * magnitude;

    const niceMin = Math.floor(min / niceStep) * niceStep;
    const niceMax = Math.ceil(max / niceStep) * niceStep;

    const ticks = [];
    for (let v = niceMin; v <= niceMax + niceStep * 0.5; v += niceStep) {
      ticks.push(parseFloat(v.toPrecision(12)));
    }
    return { min: niceMin, max: niceMax, step: niceStep, ticks };
  },

  /**
   * 格式化刻度标签（智能缩写）
   */
  formatTick(value) {
    if (value === 0) return '0';
    const abs = Math.abs(value);
    if (abs >= 1e9) return (value / 1e9).toFixed(1) + 'B';
    if (abs >= 1e6) return (value / 1e6).toFixed(1) + 'M';
    if (abs >= 1e4) return (value / 1e3).toFixed(1) + 'K';
    if (abs >= 100) return Math.round(value).toString();
    if (abs >= 1) return value.toFixed(1);
    return value.toFixed(2);
  },
};

module.exports = Stats;
