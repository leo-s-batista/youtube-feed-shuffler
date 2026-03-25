# YouTube Feed Shuffler (Extensão)

Extensão simples (Manifest V3) para ajudar a diversificar recomendações do YouTube com buscas por **keywords pré-definidas**.

## O que ela faz

- Salva uma lista de palavras-chave.
- Em um clique, abre pesquisas no YouTube para cada termo.
- Opcionalmente abre em massa os primeiros resultados de vídeo dessas pesquisas (com limite e intervalo para evitar excesso).

> Aviso: use com moderação e respeite os Termos de Uso do YouTube.

## Instalação (modo desenvolvedor)

1. Clone/baixe este repositório.
2. Abra `chrome://extensions` (ou `edge://extensions`).
3. Ative **Developer mode**.
4. Clique em **Load unpacked** e selecione a pasta do projeto.

## Uso rápido

1. Clique no ícone da extensão.
2. Defina keywords (uma por linha), por exemplo:
   - machine learning
   - economia comportamental
   - fotografia de rua
3. Ajuste:
   - número de vídeos por keyword;
   - atraso entre aberturas (ms).
4. Clique:
   - **Abrir pesquisas** para só abrir as buscas;
   - **Abrir vídeos** para abrir os primeiros vídeos dos resultados.

## Limitações

- O parsing da página de busca depende da estrutura do YouTube e pode quebrar se houver mudanças.
- Não simula interação humana; apenas abre páginas.

## Estrutura

- `manifest.json`
- `popup.html`
- `popup.js`
- `background.js`
- `styles.css`
