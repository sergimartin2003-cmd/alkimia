/**
 * Arnés de verificación en navegador para webs de negocios locales.
 *
 *   python3 -m http.server 8099 &
 *   npm install playwright-core --silent
 *   node verificar.mjs
 *
 * Comprueba lo que una revisión de código no ve. Cada bloque corresponde a un
 * fallo real documentado en referencias/errores-conocidos.md.
 */

import { chromium } from 'playwright-core';

const URL = process.env.URL || 'http://127.0.0.1:8099/';
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const res = [];
const ok = (n, c, extra = '') =>
  res.push(`${c ? '  OK  ' : ' FALLO'} ${n}${extra ? ' — ' + extra : ''}`);

const browser = await chromium.launch({ executablePath: CHROME });

/* Recorre la página entera: las animaciones de entrada desplazan elementos
   hasta que se activan, y sin esto se miden posiciones falsas. */
async function recorrer(page) {
  await page.evaluate(async () => {
    const paso = window.innerHeight * 0.7;
    for (let y = 0; y < document.body.scrollHeight; y += paso) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 70));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(400);
}

/* ---------- 1. Desbordamiento horizontal ----------
   Mide anchos de elementos, NO el scroll de la página: overflow-x: clip
   recorta lo que sobra y falsea scrollWidth. */
for (const w of [320, 360, 390, 430, 540, 768, 1024, 1280, 1440, 1920]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 }, isMobile: w < 600, hasTouch: w < 600
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await recorrer(page);

  const fuera = await page.evaluate(vw => {
    const salida = [];
    /* Salirse dentro de un carrusel o marquesina es intencionado */
    const enScroller = el => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        const ox = getComputedStyle(p).overflowX;
        if (['auto', 'scroll', 'hidden', 'clip'].includes(ox)) return true;
      }
      return false;
    };
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      if (getComputedStyle(el).position === 'fixed') return;
      if (enScroller(el)) return;
      if (r.right > vw + 1 || r.left < -1) {
        const c = typeof el.className === 'string' ? el.className.split(' ')[0] : '';
        salida.push(`${el.tagName.toLowerCase()}.${c}`);
      }
    });
    return [...new Set(salida)];
  }, w);

  ok(`[${w}px] Sin desbordamiento`, fuera.length === 0, fuera.slice(0, 4).join(' | '));
  await ctx.close();
}

/* ---------- 2. Contraste de la cabecera sobre la portada, en TEMA CLARO ----------
   El fallo que más se escapa: se desarrolla en oscuro y se da por bueno. */
{
  const lum = c => {
    const [r, g, b] = c.map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const ratio = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)];
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const parse = s => (s.match(/[\d.]+/g) || [0, 0, 0]).slice(0, 3).map(Number);

  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: 'light' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(700);

  const colores = await page.evaluate(() =>
    ['.brand__name', '.nav__link', '.theme-toggle']
      .map(s => { const e = document.querySelector(s); return e && { s, c: getComputedStyle(e).color }; })
      .filter(Boolean));

  /* Tono medio aproximado de una foto de portada oscura */
  const fondo = [0x4a, 0x3c, 0x30];
  colores.forEach(({ s, c }) => {
    const r = ratio(parse(c), fondo);
    ok(`Contraste ${s} sobre la portada (tema claro)`, r >= 4.5, `${r.toFixed(2)}:1`);
  });
  await ctx.close();
}

/* ---------- 3. Que las imágenes se VEAN, no que el contenedor exista ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const rotas = await page.evaluate(() =>
    [...document.querySelectorAll('img')]
      .filter(i => i.getAttribute('src') && !i.src.startsWith('data:'))
      .filter(i => i.complete && i.naturalWidth === 0)
      .map(i => i.getAttribute('src')));
  ok('Todas las imágenes cargan', rotas.length === 0, rotas.slice(0, 3).join(', '));

  const galeria = page.locator('.gallery__item');
  if (await galeria.count()) {
    await page.locator('#galeria').scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await galeria.nth(1).click();
    await page.waitForTimeout(700);

    const visor = await page.evaluate(() => {
      const el = document.getElementById('lbImg');
      if (!el) return { falta: true };
      const r = el.getBoundingClientRect();
      return { tag: el.tagName, nat: el.naturalWidth, w: Math.round(r.width), h: Math.round(r.height) };
    });
    ok('El visor sigue siendo un <img> en el documento', visor.tag === 'IMG');
    ok('La foto del visor se ha descargado', visor.nat > 0, `naturalWidth=${visor.nat}`);
    ok('La foto del visor se ve', visor.w > 50 && visor.h > 50, `${visor.w}x${visor.h}`);

    ok('Los controles del visor caben', await page.evaluate(() => {
      const ids = ['lbClose', 'lbNext', 'lbPrev'];
      return ids.every(i => {
        const e = document.getElementById(i);
        if (!e) return true;
        const r = e.getBoundingClientRect();
        return r.right <= innerWidth + 1 && r.left >= -1;
      });
    }));
    await page.keyboard.press('Escape');
  }
  await ctx.close();
}

/* ---------- 4. Área táctil de 44px ----------
   Por ancho de pantalla, no por pointer: coarse, que los emuladores no
   reportan de forma fiable. */
for (const w of [360, 390, 430, 768]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 820 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const pequenos = await page.evaluate(() => {
    const sel = '.btn, .burger, .theme-toggle, .nav__link, .menu__tab, .footer__list a, .footer__legal a';
    const out = [];
    document.querySelectorAll(sel).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && r.height < 44) {
        const c = typeof el.className === 'string' ? el.className.split(' ')[0] : el.tagName;
        out.push(`${c}:${Math.round(r.height)}`);
      }
    });
    return [...new Set(out)];
  });
  ok(`[${w}px] Área táctil >= 44px`, pequenos.length === 0, pequenos.slice(0, 3).join(' | '));
  await ctx.close();
}

/* ---------- 5. Sin JavaScript ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const texto = await page.locator('body').innerText();
  ok('Sin JS el contenido se lee', texto.length > 500, `${texto.length} caracteres`);
  await ctx.close();
}

/* ---------- 6. Movimiento reducido ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const invisibles = await page.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].filter(e => getComputedStyle(e).opacity === '0').length);
  ok('Con movimiento reducido nada queda invisible', invisibles === 0, `${invisibles} ocultos`);
  await ctx.close();
}

/* ---------- 7. El mapa no carga sin consentimiento ---------- */
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const frame = page.locator('#mapFrame');
  if (await frame.count()) {
    ok('El iframe del mapa no tiene src antes de aceptar', !(await frame.getAttribute('src')));
    const botón = page.locator('#mapLoad');
    if (await botón.count()) {
      await page.locator('#como-llegar').scrollIntoViewIfNeeded();
      await botón.click();
      await page.waitForTimeout(500);
      ok('Tras aceptar, el mapa recibe src', !!(await frame.getAttribute('src')));
    }
  }
  await ctx.close();
}

await browser.close();

console.log(res.join('\n'));
const fallos = res.filter(r => r.trim().startsWith('FALLO'));
console.log(`\n${res.length - fallos.length}/${res.length} comprobaciones superadas`);
process.exit(fallos.length ? 1 : 0);
