# YouTube Feed Shuffler (extensão Chrome)

Extensão simples para **uso pessoal**: você define keywords e ela abre buscas do YouTube em sequência para variar sinais de interesse da conta.

> ⚠️ Observação: automação excessiva pode violar termos da plataforma. Use com moderação e por sua conta.

## O que faz

- Salva uma lista de keywords.
- Define quantos vídeos por keyword devem ser abertos.
- Define tempo entre aberturas (simulando sessão de exploração).
- Abre abas em background e fecha automaticamente a anterior.

## Instalação local

1. Baixe/clone este repositório.
2. Abra `chrome://extensions`.
3. Ative **Modo do desenvolvedor**.
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.

## Uso

1. Clique no ícone da extensão.
2. Preencha keywords (uma por linha).
3. Ajuste:
   - Vídeos por keyword
   - Tempo por vídeo (segundos)
4. Clique em **Iniciar sessão**.
5. Para interromper, clique em **Parar**.

## Limitações da versão atual

- Abre páginas de resultado com filtro de vídeos (não clica em um vídeo específico).
- Não executa interação dentro da página (play, like, subscribe etc.).

## Próximos passos (se quiser evoluir)

- Injetar script de conteúdo para abrir automaticamente o primeiro resultado.
- Adicionar lista de canais prioritários.
- Modo "somente inscritos" versus "descoberta".
