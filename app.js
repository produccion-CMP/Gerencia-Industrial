'use strict';

const CFG = window.APP_CONFIG || {};
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const ROLES = ['lector', 'editor', 'gerente', 'admin'];
const ROL_TXT = { lector: 'Lector', editor: 'Editor', gerente: 'Gerente de producción', admin: 'Administrador' };
const EST_TXT = { good: 'Dentro de objetivo', warn: 'Atención', bad: 'Fuera de objetivo', none: 'Sin dato' };
const PAL = ['--p1', '--p2', '--p3', '--p4', '--p5', '--p6', '--p7', '--p8'];
const CAT_COLOR = { operativo: '--p1', entregado: '--p1', resuelta: '--p1', optimo: '--p1', 'no operativo': '--p2', 'en curso': '--p2', abierta: '--p2', excedido: '--p2', 'en calibracion': '--p3', pendiente: '--p3', 'esperando cierre supervisor': '--p3', 'en fabricacion': '--p4', programada: '--p4', irrecuperable: '--p5', 'no entregado': '--p5', otu: '--p5', oti: '--p1', ota: '--p3' };
const SECS_CONOCIDAS = ['produccion', 'matriceria', 'mantenimiento', 'abastecimiento', 'insumos'];

const SVGI = (p) => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>';
const ICON = {
  refresh: SVGI('<path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/>'),
  print: SVGI('<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>'),
  sol: SVGI('<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'),
  luna: SVGI('<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>'),
  tablero: SVGI('<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>'),
  ajustes: SVGI('<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>'),
  cerrar: SVGI('<path d="M18 6 6 18M6 6l12 12"/>'),
  prev: SVGI('<path d="m15 18-6-6 6-6"/>'),
  next: SVGI('<path d="m9 18 6-6-6-6"/>'),
  user: SVGI('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
  candado: SVGI('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  alerta: SVGI('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'),
  info: SVGI('<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'),
  vacio: SVGI('<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>'),
  mas: SVGI('<path d="M12 5v14M5 12h14"/>'),
  externo: SVGI('<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>'),
  play: SVGI('<path d="m6 4 14 8-14 8z"/>'),
  basura: SVGI('<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>'),
  lapiz: SVGI('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>'),
  fabrica: SVGI('<path d="M2 20V9l6 4V9l6 4V4h4l2 16z"/><path d="M6 20v-3M11 20v-3M16 20v-3"/>'),
  molde: SVGI('<rect x="3" y="3" width="18" height="18" rx="3"/><rect x="7" y="7" width="4" height="4" rx="1"/><rect x="13" y="7" width="4" height="4" rx="1"/><rect x="7" y="13" width="4" height="4" rx="1"/><rect x="13" y="13" width="4" height="4" rx="1"/>'),
  llave: SVGI('<path d="M14.7 6.3a4 4 0 0 0 5 5L21 13l-8 8-3-3 6.3-6.3a4 4 0 0 1-1.6-5.4z"/><path d="m3 21 6-6"/>'),
  camion: SVGI('<path d="M1 4h13v11H1z"/><path d="M14 8h4l4 4v3h-8z"/><circle cx="5.5" cy="18" r="2"/><circle cx="17.5" cy="18" r="2"/>'),
  caja: SVGI('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>'),
  rayo: SVGI('<path d="M13 2 3 14h9l-1 8 10-12h-9z"/>'),
  gota: SVGI('<path d="M12 2.7S5 10 5 14.5a7 7 0 0 0 14 0C19 10 12 2.7 12 2.7z"/>'),
  grafico: SVGI('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>'),
  engranaje: SVGI('<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>'),
  personas: SVGI('<circle cx="9" cy="7" r="4"/><path d="M2 21a7 7 0 0 1 14 0"/><path d="M16 3.1a4 4 0 0 1 0 7.8M22 21a7 7 0 0 0-5-6.7"/>'),
  fuego: SVGI('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3.3.6 1.4 1.6 2.8 2.5 2.8z"/>')
};
const ICONOS_SEC = ['fabrica', 'molde', 'llave', 'camion', 'caja', 'rayo', 'gota', 'grafico', 'engranaje', 'personas', 'fuego'];

const S = { ses: lsGet('gi_ses', null), pkg: null, mes: lsGet('gi_mes', null), filtro: null, cargando: 0, charts: [], cfg: null };

function lsGet(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
function lsDel(k) { try { localStorage.removeItem(k); } catch (e) { } }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function norm(s) { return String(s == null ? '' : s).normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase(); }
function nf(v, dec) { if (v === null || v === undefined || !isFinite(v)) return '—'; return Number(v).toLocaleString('es-AR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); }
function puede(rol) { return !!S.ses && ROLES.indexOf(S.ses.rol) >= ROLES.indexOf(rol); }
function mesTxt(ym, corto) { if (!ym) return '—'; const [y, m] = ym.split('-').map(Number); return corto ? MESES[m - 1].slice(0, 3) + ' ' + String(y).slice(2) : MESES[m - 1] + ' ' + y; }
function mesAdd(ym, n) { const [y, m] = ym.split('-').map(Number); const d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
function fechaTxt(f) { if (!f) return '—'; const p = f.slice(0, 10).split('-'); return p[2] + '/' + p[1] + '/' + p[0]; }
function hace(iso) {
  if (!iso) return '—';
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 90) return 'hace instantes';
  if (s < 3600) return 'hace ' + Math.round(s / 60) + ' min';
  if (s < 86400) return 'hace ' + Math.round(s / 3600) + ' h';
  return new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
}
function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
function secVars(id) { const k = SECS_CONOCIDAS.indexOf(id) >= 0 ? id : 'otro'; return '--sc:var(--sec-' + k + ');--sc-s:var(--sec-' + k + '-s)'; }
function icoSec(id) { const s = (S.pkg && S.pkg.secciones || []).find(x => x.id === id); return ICON[(s && s.icono) || 'grafico'] || ICON.grafico; }
function mini(svg) { return svg.replace('<svg', '<svg width="13" height="13"'); }

function loader(on) {
  S.cargando = Math.max(0, S.cargando + (on ? 1 : -1));
  $('#toploader').classList.toggle('on', S.cargando > 0);
  $('#btnRefrescar').classList.toggle('girando', S.cargando > 0);
}

async function api(accion, datos) {
  if (!CFG.SCRIPT_URL) throw Object.assign(new Error('Configurá SCRIPT_URL en config.js'), { config: true });
  loader(true);
  try {
    const r = await fetch(CFG.SCRIPT_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ accion: accion, datos: datos || {}, token: S.ses ? S.ses.token : null }) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    const j = await r.json();
    if (!j.ok) throw Object.assign(new Error(j.error), { servidor: true });
    return j.data;
  } finally { loader(false); }
}

function toast(msg, tipo, ms) {
  const t = document.createElement('div');
  t.className = 'toast ' + (tipo || '');
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('sale'); setTimeout(() => t.remove(), 320); }, ms || 3800);
}

function overlay(txt) {
  $('#overlay').classList.toggle('on', !!txt);
  if (txt) $('#overlayTxt').textContent = txt;
}

function red(estado, txt) {
  const e = $('#red');
  e.className = 'estado-red' + (estado === 'off' ? ' off' : estado === 'cache' ? ' cache' : '');
  e.querySelector('span').textContent = txt || (estado === 'off' ? 'Sin conexión' : estado === 'cache' ? 'Datos guardados' : 'En línea');
}

function splash(paso, txt) {
  const sp = $('#splash');
  if (!sp || sp.classList.contains('fuera')) return;
  $$('.splash-pasos span', sp).forEach((s, i) => s.classList.toggle('listo', i < paso));
  $('#splashBarra span').style.width = Math.min(100, paso * 20) + '%';
  if (txt) $('#splashTxt').textContent = txt;
}

function ocultarSplash() {
  const sp = $('#splash');
  if (!sp || sp.classList.contains('fuera')) return;
  splash(5, 'Listo');
  setTimeout(() => { sp.classList.add('fuera'); setTimeout(() => sp.remove(), 500); }, 200);
}

function setSesion(s) {
  S.ses = s;
  if (s) lsSet('gi_ses', s); else lsDel('gi_ses');
  pintarTop();
}

function aplicarTema(t) {
  if (t) document.documentElement.setAttribute('data-theme', t); else document.documentElement.removeAttribute('data-theme');
  const oscuro = t ? t === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  $('#btnTema').innerHTML = oscuro ? ICON.sol : ICON.luna;
}

function pintarTop() {
  const rutas = [['#/', 'Tablero', ICON.tablero]];
  if (S.ses) rutas.push(['#/ajustes', 'Ajustes', ICON.ajustes]);
  const h = location.hash || '#/';
  const html = rutas.map(r => '<a href="' + r[0] + '" class="' + ((r[0] === '#/' ? !/^#\/(ajustes|ingresar)/.test(h) : h.indexOf(r[0]) === 0) ? 'on' : '') + '">' + r[2] + '<span>' + r[1] + '</span></a>').join('');
  $('#nav').innerHTML = html;
  $('#bnav').innerHTML = html;
  $('#btnSesion').innerHTML = S.ses ? ICON.user + '<span>' + esc(String(S.ses.nombre).split(' ')[0]) + '</span>' : ICON.candado + '<span>Ingresar</span>';
  $('#btnRefrescar').title = puede('editor') ? 'Recalcular: volver a leer todas las bases' : 'Actualizar';
}

async function cargar(forzar, conSplash) {
  try {
    if (conSplash) splash(1, forzar ? 'Releyendo las bases de datos…' : 'Conectando con las bases…');
    const t1 = setTimeout(() => splash(2, 'Leyendo indicadores…'), 900);
    const t2 = setTimeout(() => splash(3, 'Calculando el mes…'), 2200);
    const p = await api('datos', { forzar: !!forzar });
    clearTimeout(t1); clearTimeout(t2);
    if (conSplash) splash(4, 'Armando el tablero…');
    if (p.sesion && S.ses) setSesion(Object.assign({}, S.ses, { rol: p.sesion.rol, nombre: p.sesion.nombre, email: p.sesion.email }));
    if (S.ses && !p.sesion) setSesion(null);
    S.pkg = p;
    lsSet('gi_pkg', p);
    red('ok');
    render();
    ocultarSplash();
    return true;
  } catch (e) {
    ocultarSplash();
    if (e.config) { red('off', 'Sin configurar'); render(); return false; }
    if (/Sesi[oó]n requerida|Permiso/.test(e.message)) {
      setSesion(null);
      S.pkg = null;
      lsDel('gi_pkg');
      if (!/^#\/ingresar/.test(location.hash)) location.hash = '#/ingresar'; else render();
      return false;
    }
    red(S.pkg ? 'cache' : 'off');
    toast((S.pkg ? 'No se pudo actualizar; se muestran los últimos datos guardados. ' : 'No se pudo conectar. ') + e.message, 'warn', 7000);
    if (!S.pkg) render();
    return false;
  }
}

function render() {
  pintarTop();
  destruirCharts();
  const h = location.hash || '#/';
  if (/^#\/ingresar/.test(h)) return vLogin();
  if (/^#\/ajustes/.test(h)) {
    if (!S.ses) { location.hash = '#/ingresar'; return; }
    return vAjustes(h.split('/')[2] || '');
  }
  if (!CFG.SCRIPT_URL && !S.pkg) return vSinConfig();
  if (!S.pkg || !S.pkg.kpis) return vEsqueleto();
  vTablero();
}

function destruirCharts() { S.charts.forEach(c => { try { c.destroy(); } catch (e) { } }); S.charts = []; }
function kpis() { return (S.pkg && S.pkg.kpis) || []; }
function serie(id) { return (S.pkg && S.pkg.datos.series[id]) || {}; }
function kpi(id) { return kpis().find(o => o.id === id); }

function valorMes(o, ym) {
  const s = serie(o.id);
  if (s[ym]) return Object.assign({ ym: ym }, s[ym]);
  if (o.foto || o.manual) return null;
  const D = S.pkg.datos;
  if (ym !== D.ymHoy && ym !== mesAdd(D.ymHoy, -1)) return null;
  for (let i = 1; i <= 2; i++) {
    const m = mesAdd(ym, -i);
    if (s[m]) return Object.assign({ ym: m, atrasado: true }, s[m]);
  }
  return null;
}

function estado(v, o) {
  if (v === null || v === undefined || !isFinite(v) || o.meta === null || o.meta === undefined) return 'none';
  const tol = Math.abs(o.meta) * (o.tol || 0) / 100;
  if (o.sentido === '<=') return v <= o.meta ? 'good' : v <= o.meta + tol ? 'warn' : 'bad';
  return v >= o.meta ? 'good' : v >= o.meta - tol ? 'warn' : 'bad';
}
function estTxt(e, o) { return e === 'none' && (o.meta === null || o.meta === undefined) ? 'Informativo' : EST_TXT[e]; }

function cumplimiento(v, o) {
  if (v === null || !isFinite(v) || o.meta === null || o.meta === undefined) return null;
  if (o.sentido === '<=') return v <= 0 ? 150 : o.meta / v * 100;
  if (o.meta === 0) return v >= 0 ? 150 : 0;
  return v / o.meta * 100;
}

function metaTxt(o) {
  if (o.meta === null || o.meta === undefined) return 'Sin meta';
  return (o.sentido === '<=' ? '≤ ' : '≥ ') + nf(o.meta, o.dec) + (o.unidad === '%' ? '%' : '');
}

function barraMeta(o, r) {
  const est = r ? estado(r.v, o) : 'none';
  const c = r ? cumplimiento(r.v, o) : null;
  if (o.meta === null || o.meta === undefined) return '<div class="meta sin e-none" title="Sin meta configurada"><div class="meta-pct">—<small>meta</small></div><div class="meta-track"></div><div class="meta-lbl">Sin<br>meta</div></div>';
  const h = c === null ? 0 : Math.max(2, Math.min(150, c)) / 150 * 100;
  return '<div class="meta e-' + est + '" title="Cumplimiento de la meta"><div class="meta-pct">' + (c === null ? '—' : nf(c) + '%') + '<small>cumpl.</small></div><div class="meta-track"><div class="meta-fill" data-h="' + h.toFixed(1) + '"></div><i class="meta-line" style="bottom:66.67%"></i></div><div class="meta-lbl">Meta<br>' + esc(metaTxt(o)) + '</div></div>';
}

function delta(o, r) {
  if (!r) return '';
  if (r.ym === S.pkg.datos.ymHoy && /^\s*[A-Za-z_][A-Za-z0-9_]*\s*(\*\s*[A-Za-z0-9_.]+\s*)?$/.test(o.formula || '') && !o.foto) return '';
  const p = serie(o.id)[mesAdd(r.ym, -1)];
  if (!p || !isFinite(p.v) || !isFinite(r.v)) return '';
  const pct = o.unidad === '%';
  const d = pct ? r.v - p.v : (p.v ? (r.v - p.v) / Math.abs(p.v) * 100 : null);
  if (d === null) return '';
  const mejora = Math.abs(d) < 0.05 ? null : (o.sentido === '<=' ? d < 0 : d > 0);
  const cls = mejora === null ? '' : mejora ? 'good' : 'bad';
  const fl = Math.abs(d) < 0.05 ? '=' : d > 0 ? '▲' : '▼';
  return '<span class="delta ' + cls + '" title="vs. ' + mesTxt(mesAdd(r.ym, -1)) + ': ' + nf(p.v, o.dec) + '">' + fl + ' ' + nf(Math.abs(d), 1) + (pct ? ' pts' : '%') + '</span>';
}

function sparkline(o, ym) {
  const s = serie(o.id);
  const ms = [];
  for (let i = 11; i >= 0; i--) ms.push(mesAdd(ym, -i));
  const vals = ms.map(m => s[m] && isFinite(s[m].v) ? s[m].v : null);
  const nums = vals.filter(v => v !== null);
  if (nums.length < 2) return '<div class="kc-spark"></div>';
  const all = nums.concat(o.meta !== null && o.meta !== undefined ? [o.meta] : []);
  const mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
  const rg = mx - mn || 1;
  const W = 240, H = 48;
  const x = i => (i / 11) * W;
  const y = v => H - 4 - ((v - mn) / rg) * (H - 10);
  let d = '', first = null, last = null;
  vals.forEach((v, i) => { if (v === null) return; d += (d ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1); if (first === null) first = i; last = i; });
  const a = d + 'L' + x(last).toFixed(1) + ' ' + H + 'L' + x(first).toFixed(1) + ' ' + H + 'Z';
  const gid = 'g' + o.id;
  const meta = o.meta !== null && o.meta !== undefined ? '<line x1="0" x2="' + W + '" y1="' + y(o.meta).toFixed(1) + '" y2="' + y(o.meta).toFixed(1) + '"/>' : '';
  return '<div class="kc-spark"><svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="var(--sc)" stop-opacity=".35"/><stop offset="1" stop-color="var(--sc)" stop-opacity="0"/></linearGradient></defs>' + meta + '<path class="a" fill="url(#' + gid + ')" d="' + a + '"/><path class="l" vector-effect="non-scaling-stroke" d="' + d + '"/><circle vector-effect="non-scaling-stroke" cx="' + x(last).toFixed(1) + '" cy="' + y(vals[last]).toFixed(1) + '" r="3.5"/></svg></div>';
}

function colorCat(k, i) { const c = CAT_COLOR[norm(k)]; return 'var(' + (c || PAL[i % PAL.length]) + ')'; }

function notaError(o) {
  const D = S.pkg.datos;
  if (D.errores && D.errores[o.id]) return '<div class="kc-nota err">' + mini(ICON.alerta) + 'Fórmula: ' + esc(D.errores[o.id]) + '</div>';
  const ev = D.errVars || {};
  const malas = (o.refs || []).filter(id => ev[id]);
  return malas.length ? '<div class="kc-nota err" title="' + esc(malas.map(id => id + ': ' + ev[id]).join(' · ')) + '">' + mini(ICON.alerta) + 'Fuente con error: ' + esc(ev[malas[0]]) + '</div>' : '';
}

function periodoTxt(o, r, ym) {
  if (!r) return mesTxt(ym);
  if (r.atrasado) return mesTxt(r.ym) + ' · último mes con dato';
  if (o.foto && r.ym === S.pkg.datos.ymHoy) return 'Al ' + fechaTxt(S.pkg.datos.generado.slice(0, 10));
  return mesTxt(r.ym);
}

function cabCard(o, r, ym, extra) {
  return '<div class="kc-top"><span class="kc-ico">' + icoSec(o.sec) + '</span><div style="flex:1;min-width:0"><div class="kc-tit">' + esc(o.nombre) + '</div><div class="kc-per">' + periodoTxt(o, r, ym) + '</div></div>' + (extra || '') + '</div>';
}

function valHTML(v, o) { return '<span data-cnt="' + (isFinite(v) ? v : '') + '" data-dec="' + o.dec + '">' + nf(v, o.dec) + '</span><small>' + esc(o.unidad) + '</small>'; }

function esVacante(o) { return !!o.manual && !Object.keys(serie(o.id)).length; }

function cardVacante(o, i) {
  return '<article class="kc vacante e-none" data-id="' + o.id + '" style="--i:' + i + ';' + secVars(o.sec) + '"><div class="kc-main">' + cabCard(o, null, S.mes, '<span class="tag t-none">Vacante</span>') +
    '<div class="vac">' + ICON.vacio + '<span>Sin base de datos todavía.<br>Carga manual: <b>' + esc(o.manualTxt || '') + '</b></span></div>' +
    (puede('editor') ? '<div><button class="btn sm no-print" data-cargar="' + o.manual + '">' + ICON.mas + 'Cargar valor</button></div>' : '') + '</div>' + barraMeta(o, null) + '</article>';
}

function cardNum(o, ym, i) {
  if (esVacante(o)) return cardVacante(o, i);
  const r = valorMes(o, ym);
  const est = r ? estado(r.v, o) : 'none';
  const val = r ? valHTML(r.v, o) : '<span class="muted" style="font-size:1.15rem;font-weight:700">Sin datos</span>';
  const prev = r && serie(o.id)[mesAdd(r.ym, -1)];
  return '<article class="kc e-' + est + '" data-id="' + o.id + '" data-est="' + est + '" style="--i:' + i + ';' + secVars(o.sec) + '"><div class="kc-main">' + cabCard(o, r, ym, r && r.manual ? '<span class="tag t-info">Manual</span>' : '') +
    '<div class="kc-val">' + val + '</div><div class="kc-fila"><span class="estado">' + estTxt(est, o) + '</span>' + delta(o, r) + (prev ? '<span class="kc-ref">' + mesTxt(mesAdd(r.ym, -1)).split(' ')[0].slice(0, 3) + ': ' + nf(prev.v, o.dec) + '</span>' : '') + '</div>' +
    (!r && o.manual && puede('editor') ? '<div style="margin-top:10px"><button class="btn sm no-print" data-cargar="' + o.manual + '">' + ICON.mas + 'Cargar ' + esc(o.manualTxt || 'valor') + '</button></div>' : '') + (r && r.atrasado ? '<div class="kc-nota">' + mini(ICON.info) + 'Aún sin dato de ' + mesTxt(ym).split(' ')[0].toLowerCase() + '</div>' : '') + notaError(o) +
    (r ? sparkline(o, r.ym) : '<div class="kc-spark"></div>') + '</div>' + barraMeta(o, r) + '</article>';
}

function bloqueDist(c, total) {
  const ks = Object.keys(c || {}).sort((a, b) => c[b] - c[a]);
  const tot = total || ks.reduce((s, k) => s + c[k], 0) || 1;
  const mx = Math.max.apply(null, ks.map(k => c[k]).concat([1]));
  return '<div class="seg-barra">' + ks.map((k, i) => '<span data-w="' + (c[k] / tot * 100).toFixed(2) + '" style="background:' + colorCat(k, i) + '" title="' + esc(k) + ': ' + c[k] + '"></span>').join('') + '</div><div class="cats">' +
    ks.map((k, i) => '<div class="cat"><i style="background:' + colorCat(k, i) + '"></i><span title="' + esc(k) + '">' + esc(k) + '</span><div class="cb"><div data-w="' + (c[k] / mx * 100).toFixed(1) + '" style="background:' + colorCat(k, i) + '"></div></div><b>' + nf(c[k]) + '</b><small>' + nf(c[k] / tot * 100) + '%</small></div>').join('') + '</div>';
}

function cardDist(o, ym, i) {
  const r = valorMes(o, ym);
  const est = r ? estado(r.v, o) : 'none';
  if (!r || !r.c) {
    return '<article class="kc ancha e-none" data-id="' + o.id + '" style="--i:' + i + ';' + secVars(o.sec) + '"><div class="kc-main">' + cabCard(o, r, ym) + '<p class="kc-ref" style="margin-top:16px">' + (o.foto ? 'Sin registro para este mes: el estado se guarda desde que la app empieza a calcularlo.' : 'Sin datos para este mes.') + '</p>' + notaError(o) + '</div>' + barraMeta(o, null) + '</article>';
  }
  const tot = Object.keys(r.c).reduce((s, k) => s + r.c[k], 0);
  const v = (S.pkg.variables || {})[o.variableDist] || {};
  return '<article class="kc ancha e-' + est + '" data-id="' + o.id + '" data-est="' + est + '" style="--i:' + i + ';' + secVars(o.sec) + '"><div class="kc-main">' + cabCard(o, r, ym, '<span class="tag t-none">' + nf(tot) + ' ' + esc(v.unidad || '') + '</span>') +
    '<div class="kc-fila" style="margin-top:12px"><span class="kc-val" style="margin:0;font-size:1.9rem">' + valHTML(r.v, o) + '</span><span class="estado">' + estTxt(est, o) + '</span>' + delta(o, r) + '</div>' +
    bloqueDist(r.c, tot) + notaError(o) + '</div>' + barraMeta(o, r) + '</article>';
}

function cardPar(o, h, ym, i) {
  const r = valorMes(o, ym);
  const est = r ? estado(r.v, o) : 'none';
  const bloque = (k) => {
    const x = valorMes(k, ym);
    if (x) return '<div><div class="kc-val">' + valHTML(x.v, k) + '</div><p class="kc-ref">' + esc(k.nombre) + (k.foto || k.manual ? ' · ' + periodoTxt(k, x, ym).toLowerCase() : '') + '</p>' + (k !== o && k.meta !== null ? '<span class="estado e-' + estado(x.v, k) + '">' + esc(metaTxt(k)) + '</span>' : '') + (k === o ? '<div class="kc-fila" style="margin-top:6px">' + delta(k, x) + '</div>' : '') + notaError(k) + '</div>';
    if (esVacante(k)) return '<div><div class="kc-val" style="font-size:1.25rem;color:var(--faint)">Vacante</div><p class="kc-ref">' + esc(k.nombre) + ' · carga manual</p>' + (puede('editor') ? '<button class="btn sm no-print" style="margin-top:8px" data-cargar="' + k.manual + '">' + ICON.mas + 'Cargar</button>' : '') + '</div>';
    return '<div><div class="kc-val" style="font-size:1.25rem;color:var(--faint)">Sin datos</div><p class="kc-ref">' + esc(k.nombre) + '</p>' + notaError(k) + '</div>';
  };
  return '<article class="kc ancha e-' + est + '" data-id="' + o.id + '" style="--i:' + i + ';' + secVars(o.sec) + ';min-height:0"><div class="kc-main">' + cabCard(o, r, ym) + '<div class="split">' + bloque(o) + (h ? bloque(h) : '') + '</div></div>' + barraMeta(o, r) + '</article>';
}

function selectorMes() {
  const ms = S.pkg.datos.meses.slice().reverse();
  return '<div class="mes-sel no-print"><button class="btn ghost" id="mPrev" aria-label="Mes anterior">' + ICON.prev + '</button><select id="mSel" aria-label="Mes">' + ms.map(m => '<option value="' + m + '"' + (m === S.mes ? ' selected' : '') + '>' + mesTxt(m) + '</option>').join('') + '</select><button class="btn ghost" id="mNext" aria-label="Mes siguiente">' + ICON.next + '</button></div>';
}

function vTablero() {
  const D = S.pkg.datos;
  if (!S.mes || D.meses.indexOf(S.mes) < 0) S.mes = D.ymHoy;
  const ym = S.mes;
  const obs = kpis().filter(o => o.visible).sort((a, b) => a.orden - b.orden);
  const vis = {};
  obs.forEach(o => { vis[o.id] = o; });
  const esHijoVisible = (o) => obs.some(p => p.par === o.id);
  const cont = { good: 0, warn: 0, bad: 0, none: 0 };
  obs.forEach(o => {
    if (esHijoVisible(o) || o.meta === null || o.meta === undefined) return;
    const r = valorMes(o, ym);
    cont[r ? estado(r.v, o) : 'none']++;
  });
  const tot = cont.good + cont.warn + cont.bad + cont.none || 1;
  let i = 0;
  const secs = (S.pkg.secciones || []).map((sc, si) => {
    const delSec = obs.filter(o => o.sec === sc.id);
    const nums = [], anchas = [];
    delSec.forEach(o => {
      if (esHijoVisible(o)) return;
      if (S.filtro) { const r = valorMes(o, ym); const e = r ? estado(r.v, o) : 'none'; if (e !== S.filtro || o.meta === null) return; }
      if (o.tipo === 'distribucion') anchas.push(cardDist(o, ym, i++));
      else if (o.par && vis[o.par]) anchas.push(cardPar(o, vis[o.par], ym, i++));
      else nums.push(cardNum(o, ym, i++));
    });
    if (!nums.length && !anchas.length) return '';
    return '<section style="' + secVars(sc.id) + '"><div class="sectionhead"><div class="sh-izq"><span class="sh-ico">' + (ICON[sc.icono] || ICON.grafico) + '</span><div><div class="sh-num">' + String(si + 1).padStart(2, '0') + '</div><h2>' + esc(sc.nombre) + '</h2><p class="sub">' + esc(sc.subtitulo || '') + '</p></div></div>' +
      (sc.link ? '<a class="sh-link no-print" href="' + esc(sc.link) + '" target="_blank" rel="noopener" title="Abrir ' + esc(sc.nombre) + '">' + ICON.externo + '<span>Abrir app</span></a>' : '') + '</div>' +
      (nums.length ? '<div class="grid stagger">' + nums.join('') + '</div>' : '') + (anchas.length ? '<div class="grid anchas stagger"' + (nums.length ? ' style="margin-top:16px"' : '') + '>' + anchas.join('') + '</div>' : '') + '</section>';
  }).join('');
  const errsVar = Object.keys(D.errVars || {}).filter(k => k[0] !== '_');
  const chip = (k, txt, color) => '<button class="chip' + (S.filtro === k ? ' on' : '') + '" data-filtro="' + k + '"><i style="background:var(--' + color + ')"></i><b>' + cont[k] + '</b>' + txt + '</button>';
  $('#app').innerHTML = '<div class="vista"><div class="hero"><div class="hero-fila"><div><div class="eyebrow">' + esc(CFG.EMPRESA || 'Grupo MP · Cerámica Marcos Paz') + '</div><h1>Gerencia Industrial</h1><p class="sub">Indicadores principales de gestión · ' + esc(CFG.PLANTA || 'Planta Cevil') + '</p></div>' +
    '<div class="periodo">' + selectorMes() + '<div class="badges">' + (ym === D.ymHoy ? '<span class="tag t-acc">Mes en curso' + (D.ultimoDia ? ' · al ' + fechaTxt(D.ultimoDia) : '') + '</span>' : '<span class="tag t-none">Mes cerrado</span>') + '<span class="tag t-none" title="' + esc(new Date(D.generado).toLocaleString('es-AR')) + '">Calculado ' + hace(D.generado) + '</span></div></div></div>' +
    '<div class="pulso"><div class="pulso-barra">' + ['good', 'warn', 'bad', 'none'].map(k => '<span data-w="' + (cont[k] / tot * 100).toFixed(2) + '" style="background:var(--' + k + '-fill)"></span>').join('') + '</div><div class="pulso-leyenda no-print">' +
    chip('good', 'en objetivo', 'good-fill') + chip('warn', 'en atención', 'warn-fill') + chip('bad', 'fuera de objetivo', 'bad-fill') + (cont.none ? chip('none', 'sin dato', 'none-fill') : '') + (S.filtro ? '<button class="btn sm ghost" data-filtro="">Ver todos</button>' : '') + '</div></div></div>' +
    (errsVar.length && puede('admin') ? '<div class="alert warn no-print">' + ICON.alerta + '<div><b>Variables con error:</b> ' + errsVar.map(k => '<code>' + esc(k) + '</code> ' + esc(D.errVars[k])).join(' · ') + ' — <a href="#/ajustes/variables">revisar</a></div></div>' : '') +
    (secs || '<div class="alert info">' + ICON.info + '<div>No hay indicadores para mostrar con este filtro.</div></div>') +
    '<footer class="foot"><span>' + mesTxt(ym) + ' · Click en un indicador para ver tendencia y detalle · ← → cambia de mes</span><span>La barra vertical muestra el % de cumplimiento; la línea marca la meta (100%).</span></footer></div>';
  animar($('#app'));
  $('#mSel').onchange = e => cambiarMes(e.target.value);
  $('#mPrev').onclick = () => cambiarMes(mesAdd(S.mes, -1));
  $('#mNext').onclick = () => cambiarMes(mesAdd(S.mes, 1));
  $('#mNext').disabled = S.mes >= D.ymHoy;
  $('#mPrev').disabled = S.mes <= D.meses[0];
  $('#app').onclick = e => {
    const c = e.target.closest('[data-cargar]');
    if (c) { e.stopPropagation(); return dlgCarga(c.dataset.cargar); }
    if (e.target.closest('.sh-link')) return;
    const f = e.target.closest('[data-filtro]');
    if (f) { S.filtro = f.dataset.filtro && S.filtro !== f.dataset.filtro ? f.dataset.filtro : null; return vTablero(); }
    const k = e.target.closest('.kc');
    if (k) abrirDetalle(k.dataset.id);
  };
}

function cambiarMes(m) {
  const D = S.pkg.datos;
  if (m < D.meses[0] || m > D.ymHoy) return;
  S.mes = m;
  lsSet('gi_mes', m === D.ymHoy ? null : m);
  vTablero();
}

function animar(raiz) {
  requestAnimationFrame(() => requestAnimationFrame(() => {
    $$('[data-w]', raiz).forEach(b => { b.style.width = b.dataset.w + '%'; });
    $$('.meta-fill[data-h]', raiz).forEach(b => { b.style.height = b.dataset.h + '%'; });
  }));
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('[data-cnt]', raiz).forEach(el => {
    const fin = parseFloat(el.dataset.cnt);
    const dec = Number(el.dataset.dec) || 0;
    if (!isFinite(fin)) return;
    const t0 = performance.now();
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / 850);
      el.textContent = nf(fin * (1 - Math.pow(1 - k, 3)), dec);
      if (k < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  });
}

function cargarChart() {
  if (window.Chart) return Promise.resolve();
  if (cargarChart.p) return cargarChart.p;
  cargarChart.p = new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';
    s.onload = ok;
    s.onerror = () => { cargarChart.p = null; mal(new Error('No se pudo cargar Chart.js')); };
    document.head.appendChild(s);
  });
  return cargarChart.p;
}

function abrirDlg(eyebrow, titulo, html, n) {
  const p = n === 2 ? 'dlg2' : 'dlg';
  $('#' + p + 'Eyebrow').textContent = eyebrow;
  $('#' + p + 'Titulo').textContent = titulo;
  $('#' + p + 'Cuerpo').innerHTML = html;
  const d = $('#' + p);
  if (!d.open) d.showModal();
  $('#' + p + 'Cuerpo').scrollTop = 0;
  return $('#' + p + 'Cuerpo');
}

function nomVar(id) { const v = (S.pkg.variables || {})[id]; return v ? v.nombre + (v.unidad ? ' (' + v.unidad + ')' : '') : id; }

async function abrirDetalle(id) {
  const o = kpi(id);
  if (!o) return;
  const D = S.pkg.datos;
  const s = serie(id);
  const ym = S.mes;
  const r = valorMes(o, ym);
  const sec = ((S.pkg.secciones || []).find(x => x.id === o.sec) || {}).nombre || '';
  const ref = r ? r.ym : ym;
  const ms = D.meses.filter(m => m <= ref).slice(-13);
  const anio = s[mesAdd(ref, -12)];
  const ult12 = D.meses.filter(m => m <= ref).slice(-12).map(m => s[m]).filter(x => x && isFinite(x.v)).map(x => x.v);
  const prom = ult12.length ? ult12.reduce((a, b) => a + b, 0) / ult12.length : null;
  const mejor = ult12.length ? (o.sentido === '<=' ? Math.min.apply(null, ult12) : Math.max.apply(null, ult12)) : null;
  const est = r ? estado(r.v, o) : 'none';
  const c = r ? cumplimiento(r.v, o) : null;
  let html = '<div class="kv"><div class="e-' + est + '"><small>' + mesTxt(ref) + '</small><b style="color:var(--ink)">' + (r ? nf(r.v, o.dec) + ' ' + esc(o.unidad) : '—') + '</b></div><div><small>Meta</small><b>' + esc(metaTxt(o)) + '</b></div><div class="e-' + est + '"><small>Cumplimiento</small><b style="color:var(--ink)">' + (c === null ? '—' : nf(c, 1) + '%') + '</b></div><div><small>Mes anterior</small><b>' + (s[mesAdd(ref, -1)] ? nf(s[mesAdd(ref, -1)].v, o.dec) : '—') + '</b></div><div><small>Mismo mes año ant.</small><b>' + (anio ? nf(anio.v, o.dec) : '—') + '</b></div><div><small>Promedio 12 meses</small><b>' + nf(prom, o.dec) + '</b></div><div><small>Mejor 12 meses</small><b>' + nf(mejor, o.dec) + '</b></div></div>';
  html += '<div class="chart"><canvas id="chDet"></canvas></div>';
  if (r && r.d && Object.keys(r.d).length) html += '<h3 style="margin:6px 0 4px">Variables de ' + mesTxt(ref).toLowerCase() + '</h3><div class="kv">' + Object.keys(r.d).map(k => '<div><small>' + esc(nomVar(k)) + '</small><b>' + nf(r.d[k], r.d[k] % 1 ? 2 : 0) + '</b></div>').join('') + '</div>';
  if (r && r.c) html += '<h3 style="margin:10px 0 6px">Distribución</h3><div class="card" style="box-shadow:none">' + bloqueDist(r.c) + '</div>';
  const dias = D.dias && D.dias[id];
  if (dias && Object.keys(dias).some(d => d.slice(0, 7) === ym)) html += '<h3 style="margin:16px 0 4px">Día por día · ' + mesTxt(ym).toLowerCase() + '</h3><div class="chart" style="height:220px"><canvas id="chDia"></canvas></div>';
  html += '<h3 style="margin:16px 0 6px">Historial mensual</h3><div class="tw max"><table><thead><tr><th>Mes</th><th class="n">Valor</th><th class="n">Cumpl.</th><th>Estado</th><th>Variables</th></tr></thead><tbody>' +
    D.meses.slice().reverse().filter(m => s[m]).map(m => { const e = estado(s[m].v, o); const cc = cumplimiento(s[m].v, o); return '<tr><td>' + mesTxt(m) + '</td><td class="n"><b>' + nf(s[m].v, o.dec) + '</b> ' + esc(o.unidad) + '</td><td class="n">' + (cc === null ? '—' : nf(cc) + '%') + '</td><td><span class="estado e-' + e + '">' + estTxt(e, o) + '</span></td><td class="muted">' + (s[m].c ? Object.keys(s[m].c).map(k => esc(k) + ': ' + s[m].c[k]).join(' · ') : Object.keys(s[m].d || {}).map(k => esc(k) + ' ' + nf(s[m].d[k], s[m].d[k] % 1 ? 1 : 0)).join(' · ')) + '</td></tr>'; }).join('') + '</tbody></table></div>';
  html += '<div class="calc"><b>Fórmula:</b> <code>' + esc(o.formula) + '</code>' + (o.descripcion ? '<br><b>Qué mide:</b> ' + esc(o.descripcion) : '') + '<br><b>Variables:</b> ' + (o.refs || []).map(x => '<code>' + esc(x) + '</code> ' + esc(nomVar(x))).join(' · ') + (o.meta !== null ? '<br><b>Zona de atención:</b> hasta ' + nf(o.tol) + '% ' + (o.sentido === '<=' ? 'por encima' : 'por debajo') + ' de la meta' : '') + (o.actPor ? '<br><b>Actualizado por</b> ' + esc(o.actPor) + (o.act ? ' el ' + new Date(o.act).toLocaleDateString('es-AR') : '') : '') + '</div>';
  html += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px" class="no-print">' + (o.manual && puede('editor') ? '<button class="btn" data-cargar="' + o.manual + '">' + ICON.mas + 'Cargar valor</button>' : '') + (puede('admin') ? '<button class="btn" data-editar="' + o.id + '">' + ICON.lapiz + 'Editar indicador</button>' : puede('gerente') ? '<a class="btn" href="#/ajustes/indicadores">' + ICON.ajustes + 'Editar objetivo</a>' : '') + '</div>';
  const cuerpo = abrirDlg(sec, o.nombre, html);
  cuerpo.onclick = async e => {
    const c2 = e.target.closest('[data-cargar]');
    if (c2) { $('#dlg').close(); return dlgCarga(c2.dataset.cargar); }
    const ed = e.target.closest('[data-editar]');
    if (ed) { $('#dlg').close(); await asegurarCfg(); return dlgKpi(kpiCfg(ed.dataset.editar)); }
    if (e.target.closest('a[href^="#/"]')) $('#dlg').close();
  };
  animar(cuerpo);
  try { await cargarChart(); } catch (e) { $('#chDet').parentNode.innerHTML = '<div class="alert warn">' + esc(e.message) + '</div>'; return; }
  if (!$('#dlg').open || !$('#chDet')) return;
  destruirCharts();
  Chart.defaults.font.family = cssVar('--font');
  Chart.defaults.color = cssVar('--muted');
  const fillE = (v) => cssVar('--' + estado(v, o) + '-fill');
  const grid = { color: cssVar('--line') };
  let ds;
  if (o.tipo === 'distribucion') {
    const cats = {};
    ms.forEach(m => { if (s[m] && s[m].c) Object.keys(s[m].c).forEach(k => { cats[k] = (cats[k] || 0) + s[m].c[k]; }); });
    const ks = Object.keys(cats).sort((a, b) => cats[b] - cats[a]);
    ds = ks.map((k, i) => ({ type: 'bar', label: k, data: ms.map(m => s[m] && s[m].c ? (s[m].c[k] || 0) : null), backgroundColor: cssVar((CAT_COLOR[norm(k)] || PAL[i % PAL.length])), borderRadius: 6, stack: 'c', yAxisID: 'y' }));
    ds.push({ type: 'line', label: o.nombre + ' (%)', data: ms.map(m => s[m] ? s[m].v : null), borderColor: cssVar('--text'), backgroundColor: cssVar('--text'), pointRadius: 3, tension: .35, yAxisID: 'y2' });
    S.charts.push(new Chart($('#chDet'), { data: { labels: ms.map(m => mesTxt(m, true)), datasets: ds }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { boxWidth: 12 } } }, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, grid: grid }, y2: { position: 'right', min: 0, max: 100, grid: { display: false } } } } }));
  } else {
    const vals = ms.map(m => s[m] ? s[m].v : null);
    ds = [{ type: 'bar', label: o.nombre, data: vals, backgroundColor: vals.map(v => v === null ? 'transparent' : fillE(v)), borderRadius: 10, maxBarThickness: 40 }];
    if (o.meta !== null) ds.push({ type: 'line', label: 'Meta', data: ms.map(() => o.meta), borderColor: cssVar('--text'), borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0, fill: false });
    S.charts.push(new Chart($('#chDet'), { data: { labels: ms.map(m => mesTxt(m, true)), datasets: ds }, options: { responsive: true, maintainAspectRatio: false, animation: { duration: 800, easing: 'easeOutQuart' }, plugins: { legend: { display: o.meta !== null, labels: { boxWidth: 12 } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + nf(c.parsed.y, o.dec) + ' ' + o.unidad } } }, scales: { x: { grid: { display: false } }, y: { grid: grid, beginAtZero: o.unidad === '%' } } } }));
  }
  if ($('#chDia')) {
    const [y, m] = ym.split('-').map(Number);
    const nd = new Date(y, m, 0).getDate();
    const fs = Array.from({ length: nd }, (_, k) => ym + '-' + String(k + 1).padStart(2, '0'));
    const v = fs.map(f => dias[f] === undefined ? null : dias[f]);
    const ds2 = [{ type: 'bar', label: o.unidad, data: v, backgroundColor: v.map(x => x === null ? 'transparent' : fillE(x)), borderRadius: 5 }];
    if (o.meta !== null) ds2.push({ type: 'line', label: 'Meta', data: fs.map(() => o.meta), borderColor: cssVar('--text'), borderDash: [6, 5], borderWidth: 1.2, pointRadius: 0 });
    S.charts.push(new Chart($('#chDia'), { data: { labels: fs.map(f => Number(f.slice(8))), datasets: ds2 }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { title: cc => fechaTxt(fs[cc[0].dataIndex]), label: cc => nf(cc.parsed.y, o.dec) + ' ' + o.unidad } } }, scales: { x: { grid: { display: false } }, y: { grid: grid } } } }));
  }
}

