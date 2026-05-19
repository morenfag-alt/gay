/**
 * ghost-cursor.js
 * Ghost/spirit cursor trail effect.
 * Spawns small ghost SVG shapes that follow the mouse,
 * fading out with a floating upward animation.
 */
(function () {
  'use strict';

  // Skip on touch devices
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var THROTTLE_MS = 60;
  var ANIM_DURATION = 900;
  var GHOST_SVG = '<svg width="24" height="28" viewBox="0 0 24 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 0C6.48 0 2 4.48 2 10v12c0 1 0.8 1.6 1.4 1.1L5 22l1.8 1.8c0.4 0.4 1 0.4 1.4 0L10 22l1.2 1.2c0.4 0.4 1.2 0.4 1.6 0L14 22l1.8 1.8c0.4 0.4 1 0.4 1.4 0L19 22l1.6 1.1c0.6 0.5 1.4-0.1 1.4-1.1V10c0-5.52-4.48-10-10-10z"/>' +
    '<circle cx="9" cy="11" r="2" fill="rgba(255,255,255,0.85)"/>' +
    '<circle cx="15" cy="11" r="2" fill="rgba(255,255,255,0.85)"/>' +
    '</svg>';

  var container = null;
  var lastSpawn = 0;
  var styleInjected = false;

  function injectStyles() {
    if (styleInjected) return;
    styleInjected = true;
    var style = document.createElement('style');
    style.textContent =
      '@keyframes ghost-fade{' +
        '0%{opacity:var(--ghost-start-opacity,0.85);transform:translate(-50%,-50%) scale(var(--ghost-scale,1)) rotate(0deg);}' +
        '100%{opacity:0;transform:translate(-50%,-50%) scale(calc(var(--ghost-scale,1)*0.5)) rotate(var(--ghost-rotate,20deg)) translateY(-30px);}' +
      '}' +
      '.ghost-trail-item{' +
        'position:absolute;' +
        'animation:ghost-fade ' + ANIM_DURATION + 'ms ease-out forwards;' +
        'pointer-events:none;' +
        'will-change:transform,opacity;' +
      '}';
    document.head.appendChild(style);
  }

  function createContainer() {
    container = document.createElement('div');
    container.style.cssText = 'position:fixed;inset:0;z-index:9998;pointer-events:none;overflow:hidden;';
    document.body.appendChild(container);
  }

  function getAccentColor() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#b8864c';
  }

  function spawnGhost(x, y) {
    var ghost = document.createElement('div');
    ghost.className = 'ghost-trail-item';

    var scale = 0.6 + Math.random() * 0.6;
    var rotate = (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 25);
    var startOpacity = 0.6 + Math.random() * 0.3;

    ghost.style.cssText =
      'left:' + x + 'px;' +
      'top:' + y + 'px;' +
      'color:' + getAccentColor() + ';' +
      '--ghost-scale:' + scale.toFixed(2) + ';' +
      '--ghost-rotate:' + rotate.toFixed(1) + 'deg;' +
      '--ghost-start-opacity:' + startOpacity.toFixed(2) + ';';

    ghost.innerHTML = GHOST_SVG;
    container.appendChild(ghost);

    setTimeout(function () {
      if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
    }, ANIM_DURATION + 50);
  }

  function onMouseMove(e) {
    var now = performance.now();
    if (now - lastSpawn < THROTTLE_MS) return;
    lastSpawn = now;
    spawnGhost(e.clientX, e.clientY);
  }

  function init() {
    injectStyles();
    createContainer();
    window.addEventListener('mousemove', onMouseMove);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
