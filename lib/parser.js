// lib/parser.js — Zero-dependency CSV parser with auto-detection
// 支持自动分隔符检测、引号字段、数字列检测

'use strict';

class CSVParser {
  /**
   * 解析 CSV 字符串为二维数组
   * @param {string} input - CSV 文本内容
   * @param {object} opts - 选项
   * @param {string} [opts.delimiter='auto'] - 分隔符 ('auto'|','|';'|'\t'|'|')
   * @param {boolean} [opts.skipEmpty=true] - 跳过空行
   * @returns {{ headers: string[], rows: string[][], numericColumns: {name:string,index:number}[] }}
   */
  static parse(input, opts = {}) {
    const { delimiter: delimParam = 'auto', skipEmpty = true } = opts;

    // 自动检测分隔符
    let delim = delimParam;
    if (delim === 'auto') {
      const firstLine = input.split('\n')[0] || '';
      const candidates = [',', ';', '\t', '|'];
      delim = candidates.reduce((best, d) =>
        (firstLine.split(d).length > firstLine.split(best).length ? d : best)
      , ',');
    }

    // 逐字符解析，正确处理引号字段
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];
      const next = input[i + 1];

      if (inQuotes) {
        if (ch === '"' && next === '"') {
          field += '"';
          i++; // 跳过转义引号
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          field += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === delim) {
          row.push(field.trim());
          field = '';
        } else if (ch === '\n' || (ch === '\r' && next === '\n')) {
          if (ch === '\r') i++;
          row.push(field.trim());
          if (skipEmpty && row.every(c => c === '')) {
            row = [];
            field = '';
            continue;
          }
          if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
            rows.push(row);
          }
          row = [];
          field = '';
        } else {
          field += ch;
        }
      }
    }

    // 处理最后一行
    if (field !== '' || row.length > 0) {
      row.push(field.trim());
      if (!skipEmpty || row.some(c => c !== '')) {
        rows.push(row);
      }
    }

    if (rows.length === 0) return { headers: [], rows: [], numericColumns: [] };

    const headers = rows[0];
    const dataRows = rows.slice(1);

    // 检测数字列
    const numericColumns = [];
    for (let col = 0; col < headers.length; col++) {
      const values = dataRows.map(r => r[col]).filter(v => v != null && v !== '');
      if (values.length === 0) continue;
      const numCount = values.filter(v => CSVParser.isNumeric(v)).length;
      if (numCount / values.length >= 0.7) {
        numericColumns.push({ name: headers[col], index: col });
      }
    }

    return { headers, rows: dataRows, numericColumns };
  }

  /**
   * 判断字符串是否为数字（支持千分位、百分比等）
   */
  static isNumeric(str) {
    if (typeof str !== 'string') return false;
    // 移除常见格式字符
    const cleaned = str.replace(/[$€£¥%,\s]/g, '').replace(/\((.+)\)/, '-$1');
    return cleaned !== '' && !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
  }

  /**
   * 将字符串解析为数字
   */
  static toNumber(str) {
    if (typeof str !== 'string') return NaN;
    const cleaned = str.replace(/[$€£¥%,\s]/g, '').replace(/\((.+)\)/, '-$1');
    return parseFloat(cleaned);
  }

  /**
   * 格式化数字显示
   */
  static formatNumber(num) {
    if (Math.abs(num) >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (Math.abs(num) >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (Math.abs(num) >= 1e4) return (num / 1e3).toFixed(1) + 'K';
    if (Number.isInteger(num)) return num.toLocaleString();
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
}

module.exports = CSVParser;
