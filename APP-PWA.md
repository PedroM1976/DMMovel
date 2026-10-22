# Portal DM — versão instalável

Esta pasta é uma cópia independente do Portal DM original. As alterações da PWA estão na branch local `app-pwa` e não foram publicadas.

## O que foi acrescentado

- manifesto da aplicação (`manifest.webmanifest`);
- ícones para Windows, Android e iOS (`icons/`);
- registo do service worker e botão de instalação (`pwa.js`);
- cache da estrutura essencial (`sw.js`);
- página apresentada quando não existe ligação (`offline.html`).

## Como testar

A aplicação precisa de ser aberta através de `http://localhost` durante o desenvolvimento ou através de um endereço `https://` depois de publicada. A instalação não funciona abrindo diretamente o ficheiro `index.html`.

Depois de abrir a aplicação num navegador compatível, utilize o botão **Instalar Portal DM**. No Safari do iPhone/iPad, utilize **Partilhar > Adicionar ao ecrã principal**.

## Atualizações

Quando os ficheiros essenciais da aplicação forem alterados, atualize o valor `CACHE_VERSION` em `sw.js`. Isto faz os dispositivos instalados descarregarem a nova versão.

## Segurança antes da publicação

O login atual continua preservado para não interromper o funcionamento existente. As palavras-passe e as permissões definidas no `index.html` não são adequadas para uma aplicação publicada. Antes de colocar o Portal DM online, o login deve ser migrado para autenticação no backend e as tabelas do Supabase devem ter políticas RLS verificadas.

Para preparar essa migração são necessários os emails dos utilizadores, o perfil correspondente de cada pessoa e os ficheiros SQL atualmente usados no projeto.
