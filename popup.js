const defaults = {
  keywords: ["tecnologia", "música lo-fi", "documentário"],
  videosPerKeyword: 3,
  watchSeconds: 90,
  shuffle: true
};

const els = {
  keywords: document.getElementById('keywords'),
  videosPerKeyword: document.getElementById('videosPerKeyword'),
  watchSeconds: document.getElementById('watchSeconds'),
  shuffle: document.getElementById('shuffle'),
  saveBtn: document.getElementById('saveBtn'),
  startBtn: document.getElementById('startBtn'),
  stopBtn: document.getElementById('stopBtn'),
  status: document.getElementById('status')
};

init().catch((error) => setStatus(`Erro ao carregar: ${String(error)}`));

async function init() {
  const stored = await chrome.storage.sync.get(defaults);
  els.keywords.value = stored.keywords.join('\n');
  els.videosPerKeyword.value = String(stored.videosPerKeyword);
  els.watchSeconds.value = String(stored.watchSeconds);
  els.shuffle.checked = stored.shuffle;
  setStatus('Configuração carregada.');
}

els.saveBtn.addEventListener('click', async () => {
  const config = readConfig();
  await chrome.storage.sync.set(config);
  setStatus('Configuração salva.');
});

els.startBtn.addEventListener('click', async () => {
  const config = readConfig();
  await chrome.storage.sync.set(config);

  const response = await chrome.runtime.sendMessage({
    type: 'START_SESSION',
    payload: config
  });

  if (!response?.ok) {
    setStatus(`Falha ao iniciar: ${response?.error ?? 'erro desconhecido'}`);
    return;
  }

  setStatus(`Sessão iniciada com ${response.totalTargets} vídeos.`);
});

els.stopBtn.addEventListener('click', async () => {
  await chrome.runtime.sendMessage({ type: 'STOP_SESSION' });
  setStatus('Sessão encerrada.');
});

function readConfig() {
  const keywords = els.keywords.value
    .split('\n')
    .map((k) => k.trim())
    .filter(Boolean)
    .slice(0, 25);

  return {
    keywords: keywords.length > 0 ? keywords : defaults.keywords,
    videosPerKeyword: clampNumber(els.videosPerKeyword.value, 1, 20, defaults.videosPerKeyword),
    watchSeconds: clampNumber(els.watchSeconds.value, 20, 1200, defaults.watchSeconds),
    shuffle: els.shuffle.checked
  };
}

function clampNumber(value, min, max, fallback) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, parsed));
}

function setStatus(message) {
  els.status.textContent = message;
}