function dlgCarga(varId) {
  const vars = S.pkg.variables || {};
  const manuales = Object.keys(vars).filter(k => vars[k].modo === 'manual');
  if (!manuales.length) return toast('No hay variables de carga manual', 'warn');
  const sel = manuales.indexOf(varId) >= 0 ? varId : manuales[0];
  const ym = S.pkg ? S.mes || S.pkg.datos.ymHoy : '';
  const cuerpo = abrirDlg('Carga manual', 'Cargar valor', '<form id="fCarga" class="form"><label class="f full">Variable<select name="variable">' + manuales.map(k => '<option value="' + k + '"' + (k === sel ? ' selected' : '') + '>' + esc(vars[k].nombre) + (vars[k].unidad ? ' (' + esc(vars[k].unidad) + ')' : '') + '</option>').join('') + '</select></label><label class="f">Mes<input type="month" name="periodo" required value="' + ym + '"></label><label class="f">Valor<input type="number" name="valor" step="any" min="0" required inputmode="decimal"></label><label class="f full">Observación<input name="obs" maxlength="200" placeholder="Opcional: origen del dato"></label><div class="full" style="display:flex;justify-content:flex-end;gap:8px"><button type="button" class="btn" data-cerrar>Cancelar</button><button class="btn pri">Guardar</button></div></form><p class="sub" style="margin-top:10px">Si ya hay un valor para ese mes, se reemplaza. Los indicadores que usan la variable se recalculan al instante.</p>');
  cuerpo.querySelector('[data-cerrar]').onclick = () => $('#dlg').close();
  $('#fCarga').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    overlay('Guardando…');
    try { aplicarPaquete(await api('guardarCarga', f)); $('#dlg').close(); toast('Valor guardado', 'ok'); render(); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
  };
}

