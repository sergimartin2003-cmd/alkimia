# Arranque

Qué hacer en los primeros minutos, antes de escribir código.

## 1. Inventario

Separa lo recibido de lo que falta, y guárdalo en un archivo de trabajo. Es el
documento que gobierna todo: cada vez que dudes si puedes afirmar algo, se
responde ahí.

Marca de dónde sale cada afirmación. "Terraza climatizada" es un hecho si hay una
foto con estufas; es invención si solo te lo imaginas.

## 2. Mide las fotos antes de diseñar

Una tabla de tamaño real contra tamaño necesario. Condiciona qué foto va de
portada y evita descubrir al final que la principal mide 505 píxeles.

Descarta lo que no sirve: en una extracción de Google Maps vienen avatares de
reseñantes y miniaturas de 48 px mezclados con las fotos buenas.

## 3. Deduce el carácter del negocio de lo que tienes

La carta dice más que cualquier brief. Baos, dumplings, ponzu y katsuobushi sobre
base española son cocina de fusión; eso fija tono, paleta y tipografía.

Las fotos del local dan la paleta real: madera clara y sillas negras piden una
cosa; azulejo blanco, otra.

Las reseñas dan el argumento de venta. Si varias repiten que explican cada plato,
eso va en "sobre nosotros" porque es verdad y porque vende.

## 4. Elige antes de empezar

- **Portada**: una foto del local, no de un plato. Y la de mayor resolución.
- **Paleta**: tokens CSS desde el primer minuto, nunca colores sueltos.
- **Tipografía**: una display con carácter y una sans limpia. Con pila de reserva
  real: si Google Fonts falla, la web tiene que seguir siendo digna.
- **Acento**: un solo color de acento en toda la web. Cambiarlo debe ser cambiar
  una variable.

## 5. Escribe el esqueleto antes que el detalle

CSS por bloques numerados y con índice arriba. JavaScript en módulos
independientes, cada uno en su `try`, para que un fallo no tumbe la página entera:

```js
[initTema, initCabecera, initVisor, ...].forEach(fn => {
  try { fn(); } catch (err) { console.warn('[web] Fallo al iniciar ' + fn.name, err); }
});
```

## 6. Verifica pronto, no al final

En cuanto haya portada y una sección, levanta el servidor y mira la página. Los
errores de maquetación se arrastran: cuanto antes los veas, menos cuestan.

Si no tienes fotos reales, genera rellenos. Sirven perfectamente para juzgar la
maquetación.

## Lo que no debes hacer

- **No pidas permiso para empezar.** Con nombre, dirección y teléfono hay web.
  Lo que falte se marca como "Consultar" y se sigue.
- **No pares en el primer hueco.** Haz todo lo que no dependa de ese dato.
- **No entregues una lista de pasos cuando puedes hacerlo tú.** Si el cliente se
  ha atascado, arréglalo y explica después.
