// 创意模块 - 心愿清单和纪念日倒计时
const wishlistData = [
    {
        id: 1,
        title: "一起去看海",
        description: "计划今年端午节，去东极岛感受海风和沙滩。",
        completed: false,
        targetDate: "2025-06-01",
        priority: "高"
    },
    {
        id: 2,
        title: "学做对方最喜欢的菜",
        description: "互相学习做对方最喜欢吃的菜，一起享用晚餐。",
        completed: false,
        targetDate: "2025-07-10",
        priority: "中"
    },
    {
        id: 3,
        title: "一起养一只宠物",
        description: "考虑领养再一只小狗，共同照顾它。",
        completed: false,
        targetDate: "2026-08-20",
        priority: "低"
    }
];

const anniversaryData = [
    {
        id: 1,
        title: "恋爱纪念日",
        date: "2025-03-30",
        description: "我们在一起的第一天",
        recurring: "yearly",
        icon: "❤️"
    },
    {
        id: 2,
        title: "第一次约会纪念",
        date: "2025-03-26",
        description: "我们第一次约会的日子",
        recurring: "yearly",
        icon: "🍽️"
    },
    {
        id: 3,
        title: "100天纪念日",
        date: "2025-07-08",
        description: "在一起100天啦",
        recurring: "once",
        icon: "🎉"
    }
];

// 初始化创意模块
function initCreativeModule() {
    // 初始化标签页
    const tabButtons = document.querySelectorAll('.creative-tab-button');
    const tabContents = document.querySelectorAll('.creative-tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有标签的active类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 为当前标签添加active类
            button.classList.add('active');
            
            // 显示对应的内容
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // 如果是倒计时标签，初始化倒计时
            if (tabId === 'countdown-tab') {
                initCountdown();
            }
        });
    });
    
    // 默认显示第一个标签
    tabButtons[0].click();
    
    // 初始化心愿清单
    initWishlist();
    
    // 初始化纪念日
    initAnniversaries();
    
    // 初始化每日一句
    initDailyQuote();
}

