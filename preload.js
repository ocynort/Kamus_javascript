const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('dictionaryAPI', {
  getEntries: () => ipcRenderer.invoke('get-dictionary')
});
