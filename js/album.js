// 相册数据
const albumData = {
    "甜蜜时光": [
        {
            id: 1,
            src: "images/微信图片_20250520142119.jpg",
            title: "夜晚的甜蜜自拍",
            date: "2025-04-15",
            description: "在灯光下的温馨合影，记录我们的幸福时刻。"
        },
        {
            id: 2,
            src: "images/微信图片_20250520142116.jpg",
            title: "另一个夜晚的甜蜜自拍",
            date: "2025-04-16",
            description: "绿色灯光下的我们，笑容如此灿烂。"
        },
        {
            id: 3,
            src: "images/微信图片_20250520142113.jpg",
            title: "第三个夜晚的甜蜜自拍",
            date: "2025-04-17",
            description: "同样的地点，不同的角度，记录着相同的幸福。"
        },
        {
            id: 4,
            src: "images/微信图片_20250520142038.jpg",
            title: "手牵手的温馨瞬间",
            date: "2025-5-6",
            description: "十指相扣，走过天津街头每一段路。"
        }
    ],
    "日常生活": [
        {
            id: 5,
            src: "images/大头第一次为我加油.jpg",
            title: "第一次为爱车加油",
            date: "2025-03-29",
            description: "大头第一次为我的爱车加油，记录这个特别的时刻。"
        },
        {
            id: 6,
            src: "images/微信图片_20250520142103.jpg",
            title: "阳光下的悠闲时光",
            date: "2025-04-05",
            description: "在阳光明媚的日子里，享受属于我们的悠闲时光。"
        },
        {
            id: 7,
            src: "images/微信图片_20250520142107.jpg",
            title: "街边的日常",
            date: "2025-04-08",
            description: "普通的一天，却因为有你的陪伴而变得特别。"
        },
        {
            id: 8,
            src: "images/第一次做饭.jpg",
            title: "第一次一起做饭",
            date: "2025-03-25",
            description: "我们第一次一起下厨房，虽然手忙脚乱，但充满了欢声笑语。"
        }
    ],
    "旅行记忆": [
        {
            id: 9,
            src: "images/微信图片_20250520142049.jpg",
            title: "度假屋前的欢乐时光",
            date: "2025-04-20",
            description: "在度假屋前留下美好的回忆，阳光、树影和你的笑容。"
        },
        {
            id: 10,
            src: "images/微信图片_20250520142123.jpg",
            title: "加油站的日常",
            date: "2025-03-29",
            description: "即使是普通的加油站，有你在的地方都是风景。"
        },
        {
            id: 11,
            src: "images/微信图片_20250520142110.jpg",
            title: "自拍合影",
            date: "2025-04-25",
            description: "在户外的自拍，记录我们的旅行足迹。"
        }
    ]
};

