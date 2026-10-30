/* 公共工具，供 index.html / labels.html / admin.html 使用 */
window.App = (function () {
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

  function boxFolderCount(box) {
    return (box.folders || []).length;
  }

  function boxFileCount(box) {
    return (box.folders || []).reduce(function (n, f) {
      return n + ((f.files || []).length);
    }, 0);
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
    let folders = 0, files = 0;
    (data.boxes || []).forEach(function (b) {
      folders += boxFolderCount(b);
      files += boxFileCount(b);
    });
    return { boxes: (data.boxes || []).length, folders: folders, files: files };
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

  // 每个档案盒固定一个配色，便于扫视区分
  const BOX_COLORS = [
    ['#2563eb', '#eef4ff'],
    ['#0f8a7e', '#e6f6f4'],
    ['#b45309', '#fdf4e6'],
    ['#7c3aed', '#f3eefe'],
    ['#be123c', '#fdeef1'],
    ['#475569', '#eef1f5'],
    ['#15803d', '#eaf6ee'],
    ['#0369a1', '#e8f4fc']
  ];
  function boxPalette(box, idx) {
    if (typeof idx === 'number' && idx >= 0) return BOX_COLORS[idx % BOX_COLORS.length];
    const s = String((box && box.id) || '');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return BOX_COLORS[h % BOX_COLORS.length];
  }

  function boxUrl(id) {
    return pageBase() + '?box=' + encodeURIComponent(id);
  }

  return {
    esc: esc,
    locParts: locParts,
    location: locationText,
    boxFolderCount: boxFolderCount,
    boxFileCount: boxFileCount,
    loadData: loadData,
    stats: stats,
    toast: toast,
    pageBase: pageBase,
    boxPalette: boxPalette,
    boxUrl: boxUrl
  };
})();
