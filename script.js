/**
 * ZenTrader - Interactive Functionality
 * Meditation platform for traders
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollReveal();
    initCounterAnimation();
    initAudioPlayer();
    initSmoothScroll();
    initNavScrollEffect();
});

/**
 * Scroll Reveal Animations
 * Triggers animations when elements enter viewport
 */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-header, .session-card, .philosophy-content, .philosophy-visual, .testimonial-card, .cta-content'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for session cards
                if (entry.target.classList.contains('session-card')) {
                    const cards = document.querySelectorAll('.session-card');
                    const cardIndex = Array.from(cards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${cardIndex * 0.1}s`;
                }

                entry.target.classList.add('reveal', 'visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
}

/**
 * Counter Animation
 * Animates stat numbers on scroll
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number[data-count]');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.floor(easedProgress * target);

        element.textContent = current.toLocaleString();

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }

    requestAnimationFrame(updateCounter);
}

/**
 * Audio Player
 * Controls meditation session playback
 */
function initAudioPlayer() {
    const player = document.getElementById('audioPlayer');
    const playButtons = document.querySelectorAll('.session-play');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const closeBtn = document.getElementById('closePlayer');
    const progressBar = document.querySelector('.progress-bar');
    const trackTitle = document.querySelector('.track-title');
    const currentTimeEl = document.querySelector('.current-time');
    const totalTimeEl = document.querySelector('.total-time');

    let isPlaying = false;
    let currentProgress = 31; // Demo starting progress

    // Session data
    const sessions = {
        'Morning Bell Preparation': { duration: '12:00', color: 'gold' },
        'Calm in the Storm': { duration: '8:00', color: 'green' },
        'The Patient Trader': { duration: '20:00', color: 'blue' },
        'Closing Bell Release': { duration: '15:00', color: 'orange' },
        'After a Loss': { duration: '10:00', color: 'recovery' },
        'Laser Focus Reset': { duration: '5:00', color: 'white' }
    };

    // Play button click handlers
    playButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.session-card');
            const title = card.querySelector('.session-title').textContent;
            const duration = card.querySelector('.session-duration').textContent;

            openPlayer(title, duration);
        });
    });

    function openPlayer(title, duration) {
        trackTitle.textContent = title;
        totalTimeEl.textContent = duration;
        currentTimeEl.textContent = '0:00';
        progressBar.style.width = '0%';
        currentProgress = 0;

        player.classList.add('active');
        isPlaying = true;
        playPauseBtn.textContent = '❚❚';

        startProgressSimulation();
    }

    // Play/Pause toggle
    playPauseBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playPauseBtn.textContent = isPlaying ? '❚❚' : '▶';

        if (isPlaying) {
            startProgressSimulation();
        }
    });

    // Close player
    closeBtn.addEventListener('click', () => {
        player.classList.remove('active');
        isPlaying = false;
    });

    // Progress bar click
    document.querySelector('.player-progress').addEventListener('click', (e) => {
        const rect = e.target.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width * 100;
        progressBar.style.width = `${percent}%`;
        currentProgress = percent;
        updateTimeDisplay(percent);
    });

    let progressInterval;

    function startProgressSimulation() {
        if (progressInterval) clearInterval(progressInterval);

        progressInterval = setInterval(() => {
            if (isPlaying && currentProgress < 100) {
                currentProgress += 0.1;
                progressBar.style.width = `${currentProgress}%`;
                updateTimeDisplay(currentProgress);
            } else if (currentProgress >= 100) {
                clearInterval(progressInterval);
                isPlaying = false;
                playPauseBtn.textContent = '▶';
            }
        }, 100);
    }

    function updateTimeDisplay(percent) {
        const totalParts = totalTimeEl.textContent.split(':');
        const totalSeconds = parseInt(totalParts[0]) * 60 + parseInt(totalParts[1] || 0);
        const currentSeconds = Math.floor((percent / 100) * totalSeconds);
        const mins = Math.floor(currentSeconds / 60);
        const secs = currentSeconds % 60;
        currentTimeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

/**
 * Smooth Scroll
 * Handles anchor link smooth scrolling
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);

            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Navigation Scroll Effect
 * Adds background to nav on scroll
 */
function initNavScrollEffect() {
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            nav.style.background = 'rgba(13, 13, 15, 0.95)';
            nav.style.backdropFilter = 'blur(20px)';
        } else {
            nav.style.background = 'linear-gradient(to bottom, rgba(13, 13, 15, 1), transparent)';
            nav.style.backdropFilter = 'blur(10px)';
        }

        // Hide/show nav on scroll direction
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });

    // Add transition for smooth hide/show
    nav.style.transition = 'transform 0.3s ease, background 0.3s ease';
}

/**
 * Form Handling
 * Email signup form
 */
document.querySelector('.cta-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('.cta-input').value;

    if (email && isValidEmail(email)) {
        // Simulate form submission
        const button = e.target.querySelector('.btn-primary');
        const originalText = button.textContent;

        button.textContent = 'Welcome aboard ✓';
        button.style.background = '#3d9970';

        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
            e.target.reset();
        }, 3000);
    }
});

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Waveform Animation Enhancement
 * Randomizes waveform heights periodically for "breathing" effect
 */
function initWaveformBreathing() {
    const waveforms = document.querySelectorAll('.waveform:not(.focus)');

    waveforms.forEach(waveform => {
        const spans = waveform.querySelectorAll('span');

        setInterval(() => {
            spans.forEach(span => {
                const currentHeight = parseFloat(span.style.getPropertyValue('--h'));
                const variation = (Math.random() - 0.5) * 20;
                const newHeight = Math.max(15, Math.min(95, currentHeight + variation));
                span.style.setProperty('--h', `${newHeight}%`);
            });
        }, 3000);
    });
}

// Initialize breathing effect after page load
setTimeout(initWaveformBreathing, 2000);

/**
 * Keyboard Navigation
 * Accessibility improvements
 */
document.addEventListener('keydown', (e) => {
    const player = document.getElementById('audioPlayer');

    if (player.classList.contains('active')) {
        if (e.code === 'Space') {
            e.preventDefault();
            document.getElementById('playPauseBtn').click();
        } else if (e.code === 'Escape') {
            document.getElementById('closePlayer').click();
        }
    }
});

/**
 * Parallax Effect on Hero
 * Subtle movement on scroll
 */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-visual');

    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

console.log('🧘 ZenTrader initialized. Trade with clarity.');
