# Carolzinha Privé
Presell pública: /
Entrada: /entrar
Biblioteca: /privado
Administração: /admin

## Acessos
Autenticação via Sign in with ChatGPT (dispatcher Sites). ADMIN_EMAIL é configurado somente no ambiente de produção. Admin cadastra o e-mail exato usado pelo cliente ao entrar, com validade opcional. Cada API de conteúdo e mídia verifica autorização no servidor; revogar acesso tem efeito na próxima solicitação.

## Conteúdo
Arquivos e registros são persistidos no bucket privado BUCKET, por objeto individual. Coleções podem ser rascunho, publicadas ou agendadas; selecionar uma foto como capa após upload. Favoritos e progresso pertencem à identidade autenticada. Upload em lote sequencial, 50 MB por arquivo, formatos JPG/PNG/WebP/MP4/WebM. Os vídeos enviados precisam estar preparados para reprodução web; não há transcodificação automática.

## WhatsApp
Número fornecido: 553191372791. Navegação target=_top para não depender de popup. O destino ainda precisa ser confirmado com o link de compartilhamento de perfil fornecido pelo responsável: não inferir dígitos. Mensagem UTF-8 codificada com encodeURIComponent.

## Operação
Pagamento e envio da tabela permanecem manuais no WhatsApp. Chamadas são solicitações, não reservas confirmadas. Nenhum conteúdo exclusivo foi importado: os únicos arquivos públicos são os teasers anteriores.

## Build
node build.mjs
Saída: Worker ESM em dist/server, assets públicos incorporados. Não colocar arquivos exclusivos em public/.