// 初始化相册
function initAlbum() {
    const albumContainer = document.getElementById('album-container');
    const albumTabs = document.getElementById('album-tabs');
    
    // 清空容器
    albumContainer.innerHTML = '';
    albumTabs.innerHTML = '';
    
    // 创建相册分类标签
    Object.keys(albumData).forEach((category, index) => {
        const tabElement = document.createElement('div');
        tabElement.className = `album-tab ${index === 0 ? 'active' : ''}`;
        tabElement.textContent = category;
        tabElement.dataset.category = category;
        
        tabElement.addEventListener('click', () => {
            // 移除所有标签的active类
            document.querySelectorAll('.album-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // 为当前标签添加active类
            tabElement.classList.add('active');
            
            // 显示对应分类的照片
            showAlbumCategory(category);
        });
        
        albumTabs.appendChild(tabElement);
    });
    
    // 添加"添加新分类"按钮
    const addCategoryButton = document.createElement('div');
    addCategoryButton.className = 'album-tab add-category';
    addCategoryButton.innerHTML = '<i class="fas fa-plus"></i> 新分类';
    addCategoryButton.addEventListener('click', showAddCategoryForm);
    albumTabs.appendChild(addCategoryButton);
    
    // 默认显示第一个分类
    showAlbumCategory(Object.keys(albumData)[0]);
    
    // 添加"添加新照片"按钮
    const addPhotoButton = document.createElement('div');
    addPhotoButton.className = 'add-photo-button';
    addPhotoButton.innerHTML = '<i class="fas fa-plus"></i> 添加新照片';
    addPhotoButton.addEventListener('click', showAddPhotoForm);
    albumContainer.appendChild(addPhotoButton);
}

// 显示指定分类的照片
function showAlbumCategory(category) {
    const albumContainer = document.getElementById('album-container');
    
    // 清空容器（保留添加按钮）
    const addButton = albumContainer.querySelector('.add-photo-button');
    albumContainer.innerHTML = '';
    
    // 创建照片网格
    const photoGrid = document.createElement('div');
    photoGrid.className = 'photo-grid';
    
    // 添加照片
    albumData[category].forEach(photo => {
        const photoElement = createPhotoElement(photo, category);
        photoGrid.appendChild(photoElement);
    });
    
    albumContainer.appendChild(photoGrid);
    
    // 重新添加"添加新照片"按钮
    if (addButton) {
        albumContainer.appendChild(addButton);
    }
}

// 创建单个照片元素
function createPhotoElement(photo, category) {
    const photoElement = document.createElement('div');
    photoElement.className = 'photo-item';
    photoElement.dataset.id = photo.id;
    
    photoElement.innerHTML = `
        <div class="photo-container">
            <img src="${photo.src}" alt="${photo.title}" loading="lazy">
            <div class="photo-overlay">
                <h4>${photo.title}</h4>
                <p class="photo-date">${formatDate(photo.date)}</p>
                <div class="photo-actions">
                    <button class="view-photo" data-id="${photo.id}" data-category="${category}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="edit-photo" data-id="${photo.id}" data-category="${category}">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // 添加查看照片事件
    photoElement.querySelector('.view-photo').addEventListener('click', () => {
        showPhotoDetail(photo, category);
    });
    
    // 添加编辑照片事件
    photoElement.querySelector('.edit-photo').addEventListener('click', () => {
        showEditPhotoForm(photo, category);
    });
    
    // 点击照片也可以查看详情
    photoElement.querySelector('img').addEventListener('click', () => {
        showPhotoDetail(photo, category);
    });
    
    return photoElement;
}

// 显示照片详情
function showPhotoDetail(photo, category) {
    const modalContainer = document.getElementById('modal-container');
    
    modalContainer.innerHTML = `
        <div class="photo-detail-modal">
            <div class="modal-header">
                <h3>${photo.title}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="photo-detail-image">
                    <img src="${photo.src}" alt="${photo.title}">
                </div>
                <div class="photo-detail-info">
                    <p class="photo-date"><strong>日期：</strong>${formatDate(photo.date)}</p>
                    <p class="photo-category"><strong>分类：</strong>${category}</p>
                    <p class="photo-description"><strong>描述：</strong>${photo.description}</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="edit-photo" data-id="${photo.id}" data-category="${category}">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button class="delete-photo" data-id="${photo.id}" data-category="${category}">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </div>
        </div>
    `;
    
    modalContainer.style.display = 'flex';
    
    // 添加关闭模态框事件
    modalContainer.querySelector('.close-modal').addEventListener('click', () => {
        modalContainer.style.display = 'none';
    });
    
    // 添加编辑照片事件
    modalContainer.querySelector('.edit-photo').addEventListener('click', () => {
        modalContainer.style.display = 'none';
        showEditPhotoForm(photo, category);
    });
    
    // 添加删除照片事件
    modalContainer.querySelector('.delete-photo').addEventListener('click', () => {
        if (confirm('确定要删除这张照片吗？')) {
            deletePhoto(photo.id, category);
            modalContainer.style.display = 'none';
        }
    });
    
    // 点击模态框外部关闭
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            modalContainer.style.display = 'none';
        }
    });
}

// 显示添加照片表单
function showAddPhotoForm() {
    const formContainer = document.getElementById('form-container');
    
    // 获取当前活动的分类
    const activeTab = document.querySelector('.album-tab.active');
    const currentCategory = activeTab ? activeTab.dataset.category : Object.keys(albumData)[0];
    
    formContainer.innerHTML = `
        <div class="photo-form">
            <h3>添加新照片</h3>
            <form id="add-photo-form">
                <div class="form-group">
                    <label for="photo-title">标题</label>
                    <input type="text" id="photo-title" placeholder="照片标题" required>
                </div>
                <div class="form-group">
                    <label for="photo-date">日期</label>
                    <input type="date" id="photo-date" required>
                </div>
                <div class="form-group">
                    <label for="photo-category">分类</label>
                    <select id="photo-category">
                        ${Object.keys(albumData).map(category => 
                            `<option value="${category}" ${category === currentCategory ? 'selected' : ''}>${category}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="photo-description">描述</label>
                    <textarea id="photo-description" placeholder="照片描述" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="photo-file">照片</label>
                    <input type="file" id="photo-file" accept="image/*" required>
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
    document.getElementById('add-photo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewPhoto();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 显示编辑照片表单
function showEditPhotoForm(photo, category) {
    const formContainer = document.getElementById('form-container');
    
    formContainer.innerHTML = `
        <div class="photo-form">
            <h3>编辑照片</h3>
            <form id="edit-photo-form">
                <div class="form-group">
                    <label for="photo-title">标题</label>
                    <input type="text" id="photo-title" value="${photo.title}" placeholder="照片标题" required>
                </div>
                <div class="form-group">
                    <label for="photo-date">日期</label>
                    <input type="date" id="photo-date" value="${photo.date}" required>
                </div>
                <div class="form-group">
                    <label for="photo-category">分类</label>
                    <select id="photo-category">
                        ${Object.keys(albumData).map(cat => 
                            `<option value="${cat}" ${cat === category ? 'selected' : ''}>${cat}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <label for="photo-description">描述</label>
                    <textarea id="photo-description" placeholder="照片描述" rows="3">${photo.description}</textarea>
                </div>
                <div class="form-group">
                    <label for="photo-file">更换照片（可选）</label>
                    <input type="file" id="photo-file" accept="image/*">
                    <div class="current-photo">
                        <img src="${photo.src}" alt="当前照片">
                        <p>当前照片</p>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-save">保存</button>
                    <button type="button" class="btn-cancel">取消</button>
                    <button type="button" class="btn-delete">删除照片</button>
                </div>
                <input type="hidden" id="photo-id" value="${photo.id}">
                <input type="hidden" id="original-category" value="${category}">
            </form>
        </div>
    `;
    
    formContainer.style.display = 'flex';
    
    // 添加表单提交事件
    document.getElementById('edit-photo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        updatePhoto();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
    
    // 添加删除按钮事件
    formContainer.querySelector('.btn-delete').addEventListener('click', () => {
        if (confirm('确定要删除这张照片吗？')) {
            deletePhoto(photo.id, category);
            formContainer.style.display = 'none';
        }
    });
}

// 显示添加分类表单
function showAddCategoryForm() {
    const formContainer = document.getElementById('form-container');
    
    formContainer.innerHTML = `
        <div class="category-form">
            <h3>添加新分类</h3>
            <form id="add-category-form">
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
    document.getElementById('add-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        addNewCategory();
    });
    
    // 添加取消按钮事件
    formContainer.querySelector('.btn-cancel').addEventListener('click', () => {
        formContainer.style.display = 'none';
    });
}

// 添加新照片
function addNewPhoto() {
    const title = document.getElementById('photo-title').value;
    const date = document.getElementById('photo-date').value;
    const category = document.getElementById('photo-category').value;
    const description = document.getElementById('photo-description').value;
    
    // 简单模拟图片上传（实际应用中需要实现真正的文件上传）
    const fileInput = document.getElementById('photo-file');
    let imagePath = '';
    
    if (fileInput.files && fileInput.files[0]) {
        // 在实际应用中，这里应该上传图片并获取路径
        // 这里仅作为示例，使用一个固定路径
        imagePath = 'images/default-photo.jpg';
    }
    
    // 生成新的照片ID
    const newId = Math.max(...Object.values(albumData).flatMap(photos => photos.map(p => p.id)), 0) + 1;
    
    const newPhoto = {
        id: newId,
        title,
        date,
        description,
        src: imagePath
    };
    
    // 如果分类不存在，创建新分类
    if (!albumData[category]) {
        albumData[category] = [];
    }
    
    // 添加新照片
    albumData[category].push(newPhoto);
    
    // 重新初始化相册
    initAlbum();
    
    // 显示新添加的照片所在分类
    showAlbumCategory(category);
    
    // 隐藏表单
    document.getElementById('form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('照片添加成功！');
}

// 更新照片
function updatePhoto() {
    const id = parseInt(document.getElementById('photo-id').value);
    const title = document.getElementById('photo-title').value;
    const date = document.getElementById('photo-date').value;
    const newCategory = document.getElementById('photo-category').value;
    const originalCategory = document.getElementById('original-category').value;
    const description = document.getElementById('photo-description').value;
    
    // 简单模拟图片上传（实际应用中需要实现真正的文件上传）
    const fileInput = document.getElementById('photo-file');
    
    // 查找原照片
    const photoIndex = albumData[originalCategory].findIndex(p => p.id === id);
    if (photoIndex === -1) return;
    
    const originalPhoto = albumData[originalCategory][photoIndex];
    let imagePath = originalPhoto.src; // 保留原图片路径
    
    if (fileInput.files && fileInput.files[0]) {
        // 在实际应用中，这里应该上传图片并获取路径
        // 这里仅作为示例，使用一个新路径
        imagePath = 'images/updated-photo.jpg';
    }
    
    const updatedPhoto = {
        id,
        title,
        date,
        description,
        src: imagePath
    };
    
    // 如果分类发生变化
    if (originalCategory !== newCategory) {
        // 从原分类中删除
        albumData[originalCategory].splice(photoIndex, 1);
        
        // 如果分类不存在，创建新分类
        if (!albumData[newCategory]) {
            albumData[newCategory] = [];
        }
        
        // 添加到新分类
        albumData[newCategory].push(updatedPhoto);
    } else {
        // 更新原位置的照片
        albumData[originalCategory][photoIndex] = updatedPhoto;
    }
    
    // 重新初始化相册
    initAlbum();
    
    // 显示更新后的照片所在分类
    showAlbumCategory(newCategory);
    
    // 隐藏表单
    document.getElementById('form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('照片更新成功！');
}

// 删除照片
function deletePhoto(id, category) {
    const photoIndex = albumData[category].findIndex(p => p.id === id);
    if (photoIndex === -1) return;
    
    // 从分类中删除照片
    albumData[category].splice(photoIndex, 1);
    
    // 如果分类为空，考虑是否删除分类
    if (albumData[category].length === 0 && Object.keys(albumData).length > 1) {
        if (confirm(`分类"${category}"已经没有照片了，是否删除该分类？`)) {
            delete albumData[category];
        }
    }
    
    // 重新初始化相册
    initAlbum();
    
    // 显示成功消息
    showNotification('照片已删除！');
}

// 添加新分类
function addNewCategory() {
    const categoryName = document.getElementById('category-name').value;
    
    // 检查分类是否已存在
    if (albumData[categoryName]) {
        alert(`分类"${categoryName}"已存在！`);
        return;
    }
    
    // 创建新分类
    albumData[categoryName] = [];
    
    // 重新初始化相册
    initAlbum();
    
    // 显示新分类
    showAlbumCategory(categoryName);
    
    // 隐藏表单
    document.getElementById('form-container').style.display = 'none';
    
    // 显示成功消息
    showNotification('分类添加成功！');
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

// 页面加载完成后初始化相册
document.addEventListener('DOMContentLoaded', initAlbum);
