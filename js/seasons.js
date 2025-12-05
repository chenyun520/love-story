
class SeasonController {
    constructor() {
        this.seasons = ['spring', 'summer', 'autumn', 'winter'];
        this.icons = {
            spring: '🌸',
            summer: '☀️',
            autumn: '🍂',
            winter: '❄️'
        };
        // Check localStorage or default to spring
        this.currentSeason = localStorage.getItem('season') || 'spring';

        this.init();
    }

    init() {
        // Create container
        this.container = document.createElement('div');
        this.container.id = 'season-overlay';
        document.body.appendChild(this.container);

        // Create toggle button
        this.btn = document.createElement('button');
        this.btn.id = 'season-toggle';
        this.btn.innerText = this.icons[this.currentSeason];
        this.btn.title = "切换季节主题";
        this.btn.addEventListener('click', () => this.nextSeason());
        document.body.appendChild(this.btn);

        // Start effect
        this.renderSeason();
    }

    nextSeason() {
        const idx = this.seasons.indexOf(this.currentSeason);
        this.currentSeason = this.seasons[(idx + 1) % this.seasons.length];
        localStorage.setItem('season', this.currentSeason);
        this.btn.innerText = this.icons[this.currentSeason];
        this.renderSeason();
    }

    renderSeason() {
        // Clear existing
        this.container.innerHTML = '';
        this.container.className = this.currentSeason;

        if (this.currentSeason === 'spring') {
            this.createParticles(20, 'spring-petal');
        } else if (this.currentSeason === 'summer') {
            this.createParticles(15, 'summer-bubble');
            // Summer glare overlay
            const glare = document.createElement('div');
            glare.style.position = 'absolute';
            glare.style.top = 0; glare.style.left = 0; glare.style.width = '100%'; glare.style.height = '100%';
            glare.style.background = 'radial-gradient(circle at 90% 10%, rgba(255,255,224,0.3), transparent 40%)';
            glare.style.pointerEvents = 'none';
            this.container.appendChild(glare);
        } else if (this.currentSeason === 'autumn') {
            this.createParticles(25, 'autumn-leaf');
        } else if (this.currentSeason === 'winter') {
            this.createParticles(50, 'winter-snow');
        }
    }

    createParticles(count, className) {
        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = className;
            this.resetParticle(p);
            // Random delay so they don't all start at once
            p.style.animationDelay = `-${Math.random() * 10}s`;
            p.style.animationDuration = `${5 + Math.random() * 10}s`;
            this.container.appendChild(p);
        }
    }

    resetParticle(p) {
        p.style.left = Math.random() * 100 + '%';
        p.style.opacity = Math.random();
        p.style.transform = `scale(${0.5 + Math.random()})`;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SeasonController();
});
