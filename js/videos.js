// 视频数据
const videoData = {
    "甜蜜时刻": [
        {
            id: 1,
            src: "videos/WeChat_20250520142055.mp4",
            title: "大头摸狗 越来越有",
            date: "2025-04-15",
            description: "记录我们一起的甜蜜时光，每一刻都值得珍藏。",
            thumbnail: null // 使用视频第一帧作为缩略图
        },
        {
            id: 2,
            src: "videos/WeChat_20250520142059.mp4",
            title: "大头点菜 越点越菜",
            date: "2025-04-20",
            description: "又一个值得记忆的美好瞬间，我们的笑容如此灿烂。",
            thumbnail: null // 使用视频第一帧作为缩略图
        }
    ],
    "旅行记录": [
        {
            id: 3,
            src: "https://v.douyin.com/OrStvz-mgf0/",
            title: "舟山出游小记",
            date: "2025-06-01",
            description: "我们一起去舟山的美好回忆，海风轻抚，阳光正好，和你在一起的每一刻都是最美的风景。",
            thumbnail: "images/舟山出游视频封面.jpg",
            isCloudVideo: true, // 标记为云存储视频
            shareUrl: "https://v.douyin.com/OrStvz-mgf0/" // 保存抖音分享链接
        }
    ],
    "日常生活": []
};

// 检查视频文件是否存在
function checkVideoExists(src) {
    return new Promise((resolve) => {
        console.log('检查视频文件:', src); // 添加调试日志
        
        if (src.startsWith('http')) {
            console.log('网络视频，默认存在');
            resolve(true); // 网络视频默认存在
            return;
        }
        
        const video = document.createElement('video');
        video.onloadedmetadata = () => {
            console.log('视频文件存在:', src);
            resolve(true);
        };
        video.onerror = (error) => {
            console.error('视频文件不存在或无法加载:', src, error);
            resolve(false);
        };
        
        // 设置超时机制，避免长时间等待
        setTimeout(() => {
            console.warn('视频检查超时（已延长至15秒）:', src);
            resolve(false);
        }, 15000); // 超时时间从5秒增加到15秒
        
        video.src = src;
    });
}

// 生成视频缩略图
function generateVideoThumbnail(videoSrc) {
    return new Promise((resolve) => {
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        video.onloadedmetadata = () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            video.currentTime = 1; // 获取第1秒的帧
        };
        
        video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            resolve(thumbnailDataUrl);
        };
        
        video.onerror = () => {
            resolve(null);
        };
        
        video.src = videoSrc;
        video.load();
    });
}

// 初始化视频库
function initVideoGallery() {
    console.log('开始初始化视频库...'); // 添加调试日志
    console.log('视频数据:', videoData); // 输出视频数据
    
    const videoTabsContainer = document.getElementById('video-tabs');
    const videoContainer = document.getElementById('video-container');
    
    // 清空容器
    videoContainer.innerHTML = '';
    videoTabsContainer.innerHTML = '';
    
    // 创建视频分类标签
    Object.keys(videoData).forEach((category, index) => {
        const tabElement = document.createElement('div');
        tabElement.className = `video-tab ${index === 0 ? 'active' : ''}`;
        tabElement.textContent = category;
        tabElement.dataset.category = category;
        
        tabElement.addEventListener('click', async () => {
            // 移除所有标签的active类
            document.querySelectorAll('.video-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 为当前标签添加active类
            tabElement.classList.add('active');
            
            // 显示对应分类的视频
            await showVideoCategory(category);
        });
        
        videoTabsContainer.appendChild(tabElement);
    });
    
    // 添加"添加新分类"按钮
    const addCategoryButton = document.createElement('div');
    addCategoryButton.className = 'video-tab add-category';
    addCategoryButton.innerHTML = '<i class="fas fa-plus"></i> 新分类';
    addCategoryButton.addEventListener('click', showAddVideoCategoryForm);
    videoTabsContainer.appendChild(addCategoryButton);
    
    // 默认显示第一个分类（异步）
    if (Object.keys(videoData).length > 0) {
        showVideoCategory(Object.keys(videoData)[0]);
    }
}

// 显示指定分类的视频
async function showVideoCategory(category) {
    const videoContainer = document.getElementById('video-container');
    
    // 清空容器
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
        // 添加视频（异步处理）
        const videoPromises = videoData[category].map(async (video) => {
            const videoElement = await createVideoElement(video, category);
            return videoElement;
        });
        
        // 等待所有视频元素创建完成
        const videoElements = await Promise.all(videoPromises);
        videoElements.forEach(videoElement => {
            videoGrid.appendChild(videoElement);
        });
    }
    
    videoContainer.appendChild(videoGrid);
    
    // 添加"添加新视频"按钮
    const addVideoButton = document.createElement('div');
    addVideoButton.className = 'add-video-button';
    addVideoButton.innerHTML = '<i class="fas fa-plus"></i> 添加新视频';
    addVideoButton.addEventListener('click', () => {
        // 使用新的大文件上传功能
        if (window.videoUploader) {
            window.videoUploader.showUploadModal();
        } else {
            // 降级到原来的表单（如果上传功能未加载）
            showAddVideoForm();
        }
    });
    videoContainer.appendChild(addVideoButton);
}

