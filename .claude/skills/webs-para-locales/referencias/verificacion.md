# Verificación

No entregues una web de local sin abrirla en un navegador. Nueve de los trece
errores conocidos solo se ven ejecutando la página.

## Montaje

Un servidor estático y Playwright contra el Chromium del entorno:

```bash
python3 -m http.server 8099 &
npm install playwright-core --silent
node verificar.mjs
```

```js
const b = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
});
```

Si no puedes descargar fotos reales, genera rellenos. Un codificador PNG en
Python puro son veinte líneas con `zlib` y basta para juzgar la maquetación.

## Qué comprobar

### Desbordamiento horizontal

De 320 a 1920 px. **Mide anchos de elementos**, no el scroll de la página:
`overflow-x: clip` falsea el segundo (error 5).

```js
const inScroller = el => {
  for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
    const ox = getComputedStyle(p).overflowX;
    if (['auto','scroll','hidden','clip'].includes(ox)) return true;
  }
  return false;
};
```

Recorre la página entera antes de medir: las animaciones de entrada desplazan
elementos hasta que se activan.

### Contraste de la cabecera en tema claro

El fallo que más se escapa. Arranca el contexto con `colorScheme: 'light'`, lee
el color calculado y compara contra el tono medio de la foto de portada. Mínimo
4,5:1.

### Que las imágenes se vean

No que el contenedor exista:

```js
const el = document.getElementById('lbImg');
return { tag: el?.tagName, nat: el?.naturalWidth, w: el?.getBoundingClientRect().width };
```

`tag === 'IMG'`, `naturalWidth > 0` y ancho renderizado real. Comprueba también
que sea **la foto que se pulsó**.

Haz una pasada con una foto de 2400 px: revela problemas de ancho mínimo que las
de prueba pequeñas esconden.

### Área táctil

44 px en todo lo pulsable. Abre el menú y el visor para medir también sus
controles. Filtra por ancho de pantalla, no por `pointer: coarse` (error 7).

### Sin JavaScript

`javaScriptEnabled: false`. La portada y la carta tienen que seguir leyéndose:
están en el HTML, no los pinta el JS.

### Movimiento reducido

`reducedMotion: 'reduce'`. Ningún `[data-reveal]` puede quedarse en `opacity: 0`.

### Funcionamiento

Menú y su cierre con Escape, pestañas con flechas, visor con teclado y
miniaturas, consentimiento del mapa (que el iframe **no tenga src** antes de
aceptar), validación del formulario y mensaje de WhatsApp compuesto.

Para el formulario, intercepta la apertura y revisa el texto:

```js
await page.evaluate(() => { window.__opened = null; window.open = u => (window.__opened = u, {}); });
```

## Capturas

Haz capturas de cada sección en los dos temas y **míralas**. Los errores 3 y 8 se
vieron en una captura, no en una aserción.

## Comprobaciones estáticas

Rápidas y complementarias: sintaxis del JS, JSON-LD parseable, etiquetas
equilibradas, ids duplicados, anclas rotas, `aria-controls` sin destino, `alt` en
toda imagen, `rel="noopener"` en todo `target="_blank"`, llaves de CSS
equilibradas, variables sin definir, rutas locales rotas.

## Cuando encuentres un fallo

Añade la comprobación que lo habría cazado. El visor sin foto pasó todas las
pruebas porque ninguna miraba la imagen; ahora hay cinco aserciones que lo cubren.

## Honestidad al informar

Di el número real: "50/53, tres fallos" y cuáles. No lo redondees a verde. Y
distingue lo que es fallo de la web de lo que es tu entorno: una fuente bloqueada
por un proxy no es un defecto del sitio.
