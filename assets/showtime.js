/* Showtime Collision — interactions (vanilla, no dependencies) */
(function () {
  'use strict';

  /* ---- Mobile drawer ---- */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.getElementById('mobileDrawer');
  var scrim = document.getElementById('scrim');
  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('open'); scrim.classList.add('open');
    toggle.classList.add('open'); toggle.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('open'); scrim.classList.remove('open');
    toggle.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false');
  }
  if (toggle) toggle.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  if (scrim) scrim.addEventListener('click', closeDrawer);
  var dc = document.querySelector('.drawer-close');
  if (dc) dc.addEventListener('click', closeDrawer);
  document.querySelectorAll('.mobile-drawer nav a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      var a = q.nextElementSibling;
      q.setAttribute('aria-expanded', open ? 'false' : 'true');
      a.style.maxHeight = open ? null : a.scrollHeight + 'px';
    });
  });

  /* ---- Gallery filter ---- */
  var filterBtns = document.querySelectorAll('.gal-filter button');
  if (filterBtns.length) {
    filterBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        filterBtns.forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        var cat = b.getAttribute('data-filter');
        document.querySelectorAll('[data-cat]').forEach(function (item) {
          var show = cat === 'all' || item.getAttribute('data-cat').indexOf(cat) > -1;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---- Multi-step estimate form ---- */
  var form = document.getElementById('estimateForm');
  if (form) {
    var steps = Array.prototype.slice.call(form.querySelectorAll('.fstep'));
    var bars = Array.prototype.slice.call(document.querySelectorAll('.progress .bar'));
    var current = 0;
    var success = document.getElementById('formSuccess');

    function showStep(i) {
      steps.forEach(function (s, idx) { s.classList.toggle('active', idx === i); });
      bars.forEach(function (b, idx) {
        b.classList.toggle('done', idx < i);
        b.classList.toggle('active', idx === i);
      });
      current = i;
      var shell = document.getElementById('formShell');
      if (shell) shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function validateStep(i) {
      var ok = true;
      steps[i].querySelectorAll('[required]').forEach(function (f) {
        if (f.type === 'checkbox') {
          if (!f.checked) { ok = false; f.closest('.consent').style.borderColor = '#DA0020'; }
        } else if (!f.value.trim()) {
          ok = false; f.style.borderColor = '#DA0020';
        } else { f.style.borderColor = ''; }
      });
      return ok;
    }

    form.querySelectorAll('[data-next]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (validateStep(current)) showStep(current + 1);
      });
    });
    form.querySelectorAll('[data-prev]').forEach(function (btn) {
      btn.addEventListener('click', function () { showStep(current - 1); });
    });

    /* file upload preview */
    var fileInput = document.getElementById('photoInput');
    var fileList = document.getElementById('fileList');
    if (fileInput) {
      fileInput.addEventListener('change', function () {
        if (!fileList) return;
        fileList.textContent = fileInput.files.length
          ? fileInput.files.length + ' photo(s) selected'
          : '';
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateStep(current)) return;
      form.style.display = 'none';
      if (success) success.classList.add('show');
      var prog = document.querySelector('.progress');
      if (prog) prog.style.display = 'none';
    });
  }

  /* ---- Mark active nav link ---- */
  var seg = location.pathname.split('/').pop() || 'index.html';
  var path = seg.replace(/\.html$/, '') || 'index';
  document.querySelectorAll('.main-nav a, .mobile-drawer nav a').forEach(function (a) {
    var href = (a.getAttribute('href') || '').replace(/\.html$/, '');
    if (href && href === path) { a.classList.add('active'); a.setAttribute('aria-current', 'page'); }
  });
})();
