const SEARCH_URL = 'https://www.youtube.com/results?search_query=';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sanitizeYouTubeLink(href) {
  if (!href || !href.startsWith('/watch?v=')) {
    return null;
  }

  const url = new URL(`https://www.youtube.com${href}`);
  url.search = `?v=${url.searchParams.get('v')}`;
  return url.toString();
}

async function fetchVideoLinksByKeyword(keyword, maxVideos) {
  const query = encodeURIComponent(keyword);
  const url = `${SEARCH_URL}${query}`;

  const response = await fetch(url, {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar resultados para "${keyword}"`);
  }

  const html = await response.text();
  const matches = [...html.matchAll(/"url":"(\/watch\?v=[^"\\]+)"/g)];
  const unique = new Set();

  for (const match of matches) {
    const rawHref = match[1].replace(/\\u0026/g, '&');
    const clean = sanitizeYouTubeLink(rawHref);
    if (clean) {
      unique.add(clean);
    }
    if (unique.size >= maxVideos) {
      break;
    }
  }

  return [...unique];
}

async function openSearchTabs(keywords, delayMs) {
  for (const keyword of keywords) {
    const url = `${SEARCH_URL}${encodeURIComponent(keyword)}`;
    await chrome.tabs.create({ url, active: false });
    await sleep(delayMs);
  }
}

async function openVideoTabs({ keywords, videosPerKeyword, delayMs }) {
  for (const keyword of keywords) {
    const links = await fetchVideoLinksByKeyword(keyword, videosPerKeyword);

    for (const url of links) {
      await chrome.tabs.create({ url, active: false });
      await sleep(delayMs);
    }
  }
}

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  const { action, payload } = request;

  (async () => {
    if (action === 'OPEN_SEARCHES') {
      await openSearchTabs(payload.keywords, payload.delayMs);
      sendResponse({ message: `Pesquisas abertas: ${payload.keywords.length}` });
      return;
    }

    if (action === 'OPEN_VIDEOS') {
      await openVideoTabs(payload);
      sendResponse({ message: 'Vídeos abertos com sucesso.' });
      return;
    }

    sendResponse({ message: 'Ação desconhecida.' });
  })().catch((error) => {
    sendResponse({ message: `Erro: ${error.message}` });
  });

  return true;
});