// 初始化心愿清单
function initWishlist() {
    // 自动标记过期心愿为完成
    autoMarkExpiredWishes();
    
    const wishlistContainer = document.getElementById('wishlist-container');
    
    // 清空容器
    wishlistContainer.innerHTML = '';
    
    // 分离活跃和已完成的心愿
    const activeWishes = wishlistData.filter(wish => !wish.completed);
    const completedWishes = wishlistData.filter(wish => wish.completed);
    
    // 按优先级和日期排序活跃心愿
    const sortedActiveWishes = [...activeWishes].sort((a, b) => {
        const priorityOrder = { '高': 0, '中': 1, '低': 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return new Date(a.targetDate) - new Date(b.targetDate);
    });
    
    // 创建活跃心愿清单
    const activeWishesContainer = document.createElement('div');
    activeWishesContainer.className = 'active-wishes-container';
    
    if (sortedActiveWishes.length > 0) {
        const activeWishesTitle = document.createElement('h3');
        activeWishesTitle.className = 'wishes-section-title';
        activeWishesTitle.innerHTML = '<i class="fas fa-star"></i> 待实现的心愿';
        activeWishesContainer.appendChild(activeWishesTitle);
        
        sortedActiveWishes.forEach(wish => {
            const wishElement = createWishElement(wish);
            activeWishesContainer.appendChild(wishElement);
        });
    } else {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-wishes';
        emptyMessage.innerHTML = `
            <div class="empty-wishes-content">
                <i class="fas fa-heart"></i>
                <h3>还没有心愿</h3>
                <p>添加一些美好的心愿吧！</p>
            </div>
        `;
        activeWishesContainer.appendChild(emptyMessage);
    }
    
    wishlistContainer.appendChild(activeWishesContainer);
    
    // 创建已完成心愿折叠区域
    if (completedWishes.length > 0) {
        const completedWishesContainer = document.createElement('div');
        completedWishesContainer.className = 'completed-wishes-container';
        
        // 创建折叠标题
        const completedWishesHeader = document.createElement('div');
        completedWishesHeader.className = 'completed-wishes-header';
        completedWishesHeader.innerHTML = `
            <div class="completed-wishes-toggle">
                <i class="fas fa-chevron-right toggle-icon"></i>
                <i class="fas fa-check-circle completed-icon"></i>
                <span class="completed-title">已经完成的心愿</span>
                <span class="completed-count">(${completedWishes.length})</span>
            </div>
        `;
        
        // 创建折叠内容
        const completedWishesContent = document.createElement('div');
        completedWishesContent.className = 'completed-wishes-content';
        completedWishesContent.style.display = 'none';
        
        // 按完成时间排序（最新完成的在前）
        const sortedCompletedWishes = [...completedWishes].sort((a, b) => {
            return new Date(b.completedDate || b.targetDate) - new Date(a.completedDate || a.targetDate);
        });
        
        sortedCompletedWishes.forEach(wish => {
            const wishElement = createWishElement(wish);
            wishElement.classList.add('completed-wish-item');
            completedWishesContent.appendChild(wishElement);
        });
        
        completedWishesContainer.appendChild(completedWishesHeader);
        completedWishesContainer.appendChild(completedWishesContent);
        
        // 添加折叠/展开事件
        completedWishesHeader.addEventListener('click', () => {
            toggleCompletedWishes(completedWishesHeader, completedWishesContent);
        });
        
        wishlistContainer.appendChild(completedWishesContainer);
    }
    
    // 添加"添加新心愿"按钮
    const addWishButton = document.createElement('div');
    addWishButton.className = 'add-wish-button';
    addWishButton.innerHTML = '<i class="fas fa-plus"></i> 添加新心愿';
    addWishButton.addEventListener('click', showAddWishForm);
    wishlistContainer.appendChild(addWishButton);
}

// 自动标记过期心愿为完成
function autoMarkExpiredWishes() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let markedCount = 0;
    
    wishlistData.forEach(wish => {
        if (!wish.completed) {
            const targetDate = new Date(wish.targetDate);
            targetDate.setHours(0, 0, 0, 0);
            
            // 如果目标日期已过，自动标记为完成
            if (targetDate < today) {
                wish.completed = true;
                wish.completedDate = wish.targetDate; // 记录完成日期
                wish.autoCompleted = true; // 标记为自动完成
                markedCount++;
            }
        }
    });
    
    // 如果有心愿被自动标记为完成，显示通知
    if (markedCount > 0) {
        setTimeout(() => {
            showNotification(`${markedCount} 个过期心愿已自动标记为完成`);
        }, 1000);
    }
}

// 折叠/展开已完成心愿
function toggleCompletedWishes(header, content) {
    const toggleIcon = header.querySelector('.toggle-icon');
    const isExpanded = content.style.display !== 'none';
    
    if (isExpanded) {
        // 折叠
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';
        
        setTimeout(() => {
            content.style.display = 'none';
            toggleIcon.style.transform = 'rotate(0deg)';
            header.classList.remove('expanded');
        }, 200);
    } else {
        // 展开
        content.style.display = 'block';
        content.style.opacity = '0';
        content.style.transform = 'translateY(-10px)';
        
        requestAnimationFrame(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
            toggleIcon.style.transform = 'rotate(90deg)';
            header.classList.add('expanded');
        });
    }
}

