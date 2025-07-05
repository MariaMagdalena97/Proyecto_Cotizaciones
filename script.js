// ============================================
// SISTEMA DE COTIZACIONES Y GALERÍA LIGHTBOX
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Sistema iniciado correctamente');

    // ===========================================
    // CONFIGURACIÓN Y CONSTANTES
    // ===========================================
    
    const CONFIG = {
        STORAGE_KEY: 'cotizaciones',
        MIN_NAME_LENGTH: 3,
        EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        LOCALE: 'es-CL',
        ANIMATION_DURATION: 300
    };

    // ===========================================
    // ELEMENTOS DEL DOM - FORMULARIO
    // ===========================================
    
    const formElements = {
        form: document.getElementById('formCotizacion'),
        nombre: document.getElementById('nombre'),
        email: document.getElementById('email'),
        estilo: document.getElementById('estilo'),
        comentario: document.getElementById('comentario'),
        errores: document.getElementById('errores'),
        lista: document.getElementById('listaCotizaciones'),
        container: document.querySelector('.quotes-container')
    };

    // ===========================================
    // ELEMENTOS DEL DOM - LIGHTBOX
    // ===========================================
    
    const lightboxElements = {
        gallery: document.querySelector('.lightbox-gallery'),
        modal: document.getElementById('lightbox-modal'),
        img: document.getElementById('lightbox-img'),
        closeBtn: document.querySelector('.close-button'),
        prevBtn: document.querySelector('.prev-button'),
        nextBtn: document.querySelector('.next-button')
    };

    // ===========================================
    // ESTADO DE LA APLICACIÓN
    // ===========================================
    
    let appState = {
        currentImageIndex: 0,
        galleryImages: [],
        cotizaciones: [],
        isModalOpen: false
    };

    // ===========================================
    // CLASE PRINCIPAL - COTIZADOR
    // ===========================================
    
    class CotizadorApp {
        constructor() {
            this.init();
        }

        init() {
            this.initGallery();
            this.initForm();
            this.loadCotizaciones();
            console.log('✅ Aplicación inicializada');
        }

        // ===============================
        // INICIALIZACIÓN DE LA GALERÍA
        // ===============================
        
        initGallery() {
            if (!lightboxElements.gallery) {
                console.warn('⚠️ Galería no encontrada');
                return;
            }

            // Obtener todas las imágenes y convertir a array
            appState.galleryImages = Array.from(lightboxElements.gallery.querySelectorAll('img'));
            
            if (appState.galleryImages.length === 0) {
                console.warn('⚠️ No se encontraron imágenes en la galería');
                return;
            }

            // Configurar eventos para cada imagen
            appState.galleryImages.forEach((img, index) => {
                img.addEventListener('click', () => this.openLightbox(index));
                img.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.openLightbox(index);
                    }
                });
                // Hacer las imágenes accesibles
                img.setAttribute('tabindex', '0');
                img.setAttribute('role', 'button');
                img.setAttribute('aria-label', `Ver imagen ${index + 1} en pantalla completa`);
            });

            this.setupLightboxEvents();
            console.log(`📸 Galería inicializada con ${appState.galleryImages.length} imágenes`);
        }

        // ===============================
        // CONFIGURACIÓN DE EVENTOS LIGHTBOX
        // ===============================
        
        setupLightboxEvents() {
            // Botón cerrar
            lightboxElements.closeBtn?.addEventListener('click', () => this.closeLightbox());
            
            // Botones de navegación
            lightboxElements.prevBtn?.addEventListener('click', () => this.showPrevImage());
            lightboxElements.nextBtn?.addEventListener('click', () => this.showNextImage());

            // Cerrar con Escape y navegación con flechas
            document.addEventListener('keydown', (e) => this.handleKeyboardNav(e));

            // Cerrar al hacer click fuera de la imagen
            lightboxElements.modal?.addEventListener('click', (e) => {
                if (e.target === lightboxElements.modal) {
                    this.closeLightbox();
                }
            });

            // Evitar cierre accidental en dispositivos táctiles
            lightboxElements.img?.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // ===============================
        // FUNCIONES DEL LIGHTBOX
        // ===============================
        
        openLightbox(index) {
            if (index < 0 || index >= appState.galleryImages.length) return;

            appState.currentImageIndex = index;
            appState.isModalOpen = true;

            const img = appState.galleryImages[index];
            lightboxElements.img.src = img.src;
            lightboxElements.img.alt = img.alt || `Imagen ${index + 1}`;
            
            // Mostrar modal con animación
            lightboxElements.modal.style.display = 'flex';
            lightboxElements.modal.classList.add('active');
            
            // Prevenir scroll del body
            document.body.style.overflow = 'hidden';
            
            // Focus en el modal para accesibilidad
            lightboxElements.modal.focus();
            
            console.log(`🖼️ Imagen ${index + 1} abierta en lightbox`);
        }

        closeLightbox() {
            if (!appState.isModalOpen) return;

            appState.isModalOpen = false;
            lightboxElements.modal.classList.remove('active');
            
            // Animación de salida
            setTimeout(() => {
                lightboxElements.modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, CONFIG.ANIMATION_DURATION);

            console.log('❌ Lightbox cerrado');
        }

        showNextImage() {
            if (!appState.isModalOpen) return;
            
            const nextIndex = (appState.currentImageIndex + 1) % appState.galleryImages.length;
            this.openLightbox(nextIndex);
        }

        showPrevImage() {
            if (!appState.isModalOpen) return;
            
            const prevIndex = (appState.currentImageIndex - 1 + appState.galleryImages.length) % appState.galleryImages.length;
            this.openLightbox(prevIndex);
        }

        // ===============================
        // NAVEGACIÓN CON TECLADO
        // ===============================
        
        handleKeyboardNav(e) {
            if (!appState.isModalOpen) return;

            switch(e.key) {
                case 'Escape':
                    this.closeLightbox();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.showPrevImage();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.showNextImage();
                    break;
            }
        }

        // ===============================
        // INICIALIZACIÓN DEL FORMULARIO
        // ===============================
        
        initForm() {
            if (!formElements.form) {
                console.warn('⚠️ Formulario no encontrado');
                return;
            }

            formElements.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
            
            // Validación en tiempo real
            formElements.nombre?.addEventListener('blur', () => this.validateField('nombre'));
            formElements.email?.addEventListener('blur', () => this.validateField('email'));
            
            console.log('📝 Formulario inicializado');
        }

        // ===============================
        // MANEJO DEL ENVÍO DEL FORMULARIO
        // ===============================
        
        handleFormSubmit(e) {
            e.preventDefault();
            
            const errors = this.validateForm();
            
            if (errors.length > 0) {
                this.showErrors(errors);
                return;
            }

            const cotizacion = this.createCotizacion();
            this.saveCotizacion(cotizacion);
            this.resetForm();
            this.showSuccess();
        }

        // ===============================
        // VALIDACIÓN DEL FORMULARIO
        // ===============================
        
        validateForm() {
            const errors = [];

            // Validar nombre
            const nombre = formElements.nombre?.value.trim();
            if (!nombre || nombre.length < CONFIG.MIN_NAME_LENGTH) {
                errors.push(`El nombre debe tener al menos ${CONFIG.MIN_NAME_LENGTH} caracteres.`);
            }

            // Validar email
            const email = formElements.email?.value.trim();
            if (!email || !CONFIG.EMAIL_REGEX.test(email)) {
                errors.push('El correo electrónico no es válido.');
            }

            // Validar servicios
            const servicios = this.getSelectedServices();
            if (servicios.length === 0) {
                errors.push('Debes seleccionar al menos un servicio.');
            }

            // Validar estilo
            const estilo = formElements.estilo?.value;
            if (!estilo) {
                errors.push('Por favor, selecciona un estilo visual.');
            }

            return errors;
        }

        // ===============================
        // VALIDACIÓN DE CAMPO INDIVIDUAL
        // ===============================
        
        validateField(fieldName) {
            const field = formElements[fieldName];
            if (!field) return;

            let isValid = true;
            let message = '';

            switch(fieldName) {
                case 'nombre':
                    const nombre = field.value.trim();
                    isValid = nombre.length >= CONFIG.MIN_NAME_LENGTH;
                    message = isValid ? '' : `Mínimo ${CONFIG.MIN_NAME_LENGTH} caracteres`;
                    break;
                    
                case 'email':
                    const email = field.value.trim();
                    isValid = CONFIG.EMAIL_REGEX.test(email);
                    message = isValid ? '' : 'Email inválido';
                    break;
            }

            // Mostrar/ocultar mensaje de error
            this.toggleFieldError(field, isValid, message);
        }

        // ===============================
        // UTILIDADES DEL FORMULARIO
        // ===============================
        
        getSelectedServices() {
            const checkboxes = document.querySelectorAll('input[name="servicio"]:checked');
            return Array.from(checkboxes).map(cb => cb.value);
        }

        createCotizacion() {
            return {
                id: Date.now(), // ID único basado en timestamp
                nombre: formElements.nombre.value.trim(),
                email: formElements.email.value.trim(),
                servicios: this.getSelectedServices(),
                estilo: formElements.estilo.value,
                comentario: formElements.comentario.value.trim() || 'Sin comentarios adicionales.',
                fecha: new Date().toLocaleString(CONFIG.LOCALE, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                })
            };
        }

        // ===============================
        // MANEJO DE ERRORES Y MENSAJES
        // ===============================
        
        showErrors(errors) {
            if (!formElements.errores) return;

            formElements.errores.innerHTML = errors.map(error => 
                `<div class="error-item">⚠️ ${error}</div>`
            ).join('');
            
            formElements.errores.style.display = 'block';
            formElements.errores.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        toggleFieldError(field, isValid, message) {
            // Remover clases anteriores
            field.classList.remove('field-error', 'field-success');
            
            // Remover mensaje anterior
            const existingMessage = field.parentNode.querySelector('.field-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            if (message) {
                // Agregar nueva clase y mensaje
                field.classList.add(isValid ? 'field-success' : 'field-error');
                
                const messageDiv = document.createElement('div');
                messageDiv.className = `field-message ${isValid ? 'success' : 'error'}`;
                messageDiv.textContent = message;
                field.parentNode.insertBefore(messageDiv, field.nextSibling);
            }
        }

        showSuccess() {
            // Crear notificación temporal
            const notification = document.createElement('div');
            notification.className = 'success-notification';
            notification.innerHTML = '✅ ¡Cotización enviada con éxito!';
            
            document.body.appendChild(notification);
            
            // Animar entrada
            setTimeout(() => notification.classList.add('show'), 100);
            
            // Remover después de 3 segundos
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        resetForm() {
            formElements.form.reset();
            formElements.errores.style.display = 'none';
            formElements.errores.innerHTML = '';
            
            // Limpiar mensajes de validación
            document.querySelectorAll('.field-message').forEach(msg => msg.remove());
            document.querySelectorAll('.field-error, .field-success').forEach(field => {
                field.classList.remove('field-error', 'field-success');
            });
        }

        // ===============================
        // GESTIÓN DE COTIZACIONES
        // ===============================
        
        saveCotizacion(cotizacion) {
            try {
                const cotizaciones = this.getCotizaciones();
                cotizaciones.push(cotizacion);
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cotizaciones));
                this.displayCotizaciones();
                
                console.log('💾 Cotización guardada:', cotizacion.nombre);
            } catch (error) {
                console.error('❌ Error al guardar cotización:', error);
                alert('Error al guardar la cotización. Por favor, intenta nuevamente.');
            }
        }

        getCotizaciones() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || [];
            } catch (error) {
                console.error('❌ Error al cargar cotizaciones:', error);
                return [];
            }
        }

        loadCotizaciones() {
            appState.cotizaciones = this.getCotizaciones();
            this.displayCotizaciones();
            console.log(`📋 ${appState.cotizaciones.length} cotizaciones cargadas`);
        }

        displayCotizaciones() {
            if (!formElements.lista || !formElements.container) return;

            const cotizaciones = this.getCotizaciones();
            
            // Limpiar contenido anterior
            formElements.lista.innerHTML = '<h2 class="section-title">Cotizaciones registradas</h2>';

            if (cotizaciones.length === 0) {
                formElements.lista.innerHTML += '<p class="no-quotes">📝 No hay cotizaciones registradas aún.</p>';
                formElements.container.style.display = 'none';
                return;
            }

            // Mostrar contenedor y renderizar cotizaciones
            formElements.container.style.display = 'block';
            
            cotizaciones.forEach((cotizacion, index) => {
                const cotizacionElement = this.createCotizacionElement(cotizacion, index);
                formElements.lista.appendChild(cotizacionElement);
            });

            // Configurar botones de eliminar
            this.setupDeleteButtons();
        }

        createCotizacionElement(cotizacion, index) {
            const div = document.createElement('div');
            div.className = 'cotizacion';
            div.setAttribute('data-id', cotizacion.id);

            const serviciosList = cotizacion.servicios
                .map(servicio => `<li>${servicio}</li>`)
                .join('');

            div.innerHTML = `
                <div class="cotizacion-header">
                    <span class="cotizacion-number">#${index + 1}</span>
                    <span class="cotizacion-date">📅 ${cotizacion.fecha}</span>
                </div>
                <div class="cotizacion-body">
                    <p class="cotizacion-item">
                        <strong>👤 Cliente:</strong> ${cotizacion.nombre}
                    </p>
                    <p class="cotizacion-item">
                        <strong>📧 Email:</strong> 
                        <a href="mailto:${cotizacion.email}">${cotizacion.email}</a>
                    </p>
                    <div class="cotizacion-item">
                        <strong>🎨 Servicios:</strong>
                        <ul class="cotizacion-servicios-list">${serviciosList}</ul>
                    </div>
                    <p class="cotizacion-item">
                        <strong>✨ Estilo:</strong> ${cotizacion.estilo}
                    </p>
                    <p class="cotizacion-item">
                        <strong>💭 Comentario:</strong> ${cotizacion.comentario}
                    </p>
                </div>
                <div class="cotizacion-actions">
                    <button class="eliminar-cotizacion" data-index="${index}" title="Eliminar cotización">
                        🗑️ Eliminar
                    </button>
                </div>
            `;

            return div;
        }

        setupDeleteButtons() {
            const deleteButtons = document.querySelectorAll('.eliminar-cotizacion');
            
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const index = parseInt(e.target.dataset.index);
                    this.confirmDelete(index);
                });
            });
        }

        confirmDelete(index) {
            const cotizaciones = this.getCotizaciones();
            const cotizacion = cotizaciones[index];
            
            if (!cotizacion) return;

            // Confirmación más amigable
            const confirmed = confirm(
                `¿Estás seguro de que quieres eliminar la cotización de "${cotizacion.nombre}"?\n\n` +
                `Esta acción no se puede deshacer.`
            );

            if (confirmed) {
                this.deleteCotizacion(index);
            }
        }

        deleteCotizacion(index) {
            try {
                const cotizaciones = this.getCotizaciones();
                const deleted = cotizaciones.splice(index, 1)[0];
                
                localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(cotizaciones));
                this.displayCotizaciones();
                
                console.log('🗑️ Cotización eliminada:', deleted.nombre);
                
                // Mostrar notificación
                this.showDeleteNotification(deleted.nombre);
            } catch (error) {
                console.error('❌ Error al eliminar cotización:', error);
                alert('Error al eliminar la cotización. Por favor, intenta nuevamente.');
            }
        }

        showDeleteNotification(nombre) {
            const notification = document.createElement('div');
            notification.className = 'delete-notification';
            notification.innerHTML = `🗑️ Cotización de "${nombre}" eliminada`;
            
            document.body.appendChild(notification);
            
            setTimeout(() => notification.classList.add('show'), 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }
    }

    // ===============================
    // INICIALIZACIÓN DE LA APP
    // ===============================
    
    // Verificar que los elementos críticos existan
    if (!formElements.form && !lightboxElements.gallery) {
        console.error('❌ No se encontraron elementos críticos de la aplicación');
        return;
    }

    // Inicializar la aplicación
    const app = new CotizadorApp();
    
    // Exponer la app globalmente para debugging (solo en desarrollo)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.CotizadorApp = app;
        console.log('🔧 Modo desarrollo: CotizadorApp disponible globalmente');
    }
});



