/**
 * 留言区模块
 */
class MessageBoard {
    constructor() {
        this.messages = [
            "欢迎来到我们的爱情小站~",
            "想要给我们留言吗？点击下方邮箱按钮告诉我们吧！",
            "期待听到你的祝福和想法~",
            "每一条留言都会被我们珍藏",
            "让我们一起记录这些美好时刻",
            "你的留言会出现在这里哦~"
        ];
        
        this.container = document.createElement('div');
        this.container.className = 'message-board';
        document.querySelector('footer').before(this.container);
        this.init();
    }

    init() {
        this.render();
        this.startMessageRotation();
    }

    render() {
        this.container.innerHTML = `
            <div class="message-section">
                <div class="message-header">
                    <i class="fas fa-comments"></i>
                    <h3>留言板</h3>
                </div>
                <div class="message-display">
                    <div class="message-content"></div>
                </div>
                <div class="message-hint">
                    <i class="fab fa-tiktok"></i>
                    <p>想要留言？点击下方抖音按钮，私信告诉我们你的想法</p>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .message-board {
                margin: 30px auto;
                max-width: 800px;
                padding: 0 20px;
            }

            .message-section {
                background: linear-gradient(145deg, #ffffff, #f5f5f5);
                border-radius: 20px;
                padding: 25px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                text-align: center;
            }

            .message-header {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 20px;
            }

            .message-header i {
                font-size: 24px;
                color: #FF9A9E;
            }

            .message-header h3 {
                color: #333;
                margin: 0;
                font-size: 20px;
            }

            .message-display {
                background: rgba(255,255,255,0.8);
                border-radius: 15px;
                padding: 20px;
                margin: 15px 0;
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }

            .message-content {
                font-size: 16px;
                color: #666;
                line-height: 1.6;
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s ease;
            }

            .message-content.active {
                opacity: 1;
                transform: translateY(0);
            }

            .message-hint {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
                padding: 10px;
                background: #FFF5F5;
                border-radius: 10px;
                animation: pulse 2s infinite;
            }

            @keyframes pulse {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.02);
                }
                100% {
                    transform: scale(1);
                }
            }

            .message-hint i {
                color: #FF9A9E;
                font-size: 18px;
            }

            .message-hint p {
                margin: 0;
                color: #666;
                font-size: 14px;
            }

            @media (max-width: 768px) {
                .message-board {
                    padding: 0 15px;
                }

                .message-section {
                    padding: 20px;
                }

                .message-content {
                    font-size: 14px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    startMessageRotation() {
        let currentIndex = 0;
        const messageElement = this.container.querySelector('.message-content');

        const updateMessage = () => {
            messageElement.classList.remove('active');
            
            setTimeout(() => {
                messageElement.textContent = this.messages[currentIndex];
                messageElement.classList.add('active');
                
                currentIndex = (currentIndex + 1) % this.messages.length;
            }, 500);
        };

        // 初始显示
        updateMessage();

        // 定时轮换消息
        setInterval(updateMessage, 4000);
    }
}

// 初始化留言板
document.addEventListener('DOMContentLoaded', () => {
    new MessageBoard();
}); 