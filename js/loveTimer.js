/**
 * 爱情计时器模块
 */
const LoveTimer = {
    // 配置
    config: {
        startDate: '2025-03-30T13:25:25',
        updateInterval: 1000, // 更新间隔（毫秒）
        elements: {
            years: 'years-count',
            months: 'months-count',
            days: 'days-count',
            hours: 'hours-count',
            minutes: 'minutes-count',
            seconds: 'seconds-count'
        }
    },

    // 初始化
    init() {
        this.updateTimer();
        setInterval(() => this.updateTimer(), this.config.updateInterval);
    },

    // 计算时间差
    calculateTimeDiff() {
        const now = new Date();
        const startDate = new Date(this.config.startDate);
        return now - startDate;
    },

    // 更新显示
    updateTimer() {
        const diff = this.calculateTimeDiff();
        
        // 如果还没到开始时间，显示全0
        if (diff < 0) {
            Object.values(this.config.elements).forEach(id => {
                document.getElementById(id).textContent = '0';
            });
            return;
        }

        let remaining = diff;
        
        // 计算年
        const years = Math.floor(remaining / (365.25 * 24 * 60 * 60 * 1000));
        remaining -= years * (365.25 * 24 * 60 * 60 * 1000);
        
        // 计算月（按平均每月30.44天计算）
        const months = Math.floor(remaining / (30.44 * 24 * 60 * 60 * 1000));
        remaining -= months * (30.44 * 24 * 60 * 60 * 1000);
        
        // 计算天
        const days = Math.floor(remaining / (24 * 60 * 60 * 1000));
        remaining -= days * (24 * 60 * 60 * 1000);
        
        // 计算小时
        const hours = Math.floor(remaining / (60 * 60 * 1000));
        remaining -= hours * (60 * 60 * 1000);
        
        // 计算分钟
        const minutes = Math.floor(remaining / (60 * 1000));
        remaining -= minutes * (60 * 1000);
        
        // 计算秒
        const seconds = Math.floor(remaining / 1000);

        // 更新显示
        const timeValues = {
            years, months, days,
            hours, minutes, seconds
        };

        Object.entries(this.config.elements).forEach(([key, id]) => {
            document.getElementById(id).textContent = timeValues[key];
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    LoveTimer.init();
}); 