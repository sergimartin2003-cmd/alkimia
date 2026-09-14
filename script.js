/* ==========================================================================
   ALKIMIA NEW TAVERN — JavaScript
   --------------------------------------------------------------------------
   Sin dependencias externas. Todo el comportamiento está dividido en módulos
   independientes: si uno falla, el resto sigue funcionando.

   Módulos
   01. Utilidades
   02. Tema claro / oscuro
   03. Cabecera: fondo al hacer scroll, ocultar al bajar, barra de progreso
   04. Menú móvil
   05. Navegación activa según la sección visible
   06. Animaciones de entrada al hacer scroll
   07. Pestañas de la carta
   08. Galería y lightbox
   09. Parallax suave
   10. Formulario de reserva (compone el mensaje de WhatsApp)
   11. Consentimiento del mapa de Google
   12. Sustituto para imágenes que no cargan
   13. Detalles varios (año, botón flotante, día de hoy en horarios)
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     01. UTILIDADES
     ======================================================================== */

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* Agrupa varias llamadas en un único repintado */
  function rafThrottle(fn) {
    var ticking = false;
    return function () {
      var args = arguments, self = this;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        fn.apply(self, args);
        ticking = false;
      });
    };
  }

  /* Almacenamiento que no rompe si el navegador lo bloquea (modo privado) */
  var store = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) { /* ignorado */ }
    }
  };

  /* Elementos que pueden recibir foco, para atrapar el tabulador */
  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]),' +
                  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function trapFocus(container, event) {
    var items = $$(FOCUSABLE, container).filter(function (el) {
      return el.offsetParent !== null || el === document.activeElement;
    });
    if (!items.length) return;

    var first = items[0];
    var last  = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  /* Bloqueo de scroll compensando el ancho de la barra para evitar saltos */
  var scrollLock = {
    count: 0,
    on: function () {
      if (this.count === 0) {
        var gap = window.innerWidth - document.documentElement.clientWidth;
        if (gap > 0) document.body.style.paddingRight = gap + 'px';
        document.body.classList.add('is-locked');
      }
      this.count++;
    },
    off: function () {
      this.count = Math.max(0, this.count - 1);
      if (this.count === 0) {
        document.body.classList.remove('is-locked');
        document.body.style.paddingRight = '';
      }
    }
  };

  /* ========================================================================
     02. TEMA CLARO / OSCURO
     El tema inicial ya se aplica en un script en línea dentro de <head>
     para que no haya parpadeo; aquí solo gestionamos el cambio manual.
     ======================================================================== */

  function initTheme() {
    var toggle = $('#themeToggle');
    if (!toggle) return;

    function current() {
      return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    }

    function apply(theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      toggle.setAttribute('aria-label',
        theme === 'light' ? 'Cambiar al tema oscuro' : 'Cambiar al tema claro');

      /* Mantiene la barra del navegador móvil en sintonía con la página */
      var meta = document.querySelector('meta[name="theme-color"]:not([media])');
      if (meta) meta.setAttribute('content', theme === 'light' ? '#F7F4EE' : '#0B0B0D');
    }

    apply(current());

    toggle.addEventListener('click', function () {
      var next = current() === 'light' ? 'dark' : 'light';
      apply(next);
      store.set('alkimia-theme', next);
    });
  }

  /* ========================================================================
     03. CABECERA Y BARRA DE PROGRESO
     ======================================================================== */

  function initHeader() {
    var header = $('#header');
    var bar    = $('#progressBar');
    var fab    = $('#fab');
    if (!header) return;

    var lastY = window.scrollY;
    var THRESHOLD = 40;   /* a partir de aquí la cabecera gana fondo */
    var HIDE_AT   = 400;  /* no se oculta hasta haber bajado lo suficiente */

    function update() {
      var y = window.scrollY;

      header.classList.toggle('is-stuck', y > THRESHOLD);

      /* Se oculta al bajar y vuelve al subir, pero nunca con el menú abierto */
      var menuOpen = document.body.classList.contains('is-locked');
      if (!menuOpen && y > HIDE_AT && y > lastY + 6) {
        header.classList.add('is-hidden');
      } else if (y < lastY - 6 || y <= HIDE_AT) {
        header.classList.remove('is-hidden');
      }

      if (bar) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? (y / max) * 100 : 0;
        bar.style.width = Math.min(100, Math.max(0, pct)) + '%';
      }

      if (fab) fab.classList.toggle('is-visible', y > window.innerHeight * 0.6);

      lastY = y;
    }

    update();
    window.addEventListener('scroll', rafThrottle(update), { passive: true });
    window.addEventListener('resize', rafThrottle(update), { passive: true });
  }

  /* ========================================================================
     04. MENÚ MÓVIL
     ======================================================================== */

  function initMobileNav() {
    var burger = $('#burger');
    var panel  = $('#mobileNav');
    if (!burger || !panel) return;

    var isOpen = false;
    var lastFocused = null;

    function open() {
      if (isOpen) return;
      isOpen = true;
      lastFocused = document.activeElement;
      panel.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Cerrar menú de navegación');
      scrollLock.on();

      /* Lleva el foco al primer enlace para quien navega con teclado */
      var first = $('.mobile-nav__link', panel);
      if (first) window.setTimeout(function () { first.focus(); }, 120);
    }

    function close(restoreFocus) {
      if (!isOpen) return;
      isOpen = false;
      panel.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menú de navegación');
      scrollLock.off();
      if (restoreFocus !== false && lastFocused) lastFocused.focus();
    }

    burger.addEventListener('click', function () { isOpen ? close() : open(); });

    /* Al elegir destino, el panel se cierra y deja ver el desplazamiento */
    $$('.mobile-nav__link, .mobile-nav__footer a', panel).forEach(function (link) {
      link.addEventListener('click', function () { close(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') trapFocus(panel, e);
    });

    /* Si se pasa a escritorio con el menú abierto, hay que devolver el scroll */
    window.matchMedia('(min-width: 1001px)').addEventListener('change', function (e) {
      if (e.matches) close(false);
    });
  }

  /* ========================================================================
     05. NAVEGACIÓN ACTIVA SEGÚN LA SECCIÓN VISIBLE
     ======================================================================== */

  function initScrollSpy() {
    var links = $$('.nav__link');
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    var sections = [];

    links.forEach(function (link) {
      var id = link.getAttribute('href');
      if (!id || id.charAt(0) !== '#') return;
      var section = document.querySelector(id);
      if (!section) return;
      map[section.id] = link;
      sections.push(section);
    });

    if (!sections.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var link = map[entry.target.id];
        if (link) link.classList.add('is-active');
      });
    }, {
      /* La franja activa es el tercio superior de la ventana */
      rootMargin: '-45% 0px -50% 0px',
      threshold: 0
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ========================================================================
     06. ANIMACIONES DE ENTRADA
     ======================================================================== */

  function initReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    /* Sin soporte o con movimiento reducido: se muestra todo de inmediato */
    if (!('IntersectionObserver' in window) || prefersReducedMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-revealed'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ========================================================================
     07. PESTAÑAS DE LA CARTA
     Patrón ARIA de tabs con navegación por flechas, Inicio y Fin.
     ======================================================================== */

  function initMenuTabs() {
    var tabs = $$('.menu__tab');
    if (!tabs.length) return;

    function select(tab, moveFocus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected ? 'true' : 'false');
        t.setAttribute('tabindex', selected ? '0' : '-1');

        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (moveFocus) tab.focus();
    }

    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { select(tab, false); });

      tab.addEventListener('keydown', function (e) {
        var next = null;

        switch (e.key) {
          case 'ArrowRight': next = tabs[(index + 1) % tabs.length]; break;
          case 'ArrowLeft':  next = tabs[(index - 1 + tabs.length) % tabs.length]; break;
          case 'Home':       next = tabs[0]; break;
          case 'End':        next = tabs[tabs.length - 1]; break;
          default: return;
        }

        e.preventDefault();
        select(next, true);

        /* Mantiene la pestaña elegida a la vista en el carrusel de móvil */
        if (next.scrollIntoView) {
          next.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });
    });
  }

  /* ========================================================================
     08. GALERÍA Y LIGHTBOX
     ======================================================================== */

  function initLightbox() {
    var gallery = $('#gallery');
    var box     = $('#lightbox');
    if (!gallery || !box) return;

    var triggers = $$('.gallery__item', gallery);
    if (!triggers.length) return;

    var imgEl     = $('#lbImg');
    var captionEl = $('#lbCaption');
    var currentEl = $('#lbCurrent');
    var totalEl   = $('#lbTotal');
    var thumbsEl  = $('#lbThumbs');
    var closeBtn  = $('#lbClose');
    var prevBtn   = $('#lbPrev');
    var nextBtn   = $('#lbNext');

    /* La lista de fotos se construye desde el propio HTML: una sola fuente */
    var slides = triggers.map(function (trigger) {
      var img = $('img', trigger);
      var caption = $('.gallery__caption', trigger);
      return {
        src: img ? img.getAttribute('src') : '',
        alt: img ? (img.getAttribute('alt') || '') : '',
        caption: caption ? caption.textContent.trim() : ''
      };
    });

    var index = 0;
    var isOpen = false;
    var lastFocused = null;

    if (totalEl) totalEl.textContent = String(slides.length);

    /* Miniaturas de navegación */
    if (thumbsEl) {
      slides.forEach(function (slide, i) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'lightbox__thumb';
        btn.setAttribute('aria-label', 'Ver foto ' + (i + 1) + ' de ' + slides.length);

        var thumb = document.createElement('img');
        thumb.src = slide.src;
        thumb.alt = '';
        thumb.loading = 'lazy';
        thumb.decoding = 'async';
        btn.appendChild(thumb);

        btn.addEventListener('click', function () { show(i); });
        thumbsEl.appendChild(btn);
      });
    }

    function show(i) {
      index = (i + slides.length) % slides.length;
      var slide = slides[index];

      if (imgEl) {
        /* Reinicia la animación de entrada en cada cambio de foto */
        imgEl.style.animation = 'none';
        imgEl.offsetHeight;
        imgEl.style.animation = '';
        imgEl.src = slide.src;
        imgEl.alt = slide.alt;
      }
      if (captionEl) captionEl.textContent = slide.caption;
      if (currentEl) currentEl.textContent = String(index + 1);

      $$('.lightbox__thumb', thumbsEl).forEach(function (t, i2) {
        t.classList.toggle('is-current', i2 === index);
        if (i2 === index && t.scrollIntoView) {
          t.scrollIntoView({ block: 'nearest', inline: 'center' });
        }
      });

      preload(index + 1);
      preload(index - 1);
    }

    /* Descarga por adelantado la foto contigua: el salto se nota instantáneo */
    function preload(i) {
      var slide = slides[(i + slides.length) % slides.length];
      if (!slide) return;
      var pre = new Image();
      pre.src = slide.src;
    }

    function open(i) {
      if (isOpen) return;
      isOpen = true;
      lastFocused = document.activeElement;
      show(i);
      box.classList.add('is-open');
      box.setAttribute('aria-hidden', 'false');
      scrollLock.on();
      if (closeBtn) closeBtn.focus();
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      scrollLock.off();
      if (lastFocused) lastFocused.focus();
    }

    triggers.forEach(function (trigger, i) {
      trigger.addEventListener('click', function () { open(i); });
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (prevBtn)  prevBtn.addEventListener('click', function () { show(index - 1); });
    if (nextBtn)  nextBtn.addEventListener('click', function () { show(index + 1); });

    /* Pulsar fuera de la imagen cierra el visor */
    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.classList.contains('lightbox__stage')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen) return;
      switch (e.key) {
        case 'Escape':     e.preventDefault(); close(); break;
        case 'ArrowRight': e.preventDefault(); show(index + 1); break;
        case 'ArrowLeft':  e.preventDefault(); show(index - 1); break;
        case 'Home':       e.preventDefault(); show(0); break;
        case 'End':        e.preventDefault(); show(slides.length - 1); break;
        case 'Tab':        trapFocus(box, e); break;
      }
    });

    /* Gesto de deslizar en móvil */
    var touchX = 0, touchY = 0;

    box.addEventListener('touchstart', function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    }, { passive: true });

    box.addEventListener('touchend', function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;

      /* Solo cuenta si el gesto es claramente horizontal */
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.6) {
        show(dx < 0 ? index + 1 : index - 1);
      }
    }, { passive: true });
  }

  /* ========================================================================
     09. PARALLAX SUAVE
     ======================================================================== */

  function initParallax() {
    var items = $$('[data-parallax]');
    if (!items.length || prefersReducedMotion.matches) return;

    /* En pantallas pequeñas el efecto estorba más de lo que aporta */
    if (window.matchMedia('(max-width: 900px)').matches) return;

    function update() {
      var vh = window.innerHeight;

      items.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;

        var amount = parseFloat(el.getAttribute('data-parallax')) || 0.06;
        var progress = (rect.top + rect.height / 2 - vh / 2) / vh;

        /* Se escribe una variable CSS, no "transform": así el desplazamiento
           y el zoom del hover se combinan en lugar de pisarse. */
        el.style.setProperty('--py', (progress * amount * 100).toFixed(2) + 'px');
      });
    }

    update();
    window.addEventListener('scroll', rafThrottle(update), { passive: true });
    window.addEventListener('resize', rafThrottle(update), { passive: true });
  }

  /* ========================================================================
     10. FORMULARIO DE RESERVA
     --------------------------------------------------------------------------
     No hay servidor detrás: se valida en el navegador y se abre WhatsApp con
     el mensaje ya redactado. Los datos no salen del dispositivo hasta que la
     persona pulsa enviar dentro de WhatsApp.
     ======================================================================== */

  var WHATSAPP_NUMBER = '34623288681';

  function initReserveForm() {
    var form = $('#reserveForm');
    if (!form) return;

    var status = $('#formStatus');
    var dateInput = $('#r-date');

    /* No se pueden pedir mesas para ayer */
    if (dateInput) {
      var today = new Date();
      var iso = today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0');
      dateInput.min = iso;
    }

    var rules = {
      'r-name': function (v) {
        if (!v.trim()) return 'Dinos tu nombre.';
        if (v.trim().length < 2) return 'El nombre es demasiado corto.';
        return '';
      },
      'r-phone': function (v) {
        var digits = v.replace(/\D/g, '');
        if (!digits) return 'Necesitamos un teléfono de contacto.';
        if (digits.length < 9) return 'El teléfono debe tener al menos 9 dígitos.';
        return '';
      },
      'r-date': function (v) {
        if (!v) return 'Elige el día.';
        var chosen = new Date(v + 'T00:00:00');
        var now = new Date();
        now.setHours(0, 0, 0, 0);
        if (chosen < now) return 'Esa fecha ya ha pasado.';
        return '';
      },
      'r-time': function (v) { return v ? '' : 'Elige la hora.'; },
      'r-people': function (v) { return v ? '' : 'Indica cuántos sois.'; },
      'r-consent': function (v, field) {
        return field.checked ? '' : 'Debes aceptar la política de privacidad.';
      }
    };

    function setError(id, message) {
      var field = document.getElementById(id);
      var slot  = document.getElementById('err-' + id.replace('r-', ''));
      if (!field) return;

      if (message) {
        field.setAttribute('aria-invalid', 'true');
        if (slot) slot.textContent = message;
      } else {
        field.removeAttribute('aria-invalid');
        if (slot) slot.textContent = '';
      }
    }

    function validateField(id) {
      var field = document.getElementById(id);
      if (!field) return true;
      var message = rules[id](field.value, field);
      setError(id, message);
      return !message;
    }

    /* Revalida en cuanto se corrige, pero no mientras se escribe por primera vez */
    Object.keys(rules).forEach(function (id) {
      var field = document.getElementById(id);
      if (!field) return;

      field.addEventListener('blur', function () { validateField(id); });
      field.addEventListener('change', function () { validateField(id); });
      field.addEventListener('input', function () {
        if (field.getAttribute('aria-invalid') === 'true') validateField(id);
      });
    });

    /* dd/mm/aaaa, que es como se lee un mensaje en España */
    function formatDate(iso) {
      var parts = iso.split('-');
      if (parts.length !== 3) return iso;
      return parts[2] + '/' + parts[1] + '/' + parts[0];
    }

    function showStatus(text, ok) {
      if (!status) return;
      status.textContent = text;
      status.hidden = false;
      status.classList.toggle('form__status--ok', !!ok);
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      Object.keys(rules).forEach(function (id) {
        if (!validateField(id) && !firstInvalid) firstInvalid = document.getElementById(id);
      });

      if (firstInvalid) {
        showStatus('Revisa los campos marcados para poder enviar la solicitud.', false);
        firstInvalid.focus();
        return;
      }

      var data = {
        name:   $('#r-name').value.trim(),
        phone:  $('#r-phone').value.trim(),
        date:   formatDate($('#r-date').value),
        time:   $('#r-time').value,
        people: $('#r-people').value,
        zone:   $('#r-zone') ? $('#r-zone').value : '',
        notes:  $('#r-notes') ? $('#r-notes').value.trim() : ''
      };

      var lines = [
        'Hola, me gustaría reservar mesa en Alkimia New Tavern.',
        '',
        'Nombre: ' + data.name,
        'Teléfono: ' + data.phone,
        'Día: ' + data.date,
        'Hora: ' + data.time,
        'Comensales: ' + data.people
      ];

      if (data.zone)  lines.push('Preferencia: ' + data.zone);
      if (data.notes) lines.push('Notas: ' + data.notes);

      lines.push('', 'Quedo a la espera de confirmación. ¡Gracias!');

      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' +
                encodeURIComponent(lines.join('\n'));

      var win = window.open(url, '_blank', 'noopener');

      if (win) {
        showStatus('Hemos abierto WhatsApp con tu solicitud. Pulsa enviar allí para que nos llegue.', true);
      } else {
        /* Bloqueador de ventanas emergentes: damos un enlace manual */
        showStatus('Tu navegador ha bloqueado la ventana. Abre WhatsApp manualmente en el 623 28 86 81.', false);
      }
    });
  }

  /* ========================================================================
     11. CONSENTIMIENTO DEL MAPA
     El iframe de Google no se carga hasta que se acepta expresamente.
     ======================================================================== */

  function initMapConsent() {
    var button  = $('#mapLoad');
    var consent = $('#mapConsent');
    var frame   = $('#mapFrame');
    if (!button || !consent || !frame) return;

    function load() {
      var src = frame.getAttribute('data-src');
      if (src && !frame.getAttribute('src')) frame.setAttribute('src', src);
      consent.remove();
      store.set('alkimia-map-consent', '1');
    }

    /* Si ya se aceptó antes, se carga directamente */
    if (store.get('alkimia-map-consent') === '1') {
      load();
      return;
    }

    button.addEventListener('click', load);
  }

  /* ========================================================================
     12. SUSTITUTO PARA IMÁGENES QUE NO CARGAN
     Si falta un archivo en /images, se muestra un motivo de la marca en su
     lugar en vez del icono de imagen rota del navegador.
     ======================================================================== */

  var FALLBACK_SVG =
    '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
    '<circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="1.2" opacity=".5"/>' +
    '<path d="M24 10 37 33H11L24 10Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' +
    '<path d="M16 26.5h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>' +
    '</svg>';

  function initImageFallbacks() {
    function replace(img) {
      if (img.dataset.fallbackDone === '1') return;
      img.dataset.fallbackDone = '1';

      var box = document.createElement('span');
      box.className = 'img-fallback';
      box.setAttribute('role', 'img');
      box.setAttribute('aria-label', img.getAttribute('alt') || 'Fotografía no disponible');
      box.innerHTML = FALLBACK_SVG;

      if (img.parentNode) img.parentNode.replaceChild(box, img);
    }

    $$('img').forEach(function (img) {
      /* Una imagen ya cargada tiene naturalWidth > 0 */
      if (img.complete && img.naturalWidth === 0) {
        replace(img);
      } else {
        img.addEventListener('error', function () { replace(img); });
      }
    });
  }

  /* ========================================================================
     13. DETALLES VARIOS
     ======================================================================== */

  function initMisc() {
    /* Año del copyright siempre al día */
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    /* Resalta la fila del día actual si se han publicado los horarios */
    var todayIndex = new Date().getDay();
    $$('.hours__row[data-day]').forEach(function (row) {
      if (parseInt(row.getAttribute('data-day'), 10) === todayIndex) {
        row.classList.add('is-today');
      }
    });

    /* Los enlaces internos deben cerrar el menú y respetar el foco */
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        var id = link.getAttribute('href');
        if (id === '#' || id.length < 2) return;

        var target = document.querySelector(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
          block: 'start'
        });

        /* Mueve el foco al destino sin provocar un segundo salto */
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });

        if (history.replaceState) history.replaceState(null, '', id);
      });
    });
  }

  /* ========================================================================
     ARRANQUE
     Cada módulo va en su propio try para que un fallo no tumbe los demás.
     ======================================================================== */

  function boot() {
    [
      initTheme,
      initHeader,
      initMobileNav,
      initScrollSpy,
      initReveal,
      initMenuTabs,
      initLightbox,
      initParallax,
      initReserveForm,
      initMapConsent,
      initImageFallbacks,
      initMisc
    ].forEach(function (fn) {
      try {
        fn();
      } catch (err) {
        if (window.console && console.warn) {
          console.warn('[Alkimia] Fallo al iniciar ' + fn.name + ':', err);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})();
