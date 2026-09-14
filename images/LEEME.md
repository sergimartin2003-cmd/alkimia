# Fotografías

Esta carpeta está vacía a propósito: **las fotos las tienes que poner tú**.
El código ya las referencia con estos nombres exactos, así que basta con
copiarlas aquí con el nombre correspondiente. No hace falta tocar el HTML.

## Archivos que la web espera

| Nombre del archivo             | Qué foto va aquí                                            | Dónde aparece            | Tamaño recomendado |
| ------------------------------ | ----------------------------------------------------------- | ------------------------ | ------------------ |
| `hero.jpg`                     | Panorámica de la sala con la barra al fondo                  | Portada, a pantalla completa | 2000 × 950 px  |
| `interior-barra.jpg`           | La barra con las estanterías de botellas y la cafetera       | «El local» + galería     | 1600 × 1200 px     |
| `interior-comedor.jpg`         | Comedor con mesas de madera y sillas negras                  | «El local» + galería     | 1200 × 1200 px     |
| `interior-noche.jpg`           | La sala de noche con las bombillas encendidas                | Galería (pieza vertical) | 1000 × 2000 px     |
| `terraza.jpg`                  | La terraza cubierta al anochecer                             | Galería (pieza ancha)    | 1600 × 800 px      |
| `plato-nachos.jpg`             | Nachos a la pastora                                          | Galería (pieza ancha)    | 1600 × 800 px      |
| `plato-steak-tartar.jpg`       | Tosta de steak tartar con puerro frito                       | Galería                  | 1200 × 1200 px     |
| `plato-gamba-crujiente.jpg`    | Gamba crujiente con salsa tártara                            | Galería                  | 1200 × 1200 px     |
| `plato-tostas-anchoa.jpg`      | Tostas de anchoa sobre pizarra                               | Galería                  | 1200 × 1200 px     |
| `plato-navajas.jpg`            | Navajas con picadillo y vinagreta                            | Galería                  | 1200 × 1200 px     |
| `plato-patatas.jpg`            | Patatas con salsa y cebolla encurtida                        | Galería                  | 1200 × 1200 px     |
| `postre-coulant.jpg`           | Coulant de chocolate con helado                              | Galería                  | 1200 × 1200 px     |
| `postre-bizcocho.jpg`          | Bizcocho templado con helado                                 | Galería                  | 1200 × 1200 px     |
| `og.jpg`                       | La mejor foto del local, recortada a 1200 × 630              | Vista previa al compartir en WhatsApp, Facebook, X | 1200 × 630 px |

También conviene un `apple-touch-icon.png` de 180 × 180 px en la raíz del
proyecto (no en esta carpeta) para el icono en iPhone.

## Si falta alguna foto

No pasa nada: en lugar del icono de imagen rota del navegador aparece un
motivo con el símbolo de la marca. La web sigue funcionando, pero conviene
completarlas todas antes de publicar.

## Antes de subirlas

1. **Recórtalas** con la proporción indicada arriba. Las cuadradas de galería
   se recortan solas por CSS, pero recortarlas bien evita que se corte la
   parte interesante del plato.
2. **Redúcelas de peso.** Una foto de móvil pesa 3–5 MB y no hace falta.
   Pásalas por [squoosh.app](https://squoosh.app) y deja cada una por debajo
   de 250 KB. La web cargará mucho más rápido en móvil, que es de donde va a
   venir la mayoría de las visitas.
3. **Formato.** `.jpg` funciona perfectamente. Si quieres afinar más, WebP
   pesa un 30 % menos; en ese caso renombra también las referencias en
   `index.html` (busca `/images/` y cambia la extensión).

## Sobre el origen de las fotos

Las fotos que aparecen en la ficha de Google Maps del local las han subido
en su mayoría los clientes, y **los derechos son de quien las hizo**. Para la
web del negocio lo correcto es usar fotos propias: hechas por vosotros o por
un fotógrafo contratado. Si queréis usar la foto de un cliente, pedidle
permiso antes.
