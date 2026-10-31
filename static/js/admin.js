/* Bảo Việt Motor admin dashboard. Talks to /api/admin/* with a Bearer password kept in sessionStorage. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var KEY = 'bv-admin';
  var PAGE = 50;
  var state = { offset: 0, total: 0, items: [], open: {} };
  var STATUSES = ['new', 'contacted', 'confirmed', 'cancelled', 'done'];

  var token = function () { try { return sessionStorage.getItem(KEY) || ''; } catch (e) { return ''; } };
  var setToken = function (t) { try { t ? sessionStorage.setItem(KEY, t) : sessionStorage.removeItem(KEY); } catch (e) { /* ignore */ } };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var when = function (iso) { var d = new Date(iso); return isNaN(d) ? '' : d.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }); };

  function api(path, opts) {
    opts = opts || {};
    var headers = { 'Authorization': 'Bearer ' + token(), 'Accept': 'application/json' };
    if (opts.body) headers['Content-Type'] = 'application/json';
    return fetch(path, { method: opts.method || 'GET', headers: headers, body: opts.body ? JSON.stringify(opts.body) : undefined, credentials: 'same-origin' })
      .then(function (res) {
        if (res.status === 401) { logout('Wrong password.'); throw new Error('unauthorized'); }
        if (res.status === 429) throw new Error('Too many failed attempts. Try again in 15 minutes.');
        if (res.status === 503) return res.json().then(function (b) { throw new Error(b.message || b.error || 'Service unavailable'); });
        if (opts.raw) return res;
        return res.json().then(function (b) { if (!res.ok || !b.ok) throw new Error(b.error || ('HTTP ' + res.status)); return b; });
      });
  }

  function show(app) {
    $('loginView').hidden = app; $('appView').hidden = !app; $('logout').hidden = !app;
  }
  function logout(msg) {
    setToken('');
    show(false);
    if (msg) { $('loginStatus').className = 'form-status error'; $('loginStatus').textContent = msg; }
  }
  function status(msg) { var el = $('appStatus'); el.className = msg ? 'form-status error' : 'form-status'; el.textContent = msg || ''; }

  function renderStats(s) {
    $('kPre').textContent = s.preorders; $('kUnits').textContent = s.units; $('kMsg').textContent = s.messages; $('kNew').textContent = s.unhandled;
    $('byStatus').innerHTML = STATUSES.map(function (k) { return '<span class="st st-' + k + '">' + k + '</span> ' + (s.byStatus[k] || 0); }).join(' &nbsp; ');
    var max = Math.max.apply(null, [1].concat(s.byProvince.map(function (p) { return p.units || 0; })));
    $('byProvince').innerHTML = s.byProvince.length ? s.byProvince.map(function (p) {
      return '<div class="bar-row"><span>' + esc(p.province) + '</span><i style="width:' + Math.max(4, 100 * (p.units || 0) / max) + '%"></i><span>' + (p.units || 0) + '</span></div>';
    }).join('') : '<span class="small muted">No pre-orders yet.</span>';
  }

  function detailRow(it) {
    var fields = [
      ['Phone', it.phone], ['Email', it.email], ['Province', it.province], ['Bike', it.bike], ['Quantity', it.quantity],
      ['Contact by', it.contact_pref], ['Topic', it.topic], ['Language', it.lang], ['Consent', when(it.consent_at) + ' (policy v' + it.consent_version + ')'],
      ['Updated', when(it.updated_at)]
    ].filter(function (f) { return f[1] !== null && f[1] !== undefined && f[1] !== ''; });
    return '<tr class="detail" data-detail="' + it.id + '"><td colspan="6">' +
      '<div class="grid g3" style="gap:6px 18px">' + fields.map(function (f) { return '<div><span class="muted small">' + f[0] + ':</span> ' + esc(f[1]) + '</div>'; }).join('') + '</div>' +
      (it.message ? '<p class="mt-s" style="white-space:pre-wrap;margin-bottom:0"><span class="muted small">Message:</span><br>' + esc(it.message) + '</p>' : '') +
      '<div class="row-actions">' +
        '<select data-status="' + it.id + '">' + STATUSES.map(function (s) { return '<option' + (s === it.status ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select>' +
        '<textarea data-note="' + it.id + '" placeholder="Internal note (only visible here)">' + esc(it.admin_note || '') + '</textarea>' +
        '<button class="btn btn-primary btn-xs" data-save="' + it.id + '">Save</button>' +
        '<button class="btn btn-danger btn-xs" data-del="' + it.id + '">Delete</button>' +
        (it.phone ? '<a class="btn btn-outline btn-xs" href="tel:' + esc(it.phone) + '">Call</a><a class="btn btn-outline btn-xs" target="_blank" rel="noopener" href="https://zalo.me/' + esc(String(it.phone).replace(/^\+84/, '0')) + '">Zalo</a>' : '') +
        (it.email ? '<a class="btn btn-outline btn-xs" href="mailto:' + esc(it.email) + '?subject=' + encodeURIComponent(it.ref) + '">Email</a>' : '') +
      '</div></td></tr>';
  }

  function renderTable() {
    if (!state.items.length) { $('tableWrap').innerHTML = '<div class="empty">No submissions match.</div>'; }
    else {
      $('tableWrap').innerHTML = '<div style="overflow-x:auto"><table class="subs"><thead><tr><th>Ref</th><th>Received</th><th>Type</th><th>Name</th><th>Qty / topic</th><th>Status</th></tr></thead><tbody>' +
        state.items.map(function (it) {
          return '<tr style="cursor:pointer" data-toggle="' + it.id + '"><td class="mono">' + esc(it.ref) + '</td><td>' + when(it.created_at) + '</td><td>' + (it.type === 'preorder' ? 'Pre-order' : 'Message') + '</td><td><b>' + esc(it.name) + '</b><br><span class="small muted">' + esc(it.province || it.email || it.phone || '') + '</span></td><td>' + esc(it.type === 'preorder' ? (it.quantity + ' unit' + (it.quantity > 1 ? 's' : '')) : it.topic) + '</td><td><span class="st st-' + it.status + '">' + it.status + '</span></td></tr>' +
            (state.open[it.id] ? detailRow(it) : '');
        }).join('') + '</tbody></table></div>';
    }
    var from = state.total ? state.offset + 1 : 0, to = Math.min(state.offset + PAGE, state.total);
    $('pageInfo').textContent = from + ' to ' + to + ' of ' + state.total;
    $('prev').disabled = state.offset === 0; $('next').disabled = to >= state.total;
  }

  function query() {
    var p = new URLSearchParams();
    if ($('fType').value) p.set('type', $('fType').value);
    if ($('fStatus').value) p.set('status', $('fStatus').value);
    if ($('fQ').value.trim()) p.set('q', $('fQ').value.trim());
    p.set('limit', PAGE); p.set('offset', state.offset);
    return p.toString();
  }

  function load() {
    status('');
    return api('/api/admin/submissions?' + query()).then(function (b) {
      state.items = b.items; state.total = b.total;
      renderStats(b.stats); renderTable(); show(true);
    }).catch(function (e) { if (e.message !== 'unauthorized') status(e.message); });
  }

  $('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    setToken($('pw').value); $('pw').value = '';
    $('loginStatus').className = 'form-status';
    load();
  });
  $('logout').addEventListener('click', function () { logout(''); });
  $('filters').addEventListener('submit', function (e) { e.preventDefault(); state.offset = 0; load(); });
  $('refreshBtn').addEventListener('click', load);
  $('prev').addEventListener('click', function () { state.offset = Math.max(0, state.offset - PAGE); load(); });
  $('next').addEventListener('click', function () { state.offset += PAGE; load(); });

  $('tableWrap').addEventListener('click', function (e) {
    var t = e.target;
    var toggle = t.closest('[data-toggle]');
    if (toggle) { var id = toggle.getAttribute('data-toggle'); state.open[id] = !state.open[id]; renderTable(); return; }
    var save = t.getAttribute('data-save');
    if (save) {
      t.disabled = true;
      api('/api/admin/submissions/' + save, { method: 'PATCH', body: {
        status: document.querySelector('[data-status="' + save + '"]').value,
        adminNote: document.querySelector('[data-note="' + save + '"]').value
      } }).then(load).catch(function (err) { status(err.message); t.disabled = false; });
      return;
    }
    var del = t.getAttribute('data-del');
    if (del && window.confirm('Permanently delete this record? This cannot be undone.')) {
      api('/api/admin/submissions/' + del, { method: 'DELETE' }).then(function () { delete state.open[del]; load(); }).catch(function (err) { status(err.message); });
    }
  });

  $('exportBtn').addEventListener('click', function () {
    var type = $('fType').value;
    api('/api/admin/export.csv' + (type ? '?type=' + type : ''), { raw: true }).then(function (res) {
      if (!res.ok) throw new Error('Export failed (HTTP ' + res.status + ')');
      var name = (res.headers.get('Content-Disposition') || '').replace(/.*filename="?([^"]+)"?.*/, '$1') || 'export.csv';
      return res.blob().then(function (blob) {
        var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
        document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
      });
    }).catch(function (e) { status(e.message); });
  });

  if (token()) load(); else show(false);
})();
