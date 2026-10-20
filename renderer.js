const STORAGE_KEYS = {
  favorites: 'kamus-js-favorites',
  history: 'kamus-js-history',
  progress: 'kamus-js-progress'
};

const state = {
  entries: [],
  filteredEntries: [],
  selectedTerm: null,
  query: '',
  category: 'all',
  view: 'all',
  favorites: new Set(),
  history: [],
  progress: {
    completedQuizzes: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    bestScore: 0
  }
};

const quizState = {
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  recorded: false
};

const searchInput = document.querySelector('#search-input');
const categoryFilter = document.querySelector('#category-filter');
const wordList = document.querySelector('#word-list');
const detailPanel = document.querySelector('#detail-panel');
const resultCount = document.querySelector('#result-count');
const listHeading = document.querySelector('#list-heading');
const favoriteCount = document.querySelector('#favorite-count');
const historyContainer = document.querySelector('#recent-searches');
const historyList = document.querySelector('#history-list');
const progressPercent = document.querySelector('#progress-percent');
const progressBarFill = document.querySelector('#progress-bar-fill');
const progressSummary = document.querySelector('#progress-summary');
const quizModal = document.querySelector('#quiz-modal');
const quizContent = document.querySelector('#quiz-content');
const playgroundModal = document.querySelector('#playground-modal');
const codeEditor = document.querySelector('#code-editor');
const consoleOutput = document.querySelector('#console-output');
const playgroundStatus = document.querySelector('#playground-status');
let playgroundWorker = null;
let playgroundTimer = null;

const categoryLabels = {
  keyword: 'keyword dasar',
  function: 'function',
  'control-flow': 'control flow',
  'array-method': 'array method',
  async: 'asynchronous',
  object: 'object & array',
  operator: 'operator'
};

function normalize(value) {
  return String(value).toLocaleLowerCase('id-ID').trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Tidak dapat membaca ${key}:`, error);
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Tidak dapat menyimpan ${key}:`, error);
  }
}

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function searchableValues(entry) {
  return [
    entry.term,
    entry.category,
    entry.shortDescription,
    entry.syntax,
    entry.explanation,
    ...entry.related,
    ...entry.keywords
  ];
}

function filterEntries() {
  const query = normalize(state.query);
  state.filteredEntries = state.entries
    .filter((entry) => state.view !== 'favorites' || state.favorites.has(entry.term))
    .filter((entry) => state.category === 'all' || entry.category === state.category)
    .filter((entry) => {
      if (!query) return true;
      return searchableValues(entry).some((value) => normalize(value).includes(query));
    });

  if (!state.filteredEntries.some((entry) => entry.term === state.selectedTerm)) {
    state.selectedTerm = state.filteredEntries[0]?.term ?? null;
  }

  renderList();
  renderDetail();
}

function renderList() {
  resultCount.textContent = state.filteredEntries.length;
  listHeading.textContent = state.view === 'favorites' ? 'Entri favorit' : 'Semua entri';

  if (state.filteredEntries.length === 0) {
    const message = state.view === 'favorites'
      ? 'Belum ada istilah favorit.<br />Simpan istilah dari panel detail.'
      : 'Istilah tidak ditemukan.<br />Coba keyword atau sintaks lain.';
    wordList.innerHTML = `<div class="list-empty">${message}</div>`;
    return;
  }

  wordList.innerHTML = state.filteredEntries.map((entry) => `
    <button class="word-item ${entry.term === state.selectedTerm ? 'active' : ''}" type="button" data-term="${escapeHtml(entry.term)}">
      <div class="word-line"><span class="word">${escapeHtml(entry.term)}</span><span class="part-tag">${state.favorites.has(entry.term) ? '★ ' : ''}${escapeHtml(categoryLabels[entry.category])}</span></div>
      <div class="translation">${escapeHtml(entry.shortDescription)}</div>
    </button>
  `).join('');

  wordList.querySelectorAll('[data-term]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedTerm = button.dataset.term;
      renderList();
      renderDetail();
    });
  });
}

