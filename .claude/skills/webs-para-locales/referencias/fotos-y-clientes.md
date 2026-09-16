# Fotos y clientes

El paso donde más veces se atasca todo. Dos atascos reales, con su prevención.

## Atasco 1: sube el ZIP en vez de su contenido

**Qué pasó.** La herramienta devuelve `fotos-alkimia.zip`. El cliente lo subió tal
cual a la carpeta `images`. Un navegador no abre ZIPs: la web seguía buscando
`hero.jpg` y mostrando el motivo de reserva. Conclusión del cliente: *"no se
actualiza la web"*.

**Prevención.**

- En el README, el paso de descomprimir va **en negrita y en línea aparte**, no
  encadenado a otro.
- La herramienta lo repite en su propia pantalla, en el paso 4.
- Si te dicen que la web no se actualiza, **mira qué hay en la carpeta antes de
  explicar nada**. Un `get_file_contents` de `images/` resuelve la duda en un
  segundo.

**Arreglo si ya ocurrió.** No le mandes repetir el proceso. Descomprime tú: trae
la rama, extrae el ZIP, comprueba que son JPEG válidos, borra el ZIP y publica.

## Atasco 2: mete miniaturas en la herramienta

**Qué pasó.** Las fotos salieron de una extracción de Google Maps, donde las URLs
llevan el tamaño escrito: `=w298-h298-k-no`. El cliente guardó **esas**. La
portada acabó a 505×240 píxeles mostrándose a pantalla completa.

**Prevención.** Explica antes de que ocurra que las URLs de Google llevan el
tamaño al final y se puede pedir la grande:

```
...GCWePv8s=w533-h240-k-no      ← miniatura
...GCWePv8s=s2000               ← cámbialo por esto
```

Pegar la URL modificada en el navegador y guardar la imagen.

**Detección.** Después de recibir las fotos, **mide siempre**. Una tabla de
tamaño real contra tamaño necesario enseña el problema mejor que cualquier
explicación, y demuestra que no es un fallo de la web.

## La herramienta

`plantillas/preparar-fotos.html` se abre con doble clic, sin servidor ni
instalación. Muestra los huecos descritos en lenguaje llano ("la barra", "el
comedor"), acepta fotos arrastradas de golpe o una a una, y devuelve un ZIP con
todas renombradas, recortadas y comprimidas.

Decisiones que importan:

- **Todo en el navegador.** Las fotos no se suben a ningún sitio. Díselo en la
  propia página: es un negocio real y sus fotos son suyas.
- **Reduce pero nunca amplía.** Estirar una foto pequeña la deja borrosa. Mejor
  pequeña y nítida, y que se note que falta el original.
- **Recorte centrado** que llena el marco sin deformar, como `object-fit: cover`.
- **Calidad por pasos** hasta entrar en unos 250 KB.
- **Un solo ZIP**, no catorce descargas que el navegador bloquearía. Escritor ZIP
  propio de unas sesenta líneas, sin comprimir porque el JPEG ya lo está.

Para adaptarla a otro negocio, cambia el array `SLOTS`: nombre de archivo, ancho,
alto, descripción y pista de cada hueco.

**Pruébala por `file://`**, que es como se va a usar. Algunos navegadores tratan
distinto el canvas fuera de un servidor.

## Que nada se vea roto

Si falta una foto, un motivo de la marca en su lugar. Nunca el icono de imagen
rota: da sensación de web abandonada y el cliente cree que algo falló.

```js
function replace(img) {
  var box = document.createElement('span');
  box.className = 'img-fallback';
  box.setAttribute('role', 'img');
  box.setAttribute('aria-label', img.getAttribute('alt') || 'Fotografía no disponible');
  box.innerHTML = FALLBACK_SVG;
  img.parentNode.replaceChild(box, img);
}
```

**Cuidado**: este módulo causó el error 2. Que ignore las imágenes que rellena el
JavaScript y las que no tengan `src` real.

## Derechos

Las fotos de una ficha de Google Maps las suben en su mayoría los clientes, y los
derechos son de quien hizo la foto. Dilo una vez, sin sermón: para la web del
negocio lo correcto son fotos propias.

No lo repitas en cada mensaje. Una vez, clara, y seguir trabajando.

## Escribir para quien no programa

- **Enlaces directos.** No "ve al repositorio y navega hasta", sino la URL exacta
  que abre la pantalla correcta.
- **Nombres de botones literales**, como salen en pantalla: *Add file → Upload
  files*, *Commit changes*.
- **Qué verá al acertar.** "Aparecerá un despliegue en Building y al minuto pasará
  a Ready." Sin esto no sabe si funcionó.
- **Cuando se atasque, arréglalo tú** si puedes, y explica después. Frustrado y
  con otra lista de pasos delante es como se abandona un proyecto.
