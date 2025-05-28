/**
 * 城市足迹展示组件
 */
class CityGrid {
    constructor() {
        this.provinces = [
            // 直辖市
            { name: '北京', visited: false },
            { name: '天津', visited: true, date: '2025-06' },
            { name: '上海', visited: true, date: '2025-04' },
            { name: '重庆', visited: false },
            
            // 华北地区
            { name: '河北', visited: false },
            { name: '山西', visited: false },
            { name: '内蒙古', visited: false },
            
            // 东北地区
            { name: '辽宁', visited: false },
            { name: '吉林', visited: false },
            { name: '黑龙江', visited: false },
            
            // 华东地区
            { name: '江苏', visited: false },
            { name: '浙江', visited: true, date: '2025-05' },
            { name: '安徽', visited: false },
            { name: '福建', visited: false },
            { name: '江西', visited: false },
            { name: '山东', visited: false },
            
            // 中南地区
            { name: '河南', visited: false },
            { name: '湖北', visited: false },
            { name: '湖南', visited: false },
            { name: '广东', visited: false },
            { name: '广西', visited: false },
            { name: '海南', visited: false },
            
            // 西南地区
            { name: '四川', visited: false },
            { name: '贵州', visited: false },
            { name: '云南', visited: false },
            { name: '西藏', visited: false },
            
            // 西北地区
            { name: '陕西', visited: false },
            { name: '甘肃', visited: false },
            { name: '青海', visited: false },
            { name: '宁夏', visited: false },
            { name: '新疆', visited: false },
            
            // 特别行政区
            { name: '香港', visited: false },
            { name: '澳门', visited: false },
            { name: '台湾', visited: false }
        ];
        
        this.container = document.getElementById('city-map');
        this.isExpanded = false;
        this.init();
    }

    init() {
        this.render();
        this.initSearch();
        this.initToggle();
    }

    render() {
        const html = `
            <div class="city-grid-container">
                <div class="section-header">
                    <h2>我们的足迹</h2>
                    <p>记录我们一起走过的省份</p>
                </div>
                <div class="city-grid-header">
                    <div class="search-box">
                        <input type="text" id="city-search" placeholder="搜索省份...">
                        <i class="fas fa-search"></i>
                    </div>
                    <button class="toggle-grid" id="toggle-grid">
                        <i class="fas fa-chevron-down"></i>
                        <span>展开全部</span>
                    </button>
                </div>
                <div class="city-grid" id="city-grid">
                    ${this.renderProvinces()}
                </div>
                <div class="city-stats">
                    <div class="stats-item">
                        <span class="stats-number" style="color: #333;">${this.provinces.filter(p => p.visited).length}</span>
                        <span class="stats-label" style="color: #333;">已去过</span>
                    </div>
                    <div class="stats-item">
                        <span class="stats-number" style="color: #333;">${this.provinces.length}</span>
                        <span class="stats-label" style="color: #333;">总省份</span>
                    </div>
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress" style="width: ${(this.provinces.filter(p => p.visited).length / this.provinces.length * 100).toFixed(1)}%"></div>
                        </div>
                        <span class="progress-text" style="color: #333;">${(this.provinces.filter(p => p.visited).length / this.provinces.length * 100).toFixed(1)}%</span>
                    </div>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
    }

    renderProvinces() {
        return this.provinces.map(province => `
            <div class="city-cell ${province.visited ? 'visited' : 'unvisited'}" data-province="${province.name}">
                <div class="province-name" style="color: ${province.visited ? '#fff' : '#333'}">${province.name}</div>
                ${province.visited ? `
                    <div class="visit-date" style="color: #fff">${province.date}</div>
                    <div class="visit-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                ` : ''}
            </div>
        `).join('');
    }

    initSearch() {
        const searchInput = document.getElementById('city-search');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const provinceCells = document.querySelectorAll('.city-cell');
            
            provinceCells.forEach(cell => {
                const provinceName = cell.dataset.province.toLowerCase();
                if (provinceName.includes(searchTerm)) {
                    cell.style.display = '';
                } else {
                    cell.style.display = 'none';
                }
            });
        });
    }

    initToggle() {
        const toggleBtn = document.getElementById('toggle-grid');
        const cityGrid = document.getElementById('city-grid');
        
        toggleBtn.addEventListener('click', () => {
            this.isExpanded = !this.isExpanded;
            cityGrid.style.maxHeight = this.isExpanded ? 'none' : '300px';
            toggleBtn.innerHTML = this.isExpanded ? 
                '<i class="fas fa-chevron-up"></i><span>收起</span>' : 
                '<i class="fas fa-chevron-down"></i><span>展开全部</span>';
        });
    }
}

// 添加样式
const style = document.createElement('style');
style.textContent = `
    .city-cell.unvisited {
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid #ddd;
    }
    .city-cell.visited {
        background: linear-gradient(135deg, #4CAF50, #45a049);
    }
    .progress-container {
        margin-top: 15px;
        width: 100%;
        text-align: center;
    }
    .progress-bar {
        width: 100%;
        height: 10px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: 5px;
    }
    .progress {
        height: 100%;
        background: linear-gradient(135deg, #4CAF50, #45a049);
        transition: width 0.3s ease;
    }
    .progress-text {
        font-size: 14px;
        font-weight: bold;
    }
    .city-cell {
        padding: 15px;
        border-radius: 8px;
        transition: all 0.3s ease;
    }
    .province-name {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
    }
`;
document.head.appendChild(style);

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    new CityGrid();
}); 