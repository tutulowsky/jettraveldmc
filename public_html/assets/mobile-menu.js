/* Jet Travel DMC – mobile menu. Builds the panel from the existing site menu. */
(function () {
  var CONTACT = {
    email: 'info@jettraveldmc.com',
    phone: '+36 1 209 2110',
    linkedin: 'https://www.linkedin.com/company/jettravel'
  };

  var widget = document.querySelector('.elementor-widget-nav-menu');
  var source = widget && widget.querySelector('.elementor-nav-menu--main > ul');
  if (!source) return;

  var here = location.pathname.replace(/index\.html$/, '');
  function isCurrent(a) {
    var u = new URL(a.getAttribute('href'), location.href);
    return !u.hash && u.pathname === here;
  }
  function link(a) {
    var el = document.createElement('a');
    el.href = a.getAttribute('href');
    var label = document.createElement('span');
    label.className = 'jm-label';
    label.textContent = a.textContent.trim();
    el.appendChild(label);
    if (isCurrent(a)) el.setAttribute('aria-current', 'page');
    return el;
  }

  // ---- menu list
  var ol = document.createElement('ol');
  Array.prototype.forEach.call(source.children, function (li, i) {
    var a = li.querySelector(':scope > a');
    if (!a) return;
    var item = document.createElement('li');
    item.style.transitionDelay = (0.18 + i * 0.05) + 's';
    item.appendChild(link(a));
    var sub = li.querySelectorAll(':scope > ul > li > a');
    if (sub.length) {
      var ul = document.createElement('ul');
      Array.prototype.forEach.call(sub, function (s) {
        var sli = document.createElement('li');
        sli.appendChild(link(s));
        ul.appendChild(sli);
      });
      item.appendChild(ul);
    }
    ol.appendChild(item);
  });

  // ---- panel
  var logo = document.querySelector('.elementor-widget-theme-site-logo img');
  var panel = document.createElement('div');
  panel.className = 'jm-panel';
  panel.id = 'jm-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', 'Menu');
  panel.innerHTML =
    '<div class="jm-bar">' +
      '<a href="/" aria-label="Jet Travel DMC – Home">' + (logo ? '<img src="' + logo.getAttribute('src') + '" alt="Jet Travel DMC">' : '') + '</a>' +
      '<button type="button" class="jm-close" aria-label="Close menu"></button>' +
    '</div>' +
    '<nav class="jm-nav" aria-label="Main"></nav>' +
    '<div class="jm-foot">' +
      '<a class="jm-cta" href="/contact/">Plan your event with us' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"/></svg></a>' +
      '<div class="jm-contact">' +
        '<div><small>Email</small><a href="mailto:' + CONTACT.email + '">' + CONTACT.email + '</a></div>' +
        '<div><small>Phone</small><a href="tel:' + CONTACT.phone.replace(/\s/g, '') + '">' + CONTACT.phone + '</a></div>' +
        '<div><small>Follow</small><a href="' + CONTACT.linkedin + '" target="_blank" rel="noopener">LinkedIn</a></div>' +
        '<div><small>Office</small>H-1113 Budapest,<br>Bocskai út 77-79</div>' +
      '</div>' +
    '</div>';
  panel.querySelector('.jm-nav').appendChild(ol);
  document.body.appendChild(panel);

  // ---- toggle button (sits where Elementor's burger was)
  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'jm-toggle';
  toggle.setAttribute('aria-label', 'Open menu');
  toggle.setAttribute('aria-controls', 'jm-panel');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span><span></span>';
  var old = widget.querySelector('.elementor-menu-toggle');
  (old ? old.parentNode : widget).insertBefore(toggle, old || null);

  var root = document.documentElement;
  var closeBtn = panel.querySelector('.jm-close');

  function open() {
    root.classList.add('jm-open');
    document.body.classList.add('jm-lock');
    toggle.setAttribute('aria-expanded', 'true');
    setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function close(returnFocus) {
    root.classList.remove('jm-open');
    document.body.classList.remove('jm-lock');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  }

  toggle.addEventListener('click', open);
  closeBtn.addEventListener('click', function () { close(true); });
  panel.addEventListener('click', function (e) {
    if (e.target.closest('a')) close(false); // also closes for same-page anchors
  });
  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('jm-open')) return;
    if (e.key === 'Escape') close(true);
    if (e.key === 'Tab') { // keep focus inside the panel
      var f = panel.querySelectorAll('a, button');
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.matchMedia('(min-width: 1025px)').addEventListener('change', function (m) { if (m.matches) close(false); });
})();
