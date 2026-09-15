# Alkimia New Tavern — sitio web

Web estática, sin dependencias ni proceso de compilación, para el restaurante
**Alkimia New Tavern** (C. Alcalde Rodrigo Manchón España, 4, bajo — 30820
Alcantarilla, Murcia · 623 28 86 81).

Tres archivos, HTML + CSS + JavaScript puro. Se abre con doble clic y se
publica arrastrando la carpeta. No hay npm, ni build, ni framework.

---

## 1. Puesta en marcha en 3 pasos

### Paso 1 — Poner las fotos

La carpeta `images/` está vacía: las fotos las pones tú. Hay dos formas, y la
primera no requiere saber nada de programación.

#### Forma A — con la herramienta incluida (recomendada)

El proyecto trae una herramienta que **renombra, recorta y comprime** tus
fotos sola. Así no tienes que acertar con catorce nombres de archivo ni
preocuparte de que las fotos del móvil pesen 4 MB.

1. En GitHub, botón verde **Code → Download ZIP**. Descomprime lo que baja.
2. Dentro de la carpeta, abre `herramientas/preparar-fotos.html` haciendo
   **doble clic**. Se abre en tu navegador como una página normal.
3. Arrastra todas tus fotos a la caja grande: se van colocando en orden.
   Si alguna no queda donde toca, arrástrala a su hueco correcto.
4. Pulsa **Descargar las fotos preparadas**. Baja un `fotos-alkimia.zip`.
5. Descomprímelo y mete esas fotos en la carpeta `images` del proyecto.

Tus fotos no salen de tu ordenador en ningún momento: la herramienta
trabaja dentro del navegador, sin conexión y sin subir nada a ningún sitio.

> **Si una foto sale más pequeña de lo indicado** es porque la original ya lo
> era. La herramienta reduce, pero nunca amplía: estirar una foto pequeña la
> deja borrosa y se nota.

#### Forma B — a mano