// 创建单个心愿元素
function createWishElement(wish) {
    const wishElement = document.createElement('div');
    wishElement.className = `wish-item ${wish.completed ? 'completed' : ''}`;
    wishElement.dataset.id = wish.id;
    
    const targetDate = new Date(wish.targetDate);
    const formattedDate = `${targetDate.getFullYear()}年${targetDate.getMonth() + 1}月${targetDate.getDate()}日`;
    
    const daysLeft = Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24));
    let daysLeftText = '';
    let daysLeftClass = '';
    
    if (wish.completed) {
        if (wish.autoCompleted) {
            daysLeftText = '已过期自动完成';
            daysLeftClass = 'auto-completed';
        } else {
            daysLeftText = '已完成';
            daysLeftClass = 'manually-completed';
        }
    } else {
        if (daysLeft > 0) {
            daysLeftText = `还有 ${daysLeft} 天`;
            daysLeftClass = daysLeft <= 7 ? 'urgent' : 'normal';
        } else if (daysLeft === 0) {
            daysLeftText = '就是今天！';
            daysLeftClass = 'today';
        } else {
            daysLeftText = `已过期 ${Math.abs(daysLeft)} 天`;
            daysLeftClass = 'overdue';
        }
    }
    
    const priorityClass = `priority-${wish.priority === '高' ? 'high' : wish.priority === '中' ? 'medium' : 'low'}`;
    
    // 为自动完成的心愿添加特殊图标
    const autoCompletedIcon = wish.autoCompleted ? '<i class="fas fa-clock auto-completed-icon" title="自动完成"></i>' : '';
    
    wishElement.innerHTML = `
        <div class="wish-header">
            <div class="wish-checkbox-container">
                <input type="checkbox" class="wish-checkbox" ${wish.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </div>
            <h3 class="wish-title">${wish.title} ${autoCompletedIcon}</h3>
            <div class="wish-priority ${priorityClass}">${wish.priority}优先级</div>
        </div>
        <div class="wish-body">
            <p class="wish-description">${wish.description}</p>
            <div class="wish-meta">
                <span class="wish-date">目标日期: ${formattedDate}</span>
                <span class="wish-days-left ${daysLeftClass}">${daysLeftText}</span>
            </div>
        </div>
        <div class="wish-actions">
            <button class="edit-wish" data-id="${wish.id}">
                <i class="fas fa-edit"></i> 编辑
            </button>
            <button class="delete-wish" data-id="${wish.id}">
                <i class="fas fa-trash"></i> 删除
            </button>
        </div>
    `;
    
    // 添加复选框事件
    wishElement.querySelector('.wish-checkbox').addEventListener('change', (e) => {
        toggleWishCompleted(wish.id, e.target.checked);
    });
    
    // 添加编辑心愿事件
    wishElement.querySelector('.edit-wish').addEventListener('click', () => {
        showEditWishForm(wish);
    });
    
    // 添加删除心愿事件
    wishElement.querySelector('.delete-wish').addEventListener('click', () => {
        if (confirm('确定要删除这个心愿吗？')) {
            deleteWish(wish.id);
        }
    });
    
    return wishElement;
}

// 显示添加心愿表单
function showAddWishForm() {
    const formContainer = document.getElementById('creative-form-container');
    
    formContainer.innerHTML = `
        <div class="wish-form">
            <h3>添加新心愿</h3>
            <form id="add-wish-form">
                <div class="form-group">
                    <label for="wish-title">标题</label>
                    <input type="text" id="wish-title" placeholder="心愿标题" required>
                </div>
                <div class="form-group">
                    <label for="wish-description">描述</label>
                    <textarea id="wish-description" placeholder="心愿描述" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="wish-target-date">目标日期</label>
                    <input type="date" id="wish-target-date" required>
                </div>
                <div class="form-group">
                    <label for="wish-priority">优先级</label>
                    <select id="wish-priority">
                        <option value="高">高</option>
                        <option value="中" selected>中</option>
                        <option value="低">低</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                </div>
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('add-wish-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewWish();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 显示编辑心愿表单
function showEditWishForm(wish) {
    const formContainer = document.getElementById('creative-form-container');
    
    formContainer.innerHTML = `
        <div class="wish-form">
            <h3>编辑心愿</h3>
            <form id="edit-wish-form">
                <div class="form-group">
                    <label for="wish-title">标题</label>
                    <input type="text" id="wish-title" value="${wish.title}" placeholder="心愿标题" required>
                </div>
                <div class="form-group">
                    <label for="wish-description">描述</label>
                    <textarea id="wish-description" placeholder="心愿描述" rows="3">${wish.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="wish-target-date">目标日期</label>
                    <input type="date" id="wish-target-date" value="${wish.targetDate}" required>
                </div>
                <div class="form-group">
                    <label for="wish-priority">优先级</label>
                    <select id="wish-priority">
                        <option value="高" ${wish.priority === '高' ? 'selected' : ''}>高</option>
                        <option value="中" ${wish.priority === '中' ? 'selected' : ''}>中</option>
                        <option value="低" ${wish.priority === '低' ? 'selected' : ''}>低</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="wish-completed">状态</label>
                    <div class="checkbox-container">
                        <input type="checkbox" id="wish-completed" ${wish.completed ? 'checked' : ''}>
                        <label for="wish-completed">已完成</label>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                    <button type="button" class="btn-delete">删除心愿</button>
                </div>
                <input type="hidden" id="wish-id" value="${wish.id}">
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('edit-wish-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateWish();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
    
    // 添加删除按钮事件
    formContainer.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('确定要删除这个心愿吗？')) {
            deleteWish(wish.id);
            formContainer.style.display = 'none';
        }
    });
}

