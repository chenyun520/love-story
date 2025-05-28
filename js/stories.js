// 故事数据
const storyData = [
    {
        id: 1,
        title: "我们的相遇",
        content: "还记得那天，我们在朋友的宝山第一次见面。笑容特别灿烂。我们在上海大学校园里面聊了很多共同感兴趣的话题，仿佛认识了很久一样。那天晚上开车回家的路上，我的心情格外愉快，似乎预感到了什么美好的事情即将发生。",
        date: "2025-03-15",
        author: "陈云",
        tags: ["初遇", "回忆"]
    },
    {
        id: 2,
        title: "第一次约会",
        content: "我们的第一次约会是是因为你心情不好，为情所困，我奉命前去开导你；见到你的那一刻我觉得整个世界都亮了起来。我们聊了很多，在一扫光零食店买了52块钱的零食 你说刚好就520真的巧啊；我们去KTV唱歌，从喜欢的音乐到理想的生活，时间过得特别快。分别的时候，我们都有些不舍，约定了下次见面的时间，这是我们真正意义上第一次约会 分开的时候我们亲亲了",
        date: "2025-03-26",
        author: "陈云",
        tags: ["约会", ]
    },
    {
        id: 3,
        title: "在一起的那一天",
        content: "2025年3月30日，是我们正式确定关系的日子。更是我们见家长的日子，是不是有点神奇呢，感谢你爸妈对我的初步肯定，在此之前我们去了西湖公园，柳树正好盛开。在湖边花海中。这一天，成为了我们爱情故事的正式开始，by zhe way 奔富的红酒是真的好喝",
        date: "2025-03-30",
        author: "陈云",
        tags: ["见家长", "在一起", "纪念日"]
    },
    {
        title: "大头来上海过六一儿童节",
        content: "大头造访上海",
        date: "2025-05-30",
        author: "陈云",
        tags: ["上海", "六一", "相聚"]
    }
];

