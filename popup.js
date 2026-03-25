const keywordsEl = document.getElementById('keywords');
const videosPerKeywordEl = document.getElementById('videosPerKeyword');
const delayMsEl = document.getElementById('delayMs');
const statusEl = document.getElementById('status');
const openSearchesBtn = document.getElementById('openSearches');
const openVideosBtn = document.getElementById('openVideos');

const defaults = {
  keywords: ['machine learning', 'história', 'fotografia'],
  videosPerKeyword: 2,
  delayMs: 1200
};

function parseKeywords(raw) {
  return raw
    .split('\n')
    .map((k) => k.trim())
    .filter(Boolean);
}

function showStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? '#ff8a8a' : '';
}

async function saveSettings(settings) {
  await chrome.storage.local.set({ settings });
}

async function loadSettings() {
  const data = await chrome.storage.local.get('settings');
  return data.settings ?? defaults;
}

function collectSettings() {
  return {
    keywords: parseKeywords(keywordsEl.value),
    videosPerKeyword: Number(videosPerKeywordEl.value) || defaults.videosPerKeyword,
    delayMs: Number(delayMsEl.value) || defaults.delayMs
  };
}

async function init() {
  const settings = await loadSettings();
  keywordsEl.value = settings.keywords.join('\n');
  videosPerKeywordEl.value = settings.videosPerKeyword;
  delayMsEl.value = settings.delayMs;
}

async function sendAction(action) {
  const settings = collectSettings();

  if (!settings.keywords.length) {
    showStatus('Adicione pelo menos uma keyword.', true);
    return;
  }

  await saveSettings(settings);
  showStatus('Processando...');

  try {
    const response = await chrome.runtime.sendMessage({ action, payload: settings });
    showStatus(response?.message ?? 'Concluído.');
  } catch (error) {
    showStatus(`Erro: ${error.message}`, true);
  }
}

openSearchesBtn.addEventListener('click', () => sendAction('OPEN_SEARCHES'));
openVideosBtn.addEventListener('click', () => sendAction('OPEN_VIDEOS'));

init();