// 添加新心愿
function addNewWish() {
    const title = document.getElementById('wish-title').value;
    const description = document.getElementById('wish-description').value;
    const targetDate = document.getElementById('wish-target-date').value;
    const priority = document.getElementById('wish-priority').value;
    
    // 生成新的心愿ID
    const newId = Math.max(...wishlistData.map(w => w.id), 0) + 1;
    
    const newWish = {
        id: newId,
        title,
        description,
        targetDate,
        priority,
        completed: false
    };
    
    // 添加新心愿
    wishlistData.push(newWish);
    
    // 重新初始化心愿清单
    initWishlist();
    
    // 隐藏表单
    document.getElementById('creative-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('心愿添加成功！');
}

// 更新心愿
function updateWish() {
    const id = parseInt(document.getElementById('wish-id').value);
    const title = document.getElementById('wish-title').value;
    const description = document.getElementById('wish-description').value;
    const targetDate = document.getElementById('wish-target-date').value;
    const priority = document.getElementById('wish-priority').value;
    const completed = document.getElementById('wish-completed').checked;
    
    // 查找心愿索引
    const wishIndex = wishlistData.findIndex(w => w.id === id);
    if (wishIndex === -1) return;
    
    // 更新心愿
    wishlistData[wishIndex] = {
        id,
        title,
        description,
        targetDate,
        priority,
        completed
    };
    
    // 重新初始化心愿清单
    initWishlist();
    
    // 隐藏表单
    document.getElementById('creative-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('心愿更新成功！');
}

// 删除心愿
function deleteWish(id) {
    // 查找心愿索引
    const wishIndex = wishlistData.findIndex(w => w.id === id);
    if (wishIndex === -1) return;
    
    // 删除心愿
    wishlistData.splice(wishIndex, 1);
    
    // 重新初始化心愿清单
    initWishlist();
    
    // 显示成功消息
    showNotification('心愿已删除！');
}

// 切换心愿完成状态
function toggleWishCompleted(id, completed) {
    // 查找心愿索引
    const wishIndex = wishlistData.findIndex(w => w.id === id);
    if (wishIndex === -1) return;
    
    // 更新完成状态
    wishlistData[wishIndex].completed = completed;
    
    if (completed) {
        // 如果是手动标记为完成，记录完成日期
        wishlistData[wishIndex].completedDate = new Date().toISOString().split('T')[0];
        wishlistData[wishIndex].autoCompleted = false; // 标记为手动完成
    } else {
        // 如果取消完成，清除完成相关标记
        delete wishlistData[wishIndex].completedDate;
        delete wishlistData[wishIndex].autoCompleted;
    }
    
    // 重新初始化心愿清单（这样会重新分组）
    initWishlist();
    
    // 显示成功消息
    showNotification(completed ? '心愿已标记为完成！' : '心愿已标记为未完成！');
}

// 初始化纪念日
function initAnniversaries() {
    const anniversaryContainer = document.getElementById('anniversary-container');
    
    // 清空容器
    anniversaryContainer.innerHTML = '';
    
    // 按日期排序（从近到远）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const sortedAnniversaries = [...anniversaryData].sort((a, b) => {
        const dateA = getNextOccurrence(new Date(a.date), a.recurring);
        const dateB = getNextOccurrence(new Date(b.date), b.recurring);
        return dateA - dateB;
    });
    
    // 创建纪念日列表
    sortedAnniversaries.forEach(anniversary => {
        const anniversaryElement = createAnniversaryElement(anniversary);
        anniversaryContainer.appendChild(anniversaryElement);
    });
    
    // 添加"添加新纪念日"按钮
    const addAnniversaryButton = document.createElement('div');
    addAnniversaryButton.className = 'add-anniversary-button';
    addAnniversaryButton.innerHTML = '<i class="fas fa-plus"></i> 添加新纪念日';
    addAnniversaryButton.addEventListener('click', showAddAnniversaryForm);
    anniversaryContainer.appendChild(addAnniversaryButton);
}

