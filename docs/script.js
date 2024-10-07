// Animate feature list items
function animateFeatures() {
    const features = document.querySelectorAll('.feature-list li');
    features.forEach((feature, index) => {
        feature.style.opacity = '0';
        feature.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            feature.style.transition = 'opacity 0.5s, transform 0.5s';
            feature.style.opacity = '1';
            feature.style.transform = 'translateX(0)';
        }, index * 200);
    });
}

// Animate command cards
function animateCommandCards() {
    const cards = document.querySelectorAll('.command-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.8)';
        setTimeout(() => {
            card.style.transition = 'opacity 0.5s, transform 0.5s';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        }, index * 200);
    });
}

// Typewriter effect for the main title
function typewriterEffect(element, text, speed) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Parallax effect for the header
function parallaxEffect() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset;
        header.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
    });
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.animated-title');
    typewriterEffect(title, 'Discord Music Bot', 100);

    setTimeout(animateFeatures, 1000);
    setTimeout(animateCommandCards, 1500);

    parallaxEffect();
});

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add a floating music note animation
function createFloatingNote() {
    const note = document.createElement('div');
    note.innerHTML = '♪';
    note.style.position = 'absolute';
    note.style.fontSize = '24px';
    note.style.color = '#7289DA';
    note.style.left = Math.random() * window.innerWidth + 'px';
    note.style.top = window.innerHeight + 'px';
    note.style.opacity = '0';
    document.body.appendChild(note);

    const animation = note.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: 'translateY(-' + window.innerHeight + 'px) rotate(360deg)', opacity: 0 }
    ], {
        duration: Math.random() * 3000 + 3000,
        easing: 'linear',
        iterations: 1
    });

    animation.onfinish = () => {
        note.remove();
        createFloatingNote();
    };
}

// Start floating note animation
for (let i = 0; i < 3; i++) {
    setTimeout(createFloatingNote, i * 2000);
}
