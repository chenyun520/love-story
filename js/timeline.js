// 时间轴数据
const timelineEvents = [
    {
        date: '2025-05-02',
        title: '去天津找大头',
        description: '我们去听了相声逛街到凌晨',
        image: '微信图片_20250520142113.jpg',
        category: '约会',
        position: 'left'
    },
    {
        date: '2025-04-01',
        title: '第一次为爱车加油',
        description: '大头第一次为我的爱车加油，记录下这温馨的瞬间，你没有怪我走错了路，也没说我傻傻的等了很久不存在的限行',
        image: '大头第一次为我加油.jpg',
        category: '日常生活'
    },
    {
        date: '2025-03-30',
        title: '相遇的第一天',
        description: '在上海金山相遇，开始了我们的故事',
        category: '重要时刻',
        image: '微信图片_20250520144439.jpg'
    }
];

class Timeline {
    constructor() {
        this.container = document.getElementById('timeline-container');
        this.expandedEvent = null; // 当前展开的事件
        this.init();
    }

    init() {
        this.renderEvents();
        this.initEventListeners();
    }

    renderEvents() {
        const eventsHtml = timelineEvents.map((event, index) => {
            const position = index % 2 === 0 ? 'left' : 'right';
            
            return `
                <div class="timeline-event ${position}" data-date="${event.date}">
                    <div class="timeline-content timeline-thumbnail" data-event-id="${event.date}">
                        <!-- 缩略图模式 -->
                        <div class="event-thumbnail">
                            <div class="event-date-badge">${this.formatShortDate(event.date)}</div>
                            ${event.image ? `
                                <div class="event-photo-thumbnail">
                                    <img src="images/${event.image}" alt="${event.title}" loading="lazy">
                                </div>
                            ` : `
                                <div class="event-no-photo">
                                    <i class="fas fa-heart"></i>
                                </div>
                            `}
                            <h4 class="event-title-short">${event.title}</h4>
                            <div class="event-category-tag">${event.category}</div>
                            <button class="expand-event-btn">
                                <i class="fas fa-chevron-down"></i>
                                <span>查看详情</span>
                            </button>
                        </div>
                        
                        <!-- 详细内容（默认隐藏） -->
                        <div class="event-details" style="display: none;">
                            <div class="event-header">
                                <div class="event-date">${this.formatDate(event.date)}</div>
                                <button class="collapse-event-btn">
                                    <i class="fas fa-chevron-up"></i>
                                </button>
                            </div>
                            <h3 class="event-title">${event.title}</h3>
                            ${event.image ? `
                                <div class="event-image-container">
                                    <img src="images/${event.image}" alt="${event.title}" class="event-image" loading="lazy">
                                    <div class="image-overlay">
                                        <button class="view-full-image" title="查看完整图片">
                                            <i class="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                            <p class="event-description">${event.description}</p>
                            <div class="event-meta">
                                <span class="event-category">${event.category}</span>
                                <div class="memory-tags">
                                    ${this.generateMemoryTags(event)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        this.container.innerHTML = eventsHtml;
    }

    initEventListeners() {
        // 展开/折叠事件
        this.container.addEventListener('click', (e) => {
            const expandBtn = e.target.closest('.expand-event-btn');
            const collapseBtn = e.target.closest('.collapse-event-btn');
            
            if (expandBtn) {
                e.preventDefault();
                e.stopPropagation();
                const eventElement = expandBtn.closest('.timeline-event');
                this.expandEvent(eventElement);
            }
            
            if (collapseBtn) {
                e.preventDefault();
                e.stopPropagation();
                const eventElement = collapseBtn.closest('.timeline-event');
                this.collapseEvent(eventElement);
            }
        });

        // 图片点击事件
        this.container.addEventListener('click', (e) => {
            const viewImageBtn = e.target.closest('.view-full-image');
            if (viewImageBtn) {
                e.preventDefault();
                e.stopPropagation();
                const eventElement = viewImageBtn.closest('.timeline-event');
                const eventData = timelineEvents.find(e => e.date === eventElement.dataset.date);
                if (eventData && eventData.image) {
                    this.showImageModal(eventData);
                }
            }
        });
    }

    expandEvent(eventElement) {
        // 先折叠其他已展开的事件
        if (this.expandedEvent && this.expandedEvent !== eventElement) {
            this.collapseEvent(this.expandedEvent);
        }

        const thumbnail = eventElement.querySelector('.event-thumbnail');
        const details = eventElement.querySelector('.event-details');
        const content = eventElement.querySelector('.timeline-content');

        // 添加展开动画
        content.classList.add('expanding');
        
        // 隐藏缩略图
        thumbnail.style.opacity = '0';
        setTimeout(() => {
            thumbnail.style.display = 'none';
            details.style.display = 'block';
            details.style.opacity = '0';
            details.style.transform = 'translateY(20px)';
            
            requestAnimationFrame(() => {
                details.style.opacity = '1';
                details.style.transform = 'translateY(0)';
                content.classList.remove('expanding');
                content.classList.add('expanded');
            });
        }, 200);

        this.expandedEvent = eventElement;
        
        // 平滑滚动到展开的事件
        setTimeout(() => {
            eventElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 300);
    }

    collapseEvent(eventElement) {
        const thumbnail = eventElement.querySelector('.event-thumbnail');
        const details = eventElement.querySelector('.event-details');
        const content = eventElement.querySelector('.timeline-content');

        // 添加折叠动画
        content.classList.add('collapsing');
        details.style.opacity = '0';
        details.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            details.style.display = 'none';
            thumbnail.style.display = 'block';
            thumbnail.style.opacity = '0';
            thumbnail.style.transform = 'scale(0.9)';
            
            requestAnimationFrame(() => {
                thumbnail.style.opacity = '1';
                thumbnail.style.transform = 'scale(1)';
                content.classList.remove('collapsing', 'expanded');
            });
        }, 200);

        if (this.expandedEvent === eventElement) {
            this.expandedEvent = null;
        }
    }

    showImageModal(eventData) {
        if (document.querySelector('.modal-container')) {
            return; // 如果已经有模态框，则不再创建新的
        }

        const modal = document.createElement('div');
        modal.className = 'modal-container';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${eventData.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="images/${eventData.image}" alt="${eventData.title}" class="full-image">
                    <div class="image-info">
                        <p class="image-date">${this.formatDate(eventData.date)}</p>
                        <p class="image-description">${eventData.description}</p>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.close-modal');
        const closeModal = () => {
            if (document.body.contains(modal)) {
                document.body.removeChild(modal);
                document.body.style.overflow = '';
                document.removeEventListener('keydown', handleEsc);
            }
        };

        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                closeModal();
            }
        };

        closeBtn.onclick = closeModal;
        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
        document.addEventListener('keydown', handleEsc);

        requestAnimationFrame(() => {
            document.body.style.overflow = 'hidden';
        });
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatShortDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    getEventEmoji(category) {
        const emojiMap = {
            '重要时刻': '🎊',
            '日常生活': '🏡',
            '约会': '💑',
            '旅行': '✈️',
            '纪念日': '🎉',
            '其他': '💝'
        };
        return emojiMap[category] || '💖';
    }

    generateMemoryTags(event) {
        // 这里可以根据事件的不同属性生成不同的标签
        const tags = [];
        
        // 根据日期添加季节标签
        const month = new Date(event.date).getMonth() + 1;
        if (month >= 3 && month <= 5) tags.push('🌸 春日时光');
        else if (month >= 6 && month <= 8) tags.push('☀️ 夏日记忆');
        else if (month >= 9 && month <= 11) tags.push('🍁 秋日物语');
        else tags.push('❄️ 冬日温情');
        
        // 根据类别添加标签
        if (event.category === '约会') tags.push('💑 甜蜜约会');
        if (event.category === '重要时刻') tags.push('🎉 特别时刻');
        if (event.category === '旅行') tags.push('🌍 旅行记忆');
        
        // 根据描述内容添加标签
        if (event.description.includes('相声')) tags.push('🎭 欢乐时光');
        if (event.description.includes('逛街')) tags.push('🛍️ 购物之旅');
        if (event.description.includes('加油')) tags.push('⛽ 温馨时刻');
        
        return tags.map(tag => `<span class="memory-tag">${tag}</span>`).join('');
    }
}

// 初始化时间轴
document.addEventListener('DOMContentLoaded', () => {
    new Timeline();
});
