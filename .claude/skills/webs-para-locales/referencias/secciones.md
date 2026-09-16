# Secciones

Qué lleva cada una y las decisiones que ya están resueltas.

## Cabecera

Logotipo, navegación fija, botón de acción destacado (llamar o reservar) y
hamburguesa en móvil. Se condensa al bajar y se oculta al desplazarse hacia
abajo, reapareciendo al subir.

Sobre la portada no tiene fondo: **fija colores claros ahí** (error conocido 1).

## Portada

Foto a pantalla completa con degradado, nombre grande, una frase que diga a qué
sabe el sitio, botones de acción y una tira de datos rápidos.

- Valoración con estrellas **solo si el cliente dio el dato**. Si no, fuera.
- Zoom lentísimo tipo Ken Burns, anulado con `prefers-reduced-motion`.
- La foto de portada es la más pesada de la primera vista: `preload` con
  `fetchpriority="high"`.
- Elige **una foto del local, no de un plato**. Enseña dónde va a entrar la gente.

## Sobre el local

Dos columnas: imágenes superpuestas a un lado, texto al otro, más tarjetas de
rasgos destacados.

El texto es copywriting sobre hechos, no invención. Se escribe leyendo la carta,
las fotos y las reseñas. Si las reseñas repiten que explican cada plato, eso es
un hecho del negocio y merece una frase.

## Carta o catálogo

Pestañas por categoría, con navegación por flechas del teclado. Nombre, puntos de
guía y precio alineado.

- Los precios van **también en el JSON-LD**. Al cambiar uno hay que tocar los dos
  sitios.
- Material de fecha dudosa: publícalo con aviso de precios orientativos.
- Aviso de alérgenos al final. Es obligatorio informar y da confianza.
- `S/C` o "según mercado" se respetan tal cual, no se convierten en un número.

## Galería

Cuadrícula con `grid-auto-flow: row dense` y piezas anchas y altas mezcladas para
romper la monotonía. Visor con teclado, gesto de deslizar, miniaturas y precarga
de la foto contigua.

Cuidado con el visor: es donde vivían los errores 2 y 4.

## Información práctica

Tarjetas: dirección con enlace a cómo llegar, teléfono pulsable, horarios y rango
de precios. Cada una con su acción al pie.

- Horarios: si los hay, tabla con el día actual resaltado y `data-day` de 0
  (domingo) a 6. Si no, **"Consultar"** y un botón para llamar.
- El rango de precios se puede deducir de la carta: es leer, no inventar.

## Servicios

Cuadrícula de iconos. **Solo lo que puedas demostrar**: si una foto enseña
estufas, hay terraza climatizada; si la carta tiene menú infantil, admite niños.

Wifi, parking y pago con tarjeta **no se suponen nunca**. O te lo dicen, o fuera.

## Mapa

Iframe de Google tras un botón de consentimiento (ver `legal-espana.md`).
400-500 px en escritorio, 300 en móvil.

El iframe funciona sin clave de API:
`https://maps.google.com/maps?q=<dirección>&z=17&output=embed`

Debajo, la dirección completa y un botón a Google Maps para quien prefiera su app.

## Contacto y reserva

Formulario que **compone un mensaje de WhatsApp**, más llamada directa y enlace
al mapa.

El formulario valida nombre, teléfono (mínimo 9 dígitos), fecha no pasada, hora,
comensales y aceptación de la política de privacidad. Al enviar abre
`https://wa.me/<número>?text=<mensaje>`.

Contempla el bloqueo de ventanas emergentes: si `window.open` devuelve null,
enseña el teléfono para copiar.

Deja claro que **la reserva no está confirmada hasta que el local responda**.

## Pie

Copyright con año automático, contacto, enlaces legales, redes solo si existen y
**atribución a Google Maps**, obligatoria si usas su mapa o citas sus reseñas.

En móvil, relleno inferior suficiente para que el botón flotante no tape la
última línea de forma permanente.

## Reseñas

Si hay reseñas reales, merecen sección propia: convencen más que cualquier texto
que escribas tú.

- **Literales**, incluido el corte con "…" si venían cortadas.
- Nombre y antigüedad tal como aparecen.
- **Sin estrellas** salvo que sepas la puntuación de cada una.
- Iniciales como avatar: evita cargar imágenes de perfil de terceros.
- Carrusel con sangrado a los bordes en móvil, cuadrícula en escritorio.
