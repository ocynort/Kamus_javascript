const { contextBridge } = require('electron');
const fs = require('node:fs');
const path = require('node:path');

contextBridge.exposeInMainWorld('dictionaryAPI', {
  getEntries() {
    const filePath = path.join(__dirname, 'data', 'dictionary.json');
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
});
