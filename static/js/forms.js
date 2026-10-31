/* Bảo Việt Motor pre-order and contact forms. Validates in the browser, then POSTs JSON to the API.
   The server re-validates everything; browser checks are only for faster feedback. */
(function () {
  'use strict';
  var loadedAt = Date.now();
  var PHONE = /^(0\d{9,10}|\+\d{8,15})$/;
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var normPhone = function (v) { return String(v || '').replace(/[\s.\-()]/g, ''); };

  Array.prototype.forEach.call(document.querySelectorAll('form[data-endpoint]'), function (form) {
    var msg = function (k) { return form.getAttribute('data-msg-' + k) || ''; };
    var status = form.querySelector('.form-status');
    var submit = form.querySelector('button[type=submit]');
    var submitLabel = submit.innerHTML;
    var success = form.parentNode.querySelector('.success');
    var requireOne = (form.getAttribute('data-require-one') || '').split(',').filter(Boolean);

    function setError(name, text) {
      var wrap = form.querySelector('[data-field="' + name + '"]');
      if (!wrap) return;
      wrap.classList.toggle('invalid', !!text);
      var err = wrap.querySelector('.err');
      if (err) err.textContent = text || '';
      var input = wrap.querySelector('input, select, textarea');
      if (input) input.setAttribute('aria-invalid', text ? 'true' : 'false');
    }
    function clearErrors() {
      Array.prototype.forEach.call(form.querySelectorAll('[data-field]'), function (w) { setError(w.getAttribute('data-field'), ''); });
      status.className = 'form-status'; status.textContent = '';
    }

    function validate(data) {
      var errors = {};
      var el = function (n) { return form.elements.namedItem(n); };
      if (el('name')) {
        var n = (data.name || '').trim();
        if (n.length < 2 || n.length > 80) errors.name = msg('name');
      }
      var phone = normPhone(data.phone);
      var email = (data.email || '').trim();
      if (el('phone') && el('phone').required && !phone) errors.phone = msg('required');
      if (phone && !PHONE.test(phone)) errors.phone = msg('phone');
      if (email && !EMAIL.test(email)) errors.email = msg('email');
      if (requireOne.length && !phone && !email) { errors.phone = msg('contactOne'); errors.email = msg('contactOne'); }
      Array.prototype.forEach.call(form.querySelectorAll('select[required], textarea[required]'), function (el) {
        if (!String(el.value || '').trim()) errors[el.name] = msg('required');
      });
      if (!data.consent) errors.consent = msg('consent');
      return errors;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();
      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) { data[k] = typeof v === 'string' ? v : ''; });
      var c = form.elements.namedItem('consent'); data.consent = !!(c && c.checked);
      data.lang = form.getAttribute('data-lang') || 'vi';
      data.elapsedMs = Date.now() - loadedAt;

      var errors = validate(data);
      var keys = Object.keys(errors);
      if (keys.length) {
        keys.forEach(function (k) { setError(k, errors[k]); });
        var first = form.querySelector('[data-field="' + keys[0] + '"] input, [data-field="' + keys[0] + '"] select, [data-field="' + keys[0] + '"] textarea');
        if (first) first.focus();
        return;
      }

      submit.disabled = true;
      submit.textContent = msg('sending');

      fetch(form.getAttribute('data-endpoint'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data),
        credentials: 'same-origin'
      }).then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (body) { return { res: res, body: body }; });
      }).then(function (r) {
        if (r.res.ok && r.body.ok) {
          form.hidden = true;
          success.querySelector('[data-ref]').textContent = r.body.ref;
          var dup = success.querySelector('[data-dup]');
          if (dup) dup.hidden = !r.body.duplicate;
          success.classList.add('show');
          success.focus();
          success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }
        if (r.res.status === 400 && r.body.fields) {
          Object.keys(r.body.fields).forEach(function (k) {
            var code = r.body.fields[k];
            setError(k, msg(code) || msg('required'));
          });
          status.className = 'form-status error';
          status.textContent = msg('required');
        } else if (r.res.status === 429) {
          status.className = 'form-status error'; status.textContent = msg('rate');
        } else {
          status.className = 'form-status error'; status.textContent = msg('server');
        }
      }).catch(function () {
        status.className = 'form-status error'; status.textContent = msg('network');
      }).then(function () {
        submit.disabled = false;
        submit.innerHTML = submitLabel;
      });
    });
  });
})();
