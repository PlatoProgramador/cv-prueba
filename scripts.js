/**
 * scripts.js
 * Funcionalidades JS para Web CV — Jane Doe
 *
 * 1. Menú hamburguesa (mostrar/ocultar en móvil)
 * 2. Imagen de fondo aleatoria en la cabecera
 * 3. Lightbox para ampliación de imágenes del portfolio
 * 4. Validación personalizada del formulario de contacto
 * 5. Reloj con fecha y hora actual
 * 6. Año dinámico en el footer
 */

(function () {
    'use strict';

const menuButton = document.getElementById('navToggle');
const menu = document.getElementById('navMenu');

if (menuButton && menu) {

    const closeMenu = () => {
        menu.classList.remove('is-open');
        menuButton.classList.remove('is-active');
        menuButton.setAttribute('aria-expanded', 'false');
    };

    const openMenu = () => {
        menu.classList.add('is-open');
        menuButton.classList.add('is-active');
        menuButton.setAttribute('aria-expanded', 'true');
    };

    menuButton.addEventListener('click', () => {

        const isOpen = menu.classList.contains('is-open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    document.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', event => {

        const clickInsideMenu = menu.contains(event.target);
        const clickOnButton = menuButton.contains(event.target);

        if (!clickInsideMenu && !clickOnButton) {
            closeMenu();
        }
    });

    window.addEventListener('resize', () => {

        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}


    /* =========================================================
       2. IMAGEN DE FONDO ALEATORIA EN HERO
       ========================================================= */
    const hero      = document.querySelector('.hero');
    const heroBgBtn = document.getElementById('heroBgBtn');

    // Semillas de picsum para variedad de imágenes
    const heroSeeds = [
        'hero1', 'hero2', 'hero3', 'hero4', 'hero5',
        'nature1', 'city2', 'abstract3', 'fashion1', 'art4'
    ];
    let lastSeed = 'hero1';

    function randomHeroBg() {
        let seed;
        do {
            seed = heroSeeds[Math.floor(Math.random() * heroSeeds.length)];
        } while (seed === lastSeed);
        lastSeed = seed;

        const url = 'https://picsum.photos/seed/' + seed + '/1600/900';
        if (hero) {
            hero.style.backgroundImage = "url('" + url + "')";
        }
    }

    if (heroBgBtn) {
        heroBgBtn.addEventListener('click', randomHeroBg);
    }


    /* =========================================================
       3. LIGHTBOX — AMPLIACIÓN DE IMÁGENES DEL PORTFOLIO
       ========================================================= */
    const lightbox        = document.getElementById('lightbox');
    const lightboxImg     = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose   = document.getElementById('lightboxClose');
    const lightboxPrev    = document.getElementById('lightboxPrev');
    const lightboxNext    = document.getElementById('lightboxNext');
    const portfolioItems  = document.querySelectorAll('.portfolio__item');

    let currentIndex = 0;

    function openLightbox(index) {
        currentIndex = index;
        const item    = portfolioItems[index];
        const img     = item.querySelector('img');
        const caption = item.querySelector('.portfolio__caption');

        // Usar imagen de mayor resolución para el lightbox
        const src = img.src.replace(/\/400\/300/, '/900/600');
        lightboxImg.src     = src;
        lightboxImg.alt     = img.alt;
        lightboxCaption.textContent = caption ? caption.textContent : '';

        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function closeLightbox() {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        // Devolver foco al item abierto
        if (portfolioItems[currentIndex]) {
            portfolioItems[currentIndex].focus();
        }
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % portfolioItems.length;
        openLightbox(currentIndex);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + portfolioItems.length) % portfolioItems.length;
        openLightbox(currentIndex);
    }

    // Hacer los items del portfolio focusables
    portfolioItems.forEach(function (item, idx) {
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'Ver imagen ampliada');

        item.addEventListener('click', function () { openLightbox(idx); });
        item.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(idx);
            }
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext)  lightboxNext.addEventListener('click', showNext);
    if (lightboxPrev)  lightboxPrev.addEventListener('click', showPrev);

    // Cerrar lightbox al hacer clic fuera de la imagen
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Teclado: flechas y Escape
    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft')  showPrev();
    });


    /* =========================================================
       4. VALIDACIÓN PERSONALIZADA DEL FORMULARIO
       ========================================================= */
    const contactForm = document.getElementById('contactForm');

    function showError(inputId, msg) {
        const input = document.getElementById(inputId);
        const error = document.getElementById('error-' + inputId);
        if (input)  input.classList.add('is-invalid');
        if (input)  input.classList.remove('is-valid');
        if (error)  error.textContent = msg;
        return false;
    }

    function showValid(inputId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById('error-' + inputId);
        if (input) input.classList.remove('is-invalid');
        if (input) input.classList.add('is-valid');
        if (error) error.textContent = '';
        return true;
    }

    function clearValidation(inputId) {
        const input = document.getElementById(inputId);
        const error = document.getElementById('error-' + inputId);
        if (input) { input.classList.remove('is-invalid', 'is-valid'); }
        if (error) { error.textContent = ''; }
    }

    function validateNombre() {
        const val = document.getElementById('nombre').value.trim();
        if (!val)           return showError('nombre', 'El nombre es obligatorio.');
        if (val.length < 2) return showError('nombre', 'El nombre debe tener al menos 2 caracteres.');
        return showValid('nombre');
    }

    function validateEmail() {
        const val = document.getElementById('email').value.trim();
        const re  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val)        return showError('email', 'El email es obligatorio.');
        if (!re.test(val)) return showError('email', 'Introduce un email válido.');
        return showValid('email');
    }

    function validateMensaje() {
        const val = document.getElementById('mensaje').value.trim();
        if (!val)            return showError('mensaje', 'El mensaje es obligatorio.');
        if (val.length < 10) return showError('mensaje', 'El mensaje debe tener al menos 10 caracteres.');
        return showValid('mensaje');
    }

    // Validación en tiempo real (al salir del campo)
    ['nombre', 'email', 'mensaje'].forEach(function (id) {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', function () {
            if (id === 'nombre')  validateNombre();
            if (id === 'email')   validateEmail();
            if (id === 'mensaje') validateMensaje();
        });
        el.addEventListener('input', function () {
            if (el.classList.contains('is-invalid')) {
                if (id === 'nombre')  validateNombre();
                if (id === 'email')   validateEmail();
                if (id === 'mensaje') validateMensaje();
            }
        });
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const okNombre  = validateNombre();
            const okEmail   = validateEmail();
            const okMensaje = validateMensaje();

            const success = document.getElementById('formSuccess');

            if (okNombre && okEmail && okMensaje) {
                if (success) {
                    success.textContent = '¡Mensaje enviado correctamente! Me pondré en contacto pronto.';
                }
                contactForm.reset();
                ['nombre', 'email', 'mensaje'].forEach(clearValidation);
                // Limpiar mensaje de éxito tras 5 s
                setTimeout(function () {
                    if (success) success.textContent = '';
                }, 5000);
            } else {
                if (success) success.textContent = '';
                // Mover el foco al primer campo inválido
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
            }
        });
    }


    /* =========================================================
       5. RELOJ CON FECHA Y HORA ACTUAL
       ========================================================= */
    const relojFecha = document.getElementById('relojFecha');
    const relojHora  = document.getElementById('relojHora');

    function actualizarReloj() {
        const now  = new Date();

        // Fecha en español
        const optFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fecha    = now.toLocaleDateString('es-ES', optFecha);

        // Hora HH:MM:SS
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');

        if (relojFecha) relojFecha.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
        if (relojHora)  relojHora.textContent  = hh + ':' + mm + ':' + ss;
    }

    actualizarReloj();
    setInterval(actualizarReloj, 1000);


    /* =========================================================
       6. AÑO DINÁMICO EN EL FOOTER
       ========================================================= */
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

})();
