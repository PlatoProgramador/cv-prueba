(function () {
    'use strict';

    /* menu movil */
    const navToggle = document.getElementById('navToggle');
    const navMenu   = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            const isOpen = navMenu.classList.toggle('is-open');
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        
        navMenu.querySelectorAll('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Cerrar menú si se pulsa fuera
        document.addEventListener('click', function (e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* abrir fotos */
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

   
    if (lightbox) {
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });
    }


    document.addEventListener('keydown', function (e) {
        if (!lightbox || !lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft')  showPrev();
    });


    /* formulario */
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
                
                setTimeout(function () {
                    if (success) success.textContent = '';
                }, 5000);
            } else {
                if (success) success.textContent = '';
                
                const firstInvalid = contactForm.querySelector('.is-invalid');
                if (firstInvalid) firstInvalid.focus();
            }
        });
    }


    /* año */
    const footerYear = document.getElementById('footerYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }

})();
