const SESSION_ALARM = 'watch-next-video';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ queue: [], running: false, activeTabId: null });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'START_SESSION') {
    startSession(message.payload)
      .then((totalTargets) => sendResponse({ ok: true, totalTargets }))
      .catch((error) => sendResponse({ ok: false, error: String(error) }));
    return true;
  }

  if (message?.type === 'STOP_SESSION') {
    stopSession();
    sendResponse({ ok: true });
  }

  return false;
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== SESSION_ALARM) {
    return;
  }

  const state = await chrome.storage.local.get(['queue', 'running', 'activeTabId']);
  if (!state.running) {
    return;
  }

  if (typeof state.activeTabId === 'number') {
    await chrome.tabs.remove(state.activeTabId).catch(() => {});
  }

  await openNextVideo();
});

async function startSession(config) {
  const targets = buildTargets(config);

  await stopSession();
  await chrome.storage.local.set({ queue: targets, running: true, activeTabId: null });

  await openNextVideo();
  return targets.length;
}

async function stopSession() {
  chrome.alarms.clear(SESSION_ALARM);

  const state = await chrome.storage.local.get(['activeTabId']);
  if (typeof state.activeTabId === 'number') {
    await chrome.tabs.remove(state.activeTabId).catch(() => {});
  }

  await chrome.storage.local.set({ queue: [], running: false, activeTabId: null });
}

async function openNextVideo() {
  const state = await chrome.storage.local.get(['queue', 'running']);

  if (!state.running || !Array.isArray(state.queue) || state.queue.length === 0) {
    await chrome.storage.local.set({ running: false, activeTabId: null, queue: [] });
    return;
  }

  const [next, ...remaining] = state.queue;

  const query = encodeURIComponent(next.keyword);
  const url = `https://www.youtube.com/results?search_query=${query}&sp=EgIQAQ%253D%253D`;

  const tab = await chrome.tabs.create({ url, active: false });

  await chrome.storage.local.set({
    queue: remaining,
    activeTabId: tab.id ?? null
  });

  chrome.alarms.create(SESSION_ALARM, {
    delayInMinutes: Math.max(0.5, next.watchSeconds / 60)
  });
}

function buildTargets(config) {
  const keywords = [...new Set((config.keywords ?? []).filter(Boolean))];
  if (config.shuffle) {
    shuffleInPlace(keywords);
  }

  const videosPerKeyword = clamp(config.videosPerKeyword, 1, 20);
  const watchSeconds = clamp(config.watchSeconds, 20, 1200);

  const targets = [];
  for (const keyword of keywords) {
    for (let i = 0; i < videosPerKeyword; i += 1) {
      targets.push({ keyword, watchSeconds });
    }
  }

  return targets;
}

function clamp(value, min, max) {
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n)) {
    return min;
  }
  return Math.min(max, Math.max(min, n));
}

function shuffleInPlace(list) {
  for (let i = list.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
}
