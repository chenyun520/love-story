// 主要JavaScript文件，用于初始化和通用功能

// 计算在一起的时间
function calculateLoveTime() {
    const startDate = new Date('2025-03-30T13:25:25');
    const now = new Date();
    
    // 计算时间差（毫秒）
    const diff = now - startDate;
    
    // 如果还没到开始时间，显示全0
    if (diff < 0) {
        document.getElementById('years-count').textContent = '0';
        document.getElementById('months-count').textContent = '0';
        document.getElementById('days-count').textContent = '0';
        document.getElementById('hours-count').textContent = '0';
        document.getElementById('minutes-count').textContent = '0';
        document.getElementById('seconds-count').textContent = '0';
        return;
    }
    
    // 计算年月日时分秒
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
    document.getElementById('years-count').textContent = years;
    document.getElementById('months-count').textContent = months;
    document.getElementById('days-count').textContent = days;
    document.getElementById('hours-count').textContent = hours;
    document.getElementById('minutes-count').textContent = minutes;
    document.getElementById('seconds-count').textContent = seconds;
}

// 导航栏交互
function initNavigation() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    const navItems = document.querySelectorAll('.nav-link');
    
    // 菜单切换
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
    
    // 点击导航项关闭菜单
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            
            // 移除所有导航项的active类
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            // 为当前点击的导航项添加active类
            item.classList.add('active');
        });
    });
    
    // 滚动监听
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // 移除所有导航项的active类
                navItems.forEach(item => {
                    item.classList.remove('active');
                });
                
                // 为当前部分对应的导航项添加active类
                const currentNavItem = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (currentNavItem) {
                    currentNavItem.classList.add('active');
                }
            }
        });
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 计算在一起的时间
    calculateLoveTime();
    
    // 初始化导航栏
    initNavigation();
    
    // 每秒更新一次时间
    setInterval(calculateLoveTime, 1000);
});