function renderDetail() {
  const entry = state.entries.find((item) => item.term === state.selectedTerm);

  if (!entry) {
    detailPanel.innerHTML = `
      <div class="empty-detail">
        <div class="empty-icon" aria-hidden="true">JS</div>
        <h3>${state.view === 'favorites' ? 'Belum ada istilah favorit' : 'Tidak ada istilah yang cocok'}</h3>
        <p>${state.view === 'favorites' ? 'Pilih istilah lalu tekan Simpan favorit.' : 'Periksa kembali ejaan atau coba keyword lain.'}</p>
      </div>`;
    return;
  }

  const isFavorite = state.favorites.has(entry.term);
  detailPanel.innerHTML = `
    <div class="detail-top">
      <div>
        <h2 class="detail-word">${escapeHtml(entry.term)}</h2>
        <p class="detail-translation">${escapeHtml(entry.shortDescription)}</p>
        <div class="pronunciation">JavaScript reference</div>
      </div>
      <div class="detail-actions">
        <span class="part-pill">${escapeHtml(categoryLabels[entry.category])}</span>
        <button class="favorite-button ${isFavorite ? 'is-favorite' : ''}" type="button" data-favorite aria-pressed="${isFavorite}">
          ${isFavorite ? '★ Tersimpan' : '☆ Simpan favorit'}
        </button>
        <button class="playground-detail-button" type="button" data-playground>▶ Coba di Playground</button>
      </div>
    </div>
    <div class="detail-divider"></div>
    <p class="label">Cara penulisan yang benar</p>
    <pre class="syntax-box"><code>${escapeHtml(entry.syntax)}</code></pre>
    <ul class="tip-list">${entry.writingTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join('')}</ul>
    <p class="label detail-label">Penjelasan sintaks</p>
    <p class="definition">${escapeHtml(entry.explanation)}</p>
    <div class="example-box usage-box">
      <p class="label">Contoh penggunaan</p>
      <pre class="code-box"><code>${escapeHtml(entry.example)}</code></pre>
      <p class="example-translation">${escapeHtml(entry.exampleExplanation)}</p>
    </div>
    <div class="mistake-box">
      <p class="label">Kesalahan umum</p>
      <p>${escapeHtml(entry.commonMistake)}</p>
    </div>
    <p class="label detail-label">Istilah terkait</p>
    <div class="synonyms">${entry.related.map((term) => `<span class="synonym">${escapeHtml(term)}</span>`).join('')}</div>
  `;

  detailPanel.querySelector('[data-favorite]').addEventListener('click', () => {
    toggleFavorite(entry.term);
  });
  detailPanel.querySelector('[data-playground]').addEventListener('click', () => {
    openPlayground(entry.example);
  });
}

function renderFavoriteCount() {
  favoriteCount.textContent = state.favorites.size;
}

function toggleFavorite(term) {
  if (state.favorites.has(term)) {
    state.favorites.delete(term);
  } else {
    state.favorites.add(term);
  }
  writeStorage(STORAGE_KEYS.favorites, [...state.favorites]);
  renderFavoriteCount();
  filterEntries();
}

function renderHistory() {
  historyContainer.hidden = state.history.length === 0;
  historyList.innerHTML = state.history.map((item) => `
    <button type="button" class="history-chip" data-history="${escapeHtml(item)}">${escapeHtml(item)}</button>
  `).join('');

  historyList.querySelectorAll('[data-history]').forEach((button) => {
    button.addEventListener('click', () => {
      searchInput.value = button.dataset.history;
      state.query = button.dataset.history;
      filterEntries();
      searchInput.focus();
    });
  });
}

function addSearchHistory(value) {
  const query = value.trim();
  if (query.length < 2) return;
  state.history = [query, ...state.history.filter((item) => normalize(item) !== normalize(query))].slice(0, 5);
  writeStorage(STORAGE_KEYS.history, state.history);
  renderHistory();
}

function setView(view) {
  state.view = view;
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  filterEntries();
}

function renderProgress() {
  const { completedQuizzes, correctAnswers, totalAnswers, bestScore } = state.progress;
  const accuracy = totalAnswers ? Math.round((correctAnswers / totalAnswers) * 100) : 0;
  progressPercent.textContent = `${accuracy}%`;
  progressBarFill.style.width = `${accuracy}%`;
  progressSummary.textContent = totalAnswers
    ? `${completedQuizzes} kuis • terbaik ${bestScore}/${Math.min(5, state.entries.length)} • akurasi ${accuracy}%`
    : 'Belum ada sesi kuis.';
}

function createQuizQuestions() {
  return shuffle(state.entries).slice(0, Math.min(5, state.entries.length)).map((entry) => ({
    entry,
    options: shuffle([
      entry.term,
      ...shuffle(state.entries.filter((item) => item.term !== entry.term)).slice(0, 3).map((item) => item.term)
    ])
  }));
}