Renombra tú las fotos siguiendo la tabla de
[`images/LEEME.md`](images/LEEME.md) y cópialas en `images/`. Recórtalas a la
proporción indicada y pásalas por [squoosh.app](https://squoosh.app) para
dejarlas por debajo de 250 KB.

#### Cómo subirlas a GitHub

Si quieres que el repositorio quede actualizado (y no solo tu copia local):

1. Entra en el repositorio y asegúrate de estar en la rama
   `claude/dazzling-archimedes-3gihi8` (selector de ramas arriba a la
   izquierda).
2. Entra en la carpeta `images`.
3. **Add file → Upload files**.
4. Arrastra las catorce fotos ya renombradas.
5. Abajo, **Commit changes**.

Si en lugar de eso vas a publicar arrastrando la carpeta a Vercel, no hace
falta este paso: basta con que las fotos estén en tu carpeta local.

> **Sobre los derechos de las fotos:** las que aparecen en la ficha de Google
> Maps las suben en su mayoría los clientes, y los derechos son de quien hizo
> la foto. Para la web del negocio usa fotos propias, hechas por vosotros o
> por un fotógrafo. Si quieres usar la de un cliente, pídele permiso antes.

### Paso 2 — Rellenar los datos pendientes

Cuatro cosas se quedaron a medias porque no disponía de la información. Todas
están marcadas en el código y se explican en el apartado 4 de este documento:

| Qué falta | Dónde se cambia |
| --------- | --------------- |
| Horarios de apertura | `index.html`, busca `hours--pending` |
| Datos fiscales del titular | las tres páginas legales, busca `fill-in` |
| Dominio definitivo | `index.html`, `robots.txt`, `sitemap.xml` |
| Redes sociales | `index.html`, busca `footer__socials` |

### Paso 3 — Publicar

Ver el apartado 5 (Vercel, Netlify o GitHub Pages).

---

## 2. Estructura de archivos

```
alkimia/
├── index.html                  Página principal (todas las secciones)
├── styles.css                  Hoja de estilos completa, comentada por bloques
├── script.js                   JavaScript, dividido en módulos independientes
│
├── aviso-legal.html            ┐
├── politica-privacidad.html    ├ Páginas legales (obligatorias en España)
├── politica-cookies.html       ┘
├── 404.html                    Página de error
│
├── images/                     ← TUS FOTOS VAN AQUÍ (ver images/LEEME.md)
│
├── herramientas/
│   └── preparar-fotos.html     Renombra, recorta y comprime tus fotos
│
├── favicon.svg                 Icono de la pestaña del navegador
├── site.webmanifest            Permite "añadir a pantalla de inicio" en móvil
├── robots.txt                  Instrucciones para Google
├── sitemap.xml                 Mapa del sitio para buscadores
├── vercel.json                 Cabeceras de seguridad y caché
└── .vercelignore               Deja fuera de la web el README y las herramientas
```

Para verlo en local basta con abrir `index.html` en el navegador. Si algún
enlace absoluto (`/styles.css`) no carga, levanta un servidor simple:

```bash
python3 -m http.server 8000
# luego abre http://localhost:8000
```

---

## 3. Qué incluye

**Secciones**: portada a pantalla completa · el local · carta completa con
pestañas · galería con visor ampliable · reseñas reales de Google ·
información práctica · servicios · mapa · formulario de reserva · pie de
página con enlaces legales.

**Funciona sin tocar nada**:

- Menú hamburguesa en móvil, con cierre por `Esc` y bloqueo del scroll.
- Visor de fotos con teclado (flechas, `Inicio`, `Fin`, `Esc`), gesto de
  deslizar en móvil, miniaturas y precarga de la foto siguiente.
- Carta en pestañas navegables con las flechas del teclado.
- Tema claro y oscuro, con botón y memoria de la preferencia.
- Animaciones de entrada al hacer scroll, desactivadas automáticamente si el
  sistema tiene activado «reducir movimiento».
- Barra de progreso de lectura y botón flotante de WhatsApp.

**Preparado para buscadores**: etiquetas `title`/`description`, Open Graph
para que se vea bien al compartir por WhatsApp, y datos estructurados
`schema.org/Restaurant` con **la carta entera** (28 platos con sus precios).
Esto último es lo que permite que Google muestre la ficha enriquecida.

**Accesibilidad**: navegación completa por teclado, foco visible, `alt` en
todas las imágenes, etiquetas ARIA en menús y visor, contraste alto en ambos
temas, enlace para saltar al contenido.

### El formulario de reserva

No hay servidor detrás, y aun así funciona: al enviarlo **compone un mensaje y
abre WhatsApp** con todo escrito (nombre, teléfono, día, hora, comensales,
zona y notas). El cliente solo pulsa enviar.

Ventajas: funciona en cualquier hosting gratuito, no hay base de datos que
mantener, no tratas datos personales en un servidor y llega al sitio donde
realmente vas a contestar. El número está en `script.js`, constante
`WHATSAPP_NUMBER`.

---

## 4. Lo que tienes que completar

### 4.1 Horarios de apertura *(recomendado)*

Un restaurante sin horario publicado pierde reservas, y Google lo penaliza en
resultados locales. Ahora mismo pone «Consultar».

En `index.html`, busca `hours--pending` y sustituye ese bloque por:

```html
<ul class="hours" role="list">
  <li class="hours__row" data-day="1"><span class="hours__day">Lunes</span>     <span class="hours__time">Cerrado</span></li>
  <li class="hours__row" data-day="2"><span class="hours__day">Martes</span>    <span class="hours__time">13:00–16:00</span></li>
  <li class="hours__row" data-day="3"><span class="hours__day">Miércoles</span> <span class="hours__time">13:00–16:00 · 20:00–23:30</span></li>
  <!-- data-day: 0 domingo, 1 lunes, 2 martes … 6 sábado -->
</ul>
```

El día actual se resalta solo en cobre. También conviene añadir el horario al
bloque de datos estructurados del `<head>` (busca `openingHoursSpecification`
en el comentario que hay allí).

### 4.2 Datos del titular *(obligatorio por ley)*

Las tres páginas legales llevan recuadros punteados con fondo cobre. Cada uno
marca un dato que **debes** rellenar: razón social, NIF/CIF, correo de contacto
y proveedor de alojamiento. Busca `fill-in` en los tres archivos.

La Ley 34/2002 (LSSI-CE) exige que esta información sea veraz y accesible. Los
textos son una base sólida y describen con exactitud cómo funciona esta web,
pero **no son asesoramiento jurídico**: si el negocio tiene asesoría, que les
eche un vistazo.

### 4.3 Dominio definitivo

Antes de publicar, sustituye `https://alkimia-new-tavern.vercel.app` por el
dominio real en:

- `index.html` — `canonical`, Open Graph y datos estructurados
- `robots.txt` — la línea `Sitemap:`
- `sitemap.xml` — las cuatro URLs
- las tres páginas legales — la etiqueta `canonical`

Un comando resuelve todo de golpe:

```bash
grep -rl 'alkimia-new-tavern.vercel.app' . \
  | xargs sed -i 's|https://alkimia-new-tavern.vercel.app|https://tudominio.com|g'
```

### 4.4 Redes sociales

En el pie hay tres iconos: Google Maps, WhatsApp y teléfono. Si tenéis
Instagram o Facebook, añádelos ahí (busca `footer__socials`). Si no, déjalo
como está — es mejor no tener enlace que tener uno a un perfil abandonado.

### 4.5 Valoración de Google *(opcional)*

La web muestra reseñas reales, pero **no muestra una nota media con estrellas**
porque no disponía del dato confirmado. Si quieres añadirla, incorpora al
`schema.org` del `<head>` la nota y el número real de reseñas:

```json
"aggregateRating": {
  "@type": "AggregateRating",
  "ratingValue": "4.6",
  "reviewCount": "312"
}
```

Tiene que ser **el dato real de tu ficha de Google**. Publicar una valoración
inventada incumple las directrices de Google y puede costar la retirada de la
ficha enriquecida.

---

## 5. Publicar la web

### Vercel *(el más directo)*

**Opción A — arrastrar la carpeta.** Entra en
[vercel.com/new](https://vercel.com/new), elige *Deploy* y arrastra la carpeta
del proyecto. En menos de un minuto tienes una URL `.vercel.app` funcionando.

**Opción B — desde GitHub** (recomendada si vas a hacer cambios):

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel: *Add New → Project → Import Git Repository*.
3. Framework Preset: **Other**. Build Command: **vacío**. Output Directory:
   **vacío** (la raíz).
4. *Deploy*.

A partir de ahí, cada `git push` republica la web sola.

El archivo `vercel.json` ya viene configurado con cabeceras de seguridad
(`X-Content-Type-Options`, `Referrer-Policy`, HSTS) y caché de un año para las
imágenes.

**Dominio propio**: en *Settings → Domains*, añade tu dominio y apunta los DNS
donde te indique. El certificado HTTPS es automático y gratuito.

### Netlify

Arrastra la carpeta a [app.netlify.com/drop](https://app.netlify.com/drop).
Listo. Para cabeceras equivalentes a las de `vercel.json`, crea un archivo
`_headers` (Netlify ignora `vercel.json`).

### GitHub Pages

En el repositorio: *Settings → Pages → Source: Deploy from a branch*, rama
`main`, carpeta `/ (root)`. Tarda un par de minutos. Ojo: GitHub Pages no
aplica `vercel.json`, así que pierdes las cabeceras de seguridad.

---

## 6. Antes de dar la web por buena

- [ ] Las 14 fotos están en `images/` y pesan menos de 250 KB cada una
- [ ] Horarios publicados (o asumido que quede «Consultar»)
- [ ] Datos fiscales rellenados en las tres páginas legales
- [ ] Dominio definitivo sustituido en los seis sitios
- [ ] Probado el botón de llamar desde un móvil real
- [ ] Probado el formulario: ¿llega bien el mensaje de WhatsApp?
- [ ] Carta revisada por el restaurante: precios y platos al día
- [ ] Menús de grupo: confirmar si siguen vigentes o quitarlos

---

## 7. Notas de mantenimiento

**Cambiar un precio de la carta**: en `index.html`, busca el nombre del plato.
Aparece dos veces — en el bloque visible y en los datos estructurados del
`<head>`. **Cambia los dos**, o Google mostrará un precio distinto al de la web.

**Añadir un plato**: copia un bloque `<li class="dish">` completo, cambia
nombre y precio, y añade también su entrada en el `hasMenuItem` correspondiente
del `<head>`.

**Cambiar colores**: todo el sistema de color vive en las variables CSS del
bloque `02. TOKENS DE DISEÑO`, al principio de `styles.css`. Cambiando
`--c-copper-400` cambia el acento de toda la web de una vez.

**Rendimiento**: la web no carga ninguna librería externa. Lo único que viene
de fuera son las tipografías de Google Fonts y, solo si el visitante lo acepta,
el mapa. Lo más pesado serán tus fotos: compriímelas y notarás la diferencia.

**Sobre `cleanUrls`**: está en `false` a propósito. Con `true`, Vercel serviría
`/aviso-legal` y redirigiría `/aviso-legal.html`, de modo que todos los enlaces
internos y el sitemap pasarían por una redirección innecesaria. Dejándolo en
`false`, las mismas URLs funcionan en Vercel, en Netlify, en GitHub Pages y
abriendo los archivos directamente en el navegador.
