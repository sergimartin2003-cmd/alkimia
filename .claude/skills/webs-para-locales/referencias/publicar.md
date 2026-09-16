# Publicar

## Estructura

```
index.html · styles.css · script.js · images/
aviso-legal.html · politica-privacidad.html · politica-cookies.html · 404.html
favicon.svg · apple-touch-icon.png · site.webmanifest
robots.txt · sitemap.xml · vercel.json · .vercelignore
README.md · herramientas/preparar-fotos.html
```

## vercel.json

```json
{
  "cleanUrls": false,
  "headers": [
    { "source": "/(.*)", "headers": [
      { "key": "X-Content-Type-Options", "value": "nosniff" },
      { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
      { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" }
    ]},
    { "source": "/images/(.*)", "headers": [
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]}
  ]
}
```

`cleanUrls` en `false`: ver error 12.

## .vercelignore

El README y las herramientas no son parte de la web del cliente:

```
herramientas/
README.md
images/LEEME.md
```

## Dominio provisional

Las URLs absolutas de `canonical`, Open Graph, `sitemap.xml` y `robots.txt`
necesitan un dominio. Usa uno provisional y deja preparado el reemplazo:

```bash
grep -rl 'PROVISIONAL.vercel.app' . | xargs sed -i 's|https://PROVISIONAL.vercel.app|https://tudominio.com|g'
```

## Los tres atascos de Vercel

### Pide iniciar sesión a todo el mundo

**Deployment Protection** viene activada. Está pensada para webs en pruebas.

*Settings → Deployment Protection → Vercel Authentication → Disabled → Save.*
Se aplica al instante, sin volver a publicar. Comprobar en ventana de incógnito.

### Dos URLs y no son iguales

| URL | Qué es |
| --- | --- |
| `proyecto.vercel.app` | La de producción. **Esta se comparte** |
| `proyecto-a3eec729n-usuario.vercel.app` | De *una publicación concreta*. Cambia en cada subida y puede seguir protegida |

### Instant Rollback

Botón muy visible que hace producción de una versión anterior. **No toca GitHub**:
el código y las fotos siguen ahí.

Se deshace en *Deployments → el más reciente → ⋯ → Promote to Production*. Otra
subida a la rama también lo anula.

## Cómo publica el cliente

Dos caminos, y ninguno requiere git:

**Arrastrar la carpeta.** [vercel.com/new](https://vercel.com/new), *Deploy*, se
arrastra la carpeta. URL funcionando en un minuto.

**Desde GitHub.** Importar el repositorio, *Framework Preset: Other*, campos de
build vacíos. A partir de ahí cada subida republica sola.

Para subir fotos desde la web de GitHub, dale el enlace directo:

```
https://github.com/<usuario>/<repo>/upload/<rama>/images
```

*Add file → Upload files → arrastrar → Commit changes.*

## Antes de dar por terminado

- [ ] Fotos puestas, por debajo de 250 KB
- [ ] Horarios publicados, o asumido el "Consultar"
- [ ] Datos fiscales rellenados en las tres páginas legales
- [ ] Dominio definitivo sustituido en todas partes
- [ ] Deployment Protection desactivada
- [ ] Probado el botón de llamar desde un móvil real
- [ ] Probado que el mensaje de WhatsApp llega
- [ ] Carta revisada por el negocio