function startQuiz() {
  if (state.entries.length < 2) return;
  quizState.questions = createQuizQuestions();
  quizState.index = 0;
  quizState.score = 0;
  quizState.answered = false;
  quizState.recorded = false;
  quizModal.hidden = false;
  quizModal.setAttribute('aria-hidden', 'false');
  renderQuiz();
}

function closeQuiz() {
  quizModal.hidden = true;
  quizModal.setAttribute('aria-hidden', 'true');
}

function renderQuiz() {
  if (quizState.index >= quizState.questions.length) {
    if (!quizState.recorded) {
      state.progress.completedQuizzes += 1;
      state.progress.correctAnswers += quizState.score;
      state.progress.totalAnswers += quizState.questions.length;
      state.progress.bestScore = Math.max(state.progress.bestScore, quizState.score);
      writeStorage(STORAGE_KEYS.progress, state.progress);
      quizState.recorded = true;
      renderProgress();
    }

    quizContent.innerHTML = `
      <div class="quiz-result">
        <div class="quiz-result-icon">${quizState.score === quizState.questions.length ? '✓' : 'JS'}</div>
        <p class="eyebrow">Kuis selesai</p>
        <h3>${quizState.score} dari ${quizState.questions.length} jawaban benar</h3>
        <p>${quizState.score >= 4 ? 'Bagus! Terus pertahankan pemahamanmu.' : 'Coba lagi untuk memperkuat ingatanmu.'}</p>
        <button id="restart-quiz" class="primary-button" type="button">Ulangi kuis</button>
      </div>`;
    quizContent.querySelector('#restart-quiz').addEventListener('click', startQuiz);
    return;
  }

  const question = quizState.questions[quizState.index];
  quizContent.innerHTML = `
    <div class="quiz-meta"><span>Soal ${quizState.index + 1} dari ${quizState.questions.length}</span><strong>Skor ${quizState.score}</strong></div>
    <div class="quiz-progress"><span style="width: ${((quizState.index + 1) / quizState.questions.length) * 100}%"></span></div>
    <p class="quiz-question">Keyword atau sintaks apa yang sesuai dengan penjelasan ini?</p>
    <div class="quiz-prompt">${escapeHtml(question.entry.shortDescription)}</div>
    <div class="quiz-options">${question.options.map((option) => `<button class="quiz-option" type="button" data-answer="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}</div>
    <div id="quiz-feedback" class="quiz-feedback" aria-live="polite"></div>
    <button id="next-question" class="primary-button next-button" type="button" disabled>${quizState.index === quizState.questions.length - 1 ? 'Lihat hasil' : 'Soal berikutnya'}</button>
  `;

  const optionButtons = quizContent.querySelectorAll('[data-answer]');
  optionButtons.forEach((button) => {
    button.addEventListener('click', () => answerQuiz(button.dataset.answer, optionButtons));
  });
  quizContent.querySelector('#next-question').addEventListener('click', () => {
    quizState.index += 1;
    quizState.answered = false;
    renderQuiz();
  });
}

function answerQuiz(answer, optionButtons) {
  if (quizState.answered) return;
  quizState.answered = true;
  const question = quizState.questions[quizState.index];
  const isCorrect = answer === question.entry.term;
  if (isCorrect) quizState.score += 1;

  optionButtons.forEach((button) => {
    button.disabled = true;
    if (button.dataset.answer === question.entry.term) button.classList.add('correct');
    if (button.dataset.answer === answer && !isCorrect) button.classList.add('incorrect');
  });

  const feedback = quizContent.querySelector('#quiz-feedback');
  feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedback.textContent = isCorrect
    ? 'Benar! Kamu mengenali istilah ini.'
    : `Belum tepat. Jawaban yang benar adalah ${question.entry.term}.`;
  quizContent.querySelector('#next-question').disabled = false;
}

function appendConsole(value, level = 'log') {
  if (consoleOutput.dataset.started !== 'true') {
    consoleOutput.textContent = '';
    consoleOutput.dataset.started = 'true';
  }
  const line = document.createElement('div');
  line.className = `console-line ${level}`;
  line.textContent = value;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function stopPlaygroundWorker() {
  if (playgroundTimer) clearTimeout(playgroundTimer);
  playgroundTimer = null;
  if (playgroundWorker) playgroundWorker.terminate();
  playgroundWorker = null;
}

function openPlayground(code = "const pesan = 'Halo, JavaScript!';\nconsole.log(pesan);") {
  codeEditor.value = code;
  consoleOutput.textContent = 'Output akan muncul di sini...';
  consoleOutput.dataset.started = 'false';
  playgroundStatus.textContent = 'Siap menjalankan kode';
  playgroundModal.hidden = false;
  playgroundModal.setAttribute('aria-hidden', 'false');
  codeEditor.focus();
}

function closePlayground() {
  stopPlaygroundWorker();
  playgroundModal.hidden = true;
  playgroundModal.setAttribute('aria-hidden', 'true');
  playgroundStatus.textContent = 'Siap menjalankan kode';
}

function runCode() {
  const code = codeEditor.value.trim();
  stopPlaygroundWorker();

  if (!code) {
    consoleOutput.textContent = 'Tulis kode JavaScript terlebih dahulu.';
    consoleOutput.dataset.started = 'true';
    playgroundStatus.textContent = 'Tidak ada kode';
    return;
  }

  consoleOutput.textContent = '';
  consoleOutput.dataset.started = 'true';
  playgroundStatus.textContent = 'Menjalankan...';
  playgroundWorker = new Worker('playground-worker.js');
  playgroundWorker.onmessage = ({ data }) => {
    if (data.type === 'log') appendConsole(data.value, data.level);
    if (data.type === 'error') {
      appendConsole(`✕ ${data.value}`, 'error');
      stopPlaygroundWorker();
      playgroundStatus.textContent = 'Terjadi error';
    }
    if (data.type === 'done') {
      stopPlaygroundWorker();
      playgroundStatus.textContent = 'Selesai';
    }
  };
  playgroundWorker.onerror = (error) => {
    appendConsole(`✕ ${error.message || 'Kode tidak dapat dijalankan.'}`, 'error');
    stopPlaygroundWorker();
    playgroundStatus.textContent = 'Terjadi error';
  };
  playgroundWorker.postMessage({ code });
  playgroundTimer = setTimeout(() => {
    appendConsole('✕ Eksekusi dihentikan karena melebihi batas 2 detik.', 'error');
    stopPlaygroundWorker();
    playgroundStatus.textContent = 'Dihentikan karena timeout';
  }, 2000);
}

function clearConsole() {
  consoleOutput.textContent = 'Output akan muncul di sini...';
  consoleOutput.dataset.started = 'false';
  playgroundStatus.textContent = 'Output dibersihkan';
}

searchInput.addEventListener('input', (event) => {
  state.query = event.target.value;
  filterEntries();
});

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') addSearchHistory(state.query);
});

categoryFilter.addEventListener('change', (event) => {
  state.category = event.target.value;
  filterEntries();
});

document.querySelectorAll('[data-view]').forEach((button) => {
  button.addEventListener('click', () => setView(button.dataset.view));
});

document.querySelectorAll('[data-search]').forEach((button) => {
  button.addEventListener('click', () => {
    searchInput.value = button.dataset.search;
    state.query = button.dataset.search;
    addSearchHistory(state.query);
    filterEntries();
    searchInput.focus();
  });
});

document.querySelector('#quiz-button').addEventListener('click', startQuiz);
document.querySelector('#close-quiz').addEventListener('click', closeQuiz);
document.querySelectorAll('[data-close-quiz]').forEach((element) => element.addEventListener('click', closeQuiz));
document.querySelector('#playground-button').addEventListener('click', () => openPlayground());
document.querySelector('#close-playground').addEventListener('click', closePlayground);
document.querySelectorAll('[data-close-playground]').forEach((element) => element.addEventListener('click', closePlayground));
document.querySelector('#run-code').addEventListener('click', runCode);
document.querySelector('#clear-output').addEventListener('click', clearConsole);

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    searchInput.focus();
    searchInput.select();
  }
  if (event.key === 'Escape' && !quizModal.hidden) closeQuiz();
  if (event.key === 'Escape' && !playgroundModal.hidden) closePlayground();
});

async function initialize() {
  try {
    state.entries = await window.dictionaryAPI.getEntries();
  state.favorites = new Set(readStorage(STORAGE_KEYS.favorites, []));
  state.history = readStorage(STORAGE_KEYS.history, []);
  state.progress = { ...state.progress, ...readStorage(STORAGE_KEYS.progress, {}) };
  renderFavoriteCount();
  renderHistory();
  renderProgress();
  filterEntries();
} catch (error) {
  console.error('Gagal memuat data referensi:', error);
  wordList.innerHTML = '<div class="list-empty">Data referensi gagal dimuat.</div>';
  }
}

initialize();
