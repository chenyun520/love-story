/**
 * 悄悄话模块
 */
class SecretNotes {
    constructor() {
        this.notes = {
            burger: {
                password: '123456',
                title: '汉堡的悄悄话',
                messages: [
                    '今天和大头一起去吃火锅啦~',
                    '大头今天穿得好可爱',
                    '和大头一起看电影真开心',
                    // 可以继续添加更多消息
                ]
            },
            cat: {
                password: '123456',
                title: '大头的悄悄话',
                messages: [
                    '汉堡今天请我吃好吃的~',
                    '和汉堡一起看日落',
                    '汉堡今天也很可爱呢',
                    // 可以继续添加更多消息
                ]
            }
        };
        
        this.container = document.createElement('div');
        this.container.className = 'secret-notes-container';
        document.getElementById('city-map').after(this.container);
        this.init();
    }

    init() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="secret-notes-section">
                <h2>悄悄话本本</h2>
                <p>点击图标输入密码查看悄悄话~</p>
                <div class="notes-grid">
                    <div class="note-item burger" data-type="burger">
                        <div class="note-cover">
                            <span class="note-icon">🍔</span>
                            <p>汉堡的秘密</p>
                        </div>
                    </div>
                    <div class="note-item cat" data-type="cat">
                        <div class="note-cover">
                            <img src="images/大头的猫.jpg" alt="大头的猫" class="cat-icon">
                            <p>大头的秘密</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .secret-notes-section {
                margin: 30px 0;
                padding: 20px;
                background: #fff;
                border-radius: 15px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }

            .secret-notes-section h2 {
                color: #333;
                text-align: center;
                margin-bottom: 10px;
            }

            .secret-notes-section p {
                color: #666;
                text-align: center;
                margin-bottom: 20px;
            }

            .notes-grid {
                display: flex;
                justify-content: center;
                gap: 30px;
            }

            .note-item {
                width: 150px;
                height: 200px;
                cursor: pointer;
                perspective: 1000px;
                transition: transform 0.3s;
            }

            .note-item:hover {
                transform: translateY(-5px);
            }

            .note-cover {
                width: 100%;
                height: 100%;
                background: #fff;
                border-radius: 10px;
                box-shadow: 0 2px 15px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                text-align: center;
            }

            .note-icon {
                font-size: 50px;
                margin-bottom: 15px;
            }

            .cat-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                margin-bottom: 15px;
                object-fit: cover;
            }

            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s;
            }

            .password-modal {
                background: #fff;
                padding: 20px;
                border-radius: 10px;
                text-align: center;
                transform: scale(0.8);
                transition: transform 0.3s;
            }

            .password-modal.active {
                transform: scale(1);
            }

            .modal-overlay.active {
                opacity: 1;
            }

            .password-input {
                margin: 15px 0;
                padding: 10px;
                border: 2px solid #ddd;
                border-radius: 5px;
                width: 200px;
                text-align: center;
                font-size: 16px;
            }

            .submit-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s;
            }

            .submit-btn:hover {
                background: #45a049;
            }

            .diary {
                background: #fff;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 5px 20px rgba(0,0,0,0.2);
                max-width: 400px;
                width: 90%;
                transform: rotateX(90deg);
                transition: transform 0.6s;
                transform-origin: top;
            }

            .diary.open {
                transform: rotateX(0);
            }

            .diary-content {
                font-family: 'Comic Sans MS', cursive;
                color: #333;
            }

            .diary-message {
                margin: 10px 0;
                padding: 10px;
                background: #f9f9f9;
                border-radius: 5px;
                font-size: 16px;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }

    initEventListeners() {
        const noteItems = this.container.querySelectorAll('.note-item');
        noteItems.forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                this.showPasswordModal(type);
            });
        });
    }

    showPasswordModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="password-modal">
                <h3>${type === 'burger' ? '汉堡' : '大头'}的密码</h3>
                <input type="password" class="password-input" placeholder="请输入密码">
                <button class="submit-btn">确认</button>
            </div>
        `;

        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.password-modal').classList.add('active');
        }, 10);

        const input = modal.querySelector('.password-input');
        const submitBtn = modal.querySelector('.submit-btn');

        const checkPassword = () => {
            const password = input.value;
            if (password === this.notes[type].password) {
                this.showDiary(type);
                modal.remove();
            } else {
                alert('密码错误，请重试！');
                input.value = '';
            }
        };

        submitBtn.addEventListener('click', checkPassword);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    showDiary(type) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="diary">
                <h3>${this.notes[type].title}</h3>
                <div class="diary-content">
                    ${this.notes[type].messages.map(msg => `
                        <div class="diary-message">${msg}</div>
                    `).join('')}
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.classList.add('active');
            modal.querySelector('.diary').classList.add('open');
        }, 10);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.querySelector('.diary').classList.remove('open');
                setTimeout(() => modal.remove(), 600);
            }
        });
    }
}

// 初始化悄悄话模块
document.addEventListener('DOMContentLoaded', () => {
    new SecretNotes();
}); 