/**
 * ============================================
 * FÍSICA CUÁNTICA - JavaScript Interactivo
 * ============================================
 * Este archivo contiene todas las animaciones
 * e interacciones de la página web.
 * 
 * Contenido:
 * 1. Animación de partículas cuánticas (Hero)
 * 2. Navegación fija y menú móvil
 * 3. Simulación: Gato de Schrödinger
 * 4. Simulación: Entrelazamiento cuántico
 * 5. Simulación: Experimento de doble rendija
 * 6. Simulación: Principio de incertidumbre
 * 7. Animaciones de scroll
 * 
 * @author Física Cuántica Educativa
 * @version 1.0.0
 * ============================================
 */

// ========================================
// ESPERA A QUE EL DOM ESTÉ LISTO
// ========================================
// Ejecutamos todo el código cuando la página
// ha cargado completamente
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // 1. ANIMACIÓN DE PARTÍCULAS CUÁNTICAS
    // ========================================
    // Crea partículas que se mueven aleatoriamente
    // en el fondo de la sección hero
    // ========================================
    
    const particleCanvas = document.getElementById('particleCanvas');
    
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        let particles = [];
        let animationId;
        
        // Configuración de las partículas
        const particleConfig = {
            count: 80,           // Número de partículas
            connectionDistance: 100, // Distancia para conectar partículas
            maxSpeed: 1,         // Velocidad máxima
            colors: ['#00f5ff', '#ff00ff', '#39ff14', '#b347ff'] // Colores neón
        };
        
        // Clase Particle: representa una partícula individual
        class Particle {
            constructor() {
                this.reset();
            }
            
            // Inicializa o reinicia la partícula
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height;
                this.vx = (Math.random() - 0.5) * particleConfig.maxSpeed * 2;
                this.vy = (Math.random() - 0.5) * particleConfig.maxSpeed * 2;
                this.radius = Math.random() * 3 + 1;
                this.color = particleConfig.colors[Math.floor(Math.random() * particleConfig.colors.length)];
                this.alpha = Math.random() * 0.5 + 0.3;
            }
            
            // Actualiza la posición de la partícula
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Rebote en los bordes
                if (this.x < 0 || this.x > particleCanvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > particleCanvas.height) this.vy *= -1;
            }
            
            // Dibuja la partícula en el canvas
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.alpha;
                ctx.fill();
                ctx.globalAlpha = 1;
                
                // Efecto de brillo
                ctx.shadowBlur = 10;
                ctx.shadowColor = this.color;
            }
        }
        
        // Inicializa el canvas y las partículas
        function initParticles() {
            // Ajusta el tamaño del canvas al contenedor
            particleCanvas.width = particleCanvas.offsetWidth;
            particleCanvas.height = particleCanvas.offsetHeight;
            
            // Crea las partículas
            particles = [];
            for (let i = 0; i < particleConfig.count; i++) {
                particles.push(new Particle());
            }
        }
        
        // Dibuja líneas entre partículas cercanas
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < particleConfig.connectionDistance) {
                        const alpha = 1 - (distance / particleConfig.connectionDistance);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 245, 255, ${alpha * 0.3})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Bucle principal de animación
        function animateParticles() {
            ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            
            // Actualiza y dibuja cada partícula
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Dibuja conexiones entre partículas cercanas
            drawConnections();
            
            animationId = requestAnimationFrame(animateParticles);
        }
        
        // Inicializa y comienza la animación
        initParticles();
        animateParticles();
        
        // Recalcula al redimensionar la ventana
        window.addEventListener('resize', () => {
            initParticles();
        });
    }
    
    // ========================================
    // 2. NAVEGACIÓN FIJA Y MENÚ MÓVIL
    // ========================================
    // Controla el comportamiento del menú de
    // navegación, incluyendo el menú hamburguesa
    // ========================================
    
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Efecto de scroll en la navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Actualiza el enlace activo según la sección visible
        updateActiveNavLink();
    });
    
    // Toggle del menú móvil
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Cierra el menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Actualiza el enlace de navegación activo
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // ========================================
    // 3. SIMULACIÓN: GATO DE SCHRÖDINGER
    // ========================================
    // Simula el famoso experimento mental donde
    // un gato está en superposición de estados
    // ========================================
    
    const schrodingerBox = document.getElementById('schrodingerBox');
    const boxLid = document.getElementById('boxLid');
    const catState = document.getElementById('catState');
    const stateLabel = document.getElementById('stateLabel');
    const quantumState = document.getElementById('quantumState');
    const resetSchrodinger = document.getElementById('resetSchrodinger');
    
    if (schrodingerBox && boxLid) {
        let isOpen = false;
        let catIsAlive = null;
        
        // Abre la caja y "colapsa" la función de onda
        schrodingerBox.addEventListener('click', () => {
            if (isOpen) return; // Evita múltiples clics
            
            isOpen = true;
            boxLid.classList.add('open');
            
            // Determina aleatoriamente si el gato está vivo o muerto
            catIsAlive = Math.random() > 0.5;
            
            // Actualiza la visualización
            setTimeout(() => {
                const catEmoji = catState.querySelector('.cat-emoji');
                
                if (catIsAlive) {
                    catEmoji.classList.add('alive');
                    catEmoji.textContent = '😺';
                    stateLabel.textContent = '¡VIVO!';
                    stateLabel.style.color = '#39ff14';
                } else {
                    catEmoji.classList.add('dead');
                    catEmoji.textContent = '🙀';
                    stateLabel.textContent = 'Muerto';
                    stateLabel.style.color = '#ff4444';
                }
                
                // Actualiza el estado cuántico
                const stateIndicator = quantumState.querySelector('.state-indicator');
                const stateText = quantumState.querySelector('.state-text');
                
                stateIndicator.style.background = catIsAlive ? '#39ff14' : '#ff4444';
                stateIndicator.style.animation = 'none';
                stateText.textContent = `Estado: ${catIsAlive ? 'VIVO' : 'MUERTO'} (Colapsado)`;
                stateText.style.color = catIsAlive ? '#39ff14' : '#ff4444';
                
            }, 300);
        });
        
        // Reinicia la simulación
        if (resetSchrodinger) {
            resetSchrodinger.addEventListener('click', () => {
                isOpen = false;
                catIsAlive = null;
                
                boxLid.classList.remove('open');
                
                const catEmoji = catState.querySelector('.cat-emoji');
                catEmoji.classList.remove('alive', 'dead');
                catEmoji.textContent = '🐱';
                
                stateLabel.textContent = 'Superposición';
                stateLabel.style.color = '';
                
                const stateIndicator = quantumState.querySelector('.state-indicator');
                const stateText = quantumState.querySelector('.state-text');
                
                stateIndicator.style.background = '#00f5ff';
                stateIndicator.style.animation = 'quantum-pulse 1s ease-in-out infinite';
                stateText.textContent = 'Estado: Superposición';
                stateText.style.color = '#00f5ff';
            });
        }
    }
    
    // ========================================
    // 4. SIMULACIÓN: ENTRELAZAMIENTO CUÁNTICO
    // ========================================
    // Visualiza cómo dos partículas entrelazadas
    // responden instantáneamente entre sí
    // ========================================
    
    const entanglementCanvas = document.getElementById('entanglementCanvas');
    
    if (entanglementCanvas) {
        const ctx = entanglementCanvas.getContext('2d');
        
        // Ajusta el tamaño del canvas
        entanglementCanvas.width = entanglementCanvas.offsetWidth;
        entanglementCanvas.height = entanglementCanvas.offsetHeight;
        
        // Estado de las partículas
        let particleA = {
            x: entanglementCanvas.width * 0.25,
            y: entanglementCanvas.height / 2,
            spin: 1, // 1 = arriba, -1 = abajo
            targetX: entanglementCanvas.width * 0.25,
            color: '#00f5ff'
        };
        
        let particleB = {
            x: entanglementCanvas.width * 0.75,
            y: entanglementCanvas.height / 2,
            spin: -1, // Siempre opuesto a A (entrelazadas)
            targetX: entanglementCanvas.width * 0.75,
            color: '#ff00ff'
        };
        
        let distance = 0;
        let isAnimating = true;
        
        // Dibuja una partícula con su spin
        function drawParticle(particle, label) {
            const radius = 25;
            
            // Círculo de la partícula
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(10, 10, 15, 0.9)';
            ctx.fill();
            ctx.strokeStyle = particle.color;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Efecto de brillo
            ctx.shadowBlur = 20;
            ctx.shadowColor = particle.color;
            
            // Flecha de spin
            ctx.beginPath();
            const arrowSize = 15;
            if (particle.spin === 1) {
                // Flecha hacia arriba
                ctx.moveTo(particle.x, particle.y - arrowSize);
                ctx.lineTo(particle.x - arrowSize/2, particle.y + arrowSize/2);
                ctx.lineTo(particle.x + arrowSize/2, particle.y + arrowSize/2);
            } else {
                // Flecha hacia abajo
                ctx.moveTo(particle.x, particle.y + arrowSize);
                ctx.lineTo(particle.x - arrowSize/2, particle.y - arrowSize/2);
                ctx.lineTo(particle.x + arrowSize/2, particle.y - arrowSize/2);
            }
            ctx.closePath();
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Resetear shadow
            ctx.shadowBlur = 0;
            
            // Etiqueta
            ctx.font = 'bold 14px Rajdhani';
            ctx.fillStyle = particle.color;
            ctx.textAlign = 'center';
            ctx.fillText(label, particle.x, particle.y + radius + 20);
            
            // Valor del spin
            ctx.font = '12px Rajdhani';
            ctx.fillStyle = '#b0b0c0';
            ctx.fillText(`Spin: ${particle.spin === 1 ? '↑' : '↓'}`, particle.x, particle.y + radius + 35);
        }
        
        // Dibuja la línea de conexión entre partículas
        function drawConnection() {
            const gradient = ctx.createLinearGradient(particleA.x, 0, particleB.x, 0);
            gradient.addColorStop(0, particleA.color);
            gradient.addColorStop(0.5, '#b347ff');
            gradient.addColorStop(1, particleB.color);
            
            ctx.beginPath();
            ctx.moveTo(particleA.x, particleA.y);
            ctx.lineTo(particleB.x, particleB.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
            
            // Partículas virtuales en la conexión
            const time = Date.now() / 1000;
            const particleCount = 5;
            for (let i = 0; i < particleCount; i++) {
                const t = (time + i / particleCount) % 1;
                const x = particleA.x + (particleB.x - particleA.x) * t;
                const y = particleA.y + Math.sin(t * Math.PI * 4 + time * 5) * 10;
                
                ctx.beginPath();
                ctx.arc(x, y, 3, 0, Math.PI * 2);
                ctx.fillStyle = '#b347ff';
                ctx.fill();
            }
        }
        
        // Bucle de animación
        function animateEntanglement() {
            ctx.clearRect(0, 0, entanglementCanvas.width, entanglementCanvas.height);
            
            // Actualiza posiciones suavemente
            particleA.x += (particleA.targetX - particleA.x) * 0.05;
            particleB.x += (particleB.targetX - particleB.x) * 0.05;
            
            // Dibuja la conexión
            drawConnection();
            
            // Dibuja las partículas
            drawParticle(particleA, 'A');
            drawParticle(particleB, 'B');
            
            // Actualiza el contador de distancia
            const distanceKm = Math.round(distance);
            const distanceElement = document.getElementById('distanceValue');
            if (distanceElement) {
                distanceElement.textContent = distanceKm;
            }
            
            if (isAnimating) {
                requestAnimationFrame(animateEntanglement);
            }
        }
        
        // Cambia el spin de una partícula (y la otra responde)
        entanglementCanvas.addEventListener('click', (e) => {
            const rect = entanglementCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Verifica si se hizo clic en una partícula
            const distA = Math.sqrt((x - particleA.x) ** 2 + (y - particleA.y) ** 2);
            const distB = Math.sqrt((x - particleB.x) ** 2 + (y - particleB.y) ** 2);
            
            if (distA < 30) {
                // Cambia el spin de A, B responde instantáneamente
                particleA.spin *= -1;
                particleB.spin = -particleA.spin;
                
                // Efecto visual de respuesta instantánea
                flashConnection();
            } else if (distB < 30) {
                // Cambia el spin de B, A responde instantáneamente
                particleB.spin *= -1;
                particleA.spin = -particleB.spin;
                
                flashConnection();
            }
        });
        
        // Efecto de flash en la conexión
        function flashConnection() {
            const originalLineWidth = ctx.lineWidth;
            let flashIntensity = 1;
            
            function flash() {
                flashIntensity -= 0.1;
                if (flashIntensity > 0) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(particleA.x, particleA.y);
                    ctx.lineTo(particleB.x, particleB.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${flashIntensity})`;
                    ctx.lineWidth = 5;
                    ctx.stroke();
                    ctx.restore();
                    requestAnimationFrame(flash);
                }
            }
            flash();
        }
        
        // Botón de reinicio - separa las partículas
        const resetEntanglement = document.getElementById('resetEntanglement');
        if (resetEntanglement) {
            resetEntanglement.addEventListener('click', () => {
                // Aumenta la distancia
                distance += 1000;
                
                // Mueve las partículas hacia los bordes
                particleA.targetX = 40;
                particleB.targetX = entanglementCanvas.width - 40;
            });
        }
        
        // Inicia la animación
        animateEntanglement();
        
        // Recalcula al redimensionar
        window.addEventListener('resize', () => {
            entanglementCanvas.width = entanglementCanvas.offsetWidth;
            entanglementCanvas.height = entanglementCanvas.offsetHeight;
            particleA.y = entanglementCanvas.height / 2;
            particleB.y = entanglementCanvas.height / 2;
        });
    }
    
    // ========================================
    // 5. SIMULACIÓN: EXPERIMENTO DOBLE RENDIJA
    // ========================================
    // Visualiza cómo los electrones crean un
    // patrón de interferencia u otro según observación
    // ========================================
    
    const slitCanvas = document.getElementById('slitCanvas');
    const observationToggle = document.getElementById('observationToggle');
    
    if (slitCanvas && observationToggle) {
        const ctx = slitCanvas.getContext('2d');
        
        slitCanvas.width = slitCanvas.offsetWidth;
        slitCanvas.height = slitCanvas.offsetHeight;
        
        let electrons = [];
        let isObserving = false;
        let electronCount = 0;
        
        // Clase Electron
        class Electron {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = 20;
                this.y = slitCanvas.height / 2 + (Math.random() - 0.5) * 60;
                this.vx = 3;
                this.vy = isObserving ? 0 : (Math.random() - 0.5) * 2;
                this.detected = false;
                this.detectionX = 0;
                this.detectionY = 0;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                
                // Si está en modo observación, elige una rendija
                if (isObserving && this.x > slitCanvas.width * 0.4 && !this.detected) {
                    this.detected = true;
                    // 50% de probabilidad para cada rendija
                    const upperSlit = Math.random() > 0.5;
                    this.vy = upperSlit ? -1.5 : 1.5;
                    this.detectionY = upperSlit ? slitCanvas.height * 0.35 : slitCanvas.height * 0.65;
                }
                
                // Reinicia si sale del canvas
                if (this.x > slitCanvas.width) {
                    this.reset();
                    electronCount++;
                    updateElectronCount();
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = isObserving ? '#ff00ff' : '#00f5ff';
                ctx.fill();
                
                // Efecto de brillo
                ctx.shadowBlur = 10;
                ctx.shadowColor = isObserving ? '#ff00ff' : '#00f5ff';
                ctx.shadowBlur = 0;
            }
        }
        
        // Dibuja el experimento
        function drawExperiment() {
            // Limpia el canvas
            ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
            ctx.fillRect(0, 0, slitCanvas.width, slitCanvas.height);
            
            // Dibuja la barrera con rendijas
            const barrierX = slitCanvas.width * 0.4;
            ctx.fillStyle = '#2a2a4e';
            ctx.fillRect(barrierX, 0, 10, slitCanvas.height * 0.4); // Parte superior
            ctx.fillRect(barrierX, slitCanvas.height * 0.6, 10, slitCanvas.height * 0.4); // Parte inferior
            
            // Dibuja las rendijas
            ctx.fillStyle = '#0a0a0f';
            ctx.fillRect(barrierX - 2, slitCanvas.height * 0.4, 14, slitCanvas.height * 0.08); // Rendija superior
            ctx.fillRect(barrierX - 2, slitCanvas.height * 0.52, 14, slitCanvas.height * 0.08); // Rendija inferior
            
            // Dibuja el detector/pantalla
            ctx.fillStyle = 'rgba(0, 245, 255, 0.1)';
            ctx.fillRect(slitCanvas.width - 20, 0, 20, slitCanvas.height);
            
            // Dibuja los detectores de observación si está activado
            if (isObserving) {
                ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
                ctx.fillRect(barrierX - 10, slitCanvas.height * 0.38, 30, 20);
                ctx.fillRect(barrierX - 10, slitCanvas.height * 0.50, 30, 20);
                
                // Etiquetas
                ctx.font = '10px Rajdhani';
                ctx.fillStyle = '#ff00ff';
                ctx.fillText('DETECTOR', barrierX - 15, slitCanvas.height * 0.35);
            }
            
            // Dibuja el patrón acumulado en la pantalla
            drawPattern();
        }
        
        // Dibuja el patrón de interferencia o de partículas
        function drawPattern() {
            const screenX = slitCanvas.width - 20;
            const patternWidth = 15;
            
            // Patrón de interferencia (onda)
            if (!isObserving) {
                const gradient = ctx.createLinearGradient(screenX, 0, screenX + patternWidth, 0);
                for (let i = 0; i <= 10; i++) {
                    const y = i / 10;
                    const intensity = Math.sin(y * Math.PI * 4) * 0.5 + 0.5;
                    gradient.addColorStop(y, `rgba(0, 245, 255, ${intensity * 0.5})`);
                }
                ctx.fillStyle = gradient;
                ctx.fillRect(screenX, 0, patternWidth, slitCanvas.height);
            } else {
                // Patrón de partículas (dos franjas)
                ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
                ctx.fillRect(screenX, slitCanvas.height * 0.3, patternWidth, slitCanvas.height * 0.15);
                ctx.fillRect(screenX, slitCanvas.height * 0.55, patternWidth, slitCanvas.height * 0.15);
            }
        }
        
        // Actualiza el contador de electrones
        function updateElectronCount() {
            const countElement = document.getElementById('electronCount');
            if (countElement) {
                countElement.textContent = electronCount;
            }
        }
        
        // Bucle de animación
        function animateSlit() {
            drawExperiment();
            
            // Actualiza y dibuja los electrones
            electrons.forEach(electron => {
                electron.update();
                electron.draw();
            });
            
            requestAnimationFrame(animateSlit);
        }
        
        // Crea electrones periódicamente
        function spawnElectron() {
            if (electrons.length < 50) {
                electrons.push(new Electron());
            }
            setTimeout(spawnElectron, 200);
        }
        
        // Toggle de observación
        observationToggle.addEventListener('change', (e) => {
            isObserving = e.target.checked;
            // Reinicia los electrones para mostrar el cambio
            electrons.forEach(e => e.reset());
        });
        
        // Inicializa
        for (let i = 0; i < 20; i++) {
            setTimeout(() => electrons.push(new Electron()), i * 100);
        }
        
        animateSlit();
        spawnElectron();
        
        // Recalcula al redimensionar
        window.addEventListener('resize', () => {
            slitCanvas.width = slitCanvas.offsetWidth;
            slitCanvas.height = slitCanvas.offsetHeight;
        });
    }
    
    // ========================================
    // 6. SIMULACIÓN: PRINCIPIO DE INCERTIDUMBRE
    // ========================================
    // Visualiza la relación entre la precisión
    // de posición y momento de Heisenberg
    // ========================================
    
    const uncertaintyCanvas = document.getElementById('uncertaintyCanvas');
    const positionSlider = document.getElementById('positionSlider');
    const momentumSlider = document.getElementById('momentumSlider');
    const positionValue = document.getElementById('positionValue');
    const momentumValue = document.getElementById('momentumValue');
    const uncertaintyFill = document.getElementById('uncertaintyFill');
    const uncertaintyPercent = document.getElementById('uncertaintyPercent');
    
    if (uncertaintyCanvas && positionSlider && momentumSlider) {
        const ctx = uncertaintyCanvas.getContext('2d');
        
        uncertaintyCanvas.width = uncertaintyCanvas.offsetWidth;
        uncertaintyCanvas.height = uncertaintyCanvas.offsetHeight;
        
        let positionPrecision = 50;
        let momentumPrecision = 50;
        
        // Dibuja la visualización de incertidumbre
        function drawUncertainty() {
            ctx.clearRect(0, 0, uncertaintyCanvas.width, uncertaintyCanvas.height);
            
            const centerX = uncertaintyCanvas.width / 2;
            const centerY = uncertaintyCanvas.height / 2;
            
            // Calcula las dimensiones basadas en la precisión
            // Menor precisión de posición = onda más extendida
            const positionWidth = (101 - positionPrecision) * 2;
            const momentumSpread = (101 - momentumPrecision) * 0.5;
            
            // Dibuja la función de onda (paquete de ondas)
            ctx.beginPath();
            ctx.moveTo(0, centerY);
            
            for (let x = 0; x < uncertaintyCanvas.width; x++) {
                const distanceFromCenter = (x - centerX) / (positionWidth + 20);
                const envelope = Math.exp(-distanceFromCenter * distanceFromCenter);
                const wave = Math.sin(x * 0.2 * (1 + momentumSpread)) * envelope * 40;
                ctx.lineTo(x, centerY + wave);
            }
            
            // Gradiente para la onda
            const gradient = ctx.createLinearGradient(0, 0, uncertaintyCanvas.width, 0);
            gradient.addColorStop(0, 'rgba(0, 245, 255, 0)');
            gradient.addColorStop(0.5, 'rgba(0, 245, 255, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Dibuja el área de incertidumbre de posición
            ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
            ctx.fillRect(
                centerX - positionWidth / 2,
                10,
                positionWidth,
                15
            );
            
            // Etiqueta de posición
            ctx.font = '12px Rajdhani';
            ctx.fillStyle = '#ff00ff';
            ctx.textAlign = 'center';
            ctx.fillText('Δx (Posición)', centerX, 8);
            
            // Dibuja el área de incertidumbre de momento
            ctx.fillStyle = 'rgba(57, 255, 20, 0.2)';
            ctx.fillRect(
                centerX - 30,
                uncertaintyCanvas.height - 25,
                60 + momentumSpread * 10,
                15
            );
            
            // Etiqueta de momento
            ctx.fillStyle = '#39ff14';
            ctx.fillText('Δp (Momento)', centerX, uncertaintyCanvas.height - 5);
            
            // Línea vertical en el centro
            ctx.beginPath();
            ctx.moveTo(centerX, 30);
            ctx.lineTo(centerX, uncertaintyCanvas.height - 30);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
            ctx.setLineDash([5, 5]);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Actualiza los valores y la visualización
        function updateUncertainty() {
            positionPrecision = parseInt(positionSlider.value);
            momentumPrecision = parseInt(momentumSlider.value);
            
            // Actualiza los textos
            positionValue.textContent = positionPrecision + '%';
            momentumValue.textContent = momentumPrecision + '%';
            
            // Calcula la incertidumbre total (producto Δx * Δp)
            // Cuando uno es preciso, el otro es impreciso
            const positionUncertainty = 101 - positionPrecision;
            const momentumUncertainty = 101 - momentumPrecision;
            const totalUncertainty = Math.sqrt(positionUncertainty * momentumUncertainty);
            
            // Actualiza la barra de incertidumbre
            const uncertaintyPercentage = Math.min(100, totalUncertainty * 2);
            uncertaintyFill.style.width = uncertaintyPercentage + '%';
            uncertaintyPercent.textContent = Math.round(uncertaintyPercentage) + '%';
            
            // Cambia el color según la incertidumbre
            if (uncertaintyPercentage < 30) {
                uncertaintyFill.style.background = 'linear-gradient(90deg, #39ff14, #00f5ff)';
            } else if (uncertaintyPercentage < 70) {
                uncertaintyFill.style.background = 'linear-gradient(90deg, #00f5ff, #ffaa00)';
            } else {
                uncertaintyFill.style.background = 'linear-gradient(90deg, #ffaa00, #ff4444)';
            }
            
            drawUncertainty();
        }
        
        // Event listeners para los sliders
        positionSlider.addEventListener('input', updateUncertainty);
        momentumSlider.addEventListener('input', updateUncertainty);
        
        // Inicializa
        updateUncertainty();
        
        // Recalcula al redimensionar
        window.addEventListener('resize', () => {
            uncertaintyCanvas.width = uncertaintyCanvas.offsetWidth;
            uncertaintyCanvas.height = uncertaintyCanvas.offsetHeight;
            drawUncertainty();
        });
    }
    
    // ========================================
    // 7. ANIMACIONES DE SCROLL
    // ========================================
    // Añade efectos de aparición suave a los
    // elementos al hacer scroll
    // ========================================
    
    // Selecciona elementos para animar
    const animatedElements = document.querySelectorAll(
        '.text-content, .simulation-container, .app-card'
    );
    
    // Añade clase inicial
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
    });
    
    // Observador de intersección
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Deja de observar una vez animado
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observa todos los elementos
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // ========================================
    // EFECTOS ADICIONALES
    // ========================================
    
    // Efecto de parallax sutil en el hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
        }
    });
    
    // Efecto de cursor personalizado (opcional, desactivado por defecto)
    // Descomenta para activar
    /*
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 20px;
        height: 20px;
        border: 2px solid #00f5ff;
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
        box-shadow: 0 0 10px #00f5ff;
    `;
    document.body.appendChild(cursor);
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });
    */
    
});

