## Configuração atual: dois bots, sem valores na pressel

A página principal apresenta somente os convites para dois destinos independentes. `funnelConfig.main.bot` recebe o bot principal; `funnelConfig.starter.bot` recebe o bot secundário. Os preços e a compra são apresentados no Telegram. Os links para consultas diretas no WhatsApp foram substituídos pelo convite ao bot principal. O WhatsApp permanece como uma opção comercial descrita, não como destino da pressel.

Sem os links fornecidos, os convites mostram estado de configuração e não redirecionam. Não há alegação de pagamento aprovado ou acesso comprado liberado. A alternativa secundária é voluntária e pode aparecer uma vez por sessão após um sinal de saída no desktop. Não há detecção confiável de fechamento no celular.

A rota `/nova-pressel` agora acompanha a entrada atual, evitando uma oferta antiga com valores diferentes. A área de membros mantém suas ofertas internas, pois esta alteração cobre a pressel.

Motion: entrada dos elementos após o vídeo; duas trocas de texto no título, encerrando em uma frase estável; seções reveladas no scroll; destaque breve no botão; convite animado; galeria com navegação explícita. Respeita redução de movimento. A eficácia comercial deve ser medida com cliques e compras confirmadas pelo provedor, não inferida pelas animações.

---
Histórico de versões abaixo (substituído pelas definições acima):

## Atualização da entrada principal

A rota `/` agora utiliza o primeiro vídeo do novo envio (arquivo `grok-video-31dfffda-9ead-429b-9634-b17c797de014(1).mp4`). A galeria contém `TJk4Z.jpg`, a segunda prévia em vídeo e `Wr8fx.jpg`, com versões otimizadas para web. As duas ofertas principais abrem consultas de condições e preços no WhatsApp fornecido. Não há checkout nem detecção de compra implementados. A oferta alternativa no Telegram custa R$ 16,90 e depende do link do bot em `public/funnel-config.js`.

A oferta alternativa pode ser aberta por escolha explícita e, no desktop, por um sinal de saída após a visualização das ofertas. Não há interceptação do fechamento ou do botão Voltar. O clique em uma consulta suprime a oferta automática na visita atual, sem classificar esse clique como compra.

A versão de revisão anterior permanece em `/nova-pressel` e não é a entrada principal.

---

# Nova pressel — versão de revisão

Endereço: `/nova-pressel`. A entrada principal permanece em `/` até que os dados comerciais necessários sejam definidos. Esta versão usa as três novas mídias em vídeo e as duas imagens fornecidas.

## Fluxo implementado

1. Sequência de três vídeos de apresentação, com navegação manual, pausa, reprodução sem áudio e botão por toque quando autoplay for bloqueado. Apenas o vídeo atual é carregado. Os botões da oferta aparecem após 2,8 segundos assistidos, com alternativa após oito segundos de espera.
2. Foto de apresentação com revelação por clique. É uma prévia gratuita para todos os visitantes, não um sorteio, prêmio raro ou seleção individual. O desfoque é um efeito visual: esta imagem é pública, não conteúdo pago protegido.
3. Oferta principal descrevendo pacote de fotos e vídeos, acesso ao WhatsApp e entrada na biblioteca. Preço, prazo, quantidades e checkout ainda precisam ser definidos. Não inventar valores nem mostrar um botão de pagamento ativo sem destino.
4. Oferta menor de R$ 16,90 em uma janela que pode ser fechada. A seleção de entrada não inclui pacote completo nem chamadas. O usuário pode abri-la explicitamente. No desktop, um sinal de saída pelo topo também pode mostrá-la depois de visualizar a oferta e permanecer vinte segundos na página, no máximo uma vez por sessão.
5. A área de membros existente continua acessível por `/entrar`.

## Limites reais

Não há detecção confiável do fechamento de uma página em celulares. A página não intercepta o botão Voltar, não usa avisos de saída do navegador e não cria mensagens falsas. Não é possível saber se houve compra pelo simples clique no checkout; é necessário integrar uma confirmação confiável do pagamento.

## Condições para ativar a nova entrada

- Preço do pacote principal, quantidade de fotos/vídeos e prazo do acesso.
- Definir o que o acesso ao WhatsApp permite: conversa, suporte, conteúdo ou outro serviço; não prometer disponibilidade ilimitada.
- Link HTTPS do checkout principal.
- Link do bot da seleção de R$ 16,90, com conteúdo, prazo e condições informados antes de pagar.
- Definição do método de entrega após pagamento. Não há liberação automática por webhook nesta versão.
- Se desejar confirmação automática: documentar o webhook do provedor, validar assinatura, registrar transação e só então liberar acesso. Nunca confiar em parâmetro de URL para confirmar compra.

Configuração: `public/funnel-config.js`. Enquanto os dados estiverem ausentes, os destinos de compra ficam desativados e a página permanece identificada como revisão.

## Hipóteses comerciais a testar

A mídia inicial pode melhorar a atenção; a prévia gratuita pode reduzir a incerteza sobre o estilo do conteúdo; o pacote menor pode recuperar parte das pessoas que recusaram a oferta principal. Nenhum desses efeitos é um resultado comprovado deste projeto.

A oferta de R$ 16,90 deve conter uma seleção claramente menor. Apresentar o mesmo conteúdo por menos pode deslocar vendas do pacote principal. Evitar anunciá-la antes de apresentar a oferta principal e comparar a receita total por visitante entre versões.

## Eventos preparados

`funnel_view`, `story_selected`, `story_completed`, `bonus_opened`, `main_offer_viewed`, `main_checkout_clicked`, `starter_offer_viewed`, `starter_offer_closed`, `starter_bot_clicked`.

Os eventos usam o adaptador local existente (`dataLayer` e evento customizado); não há serviço externo de medição instalado. Cliques são sinais de intenção, não vendas confirmadas.

## Critério de avaliação

Após definir oferta e medição, comparar a versão atual com a nova, mantendo a origem de tráfego e a oferta comparáveis. Medir abertura da prévia, visualização do pacote, clique no checkout, compra confirmada e receita por visitante. Avaliar também reembolsos e demanda de atendimento. Não concluir sucesso apenas por tempo de permanência ou cliques no vídeo.

## Verificação

Mídias convertidas para H.264 baseline, yuv420p, MP4 faststart. Entrega por intervalos de bytes no Worker. Fluxos de autenticação existentes preservados. Não foi realizada inspeção visual em navegador real neste ambiente.
