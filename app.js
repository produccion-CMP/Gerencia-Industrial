'use strict';

const CFG = window.APP_CONFIG || {};
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const ROLES = ['lector', 'editor', 'gerente', 'admin'];
const ROL_TXT = { lector: 'Lector', editor: 'Editor', gerente: 'Gerente de producción', admin: 'Administrador' };
const ERR_KPI = { prod_tn_turno: 'produccion', gas_m3_tn: 'gas', elec_kwh_tn: 'energia', moldes_operativos: 'moldes', moldes_peso: 'moldes', ot_taller: 'taller', disp_extrusora: 'paradas', perdida_paradas: 'paradas', ot_mant: 'mantenimiento', ot_urgentes: 'mantenimiento', viajes_arcilla: 'viajes', m3_arcilla: 'viajes', stock_planta: 'tierra', cob_tarimas: 'insumos', cob_stretch: 'insumos', cob_cal: 'insumos', hh_tn: 'cargas', preventivo: 'cargas', stock_cantera: 'cargas' };
const COLORES_EST = { operativo: '--s1', 'no operativo': '--s2', 'en calibracion': '--s3', 'en fabricacion': '--s4', irrecuperable: '--s5', entregado: '--s1', 'en curso': '--s2', pendiente: '--s3', 'no entregado': '--s5', resuelta: '--s1', abierta: '--s2', 'esperando cierre supervisor': '--s3', programada: '--s4', optimo: '--s1', excedido: '--s2', 'urgente (otu)': '--s5', '< 15 dias (oti)': '--s1', '> 15 dias (ota)': '--s3' };
const LBL = { tn: 'Toneladas', turnos: 'Turnos', dias: 'Días', m3: 'm³ de gas', lecturas: 'Lecturas', kwh: 'kWh', horas: 'Horas de turno', paradas: 'Horas de parada', funcionamiento: 'Horas de funcionamiento', descarte: 'Horas de descarte', averias: 'Horas de avería', total: 'Total', camiones: 'Camiones', viajes: 'Viajes', m3PorViaje: 'm³ por viaje', playa: 'Playa (m³)', silo: 'Silo (m³)', stock: 'Stock', unidad: 'Unidad', hh: 'Horas-hombre', obs: 'Observación', por: 'Cargado por', densidad: 'Densidad (t/m³)', unidadOrigen: 'Unidad de origen' };

const ICON = {
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>',
  sol: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  luna: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  tablero: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></svg>',
  ajustes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>',
  cerrar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  candado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  alerta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>',
  vacio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/></svg>',
  mas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
};

const S = { ses: lsGet('gi_ses', null), pkg: null, mes: lsGet('gi_mes', null), filtro: null, cargando: 0, charts: [] };

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
  $('#splashBarra span').style.width = Math.min(100, paso * 22) + '%';
  if (txt) $('#splashTxt').textContent = txt;
}

function ocultarSplash() {
  const sp = $('#splash');
  if (!sp || sp.classList.contains('fuera')) return;
  splash(5, 'Listo');
  setTimeout(() => { sp.classList.add('fuera'); setTimeout(() => sp.remove(), 500); }, 180);
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
  if (S.charts.length) S.charts.forEach(c => { try { c.destroy(); } catch (e) { } });
}

