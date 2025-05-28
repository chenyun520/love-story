/**
 * 导航栏模块
 */
const Navigation = {
    // 配置
    config: {
        elements: {
            menuToggle: 'menu-toggle',
            navLinks: 'nav-links',
            navItems: '.nav-link'
        },
        classes: {
            active: 'active'
        },
        scrollOffset: 100
    },

    // 初始化
    init() {
        this.bindEvents();
        this.initScrollSpy();
    },

    // 绑定事件
    bindEvents() {
        const menuToggle = document.getElementById(this.config.elements.menuToggle);
        const navLinks = document.getElementById(this.config.elements.navLinks);
        const navItems = document.querySelectorAll(this.config.elements.navItems);

        // 菜单切换
        if (menuToggle && navLinks) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle(this.config.classes.active);
            });
        }

        // 点击导航项
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                // 关闭移动端菜单
                if (navLinks) {
                    navLinks.classList.remove(this.config.classes.active);
                }

                // 更新激活状态
                navItems.forEach(navItem => {
                    navItem.classList.remove(this.config.classes.active);
                });
                item.classList.add(this.config.classes.active);
            });
        });
    },

    // 初始化滚动监听
    initScrollSpy() {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const sections = document.querySelectorAll('section');
            const navItems = document.querySelectorAll(this.config.elements.navItems);

            sections.forEach(section => {
                const sectionTop = section.offsetTop - this.config.scrollOffset;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && 
                    scrollPosition < sectionTop + sectionHeight) {
                    // 移除所有导航项的active类
                    navItems.forEach(item => {
                        item.classList.remove(this.config.classes.active);
                    });

                    // 为当前部分对应的导航项添加active类
                    const currentNavItem = document.querySelector(
                        `${this.config.elements.navItems}[href="#${sectionId}"]`
                    );
                    if (currentNavItem) {
                        currentNavItem.classList.add(this.config.classes.active);
                    }
                }
            });
        });
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    Navigation.init();

    // 邮箱复制功能
    const emailLink = document.querySelector('.email-link');
    const emailAddress = '1178115320@qq.com';

    emailLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 创建临时输入框
        const tempInput = document.createElement('input');
        tempInput.value = emailAddress;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // 创建提示框
        const tooltip = document.createElement('div');
        tooltip.className = 'email-tooltip';
        tooltip.innerHTML = `
            <div class="tooltip-content">
                <i class="fas fa-envelope-open"></i>
                <p>邮箱地址已复制到剪贴板</p>
                <p class="email-address">${emailAddress}</p>
                <p class="tooltip-hint">现在可以去邮箱客户端发送邮件啦~</p>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .email-tooltip {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 255, 255, 0.95);
                padding: 20px 30px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: tooltipPop 0.3s ease;
                text-align: center;
            }

            @keyframes tooltipPop {
                0% {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                }
                100% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }

            .tooltip-content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
            }

            .tooltip-content i {
                font-size: 40px;
                color: #FF9A9E;
                margin-bottom: 10px;
                animation: envelope 1s ease infinite;
            }

            @keyframes envelope {
                0%, 100% {
                    transform: translateY(0);
                }
                50% {
                    transform: translateY(-5px);
                }
            }

            .tooltip-content p {
                margin: 5px 0;
                color: #333;
            }

            .email-address {
                font-family: monospace;
                font-size: 16px;
                color: #FF9A9E !important;
                padding: 8px 15px;
                background: #FFF5F5;
                border-radius: 5px;
                border: 1px dashed #FFB6C1;
            }

            .tooltip-hint {
                font-size: 14px;
                color: #666 !important;
                margin-top: 5px;
            }
        `;
        document.head.appendChild(style);

        // 添加提示框到页面
        document.body.appendChild(tooltip);

        // 点击任意位置关闭提示框
        const closeTooltip = (e) => {
            if (!tooltip.contains(e.target) || e.target === tooltip) {
                document.body.removeChild(tooltip);
                document.removeEventListener('click', closeTooltip);
            }
        };

        // 延迟添加点击事件，避免立即触发
        setTimeout(() => {
            document.addEventListener('click', closeTooltip);
        }, 100);
    });
}); 