// 创建单个视频元素
async function createVideoElement(video, category) {
    const videoElement = document.createElement('div');
    videoElement.className = 'video-item';
    videoElement.dataset.id = video.id;
    
    const videoDate = new Date(video.date);
    const formattedDate = `${videoDate.getFullYear()}年${videoDate.getMonth() + 1}月${videoDate.getDate()}日`;
    
    // 检查视频是否存在
    let videoExists = await checkVideoExists(video.src);
    
    // 创建缩略图HTML
    let thumbnailHTML = '';
    if (video.isCloudVideo) {
        // 判断是否为抖音视频
        const isDouyinVideo = video.src.includes('douyin.com');
        const platformName = isDouyinVideo ? '抖音' : '云存储';
        const platformIcon = isDouyinVideo ? 'fas fa-music' : 'fas fa-cloud-download-alt';
        const thumbnailClass = isDouyinVideo ? 'default-thumbnail douyin-video' : 'default-thumbnail';
        
        // 云存储视频使用自定义缩略图或默认图标
        thumbnailHTML = video.thumbnail ? 
            `<img src="${video.thumbnail}" alt="${video.title}" loading="lazy" onerror="this.style.display='none'; this.parentNode.querySelector('.default-thumbnail').style.display='flex';">
             <div class="${thumbnailClass}" style="display: none;"><i class="${platformIcon}"></i><p>${platformName}视频</p></div>` : 
            `<div class="${thumbnailClass}"><i class="${platformIcon}"></i><p>${platformName}视频</p></div>`;
    } else if (videoExists) {
        // 本地视频使用video标签预览
        thumbnailHTML = `
            <video class="video-preview" muted preload="metadata" playsinline>
                <source src="${video.src}#t=0.5" type="video/mp4">
            </video>
            <div class="default-thumbnail video-fallback" style="display: none;">
                <i class="fas fa-video"></i><p>视频预览</p>
            </div>`;
    } else {
        // 视频不存在，显示错误状态
        thumbnailHTML = `
            <div class="default-thumbnail video-error">
                <i class="fas fa-exclamation-triangle"></i><p>视频文件未找到</p>
            </div>`;
    }
    
    videoElement.innerHTML = `
        <div class="video-thumbnail">
            ${thumbnailHTML}
            <div class="play-button"><i class="fas fa-play"></i></div>
        </div>
        <div class="video-info">
            <h4 class="video-title">${video.title}</h4>
            <p class="video-date">${formattedDate}</p>
            <div class="video-actions">
                <button class="play-video" data-id="${video.id}" data-category="${category}" ${!videoExists && !video.isCloudVideo ? 'disabled' : ''}>
                    <i class="fas fa-play"></i> ${video.isCloudVideo ? '在线播放' : '播放'}
                </button>
                <button class="edit-video" data-id="${video.id}" data-category="${category}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
            </div>
        </div>
    `;
    
    // 处理视频预览错误
    const videoPreview = videoElement.querySelector('.video-preview');
    if (videoPreview) {
        videoPreview.onerror = function() {
            this.style.display = 'none';
            const fallback = this.parentNode.querySelector('.video-fallback');
            if (fallback) {
                fallback.style.display = 'flex';
            }
        };
        
        // 设置视频预览的hover效果
        videoPreview.onmouseenter = function() {
            if (this.paused) {
                this.play().catch(() => {
                    // 播放失败时静默处理
                });
            }
        };
        
        videoPreview.onmouseleave = function() {
            this.pause();
            this.currentTime = 0.5;
        };
    }
    
    // 添加播放视频事件
    const playButton = videoElement.querySelector('.play-video');
    if (playButton && !playButton.disabled) {
        console.log('绑定播放按钮事件:', video.title, video.id); // 添加调试日志
        playButton.addEventListener('click', (e) => {
            console.log('播放按钮被点击:', video.title, video.src); // 添加调试日志
            e.preventDefault();
            e.stopPropagation();
            playVideo(video);
        });
    } else {
        console.warn('播放按钮被禁用或不存在:', video.title, playButton ? '按钮禁用' : '按钮不存在');
    }
    
    // 添加编辑视频事件
    videoElement.querySelector('.edit-video').addEventListener('click', () => {
        showEditVideoForm(video, category);
    });
    
    // 点击缩略图也可以播放视频（如果视频可用）
    const thumbnail = videoElement.querySelector('.video-thumbnail');
    if (thumbnail && (videoExists || video.isCloudVideo)) {
        thumbnail.addEventListener('click', () => {
            playVideo(video);
        });
        thumbnail.style.cursor = 'pointer';
    }
    
    return videoElement;
}

