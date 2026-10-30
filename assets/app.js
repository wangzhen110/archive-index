/* 公共工具，供 index.html / labels.html / admin.html 使用 */
window.App = (function () {
  const RETENTIONS = ['永久', '30 年', '10 年', '5 年'];
  const STATUSES = ['在架', '借出', '待归'];

  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function locParts(box) {
    return [box.room, box.row, box.shelf, box.layer].filter(Boolean);
  }

  function locationText(box) {
    return locParts(box).join(' · ');
  }

  function boxItemCount(box) {
    return (box.items || []).length;
  }

  function fileNameFromPath(p) {
    if (!p) return '';
    const parts = String(p).split(/[\\/]/).filter(Boolean);
    return parts.length ? parts[parts.length - 1] : p;
  }

  async function loadData() {
    const res = await fetch('data.json?v=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('data.json 读取失败（HTTP ' + res.status + '）');
    const data = await res.json();
    data.boxes = data.boxes || [];
    data.rooms = data.rooms || [];
    return data;
  }

  function stats(data) {
    const items = data.boxes.reduce(function (n, b) { return n + boxItemCount(b); }, 0);
    return { boxes: data.boxes.length, items: items };
  }

  function toast(msg, kind) {
    let el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#1b2028;color:#fff;padding:10px 16px;border-radius:6px;font-size:13px;z-index:99;box-shadow:0 6px 20px rgba(0,0,0,.2);transition:opacity .2s';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = kind === 'err' ? '#b42318' : (kind === 'ok' ? '#1e6b33' : '#1b2028');
    el.style.opacity = '1';
    clearTimeout(el._t);
    el._t = setTimeout(function () { el.style.opacity = '0'; }, 2600);
  }

  function pageBase() {
    return window.location.href.split('?')[0].split('#')[0].replace(/[^/]*$/, '');
  }

  function boxUrl(id) {
    return pageBase() + '?box=' + encodeURIComponent(id);
  }

  return {
    RETENTIONS: RETENTIONS,
    STATUSES: STATUSES,
    esc: esc,
    locParts: locParts,
    location: locationText,
    boxItemCount: boxItemCount,
    fileNameFromPath: fileNameFromPath,
    loadData: loadData,
    stats: stats,
    toast: toast,
    pageBase: pageBase,
    boxUrl: boxUrl
  };
})();