function pintarTop() {
  const rutas = [['#/', 'Tablero', ICON.tablero]];
  if (S.ses) rutas.push(['#/ajustes', 'Ajustes', ICON.ajustes]);
  const h = location.hash || '#/';
  const html = rutas.map(r => '<a href="' + r[0] + '" class="' + ((r[0] === '#/' ? !/^#\/(ajustes|ingresar)/.test(h) : h.indexOf(r[0]) === 0) ? 'on' : '') + '">' + r[2] + '<span>' + r[1] + '</span></a>').join('');
  $('#nav').innerHTML = html;
  $('#bnav').innerHTML = html;
  $('#btnSesion').innerHTML = S.ses ? ICON.user + '<span>' + esc(S.ses.nombre.split(' ')[0]) + '</span>' : ICON.candado + '<span>Ingresar</span>';
  $('#btnRefrescar').title = puede('editor') ? 'Recalcular: volver a leer todas las bases' : 'Actualizar';
}

async function cargar(forzar, conSplash) {
  try {
    if (conSplash) splash(1, forzar ? 'Releyendo las bases de datos…' : 'Leyendo indicadores…');
    const t = setTimeout(() => splash(2, 'Calculando indicadores del mes…'), 1600);
    const p = await api('datos', { forzar: !!forzar });
    clearTimeout(t);
    if (conSplash) splash(4, 'Armando el tablero…');
    if (p.sesion && S.ses) setSesion(Object.assign({}, S.ses, { rol: p.sesion.rol, nombre: p.sesion.nombre }));
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
      if (!/^#\/ingresar/.test(location.hash)) location.hash = '#/ingresar';
      else render();
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
  S.charts.forEach(c => { try { c.destroy(); } catch (e) { } });
  S.charts = [];
  const h = location.hash || '#/';
  if (/^#\/ingresar/.test(h)) return vLogin();
  if (/^#\/ajustes/.test(h)) {
    if (!S.ses) { location.hash = '#/ingresar'; return; }
    return vAjustes(h.split('/')[2] || '');
  }
  if (!CFG.SCRIPT_URL && !S.pkg) return vSinConfig();
  if (!S.pkg) return vEsqueleto();
  vTablero();
}

function objetivos() { return (S.pkg && S.pkg.objetivos) || []; }
function serie(id) { return (S.pkg && S.pkg.datos.series[id]) || {}; }
function objetivo(id) { return objetivos().find(o => o.id === id); }

function valorMes(o, ym) {
  const s = serie(o.id);
  if (s[ym]) return Object.assign({ ym: ym }, s[ym]);
  if (o.snap || o.manual) return null;
  if (ym !== S.pkg.datos.ymHoy && ym !== mesAdd(S.pkg.datos.ymHoy, -1)) return null;
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
const EST_TXT = { good: 'Dentro de objetivo', warn: 'Atención', bad: 'Fuera de objetivo', none: 'Sin dato' };
function estTxt(e, o) { return e === 'none' && (o.meta === null || o.meta === undefined) ? 'Informativo' : EST_TXT[e]; }

function variacion(o, r) {
  if (!r) return '';
  const p = serie(o.id)[mesAdd(r.ym, -1)];
  if (!p || !isFinite(p.v) || !isFinite(r.v)) return '';
  const pct = o.unidad === '%';
  const d = pct ? r.v - p.v : (p.v ? (r.v - p.v) / Math.abs(p.v) * 100 : null);
  if (d === null) return '';
  const fl = Math.abs(d) < 0.05 ? '=' : d > 0 ? '↑' : '↓';
  return fl + ' ' + nf(Math.abs(d), 1) + (pct ? ' pts' : ' %') + ' vs. ' + mesTxt(mesAdd(r.ym, -1)).split(' ')[0].toLowerCase();
}

function metaTxt(o) {
  if (o.meta === null || o.meta === undefined) return 'Sin meta';
  return 'Meta ' + (o.sentido === '<=' ? '≤ ' : '≥ ') + nf(o.meta, o.dec) + (o.unidad === '%' ? '%' : '');
}

function valHTML(v, o, conUnidad) {
  return '<span data-cnt="' + (isFinite(v) ? v : '') + '" data-dec="' + o.dec + '">' + nf(v, o.dec) + '</span>' + (conUnidad === false ? '' : '<small>' + esc(o.unidad) + '</small>');
}

function sparkline(o, ym) {
  const s = serie(o.id);
  const ms = [];
  for (let i = 11; i >= 0; i--) ms.push(mesAdd(ym, -i));
  const vals = ms.map(m => s[m] && isFinite(s[m].v) ? s[m].v : null);
  const nums = vals.filter(v => v !== null);
  if (nums.length < 2) return '';
  const all = nums.concat(o.meta !== null && o.meta !== undefined ? [o.meta] : []);
  const mn = Math.min.apply(null, all), mx = Math.max.apply(null, all);
  const rg = mx - mn || 1;
  const W = 110, H = 34;
  const x = i => (i / 11) * W;
  const y = v => H - 3 - ((v - mn) / rg) * (H - 6);
  let d = '', a = '', first = null, last = null;
  vals.forEach((v, i) => {
    if (v === null) return;
    d += (d ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
    if (first === null) first = i;
    last = i;
  });
  a = d + 'L' + x(last).toFixed(1) + ' ' + H + 'L' + x(first).toFixed(1) + ' ' + H + 'Z';
  const meta = o.meta !== null && o.meta !== undefined ? '<line x1="0" x2="' + W + '" y1="' + y(o.meta).toFixed(1) + '" y2="' + y(o.meta).toFixed(1) + '"/>' : '';
  return '<svg class="spark" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' + meta + '<path class="a" d="' + a + '"/><path class="l" d="' + d + '"/><circle cx="' + x(last).toFixed(1) + '" cy="' + y(vals[last]).toFixed(1) + '" r="3"/></svg>';
}

function colorCat(k, i) {
  const c = COLORES_EST[norm(k)];
  return 'var(' + (c || ['--s1', '--s2', '--s3', '--s4', '--s5', '--s6', '--s7'][i % 7]) + ')';
}

function donut(c, centro, sub) {
  const ks = Object.keys(c || {}).sort((a, b) => c[b] - c[a]);
  const tot = ks.reduce((s, k) => s + c[k], 0) || 1;
  const R = 54, C = 2 * Math.PI * R;
  let off = 0;
  const segs = ks.map((k, i) => {
    const len = c[k] / tot * C;
    const s = '<circle r="' + R + '" cx="70" cy="70" stroke="' + colorCat(k, i) + '" stroke-dasharray="0 ' + C.toFixed(2) + '" data-dash="' + Math.max(0, len - 1.5).toFixed(2) + ' ' + (C - Math.max(0, len - 1.5)).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '"/>';
    off += len;
    return s;
  }).join('');
  const ley = ks.map((k, i) => '<div class="ley"><i style="background:' + colorCat(k, i) + '"></i><span>' + esc(k) + '</span><b>' + nf(c[k]) + '</b><small>' + nf(c[k] / tot * 100) + '%</small></div>').join('');
  return '<div class="dist"><div class="donut"><svg viewBox="0 0 140 140"><circle r="' + R + '" cx="70" cy="70" stroke="var(--panel-2)"/>' + segs + '</svg><div class="centro">' + centro + '<small>' + esc(sub) + '</small></div></div><div class="leyenda">' + ley + '</div></div>';
}

function cardVacante(o, i) {
  return '<article class="card kcard vacante" data-id="' + o.id + '" style="--i:' + i + '"><div class="k-cab"><div><div class="k-tit">' + esc(o.nombre) + '</div><div class="k-per">' + esc(o.unidad) + '</div></div><span class="tag t-mut">Vacante</span></div>' +
    '<div class="vac-ico">' + ICON.vacio + '</div><div class="k-ref">Sin base de datos todavía. ' + (o.manual ? 'Se puede cargar a mano: <b>' + esc(o.manual) + '</b>.' : '') + '</div>' +
    '<div class="k-pie"><span class="k-ref">' + metaTxt(o) + '</span>' + (o.manual && puede('editor') ? '<button class="btn sm no-print" data-cargar="' + o.id + '">' + ICON.mas + 'Cargar</button>' : '') + '</div></article>';
}

function notaError(o) {
  const e = S.pkg.datos.errores && S.pkg.datos.errores[ERR_KPI[o.id]];
  return e ? '<div class="k-nota">' + ICON.alerta.replace('<svg', '<svg width="13" height="13"') + 'Fuente con error: ' + esc(e) + '</div>' : '';
}

function cardNum(o, ym, i) {
  const r = valorMes(o, ym);
  const algun = Object.keys(serie(o.id)).length > 0;
  if (!algun && o.manual) return cardVacante(o, i);
  const est = r ? estado(r.v, o) : 'none';
  const barra = o.unidad === '%' && r ? '<div class="barra-k"><div data-w="' + Math.max(0, Math.min(100, r.v)) + '" style="background:var(--' + (est === 'good' ? 'ok' : est === 'warn' ? 'warn' : est === 'bad' ? 'bad' : 'accent') + ')"></div>' + (o.meta !== null ? '<i style="left:' + Math.max(0, Math.min(100, o.meta)) + '%"></i>' : '') + '</div>' : '';
  const per = r ? (r.atrasado ? mesTxt(r.ym) + ' · último mes con dato' : o.snap && r.ym === S.pkg.datos.ymHoy ? 'Al ' + fechaTxt(S.pkg.datos.generado.slice(0, 10)) : mesTxt(r.ym)) : mesTxt(ym);
  const val = r ? valHTML(r.v, o) : '<span class="muted" style="font-size:1.1rem;font-weight:700">Sin datos</span>';
  const ref = [metaTxt(o)];
  if (r) {
    const p = serie(o.id)[mesAdd(r.ym, -1)];
    if (p) ref.push(mesTxt(mesAdd(r.ym, -1)).split(' ')[0] + ': <b>' + nf(p.v, o.dec) + '</b>');
  }
  const v = variacion(o, r);
  return '<article class="card kcard est-' + est + '" data-id="' + o.id + '" data-est="' + est + '" style="--i:' + i + '"><div class="k-cab"><div><div class="k-tit">' + esc(o.nombre) + '</div><div class="k-per">' + per + '</div></div>' + (r && r.manual ? '<span class="tag t-info">Manual</span>' : '') + '</div>' +
    '<div class="k-val">' + val + '</div><div class="k-ref">' + ref.join(' · ') + '</div>' + barra +
    (r && r.atrasado ? '<div class="k-nota">' + ICON.info.replace('<svg', '<svg width="13" height="13"') + 'Aún sin dato de ' + mesTxt(ym).split(' ')[0].toLowerCase() + '</div>' : '') + notaError(o) +
    '<div class="k-pie"><span class="estado ' + est + '">' + estTxt(est, o) + (v ? ' · ' + v : '') + '</span>' + (r ? sparkline(o, r.ym) : '') + '</div></article>';
}

function cardDist(o, ym, i) {
  const r = valorMes(o, ym);
  const est = r ? estado(r.v, o) : 'none';
  const tit = { moldes: 'Inventario de moldes', peso: 'Moldes por condición de peso', taller: 'Órdenes del mes', mant: 'OT programadas en el mes', mantTipo: 'OT del mes por plazo' }[o.dist] || '';
  if (!r || !r.d || !r.d.c) {
    return '<article class="card kcard" data-id="' + o.id + '" style="--i:' + i + '"><div class="k-cab"><div><div class="k-tit">' + esc(o.nombre) + '</div><div class="k-per">' + esc(tit) + ' · ' + mesTxt(ym) + '</div></div></div><div class="k-ref" style="margin-top:14px">' + (o.snap ? 'Sin registro para este mes: el estado se guarda desde que la app empieza a calcularlo.' : 'Sin datos para este mes.') + '</div>' + notaError(o) + '</article>';
  }
  const v = variacion(o, r);
  return '<article class="card kcard est-' + est + '" data-id="' + o.id + '" data-est="' + est + '" style="--i:' + i + '"><div class="k-cab"><div><div class="k-tit">' + esc(o.nombre) + '</div><div class="k-per">' + esc(tit) + ' · ' + (o.snap && r.ym === S.pkg.datos.ymHoy ? 'al ' + fechaTxt(S.pkg.datos.generado.slice(0, 10)) : mesTxt(r.ym)) + '</div></div><span class="estado ' + est + '">' + EST_TXT[est] + '</span></div>' +
    donut(r.d.c, nf(r.d.total), o.dist === 'moldes' || o.dist === 'peso' ? 'moldes' : 'órdenes') +
    '<div class="dist-kpi"><span class="k-val" style="font-size:1.5rem;margin:0">' + valHTML(r.v, o) + '</span><span class="k-ref">' + metaTxt(o) + (v ? ' · ' + v : '') + '</span></div>' + notaError(o) + '</article>';
}

function cardPar(o, h, ym, i) {
  const bloque = (k) => {
    const r = valorMes(k, ym);
    const vac = !Object.keys(serie(k.id)).length;
    let cuerpo;
    if (r) cuerpo = '<div class="k-val">' + valHTML(r.v, k) + '</div><p class="k-ref">' + esc(k.nombre) + (k.snap || k.manual ? ' · ' + (r.ym === S.pkg.datos.ymHoy && k.snap ? 'al ' + fechaTxt(S.pkg.datos.generado.slice(0, 10)) : mesTxt(r.ym)) : '') + '</p>' + (k.meta !== null ? '<span class="estado ' + estado(r.v, k) + '">' + metaTxt(k) + '</span>' : '');
    else if (vac && k.manual) cuerpo = '<div class="k-val" style="font-size:1.2rem;color:var(--faint)">Vacante</div><p class="k-ref">' + esc(k.nombre) + ' · ' + esc(k.manual) + '</p>' + (puede('editor') ? '<button class="btn sm no-print" style="margin-top:6px" data-cargar="' + k.id + '">' + ICON.mas + 'Cargar</button>' : '');
    else if (vac && k.id === 'm3_arcilla') cuerpo = '<div class="k-val" style="font-size:1.2rem;color:var(--faint)">—</div><p class="k-ref">' + esc(k.nombre) + ' · configurá «m³ por viaje» en Parámetros</p>';
    else cuerpo = '<div class="k-val" style="font-size:1.2rem;color:var(--faint)">Sin datos</div><p class="k-ref">' + esc(k.nombre) + '</p>';
    return '<div>' + cuerpo + notaError(k) + '</div>';
  };
  const sub = o.id === 'viajes_arcilla' ? 'Movimiento · ' + mesTxt(ym) : 'Existencias estimadas';
  return '<article class="card kcard" data-id="' + o.id + '" style="--i:' + i + ';min-height:0"><div class="k-cab"><div><div class="k-tit">' + (o.id === 'viajes_arcilla' ? 'Movimiento de arcilla' : 'Stock de arcilla') + '</div><div class="k-per">' + sub + '</div></div></div><div class="split">' + bloque(o) + (h ? bloque(h) : '') + '</div></article>';
}

function selectorMes() {
  const ms = S.pkg.datos.meses.slice().reverse();
  return '<div class="mes-sel no-print"><button class="btn ghost" id="mPrev" aria-label="Mes anterior">' + ICON.prev + '</button><select id="mSel" aria-label="Mes">' + ms.map(m => '<option value="' + m + '"' + (m === S.mes ? ' selected' : '') + '>' + mesTxt(m) + '</option>').join('') + '</select><button class="btn ghost" id="mNext" aria-label="Mes siguiente">' + ICON.next + '</button></div>';
}

function vTablero() {
  const D = S.pkg.datos;
  if (!S.mes || D.meses.indexOf(S.mes) < 0) S.mes = D.ymHoy;
  const ym = S.mes;
  const enCurso = ym === D.ymHoy;
  const obs = objetivos().filter(o => o.visible).sort((a, b) => a.orden - b.orden);
  const visibles = {};
  obs.forEach(o => { visibles[o.id] = o; });
  const cont = { good: 0, warn: 0, bad: 0, none: 0 };
  obs.forEach(o => {
    if (o.hijo && visibles[KPI_PADRE(o.id)]) return;
    const r = valorMes(o, ym);
    if (o.meta === null || o.meta === undefined) return;
    cont[r ? estado(r.v, o) : 'none']++;
  });
  let i = 0;
  const secs = (S.pkg.secciones || []).map((sc, si) => {
    const delSec = obs.filter(o => o.sec === sc[0]);
    if (!delSec.length) return '';
    const nums = [], anchas = [];
    delSec.forEach(o => {
      if (o.hijo && visibles[KPI_PADRE(o.id)]) return;
      if (S.filtro) {
        const r = valorMes(o, ym);
        const e = r ? estado(r.v, o) : 'none';
        if (e !== S.filtro) return;
      }
      if (o.dist) anchas.push(cardDist(o, ym, i++));
      else if (o.par) anchas.push(cardPar(o, visibles[o.par] || null, ym, i++));
      else nums.push(cardNum(o, ym, i++));
    });
    if (!nums.length && !anchas.length) return '';
    return '<section><div class="sectionhead"><h2><span>' + String(si + 1).padStart(2, '0') + '</span>' + esc(sc[1]) + '</h2><span class="sub">' + esc(sc[2]) + '</span></div>' +
      (nums.length ? '<div class="grid stagger">' + nums.join('') + '</div>' : '') + (anchas.length ? '<div class="grid anchas stagger"' + (nums.length ? ' style="margin-top:14px"' : '') + '>' + anchas.join('') + '</div>' : '') + '</section>';
  }).join('');
  const errores = Object.keys(D.errores || {});
  const chip = (k, txt) => '<button class="res-chip ' + k + (S.filtro === k ? ' on' : '') + '" data-filtro="' + k + '"><i></i><b>' + cont[k] + '</b>' + txt + '</button>';
  $('#app').innerHTML = '<div class="vista"><div class="hero"><div><div class="eyebrow">' + esc(CFG.EMPRESA || 'Grupo MP · Cerámica Marcos Paz') + '</div><h1>Gerencia Industrial</h1><p class="sub">Indicadores principales de gestión · ' + esc(CFG.PLANTA || 'Planta Cevil') + '</p></div>' +
    '<div class="periodo">' + selectorMes() + '<div class="badges">' + (enCurso ? '<span class="tag t-acc">Mes en curso · datos al ' + fechaTxt(D.ultimoDia) + '</span>' : '<span class="tag t-mut">Mes cerrado</span>') + '<span class="tag t-mut" title="' + esc(new Date(D.generado).toLocaleString('es-AR')) + '">Calculado ' + hace(D.generado) + '</span></div></div></div>' +
    '<div class="resumen no-print">' + chip('good', 'en objetivo') + chip('warn', 'en atención') + chip('bad', 'fuera de objetivo') + (cont.none ? chip('none', 'sin dato') : '') + (S.filtro ? '<button class="btn sm ghost" data-filtro="">Ver todos</button>' : '') + '</div>' +
    (errores.length && puede('admin') ? '<div class="alert warn no-print">' + ICON.alerta + '<div><b>Fuentes con error:</b> ' + errores.map(k => esc(k) + ' (' + esc(D.errores[k]) + ')').join(' · ') + '</div></div>' : '') +
    (secs || '<div class="alert info">' + ICON.info + '<div>No hay indicadores para mostrar con este filtro.</div></div>') +
    '<footer class="foot"><span>Mes seleccionado: ' + mesTxt(ym) + ' · Click en cada indicador para ver la tendencia y el detalle.</span><div class="key"><span class="estado good">Dentro de objetivo</span><span class="estado warn">Atención</span><span class="estado bad">Fuera de objetivo</span></div></footer></div>';
  animar($('#app'));
  $('#mSel').onchange = e => cambiarMes(e.target.value);
  $('#mPrev').onclick = () => cambiarMes(mesAdd(S.mes, -1));
  $('#mNext').onclick = () => cambiarMes(mesAdd(S.mes, 1));
  $('#mNext').disabled = S.mes >= D.ymHoy;
  $('#mPrev').disabled = S.mes <= D.meses[0];
  $('#app').onclick = e => {
    const c = e.target.closest('[data-cargar]');
    if (c) { e.stopPropagation(); return dlgCarga(c.dataset.cargar); }
    const f = e.target.closest('[data-filtro]');
    if (f) { S.filtro = f.dataset.filtro && S.filtro !== f.dataset.filtro ? f.dataset.filtro : null; return vTablero(); }
    const k = e.target.closest('.kcard');
    if (k) abrirDetalle(k.dataset.id);
  };
}

function KPI_PADRE(id) {
  const p = objetivos().find(o => o.par === id);
  return p ? p.id : null;
}

function cambiarMes(m) {
  const D = S.pkg.datos;
  if (m < D.meses[0] || m > D.ymHoy) return;
  S.mes = m;
  lsSet('gi_mes', m === D.ymHoy ? null : m);
  vTablero();
}

function animar(raiz) {
  requestAnimationFrame(() => {
    $$('.donut circle[data-dash]', raiz).forEach(c => { c.setAttribute('stroke-dasharray', c.dataset.dash); });
    $$('.barra-k div[data-w]', raiz).forEach(b => { b.style.width = b.dataset.w + '%'; });
  });
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  $$('[data-cnt]', raiz).forEach(el => {
    const fin = parseFloat(el.dataset.cnt);
    const dec = Number(el.dataset.dec) || 0;
    if (!isFinite(fin)) return;
    const t0 = performance.now();
    const dur = 750;
    const paso = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = nf(fin * e, dec);
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

function abrirDlg(eyebrow, titulo, html) {
  $('#dlgEyebrow').textContent = eyebrow;
  $('#dlgTitulo').textContent = titulo;
  $('#dlgCuerpo').innerHTML = html;
  const d = $('#dlg');
  if (!d.open) d.showModal();
  $('#dlgCuerpo').scrollTop = 0;
}

function detalleKV(d) {
  return Object.keys(d || {}).filter(k => LBL[k] && d[k] !== null && d[k] !== '' && typeof d[k] !== 'object').map(k => '<div><small>' + LBL[k] + '</small><b>' + (typeof d[k] === 'number' ? nf(d[k], d[k] % 1 ? 1 : 0) : esc(d[k])) + '</b></div>').join('');
}

async function abrirDetalle(id) {
  const o = objetivo(id);
  if (!o) return;
  const D = S.pkg.datos;
  const s = serie(id);
  const ym = S.mes;
  const r = valorMes(o, ym);
  const sec = (S.pkg.secciones.find(x => x[0] === o.sec) || [])[1] || '';
  const ms = D.meses.filter(m => m <= ym).slice(-13);
  const anio = s[mesAdd(r ? r.ym : ym, -12)];
  const ult12 = D.meses.filter(m => m <= (r ? r.ym : ym)).slice(-12).map(m => s[m]).filter(x => x && isFinite(x.v)).map(x => x.v);
  const prom = ult12.length ? ult12.reduce((a, b) => a + b, 0) / ult12.length : null;
  const mejor = ult12.length ? (o.sentido === '<=' ? Math.min.apply(null, ult12) : Math.max.apply(null, ult12)) : null;
  const est = r ? estado(r.v, o) : 'none';
  let html = '<div class="kv"><div><small>' + (r ? mesTxt(r.ym) : mesTxt(ym)) + '</small><b class="' + est + '">' + (r ? nf(r.v, o.dec) + ' ' + esc(o.unidad) : '—') + '</b></div><div><small>Meta</small><b>' + metaTxt(o).replace('Meta ', '') + '</b></div><div><small>Mes anterior</small><b>' + (r && s[mesAdd(r.ym, -1)] ? nf(s[mesAdd(r.ym, -1)].v, o.dec) : '—') + '</b></div><div><small>Mismo mes año ant.</small><b>' + (anio ? nf(anio.v, o.dec) : '—') + '</b></div><div><small>Promedio 12 meses</small><b>' + nf(prom, o.dec) + '</b></div><div><small>Mejor 12 meses</small><b>' + nf(mejor, o.dec) + '</b></div></div>';
  html += '<div class="chart"><canvas id="chDet"></canvas></div>';
  if (r && r.d && detalleKV(r.d)) html += '<h3 style="margin:6px 0 4px">Detalle de ' + mesTxt(r.ym).toLowerCase() + '</h3><div class="kv">' + detalleKV(r.d) + '</div>';
  if ((id === 'prod_tn_turno' || id === 'gas_m3_tn') && D.diario) html += '<h3 style="margin:14px 0 4px">Día por día · ' + mesTxt(ym).toLowerCase() + '</h3><div class="chart" style="height:220px"><canvas id="chDia"></canvas></div>';
  if (r && r.d && r.d.motivos && r.d.motivos.length) html += '<h3 style="margin:14px 0 6px">Paradas por motivo (hoja Paradas)</h3><div class="tw"><table><thead><tr><th>Motivo</th><th class="n">Horas</th></tr></thead><tbody>' + r.d.motivos.map(m => '<tr><td>' + esc(m[0]) + '</td><td class="n">' + nf(m[1], 1) + '</td></tr>').join('') + '</tbody></table></div>';
  if (id === 'ot_taller' && D.listas.taller && D.listas.taller.length) html += '<h3 style="margin:14px 0 6px">OT del taller sin entregar (' + D.listas.taller.length + ')</h3><div class="tw max"><table><thead><tr><th>Fecha</th><th>OT</th><th>Máquina</th><th>Sector</th><th>Descripción</th><th>Criticidad</th><th>Estado</th></tr></thead><tbody>' + D.listas.taller.map(t => '<tr><td>' + fechaTxt(t.f) + '</td><td>' + esc(t.ot) + '</td><td>' + esc(t.maq) + '</td><td>' + esc(t.sector) + '</td><td class="wrap">' + esc(t.desc) + '</td><td>' + esc(t.crit) + '</td><td><span class="tag ' + (norm(t.est) === 'no entregado' ? 't-bad' : 't-warn') + '">' + esc(t.est) + '</span></td></tr>').join('') + '</tbody></table></div>';
  if ((id === 'moldes_operativos' || id === 'moldes_peso') && D.listas.moldes) html += '<h3 style="margin:14px 0 6px">Moldes (' + D.listas.moldes.length + ')</h3><div class="tw max"><table><thead><tr><th>Molde</th><th>N°</th><th>Estado</th><th>Peso</th><th>Actualizado</th><th>Observaciones</th></tr></thead><tbody>' + D.listas.moldes.map(m => '<tr><td><b>' + esc(m.molde) + '</b></td><td>' + esc(m.n) + '</td><td><span class="tag ' + (norm(m.est) === 'operativo' ? 't-ok' : norm(m.est) === 'irrecuperable' ? 't-bad' : 't-warn') + '">' + esc(m.est) + '</span></td><td>' + esc(m.peso) + '</td><td>' + fechaTxt(m.f) + '</td><td class="wrap">' + esc(m.obs) + '</td></tr>').join('') + '</tbody></table></div>';
  if ((id === 'ot_mant' || id === 'ot_urgentes') && D.notas && D.notas.mantAbiertas !== undefined) html += '<div class="alert info">' + ICON.info + '<div>OT de mantenimiento no resueltas en toda la base: <b>' + nf(D.notas.mantAbiertas) + '</b>.</div></div>';
  html += '<h3 style="margin:16px 0 6px">Historial mensual</h3><div class="tw max"><table><thead><tr><th>Mes</th><th class="n">Valor</th><th>Estado</th><th>Detalle</th></tr></thead><tbody>' +
    D.meses.slice().reverse().filter(m => s[m]).map(m => { const e = estado(s[m].v, o); return '<tr><td>' + mesTxt(m) + '</td><td class="n"><b>' + nf(s[m].v, o.dec) + '</b> ' + esc(o.unidad) + '</td><td><span class="estado ' + e + '">' + EST_TXT[e] + '</span></td><td class="muted">' + (s[m].d && s[m].d.c ? Object.keys(s[m].d.c).map(k => esc(k) + ': ' + s[m].d.c[k]).join(' · ') : Object.keys(s[m].d || {}).filter(k => LBL[k] && typeof s[m].d[k] !== 'object').slice(0, 4).map(k => LBL[k] + ': ' + (typeof s[m].d[k] === 'number' ? nf(s[m].d[k], s[m].d[k] % 1 ? 1 : 0) : esc(s[m].d[k]))).join(' · ')) + '</td></tr>'; }).join('') +
    '</tbody></table></div>';
  html += '<div class="calc"><b>Fuente:</b> ' + esc(o.fuente) + '<br><b>Cálculo:</b> ' + esc(o.calc) + (o.meta !== null ? '<br><b>Zona de atención:</b> hasta ' + nf(o.tol) + ' % ' + (o.sentido === '<=' ? 'por encima' : 'por debajo') + ' de la meta' : '') + (o.actPor ? '<br><b>Objetivo actualizado por</b> ' + esc(o.actPor) + (o.act ? ' el ' + new Date(o.act).toLocaleDateString('es-AR') : '') : '') + '</div>';
  html += '<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:14px" class="no-print">' + (o.manual && puede('editor') ? '<button class="btn" data-cargar="' + o.id + '">' + ICON.mas + 'Cargar valor</button>' : '') + (puede('gerente') ? '<a class="btn" href="#/ajustes/objetivos" onclick="document.getElementById(\'dlg\').close()">' + ICON.ajustes + 'Editar objetivo</a>' : '') + '</div>';
  abrirDlg(sec, o.nombre, html);
  $('#dlgCuerpo').onclick = e => { const c = e.target.closest('[data-cargar]'); if (c) { $('#dlg').close(); dlgCarga(c.dataset.cargar); } };
  try { await cargarChart(); } catch (e) { $('#chDet').parentNode.innerHTML = '<div class="alert warn">' + esc(e.message) + '</div>'; return; }
  if (!$('#dlg').open || !$('#chDet')) return;
  const col = (v) => { const e = estado(v, o); return cssVar(e === 'good' ? '--ok' : e === 'warn' ? '--warn' : e === 'bad' ? '--bad' : '--accent'); };
  const vals = ms.map(m => s[m] ? s[m].v : null);
  Chart.defaults.font.family = cssVar('--font');
  Chart.defaults.color = cssVar('--muted');
  const ds = [{ type: 'bar', label: o.nombre, data: vals, backgroundColor: vals.map(v => v === null ? 'transparent' : col(v) + 'cc'), borderRadius: 8, maxBarThickness: 38 }];
  if (o.meta !== null) ds.push({ type: 'line', label: 'Meta', data: ms.map(() => o.meta), borderColor: cssVar('--text'), borderDash: [6, 5], borderWidth: 1.5, pointRadius: 0, fill: false });
  S.charts.push(new Chart($('#chDet'), {
    data: { labels: ms.map(m => mesTxt(m, true)), datasets: ds },
    options: { responsive: true, maintainAspectRatio: false, animation: { duration: 700 }, plugins: { legend: { display: o.meta !== null, labels: { boxWidth: 12 } }, tooltip: { callbacks: { label: c => c.dataset.label + ': ' + nf(c.parsed.y, o.dec) + ' ' + o.unidad } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: cssVar('--line') }, beginAtZero: o.unidad === '%' || o.unidad === 'viajes' } } }
  }));
  if ($('#chDia')) {
    const [y, m] = ym.split('-').map(Number);
    const nd = new Date(y, m, 0).getDate();
    const fs = Array.from({ length: nd }, (_, i) => ym + '-' + String(i + 1).padStart(2, '0'));
    const v = fs.map(f => {
      const p = D.diario.prod[f];
      if (id === 'prod_tn_turno') return p ? p[0] / p[1] : null;
      const g = D.diario.gas[f];
      return p && g ? g / p[0] : null;
    });
    const ds2 = [{ type: 'bar', label: id === 'prod_tn_turno' ? 'tn/turno' : 'm³/tn', data: v, backgroundColor: v.map(x => x === null ? 'transparent' : col(x) + 'aa'), borderRadius: 4 }];
    if (o.meta !== null) ds2.push({ type: 'line', label: 'Meta', data: fs.map(() => o.meta), borderColor: cssVar('--text'), borderDash: [6, 5], borderWidth: 1.2, pointRadius: 0 });
    S.charts.push(new Chart($('#chDia'), { data: { labels: fs.map(f => Number(f.slice(8))), datasets: ds2 }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { title: c => fechaTxt(fs[c[0].dataIndex]), label: c => nf(c.parsed.y, o.dec) + ' ' + o.unidad } } }, scales: { x: { grid: { display: false } }, y: { grid: { color: cssVar('--line') } } } } }));
  }
}

function dlgCarga(id) {
  const manuales = objetivos().filter(o => o.manual);
  const o = objetivo(id) || manuales[0];
  const ym = S.pkg ? S.mes || S.pkg.datos.ymHoy : '';
  abrirDlg('Carga manual', 'Cargar valor', '<form id="fCarga" class="form"><label class="f full">Indicador<select name="kpi">' + manuales.map(k => '<option value="' + k.id + '"' + (k.id === o.id ? ' selected' : '') + '>' + esc(k.nombre) + ' · ' + esc(k.manual) + '</option>').join('') + '</select></label><label class="f">Mes<input type="month" name="periodo" required value="' + ym + '"></label><label class="f">Valor<input type="number" name="valor" step="any" min="0" required inputmode="decimal"></label><label class="f full">Observación<input name="obs" maxlength="200" placeholder="Opcional: origen del dato"></label><div class="full" style="display:flex;justify-content:flex-end;gap:8px"><button type="button" class="btn" onclick="document.getElementById(\'dlg\').close()">Cancelar</button><button class="btn pri">Guardar</button></div></form><p class="sub" style="margin-top:10px">Para «Horas-hombre» cargá el total de HH del mes; la app lo divide por las toneladas producidas. Si ya hay un valor para ese mes, se reemplaza.</p>');
  $('#fCarga').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    overlay('Guardando y recalculando…');
    try {
      const p = await api('guardarCarga', f);
      aplicarPaquete(p);
      $('#dlg').close();
      toast('Valor guardado', 'ok');
      render();
    } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
  };
}

function aplicarPaquete(p) {
  if (!p || !p.datos) return;
  p.sesion = S.pkg && S.pkg.sesion;
  S.pkg = p;
  lsSet('gi_pkg', p);
}

function vEsqueleto() {
  const tarjeta = '<div class="card" style="min-height:196px"><div class="skel" style="height:14px;width:60%"></div><div class="skel" style="height:12px;width:35%;margin-top:8px"></div><div class="skel" style="height:40px;width:55%;margin-top:22px"></div><div class="skel" style="height:12px;width:80%;margin-top:14px"></div></div>';
  $('#app').innerHTML = '<div class="vista"><div class="hero"><div><div class="skel" style="height:12px;width:220px"></div><div class="skel" style="height:30px;width:300px;margin-top:10px"></div></div></div>' + [4, 2, 3].map(n => '<div class="sectionhead"><div class="skel" style="height:18px;width:200px"></div></div><div class="grid">' + tarjeta.repeat(n) + '</div>').join('') + '</div>';
}

function vSinConfig() {
  $('#app').innerHTML = '<div class="login-wrap vista"><div class="card login"><span class="logo-tile"><img src="img/logo-cmp.png" alt=""></span><h2>Falta conectar el servidor</h2><p class="sub">Completá <b>SCRIPT_URL</b> en <code>config.js</code> con la URL <code>/exec</code> de la implementación de Apps Script (ver README).</p></div></div>';
}

function vLogin() {
  $('#app').innerHTML = '<div class="login-wrap vista"><form class="card login" id="fLogin"><span class="logo-tile"><img src="img/logo-cmp.png" alt=""></span><div><div class="eyebrow">' + esc(CFG.EMPRESA || 'Grupo MP') + '</div><h2 style="margin-top:4px">Ingresar al tablero</h2></div><label class="f">Usuario<input name="usuario" autocomplete="username" required autofocus></label><label class="f">Clave<input name="clave" type="password" autocomplete="current-password" required></label><button class="btn pri brillo">Ingresar</button><p class="sub">El primer ingreso, con la base vacía, crea el usuario administrador con la clave maestra (ADMIN_KEY).</p></form></div>';
  $('#fLogin').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const b = e.target.querySelector('button');
    b.disabled = true;
    try {
      const s = await api('login', f);
      setSesion(s);
      toast('Bienvenido/a, ' + s.nombre.split(' ')[0], 'ok');
      location.hash = '#/';
      if (!S.pkg) vEsqueleto();
      await cargar(false, false);
    } catch (er) {
      toast(er.message, 'bad');
      b.disabled = false;
    }
  };
}

function vAjustes(tab) {
  const tabs = [];
  if (puede('gerente')) tabs.push(['objetivos', 'Objetivos y visibilidad']);
  if (puede('editor')) tabs.push(['cargas', 'Cargas manuales']);
  if (puede('admin')) tabs.push(['usuarios', 'Usuarios'], ['parametros', 'Parámetros y fuentes'], ['registro', 'Registro']);
  tabs.push(['cuenta', 'Mi cuenta']);
  if (!tabs.some(t => t[0] === tab)) tab = tabs[0][0];
  $('#app').innerHTML = '<div class="vista"><div class="cab-vista"><div><div class="eyebrow">' + esc(ROL_TXT[S.ses.rol] || S.ses.rol) + ' · ' + esc(S.ses.nombre) + '</div><h1>Ajustes</h1></div><div class="seg" id="segAj">' + tabs.map(t => '<button data-t="' + t[0] + '" class="' + (t[0] === tab ? 'on' : '') + '">' + t[1] + '</button>').join('') + '</div></div><div id="aj"></div></div>';
  $('#segAj').onclick = e => { const b = e.target.closest('button'); if (b) location.hash = '#/ajustes/' + b.dataset.t; };
  ({ objetivos: ajObjetivos, cargas: ajCargas, usuarios: ajUsuarios, parametros: ajParametros, registro: ajRegistro, cuenta: ajCuenta })[tab]($('#aj'));
}

function ajObjetivos(c) {
  if (!S.pkg) { c.innerHTML = '<div class="skel" style="height:300px"></div>'; return; }
  const secs = S.pkg.secciones;
  const filas = secs.map(sc => {
    const os = objetivos().filter(o => o.sec === sc[0]).sort((a, b) => a.orden - b.orden);
    return '<tr class="sec"><td colspan="7">' + esc(sc[1]) + '</td></tr>' + os.map(o => '<tr data-id="' + o.id + '"><td><label class="switch" title="Mostrar en el tablero"><input type="checkbox" name="visible"' + (o.visible ? ' checked' : '') + '><span></span></label></td><td><input name="nombre" value="' + esc(o.nombre) + '" maxlength="80" style="min-width:220px"><div class="sub" style="font-size:.72rem;margin-top:3px">' + esc(o.fuente) + '</div></td><td class="muted">' + esc(o.unidad) + '</td><td><select name="sentido" style="width:auto"><option value=">="' + (o.sentido === '>=' ? ' selected' : '') + '>≥ mayor es mejor</option><option value="<="' + (o.sentido === '<=' ? ' selected' : '') + '>≤ menor es mejor</option></select></td><td><input name="meta" type="number" step="any" value="' + (o.meta === null ? '' : o.meta) + '" placeholder="Sin meta" style="width:110px"></td><td><input name="tol" type="number" step="any" min="0" max="100" value="' + o.tol + '" style="width:80px"></td><td><input name="orden" type="number" step="1" value="' + o.orden + '" style="width:72px"></td></tr>').join('');
  }).join('');
  c.innerHTML = '<div class="alert info">' + ICON.info + '<div>La <b>meta</b> define «dentro de objetivo». La <b>tolerancia</b> es el margen de «atención» (en % de la meta) antes de quedar «fuera de objetivo». Sin meta, el indicador es informativo. El interruptor muestra u oculta el indicador en el tablero.</div></div><div class="card" style="padding:0"><div class="tw" style="border:0"><table class="edit"><thead><tr><th>Ver</th><th>Indicador</th><th>Unidad</th><th>Sentido</th><th>Meta</th><th>Tolerancia %</th><th>Orden</th></tr></thead><tbody id="tObj">' + filas + '</tbody></table></div></div><div class="barra-acc"><div class="card"><span class="sub" id="objCambios">Sin cambios</span><button class="btn" id="objDesh">Deshacer</button><button class="btn pri" id="objGuardar" disabled>Guardar objetivos</button></div></div>';
  const leer = () => $$('#tObj tr[data-id]').map(tr => ({ id: tr.dataset.id, visible: $('[name=visible]', tr).checked, nombre: $('[name=nombre]', tr).value.trim(), sentido: $('[name=sentido]', tr).value, meta: $('[name=meta]', tr).value === '' ? null : Number($('[name=meta]', tr).value), tol: Number($('[name=tol]', tr).value) || 0, orden: Number($('[name=orden]', tr).value) || 0 }));
  const difiere = (a, o) => a.visible !== o.visible || a.nombre !== o.nombre || a.sentido !== o.sentido || a.meta !== o.meta || a.tol !== o.tol || a.orden !== o.orden;
  const marcar = () => {
    let n = 0;
    leer().forEach(a => { const d = difiere(a, objetivo(a.id)); if (d) n++; $('#tObj tr[data-id="' + a.id + '"]').classList.toggle('modif', d); });
    $('#objCambios').textContent = n ? n + ' indicador(es) modificados' : 'Sin cambios';
    $('#objGuardar').disabled = !n;
  };
  $('#tObj').oninput = marcar;
  $('#tObj').onchange = marcar;
  $('#objDesh').onclick = () => ajObjetivos(c);
  $('#objGuardar').onclick = async () => {
    const items = leer().filter(a => difiere(a, objetivo(a.id)));
    if (items.some(a => !a.nombre)) return toast('Todos los indicadores necesitan nombre', 'bad');
    overlay('Guardando objetivos…');
    try {
      const r = await api('guardarObjetivos', { items: items });
      S.pkg.objetivos = r.objetivos;
      lsSet('gi_pkg', S.pkg);
      toast('Objetivos guardados', 'ok');
      ajObjetivos(c);
    } catch (e) { toast(e.message, 'bad'); } finally { overlay(null); }
  };
}

async function ajCargas(c) {
  c.innerHTML = '<div class="card"><div class="cab-vista" style="margin:0 0 12px"><div><h2>Cargas manuales</h2><p class="sub">Indicadores sin base de datos propia (horas-hombre, plan preventivo, stock en cantera).</p></div><button class="btn pri" id="nuevaCarga">' + ICON.mas + 'Nueva carga</button></div><div id="lCargas"><div class="skel" style="height:120px"></div></div></div>';
  $('#nuevaCarga').onclick = () => dlgCarga(null);
  try {
    const l = await api('cargas');
    const nom = id => (objetivo(id) || {}).nombre || id;
    $('#lCargas').innerHTML = l.length ? '<div class="tw max"><table><thead><tr><th>Indicador</th><th>Mes</th><th class="n">Valor</th><th>Observación</th><th>Usuario</th><th>Fecha</th><th></th></tr></thead><tbody>' + l.sort((a, b) => a.periodo < b.periodo ? 1 : -1).map(x => '<tr><td>' + esc(nom(x.kpi)) + '</td><td>' + mesTxt(x.periodo) + '</td><td class="n">' + nf(x.valor, 2) + '</td><td class="wrap">' + esc(x.obs) + '</td><td>' + esc(x.usuario) + '</td><td>' + (x.fecha ? new Date(x.fecha).toLocaleDateString('es-AR') : '') + '</td><td><button class="btn sm dan" data-k="' + x.kpi + '" data-p="' + x.periodo + '">Borrar</button></td></tr>').join('') + '</tbody></table></div>' : '<p class="sub">Todavía no hay cargas.</p>';
    $('#lCargas').onclick = async e => {
      const b = e.target.closest('button[data-k]');
      if (!b || !confirm('¿Borrar la carga de ' + nom(b.dataset.k) + ' · ' + mesTxt(b.dataset.p) + '?')) return;
      overlay('Borrando…');
      try { aplicarPaquete(await api('borrarCarga', { kpi: b.dataset.k, periodo: b.dataset.p })); toast('Carga borrada', 'ok'); ajCargas(c); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    };
  } catch (e) { $('#lCargas').innerHTML = '<div class="alert bad">' + esc(e.message) + '</div>'; }
}

async function ajUsuarios(c) {
  c.innerHTML = '<div class="card"><div class="cab-vista" style="margin:0 0 12px"><div><h2>Usuarios</h2><p class="sub">Lector: ve el tablero · Editor: además cargas manuales y recálculo · Gerente de producción: además objetivos y visibilidad · Administrador: todo.</p></div><button class="btn pri" id="nuevoU">' + ICON.mas + 'Nuevo usuario</button></div><div id="lU"><div class="skel" style="height:120px"></div></div></div>';
  const form = (u) => {
    abrirDlg('Usuarios', u ? 'Editar ' + u.usuario : 'Nuevo usuario', '<form id="fU" class="form"><label class="f">Usuario<input name="usuario" required pattern="[a-zA-Z0-9._-]{3,30}" value="' + esc(u ? u.usuario : '') + '"' + (u ? ' readonly' : '') + '></label><label class="f">Nombre<input name="nombre" required value="' + esc(u ? u.nombre : '') + '"></label><label class="f">Rol<select name="rol">' + ROLES.map(r => '<option value="' + r + '"' + (u && u.rol === r ? ' selected' : '') + '>' + ROL_TXT[r] + '</option>').join('') + '</select></label><label class="f">' + (u ? 'Clave nueva (opcional)' : 'Clave inicial') + '<input name="clave" type="password" minlength="6"' + (u ? '' : ' required') + ' autocomplete="new-password"></label><label class="f" style="flex-direction:row;align-items:center;gap:10px"><span class="switch"><input type="checkbox" name="activo"' + (!u || u.activo ? ' checked' : '') + '><span></span></span>Activo</label><div class="full" style="display:flex;justify-content:flex-end;gap:8px"><button type="button" class="btn" onclick="document.getElementById(\'dlg\').close()">Cancelar</button><button class="btn pri">Guardar</button></div></form>');
    $('#fU').onsubmit = async e => {
      e.preventDefault();
      const f = Object.fromEntries(new FormData(e.target));
      f.activo = !!e.target.activo.checked;
      overlay('Guardando…');
      try { pintar(await api('guardarUsuario', f)); $('#dlg').close(); toast('Usuario guardado', 'ok'); } catch (er) { toast(er.message, 'bad'); } finally { overlay(null); }
    };
  };
  let lista = [];
  const pintar = (l) => {
    lista = l;
    $('#lU').innerHTML = '<div class="tw"><table><thead><tr><th>Usuario</th><th>Nombre</th><th>Rol</th><th>Estado</th><th>Último ingreso</th><th></th></tr></thead><tbody>' + l.map((u, i) => '<tr><td><b>' + esc(u.usuario) + '</b></td><td>' + esc(u.nombre) + '</td><td><span class="tag ' + (u.rol === 'admin' ? 't-acc' : u.rol === 'gerente' ? 't-info' : 't-mut') + '">' + ROL_TXT[u.rol] + '</span></td><td>' + (u.activo ? '<span class="tag t-ok">Activo</span>' : '<span class="tag t-bad">Inactivo</span>') + '</td><td>' + (u.ultimo ? hace(u.ultimo) : '—') + '</td><td><button class="btn sm" data-i="' + i + '">Editar</button></td></tr>').join('') + '</tbody></table></div>';
  };
  $('#nuevoU').onclick = () => form(null);
  c.onclick = e => { const b = e.target.closest('button[data-i]'); if (b) form(lista[Number(b.dataset.i)]); };
  try { pintar(await api('usuarios')); } catch (e) { $('#lU').innerHTML = '<div class="alert bad">' + esc(e.message) + '</div>'; }
}

async function ajParametros(c) {
  c.innerHTML = '<div class="card"><div class="cab-vista" style="margin:0 0 12px"><div><h2>Parámetros y fuentes</h2><p class="sub">IDs de las planillas de origen y criterios de cálculo. Al guardar se recalcula todo.</p></div><button class="btn" id="recalc">' + ICON.refresh + 'Recalcular ahora</button></div><div id="lP"><div class="skel" style="height:220px"></div></div></div>';
  $('#recalc').onclick = async () => { overlay('Releyendo todas las bases…'); try { await cargar(true, false); toast('Indicadores recalculados', 'ok'); } finally { overlay(null); } };
  try {
    const l = await api('parametros');
    $('#lP').innerHTML = '<div class="tw"><table class="edit"><thead><tr><th>Clave</th><th>Valor</th><th>Descripción</th></tr></thead><tbody id="tP">' + l.map(p => '<tr data-k="' + p.clave + '"><td><b>' + esc(p.clave) + '</b>' + (p.fuente ? ' <span class="tag t-info">Fuente</span>' : '') + '</td><td><input value="' + esc(p.valor) + '" data-orig="' + esc(p.valor) + '" style="min-width:' + (p.fuente ? 380 : 160) + 'px"></td><td class="wrap muted">' + esc(p.desc) + '</td></tr>').join('') + '</tbody></table></div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button class="btn pri" id="gP">Guardar parámetros</button></div>';
    $('#gP').onclick = async () => {
      const items = $$('#tP tr').map(tr => { const i = $('input', tr); return { clave: tr.dataset.k, valor: i.value.trim(), cambio: i.value.trim() !== i.dataset.orig }; }).filter(x => x.cambio);
      if (!items.length) return toast('Sin cambios', 'warn');
      overlay('Guardando y recalculando…');
      try { aplicarPaquete(await api('guardarParametros', { items: items })); toast('Parámetros guardados', 'ok'); ajParametros(c); } catch (e) { toast(e.message, 'bad'); } finally { overlay(null); }
    };
  } catch (e) { $('#lP').innerHTML = '<div class="alert bad">' + esc(e.message) + '</div>'; }
}

async function ajRegistro(c) {
  c.innerHTML = '<div class="card"><h2 style="margin-bottom:12px">Registro de cambios</h2><div id="lL"><div class="skel" style="height:200px"></div></div></div>';
  try {
    const l = await api('log');
    $('#lL').innerHTML = '<div class="tw max"><table><thead><tr><th>Fecha</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>' + l.map(x => '<tr><td>' + new Date(x.f).toLocaleString('es-AR') + '</td><td>' + esc(x.u) + '</td><td>' + esc(x.a) + '</td><td class="wrap">' + esc(x.d) + '</td></tr>').join('') + '</tbody></table></div>';
  } catch (e) { $('#lL').innerHTML = '<div class="alert bad">' + esc(e.message) + '</div>'; }
}

function ajCuenta(c) {
  c.innerHTML = '<div class="card" style="max-width:520px"><h2>Mi cuenta</h2><p class="sub" style="margin:4px 0 14px">' + esc(S.ses.nombre) + ' · ' + esc(ROL_TXT[S.ses.rol]) + '</p><form id="fClave" class="form"><label class="f full">Clave actual<input type="password" name="actual" required autocomplete="current-password"></label><label class="f full">Clave nueva<input type="password" name="nueva" required minlength="6" autocomplete="new-password"></label><div class="full" style="display:flex;justify-content:space-between;gap:8px"><button type="button" class="btn dan" id="salir">Cerrar sesión</button><button class="btn pri">Cambiar clave</button></div></form></div>';
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
  lsDel('gi_pkg');
  location.hash = '#/ingresar';
  cargar(false, false);
}

function boot() {
  $('#btnRefrescar').innerHTML = ICON.refresh;
  $('#btnImprimir').innerHTML = ICON.print;
  $('#dlgCerrar').innerHTML = ICON.cerrar;
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
  $('#dlgCerrar').onclick = () => $('#dlg').close();
  $('#dlg').addEventListener('click', e => { if (e.target === $('#dlg')) $('#dlg').close(); });
  $('#dlg').addEventListener('close', () => { S.charts.forEach(c => { try { c.destroy(); } catch (e) { } }); S.charts = []; });
  window.addEventListener('hashchange', render);
  window.addEventListener('online', () => cargar(false, false));
  window.addEventListener('offline', () => red('off'));
  document.addEventListener('keydown', e => {
    if (!S.pkg || $('#dlg').open || /input|select|textarea/i.test(document.activeElement.tagName) || /^#\/(ajustes|ingresar)/.test(location.hash)) return;
    if (e.key === 'ArrowLeft') cambiarMes(mesAdd(S.mes, -1));
    if (e.key === 'ArrowRight') cambiarMes(mesAdd(S.mes, 1));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && S.pkg && Date.now() - new Date(S.pkg.datos.generado).getTime() > 10 * 60 * 1000) cargar(false, false);
  });
  const cache = lsGet('gi_pkg', null);
  if (cache && cache.datos && cache.datos.series) {
    S.pkg = cache;
    red('cache', 'Actualizando');
    render();
    ocultarSplash();
    cargar(false, false);
  } else {
    splash(0);
    vEsqueleto();
    cargar(false, true);
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
