# Errores conocidos

Trece fallos reales de una web de restaurante. Todos pasaron la revisión de
código. Todos aparecieron al abrir la página en un navegador.

Léelos antes de entregar. Cada uno lleva el síntoma, por qué ocurre y el arreglo.

---

## 1. Cabecera ilegible sobre la foto de portada en tema claro

**Síntoma.** El logotipo y el menú desaparecen sobre la portada. Contraste medido:
**1,38:1**, cuando el mínimo accesible es 4,5:1.

**Causa.** La cabecera flota sin fondo propio sobre una foto oscura, pero toma los
colores del tema. En tema oscuro el texto es crema y se lee; en claro es casi negro
sobre una foto casi negra.

**Por qué se escapa.** Se desarrolla en tema oscuro y se da por bueno. La mayoría de
móviles vienen en claro.

**Arreglo.** Mientras la cabecera no tenga fondo, fija colores claros pase lo que
pase con el tema. En cuanto se queda fija y gana fondo, que recupere los del tema.

```css
.header:not(.is-stuck):not(.header--solid) .nav__link {
  color: rgba(247, 243, 236, 0.86);
}
```

---

## 2. El visor de fotos no muestra ninguna imagen

El más grave, y el que mejor explica por qué hay que ejecutar la página.

**Síntoma.** El visor abre, el título cambia, las flechas funcionan. No se ve
ninguna foto.

**Causa.** Doble, y ninguna de las dos mitades es visible leyendo el código:

1. El `<img>` del visor llevaba `src=""`. Un src vacío **no es neutro**: el
   navegador lo resuelve contra la URL de la página, se descarga el HTML como si
   fuera una imagen y dispara un evento `error`.
2. El módulo que sustituye imágenes rotas por un motivo de marca reaccionaba a ese
   error y **reemplazaba el nodo**. El visor guardaba una referencia al `<img>`
   original, que quedaba fuera del documento: asignarle `.src` no hacía nada.

**Arreglo.** Píxel transparente como src inicial, y que el módulo de respaldo
ignore el visor y cualquier imagen sin src:

```html
<img id="lbImg" alt=""
     src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7">
```

```js
if (img.id === 'lbImg' || img.closest('#lightbox')) return;
if (!img.getAttribute('src')) return;
```

**La lección.** Las pruebas comprobaban que el visor *se abría*. Comprueba siempre
que la imagen **se ve**: `naturalWidth > 0` y tamaño renderizado mayor que cero.

---

## 3. Un botón a ancho completo desborda la columna entera

**Síntoma.** En móvil, el formulario y las tarjetas se salen por la derecha.

**Causa.** `.btn { white-space: nowrap }` más un texto largo
("Enviar solicitud por WhatsApp") dan un ancho mínimo de 487 px. Los elementos de
una cuadrícula no bajan de su `min-width: auto`, así que ese mínimo estira la
columna y con ella todo lo que comparte fila.

**Arreglo.**

```css
.btn--block { white-space: normal; text-align: center; }
.reserve__grid > * { min-inline-size: 0; }
```

**Generaliza.** Cualquier cuadrícula de dos columnas que colapse a una en móvil
necesita `min-inline-size: 0` en sus hijos.

---

## 4. Los controles del visor se salen de la pantalla

**Síntoma.** A partir de 768 px, los botones de cerrar y avanzar quedan fuera.

**Causa.** La misma de antes, dentro de una cuadrícula: el visor medía 768 px pero
sus filas 800. Con fotos reales de 1600 o 2000 px habría sido mucho peor.

**Arreglo.** `.lightbox > * { min-inline-size: 0 }` y la figura a `max-inline-size: 100%`.

---

## 5. `overflow-x: clip` esconde el problema en vez de arreglarlo

**Síntoma.** El test de desbordamiento da verde. La captura enseña el contenido
cortado por la derecha.

**Causa.** `overflow-x: clip` recorta lo que sobra, así que `scrollWidth` deja de
delatarlo. El contenido sigue siendo demasiado ancho: simplemente ya no se ve.

**Arreglo.** Sigue usándolo para contener las animaciones de entrada, pero **mide
anchos de elementos**, no el scroll de la página:

```js
if (rect.right > window.innerWidth + 1 || rect.left < -1) { /* se sale */ }
```

Excluye los elementos dentro de un ancestro con `overflow-x: auto | scroll`: ahí
salirse es intencionado (marquesinas, carruseles, pestañas deslizables).

---

## 6. `writing-mode` vertical invierte las propiedades lógicas