function aplicarPaquete(p) {
  if (!p || !p.datos) return;
  p.sesion = S.pkg && S.pkg.sesion;
  S.pkg = p;
  lsSet('gi_pkg', p);
}

function vEsqueleto() {
  const t = '<div class="card" style="min-height:210px;display:grid;grid-template-columns:1fr 50px;gap:14px"><div><div class="skel" style="height:14px;width:60%"></div><div class="skel" style="height:11px;width:35%;margin-top:8px"></div><div class="skel" style="height:40px;width:55%;margin-top:22px"></div><div class="skel" style="height:46px;width:100%;margin-top:22px"></div></div><div class="skel" style="height:100%;border-radius:12px"></div></div>';
  $('#app').innerHTML = '<div class="vista"><div class="hero"><div class="skel" style="height:12px;width:220px"></div><div class="skel" style="height:30px;width:300px;margin-top:10px"></div><div class="skel" style="height:12px;width:100%;margin-top:26px"></div></div>' + [4, 3, 3].map(n => '<div class="sectionhead"><div class="skel" style="height:40px;width:240px"></div></div><div class="grid">' + t.repeat(n) + '</div>').join('') + '</div>';
}

function vSinConfig() {
  $('#app').innerHTML = '<div class="login-wrap vista"><div class="card login"><span class="logo-tile"><img src="logo-cmp.png" alt=""></span><h2>Falta conectar el servidor</h2><p class="sub">Completá <b>SCRIPT_URL</b> en <code>config.js</code> con la URL <code>/exec</code> de Apps Script.</p></div></div>';
}

