class LoveTimer {
    constructor(startDateStr, containerId) {
        this.startDate = new Date(startDateStr);
        this.container = document.getElementById(containerId);

        if (this.container) {
            this.init();
        } else {
            console.warn(`LoveTimer: Container #${containerId} not found.`);
        }
    }

    init() {
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

        this.update();
        setInterval(() => this.update(), 1000);
    }

    update() {
        const now = new Date();

        // Handle swap for absolute difference
        let d1 = new Date(this.startDate);
        let d2 = new Date(now);

        if (d1 > d2) {
             let temp = d1;
             d1 = d2;
             d2 = temp;
        }

        // Calculate differences
        let seconds = d2.getSeconds() - d1.getSeconds();
        let minutes = d2.getMinutes() - d1.getMinutes();
        let hours = d2.getHours() - d1.getHours();
        let days = d2.getDate() - d1.getDate();
        let months = d2.getMonth() - d1.getMonth();
        let years = d2.getFullYear() - d1.getFullYear();

        // Adjust for negative values
        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            // Get last day of previous month relative to d2
            // d2.getMonth() returns 0-11.
            // new Date(year, month, 0) returns last day of previous month index.
            // If d2 is Dec (11), we want days in Nov (10).
            // new Date(2025, 11, 0) -> Nov 30. Correct.
            let prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
            days += prevMonth.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        // Sanity Check
        if (days < 0) days = 0;
        if (months < 0) months = 0;
        if (years < 0) years = 0;

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

        const randomX = (Math.random() - 0.5) * 20;
        sheep.style.left = `${randomX}px`;

        point.appendChild(sheep);

        setTimeout(() => {
            sheep.remove();
        }, 1500);
    }
}
