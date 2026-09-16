# Legal español

Toda web de un negocio en España necesita tres páginas. No son opcionales ni
adorno: la LSSI obliga a que la identificación del titular sea veraz y accesible.

> Redáctalas describiendo **cómo funciona esa web concreta**. Una plantilla
> genérica que habla de cookies analíticas cuando no instalas ninguna es peor que
> no tenerla: describe un tratamiento que no existe.

## Aviso legal (Ley 34/2002, LSSI-CE)

Titular, NIF, nombre comercial, domicilio, teléfono, correo y actividad. Más
objeto del sitio, condiciones de uso, propiedad intelectual, enlaces de terceros,
exclusión de responsabilidad y legislación aplicable.

Para un local con carta, añade un apartado propio: **precios y disponibilidad
sujetos a cambio, la web no es oferta contractual vinculante**. Evita discusiones
en la puerta.

## Política de privacidad (RGPD + LOPDGDD)

Si la web es estática y el formulario abre WhatsApp, **la web no recoge datos**.
Dilo así de claro, y explica dónde ocurre el tratamiento de verdad: al gestionar
la reserva por teléfono o WhatsApp.

Tabla de finalidad, base jurídica y conservación:

| Finalidad | Base jurídica | Conservación |
| --- | --- | --- |
| Gestionar la reserva | Medidas precontractuales, art. 6.1.b | Hasta el servicio y la prescripción de reclamaciones |
| Alergias comunicadas | Consentimiento expreso, art. 9.2.a | Solo durante el servicio |
| Responder consultas | Consentimiento, art. 6.1.a | Hasta cerrar la conversación |

**Las alergias son dato de salud.** Requieren consentimiento expreso y mención
aparte. Es un detalle que distingue un texto trabajado de uno copiado.

Menciona también a WhatsApp Ireland como plataforma, el alojamiento como
encargado del tratamiento, las transferencias internacionales por Google Fonts y
Maps, y la reclamación ante la AEPD.

## Política de cookies

Si no instalas cookies, **dilo y explícalo**, que es lo llamativo.

El almacenamiento local para recordar el tema y el consentimiento del mapa es
técnico y está exento de consentimiento previo: recuerda decisiones que ha tomado
la propia persona. Enuméralo igualmente en una tabla, con nombre, finalidad y
duración.

Dedica un apartado al mapa: se carga solo al aceptarlo, y a partir de ahí las
cookies son de Google.

Cierra con una nota para el titular: **si algún día instala Analytics o un píxel
de Meta, esta política deja de valer** y hace falta banner de consentimiento
previo conforme a la guía de la AEPD.

## Consentimiento del mapa

```html
<div class="map__consent">
  <p>El mapa lo proporciona Google Maps. Al cargarlo se establece conexión con
     los servidores de Google, que puede instalar cookies en tu dispositivo.</p>
  <button id="mapLoad">Cargar el mapa de Google</button>
</div>
<iframe id="mapFrame" data-src="https://maps.google.com/maps?q=...&output=embed"></iframe>
```

El `src` real vive en `data-src` hasta que se acepta. Recuerda la decisión en
`localStorage` para no volver a preguntar.

Además de cumplir, la primera visita no descarga el iframe.

## Datos del titular

Razón social, NIF, correo y proveedor de alojamiento **no te los inventas nunca**.
Déjalos marcados visualmente —recuadro punteado, color de acento— y explicados en
el README, para que sea imposible publicar sin verlos.

## Lo que no eres

No eres asesor jurídico. Di en el propio aviso que el texto es una base de
trabajo y que conviene que lo revise su asesoría. Es honesto y protege al cliente.