function vLogin() {
  $('#app').innerHTML = '<div class="login-wrap vista"><form class="card login" id="fLogin"><span class="logo-tile"><img src="logo-cmp.png" alt=""></span><div><div class="eyebrow">' + esc(CFG.EMPRESA || 'Grupo MP') + '</div><h2 style="margin-top:4px">Ingresar al tablero</h2></div><label class="f">Usuario<input name="usuario" autocomplete="username" required autofocus></label><label class="f">Clave<input name="clave" type="password" autocomplete="current-password" required></label><button class="btn pri">Ingresar</button><button type="button" class="link" id="olvide">¿Olvidaste tu clave?</button></form></div>';
  $('#olvide').onclick = () => dlgOlvide($('#fLogin').usuario.value.trim());
  $('#fLogin').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const b = e.target.querySelector('.btn.pri');
    b.disabled = true;
    try {
      const s = await api('login', f);
      setSesion(s);
      toast('Bienvenido/a, ' + String(s.nombre).split(' ')[0], 'ok');
      location.hash = '#/';
      if (!S.pkg) vEsqueleto();
      await cargar(false, false);
    } catch (er) { toast(er.message, 'bad'); b.disabled = false; }
  };
}

function dlgOlvide(usuario) {
  const paso1 = () => {
    const c = abrirDlg('Recuperar acceso', '¿Olvidaste tu clave?', '<form id="fO1" class="form"><p class="sub full">Te enviamos un código de 6 dígitos al correo registrado. Si tu usuario no tiene correo, el código llega al administrador.</p><label class="f full">Usuario<input name="usuario" required value="' + esc(usuario || '') + '" autocomplete="username"></label><div class="full" style="display:flex;justify-content:flex-end;gap:8px"><button type="button" class="btn" data-cerrar>Cancelar</button><button class="btn pri">Enviar código</button></div></form>');
    c.querySelector('[data-cerrar]').onclick = () => $('#dlg').close();
    $('#fO1').onsubmit = async e => {
      e.preventDefault();
      const u = e.target.usuario.value.trim();
      overlay('Enviando código…');
      try { const r = await api('olvideClave', { usuario: u }); paso2(u, r); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    };
  };
  const paso2 = (u, r) => {
    const c = abrirDlg('Recuperar acceso', 'Ingresá el código', '<form id="fO2" class="form"><div class="alert good full">' + ICON.info + '<div>Código enviado a <b>' + esc(r.destino) + '</b>' + (r.aAdmin ? ' (administrador)' : '') + '. Vence en 15 minutos.</div></div><label class="f">Código<input name="codigo" required inputmode="numeric" maxlength="6" pattern="[0-9]{6}" autocomplete="one-time-code"></label><label class="f">Clave nueva<input name="nueva" type="password" minlength="6" required autocomplete="new-password"></label><div class="full" style="display:flex;justify-content:space-between;gap:8px"><button type="button" class="link" data-reenviar>Pedir otro código</button><button class="btn pri">Cambiar clave</button></div></form>');
    c.querySelector('[data-reenviar]').onclick = paso1;
    $('#fO2').onsubmit = async e => {
      e.preventDefault();
      overlay('Verificando…');
      try { await api('restablecerClave', { usuario: u, codigo: e.target.codigo.value, nueva: e.target.nueva.value }); $('#dlg').close(); toast('Clave actualizada. Ya podés ingresar', 'ok', 5000); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    };
  };
  paso1();
}

async function asegurarCfg(forzar) {
  if (S.cfg && !forzar) return S.cfg;
  S.cfg = await api('config');
  return S.cfg;
}
function kpiCfg(id) { return S.cfg.kpis.find(k => k.id === id); }
function aplicarRespuestaCfg(r) { if (r && r.config) S.cfg = r.config; if (r && r.paquete) aplicarPaquete(r.paquete); }

function vAjustes(tab) {
  const tabs = [];
  if (puede('gerente')) tabs.push(['indicadores', 'Indicadores']);
  if (puede('admin')) tabs.push(['variables', 'Variables'], ['fuentes', 'Bases de datos'], ['constantes', 'Constantes'], ['secciones', 'Secciones']);
  if (puede('editor')) tabs.push(['cargas', 'Cargas manuales']);
  if (puede('admin')) tabs.push(['usuarios', 'Usuarios'], ['parametros', 'Parámetros'], ['registro', 'Registro']);
  tabs.push(['cuenta', 'Mi cuenta']);
  if (!tabs.some(t => t[0] === tab)) tab = tabs[0][0];
  $('#app').innerHTML = '<div class="vista"><div class="cab-vista"><div><div class="eyebrow">' + esc(ROL_TXT[S.ses.rol] || S.ses.rol) + ' · ' + esc(S.ses.nombre) + '</div><h1>Ajustes</h1></div><div class="seg" id="segAj">' + tabs.map(t => '<button data-t="' + t[0] + '" class="' + (t[0] === tab ? 'on' : '') + '">' + t[1] + '</button>').join('') + '</div></div><div id="aj"><div class="skel" style="height:260px"></div></div></div>';
  $('#segAj').onclick = e => { const b = e.target.closest('button'); if (b) location.hash = '#/ajustes/' + b.dataset.t; };
  const c = $('#aj');
  const f = { indicadores: ajIndicadores, variables: ajVariables, fuentes: ajFuentes, constantes: ajConstantes, secciones: ajSecciones, cargas: ajCargas, usuarios: ajUsuarios, parametros: ajParametros, registro: ajRegistro, cuenta: ajCuenta }[tab];
  Promise.resolve(f(c)).catch(e => { c.innerHTML = '<div class="alert bad">' + ICON.alerta + '<div>' + esc(e.message) + '</div></div>'; });
}

async function ajIndicadores(c) {
  const cfg = await asegurarCfg();
  const admin = puede('admin');
  const filas = cfg.secciones.map(sc => {
    const os = cfg.kpis.filter(o => o.sec === sc.id).sort((a, b) => a.orden - b.orden);
    if (!os.length) return '';
    return '<tr class="sec"><td colspan="8">' + esc(sc.nombre) + '</td></tr>' + os.map(o => '<tr data-id="' + o.id + '"><td><label class="switch" title="Mostrar en el tablero"><input type="checkbox" name="visible"' + (o.visible ? ' checked' : '') + '><span></span></label></td><td><input name="nombre" value="' + esc(o.nombre) + '" maxlength="90" style="min-width:230px"><div class="sub mono" style="font-size:.7rem;margin-top:3px">' + esc(o.formula) + '</div></td><td class="muted">' + esc(o.unidad) + '</td><td><select name="sentido" style="width:auto"><option value=">="' + (o.sentido === '>=' ? ' selected' : '') + '>≥ mayor es mejor</option><option value="<="' + (o.sentido === '<=' ? ' selected' : '') + '>≤ menor es mejor</option></select></td><td><input name="meta" type="number" step="any" value="' + (o.meta === null ? '' : o.meta) + '" placeholder="Sin meta" style="width:110px"></td><td><input name="tol" type="number" step="any" min="0" max="100" value="' + o.tol + '" style="width:76px"></td><td><input name="orden" type="number" step="1" value="' + o.orden + '" style="width:70px"></td><td>' + (admin ? '<button class="btn sm" data-ed="' + o.id + '">' + ICON.lapiz + 'Editar</button>' : '') + '</td></tr>').join('');
  }).join('');
  c.innerHTML = '<div class="cab-vista" style="margin-bottom:10px"><div class="alert info" style="margin:0;flex:1">' + ICON.info + '<div><b>Meta</b>: valor objetivo. <b>Tolerancia</b>: margen de «atención» en % de la meta. Sin meta, el indicador es informativo. El interruptor lo muestra u oculta.' + (admin ? ' Con <b>Editar</b> cambiás fórmula, sección, tipo y unidad.' : '') + '</div></div>' + (admin ? '<button class="btn pri" id="nuevoK">' + ICON.mas + 'Nuevo indicador</button>' : '') + '</div><div class="tw"><table class="edit"><thead><tr><th>Ver</th><th>Indicador · fórmula</th><th>Unidad</th><th>Sentido</th><th>Meta</th><th>Tol. %</th><th>Orden</th><th></th></tr></thead><tbody id="tObj">' + filas + '</tbody></table></div><div class="barra-acc"><div class="card"><span class="sub" id="objCambios">Sin cambios</span><button class="btn" id="objDesh">Deshacer</button><button class="btn pri" id="objGuardar" disabled>Guardar</button></div></div>';
  const leer = () => $$('#tObj tr[data-id]').map(tr => ({ id: tr.dataset.id, visible: $('[name=visible]', tr).checked, nombre: $('[name=nombre]', tr).value.trim(), sentido: $('[name=sentido]', tr).value, meta: $('[name=meta]', tr).value === '' ? null : Number($('[name=meta]', tr).value), tol: Number($('[name=tol]', tr).value) || 0, orden: Number($('[name=orden]', tr).value) || 0 }));
  const difiere = (a, o) => a.visible !== o.visible || a.nombre !== o.nombre || a.sentido !== o.sentido || a.meta !== o.meta || a.tol !== o.tol || a.orden !== o.orden;
  const marcar = () => {
    let n = 0;
    leer().forEach(a => { const d = difiere(a, kpiCfg(a.id)); if (d) n++; $('#tObj tr[data-id="' + a.id + '"]').classList.toggle('modif', d); });
    $('#objCambios').textContent = n ? n + ' indicador(es) modificados' : 'Sin cambios';
    $('#objGuardar').disabled = !n;
  };
  $('#tObj').oninput = marcar;
  $('#tObj').onchange = marcar;
  $('#tObj').onclick = e => { const b = e.target.closest('[data-ed]'); if (b) dlgKpi(kpiCfg(b.dataset.ed)); };
  if ($('#nuevoK')) $('#nuevoK').onclick = () => dlgKpi(null);
  $('#objDesh').onclick = () => ajIndicadores(c);
  $('#objGuardar').onclick = async () => {
    const items = leer().filter(a => difiere(a, kpiCfg(a.id)));
    if (items.some(a => !a.nombre)) return toast('Todos los indicadores necesitan nombre', 'bad');
    overlay('Guardando…');
    try { aplicarPaquete(await api('guardarKpisLote', { items: items })); await asegurarCfg(true); toast('Indicadores guardados', 'ok'); ajIndicadores(c); } catch (e) { toast(e.message, 'bad'); } finally { overlay(null); }
  };
}

function chipsIds(cfg) {
  return '<div class="ids" id="idsF">' + cfg.variables.map(v => '<button type="button" data-ins="' + v.id + '" title="' + esc(v.nombre + ' · ' + (v.unidad || '')) + '">' + esc(v.id) + '</button>').join('') + cfg.constantes.map(v => '<button type="button" class="c" data-ins="' + v.id + '" title="Constante: ' + esc(v.nombre + ' = ' + v.valor) + '">' + esc(v.id) + '</button>').join('') + cfg.kpis.map(v => '<button type="button" class="k" data-ins="' + v.id + '" title="Indicador: ' + esc(v.nombre) + '">' + esc(v.id) + '</button>').join('') + ['cat(var, "Texto")', 'total(var)', 'n(x)', 'min(a, b)', 'max(a, b)', 'abs(x)'].map(f => '<button type="button" data-ins="' + esc(f) + '" style="font-style:italic">' + esc(f) + '</button>').join('') + '</div>';
}

function dlgKpi(o) {
  const cfg = S.cfg;
  const nuevo = !o;
  o = o || { id: '', nombre: '', sec: (cfg.secciones[0] || {}).id, unidad: '', formula: '', tipo: 'numero', variableDist: '', par: '', dec: 1, sentido: '>=', meta: null, tol: 10, visible: true, orden: 999, descripcion: '' };
  const catVars = cfg.variables.filter(v => norm(v.agregacion) === 'categorias');
  const c = abrirDlg(nuevo ? 'Nuevo indicador' : 'Editar indicador', nuevo ? 'Nuevo indicador' : o.nombre,
    '<form id="fK" class="form"><label class="f"><span>Id <em>(para fórmulas)</em></span><input name="id" required class="mono" value="' + esc(o.id) + '" pattern="[A-Za-z_][A-Za-z0-9_]{1,40}"></label><label class="f dos">Nombre<input name="nombre" required value="' + esc(o.nombre) + '"></label><label class="f">Sección<select name="sec">' + cfg.secciones.map(s => '<option value="' + s.id + '"' + (s.id === o.sec ? ' selected' : '') + '>' + esc(s.nombre) + '</option>').join('') + '</select></label>' +
    '<label class="f full"><span>Fórmula <em>· click en un id para insertarlo · gris = variable · azul = constante · naranja = indicador</em></span><textarea name="formula" rows="2" class="mono" required>' + esc(o.formula) + '</textarea></label><div class="full">' + chipsIds(cfg) + '</div>' +
    '<div class="full" style="display:flex;gap:8px;align-items:center"><button type="button" class="btn sm" id="probarK">' + ICON.play + 'Probar fórmula</button><span class="sub" id="resK"></span></div>' +
    '<label class="f">Unidad<input name="unidad" value="' + esc(o.unidad) + '" placeholder="tn/turno, %, kg/tn…"></label><label class="f">Decimales<input name="dec" type="number" min="0" max="4" value="' + o.dec + '"></label><label class="f">Tipo de tarjeta<select name="tipo"><option value="numero"' + (o.tipo !== 'distribucion' ? ' selected' : '') + '>Número</option><option value="distribucion"' + (o.tipo === 'distribucion' ? ' selected' : '') + '>Distribución por categorías</option></select></label><label class="f">Variable de categorías<select name="variableDist"><option value="">—</option>' + catVars.map(v => '<option value="' + v.id + '"' + (v.id === o.variableDist ? ' selected' : '') + '>' + esc(v.nombre) + '</option>').join('') + '</select></label>' +
    '<label class="f">Sentido<select name="sentido"><option value=">="' + (o.sentido === '>=' ? ' selected' : '') + '>≥ mayor es mejor</option><option value="<="' + (o.sentido === '<=' ? ' selected' : '') + '>≤ menor es mejor</option></select></label><label class="f">Meta<input name="meta" type="number" step="any" value="' + (o.meta === null ? '' : o.meta) + '" placeholder="Sin meta"></label><label class="f">Tolerancia %<input name="tol" type="number" step="any" min="0" max="100" value="' + o.tol + '"></label><label class="f">Orden<input name="orden" type="number" value="' + o.orden + '"></label>' +
    '<label class="f"><span>Indicador par <em>(misma tarjeta)</em></span><select name="par"><option value="">—</option>' + cfg.kpis.filter(k => k.id !== o.id).map(k => '<option value="' + k.id + '"' + (k.id === o.par ? ' selected' : '') + '>' + esc(k.nombre) + '</option>').join('') + '</select></label><label class="f" style="flex-direction:row;align-items:center;gap:10px"><span class="switch"><input type="checkbox" name="visible"' + (o.visible ? ' checked' : '') + '><span></span></span>Visible</label>' +
    '<label class="f full">Descripción<input name="descripcion" value="' + esc(o.descripcion || '') + '" placeholder="Qué mide y cómo se calcula"></label>' +
    '<div class="full" style="display:flex;justify-content:space-between;gap:8px">' + (nuevo ? '<span></span>' : '<button type="button" class="btn dan" id="borrarK">' + ICON.basura + 'Borrar</button>') + '<div style="display:flex;gap:8px"><button type="button" class="btn" data-cerrar>Cancelar</button><button class="btn pri">Guardar</button></div></div></form>');
  const ta = c.querySelector('textarea[name=formula]');
  c.querySelector('#idsF').onclick = e => {
    const b = e.target.closest('[data-ins]');
    if (!b) return;
    const t = b.dataset.ins;
    const ini = ta.selectionStart, fin = ta.selectionEnd;
    ta.value = ta.value.slice(0, ini) + t + ta.value.slice(fin);
    ta.focus();
    ta.selectionStart = ta.selectionEnd = ini + t.length;
  };
  c.querySelector('[data-cerrar]').onclick = () => $('#dlg').close();
  $('#probarK').onclick = async () => {
    $('#resK').textContent = 'Calculando…';
    try {
      const r = await api('probarFormula', { formula: ta.value });
      $('#resK').innerHTML = r.valores.map(x => mesTxt(x[0], true) + ': <b>' + (x[1] === null ? '—' : nf(x[1], Number(c.querySelector('[name=dec]').value) || 0)) + '</b>').join(' · ');
    } catch (e) { $('#resK').innerHTML = '<span style="color:var(--bad)">' + esc(e.message) + '</span>'; }
  };
  if ($('#borrarK')) $('#borrarK').onclick = async () => {
    if (!confirm('¿Borrar el indicador «' + o.nombre + '»? No se borran datos de las planillas de origen.')) return;
    overlay('Borrando…');
    try { aplicarRespuestaCfg(await api('borrarFila', { tabla: 'kpis', id: o.id })); $('#dlg').close(); toast('Indicador borrado', 'ok'); render(); } catch (e) { toast(e.message, 'bad'); } finally { overlay(null); }
  };
  $('#fK').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    f.visible = e.target.visible.checked;
    overlay('Guardando y recalculando…');
    try { aplicarRespuestaCfg(await api('guardarKpi', { fila: f, idOriginal: nuevo ? null : o.id })); $('#dlg').close(); toast('Indicador guardado', 'ok'); render(); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
  };
}

async function ajVariables(c) {
  const cfg = await asegurarCfg();
  const errs = (S.pkg && S.pkg.datos.errVars) || {};
  const fn = id => (cfg.fuentes.find(f => f.id === id) || {}).nombre || id || '—';
  c.innerHTML = '<div class="cab-vista" style="margin-bottom:10px"><div class="alert info" style="margin:0;flex:1">' + ICON.info + '<div>Cada <b>variable</b> lee una columna de una hoja y la resume por mes (suma, conteo, promedio, categorías…). Los indicadores combinan variables y constantes con fórmulas.</div></div><button class="btn pri" id="nuevaV">' + ICON.mas + 'Nueva variable</button></div><div class="tw"><table><thead><tr><th>Id</th><th>Nombre</th><th>Base · hoja</th><th>Modo</th><th>Cálculo</th><th>Columna</th><th>Filtros</th><th>Estado</th><th></th></tr></thead><tbody>' +
    cfg.variables.map((v, i) => '<tr><td class="mono"><b>' + esc(v.id) + '</b></td><td>' + esc(v.nombre) + (v.unidad ? ' <span class="muted">(' + esc(v.unidad) + ')</span>' : '') + '</td><td>' + (v.modo === 'manual' ? '<span class="tag t-info">Carga manual</span>' : esc(fn(v.fuente)) + ' · <b>' + esc(v.hoja) + '</b>') + '</td><td>' + esc(v.modo) + '</td><td>' + esc(v.agregacion || '') + '</td><td class="mono">' + esc(v.colValor || v.colCategoria || '') + '</td><td class="mono" style="max-width:200px;overflow:hidden;text-overflow:ellipsis">' + esc(v.filtros || '') + '</td><td>' + (errs[v.id] ? '<span class="tag t-bad" title="' + esc(errs[v.id]) + '">Error</span>' : '<span class="tag t-good">OK</span>') + '</td><td><button class="btn sm" data-i="' + i + '">' + ICON.lapiz + 'Editar</button></td></tr>').join('') + '</tbody></table></div>';
  $('#nuevaV').onclick = () => dlgVariable(null);
  c.onclick = e => { const b = e.target.closest('button[data-i]'); if (b) dlgVariable(cfg.variables[Number(b.dataset.i)]); };
}

function dlgVariable(v) {
  const cfg = S.cfg;
  const nuevo = !v;
  v = v || { id: '', nombre: '', fuente: (cfg.fuentes[0] || {}).id, hoja: '', filaEnc: 1, modo: 'fecha', colFecha: '', colMes: '', agregacion: 'suma', colValor: '', colCategoria: '', filtros: '', transformacion: 'numero', unidad: '', descripcion: '' };
  const op = (arr, val) => arr.map(x => '<option value="' + x[0] + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + x[1] + '</option>').join('');
  const err = S.pkg && S.pkg.datos.errVars && S.pkg.datos.errVars[v.id];
  const c = abrirDlg(nuevo ? 'Nueva variable' : 'Editar variable', nuevo ? 'Nueva variable' : v.nombre,
    (err ? '<div class="alert bad">' + ICON.alerta + '<div>' + esc(err) + '</div></div>' : '') +
    '<form id="fV" class="form"><label class="f"><span>Id <em>(para fórmulas)</em></span><input name="id" required class="mono" value="' + esc(v.id) + '" pattern="[A-Za-z_][A-Za-z0-9_]{1,40}"></label><label class="f dos">Nombre<input name="nombre" required value="' + esc(v.nombre) + '"></label><label class="f">Unidad<input name="unidad" value="' + esc(v.unidad) + '"></label>' +
    '<label class="f">Modo<select name="modo">' + op([['fecha', 'Por fecha (una columna)'], ['aniomes', 'Por año + mes (dos columnas)'], ['foto', 'Foto actual (sin fecha)'], ['api', 'API (JSON)'], ['manual', 'Carga manual']], v.modo) + '</select></label>' +
    '<label class="f dos" data-m="hoja api">Base de datos<select name="fuente">' + cfg.fuentes.map(f => '<option value="' + f.id + '"' + (f.id === v.fuente ? ' selected' : '') + '>' + esc(f.nombre) + '</option>').join('') + '</select></label>' +
    '<label class="f" data-m="hoja api"><span data-api-txt>Hoja</span><input name="hoja" list="dlHojas" value="' + esc(v.hoja) + '"><datalist id="dlHojas"></datalist></label>' +
    '<label class="f" data-m="hoja">Fila de encabezados<input name="filaEnc" type="number" min="1" value="' + (v.filaEnc || 1) + '"></label>' +
    '<div class="full" data-m="hoja"><button type="button" class="btn sm" id="verCols">' + ICON.tablero + 'Ver hojas y columnas</button> <span class="sub">Click en una columna para completar el campo activo.</span><div class="cols" id="colsV" style="margin-top:8px"></div></div>' +
    '<label class="f" data-m="fecha aniomes"><span>Columna fecha <em>' + (v.modo === 'aniomes' ? '(año)' : '') + '</em></span><input name="colFecha" class="mono colsel" value="' + esc(v.colFecha) + '" placeholder="B o «Fecha»"></label>' +
    '<label class="f" data-m="aniomes">Columna mes<input name="colMes" class="mono colsel" value="' + esc(v.colMes) + '"></label>' +
    '<label class="f" data-m="hoja">Cálculo<select name="agregacion">' + op([['suma', 'Suma'], ['conteo', 'Conteo de filas'], ['promedio', 'Promedio'], ['max', 'Máximo'], ['min', 'Mínimo'], ['ultimo', 'Último valor'], ['distintos', 'Distintos (día + columna)'], ['categorias', 'Categorías (conteo por valor)']], v.agregacion) + '</select></label>' +
    '<label class="f" data-m="hoja api"><span data-api-val>Columna valor</span><input name="colValor" class="mono colsel" value="' + esc(v.colValor) + '" placeholder="F o «Tn Producción»"></label>' +
    '<label class="f" data-m="hoja">Columna categoría / clave<input name="colCategoria" class="mono colsel" value="' + esc(v.colCategoria) + '"></label>' +
    '<label class="f" data-m="hoja">Transformación<select name="transformacion">' + op([['numero', 'Número'], ['duracion', 'Duración h:mm → horas'], ['texto', 'Texto'], ['izq:3', 'Primeros 3 caracteres']], v.transformacion || 'numero') + '</select></label>' +
    '<label class="f full" data-m="hoja"><span>Filtros <em>· separados por ; · operadores = != ~ (contiene) !~ ^ (empieza) &gt; &lt; &gt;= &lt;= · vacío tras = / != significa celda vacía · ej.: H~TIERRA; G~CEVIL; F&gt;0</em></span><input name="filtros" class="mono colsel" value="' + esc(v.filtros) + '"></label>' +
    '<label class="f full">Descripción<input name="descripcion" value="' + esc(v.descripcion || '') + '"></label>' +
    '<div class="full" style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button type="button" class="btn sm" id="probarV">' + ICON.play + 'Probar lectura</button><span class="sub" id="resV"></span></div>' +
    '<div class="full" style="display:flex;justify-content:space-between;gap:8px">' + (nuevo ? '<span></span>' : '<button type="button" class="btn dan" id="borrarV">' + ICON.basura + 'Borrar</button>') + '<div style="display:flex;gap:8px"><button type="button" class="btn" data-cerrar>Cancelar</button><button class="btn pri">Guardar</button></div></div></form>');
  const f = $('#fV');
  let activo = f.colValor;
  $$('.colsel', f).forEach(i => i.addEventListener('focus', () => { activo = i; }));
  const visibilidad = () => {
    const m = f.modo.value;
    const tipoF = (cfg.fuentes.find(x => x.id === f.fuente.value) || {}).tipo;
    const clase = m === 'manual' ? 'manual' : (m === 'api' || tipoF === 'api') ? 'api' : 'hoja';
    $$('[data-m]', f).forEach(el => {
      const ks = el.dataset.m.split(' ');
      let ver = ks.indexOf(clase) >= 0 || ks.indexOf(m) >= 0;
      if (ks.indexOf('fecha') >= 0 || ks.indexOf('aniomes') >= 0) ver = (ks.indexOf(m) >= 0) && clase === 'hoja';
      el.style.display = ver ? '' : 'none';
    });
    $('[data-api-txt]', f).textContent = clase === 'api' ? 'Acción de la API' : 'Hoja';
    $('[data-api-val]', f).textContent = clase === 'api' ? 'Clave del JSON' : 'Columna valor';
  };
  f.modo.onchange = visibilidad;
  f.fuente.onchange = visibilidad;
  visibilidad();
  c.querySelector('[data-cerrar]').onclick = () => $('#dlg').close();
  $('#verCols').onclick = async () => {
    $('#colsV').innerHTML = '<div class="skel" style="height:60px;grid-column:1/-1"></div>';
    try {
      const r = await api('estructura', { fuente: f.fuente.value, hoja: f.hoja.value, fila: f.filaEnc.value });
      $('#dlHojas').innerHTML = r.hojas.map(h => '<option value="' + esc(h) + '">').join('');
      $('#colsV').innerHTML = r.columnas.length ? r.columnas.filter(x => x.titulo || x.ejemplo).map(x => '<button type="button" data-l="' + x.letra + '"><b>' + x.letra + '</b>' + esc(x.titulo || '(sin título)') + '<small>' + esc(x.ejemplo) + '</small></button>').join('') : '<p class="sub" style="grid-column:1/-1">Hojas: ' + r.hojas.map(esc).join(' · ') + (f.hoja.value ? ' — la hoja «' + esc(f.hoja.value) + '» no existe o está vacía' : ' — elegí una hoja') + '</p>';
    } catch (e) { $('#colsV').innerHTML = '<div class="alert bad" style="grid-column:1/-1">' + esc(e.message) + '</div>'; }
  };
  $('#colsV').onclick = e => {
    const b = e.target.closest('[data-l]');
    if (!b || !activo) return;
    if (activo.name === 'filtros') activo.value = (activo.value ? activo.value.replace(/;?\s*$/, '; ') : '') + b.dataset.l;
    else activo.value = b.dataset.l;
    activo.focus();
  };
  $('#probarV').onclick = async () => {
    $('#resV').textContent = 'Leyendo la planilla…';
    try {
      const r = await api('probarVariable', { variable: Object.fromEntries(new FormData(f)) });
      $('#resV').innerHTML = r.valores.map(x => mesTxt(x[0], true) + ': <b>' + (x[1] === null ? '—' : nf(x[1], x[1] % 1 ? 2 : 0)) + '</b>' + (x[2] ? ' <span class="muted">(' + Object.keys(x[2]).slice(0, 4).map(k => esc(k) + ' ' + x[2][k]).join(', ') + ')</span>' : '')).join(' · ');
    } catch (e) { $('#resV').innerHTML = '<span style="color:var(--bad)">' + esc(e.message) + '</span>'; }
  };
  if ($('#borrarV')) $('#borrarV').onclick = async () => {
    if (!confirm('¿Borrar la variable «' + v.nombre + '»?')) return;
    overlay('Borrando…');
    try { aplicarRespuestaCfg(await api('borrarFila', { tabla: 'variables', id: v.id })); $('#dlg').close(); toast('Variable borrada', 'ok'); render(); } catch (e) { toast(e.message, 'bad'); } finally { overlay(null); }
  };
  f.onsubmit = async e => {
    e.preventDefault();
    overlay('Guardando y releyendo la base…');
    try { aplicarRespuestaCfg(await api('guardarFila', { tabla: 'variables', fila: Object.fromEntries(new FormData(f)), idOriginal: nuevo ? null : v.id })); $('#dlg').close(); toast('Variable guardada', 'ok'); render(); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
  };
}

async function ajTablaSimple(c, tabla, titulo, ayuda, cols, extra) {
  const cfg = await asegurarCfg();
  const filas = cfg[tabla];
  const celda = (col, val) => {
    if (col.tipo === 'select') return '<select name="' + col.k + '">' + col.op.map(x => '<option value="' + x[0] + '"' + (String(x[0]) === String(val) ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select>';
    return '<input name="' + col.k + '" value="' + esc(val === undefined || val === null ? '' : val) + '"' + (col.mono ? ' class="mono"' : '') + ' style="min-width:' + (col.w || 120) + 'px"' + (col.ph ? ' placeholder="' + esc(col.ph) + '"' : '') + '>';
  };
  const filaHTML = (r, nueva) => '<tr data-orig="' + esc(nueva ? '' : r.id) + '">' + cols.map(col => '<td>' + celda(col, r[col.k]) + '</td>').join('') + '<td style="white-space:nowrap">' + (extra ? extra(r) : '') + '<button class="btn sm pri" data-g>Guardar</button> <button class="btn sm dan" data-b' + (nueva ? ' disabled' : '') + '>' + ICON.basura + '</button></td></tr>';
  c.innerHTML = '<div class="cab-vista" style="margin-bottom:10px"><div><h2>' + titulo + '</h2><p class="sub">' + ayuda + '</p></div><button class="btn pri" id="nuevaF">' + ICON.mas + 'Agregar</button></div><div class="tw"><table class="edit"><thead><tr>' + cols.map(x => '<th>' + x.l + '</th>').join('') + '<th></th></tr></thead><tbody id="tS">' + filas.map(r => filaHTML(r, false)).join('') + '</tbody></table></div><div id="resS"></div>';
  $('#nuevaF').onclick = () => { $('#tS').insertAdjacentHTML('beforeend', filaHTML({}, true)); $('#tS tr:last-child input').focus(); };
  $('#tS').onclick = async e => {
    const tr = e.target.closest('tr');
    if (!tr) return;
    const orig = tr.dataset.orig || null;
    if (e.target.closest('[data-g]')) {
      const fila = {};
      $$('input,select', tr).forEach(i => { fila[i.name] = i.value; });
      overlay('Guardando…');
      try { aplicarRespuestaCfg(await api('guardarFila', { tabla: tabla, fila: fila, idOriginal: orig })); toast('Guardado', 'ok'); ajTablaSimple(c, tabla, titulo, ayuda, cols, extra); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    } else if (e.target.closest('[data-b]') && orig) {
      if (!confirm('¿Borrar «' + orig + '»?')) return;
      overlay('Borrando…');
      try { aplicarRespuestaCfg(await api('borrarFila', { tabla: tabla, id: orig })); toast('Borrado', 'ok'); ajTablaSimple(c, tabla, titulo, ayuda, cols, extra); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    } else if (e.target.closest('[data-probar]') && orig) {
      $('#resS').innerHTML = '<div class="skel" style="height:40px;margin-top:10px"></div>';
      try { const r = await api('estructura', { fuente: orig }); $('#resS').innerHTML = '<div class="alert good">' + ICON.info + '<div>Conexión correcta con <b>' + esc(orig) + '</b>. Hojas: ' + (r.hojas.length ? r.hojas.map(esc).join(' · ') : '(API)') + '</div></div>'; } catch (er) { $('#resS').innerHTML = '<div class="alert bad">' + ICON.alerta + '<div>' + esc(er.message) + '</div></div>'; }
    }
  };
}

function ajFuentes(c) {
  return ajTablaSimple(c, 'fuentes', 'Bases de datos', 'Link de cada planilla de Google (o URL /exec de una API). Las variables eligen la base, la hoja y las columnas. La cuenta que implementó el script debe tener acceso de lectura.', [
    { k: 'id', l: 'Id', mono: true, w: 110 }, { k: 'nombre', l: 'Nombre', w: 220 }, { k: 'tipo', l: 'Tipo', tipo: 'select', op: [['hoja', 'Planilla'], ['api', 'API']] }, { k: 'url', l: 'Link', w: 380, ph: 'https://docs.google.com/spreadsheets/d/…' }, { k: 'notas', l: 'Notas', w: 160 }
  ], r => r.id ? '<button class="btn sm" data-probar>' + ICON.play + 'Probar</button> ' : '');
}

function ajConstantes(c) {
  return ajTablaSimple(c, 'constantes', 'Constantes', 'Valores fijos que se usan en las fórmulas (factores de conversión, capacidades, etc.). Vacío = el indicador que la usa queda sin valor.', [
    { k: 'id', l: 'Id', mono: true, w: 150 }, { k: 'nombre', l: 'Nombre', w: 220 }, { k: 'valor', l: 'Valor', w: 90 }, { k: 'unidad', l: 'Unidad', w: 80 }, { k: 'descripcion', l: 'Descripción', w: 260 }
  ]);
}

function ajSecciones(c) {
  return ajTablaSimple(c, 'secciones', 'Secciones', 'Grupos del tablero. El link agrega un botón «Abrir app» junto al título.', [
    { k: 'id', l: 'Id', mono: true, w: 120 }, { k: 'nombre', l: 'Nombre', w: 180 }, { k: 'subtitulo', l: 'Subtítulo', w: 240 }, { k: 'orden', l: 'Orden', w: 60 }, { k: 'icono', l: 'Ícono', tipo: 'select', op: ICONOS_SEC.map(x => [x, x]) }, { k: 'link', l: 'Link', w: 280, ph: 'https://…' }
  ]);
}

async function ajCargas(c) {
  c.innerHTML = '<div class="card"><div class="cab-vista" style="margin:0 0 12px"><div><h2>Cargas manuales</h2><p class="sub">Variables sin base propia (horas-hombre, plan preventivo, stock en cantera…).</p></div><button class="btn pri" id="nuevaCarga">' + ICON.mas + 'Nueva carga</button></div><div id="lCargas"><div class="skel" style="height:120px"></div></div></div>';
  $('#nuevaCarga').onclick = () => dlgCarga(null);
  const l = await api('cargas');
  $('#lCargas').innerHTML = l.length ? '<div class="tw max"><table><thead><tr><th>Variable</th><th>Mes</th><th class="n">Valor</th><th>Observación</th><th>Usuario</th><th>Fecha</th><th></th></tr></thead><tbody>' + l.sort((a, b) => a.periodo < b.periodo ? 1 : -1).map(x => '<tr><td>' + esc(nomVar(x.variable)) + '</td><td>' + mesTxt(x.periodo) + '</td><td class="n">' + nf(x.valor, 2) + '</td><td class="wrap">' + esc(x.obs) + '</td><td>' + esc(x.usuario) + '</td><td>' + (x.fecha ? new Date(x.fecha).toLocaleDateString('es-AR') : '') + '</td><td><button class="btn sm dan" data-k="' + x.variable + '" data-p="' + x.periodo + '">Borrar</button></td></tr>').join('') + '</tbody></table></div>' : '<p class="sub">Todavía no hay cargas.</p>';
  $('#lCargas').onclick = async e => {
    const b = e.target.closest('button[data-k]');
    if (!b || !confirm('¿Borrar la carga de ' + nomVar(b.dataset.k) + ' · ' + mesTxt(b.dataset.p) + '?')) return;
    overlay('Borrando…');
    try { aplicarPaquete(await api('borrarCarga', { variable: b.dataset.k, periodo: b.dataset.p })); toast('Carga borrada', 'ok'); ajCargas(c); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
  };
}

async function ajUsuarios(c) {
  c.innerHTML = '<div class="card"><div class="cab-vista" style="margin:0 0 12px"><div><h2>Usuarios</h2><p class="sub">Lector: ve el tablero · Editor: cargas manuales y recálculo · Gerente de producción: objetivos y visibilidad · Administrador: todo, incluidas fórmulas y bases.</p></div><button class="btn pri" id="nuevoU">' + ICON.mas + 'Nuevo usuario</button></div><div id="lU"><div class="skel" style="height:120px"></div></div></div>';
  let lista = [];
  const pintar = (l) => {
    lista = l;
    $('#lU').innerHTML = '<div class="tw"><table><thead><tr><th>Usuario</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Estado</th><th>Último ingreso</th><th></th></tr></thead><tbody>' + l.map((u, i) => '<tr><td><b>' + esc(u.usuario) + '</b></td><td>' + esc(u.nombre) + '</td><td>' + (u.email ? esc(u.email) : '<span class="muted">— (usa el de recuperación)</span>') + '</td><td><span class="tag ' + (u.rol === 'admin' ? 't-acc' : u.rol === 'gerente' ? 't-info' : 't-none') + '">' + ROL_TXT[u.rol] + '</span></td><td>' + (u.activo ? '<span class="tag t-good">Activo</span>' : '<span class="tag t-bad">Inactivo</span>') + '</td><td>' + (u.ultimo ? hace(u.ultimo) : '—') + '</td><td><button class="btn sm" data-i="' + i + '">Editar</button></td></tr>').join('') + '</tbody></table></div>';
  };
  const form = (u) => {
    const cu = abrirDlg('Usuarios', u ? 'Editar ' + u.usuario : 'Nuevo usuario', '<form id="fU" class="form"><label class="f">Usuario<input name="usuario" required pattern="[a-zA-Z0-9._-]{3,30}" value="' + esc(u ? u.usuario : '') + '"' + (u ? ' readonly' : '') + '></label><label class="f">Nombre<input name="nombre" required value="' + esc(u ? u.nombre : '') + '"></label><label class="f dos"><span>Correo <em>(recuperación de clave)</em></span><input name="email" type="email" value="' + esc(u ? u.email : '') + '"></label><label class="f">Rol<select name="rol">' + ROLES.map(r => '<option value="' + r + '"' + (u && u.rol === r ? ' selected' : '') + '>' + ROL_TXT[r] + '</option>').join('') + '</select></label><label class="f">' + (u ? 'Clave nueva (opcional)' : 'Clave inicial') + '<input name="clave" type="password" minlength="6"' + (u ? '' : ' required') + ' autocomplete="new-password"></label><label class="f" style="flex-direction:row;align-items:center;gap:10px"><span class="switch"><input type="checkbox" name="activo"' + (!u || u.activo ? ' checked' : '') + '><span></span></span>Activo</label><div class="full" style="display:flex;justify-content:flex-end;gap:8px"><button type="button" class="btn" data-cerrar>Cancelar</button><button class="btn pri">Guardar</button></div></form>');
    cu.querySelector('[data-cerrar]').onclick = () => $('#dlg').close();
    $('#fU').onsubmit = async e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      f.activo = !!e.target.activo.checked;
      overlay('Guardando…');
      try { pintar(await api('guardarUsuario', f)); $('#dlg').close(); toast('Usuario guardado', 'ok'); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    };
  };
  $('#nuevoU').onclick = () => form(null);
  c.onclick = e => { const b = e.target.closest('button[data-i]'); if (b) form(lista[Number(b.dataset.i)]); };
  pintar(await api('usuarios'));
}

async function ajParametros(c) {
  c.innerHTML = '<div class="card"><div class="cab-vista" style="margin:0 0 12px"><div><h2>Parámetros generales</h2><p class="sub">Las bases, columnas y constantes se editan en sus pestañas.</p></div><button class="btn" id="recalc">' + ICON.refresh + 'Recalcular ahora</button></div><div id="lP"><div class="skel" style="height:160px"></div></div></div>';
  $('#recalc').onclick = async () => { overlay('Releyendo todas las bases…'); try { if (await cargar(true, false)) toast('Indicadores recalculados', 'ok'); } finally { overlay(null); } };
  const l = await api('parametros');
  $('#lP').innerHTML = '<div class="tw"><table class="edit"><thead><tr><th>Clave</th><th>Valor</th><th>Descripción</th></tr></thead><tbody id="tP">' + l.map(p => '<tr data-k="' + p.clave + '"><td><b>' + esc(p.clave) + '</b></td><td><input value="' + esc(p.valor) + '" data-orig="' + esc(p.valor) + '" style="min-width:260px"></td><td class="wrap muted">' + esc(p.desc) + '</td></tr>').join('') + '</tbody></table></div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn pri" id="gP">Guardar</button></div>';
  $('#gP').onclick = async () => {
    const items = $$('#tP tr').map(tr => { const i = $('input', tr); return { clave: tr.dataset.k, valor: i.value.trim(), cambio: i.value.trim() !== i.dataset.orig }; }).filter(x => x.cambio);
    if (!items.length) return toast('Sin cambios', 'warn');
    overlay('Guardando…');
    try { await api('guardarParametros', { items: items }); toast('Parámetros guardados', 'ok'); ajParametros(c); } catch (e) { toast(e.message, 'bad'); } finally { overlay(null); }
  };
}

async function ajRegistro(c) {
  const l = await api('log');
  c.innerHTML = '<div class="card"><h2 style="margin-bottom:12px">Registro de cambios</h2><div class="tw max"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>' + l.map(x => '<tr><td>' + new Date(x.f).toLocaleString('es-AR') + '</td><td>' + esc(x.u) + '</td><td>' + esc(x.a) + '</td><td class="wrap">' + esc(x.d) + '</td></tr>').join('') + '</tbody></table></div></div>';
}

function ajCuenta(c) {
  c.innerHTML = '<div class="grid" style="max-width:900px"><div class="card"><h2>Correo de recuperación</h2><p class="sub" style="margin:4px 0 14px">Si olvidás la clave, el código llega a este correo.</p><form id="fMail" class="form"><label class="f full">Correo<input type="email" name="email" value="' + esc(S.ses.email || '') + '" placeholder="nombre@ceramicamarcospaz.com.ar"></label><div class="full" style="display:flex;justify-content:flex-end"><button class="btn pri">Guardar correo</button></div></form></div>' +
    '<div class="card"><h2>Cambiar clave</h2><p class="sub" style="margin:4px 0 14px">' + esc(S.ses.nombre) + ' · ' + esc(ROL_TXT[S.ses.rol]) + '</p><form id="fClave" class="form"><label class="f full">Clave actual<input type="password" name="actual" required autocomplete="current-password"></label><label class="f full">Clave nueva<input type="password" name="nueva" required minlength="6" autocomplete="new-password"></label><div class="full" style="display:flex;justify-content:space-between;gap:8px"><button type="button" class="btn dan" id="salir">Cerrar sesión</button><button class="btn pri">Cambiar clave</button></div></form></div></div>';
  $('#fMail').onsubmit = async e => {
    e.preventDefault();
    try { await api('miCorreo', { email: e.target.email.value.trim() }); setSesion(Object.assign({}, S.ses, { email: e.target.email.value.trim() })); toast('Correo guardado', 'ok'); } catch (er) { toast(er.message, 'bad'); }
  };
  $('#fClave').onsubmit = async e => {
    e.preventDefault();
    try { await api('cambiarClave', Object.fromEntries(new FormData(e.target))); toast('Clave actualizada', 'ok'); e.target.reset(); } catch (er) { toast(er.message, 'bad'); }
  };
  $('#salir').onclick = salir;
}

async function salir() {
  try { await api('logout'); } catch (e) { }
  setSesion(null);
  S.pkg = null;
  S.cfg = null;
  lsDel('gi_pkg');
  location.hash = '#/ingresar';
  cargar(false, false);
}

function boot() {
  $('#btnRefrescar').innerHTML = ICON.refresh;
  $('#btnImprimir').innerHTML = ICON.print;
  $('#dlgCerrar').innerHTML = ICON.cerrar;
  $('#dlg2Cerrar').innerHTML = ICON.cerrar;
  const sp = $('#splashPasos');
  if (sp) sp.innerHTML = ['fabrica', 'molde', 'llave', 'camion', 'caja'].map(k => '<span>' + ICON[k] + '</span>').join('');
  if (CFG.PLANTA) $('#brandPlanta').textContent = CFG.PLANTA;
  aplicarTema(lsGet('gi_tema', null));
  $('#btnTema').onclick = () => {
    const act = document.documentElement.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const t = act === 'dark' ? 'light' : 'dark';
    lsSet('gi_tema', t);
    aplicarTema(t);
    render();
  };
  $('#btnImprimir').onclick = () => { if (!/^#\/(ajustes|ingresar)/.test(location.hash)) window.print(); else location.hash = '#/'; };
  $('#btnRefrescar').onclick = async () => {
    if (S.cargando) return;
    if (puede('editor')) { overlay('Releyendo todas las bases…'); try { if (await cargar(true, false)) toast('Indicadores recalculados', 'ok'); } finally { overlay(null); } }
    else cargar(false, false);
  };
  $('#btnSesion').onclick = () => { location.hash = S.ses ? '#/ajustes/cuenta' : '#/ingresar'; };
  ['dlg', 'dlg2'].forEach(id => {
    $('#' + id + 'Cerrar').onclick = () => $('#' + id).close();
    $('#' + id).addEventListener('click', e => { if (e.target === $('#' + id)) $('#' + id).close(); });
  });
  $('#dlg').addEventListener('close', destruirCharts);
  $$('img[src="logo-cmp.png"]').forEach(img => { img.onerror = () => { if (!img.dataset.alt) { img.dataset.alt = 1; img.src = 'img/logo-cmp.png'; } }; });
  window.addEventListener('hashchange', render);
  window.addEventListener('online', () => cargar(false, false));
  window.addEventListener('offline', () => red('off'));
  document.addEventListener('keydown', e => {
    if (!S.pkg || $('#dlg').open || /input|select|textarea/i.test(document.activeElement.tagName) || /^#\/(ajustes|ingresar)/.test(location.hash)) return;
    if (e.key === 'ArrowLeft') cambiarMes(mesAdd(S.mes, -1));
    if (e.key === 'ArrowRight') cambiarMes(mesAdd(S.mes, 1));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && S.pkg && S.pkg.datos && Date.now() - new Date(S.pkg.datos.generado).getTime() > 10 * 60 * 1000) cargar(false, false);
  });
  const cache = lsGet('gi_pkg', null);
  if (cache && cache.datos && cache.kpis) {
    S.pkg = cache;
    red('cache', 'Actualizando');
    render();
    ocultarSplash();
    cargar(false, false);
  } else {
    lsDel('gi_pkg');
    splash(0);
    vEsqueleto();
    cargar(false, true);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
