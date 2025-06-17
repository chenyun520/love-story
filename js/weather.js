/**
 * 天气小工具模块 - 折叠式设计
 */
const WeatherWidget = {
    config: {
        cities: [
            { 
                name: '上海金山', 
                id: 'jinshan',
                icon: '🍔',
                label: '汉堡在这里',
                bgGradient: 'linear-gradient(135deg, #FF9A9E, #FAD0C4)'
            },
            { 
                name: '天津武清', 
                id: 'wuqing',
                icon: '👧',
                label: '大头在这里',
                bgGradient: 'linear-gradient(135deg, #FFB6C1, #FFC0CB)'
            }
        ],
        currentCityIndex: 0,
        isExpanded: false, // 新增：跟踪展开状态
        weatherIcons: {
            '晴': '🍔',
            '多云': '🍔',
            '阴': '🍔',
            '小雨': '🍔',
            '中雨': '🍔',
            '大雨': '🍔',
            '雷阵雨': '🍔',
            '雪': '🍔',
            '雾': '🍔'
        },
        clothingSuggestions: {
            cold: '天气寒冷，建议穿厚外套、毛衣、围巾',
            cool: '天气凉爽，建议穿外套、长袖衣服',
            mild: '天气舒适，建议穿薄外套或长袖衬衫',
            warm: '天气温暖，建议穿短袖T恤、裙子',
            hot: '天气炎热，建议穿轻薄、透气的衣物'
        }
    },

    init() {
        this.createWeatherWidget();
        this.updateDateTime();
        this.simulateWeather();
        this.setupEventListeners();
        
        // 定时更新
        setInterval(() => {
            this.updateDateTime();
        }, 1000);
        
        setInterval(() => {
            this.simulateWeather();
        }, 30 * 60 * 1000);
    },

    createWeatherWidget() {
        const widget = document.querySelector('.weather-widget');
        const currentCity = this.config.cities[this.config.currentCityIndex];
        
        widget.innerHTML = `
            <!-- 折叠状态 - 只显示图标 -->
            <div class="weather-collapsed" id="weather-collapsed">
                <div class="weather-toggle-icon" id="weather-icon">${currentCity.icon}</div>
                <div class="weather-mini-info">
                    <span class="mini-temp" id="mini-temp">--°</span>
                </div>
            </div>
            
            <!-- 展开状态 - 完整信息 -->
            <div class="weather-expanded" id="weather-expanded">
                <div class="weather-header">
                    <div class="weather-icon-large" id="weather-icon-large">${currentCity.icon}</div>
                    <div class="weather-info">
                        <div class="weather-location">
                            <span class="city-name">${currentCity.name} (${currentCity.label})</span>
                        </div>
                        <div class="weather-date" id="weather-date"></div>
                    </div>
                    <button class="weather-close-btn" id="weather-close-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="weather-main">
                    <div class="weather-temp" id="weather-temp">--°C</div>
                    <div class="weather-desc" id="weather-desc">--</div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail-item">
                        <i class="fas fa-tint"></i>
                        <span id="weather-humidity">--</span>
                    </div>
                    <div class="weather-detail-item">
                        <i class="fas fa-wind"></i>
                        <span id="weather-wind">--</span>
                    </div>
                </div>
                <div class="weather-suggestion">
                    <i class="fas fa-tshirt"></i>
                    <span id="weather-clothing">--</span>
                </div>
                <div class="weather-actions">
                    <button class="city-switch-btn" id="city-switch-btn">切换城市</button>
                </div>
            </div>
        `;
        
        // 设置初始样式
        widget.style.background = currentCity.bgGradient;
    },

    setupEventListeners() {
        const collapsedArea = document.getElementById('weather-collapsed');
        const closeBtn = document.getElementById('weather-close-btn');
        const switchBtn = document.getElementById('city-switch-btn');
        
        // 点击折叠区域展开
        collapsedArea.addEventListener('click', () => {
            this.toggleWeather(true);
        });
        
        // 点击关闭按钮折叠
        closeBtn.addEventListener('click', () => {
            this.toggleWeather(false);
        });
        
        // 切换城市
        switchBtn.addEventListener('click', () => {
            this.switchCity();
        });
    },

    toggleWeather(expand) {
        const widget = document.querySelector('.weather-widget');
        const collapsed = document.getElementById('weather-collapsed');
        const expanded = document.getElementById('weather-expanded');
        
        this.config.isExpanded = expand;
        
        if (expand) {
            // 展开动画
            widget.classList.add('expanding');
            collapsed.style.opacity = '0';
            collapsed.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                collapsed.style.display = 'none';
                expanded.style.display = 'block';
                expanded.style.opacity = '0';
                expanded.style.transform = 'translateY(20px)';
                
                requestAnimationFrame(() => {
                    expanded.style.opacity = '1';
                    expanded.style.transform = 'translateY(0)';
                    widget.classList.remove('expanding');
                    widget.classList.add('expanded');
                });
            }, 200);
        } else {
            // 折叠动画
            widget.classList.add('collapsing');
            expanded.style.opacity = '0';
            expanded.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                expanded.style.display = 'none';
                collapsed.style.display = 'flex';
                collapsed.style.opacity = '0';
                collapsed.style.transform = 'scale(1.2)';
                
                requestAnimationFrame(() => {
                    collapsed.style.opacity = '1';
                    collapsed.style.transform = 'scale(1)';
                    widget.classList.remove('collapsing', 'expanded');
                });
            }, 200);
        }
    },

    switchCity() {
        const switchBtn = document.getElementById('city-switch-btn');
        const iconLarge = document.getElementById('weather-icon-large');
        const iconSmall = document.getElementById('weather-icon');
        const cityName = document.querySelector('.city-name');
        const widget = document.querySelector('.weather-widget');
        
        switchBtn.classList.add('switching');
        
        // 动画效果
        iconLarge.style.transform = 'scale(0.5) rotate(180deg)';
        iconSmall.style.transform = 'scale(0.5) rotate(180deg)';
        cityName.style.opacity = '0';
        
        setTimeout(() => {
            // 切换到下一个城市
            this.config.currentCityIndex = (this.config.currentCityIndex + 1) % this.config.cities.length;
            const currentCity = this.config.cities[this.config.currentCityIndex];
            
            // 更新城市信息
            iconLarge.textContent = currentCity.icon;
            iconSmall.textContent = currentCity.icon;
            cityName.textContent = `${currentCity.name} (${currentCity.label})`;
            widget.style.background = currentCity.bgGradient;
            
            // 恢复动画
            iconLarge.style.transform = 'scale(1) rotate(0deg)';
            iconSmall.style.transform = 'scale(1) rotate(0deg)';
            cityName.style.opacity = '1';
            switchBtn.classList.remove('switching');
            
            // 重新获取天气数据
            this.simulateWeather();
        }, 300);
    },

    updateDateTime() {
        const dateElement = document.getElementById('weather-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateElement.textContent = now.toLocaleDateString('zh-CN', options);
        }
    },

    simulateWeather() {
        const weatherTypes = ['晴', '多云', '阴', '小雨', '中雨'];
        const randomWeather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
        const temperature = Math.floor(Math.random() * (30 - 15) + 15); // 15-30度
        const humidity = Math.floor(Math.random() * (90 - 40) + 40); // 40-90%
        const windSpeed = Math.floor(Math.random() * 30); // 0-30km/h

        this.updateWeatherUI({
            temperature,
            weather: randomWeather,
            humidity,
            windSpeed
        });
    },

    getClothingSuggestion(temperature) {
        if (temperature < 10) return this.config.clothingSuggestions.cold;
        if (temperature < 15) return this.config.clothingSuggestions.cool;
        if (temperature < 22) return this.config.clothingSuggestions.mild;
        if (temperature < 27) return this.config.clothingSuggestions.warm;
        return this.config.clothingSuggestions.hot;
    },

    updateWeatherUI(data) {
        // 更新展开状态的元素
        const tempElement = document.getElementById('weather-temp');
        const miniTempElement = document.getElementById('mini-temp');
        const descElement = document.getElementById('weather-desc');
        const humidityElement = document.getElementById('weather-humidity');
        const windElement = document.getElementById('weather-wind');
        const clothingElement = document.getElementById('weather-clothing');
        
        if (tempElement) tempElement.textContent = `${data.temperature}°C`;
        if (miniTempElement) miniTempElement.textContent = `${data.temperature}°`;
        if (descElement) descElement.textContent = data.weather;
        if (humidityElement) humidityElement.textContent = `湿度 ${data.humidity}%`;
        if (windElement) windElement.textContent = `风速 ${data.windSpeed}km/h`;
        if (clothingElement) clothingElement.textContent = this.getClothingSuggestion(data.temperature);
    },

    getWeatherBackground(weather) {
        const backgrounds = {
            '晴': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 243, 224, 0.95))',
            '多云': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(224, 242, 255, 0.95))',
            '阴': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 239, 241, 0.95))',
            '小雨': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(227, 242, 253, 0.95))',
            '中雨': 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(207, 216, 220, 0.95))'
        };
        return backgrounds[weather] || backgrounds['晴'];
    }
};

// 初始化天气小工具
document.addEventListener('DOMContentLoaded', () => {
    WeatherWidget.init();
}); 