**Síntoma.** El indicador de scroll con `inset-inline-end` aparece a la izquierda.

**Causa.** Las propiedades lógicas siguen el modo de escritura **del propio
elemento**. Con `writing-mode: vertical-rl`, el eje en línea pasa a ser vertical:
`inset-inline-end` significa "abajo".

**Arreglo.** Propiedades físicas (`right`, `bottom`) en elementos rotados.

---

## 7. Área táctil por debajo de 44 px

**Síntoma.** Botones de 35 y 40 px de alto en móvil.

**Causa.** La regla dependía de `@media (pointer: coarse)`, que los emuladores no
reportan de forma fiable. En un móvil real puede funcionar; no lo sabrás.

**Arreglo.** Activar por las dos vías y no olvidar los botones de icono:

```css
@media (pointer: coarse), (max-width: 1000px) {
  .btn, .nav__link { min-block-size: 44px; display: inline-flex; align-items: center; }
  .theme-toggle, .burger { inline-size: 44px; block-size: 44px; }
}
```

**Ojo.** `min-block-size` puede quedarse corto si el elemento es un hijo flexible
comprimido. Si el cálculo dice 44 px y se ve 41, busca un contenedor flex que lo
esté encogiendo y ponle `flex: none`.

---

## 8. Un `<em>` dentro de un `<li>` flexible se va a otra columna

**Síntoma.** Los incisos de un menú —"(a elegir uno)"— aparecen en una columna
aparte en vez de seguir el texto.

**Causa.** En un contenedor flex, los nodos de texto sueltos se convierten en
elementos anónimos. El texto y el `<em>` quedan como dos elementos distintos.

**Arreglo.** No uses flex en el `<li>` para colocar la viñeta. Posiciónala con
`::before` absoluto y deja que el contenido fluya en línea.

---

## 9. Puntos de guía sueltos cuando el nombre ocupa dos líneas

**Síntoma.** Los puntos entre plato y precio quedan como restos al partir el nombre.

**Arreglo.** En estrecho, ocultarlos y alinear el precio con `margin-inline-start: auto`.

---

## 10. El aviso del mapa no cabe y aplasta su propio botón

**Síntoma.** El botón de cargar el mapa mide 41 px en vez de 44.

**Causa.** El aviso es una columna flexible dentro de un mapa de 300 px de alto en
móvil. Si el contenido no cabe, los elementos flexibles se comprimen.

**Arreglo.** `flex: none` en los hijos, `overflow-y: auto` como red de seguridad y
menos relleno en pantallas pequeñas (prescindiendo del icono si hace falta).

---

## 11. El parallax pisa el zoom del hover

**Síntoma.** El zoom al pasar el ratón deja de funcionar donde hay parallax.

**Causa.** El JS escribía `style.transform` y ganaba al `transform` del CSS.

**Arreglo.** Que el JS escriba una **variable CSS** y el CSS componga las dos:

```css
.about__media img { transform: translate3d(0, var(--py, 0px), 0) scale(var(--ps, 1)); }
.about__media:hover { --ps: 1.12; }
```

---

## 12. `cleanUrls` mete una redirección en cada enlace

**Síntoma.** Todos los enlaces internos y el sitemap pasan por un 308.

**Causa.** Con `cleanUrls: true`, Vercel sirve `/aviso-legal` y redirige
`/aviso-legal.html`. Si los enlaces llevan `.html`, cada clic es un salto de más, y
el sitemap apunta a URLs que redirigen, que es malo para SEO.

**Arreglo.** `cleanUrls: false` y `.html` en todas partes. Las mismas URLs sirven en
Vercel, en Netlify, en GitHub Pages y abriendo los archivos a pelo.

---

## 13. Declaraciones duplicadas y CSS muerto

Pasadas de limpieza que conviene hacer siempre:

- Dos `font-size` en la misma regla: gana el segundo, pero es ruido.
- CSS de componentes que al final no se usan (estrellas de valoración que no se
  publican porque no hay dato).
- Declaraciones inválidas que el navegador descarta en silencio, tipo
  `counter(s);` suelta en lugar de `content: counter(s);`.

Comprueba: llaves equilibradas, variables usadas sin definir, clases del HTML sin
estilo, rutas locales rotas.

---

## Lo que enseña la lista

Nueve de los trece son de maquetación y **solo se ven mirando la página**. Ninguna
revisión de código los habría encontrado: el CSS era válido y el JS no lanzaba
errores.

Ejecuta la página. Haz capturas. Míralas.
