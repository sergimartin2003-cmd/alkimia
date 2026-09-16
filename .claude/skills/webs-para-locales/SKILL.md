---
name: webs-para-locales
description: Crear la web completa de un negocio local (restaurante, bar, cafetería, tienda, peluquería, taller, clínica) a partir de lo que el cliente tenga a mano: su ficha de Google Maps, fotos sueltas, una carta fotografiada o unos datos pegados en el chat. Produce un sitio estático en HTML, CSS y JavaScript sin dependencias, con sus páginas legales españolas, listo para publicar en Vercel, Netlify o cualquier hosting. Úsala cuando pidan "una web para mi local", "la web del restaurante", "pasar mi ficha de Google Maps a una web", "una landing para el negocio", o entreguen fotos y datos de un local esperando un sitio publicable. No la uses para aplicaciones con backend, tiendas online con pasarela de pago ni proyectos con framework.
---

# Webs para negocios locales

Esta skill existe porque una web de local parece fácil y no lo es. El diseño
sale rápido; lo que hunde el trabajo son dos cosas: **inventar datos que el
cliente no te dio** y **dar por buena una maquetación que nunca has visto en un
navegador**. Las dos secciones marcadas como no negociables cubren exactamente eso.

## Antes de escribir código

`referencias/arranque.md`: inventario, medir las fotos, deducir el carácter del
negocio de su carta y sus reseñas, y qué decidir antes de empezar.

## Lo primero: inventario honesto

Antes de escribir una línea, separa lo que **te han dado** de lo que **falta**.
Escríbelo. Es el documento que gobierna todo lo demás.

| Dato | Si lo tienes | Si no lo tienes |
| --- | --- | --- |
| Nombre, dirección, teléfono | Úsalo tal cual | Pídelo: sin esto no hay web |
| Horarios | Publícalos + `openingHoursSpecification` | **"Consultar"** y nota en el README |
| Valoración media | Publícala + `aggregateRating` | **Omítela por completo** |
| Carta o catálogo | Sección propia + `schema.org` | Sección fuera |
| Reseñas | Cítalas literales con autor y fecha | Sección fuera |
| Redes sociales | Enlázalas | Deja solo teléfono y mapa |
| Fotos | Ver `referencias/fotos-y-clientes.md` | Motivo de marca de reserva |

### Regla que no se negocia: no inventar

No rellenes huecos. Un horario inventado hace que alguien se plante en la puerta
un día de cierre. Una valoración inventada en el `schema.org` incumple las
directrices de Google y puede costar la ficha enriquecida del negocio.

Lo que sí puedes hacer:

- **Deducir de evidencia.** Si una foto enseña estufas en la terraza, "terraza
  climatizada" es un hecho observable. Si la carta tiene menú infantil, el local
  admite niños. Anota de dónde sale cada afirmación.
- **Redactar.** El texto de "sobre nosotros" es trabajo de copywriting sobre
  hechos reales, no invención. Describir una carta con baos y ponzu como "cocina
  de fusión" es leer, no inventar.
- **Marcar lo pendiente.** `Consultar` visible en la web, más una entrada en el
  README explicando exactamente dónde se rellena.

Cuando un dato venga de material viejo (una carta fotografiada hace años), publícalo
con aviso: *"Precios orientativos, confirmar por teléfono"*. Es más útil que
esconderlo y más honesto que darlo por vigente.

## Secciones

Cabecera fija · Portada · Sobre el local · Carta o catálogo · Galería con visor ·
Información práctica · Servicios · Mapa · Contacto y reserva · Pie con enlaces legales.

Detalles de construcción y decisiones de contenido: `referencias/secciones.md`.

## Decisiones técnicas que ya están tomadas

No las reabras salvo que el encargo pida otra cosa.

- **HTML, CSS y JS a pelo.** Sin framework, sin build, sin npm. El cliente tiene
  que poder abrir `index.html` con doble clic y publicarlo arrastrando la carpeta.
