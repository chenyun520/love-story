/**
 * 访客留言展示模块
 */
class VisitorMessages {
    constructor() {
        this.messages = [
            {
                content: '祝福长长久久',
                author: '匿名访客',
                date: '2025-05-20'
            },
            {
                content: '愿你们幸福美满',
                author: '来自上海的朋友',
                date: '2025-05-21'
            },
            {
                content: '百年好合',
                author: '天津好友',
                date: '2025-05-22'
            }
        ];
        
        this.isExpanded = false;
        this.currentMessageIndex = 0;
        this.init();
    }

    init() {
        const panel = document.createElement('div');
        panel.className = 'visitor-messages-panel';
        panel.innerHTML = `
            <div class="panel-toggle">
                <i class="fas fa-chevron-right"></i>
                <span>留言板</span>
            </div>
            <div class="messages-container">
                <div class="messages-header">
                    <h3>💌 温馨留言板</h3>
                </div>
                <div class="messages-content">
                    <div class="message-wrapper"></div>
                </div>
                <div class="messages-footer">
                    <p>💝 想要留言？点击下方邮箱告诉我们</p>
                    <button class="email-button">
                        <i class="fas fa-envelope"></i>
                        发送留言
                    </button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .visitor-messages-panel {
                position: fixed;
                right: -300px;
                top: 50%;
                transform: translateY(-50%);
                width: 300px;
                z-index: 999;
                font-family: 'Microsoft YaHei', sans-serif;
                display: flex;
                transition: right 0.3s ease;
            }

            .visitor-messages-panel.expanded {
                right: 0;
            }

            .panel-toggle {
                position: relative;
                left: -60px;
                background: linear-gradient(135deg, #FF9A9E, #FAD0C4);
                color: white;
                padding: 20px 15px;
                cursor: pointer;
                border-radius: 15px 0 0 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 12px;
                box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
            }

            .panel-toggle:hover {
                left: -65px;
                padding-right: 20px;
                background: linear-gradient(135deg, #FFB6C1, #FF9A9E);
            }

            .panel-toggle span {
                writing-mode: vertical-lr;
                text-orientation: mixed;
                font-size: 18px;
                font-weight: bold;
                letter-spacing: 2px;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }

            .panel-toggle i {
                font-size: 24px;
                transition: transform 0.3s ease;
                color: white;
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
            }

            .visitor-messages-panel.expanded .panel-toggle {
                left: -60px;
            }

            .visitor-messages-panel.expanded .panel-toggle i {
                transform: rotate(180deg);
            }

            .messages-container {
                background: white;
                border-radius: 15px 0 0 15px;
                box-shadow: -2px 0 20px rgba(0, 0, 0, 0.1);
                overflow: hidden;
                flex: 1;
                border: 1px solid rgba(255, 154, 158, 0.2);
            }

            .messages-header {
                background: linear-gradient(135deg, #FF9A9E, #FAD0C4);
                color: white;
                padding: 15px 20px;
                text-align: center;
            }

            .messages-header h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }

            .messages-content {
                padding: 20px;
                height: 300px;
                position: relative;
                overflow: hidden;
            }

            .message-wrapper {
                position: absolute;
                width: 100%;
                transition: opacity 0.5s ease;
            }

            .message-item {
                background: #f8f9fa;
                border-radius: 10px;
                padding: 15px;
                margin-bottom: 15px;
                border: 1px solid #e9ecef;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s ease;
            }

            .message-item.active {
                opacity: 1;
                transform: translateY(0);
            }

            .message-text {
                color: #1a73e8;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 10px;
                font-weight: bold;
            }

            .message-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: #666;
                font-size: 13px;
            }

            .message-author {
                color: #FF9A9E;
                font-weight: 500;
            }

            .messages-footer {
                padding: 15px;
                text-align: center;
                background: #f8f9fa;
                border-top: 1px solid #eee;
            }

            .messages-footer p {
                margin: 0 0 10px;
                color: #666;
                font-size: 14px;
            }

            .email-button {
                background: linear-gradient(135deg, #FF9A9E, #FAD0C4);
                color: white;
                border: none;
                padding: 8px 20px;
                border-radius: 20px;
                cursor: pointer;
                font-size: 14px;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                transition: transform 0.2s;
            }

            .email-button:hover {
                transform: scale(1.05);
            }

            .email-button i {
                font-size: 16px;
            }

            @media (max-width: 768px) {
                .visitor-messages-panel {
                    width: 280px;
                    right: -280px;
                }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(panel);

        // 绑定展开/收起事件
        const toggle = panel.querySelector('.panel-toggle');
        toggle.addEventListener('click', () => {
            this.isExpanded = !this.isExpanded;
            panel.classList.toggle('expanded', this.isExpanded);
        });

        // 绑定邮箱点击事件
        const emailButton = panel.querySelector('.email-button');
        emailButton.addEventListener('click', () => {
            const emailLink = document.querySelector('.email-link');
            if (emailLink) {
                emailLink.click();
            }
        });

        this.messageWrapper = panel.querySelector('.message-wrapper');
        this.startMessageRotation();
    }

    startMessageRotation() {
        const showMessage = () => {
            const message = this.messages[this.currentMessageIndex];
            
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item';
            messageElement.innerHTML = `
                <div class="message-text">${message.content}</div>
                <div class="message-info">
                    <span class="message-author">——${message.author}</span>
                    <span class="message-date">${message.date}</span>
                </div>
            `;

            this.messageWrapper.innerHTML = '';
            this.messageWrapper.appendChild(messageElement);

            // 触发动画
            setTimeout(() => {
                messageElement.classList.add('active');
            }, 50);

            // 更新索引
            this.currentMessageIndex = (this.currentMessageIndex + 1) % this.messages.length;
        };

        // 初始显示
        showMessage();

        // 定时切换消息
        setInterval(showMessage, 4000);
    }
}

// 初始化访客留言
document.addEventListener('DOMContentLoaded', () => {
    new VisitorMessages();
}); 