// 初始化故事列表
function initStories() {
    const storyContainer = document.getElementById('story-container');
    const storyList = document.getElementById('story-list');
    const storyContent = document.getElementById('story-content');
    
    // 清空容器
    storyList.innerHTML = '';
    storyContent.innerHTML = '';
    
    // 按日期排序故事（从新到旧）
    const sortedStories = [...storyData].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 创建故事列表
    sortedStories.forEach((story, index) => {
        const storyItem = document.createElement('div');
        storyItem.className = `story-item ${index === 0 ? 'active' : ''}`;
        storyItem.dataset.id = story.id;
        
        const storyDate = new Date(story.date);
        const formattedDate = `${storyDate.getFullYear()}年${storyDate.getMonth() + 1}月${storyDate.getDate()}日`;
        
        storyItem.innerHTML = `
            <div class="story-item-title">${story.title}</div>
            <div class="story-item-date">${formattedDate}</div>
        `;
        
        storyItem.addEventListener('click', () => {
            // 移除所有故事项的active类
            document.querySelectorAll('.story-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 为当前故事项添加active类
            storyItem.classList.add('active');
            
            // 显示故事内容
            showStoryContent(story);
        });
        
        storyList.appendChild(storyItem);
    });
    
    // 添加"写新故事"按钮
    const addStoryButton = document.createElement('div');
    addStoryButton.className = 'add-story-button';
    addStoryButton.innerHTML = '<i class="fas fa-plus"></i> 写新故事';
    addStoryButton.addEventListener('click', showAddStoryForm);
    storyList.appendChild(addStoryButton);
    
    // 默认显示第一个故事的内容
    if (sortedStories.length > 0) {
        showStoryContent(sortedStories[0]);
    } else {
        // 如果没有故事，显示欢迎信息
        storyContent.innerHTML = `
            <div class="empty-story">
                <h3>还没有故事哦</h3>
                <p>点击"写新故事"按钮开始记录你们的点点滴滴吧！</p>
            </div>
        `;
    }
}

// 显示故事内容
function showStoryContent(story) {
    const storyContent = document.getElementById('story-content');
    
    const storyDate = new Date(story.date);
    const formattedDate = `${storyDate.getFullYear()}年${storyDate.getMonth() + 1}月${storyDate.getDate()}日`;
    
    storyContent.innerHTML = `
        <div class="story-header">
            <h2 class="story-title">${story.title}</h2>
            <div class="story-meta">
                <span class="story-date">${formattedDate}</span>
                <span class="story-author">作者: ${story.author}</span>
            </div>
            <div class="story-tags">
                ${story.tags.map(tag => `<span class="story-tag">${tag}</span>`).join('')}
            </div>
        </div>
        <div class="story-body">
            ${formatStoryContent(story.content)}
        </div>
        <div class="story-actions">
            <button class="edit-story" data-id="${story.id}">
                <i class="fas fa-edit"></i> 编辑
            </button>
            <button class="delete-story" data-id="${story.id}">
                <i class="fas fa-trash"></i> 删除
            </button>
        </div>
    `;
    
    // 添加编辑故事事件
    storyContent.querySelector('.edit-story').addEventListener('click', () => {
        showEditStoryForm(story);
    });
    
    // 添加删除故事事件
    storyContent.querySelector('.delete-story').addEventListener('click', () => {
        if (confirm('确定要删除这个故事吗？')) {
            deleteStory(story.id);
        }
    });
}

// 格式化故事内容（将换行符转换为段落）
function formatStoryContent(content) {
    return content.split('\n\n').map(paragraph => 
        `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
    ).join('');
}

// 显示添加故事表单
function showAddStoryForm() {
    const formContainer = document.getElementById('story-form-container');
    
    formContainer.innerHTML = `
        <div class="story-form">
            <h3>写新故事</h3>
            <form id="add-story-form">
                <div class="form-group">
                    <label for="story-title">标题</label>
                    <input type="text" id="story-title" placeholder="故事标题" required>
                </div>
                <div class="form-group">
                    <label for="story-date">日期</label>
                    <input type="date" id="story-date" required>
                </div>
                <div class="form-group">
                    <label for="story-author">作者</label>
                    <input type="text" id="story-author" placeholder="作者" value="我" required>
                </div>
                <div class="form-group">
                    <label for="story-tags">标签</label>
                    <input type="text" id="story-tags" placeholder="用逗号分隔多个标签，如：约会,回忆">
                </div>
                <div class="form-group">
                    <label for="story-content">内容</label>
                    <textarea id="story-content" placeholder="在这里写下你的故事..." rows="10" required></textarea>
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
    document.getElementById('add-story-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewStory();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 显示编辑故事表单
function showEditStoryForm(story) {
    const formContainer = document.getElementById('story-form-container');
    
    formContainer.innerHTML = `
        <div class="story-form">
            <h3>编辑故事</h3>
            <form id="edit-story-form">
                <div class="form-group">
                    <label for="story-title">标题</label>
                    <input type="text" id="story-title" value="${story.title}" placeholder="故事标题" required>
                </div>
                <div class="form-group">
                    <label for="story-date">日期</label>
                    <input type="date" id="story-date" value="${story.date}" required>
                </div>
                <div class="form-group">
                    <label for="story-author">作者</label>
                    <input type="text" id="story-author" value="${story.author}" placeholder="作者" required>
                </div>
                <div class="form-group">
                    <label for="story-tags">标签</label>
                    <input type="text" id="story-tags" value="${story.tags.join(',')}" placeholder="用逗号分隔多个标签，如：约会,回忆">
                </div>
                <div class="form-group">
                    <label for="story-content">内容</label>
                    <textarea id="story-content" placeholder="在这里写下你的故事..." rows="10" required>${story.content}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                    <button type="button" class="btn-delete">删除故事</button>
                </div>
                <input type="hidden" id="story-id" value="${story.id}">
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('edit-story-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateStory();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
    
    // 添加删除按钮事件
    formContainer.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('确定要删除这个故事吗？')) {
            deleteStory(story.id);
            formContainer.style.display = 'none';
        }
    });
}

// 添加新故事
function addNewStory() {
    const title = document.getElementById('story-title').value;
    const date = document.getElementById('story-date').value;
    const author = document.getElementById('story-author').value;
    const tagsInput = document.getElementById('story-tags').value;
    const content = document.getElementById('story-content').value;
    
    // 处理标签
    const tags = tagsInput.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    
    // 生成新的故事ID
    const newId = Math.max(...storyData.map(s => s.id), 0) + 1;
    
    const newStory = {
        id: newId,
        title,
        date,
        author,
        tags,
        content
    };
    
    // 添加新故事
    storyData.push(newStory);
    
    // 重新初始化故事列表
    initStories();
    
    // 隐藏表单
    document.getElementById('story-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('故事添加成功！');
    
    // 选中并显示新添加的故事
    setTimeout(() => {
        const storyItem = document.querySelector(`.story-item[data-id="${newId}"]`);
        if (storyItem) {
            storyItem.click();
        }
    }, 100);
}

// 更新故事
function updateStory() {
    const id = parseInt(document.getElementById('story-id').value);
    const title = document.getElementById('story-title').value;
    const date = document.getElementById('story-date').value;
    const author = document.getElementById('story-author').value;
    const tagsInput = document.getElementById('story-tags').value;
    const content = document.getElementById('story-content').value;
    
    // 处理标签
    const tags = tagsInput.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);
    
    // 查找故事索引
    const storyIndex = storyData.findIndex(s => s.id === id);
    if (storyIndex === -1) return;
    
    // 更新故事
    storyData[storyIndex] = {
        id,
        title,
        date,
        author,
        tags,
        content
    };
    
    // 重新初始化故事列表
    initStories();
    
    // 隐藏表单
    document.getElementById('story-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('故事更新成功！');
    
    // 选中并显示更新的故事
    setTimeout(() => {
        const storyItem = document.querySelector(`.story-item[data-id="${id}"]`);
        if (storyItem) {
            storyItem.click();
        }
    }, 100);
}

// 删除故事
function deleteStory(id) {
    // 查找故事索引
    const storyIndex = storyData.findIndex(s => s.id === id);
    if (storyIndex === -1) return;
    
    // 删除故事
    storyData.splice(storyIndex, 1);
    
    // 重新初始化故事列表
    initStories();
    
    // 显示成功消息
    showNotification('故事已删除！');
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

// 搜索故事
function searchStories(query) {
    if (!query || query.trim() === '') {
        initStories();
        return;
    }
    
    query = query.toLowerCase();
    
    // 过滤符合搜索条件的故事
    const filteredStories = storyData.filter(story => 
        story.title.toLowerCase().includes(query) ||
        story.content.toLowerCase().includes(query) ||
        story.tags.some(tag => tag.toLowerCase().includes(query))
    );
    
    const storyList = document.getElementById('story-list');
    const storyContent = document.getElementById('story-content');
    
    // 清空容器
    storyList.innerHTML = '';
    
    if (filteredStories.length === 0) {
        // 如果没有找到匹配的故事
        storyList.innerHTML = `
            <div class="no-results">
                <p>没有找到匹配的故事</p>
                <button id="clear-search">清除搜索</button>
            </div>
        `;
        
        storyContent.innerHTML = `
            <div class="empty-story">
                <h3>没有找到匹配的故事</h3>
                <p>尝试使用不同的搜索词，或清除搜索以查看所有故事。</p>
            </div>
        `;
        
        document.getElementById('clear-search').addEventListener('click', () => {
            document.getElementById('story-search').value = '';
            initStories();
        });
        
        return;
    }
    
    // 按日期排序故事（从新到旧）
    const sortedStories = [...filteredStories].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 创建故事列表
    sortedStories.forEach((story, index) => {
        const storyItem = document.createElement('div');
        storyItem.className = `story-item ${index === 0 ? 'active' : ''}`;
        storyItem.dataset.id = story.id;
        
        const storyDate = new Date(story.date);
        const formattedDate = `${storyDate.getFullYear()}年${storyDate.getMonth() + 1}月${storyDate.getDate()}日`;
        
        storyItem.innerHTML = `
            <div class="story-item-title">${story.title}</div>
            <div class="story-item-date">${formattedDate}</div>
        `;
        
        storyItem.addEventListener('click', () => {
            // 移除所有故事项的active类
            document.querySelectorAll('.story-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // 为当前故事项添加active类
            storyItem.classList.add('active');
            
            // 显示故事内容
            showStoryContent(story);
        });
        
        storyList.appendChild(storyItem);
    });
    
    // 添加"清除搜索"按钮
    const clearSearchButton = document.createElement('div');
    clearSearchButton.className = 'clear-search-button';
    clearSearchButton.innerHTML = '清除搜索';
    clearSearchButton.addEventListener('click', () => {
        document.getElementById('story-search').value = '';
        initStories();
    });
    storyList.appendChild(clearSearchButton);
    
    // 添加"写新故事"按钮
    const addStoryButton = document.createElement('div');
    addStoryButton.className = 'add-story-button';
    addStoryButton.innerHTML = '<i class="fas fa-plus"></i> 写新故事';
    addStoryButton.addEventListener('click', showAddStoryForm);
    storyList.appendChild(addStoryButton);
    
    // 默认显示第一个故事的内容
    if (sortedStories.length > 0) {
        showStoryContent(sortedStories[0]);
    }
}

// 初始化搜索功能
function initStorySearch() {
    const searchInput = document.getElementById('story-search');
    
    searchInput.addEventListener('input', debounce(() => {
        searchStories(searchInput.value);
    }, 300));
}

// 防抖函数
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// 页面加载完成后初始化故事列表和搜索功能
document.addEventListener('DOMContentLoaded', () => {
    initStories();
    initStorySearch();
});