- **Formulario de reserva sin servidor.** Valida en el navegador y abre WhatsApp
  con el mensaje redactado. Funciona en hosting estático, no hay base de datos que
  mantener y no tratas datos personales. Es la solución correcta, no un apaño.
- **El mapa no carga hasta que lo aceptan.** Un iframe de Google fija cookies de
  terceros. Ponlo tras un botón de consentimiento: cumple la LSSI y de paso la
  primera visita no descarga el iframe.
- **Tema claro y oscuro** con el claro como predeterminado del sistema. La mayoría
  de móviles vienen en claro: prueba ahí antes de darlo por bueno.
- **`schema.org` con el catálogo entero.** Es lo que produce la ficha enriquecida.
  Cada plato aparece dos veces, en el HTML visible y en el JSON-LD: al cambiar un
  precio hay que tocar los dos o Google mostrará uno distinto al de la web.

## Verificación: obligatoria, en navegador

**Una web de local no se entrega sin abrirla en un navegador de verdad.**

En esta skill hay trece fallos documentados que pasaron todas las revisiones de
código y solo aparecieron al ejecutar la página. Uno de ellos dejaba el visor de
fotos sin mostrar ninguna imagen, y las pruebas lo daban por bueno porque
comprobaban que el visor *se abría*, no que la foto *se viera*.

Antes de entregar, lee `referencias/errores-conocidos.md`. Son fallos reales con
su causa y su arreglo; te ahorran el ciclo entero de descubrirlos.

El arnés de pruebas está en `plantillas/verificar.mjs` y el método completo en
`referencias/verificacion.md`. Comprueba, como mínimo:

1. **Desbordamiento horizontal** de 320 a 1920 px, ignorando los contenedores con
   scroll intencionado. Cuidado: `overflow-x: clip` oculta el desbordamiento del
   test sin arreglarlo. Mide anchos de elementos, no solo el scroll de la página.
2. **Contraste de la cabecera sobre la foto de portada, en tema claro.** Es el
   fallo que más veces se escapa.
3. **Que las imágenes se vean**, no que los contenedores existan:
   `naturalWidth > 0` y tamaño renderizado real.
4. **Área táctil de 44 px** en todo lo pulsable, por ancho de pantalla y no por
   `pointer: coarse`, que los emuladores no reportan de forma fiable.
5. **Sin JavaScript** el contenido sigue leyéndose.
6. **`prefers-reduced-motion`**: nada se queda invisible.

## El cliente no sabe programar

Asúmelo desde el principio. Si el último paso depende de que renombre catorce
archivos sin equivocarse, el trabajo no está terminado.

- Entrega **herramientas, no instrucciones**. `plantillas/preparar-fotos.html` se
  abre con doble clic, renombra, recorta y comprime las fotos, y devuelve un ZIP.
  Sin instalar nada y sin subir las fotos a ningún sitio.
- Escribe el README para quien **no sabe qué es git**. Enlaces directos, nombres
  de botones literales, qué verá en pantalla al acertar.
- **Que nada se vea roto por estar incompleto.** Si falta una foto, un motivo de
  la marca; nunca el icono de imagen rota del navegador.

Los dos atascos que se repiten y cómo prevenirlos —subir el ZIP en vez de su
contenido, y alimentar la herramienta con miniaturas— están en
`referencias/fotos-y-clientes.md`.

## Legal español

Toda web de un negocio en España necesita aviso legal (LSSI 34/2002),
política de privacidad (RGPD) y política de cookies. Genéralas describiendo
**cómo funciona esa web concreta**, no con plantillas genéricas: si no instalas
cookies, dilo; si el formulario abre WhatsApp, explícalo.

Los datos fiscales del titular no te los inventas nunca: déjalos marcados
visualmente como pendientes. Detalle en `referencias/legal-espana.md`.

## Publicar

`referencias/publicar.md` cubre el despliegue en Vercel y los tres sitios donde
se atasca todo el mundo: la protección que obliga a iniciar sesión, el botón de
rollback y qué URL hay que compartir.
