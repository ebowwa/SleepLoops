#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Recursively traverse objects/arrays, invoking callback for each string leaf
function traverse(obj, callback) {
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      if (typeof item === 'string') callback(obj, idx, item);
      else traverse(item, callback);
    });
  } else if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      const val = obj[key];
      if (typeof val === 'string') callback(obj, key, val);
      else traverse(val, callback);
    });
  }
}

// Path to the locale file
const filePath = path.resolve(__dirname, '../src/locales/en.json');
const content = fs.readFileSync(filePath, 'utf8');
const json = JSON.parse(content);
let idx = 0;
traverse(json, (parent, key, value) => {
  idx++;
  parent[key] = { index: idx, value };
});
fs.writeFileSync(filePath, JSON.stringify(json, null, 2) + '\n', 'utf8');
console.log(`Indexed ${idx} translation entries in en.json`);
