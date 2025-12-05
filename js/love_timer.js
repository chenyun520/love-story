class LoveTimer {
    constructor(startDateStr, containerId) {
        this.startDate = new Date(startDateStr);
        this.container = document.getElementById(containerId);
        this.lastSecond = -1;

        if (this.container) {
            this.init();
        } else {
            console.warn(`LoveTimer: Container #${containerId} not found.`);
        }
    }

    init() {
        // Render the skeleton
        this.container.innerHTML = `
            <div class="love-timer-wrapper">
                <div class="lt-header">记录我们的点点滴滴</div>
                <div class="lt-subheader">在一起的时间</div>

                <div class="lt-grid">
                    <div class="lt-box">
                        <div class="lt-num" id="${this.container.id}-year">0</div>
                        <div class="lt-label">年</div>
                    </div>
                    <div class="lt-box">
                        <div class="lt-num" id="${this.container.id}-month">0</div>
                        <div class="lt-label">月</div>
                    </div>
                    <div class="lt-box">
                        <div class="lt-num" id="${this.container.id}-day">0</div>
                        <div class="lt-label">天</div>
                    </div>
                    <div class="lt-box">
                        <div class="lt-num" id="${this.container.id}-hour">0</div>
                        <div class="lt-label">时</div>
                    </div>
                    <div class="lt-box">
                        <div class="lt-num" id="${this.container.id}-minute">0</div>
                        <div class="lt-label">分</div>
                    </div>
                    <div class="lt-box relative">
                        <div class="lt-num highlight" id="${this.container.id}-second">0</div>
                        <div class="lt-label">秒</div>
                        <div class="lt-sheep-spawn-point" id="${this.container.id}-sheep-point"></div>
                    </div>
                </div>

                <div class="lt-footer">
                    始于 2025年11月05日 18:25:00
                </div>
            </div>
        `;

        // Start loop
        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();
        let diff = now - this.startDate;

        // If future date, just show 0 or handle logic.
        // Assuming we want to show "time since", if it's negative, it means "starts in".
        // But user wants a memorial, so usually it counts up.
        // If the user sets a future date, we'll just show 0s or countdown.
        // Let's assume we want absolute difference for "duration".

        const isFuture = diff < 0;
        diff = Math.abs(diff);

        // Calculate units
        const sec = 1000;
        const min = sec * 60;
        const hour = min * 60;
        const day = hour * 24;

        // Simple approximation for Year/Month (not perfect due to leap years/varying months but standard for simple JS timers)
        // A more robust way is getting full years, then full months, etc.

        let d1 = new Date(Math.min(now, this.startDate));
        let d2 = new Date(Math.max(now, this.startDate));

        let years = d2.getFullYear() - d1.getFullYear();
        let months = d2.getMonth() - d1.getMonth();
        let days = d2.getDate() - d1.getDate();

        if (days < 0) {
            months--;
            // Get days in previous month
            let prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            days += prevMonth.getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        let hours = d2.getHours() - d1.getHours();
        if (hours < 0) {
            days--;
            hours += 24;
        }

        let minutes = d2.getMinutes() - d1.getMinutes();
        if (minutes < 0) {
            hours--;
            minutes += 60;
        }

        let seconds = d2.getSeconds() - d1.getSeconds();
        if (seconds < 0) {
            minutes--;
            seconds += 60;
        }

        // Update DOM
        this.setText(`${this.container.id}-year`, years);
        this.setText(`${this.container.id}-month`, months);
        this.setText(`${this.container.id}-day`, days);
        this.setText(`${this.container.id}-hour`, String(hours).padStart(2, '0'));
        this.setText(`${this.container.id}-minute`, String(minutes).padStart(2, '0'));

        const secEl = document.getElementById(`${this.container.id}-second`);
        if (secEl) {
            const currentSecStr = String(seconds).padStart(2, '0');
            if (secEl.innerText !== currentSecStr) {
                 secEl.innerText = currentSecStr;
                 this.spawnSheep();
            }
        }
    }

    setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    }

    spawnSheep() {
        const point = document.getElementById(`${this.container.id}-sheep-point`);
        if (!point) return;

        const sheep = document.createElement('div');
        sheep.className = 'lt-floating-sheep';
        sheep.innerText = '+1 🐑';

        // Randomize slight x position
        const randomX = (Math.random() - 0.5) * 20;
        sheep.style.left = `${randomX}px`;

        point.appendChild(sheep);

        // Remove after animation
        setTimeout(() => {
            sheep.remove();
        }, 1500);
    }
}