// 创建单个纪念日元素
function createAnniversaryElement(anniversary) {
    const anniversaryElement = document.createElement('div');
    anniversaryElement.className = 'anniversary-item';
    anniversaryElement.dataset.id = anniversary.id;
    
    const originalDate = new Date(anniversary.date);
    const formattedOriginalDate = `${originalDate.getFullYear()}年${originalDate.getMonth() + 1}月${originalDate.getDate()}日`;
    
    const nextDate = getNextOccurrence(originalDate, anniversary.recurring);
    const formattedNextDate = `${nextDate.getFullYear()}年${nextDate.getMonth() + 1}月${nextDate.getDate()}日`;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
    let daysLeftText = '';
    
    if (daysLeft > 0) {
        daysLeftText = `还有 ${daysLeft} 天`;
    } else if (daysLeft === 0) {
        daysLeftText = '就是今天！';
    } else {
        daysLeftText = `已过期 ${Math.abs(daysLeft)} 天`;
    }
    
    let recurringText = '';
    switch (anniversary.recurring) {
        case 'yearly':
            recurringText = '每年';
            break;
        case 'monthly':
            recurringText = '每月';
            break;
        case 'once':
            recurringText = '一次性';
            break;
    }
    
    anniversaryElement.innerHTML = `
        <div class="anniversary-icon">${anniversary.icon}</div>
        <div class="anniversary-content">
            <h3 class="anniversary-title">${anniversary.title}</h3>
            <p class="anniversary-description">${anniversary.description}</p>
            <div class="anniversary-meta">
                <span class="anniversary-original-date">原始日期: ${formattedOriginalDate}</span>
                <span class="anniversary-recurring">${recurringText}</span>
            </div>
            <div class="anniversary-countdown">
                <span class="anniversary-next-date">下次: ${formattedNextDate}</span>
                <span class="anniversary-days-left">${daysLeftText}</span>
            </div>
        </div>
        <div class="anniversary-actions">
            <button class="edit-anniversary" data-id="${anniversary.id}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-anniversary" data-id="${anniversary.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    // 添加编辑纪念日事件
    anniversaryElement.querySelector('.edit-anniversary').addEventListener('click', () => {
        showEditAnniversaryForm(anniversary);
    });
    
    // 添加删除纪念日事件
    anniversaryElement.querySelector('.delete-anniversary').addEventListener('click', () => {
        if (confirm('确定要删除这个纪念日吗？')) {
            deleteAnniversary(anniversary.id);
        }
    });
    
    return anniversaryElement;
}

// 获取下一次发生的日期
function getNextOccurrence(originalDate, recurring) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextDate = new Date(originalDate);
    
    switch (recurring) {
        case 'yearly':
            // 设置为今年的对应日期
            nextDate.setFullYear(today.getFullYear());
            
            // 如果今年的日期已经过了，则设置为明年
            if (nextDate < today) {
                nextDate.setFullYear(today.getFullYear() + 1);
            }
            break;
            
        case 'monthly':
            // 设置为本月的对应日期
            nextDate.setFullYear(today.getFullYear());
            nextDate.setMonth(today.getMonth());
            
            // 如果本月的日期已经过了，则设置为下个月
            if (nextDate < today) {
                nextDate.setMonth(today.getMonth() + 1);
            }
            break;
            
        case 'once':
            // 一次性事件，直接使用原始日期
            break;
    }
    
    return nextDate;
}

// 显示添加纪念日表单
function showAddAnniversaryForm() {
    const formContainer = document.getElementById('creative-form-container');
    
    formContainer.innerHTML = `
        <div class="anniversary-form">
            <h3>添加新纪念日</h3>
            <form id="add-anniversary-form">
                <div class="form-group">
                    <label for="anniversary-title">标题</label>
                    <input type="text" id="anniversary-title" placeholder="纪念日标题" required>
                </div>
                <div class="form-group">
                    <label for="anniversary-description">描述</label>
                    <textarea id="anniversary-description" placeholder="纪念日描述" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="anniversary-date">日期</label>
                    <input type="date" id="anniversary-date" required>
                </div>
                <div class="form-group">
                    <label for="anniversary-recurring">重复</label>
                    <select id="anniversary-recurring">
                        <option value="yearly">每年</option>
                        <option value="monthly">每月</option>
                        <option value="once">一次性</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="anniversary-icon">图标</label>
                    <select id="anniversary-icon">
                        <option value="❤️">❤️ 爱心</option>
                        <option value="🎂">🎂 蛋糕</option>
                        <option value="🎁">🎁 礼物</option>
                        <option value="🎉">🎉 庆祝</option>
                        <option value="🍽️">🍽️ 餐厅</option>
                        <option value="✈️">✈️ 旅行</option>
                        <option value="📷">📷 照片</option>
                        <option value="🏠">🏠 家</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                </div>
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('add-anniversary-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewAnniversary();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 显示编辑纪念日表单
function showEditAnniversaryForm(anniversary) {
    const formContainer = document.getElementById('creative-form-container');
    
    formContainer.innerHTML = `
        <div class="anniversary-form">
            <h3>编辑纪念日</h3>
            <form id="edit-anniversary-form">
                <div class="form-group">
                    <label for="anniversary-title">标题</label>
                    <input type="text" id="anniversary-title" value="${anniversary.title}" placeholder="纪念日标题" required>
                </div>
                <div class="form-group">
                    <label for="anniversary-description">描述</label>
                    <textarea id="anniversary-description" placeholder="纪念日描述" rows="3">${anniversary.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="anniversary-date">日期</label>
                    <input type="date" id="anniversary-date" value="${anniversary.date}" required>
                </div>
                <div class="form-group">
                    <label for="anniversary-recurring">重复</label>
                    <select id="anniversary-recurring">
                        <option value="yearly" ${anniversary.recurring === 'yearly' ? 'selected' : ''}>每年</option>
                        <option value="monthly" ${anniversary.recurring === 'monthly' ? 'selected' : ''}>每月</option>
                        <option value="once" ${anniversary.recurring === 'once' ? 'selected' : ''}>一次性</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="anniversary-icon">图标</label>
                    <select id="anniversary-icon">
                        <option value="❤️" ${anniversary.icon === '❤️' ? 'selected' : ''}>❤️ 爱心</option>
                        <option value="🎂" ${anniversary.icon === '🎂' ? 'selected' : ''}>🎂 蛋糕</option>
                        <option value="🎁" ${anniversary.icon === '🎁' ? 'selected' : ''}>🎁 礼物</option>
                        <option value="🎉" ${anniversary.icon === '🎉' ? 'selected' : ''}>🎉 庆祝</option>
                        <option value="🍽️" ${anniversary.icon === '🍽️' ? 'selected' : ''}>🍽️ 餐厅</option>
                        <option value="✈️" ${anniversary.icon === '✈️' ? 'selected' : ''}>✈️ 旅行</option>
                        <option value="📷" ${anniversary.icon === '📷' ? 'selected' : ''}>📷 照片</option>
                        <option value="🏠" ${anniversary.icon === '🏠' ? 'selected' : ''}>🏠 家</option>
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                    <button type="button" class="btn-delete">删除纪念日</button>
                </div>
                <input type="hidden" id="anniversary-id" value="${anniversary.id}">
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('edit-anniversary-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateAnniversary();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
    
    // 添加删除按钮事件
    formContainer.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('确定要删除这个纪念日吗？')) {
            deleteAnniversary(anniversary.id);
            formContainer.style.display = 'none';
        }
    });
}

// 添加新纪念日
function addNewAnniversary() {
    const title = document.getElementById('anniversary-title').value;
    const description = document.getElementById('anniversary-description').value;
    const date = document.getElementById('anniversary-date').value;
    const recurring = document.getElementById('anniversary-recurring').value;
    const icon = document.getElementById('anniversary-icon').value;
    
    // 生成新的纪念日ID
    const newId = Math.max(...anniversaryData.map(a => a.id), 0) + 1;
    
    const newAnniversary = {
        id: newId,
        title,
        description,
        date,
        recurring,
        icon
    };
    
    // 添加新纪念日
    anniversaryData.push(newAnniversary);
    
    // 重新初始化纪念日
    initAnniversaries();
    
    // 隐藏表单
    document.getElementById('creative-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('纪念日添加成功！');
}

// 更新纪念日
function updateAnniversary() {
    const id = parseInt(document.getElementById('anniversary-id').value);
    const title = document.getElementById('anniversary-title').value;
    const description = document.getElementById('anniversary-description').value;
    const date = document.getElementById('anniversary-date').value;
    const recurring = document.getElementById('anniversary-recurring').value;
    const icon = document.getElementById('anniversary-icon').value;
    
    // 查找纪念日索引
    const anniversaryIndex = anniversaryData.findIndex(a => a.id === id);
    if (anniversaryIndex === -1) return;
    
    // 更新纪念日
    anniversaryData[anniversaryIndex] = {
        id,
        title,
        description,
        date,
        recurring,
        icon
    };
    
    // 重新初始化纪念日
    initAnniversaries();
    
    // 隐藏表单
    document.getElementById('creative-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('纪念日更新成功！');
}

// 删除纪念日
function deleteAnniversary(id) {
    // 查找纪念日索引
    const anniversaryIndex = anniversaryData.findIndex(a => a.id === id);
    if (anniversaryIndex === -1) return;
    
    // 删除纪念日
    anniversaryData.splice(anniversaryIndex, 1);
    
    // 重新初始化纪念日
    initAnniversaries();
    
    // 显示成功消息
    showNotification('纪念日已删除！');
}

// 初始化倒计时
function initCountdown() {
    // 找到最近的纪念日
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let closestAnniversary = null;
    let minDaysLeft = Infinity;
    
    anniversaryData.forEach(anniversary => {
        const nextDate = getNextOccurrence(new Date(anniversary.date), anniversary.recurring);
        const daysLeft = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        
        if (daysLeft >= 0 && daysLeft < minDaysLeft) {
            minDaysLeft = daysLeft;
            closestAnniversary = {
                ...anniversary,
                nextDate,
                daysLeft
            };
        }
    });
    
    const countdownContainer = document.getElementById('countdown-container');
    
    if (!closestAnniversary) {
        countdownContainer.innerHTML = `
            <div class="no-countdown">
                <p>没有即将到来的纪念日</p>
                <p>去添加一些纪念日吧！</p>
            </div>
        `;
        return;
    }
    
    const formattedDate = `${closestAnniversary.nextDate.getFullYear()}年${closestAnniversary.nextDate.getMonth() + 1}月${closestAnniversary.nextDate.getDate()}日`;
    
    countdownContainer.innerHTML = `
        <div class="main-countdown">
            <div class="countdown-header">
                <div class="countdown-icon">${closestAnniversary.icon}</div>
                <h3 class="countdown-title">${closestAnniversary.title}</h3>
            </div>
            <div class="countdown-description">${closestAnniversary.description}</div>
            <div class="countdown-date">${formattedDate}</div>
            <div class="countdown-timer">
                <div class="countdown-days">
                    <div class="countdown-value">${closestAnniversary.daysLeft}</div>
                    <div class="countdown-label">天</div>
                </div>
                <div class="countdown-hours">
                    <div class="countdown-value" id="countdown-hours">00</div>
                    <div class="countdown-label">时</div>
                </div>
                <div class="countdown-minutes">
                    <div class="countdown-value" id="countdown-minutes">00</div>
                    <div class="countdown-label">分</div>
                </div>
                <div class="countdown-seconds">
                    <div class="countdown-value" id="countdown-seconds">00</div>
                    <div class="countdown-label">秒</div>
                </div>
            </div>
        </div>
    `;
    
    // 启动实时倒计时
    startRealTimeCountdown(closestAnniversary.nextDate);
}

// 启动实时倒计时
function startRealTimeCountdown(targetDate) {
    // 清除之前的倒计时
    if (window.countdownInterval) {
        clearInterval(window.countdownInterval);
    }
    
    // 更新倒计时函数
    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;
        
        if (diff <= 0) {
            // 倒计时结束
            document.getElementById('countdown-hours').textContent = '00';
            document.getElementById('countdown-minutes').textContent = '00';
            document.getElementById('countdown-seconds').textContent = '00';
            clearInterval(window.countdownInterval);
            return;
        }
        
        // 计算剩余时间
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // 更新显示
        document.getElementById('countdown-hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('countdown-minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('countdown-seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // 立即更新一次
    updateCountdown();
    
    // 每秒更新一次
    window.countdownInterval = setInterval(updateCountdown, 1000);
}

// 初始化每日一句
function initDailyQuote() {
    const quotes = [
        {
            text: "你让整座城市都断电，颠倒了每个白天黑夜",
            author: "黄礼格"
        },
        {
            text: "爱情是灵魂的共鸣，心灵的对话。",
            author: "柏拉图"
        },
        {
            text: "真正的爱情不是一时的热烈，而是细水长流的陪伴。",
            author: "莎士比亚"
        },
        {
            text: "你若安好，便是晴天。",
            author: "林徽因"
        },
        {
            text: "我们在爱情中寻找的不是完美，而是真实。",
            author: "奥斯卡·王尔德"
        },
        {
            text: "爱情不是寻找一个完美的人，而是学会用完美的眼光，欣赏一个不完美的人。",
            author: "山姆·基恩"
        },
        {
            text: "最好的爱情是细水长流，是柴米油盐的日常。",
            author: "张爱玲"
        },
        {
            text: "爱情是一种承诺，需要两个人共同努力去维护。",
            author: "约翰·列侬"
        }
    ];
    
    // 获取今天的日期
    const today = new Date();
    const todayString = today.toDateString();
    
    // 检查是否是特定日期，如果是则显示黄礼格的句子
    const specialDate = new Date('2025-01-15').toDateString(); // 今天的日期
    let todayQuote;
    
    if (todayString === specialDate) {
        // 今天显示黄礼格的句子
        todayQuote = quotes[0];
    } else {
        // 其他日期按原逻辑选择
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const quoteIndex = (dayOfYear % (quotes.length - 1)) + 1; // 跳过第一个特殊句子
        todayQuote = quotes[quoteIndex];
    }
    
    const quoteContainer = document.getElementById('quote-container');
    
    quoteContainer.innerHTML = `
        <div class="daily-quote">
            <div class="quote-text">"${todayQuote.text}"</div>
            <div class="quote-author">—— ${todayQuote.author}</div>
        </div>
    `;
}

// 显示通知
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 2秒后自动消失
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 2000);
}

// 页面加载完成后初始化创意模块
document.addEventListener('DOMContentLoaded', initCreativeModule);
