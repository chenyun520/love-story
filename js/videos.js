// 视频数据
const videoData = {
    "甜蜜时刻": [
        {
            id: 1,
            src: "videos/WeChat_20250520142055.mp4",
            title: "甜蜜时刻视频1",
            date: "2025-04-15",
            description: "记录我们一起的甜蜜时光，每一刻都值得珍藏。",
            thumbnail: "images/微信图片_20250520142119.jpg" // 使用照片作为缩略图
        },
        {
            id: 2,
            src: "videos/WeChat_20250520142059.mp4",
            title: "甜蜜时刻视频2",
            date: "2025-04-20",
            description: "又一个值得记忆的美好瞬间，我们的笑容如此灿烂。",
            thumbnail: "images/微信图片_20250520142116.jpg" // 使用照片作为缩略图
        }
    ],
    "旅行记录": [],
    "日常生活": []
};

// 初始化视频库
function initVideoGallery() {
    const videoContainer = document.getElementById('video-container');
    const videoTabs = document.getElementById('video-tabs');
    
    // 清空容器
    videoContainer.innerHTML = '';
    videoTabs.innerHTML = '';
    
    // 创建视频分类标签
    Object.keys(videoData).forEach((category, index) => {
        const tabElement = document.createElement('div');
        tabElement.className = `video-tab ${index === 0 ? 'active' : ''}`;
        tabElement.textContent = category;
        tabElement.dataset.category = category;
        
        tabElement.addEventListener('click', () => {
            // 移除所有标签的active类
            document.querySelectorAll('.video-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 为当前标签添加active类
            tabElement.classList.add('active');
            
            // 显示对应分类的视频
            showVideoCategory(category);
        });
        
        videoTabs.appendChild(tabElement);
    });
    
    // 添加"添加新分类"按钮
    const addCategoryButton = document.createElement('div');
    addCategoryButton.className = 'video-tab add-category';
    addCategoryButton.innerHTML = '<i class="fas fa-plus"></i> 新分类';
    addCategoryButton.addEventListener('click', showAddVideoCategoryForm);
    videoTabs.appendChild(addCategoryButton);
    
    // 默认显示第一个分类
    showVideoCategory(Object.keys(videoData)[0]);
    
    // 添加"添加新视频"按钮
    const addVideoButton = document.createElement('div');
    addVideoButton.className = 'add-video-button';
    addVideoButton.innerHTML = '<i class="fas fa-plus"></i> 添加新视频';
    addVideoButton.addEventListener('click', showAddVideoForm);
    videoContainer.appendChild(addVideoButton);
}

// 显示指定分类的视频
function showVideoCategory(category) {
    const videoContainer = document.getElementById('video-container');
    
    // 清空容器（保留添加按钮）
    const addButton = videoContainer.querySelector('.add-video-button');
    videoContainer.innerHTML = '';
    
    // 创建视频网格
    const videoGrid = document.createElement('div');
    videoGrid.className = 'video-grid';
    
    if (videoData[category].length === 0) {
        // 如果该分类没有视频
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-category';
        emptyMessage.innerHTML = `
            <p>这个分类还没有视频哦</p>
            <p>点击"添加新视频"按钮来添加吧！</p>
        `;
        videoGrid.appendChild(emptyMessage);
    } else {
        // 添加视频
        videoData[category].forEach(video => {
            const videoElement = createVideoElement(video, category);
            videoGrid.appendChild(videoElement);
        });
    }
    
    videoContainer.appendChild(videoGrid);
    
    // 重新添加"添加新视频"按钮
    if (addButton) {
        videoContainer.appendChild(addButton);
    }
}

// 创建单个视频元素
function createVideoElement(video, category) {
    const videoElement = document.createElement('div');
    videoElement.className = 'video-item';
    videoElement.dataset.id = video.id;
    
    const videoDate = new Date(video.date);
    const formattedDate = `${videoDate.getFullYear()}年${videoDate.getMonth() + 1}月${videoDate.getDate()}日`;
    
    videoElement.innerHTML = `
        <div class="video-thumbnail">
            ${video.thumbnail ? 
                `<img src="${video.thumbnail}" alt="${video.title}" loading="lazy">` : 
                `<div class="default-thumbnail"><i class="fas fa-video"></i></div>`
            }
            <div class="play-button"><i class="fas fa-play"></i></div>
        </div>
        <div class="video-info">
            <h4 class="video-title">${video.title}</h4>
            <p class="video-date">${formattedDate}</p>
            <div class="video-actions">
                <button class="play-video" data-id="${video.id}" data-category="${category}">
                    <i class="fas fa-play"></i> 播放
                </button>
                <button class="edit-video" data-id="${video.id}" data-category="${category}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
            </div>
        </div>
    `;
    
    // 添加播放视频事件
    videoElement.querySelector('.play-video').addEventListener('click', () => {
        playVideo(video);
    });
    
    // 添加编辑视频事件
    videoElement.querySelector('.edit-video').addEventListener('click', () => {
        showEditVideoForm(video, category);
    });
    
    // 点击缩略图也可以播放视频
    videoElement.querySelector('.video-thumbnail').addEventListener('click', () => {
        playVideo(video);
    });
    
    return videoElement;
}

// 播放视频
function playVideo(video) {
    const modalContainer = document.getElementById('video-modal-container');
    
    modalContainer.innerHTML = `
        <div class="video-modal">
            <div class="modal-header">
                <h3>${video.title}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="video-player">
                    <video controls>
                        <source src="${video.src}" type="video/mp4">
                        您的浏览器不支持视频播放。
                    </video>
                </div>
                <div class="video-detail-info">
                    <p class="video-date"><strong>日期：</strong>${formatDate(video.date)}</p>
                    <p class="video-description"><strong>描述：</strong>${video.description}</p>
                </div>
            </div>
        </div>
    `;
    
    modalContainer.style.display = 'flex';
    
    // 添加关闭模态框事件
    modalContainer.querySelector('.close-modal').addEventListener('click', () => {
        // 暂停视频
        const videoElement = modalContainer.querySelector('video');
        if (videoElement) {
            videoElement.pause();
        }
        modalContainer.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            // 暂停视频
            const videoElement = modalContainer.querySelector('video');
            if (videoElement) {
                videoElement.pause();
            }
            modalContainer.style.display = 'none';
        }
    });
    
    // 自动播放视频
    setTimeout(() => {
        const videoElement = modalContainer.querySelector('video');
        if (videoElement) {
            videoElement.play().catch(e => {
                console.log('自动播放失败，可能需要用户交互：', e);
            });
        }
    }, 300);
}

