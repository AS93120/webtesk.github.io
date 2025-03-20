// Constantes et utilitaires
const SELECTORS = {
    split: '.split',
    splitButton: '.split-button',
    sections: 'section',
    filterButtons: '.filter-ui button',
    projects: '.project'
};

const validateEmail = (email) => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

// Gestionnaire d'intersection
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
        (entries) => entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        }), 
        { threshold: 0.1, rootMargin: '0px' }
    );

    document.querySelectorAll(SELECTORS.sections).forEach(section => observer.observe(section));
}

// Gestionnaire de filtrage
const handleFiltering = () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project');

    if (!filterButtons.length || !projects.length) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // Mise à jour des boutons
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            // Animation des projets
            projects.forEach(project => {
                project.classList.remove('visible');
                
                setTimeout(() => {
                    const isVisible = filter === 'all' || project.dataset.category === filter;
                    project.style.display = isVisible ? 'block' : 'none';
                    
                    if (isVisible) {
                        // Délai pour l'animation
                        requestAnimationFrame(() => {
                            project.classList.add('visible');
                        });
                    }
                }, 300); // Délai correspondant à la transition
            });
        });
    });

    // Afficher tous les projets au chargement
    projects.forEach(project => {
        requestAnimationFrame(() => {
            project.classList.add('visible');
        });
    });
};

// Gestionnaire de formulaire
const handleForm = () => {
    const form = document.getElementById('contact-form');
    const emailInput = document.getElementById('email');
    const errorMessage = document.querySelector('.error-message');

    if (!form || !emailInput || !errorMessage) return;

    const validateFormEmail = () => {
        const email = emailInput.value.trim();
        if (!email) {
            errorMessage.textContent = "L'email est requis.";
            return false;
        }
        if (!validateEmail(email)) {
            errorMessage.textContent = "Veuillez entrer une adresse email valide.";
            return false;
        }
        errorMessage.textContent = "";
        return true;
    };

    ['input', 'paste', 'change'].forEach(event => {
        emailInput.addEventListener(event, () => validateFormEmail());
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateFormEmail()) {
            console.log('Formulaire envoyé avec succès');
            form.reset();
        }
    });
};

const handleContactForm = () => {
    const form = document.getElementById('contact-form');
    const emailInput = document.getElementById('email');
    const errorMessage = document.querySelector('.error-message');

    if (form && emailInput && errorMessage) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateEmail(emailInput.value)) {
                // Animation de succès
                const submitBtn = form.querySelector('.submit-btn');
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Envoyé!';
                submitBtn.style.backgroundColor = '#28a745';
                
                // Réinitialisation après 2 secondes
                setTimeout(() => {
                    form.reset();
                    submitBtn.innerHTML = '<span class="btn-text">Envoyer</span>';
                    submitBtn.style.backgroundColor = '';
                }, 2000);
            } else {
                errorMessage.textContent = 'Email invalide';
                emailInput.focus();
            }
        });

        // Nettoyage du message d'erreur lors de la saisie
        emailInput.addEventListener('input', () => {
            errorMessage.textContent = '';
        });
    }
};

// Gestionnaire d'animation des sections
const handleSplitSections = () => {
    const splitSections = document.querySelectorAll(SELECTORS.split);
    const buttons = document.querySelectorAll(SELECTORS.splitButton);

    splitSections.forEach(section => {
        ['mouseenter', 'mouseleave'].forEach(event => {
            section.addEventListener(event, () => {
                section.style.zIndex = event === 'mouseenter' ? '2' : '1';
            });
        });
    });

    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(button.getAttribute('href'));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    const contactBtn = document.querySelector('.contact-btn');

    if (contactBtn) {
        contactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const contactSection = document.querySelector(contactBtn.getAttribute('href'));
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        // Animation du bouton au scroll
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            const threshold = window.innerHeight * 0.5;

            if (scrolled > threshold) {
                contactBtn.classList.add('pulse');
            } else {
                contactBtn.classList.remove('pulse');
            }
        });
    }
};

// Gestion des animations du menu
const handleMenuAnimations = () => {
    const menuItems = document.querySelectorAll('.menu a');
    
    // Animation au scroll
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
                const correspondingLink = document.querySelector(`.menu a[href="#${section.id}"]`);
                menuItems.forEach(item => item.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // Animation au hover pour les appareils non tactiles
    if (window.matchMedia('(hover: hover)').matches) {
        menuItems.forEach(item => {
            item.addEventListener('mouseover', () => {
                item.style.transform = 'translateY(-2px)';
            });
            
            item.addEventListener('mouseout', () => {
                item.style.transform = 'translateY(0)';
            });
        });
    }
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    handleFiltering();
    handleForm();
    handleSplitSections();
    handleMenuAnimations();
    handleContactForm();

    // Vérification du navigateur
    const { userAgent } = navigator;
    if (!/Chrome|Firefox|Safari/.test(userAgent)) {
        console.warn('Navigateur potentiellement incompatible détecté');
    }
});

