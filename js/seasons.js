// Season Effects Manager
(function() {
    const seasons = ['spring', 'summer', 'autumn', 'winter'];
    let currentSeason = 'spring'; // Default
    let intervalId = null;
    const container = document.createElement('div');

    // Setup container
    container.id = 'season-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999'; // Below modals but above content
    container.style.overflow = 'hidden';
    document.body.appendChild(container);

    // Create UI Toggle
    const toggle = document.createElement('div');
    toggle.className = 'season-toggle';
    toggle.innerHTML = `
        <div class="season-btn" data-season="spring" title="春暖花开">🌸</div>
        <div class="season-btn" data-season="summer" title="夏日气泡">🫧</div>
        <div class="season-btn" data-season="autumn" title="秋叶飘落">🍂</div>
        <div class="season-btn" data-season="winter" title="冬雪皑皑">❄️</div>
    `;
    // Style the toggle
    Object.assign(toggle.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '10px',
        background: 'rgba(255,255,255,0.8)',
        backdropFilter: 'blur(5px)',
        padding: '8px',
        borderRadius: '30px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        zIndex: '10000'
    });
    document.body.appendChild(toggle);

    // Toggle Logic
    toggle.addEventListener('click', (e) => {
        const btn = e.target.closest('.season-btn');
        if (btn) {
            setSeason(btn.dataset.season);
        }
    });

    function setSeason(season) {
        if (!seasons.includes(season)) return;
        currentSeason = season;

        // Update Active UI
        document.querySelectorAll('.season-btn').forEach(b => {
            b.style.transform = b.dataset.season === season ? 'scale(1.2)' : 'scale(1)';
            b.style.opacity = b.dataset.season === season ? '1' : '0.6';
        });

        // Clear existing
        container.innerHTML = '';
        if (intervalId) clearInterval(intervalId);

        // Start new effect
        switch (season) {
            case 'spring': startSpring(); break;
            case 'summer': startSummer(); break;
            case 'autumn': startAutumn(); break;
            case 'winter': startWinter(); break;
        }
    }

    function createParticle(content, className, animationDuration, sizeRange) {
        const p = document.createElement('div');
        p.textContent = content;
        p.className = 'season-particle ' + className;
        const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
        p.style.fontSize = `${size}px`;
        p.style.position = 'absolute';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = '-50px';
        p.style.opacity = Math.random() * 0.5 + 0.5;
        p.style.animation = `fall ${animationDuration}s linear infinite`;
        p.style.animationDelay = Math.random() * 5 + 's';

        // Horizontal sway
        const sway = (Math.random() - 0.5) * 100;
        p.style.transform = `translateX(${sway}px)`;

        container.appendChild(p);

        // Cleanup
        setTimeout(() => { p.remove(); }, animationDuration * 1000);
    }

    // --- Effects ---

    function startSpring() {
        // Flowers falling slowly
        const symbols = ['🌸', '💮', '🌱', '🦋'];
        intervalId = setInterval(() => {
            const sym = symbols[Math.floor(Math.random() * symbols.length)];
            createParticle(sym, 'spring-p', 10 + Math.random()*5, [15, 25]);
        }, 800);
    }

    function startSummer() {
        // Bubbles rising (Reverse gravity in CSS or just animate Up)
        intervalId = setInterval(() => {
            const p = document.createElement('div');
            p.className = 'bubble';
            const size = 10 + Math.random() * 20;
            p.style.width = size + 'px';
            p.style.height = size + 'px';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = '-50px'; // Start from bottom
            p.style.position = 'absolute';
            p.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.2))';
            p.style.borderRadius = '50%';
            p.style.animation = `rise ${8 + Math.random()*5}s linear infinite`;
            container.appendChild(p);
            setTimeout(() => p.remove(), 13000);
        }, 500);
    }

    function startAutumn() {
        // Leaves falling
        const symbols = ['🍂', '🍁', '🌾'];
        intervalId = setInterval(() => {
            const sym = symbols[Math.floor(Math.random() * symbols.length)];
            createParticle(sym, 'autumn-p', 8 + Math.random()*4, [20, 30]);
        }, 600);
    }

    function startWinter() {
        // Snow
        intervalId = setInterval(() => {
            createParticle('❄️', 'winter-p', 5 + Math.random()*5, [10, 20]);
        }, 200);
    }

    // Inject Styles for Animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fall {
            0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(110vh) translateX(50px) rotate(360deg); opacity: 0; }
        }
        @keyframes rise {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 0.8; }
            100% { transform: translateY(-110vh) translateX(50px); opacity: 0; }
        }
        .season-btn { cursor: pointer; transition: transform 0.2s; font-size: 1.5rem; }
        .season-btn:hover { transform: scale(1.2); }
    `;
    document.head.appendChild(style);

    // Initialize
    setSeason('spring');

})();
