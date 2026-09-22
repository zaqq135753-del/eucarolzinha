// Gerenciador do vídeo de abertura (Hero) em loop contínuo iniciando a partir de 0.8s
export function setupIntro(video, button, { reveal, manual=false, doc=document, timeout=8000 } = {}) {
  const START_TIME = 0.8;
  let pending = false;
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.loop = true;

  const setStartTime = () => {
    try {
      if (video.currentTime < START_TIME || (video.duration && video.currentTime >= video.duration - 0.25)) {
        video.currentTime = START_TIME;
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
    } else if (t < START_TIME && !video.seeking) {
      video.currentTime = START_TIME;
    }

    if (t >= START_TIME + 2.0) reveal(3, 'video');
    else if (t >= START_TIME + 1.2) reveal(2, 'video');
    else if (t >= START_TIME + 0.4) reveal(1, 'video');
  });

  video.addEventListener('ended', () => {
    video.currentTime = START_TIME;
    video.play().catch(() => {});
  });

  video.addEventListener('seeking', () => {
    if (video.currentTime < START_TIME) {
      video.currentTime = START_TIME;
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
