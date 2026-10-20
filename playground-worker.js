function formatValue(value) {
  if (typeof value === 'undefined') return 'undefined';
  if (typeof value === 'string') return value;
  if (typeof value === 'function') return value.toString();

  try {
    const serialized = JSON.stringify(value);
    return typeof serialized === 'undefined' ? String(value) : serialized;
  } catch (error) {
    return '[object tidak dapat ditampilkan]';
  }
}

function sendLog(level, values) {
  self.postMessage({
    type: 'log',
    level,
    value: values.map(formatValue).join(' ')
  });
}

self.onmessage = ({ data }) => {
  const code = String(data?.code ?? '');

  self.console = {
    log: (...values) => sendLog('log', values),
    info: (...values) => sendLog('info', values),
    warn: (...values) => sendLog('warn', values),
    error: (...values) => sendLog('error', values)
  };

  try {
    const result = eval(`(async () => {\n${code}\n})()`);
    Promise.resolve(result)
      .then((value) => {
        if (typeof value !== 'undefined') sendLog('result', [value]);
        self.postMessage({ type: 'done' });
      })
      .catch((error) => {
        self.postMessage({ type: 'error', value: `${error.name}: ${error.message}` });
      });
  } catch (error) {
    self.postMessage({ type: 'error', value: `${error.name}: ${error.message}` });
  }
};