// 播放视频
function playVideo(video) {
    console.log('开始播放视频:', video.title, video.src, video.isCloudVideo ? '云视频' : '本地视频'); // 添加调试日志
    
    const modalContainer = document.getElementById('video-modal-container');
    
    // 如果是云存储视频，显示特殊的播放界面
    if (video.isCloudVideo) {
        // 判断是否为抖音视频
        const isDouyinVideo = video.src.includes('douyin.com');
        const platformName = isDouyinVideo ? '抖音' : '腾讯微云';
        const platformIcon = isDouyinVideo ? 'fas fa-music' : 'fas fa-cloud';
        
        modalContainer.innerHTML = `
            <div class="video-modal">
                <div class="modal-header">
                    <h3>${video.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="cloud-video-info">
                        <div class="video-poster">
                            ${video.thumbnail ? 
                                `<img src="${video.thumbnail}" alt="${video.title}" style="width: 100%; max-width: 600px; border-radius: 8px;">` : 
                                `<div class="default-thumbnail">
                                    <i class="${platformIcon}"></i>
                                    <p>${platformName}视频</p>
                                </div>`
                            }
                            <div class="play-overlay">
                                <button class="cloud-play-btn" onclick="window.open('${video.shareUrl}', '_blank')">
                                    <i class="fas fa-external-link-alt"></i>
                                    <span>在${platformName}中观看</span>
                                </button>
                            </div>
                        </div>
                        <div class="cloud-video-tips">
                            <p><i class="fas fa-info-circle"></i> 此视频存储在${platformName}，点击上方按钮在新窗口中观看</p>
                            ${isDouyinVideo ? 
                                `<p><i class="fas fa-music"></i> 抖音视频链接，支持手机端直接打开抖音APP观看</p>` :
                                `<p><i class="fas fa-cloud"></i> 视频通过腾讯微云提供，确保高清流畅播放</p>`
                            }
                        </div>
                    </div>
                    <div class="video-detail-info">
                        <p class="video-date"><strong>日期：</strong>${formatDate(video.date)}</p>
                        <p class="video-description"><strong>描述：</strong>${video.description}</p>
                    </div>
                </div>
            </div>
        `;
    } else {
        // 原有的本地视频播放逻辑
        modalContainer.innerHTML = `
            <div class="video-modal">
                <div class="modal-header">
                    <h3>${video.title}</h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="video-player">
                        <video controls playsinline preload="metadata">
                            <source src="${video.src}" type="video/mp4">
                            <p>您的浏览器不支持视频播放。请尝试使用最新版本的Chrome、Firefox或Safari浏览器。</p>
                        </video>
                    </div>
                    <div class="video-detail-info">
                        <p class="video-date"><strong>日期：</strong>${formatDate(video.date)}</p>
                        <p class="video-description"><strong>描述：</strong>${video.description}</p>
                    </div>
                </div>
            </div>
        `;
        
        // 处理视频加载错误
        setTimeout(() => {
            const videoElement = modalContainer.querySelector('video');
            if (videoElement) {
                videoElement.onerror = function() {
                    this.outerHTML = `
                        <div class="video-error-message">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h4>视频加载失败</h4>
                            <p>无法播放此视频文件，可能的原因：</p>
                            <ul>
                                <li>视频文件已移动或删除</li>
                                <li>视频格式不受支持</li>
                                <li>网络连接问题</li>
                            </ul>
                            <button onclick="location.reload()" class="retry-btn">
                                <i class="fas fa-redo"></i> 重新加载页面
                            </button>
                        </div>
                    `;
                };
                
                // 尝试自动播放
                videoElement.play().catch(e => {
                    console.log('自动播放失败，需要用户交互：', e);
                });
            }
        }, 300);
    }
    
    modalContainer.style.display = 'flex';
    
    // 添加关闭模态框事件
    modalContainer.querySelector('.close-modal').addEventListener('click', () => {
        // 暂停视频（如果是本地视频）
        const videoElement = modalContainer.querySelector('video');
        if (videoElement) {
            videoElement.pause();
        }
        modalContainer.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            // 暂停视频（如果是本地视频）
            const videoElement = modalContainer.querySelector('video');
            if (videoElement) {
                videoElement.pause();
            }
            modalContainer.style.display = 'none';
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modalContainer.style.display === 'flex') {
            const videoElement = modalContainer.querySelector('video');
            if (videoElement) {
                videoElement.pause();
            }
            modalContainer.style.display = 'none';
        }
    });
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
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM内容已加载，开始初始化视频库');
    initVideoGallery();
});
