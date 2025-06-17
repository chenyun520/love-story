// 大文件视频上传功能
class VideoUploader {
    constructor() {
        this.chunkSize = 2 * 1024 * 1024; // 2MB per chunk
        this.maxRetries = 3;
        this.uploadedChunks = new Set();
        this.currentUpload = null;
        this.isUploading = false;
    }

    // 初始化上传功能
    init() {
        this.createUploadInterface();
        this.bindEvents();
    }

    // 创建上传界面
    createUploadInterface() {
        const uploadHtml = `
            <div id="video-upload-container" class="upload-container" style="display: none;">
                <div class="upload-modal">
                    <div class="upload-header">
                        <h3>上传视频</h3>
                        <button class="close-upload" id="close-upload">&times;</button>
                    </div>
                    <div class="upload-body">
                        <div class="drag-drop-area" id="drag-drop-area">
                            <div class="upload-icon">
                                <i class="fas fa-cloud-upload-alt"></i>
                            </div>
                            <h4>拖拽视频文件到这里</h4>
                            <p>或者 <label for="video-file-input" class="file-input-label">点击选择文件</label></p>
                            <input type="file" id="video-file-input" accept="video/*" style="display: none;">
                            <p class="file-info">支持 MP4, AVI, MOV 格式，最大 500MB</p>
                        </div>
                        
                        <div class="upload-progress" id="upload-progress" style="display: none;">
                            <div class="progress-info">
                                <span class="file-name" id="file-name"></span>
                                <span class="progress-text" id="progress-text">0%</span>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="progress-fill"></div>
                            </div>
                            <div class="upload-details">
                                <span class="upload-speed" id="upload-speed">0 MB/s</span>
                                <span class="upload-size" id="upload-size">0 MB / 0 MB</span>
                                <span class="time-remaining" id="time-remaining">剩余时间: --</span>
                            </div>
                            <div class="upload-actions">
                                <button class="pause-upload" id="pause-upload">暂停</button>
                                <button class="cancel-upload" id="cancel-upload">取消</button>
                            </div>
                        </div>

                        <div class="video-info-form" id="video-info-form" style="display: none;">
                            <h4>视频信息</h4>
                            <div class="form-group">
                                <label for="video-title">标题:</label>
                                <input type="text" id="video-title" placeholder="输入视频标题">
                            </div>
                            <div class="form-group">
                                <label for="video-category">分类:</label>
                                <select id="video-category">
                                    <option value="甜蜜时刻">甜蜜时刻</option>
                                    <option value="旅行记录">旅行记录</option>
                                    <option value="日常生活">日常生活</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="video-description">描述:</label>
                                <textarea id="video-description" placeholder="输入视频描述"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="video-date">日期:</label>
                                <input type="date" id="video-date">
                            </div>
                            <div class="form-actions">
                                <button class="confirm-upload" id="confirm-upload">确认上传</button>
                                <button class="cancel-info" id="cancel-info">取消</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', uploadHtml);
    }

    // 绑定事件
    bindEvents() {
        const fileInput = document.getElementById('video-file-input');
        const dragDropArea = document.getElementById('drag-drop-area');
        const closeUpload = document.getElementById('close-upload');
        const pauseUpload = document.getElementById('pause-upload');
        const cancelUpload = document.getElementById('cancel-upload');
        const confirmUpload = document.getElementById('confirm-upload');
        const cancelInfo = document.getElementById('cancel-info');

        // 文件选择
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // 拖拽功能
        dragDropArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragDropArea.classList.add('drag-over');
        });

        dragDropArea.addEventListener('dragleave', () => {
            dragDropArea.classList.remove('drag-over');
        });

        dragDropArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dragDropArea.classList.remove('drag-over');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // 其他按钮事件
        closeUpload.addEventListener('click', () => this.closeUploadModal());
        pauseUpload.addEventListener('click', () => this.pauseUpload());
        cancelUpload.addEventListener('click', () => this.cancelUpload());
        confirmUpload.addEventListener('click', () => this.startUpload());
        cancelInfo.addEventListener('click', () => this.closeUploadModal());
    }

    // 显示上传模态框
    showUploadModal() {
        document.getElementById('video-upload-container').style.display = 'flex';
        this.resetUploadState();
    }

    // 关闭上传模态框
    closeUploadModal() {
        if (this.isUploading) {
            if (confirm('正在上传中，确定要关闭吗？')) {
                this.cancelUpload();
            } else {
                return;
            }
        }
        document.getElementById('video-upload-container').style.display = 'none';
        this.resetUploadState();
    }

    // 重置上传状态
    resetUploadState() {
        document.getElementById('drag-drop-area').style.display = 'block';
        document.getElementById('upload-progress').style.display = 'none';
        document.getElementById('video-info-form').style.display = 'none';
        document.getElementById('video-file-input').value = '';
        this.currentUpload = null;
        this.isUploading = false;
        this.uploadedChunks.clear();
    }

    // 处理文件选择
    handleFileSelect(file) {
        if (!this.validateFile(file)) {
            return;
        }

        this.currentUpload = {
            file: file,
            fileName: file.name,
            fileSize: file.size,
            uploadedSize: 0,
            startTime: null,
            isPaused: false
        };

        // 显示视频信息表单
        document.getElementById('drag-drop-area').style.display = 'none';
        document.getElementById('video-info-form').style.display = 'block';
        
        // 设置默认值
        document.getElementById('video-title').value = file.name.replace(/\.[^/.]+$/, "");
        document.getElementById('video-date').value = new Date().toISOString().split('T')[0];
    }

    // 验证文件
    validateFile(file) {
        const maxSize = 500 * 1024 * 1024; // 500MB
        const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-msvideo'];

        if (file.size > maxSize) {
            alert('文件大小不能超过 500MB');
            return false;
        }

        if (!allowedTypes.includes(file.type)) {
            alert('只支持 MP4, AVI, MOV 格式的视频文件');
            return false;
        }

        return true;
    }

    // 开始上传
    async startUpload() {
        const title = document.getElementById('video-title').value.trim();
        const category = document.getElementById('video-category').value;
        const description = document.getElementById('video-description').value.trim();
        const date = document.getElementById('video-date').value;

        if (!title) {
            alert('请输入视频标题');
            return;
        }

        this.currentUpload.title = title;
        this.currentUpload.category = category;
        this.currentUpload.description = description;
        this.currentUpload.date = date;

        // 显示上传进度
        document.getElementById('video-info-form').style.display = 'none';
        document.getElementById('upload-progress').style.display = 'block';
        document.getElementById('file-name').textContent = this.currentUpload.fileName;

        this.isUploading = true;
        this.currentUpload.startTime = Date.now();

        try {
            await this.uploadFile();
        } catch (error) {
            console.error('上传失败:', error);
            alert('上传失败: ' + error.message);
            this.resetUploadState();
        }
    }

    // 上传文件（分片上传）
    async uploadFile() {
        const file = this.currentUpload.file;
        const totalChunks = Math.ceil(file.size / this.chunkSize);
        
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
            if (!this.isUploading) break;
            
            if (this.uploadedChunks.has(chunkIndex)) {
                continue; // 跳过已上传的分片
            }

            const start = chunkIndex * this.chunkSize;
            const end = Math.min(start + this.chunkSize, file.size);
            const chunk = file.slice(start, end);

            let retries = 0;
            while (retries < this.maxRetries) {
                try {
                    await this.uploadChunk(chunk, chunkIndex, totalChunks);
                    this.uploadedChunks.add(chunkIndex);
                    break;
                } catch (error) {
                    retries++;
                    if (retries >= this.maxRetries) {
                        throw new Error(`分片 ${chunkIndex} 上传失败: ${error.message}`);
                    }
                    await this.sleep(1000 * retries); // 重试前等待
                }
            }

            this.updateProgress(chunkIndex + 1, totalChunks);
        }

        if (this.isUploading) {
            await this.completeUpload();
        }
    }

    // 上传单个分片
    async uploadChunk(chunk, chunkIndex, totalChunks) {
        return new Promise((resolve, reject) => {
            // 模拟上传到服务器
            // 在实际应用中，这里应该是真实的上传逻辑
            setTimeout(() => {
                if (Math.random() > 0.95) { // 5% 的失败率用于测试重试机制
                    reject(new Error('网络错误'));
                } else {
                    resolve();
                }
            }, 100 + Math.random() * 200); // 模拟网络延迟
        });
    }

    // 完成上传
    async completeUpload() {
        // 将视频文件保存到本地存储或发送到服务器
        const videoData = {
            id: Date.now(),
            src: URL.createObjectURL(this.currentUpload.file), // 临时URL，实际应用中应该是服务器返回的URL
            title: this.currentUpload.title,
            date: this.currentUpload.date,
            description: this.currentUpload.description,
            thumbnail: null // 可以添加缩略图生成功能
        };

        // 添加到对应分类
        if (!window.videoData) {
            window.videoData = {
                "甜蜜时刻": [],
                "旅行记录": [],
                "日常生活": []
            };
        }

        if (!window.videoData[this.currentUpload.category]) {
            window.videoData[this.currentUpload.category] = [];
        }

        window.videoData[this.currentUpload.category].push(videoData);

        // 保存到本地存储
        localStorage.setItem('videoData', JSON.stringify(window.videoData));

        // 刷新视频显示
        if (typeof showVideoCategory === 'function') {
            showVideoCategory(this.currentUpload.category);
        }

        alert('视频上传成功！');
        this.closeUploadModal();
    }

    // 更新进度
    updateProgress(uploadedChunks, totalChunks) {
        const progress = (uploadedChunks / totalChunks) * 100;
        const uploadedSize = uploadedChunks * this.chunkSize;
        const currentTime = Date.now();
        const elapsedTime = (currentTime - this.currentUpload.startTime) / 1000;
        const speed = uploadedSize / elapsedTime; // bytes per second
        const remainingSize = this.currentUpload.fileSize - uploadedSize;
        const remainingTime = remainingSize / speed;

        // 更新进度条
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('progress-text').textContent = Math.round(progress) + '%';

        // 更新上传详情
        document.getElementById('upload-speed').textContent = this.formatBytes(speed) + '/s';
        document.getElementById('upload-size').textContent = 
            `${this.formatBytes(uploadedSize)} / ${this.formatBytes(this.currentUpload.fileSize)}`;
        document.getElementById('time-remaining').textContent = 
            `剩余时间: ${this.formatTime(remainingTime)}`;
    }

    // 暂停上传
    pauseUpload() {
        this.isUploading = false;
        document.getElementById('pause-upload').textContent = '继续';
        document.getElementById('pause-upload').onclick = () => this.resumeUpload();
    }

    // 继续上传
    resumeUpload() {
        this.isUploading = true;
        document.getElementById('pause-upload').textContent = '暂停';
        document.getElementById('pause-upload').onclick = () => this.pauseUpload();
        this.uploadFile();
    }

    // 取消上传
    cancelUpload() {
        this.isUploading = false;
        this.resetUploadState();
    }

    // 格式化字节大小
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 格式化时间
    formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0) return '--';
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}时${minutes}分${secs}秒`;
        } else if (minutes > 0) {
            return `${minutes}分${secs}秒`;
        } else {
            return `${secs}秒`;
        }
    }

    // 延迟函数
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 全局视频上传器实例
const videoUploader = new VideoUploader();

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    videoUploader.init();
});

// 导出给其他文件使用
window.videoUploader = videoUploader; 