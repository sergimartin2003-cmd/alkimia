# Cómo instalar esta skill

> Este archivo es para ti, no para Claude. La skill en sí es `SKILL.md`.

## Dónde está ahora

En `.claude/skills/webs-para-locales/` dentro del repositorio de Alkimia. Ahí
se carga **sola** siempre que trabajes en este proyecto, pero no en los demás.

## Para usarla en todos tus proyectos

Copia la carpeta entera a tu carpeta personal de skills:

```bash
mkdir -p ~/.claude/skills
cp -r .claude/skills/webs-para-locales ~/.claude/skills/
```

En Windows, la ruta es `C:\Users\<tu usuario>\.claude\skills\`.

A partir de ahí, Claude la usará sola cuando le pidas una web para un local, sin
que tengas que nombrarla. También puedes invocarla a mano con
`/webs-para-locales`.

## Para usarla en otro ordenador o compartirla

La carpeta es autocontenida: cópiala en un pendrive, mándala por correo o súbela
a un repositorio propio. No depende de nada más.

## Qué hay dentro

| Archivo | Para qué |
| --- | --- |
| `SKILL.md` | El método. Es lo que Claude lee primero |
| `referencias/arranque.md` | Qué hacer en los primeros minutos |
| `referencias/errores-conocidos.md` | **Lo más valioso.** Trece fallos reales con su arreglo |
| `referencias/secciones.md` | Qué lleva cada sección de la web |
| `referencias/fotos-y-clientes.md` | Los dos atascos que se repiten con las fotos |
| `referencias/legal-espana.md` | Aviso legal, privacidad y cookies |
| `referencias/verificacion.md` | Cómo comprobar la web en un navegador |
| `referencias/publicar.md` | Vercel y sus tres trampas |
| `plantillas/preparar-fotos.html` | La herramienta de fotos, lista para adaptar |
| `plantillas/verificar.mjs` | El arnés de pruebas, listo para ejecutar |

## Mantenerla viva

Cada vez que en un proyecto nuevo aparezca un fallo que costó encontrar, añádelo
a `referencias/errores-conocidos.md` con su síntoma, su causa y su arreglo.

Ahí está el valor real: no en el método, que se reinventa, sino en los fallos que
ya no vas a volver a sufrir.
