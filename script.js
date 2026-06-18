/**
 * PORTFOLIO WEBSITE INTERACTIVE LOGIC - UTSAVKUMAR PARMAR
 * Handles scroll animations, progress bars, stats counters, lightbox modals,
 * HTML5 Canvas particles, copy-to-clipboard, scroll indicator, back-to-top progress ring, and 3D tilt.
 */

document.addEventListener('DOMContentLoaded', () => {

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ==========================================================================
       1. MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    });

    /* ==========================================================================
       2. STICKY HEADER ON SCROLL
       ========================================================================== */
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    /* ==========================================================================
       3. SCROLL-ACTIVE LINKS HIGHLIGHT
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    const navActiveObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(section => {
        navActiveObserver.observe(section);
    });

    /* ==========================================================================
       4. ANIMATED SKILLS PROGRESS BARS
       ========================================================================== */
    const progressFills = document.querySelectorAll('.progress-bar-fill');
    const skillsSection = document.getElementById('skills');

    const fillBars = () => {
        progressFills.forEach(fill => {
            const progress = fill.getAttribute('data-progress');
            fill.style.width = progress;
        });
    };

    if (skillsSection) {
        if (prefersReducedMotion) {
            fillBars();
        } else {
            const skillsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        fillBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            skillsObserver.observe(skillsSection);
        }
    }

    /* ==========================================================================
       5. DYNAMIC STATS COUNTER ANIMATION
       ========================================================================== */
    const statNums = document.querySelectorAll('.stat-num');
    const achievementsSection = document.getElementById('achievements');

    const animateCounters = () => {
        statNums.forEach(num => {
            const target = parseInt(num.getAttribute('data-val'), 10);
            let current = 0;
            const duration = 1500; // ms
            const increment = target / (duration / 16); // ~60fps

            const updateCount = () => {
                current += increment;
                if (current < target) {
                    num.innerText = Math.floor(current) + (num.innerText.includes('%') || target === 100 || target === 15 || target === 30 || target === 95 || target === 10 ? '%' : '+');
                    if (target === 100 || target === 15 || target === 30 || target === 95 || target === 10) {
                        num.innerText = Math.floor(current) + "%";
                    } else if (target === 3900) {
                        num.innerText = Math.floor(current).toLocaleString() + "+";
                    } else {
                        num.innerText = Math.floor(current) + "+";
                    }
                    requestAnimationFrame(updateCount);
                } else {
                    if (target === 100 || target === 15 || target === 30 || target === 95 || target === 10) {
                        num.innerText = target + "%";
                    } else if (target === 3900) {
                        num.innerText = "3,900+";
                    } else {
                        num.innerText = target + "+";
                    }
                }
            };
            updateCount();
        });
    };

    if (achievementsSection) {
        if (prefersReducedMotion) {
            statNums.forEach(num => {
                const target = num.getAttribute('data-val');
                if (target === "3900") {
                    num.innerText = "3,900+";
                } else if (target === "100" || target === "15" || target === "30" || target === "95" || target === "10") {
                    num.innerText = target + "%";
                } else {
                    num.innerText = target + "+";
                }
            });
        } else {
            const achievementsObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounters();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.15 });

            achievementsObserver.observe(achievementsSection);
        }
    }

    /* ==========================================================================
       6. 3D FLIP CARDS ON TOUCH/TAP FOR MOBILE DEVICES
       ========================================================================== */
    const flipInners = document.querySelectorAll('.flip-card-inner');
    flipInners.forEach(inner => {
        inner.addEventListener('click', () => {
            inner.classList.toggle('flipped');
        });
    });

    /* ==========================================================================
       7. IMAGE & DOCUMENT LIGHTBOX MODAL
       ========================================================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

    if (lightbox && lightboxImg) {
        lightboxTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                const src = trigger.getAttribute('data-src');
                const alt = trigger.alt || trigger.innerText || "Document View";
                
                lightboxImg.src = src;
                lightboxCaption.innerText = alt
                    .replace("View Certificate", "")
                    .replace("View Recommendation", "")
                    .replace("View Recognition", "")
                    .replace("Zoom Simulation Document", "")
                    .replace("Zoom Document", "")
                    .trim();
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; // lock background scrolling
            });
        });

        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // unlock background scrolling
            lightboxImg.src = '';
        };

        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        lightbox.addEventListener('click', (e) => {
            if (e.target !== lightboxImg && e.target !== lightboxCaption) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === 'block') {
                closeLightbox();
            }
        });
    }

    /* ==========================================================================
       8. CONTACT FORM EMAIL GENERATION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            const emailRecipient = 'utsavparmar1206@gmail.com';
            const emailSubject = encodeURIComponent(`Portfolio Contact: ${subject}`);
            
            const emailBody = encodeURIComponent(
                `Hello Utsavkumar,\n\n` +
                `You have received a new message from your portfolio website contact form.\n\n` +
                `--------------------------------------------------\n` +
                `Sender Name: ${name}\n` +
                `Sender Email: ${email}\n` +
                `Subject: ${subject}\n` +
                `--------------------------------------------------\n\n` +
                `Message Details:\n${message}\n\n` +
                `Best regards,\n${name}`
            );
            
            window.location.href = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
        });
    }

    /* ==========================================================================
       9. HTML5 CANVAS SUPPLY CHAIN PARTICLE BACKDROP
       ========================================================================== */
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 60;
        const connectionDist = 120;

        const resizeCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.35;
                this.vy = (Math.random() - 0.5) * 0.35;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce check
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(212, 175, 55, 0.4)';
                ctx.fill();
            }
        }

        // Initialize particles
        for (let i = 0; i < maxParticles; i++) {
            particles.push(new Particle());
        }

        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections first
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDist) {
                        const alpha = (1 - dist / connectionDist) * 0.12;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.stroke();
                    }
                }
            }

            // Draw and update particles
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            requestAnimationFrame(animateParticles);
        };

        animateParticles();
    }

    /* ==========================================================================
       10. SCROLL PROGRESS INDICATOR (TOP)
       ========================================================================== */
    const scrollIndicator = document.getElementById('scroll-indicator');
    
    /* ==========================================================================
       11. BACK-TO-TOP BUTTON WITH SCROLL PROGRESS RING
       ========================================================================== */
    const backToTop = document.getElementById('back-to-top');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const ringRadius = 20;
    const ringCircumference = 2 * Math.PI * ringRadius;

    if (progressCircle) {
        progressCircle.style.strokeDasharray = ringCircumference;
        progressCircle.style.strokeDashoffset = ringCircumference;
    }

    const updateScrollMetrics = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

        // Top progress bar update
        if (scrollIndicator) {
            scrollIndicator.style.width = scrolled + '%';
        }

        // Back to top indicator update
        if (backToTop) {
            if (winScroll > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        }

        if (progressCircle) {
            const offset = ringCircumference - (scrolled / 100) * ringCircumference;
            progressCircle.style.strokeDashoffset = offset;
        }
    };

    window.addEventListener('scroll', updateScrollMetrics);

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       12. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
       ========================================================================== */
    const animElements = document.querySelectorAll('.animate-scroll, .animate-scroll-left, .animate-scroll-right');
    
    if (prefersReducedMotion) {
        animElements.forEach(el => el.classList.add('active'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // trigger animation only once
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px' // trigger slightly before entering viewport fully
        });

        animElements.forEach(el => {
            revealObserver.observe(el);
        });
    }

    /* ==========================================================================
       13. LIGHTWEIGHT 3D TILT EFFECT FOR PREMIUM CARDS
       ========================================================================== */
    const tiltElements = document.querySelectorAll('.ach-card, .outcome-card, .project-overview-card');

    if (!prefersReducedMotion && window.innerWidth > 992) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left; // x coordinate inside element
                const y = e.clientY - rect.top;  // y coordinate inside element
                
                const width = rect.width;
                const height = rect.height;
                
                const rotateX = ((y / height) - 0.5) * -10; // Max tilt 5 degrees on X
                const rotateY = ((x / width) - 0.5) * 10;   // Max tilt 5 degrees on Y
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    /* ==========================================================================
       14. COPY EMAIL ADDRESS TO CLIPBOARD
       ========================================================================== */
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailLink = document.getElementById('email-address');
    const copyTooltip = document.getElementById('copy-tooltip');

    if (copyEmailBtn && emailLink && copyTooltip) {
        copyEmailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const emailAddress = emailLink.innerText.trim();
            
            navigator.clipboard.writeText(emailAddress).then(() => {
                copyTooltip.innerText = "Copied!";
                copyEmailBtn.querySelector('i').className = "fa-solid fa-check";
                
                setTimeout(() => {
                    copyTooltip.innerText = "Copy";
                    copyEmailBtn.querySelector('i').className = "fa-regular fa-copy";
                }, 2000);
            }).catch(err => {
                console.error("Could not copy text: ", err);
            });
        });
    }
});