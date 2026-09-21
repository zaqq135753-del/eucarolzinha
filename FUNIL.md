# Documentação do Funil — Carolzinha Privé

## Estrutura Integrada do Funil (Pressel + Telegram)

O funil está estruturado para maximizar a captura do lead e a conversão em vendas de conteúdo +18:

```
                  [ Anúncio / Tráfego ]
                            │
                            ▼
                   [ Página da Pressel ]
                     /               \
                    /                 \
        (Clique Principal)       (Intenção de Saída / Prévias)
                  /                     \
                 ▼                       ▼
    [ Bot no Privado ]          [ Grupo 1: Aquecimento ]
 (@eucarolzinha_bot?start=presell)   (Canal Aberto - Prévias Leves)
                 │                               │
                 │                               ▼ (Sequência 5 posts)
                 │                      [ Grupo 2: Reservado ]
                 │                    (Prévias Quentes / Tensão Alta)
                 │                               │
                 │                               ▼ (CTA Post 5)
                 └──────────────► [ Checkout / Venda VIP ]
```

---

### 1. Destinos na Pressel (`public/funnel-config.js` & `public/config.js`)

* **Destino Principal (`funnelConfig.main.bot`):**
  - **Link:** `https://t.me/eucarolzinha_bot?start=presell`
  - **Função:** Captura o lead diretamente no privado do bot Telegram. O bot dá as boas-vindas com tom íntimo e oferece o link do VIP Completo e o link do grupo gratuito de prévias.
* **Destino Alternativo / Prévias (`funnelConfig.starter.bot`):**
  - **Link:** `https://t.me/+N0qDwwVScTIxNGMx` (Grupo 1)
  - **Função:** Para o visitante que ainda não comprou, o pop-up de saída ou clique voluntário convida para o canal de prévias gratuitas.

---

### 2. Automação dos Grupos no Telegram

* **Grupo 1 — Aquecimento (`https://t.me/+N0qDwwVScTIxNGMx`):**
  - 5 postagens programadas (boas-vindas, vídeo teaser 1, fotos provocantes).
  - O Post 5 direciona o lead para o Grupo 2 (Reservado).
* **Grupo 2 — Reservado (`https://t.me/+MZUx4bfXiS4yYTYx`):**
  - Conteúdo mais explícito e quente (vídeo 2 se tocando, fotos sensuais).
  - O Post 5 entrega o vídeo 3 e a chamada final para o Checkout do Acesso VIP Completo.

---

### 3. Configurações Ativas

- **Bot Telegram:** `@eucarolzinha_bot` (Token configurado no projeto do bot).
- **Admin do Bot:** `8879038793`
- **Grupo 1 (Chat ID):** `-5363804203`
- **Grupo 2 (Chat ID):** `-5528862824`
- **WhatsApp Atendimento:** `+55 31 9137-2791`