// ========================================
// FUNCIONES DE UTILIDAD GLOBALES
// ========================================

/**
 * Genera un número aleatorio entre min y max
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatorio
 */
function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Mapea un valor de un rango a otro
 * @param {number} value - Valor a mapear
 * @param {number} inMin - Mínimo del rango de entrada
 * @param {number} inMax - Máximo del rango de entrada
 * @param {number} outMin - Mínimo del rango de salida
 * @param {number} outMax - Máximo del rango de salida
 * @returns {number} Valor mapeado
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Calcula la distancia entre dos puntos
 * @param {number} x1 - Coordenada X del punto 1
 * @param {number} y1 - Coordenada Y del punto 1
 * @param {number} x2 - Coordenada X del punto 2
 * @param {number} y2 - Coordenada Y del punto 2
 * @returns {number} Distancia euclidiana
 */
function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// ========================================
// CONSOLE EASTER EGG
// ========================================
// Mensaje divertido para desarrolladores curiosos
console.log('%c⚛ Física Cuántica ⚛', 'font-size: 24px; font-weight: bold; color: #00f5ff; text-shadow: 0 0 10px #00f5ff;');
console.log('%c¡Bienvenido al mundo cuántico!', 'font-size: 14px; color: #ff00ff;');
console.log('%cSi estás leyendo esto, probablemente eres un observador... ¿o estás en superposición?', 'font-size: 12px; color: #b0b0c0; font-style: italic;');
