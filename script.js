/**
 * PORTFOLIO WEBSITE INTERACTIVE LOGIC - UTSAVKUMAR PARMAR
 * Handles scroll animations, progress bars, stats counters, lightbox modals, and form processing.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MOBILE NAVIGATION MENU
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Toggle hamburger icon between bars and xmark
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
            if (navMenu.classList.contains('active')) {
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
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
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
        rootMargin: '-30% 0px -60% 0px' // highlights section when it occupies the center area of the screen
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
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fillBars();
                    observer.unobserve(entry.target); // only animate once
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
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
                    num.innerText = Math.floor(current) + "+";
                    requestAnimationFrame(updateCount);
                } else {
                    num.innerText = target + "+";
                }
            };
            updateCount();
        });
    };

    if (achievementsSection) {
        const achievementsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target); // only animate once
                }
            });
        }, { threshold: 0.15 });

        achievementsObserver.observe(achievementsSection);
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
                lightboxCaption.innerText = alt.replace("View Certificate", "").replace("View Recommendation", "").replace("View Recognition", "").trim();
                lightbox.style.display = 'block';
                document.body.style.overflow = 'hidden'; // lock background scrolling
            });
        });

        // Close functions
        const closeLightbox = () => {
            lightbox.style.display = 'none';
            document.body.style.overflow = ''; // unlock background scrolling
            lightboxImg.src = '';
        };

        lightboxClose.addEventListener('click', closeLightbox);
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
            
            // Redirect using mailto
            window.location.href = `mailto:${emailRecipient}?subject=${emailSubject}&body=${emailBody}`;
        });
    }
});