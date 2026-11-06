/* Home page – video modal for the "World Aquatics Masters Championships 2027" card */
(function () {
  var card = document.querySelector('[data-jt-video]');
  if (!card) return;

  var mobile = window.matchMedia('(max-width: 767px)').matches;
  var SRC = mobile ? '/assets/video/jet-aquatics-720p.mp4' : '/assets/video/jet-aquatics-1080p.mp4';

  var modal = document.createElement('div');
  modal.className = 'jt-vmodal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'World Aquatics Masters Championships 2027 – video');
  modal.innerHTML =
    '<button type="button" class="jt-vmodal__close" aria-label="Close video"></button>' +
    '<div class="jt-vmodal__frame">' +
      '<button type="button" class="jt-vmodal__play" hidden>' +
        '<span class="jt-play__icon"><svg viewBox="0 0 12 14" aria-hidden="true"><path d="M1 1.2v11.6a.6.6 0 0 0 .9.5l9.6-5.8a.6.6 0 0 0 0-1L1.9.7a.6.6 0 0 0-.9.5z"/></svg></span>' +
        'Play video' +
      '</button>' +
    '</div>';
  document.body.appendChild(modal);

  // Build the <video> with properties (not only attributes): iOS Safari only
  // autoplays without a tap when the element is really muted + inline.
  var video = document.createElement('video');
  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.controls = true;
  video.preload = 'none';
  video.poster = '/assets/img/aquatics-poster.jpg';
  video.src = SRC;

  var frame = modal.querySelector('.jt-vmodal__frame');
  var playBtn = modal.querySelector('.jt-vmodal__play');
  var closeBtn = modal.querySelector('.jt-vmodal__close');
  frame.insertBefore(video, playBtn);

  function showPlayButton(show) { playBtn.hidden = !show; }

  function start() {
    video.muted = true;
    var p = video.play();
    if (p && p.then) {
      p.then(function () { showPlayButton(false); })
       .catch(function () { showPlayButton(true); }); // e.g. iPhone Low Power Mode
    }
  }

  function open(fromLink) {
    modal.classList.add('is-open');
    document.body.classList.add('jt-vlock');
    if (video.preload !== 'auto') { video.preload = 'auto'; video.load(); }
    else { try { video.currentTime = 0; } catch (e) {} }
    if (fromLink) video.autoplay = true;
    start();
    closeBtn.focus({ preventScroll: true });
  }
  function close() {
    modal.classList.remove('is-open');
    document.body.classList.remove('jt-vlock');
    video.autoplay = false;
    video.pause();
    showPlayButton(false);
    card.focus({ preventScroll: true });
    // drop the #aquatics deep link so a refresh doesn't reopen the video
    if (location.hash === '#aquatics') {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  video.addEventListener('playing', function () { showPlayButton(false); });
  playBtn.addEventListener('click', start);
  card.addEventListener('click', function () { open(false); });
  card.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(false); }
  });
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
  });

  // Deep link (QR code): https://jettraveldmc.com/#aquatics opens the video right away
  function fromHash() {
    if (location.hash !== '#aquatics' || modal.classList.contains('is-open')) return;
    card.scrollIntoView({ block: 'center' }); // so the card is behind the modal when it closes
    open(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fromHash);
  else fromHash();
  window.addEventListener('hashchange', fromHash);
})();