// 显示添加视频表单
function showAddVideoForm() {
    const formContainer = document.getElementById('video-form-container');
    
    // 获取当前活动的分类
    const activeTab = document.querySelector('.video-tab.active');
    const currentCategory = activeTab ? activeTab.dataset.category : Object.keys(videoData)[0];
    
    formContainer.innerHTML = `
        <div class="video-form">
            <h3>添加新视频</h3>
            <form id="add-video-form">
                <div class="form-group">
                    <label for="video-title">标题</label>
                    <input type="text" id="video-title" placeholder="视频标题" required>
                </div>
                <div class="form-group">
                    <label for="video-date">日期</label>
                    <input type="date" id="video-date" required>
                </div>
                <div class="form-group">
                    <label for="video-category">分类</label>
                    <select id="video-category">
                        ${Object.keys(videoData).map(category => 
                            `<option value="${category}" ${category === currentCategory ? 'selected' : ''}>${category}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="video-description">描述</label>
                    <textarea id="video-description" placeholder="视频描述" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="video-file">视频文件</label>
                    <input type="file" id="video-file" accept="video/*" required>
                </div>
                <div class="form-group">
                    <label for="thumbnail-file">缩略图（可选）</label>
                    <input type="file" id="thumbnail-file" accept="image/*">
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
    document.getElementById('add-video-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewVideo();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 显示编辑视频表单
function showEditVideoForm(video, category) {
    const formContainer = document.getElementById('video-form-container');
    
    formContainer.innerHTML = `
        <div class="video-form">
            <h3>编辑视频</h3>
            <form id="edit-video-form">
                <div class="form-group">
                    <label for="video-title">标题</label>
                    <input type="text" id="video-title" value="${video.title}" placeholder="视频标题" required>
                </div>
                <div class="form-group">
                    <label for="video-date">日期</label>
                    <input type="date" id="video-date" value="${video.date}" required>
                </div>
                <div class="form-group">
                    <label for="video-category">分类</label>
                    <select id="video-category">
                        ${Object.keys(videoData).map(cat => 
                            `<option value="${cat}" ${cat === category ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="video-description">描述</label>
                    <textarea id="video-description" placeholder="视频描述" rows="3">${video.description}</textarea>
                </div>
                <div class="form-group">
                    <label>当前视频</label>
                    <div class="current-video">
                        <video controls>
                            <source src="${video.src}" type="video/mp4">
                            您的浏览器不支持视频播放。
                        </video>
                    </div>
                </div>
                <div class="form-group">
                    <label for="video-file">更换视频（可选）</label>
                    <input type="file" id="video-file" accept="video/*">
                </div>
                <div class="form-group">
                    <label>当前缩略图</label>
                    <div class="current-thumbnail">
                        ${video.thumbnail ? 
                            `<img src="${video.thumbnail}" alt="当前缩略图">` : 
                            `<div class="default-thumbnail"><i class="fas fa-video"></i><p>无缩略图</p></div>`
                        }
                    </div>
                </div>
                <div class="form-group">
                    <label for="thumbnail-file">更换缩略图（可选）</label>
                    <input type="file" id="thumbnail-file" accept="image/*">
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                    <button type="button" class="btn-delete">删除视频</button>
                </div>
                <input type="hidden" id="video-id" value="${video.id}">
                <input type="hidden" id="original-category" value="${category}">
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('edit-video-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updateVideo();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
    
    // 添加删除按钮事件
    formContainer.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('确定要删除这个视频吗？')) {
            deleteVideo(video.id, category);
            formContainer.style.display = 'none';
        }
    });
}

// 显示添加视频分类表单
function showAddVideoCategoryForm() {
    const formContainer = document.getElementById('video-form-container');
    
    formContainer.innerHTML = `
        <div class="category-form">
            <h3>添加新视频分类</h3>
            <form id="add-video-category-form">
                <div class="form-group">
                    <label for="category-name">分类名称</label>
                    <input type="text" id="category-name" placeholder="分类名称" required>
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
    document.getElementById('add-video-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewVideoCategory();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 添加新视频
function addNewVideo() {
    const title = document.getElementById('video-title').value;
    const date = document.getElementById('video-date').value;
    const category = document.getElementById('video-category').value;
    const description = document.getElementById('video-description').value;
    
    // 简单模拟视频和缩略图上传（实际应用中需要实现真正的文件上传）
    const videoInput = document.getElementById('video-file');
    const thumbnailInput = document.getElementById('thumbnail-file');
    
    let videoPath = '';
    let thumbnailPath = '';
    
    if (videoInput.files && videoInput.files[0]) {
        // 在实际应用中，这里应该上传视频并获取路径
        // 这里仅作为示例，使用一个固定路径
        videoPath = 'videos/default-video.mp4';
    }
    
    if (thumbnailInput.files && thumbnailInput.files[0]) {
        // 在实际应用中，这里应该上传缩略图并获取路径
        // 这里仅作为示例，使用一个固定路径
        thumbnailPath = 'images/default-thumbnail.jpg';
    }
    
    // 生成新的视频ID
    const newId = Math.max(...Object.values(videoData).flatMap(videos => videos.map(v => v.id)), 0) + 1;
    
    const newVideo = {
        id: newId,
        title,
        date,
        description,
        src: videoPath,
        thumbnail: thumbnailPath
    };
    
    // 如果分类不存在，创建新分类
    if (!videoData[category]) {
        videoData[category] = [];
    }
    
    // 添加新视频
    videoData[category].push(newVideo);
    
    // 重新初始化视频库
    initVideoGallery();
    
    // 显示新添加的视频所在分类
    showVideoCategory(category);
    
    // 隐藏表单
    document.getElementById('video-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('视频添加成功！');
}

// 更新视频
function updateVideo() {
    const id = parseInt(document.getElementById('video-id').value);
    const title = document.getElementById('video-title').value;
    const date = document.getElementById('video-date').value;
    const newCategory = document.getElementById('video-category').value;
    const originalCategory = document.getElementById('original-category').value;
    const description = document.getElementById('video-description').value;
    
    // 简单模拟视频和缩略图上传（实际应用中需要实现真正的文件上传）
    const videoInput = document.getElementById('video-file');
    const thumbnailInput = document.getElementById('thumbnail-file');
    
    // 查找原视频
    const videoIndex = videoData[originalCategory].findIndex(v => v.id === id);
    if (videoIndex === -1) return;
    
    const originalVideo = videoData[originalCategory][videoIndex];
    let videoPath = originalVideo.src; // 保留原视频路径
    let thumbnailPath = originalVideo.thumbnail; // 保留原缩略图路径
    
    if (videoInput.files && videoInput.files[0]) {
        // 在实际应用中，这里应该上传视频并获取路径
        // 这里仅作为示例，使用一个新路径
        videoPath = 'videos/updated-video.mp4';
    }
    
    if (thumbnailInput.files && thumbnailInput.files[0]) {
        // 在实际应用中，这里应该上传缩略图并获取路径
        // 这里仅作为示例，使用一个新路径
        thumbnailPath = 'images/updated-thumbnail.jpg';
    }
    
    const updatedVideo = {
        id,
        title,
        date,
        description,
        src: videoPath,
        thumbnail: thumbnailPath
    };
    
    // 如果分类发生变化
    if (originalCategory !== newCategory) {
        // 从原分类中删除
        videoData[originalCategory].splice(videoIndex, 1);
        
        // 如果分类不存在，创建新分类
        if (!videoData[newCategory]) {
            videoData[newCategory] = [];
        }
        
        // 添加到新分类
        videoData[newCategory].push(updatedVideo);
    } else {
        // 更新原位置的视频
        videoData[originalCategory][videoIndex] = updatedVideo;
    }
    
    // 重新初始化视频库
    initVideoGallery();
    
    // 显示更新后的视频所在分类
    showVideoCategory(newCategory);
    
    // 隐藏表单
    document.getElementById('video-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('视频更新成功！');
}

// 删除视频
function deleteVideo(id, category) {
    const videoIndex = videoData[category].findIndex(v => v.id === id);
    if (videoIndex === -1) return;
    
    // 从分类中删除视频
    videoData[category].splice(videoIndex, 1);
    
    // 如果分类为空，考虑是否删除分类
    if (videoData[category].length === 0 && Object.keys(videoData).length > 1) {
        if (confirm(`分类"${category}"已经没有视频了，是否删除该分类？`)) {
            delete videoData[category];
        }
    }
    
    // 重新初始化视频库
    initVideoGallery();
    
    // 显示成功消息
    showNotification('视频已删除！');
}

// 添加新视频分类
function addNewVideoCategory() {
    const categoryName = document.getElementById('category-name').value;
    
    // 检查分类是否已存在
    if (videoData[categoryName]) {
        alert(`分类"${categoryName}"已存在！`);
        return;
    }
    
    // 创建新分类
    videoData[categoryName] = [];
    
    // 重新初始化视频库
    initVideoGallery();
    
    // 显示新分类
    showVideoCategory(categoryName);
    
    // 隐藏表单
    document.getElementById('video-form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('视频分类添加成功！');
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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

// 页面加载完成后初始化视频库
document.addEventListener('DOMContentLoaded', initVideoGallery);
