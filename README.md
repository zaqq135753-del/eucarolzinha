# Carolzinha Privé

Site com entrada pública, login compartilhado e biblioteca privada de membros.

## Estrutura

- `/`: apresentação com vídeo em slow motion e duas prévias curtas.
- `/entrar`: login dos membros com usuário e senha.
- `/privado`: biblioteca e destaque.
- `/privado/colecoes`: coleções, fotos e vídeos.
- `/privado/favoritos`: favoritos da sessão atual.
- `/privado/ligacao`: chamadas de 15 minutos (R$ 29,90) e 30 minutos (R$ 49,90).
- `/privado/conta`: atendimento e saída.
- `/admin`: administração exclusiva da proprietária via Sign in with ChatGPT.

O pagamento inicial é realizado pelo WhatsApp. A proprietária entrega ao cliente o endereço `/entrar` e as credenciais compartilhadas. Não existe liberação automática por pagamento nesta versão.

## Configuração

Os links de checkout das chamadas devem ser preenchidos em `public/config.js`, no campo `checkout` de cada oferta. Enquanto estiverem vazios, os botões permanecem desativados.

A senha compartilhada pode ser alterada em `/admin`. A troca encerra as sessões de membros existentes. A administração continua usando a autenticação da proprietária, nunca a senha compartilhada.

O acesso compartilhado não permite revogar apenas um cliente. Favoritos e progresso são separados por sessão de navegador e são reiniciados após uma nova entrada. Sessões duram até 30 dias e podem ser encerradas antes pela troca de senha.

## Ambiente

Use Node.js 22 ou posterior e um runtime compatível com Cloudflare Workers/R2.

Variáveis de produção gerenciadas separadamente do código:

- `ADMIN_EMAIL`: e-mail da proprietária autenticada pela plataforma.
- `MEMBER_USERNAME`: usuário inicial dos membros.
- `MEMBER_PASSWORD_HASH`: PBKDF2 SHA-256, 100.000 iterações, 256 bits, hexadecimal.
- `MEMBER_PASSWORD_SALT`: salt utilizado na derivação.
- `BUCKET`: binding R2 para sessões, coleções, uploads, favoritos e progresso.

A senha em texto puro não é incluída no projeto. Credenciais salvas pela administração no R2 prevalecem sobre os valores iniciais do ambiente. Não exponha o conteúdo de `private-media/` ou `dist/server/` como arquivos públicos.

## Build e verificação

```sh
node build.mjs
node tests/access.test.mjs
```

O build gera módulos ESM em `dist/server/`. O entrypoint é `dist/server/index.js`. O conteúdo completo dos dois vídeos é incluído como módulos privados do servidor; apenas trechos curtos ficam em `public/assets/`. Os vídeos foram otimizados para reprodução móvel.

As verificações cobrem login, sessões, isolamento de favoritos, administração, mídia privada, reprodução por intervalos, expiração, troca de senha, saída e limite de tentativas. Usam armazenamento R2 simulado; não substituem uma revisão visual em dispositivos reais.

## Publicação

Este projeto está vinculado ao Sites em `.openai/hosting.json`. É necessário manter o Worker, o binding R2 e a autenticação administrativa da plataforma. Publicar somente a pasta `public/` em hospedagem estática não ativa login nem biblioteca privada.

Para uma hospedagem diferente, adapte o provisionamento do R2 e a autenticação da administração; não aceite cabeçalhos de identidade enviados diretamente pelo visitante.

## Conteúdo

Os dois vídeos fornecidos estão em `private-media/`. As capas são quadros extraídos desses vídeos. Novas fotos e vídeos podem ser enviados no painel administrativo. Nenhuma coleção adicional ou foto exclusiva foi inventada.
