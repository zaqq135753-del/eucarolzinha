// Gerenciador do vídeo de abertura (Hero) iniciando a partir de 0.8s em slow motion suave e loop contínuo
export function setupIntro(video, button, { reveal, manual=false, doc=document, timeout=8000 } = {}) {
  const START_TIME = 0.8;
  const SLOW_RATE = 0.70; // slow motion leve no início
  let pending = false;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;

  const setStartTime = () => {
    try {
      if (video.currentTime < START_TIME || (video.duration && video.currentTime >= video.duration - 0.25)) {
        video.currentTime = START_TIME;
        video.playbackRate = SLOW_RATE;
      }
    } catch (_) {}
  };

  video.addEventListener('loadedmetadata', setStartTime);
  video.addEventListener('canplay', setStartTime);

  const offerPlay = reason => {
    button.hidden = false;
    reveal(3, reason);
  };

  const attempt = () => {
    if (doc.hidden || pending) return;
    setStartTime();
    pending = true;
    video.muted = true;
    video.playbackRate = SLOW_RATE;
    let promise;
    try {
      promise = video.play();
    } catch (e) {
      pending = false;
      offerPlay('play_error');
      return;
    }
    Promise.resolve(promise).then(() => {
      pending = false;
      button.hidden = true;
    }).catch(() => {
      pending = false;
      offerPlay('autoplay_blocked');
    });
  };

  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    if (video.duration && t >= video.duration - 0.25) {
      video.currentTime = START_TIME;
      video.playbackRate = SLOW_RATE;
      return;
    } else if (t < START_TIME && !video.seeking) {
      video.currentTime = START_TIME;
      video.playbackRate = SLOW_RATE;
    }

    // Começa em slow motion leve (0.70x) e acelera suavemente para velocidade normal após 2.5s
    if (t < START_TIME + 2.5) {
      video.playbackRate = SLOW_RATE;
    } else if (t < START_TIME + 4.0) {
      const prog = (t - (START_TIME + 2.5)) / 1.5;
      video.playbackRate = SLOW_RATE + prog * (1.0 - SLOW_RATE);
    } else {
      video.playbackRate = 1.0;
    }

    // 1º momento: Vídeo em tela cheia (trava no funil) durante os primeiros ~3.5s reais (2.5s a 0.70x = 3.57s)
    // 2º momento: Sobe o texto do título (stage 1) e permanece ali por ~3.5 segundos reais
    // 3º momento: Sobe os detalhes e chips de especificações (stage 2)
    // 4º momento: Sobe o CTA do WhatsApp e destrava toda a continuação da página (stage 3)
    if (t >= START_TIME + 7.5) reveal(3, 'video');
    else if (t >= START_TIME + 5.8) reveal(2, 'video');
    else if (t >= START_TIME + 2.5) reveal(1, 'video');
  });

  video.addEventListener('ended', () => {
    video.currentTime = START_TIME;
    video.playbackRate = SLOW_RATE;
    video.play().catch(() => {});
  });

  video.addEventListener('seeking', () => {
    if (video.currentTime < START_TIME) {
      video.currentTime = START_TIME;
      video.playbackRate = SLOW_RATE;
    }
  });

  video.addEventListener('playing', () => {
    button.hidden = true;
  });

  video.addEventListener('error', () => offerPlay('video_error'));

  button.addEventListener('click', () => {
    if (video.error) video.load();
    setStartTime();
    attempt();
  });

  doc.addEventListener('visibilitychange', () => {
    if (doc.hidden) video.pause();
    else if (!manual) attempt();
  });

  if (manual) {
    offerPlay('user_preferences');
  } else {
    video.autoplay = true;
    setStartTime();
    attempt();
  }

  return { attempt };
}
