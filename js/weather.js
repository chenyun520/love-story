/**
 * 天气小工具模块
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
        this.updateDateTime();
        const cityNameElement = document.querySelector('.city-name');
        const currentCity = this.config.cities[this.config.currentCityIndex];
        cityNameElement.textContent = `${currentCity.name} (${currentCity.label})`;
        
        this.simulateWeather();
        this.setupCitySwitch();
        
        setInterval(() => {
            this.updateDateTime();
        }, 1000);
        
        setInterval(() => {
            this.simulateWeather();
        }, 30 * 60 * 1000);
    },

    setupCitySwitch() {
        const locationElement = document.querySelector('.weather-location');
        const switchButton = document.createElement('button');
        switchButton.className = 'city-switch-btn';
        switchButton.innerHTML = '切换城市';
        switchButton.setAttribute('aria-label', '切换城市');
        
        switchButton.addEventListener('click', () => {
            this.switchCity();
            switchButton.classList.add('switching');
            setTimeout(() => {
                switchButton.classList.remove('switching');
            }, 500);
        });
        
        // 将按钮添加到城市名称后面
        locationElement.appendChild(switchButton);
    },

    switchCity() {
        const cityName = document.querySelector('.city-name');
        const weatherIcon = document.getElementById('weather-icon');
        const widget = document.querySelector('.weather-widget');
        
        cityName.style.opacity = '0';
        cityName.style.transform = 'translateY(-10px)';
        weatherIcon.style.opacity = '0';
        weatherIcon.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.config.currentCityIndex = (this.config.currentCityIndex + 1) % this.config.cities.length;
            const currentCity = this.config.cities[this.config.currentCityIndex];
            
            cityName.textContent = `${currentCity.name} (${currentCity.label})`;
            weatherIcon.textContent = currentCity.icon;
            weatherIcon.style.fontSize = currentCity.icon === '👧' ? '60px' : '40px';
            widget.style.background = currentCity.bgGradient;
            
            cityName.style.opacity = '1';
            cityName.style.transform = 'translateY(0)';
            weatherIcon.style.opacity = '1';
            weatherIcon.style.transform = 'scale(1)';
            
            this.simulateWeather();
        }, 300);
    },

    updateDateTime() {
        const dateElement = document.getElementById('weather-date');
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
    },

    // 模拟天气数据（实际项目中应该调用真实的天气API）
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
        const tempElement = document.getElementById('weather-temp');
        tempElement.textContent = `${data.temperature}°C`;

        const descElement = document.getElementById('weather-desc');
        descElement.textContent = data.weather;
        
        const iconElement = document.getElementById('weather-icon');
        const currentCity = this.config.cities[this.config.currentCityIndex];
        iconElement.textContent = currentCity.icon;
        iconElement.style.fontSize = currentCity.icon === '👧' ? '60px' : '40px'; // 女生头像更大
        iconElement.style.lineHeight = '1';
        iconElement.style.display = 'flex';
        iconElement.style.alignItems = 'center';
        iconElement.style.justifyContent = 'center';

        const humidityElement = document.getElementById('weather-humidity');
        humidityElement.textContent = `湿度 ${data.humidity}%`;

        const windElement = document.getElementById('weather-wind');
        windElement.textContent = `风速 ${data.windSpeed}km/h`;

        const clothingElement = document.getElementById('weather-clothing');
        clothingElement.textContent = this.getClothingSuggestion(data.temperature);

        const widget = document.querySelector('.weather-widget');
        widget.style.background = currentCity.bgGradient;
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