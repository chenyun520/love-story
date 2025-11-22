// 用户认证模块
(function() {
    'use strict';

    // 存储键名
    const STORAGE_KEY_USERS = 'sheepToolGameUsers';
    const STORAGE_KEY_CURRENT_USER = 'sheepToolGameCurrentUser';

    // DOM 元素
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const btnLogin = document.getElementById('btnLogin');
    const btnLogout = document.getElementById('btnLogout');
    const userInfo = document.getElementById('userInfo');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const authTitle = document.getElementById('authTitle');
    const authSubtitle = document.getElementById('authSubtitle');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    // 工具函数：获取所有用户
    function getAllUsers() {
        try {
            const usersJson = localStorage.getItem(STORAGE_KEY_USERS);
            return usersJson ? JSON.parse(usersJson) : {};
        } catch (e) {
            console.error('读取用户数据失败:', e);
            return {};
        }
    }

    // 工具函数：保存所有用户
    function saveAllUsers(users) {
        try {
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
            return true;
        } catch (e) {
            console.error('保存用户数据失败:', e);
            return false;
        }
    }

    // 工具函数：获取当前用户
    function getCurrentUser() {
        try {
            const userJson = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
            return userJson ? JSON.parse(userJson) : null;
        } catch (e) {
            return null;
        }
    }

    // 工具函数：设置当前用户
    function setCurrentUser(user) {
        try {
            if (user) {
                localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(user));
            } else {
                localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
            }
            return true;
        } catch (e) {
            console.error('设置当前用户失败:', e);
            return false;
        }
    }

    // 简单的密码哈希（实际项目中应使用更安全的方法）
    function hashPassword(password) {
        // 简单的哈希函数（仅用于演示，生产环境应使用更安全的方法）
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return hash.toString(36);
    }

    // 显示错误信息
    function showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
            setTimeout(() => {
                element.style.display = 'none';
            }, 5000);
        }
    }

    // 切换登录/注册表单
    function switchToLoginForm() {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        authTitle.textContent = '登录';
        authSubtitle.textContent = '登录以保存和读取你的游戏进度';
        loginError.style.display = 'none';
        registerError.style.display = 'none';
        loginForm.reset();
    }

    function switchToRegisterForm() {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        authTitle.textContent = '注册';
        authSubtitle.textContent = '创建账号以保存你的游戏进度';
        loginError.style.display = 'none';
        registerError.style.display = 'none';
        registerForm.reset();
    }

    // 注册功能
    function handleRegister(e) {
        e.preventDefault();
        registerError.style.display = 'none';

        const username = document.getElementById('registerUsername').value.trim();
        const password = document.getElementById('registerPassword').value;
        const passwordConfirm = document.getElementById('registerPasswordConfirm').value;

        // 验证输入
        if (username.length < 3 || username.length > 20) {
            showError(registerError, '用户名长度必须在3-20个字符之间');
            return;
        }

        if (password.length < 6) {
            showError(registerError, '密码长度至少为6个字符');
            return;
        }

        if (password !== passwordConfirm) {
            showError(registerError, '两次输入的密码不一致');
            return;
        }

        // 检查用户名是否已存在
        const users = getAllUsers();
        if (users[username]) {
            showError(registerError, '该用户名已被注册，请选择其他用户名');
            return;
        }

        // 创建新用户
        const hashedPassword = hashPassword(password);
        users[username] = {
            username: username,
            passwordHash: hashedPassword,
            createdAt: new Date().toISOString(),
            progress: {} // 游戏进度
        };

        if (saveAllUsers(users)) {
            // 注册成功，自动登录
            const user = {
                username: username,
                progress: users[username].progress
            };
            setCurrentUser(user);
            updateUI();
            closeAuthModal();
            showToast('注册成功！欢迎 ' + username + '！', 'success');
            // 触发登录状态变化事件
            document.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
        } else {
            showError(registerError, '注册失败，请重试');
        }
    }

    // 登录功能
    function handleLogin(e) {
        e.preventDefault();
        loginError.style.display = 'none';

        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value;

        if (!username || !password) {
            showError(loginError, '请输入用户名和密码');
            return;
        }

        const users = getAllUsers();
        const user = users[username];

        if (!user) {
            showError(loginError, '用户名或密码错误');
            return;
        }

        const hashedPassword = hashPassword(password);
        if (user.passwordHash !== hashedPassword) {
            showError(loginError, '用户名或密码错误');
            return;
        }

        // 登录成功
        const currentUser = {
            username: username,
            progress: user.progress || {}
        };
        setCurrentUser(currentUser);
        updateUI();
        closeAuthModal();
        showToast('欢迎回来，' + username + '！', 'success');
        // 触发登录状态变化事件
        document.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
    }

    // 登出功能
    function handleLogout() {
        if (confirm('确定要退出登录吗？退出后需要重新登录才能保存进度。')) {
            setCurrentUser(null);
            updateUI();
            showToast('已退出登录', 'info');
            // 触发登录状态变化事件
            document.dispatchEvent(new CustomEvent('userLoginStatusChanged'));
        }
    }

    // 打开登录弹窗
    function openAuthModal() {
        switchToLoginForm();
        authModal.setAttribute('aria-hidden', 'false');
    }

    // 关闭登录弹窗
    function closeAuthModal() {
        authModal.setAttribute('aria-hidden', 'true');
        loginForm.reset();
        registerForm.reset();
        loginError.style.display = 'none';
        registerError.style.display = 'none';
    }

    // 更新UI显示
    function updateUI() {
        const currentUser = getCurrentUser();
        if (currentUser) {
            // 显示用户信息
            if (userInfo) userInfo.style.display = 'block';
            if (userNameDisplay) userNameDisplay.textContent = currentUser.username;
            if (btnLogin) btnLogin.style.display = 'none';
        } else {
            // 隐藏用户信息
            if (userInfo) userInfo.style.display = 'none';
            if (btnLogin) btnLogin.style.display = 'inline-flex';
        }
    }

    // 获取当前用户的进度
    function getUserProgress() {
        const currentUser = getCurrentUser();
        if (!currentUser) return null;

        const users = getAllUsers();
        const user = users[currentUser.username];
        return user ? (user.progress || {}) : null;
    }

    // 保存用户进度
    function saveUserProgress(progress) {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            console.warn('未登录，无法保存进度');
            return false;
        }

        const users = getAllUsers();
        if (!users[currentUser.username]) {
            console.error('用户不存在');
            return false;
        }

        users[currentUser.username].progress = progress;
        if (saveAllUsers(users)) {
            // 更新当前用户对象
            currentUser.progress = progress;
            setCurrentUser(currentUser);
            return true;
        }
        return false;
    }

    // 显示提示信息（复用游戏中的toast功能）
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;

        Object.assign(toast.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: type === 'success' ? 'linear-gradient(135deg, #2ecc71, #27ae60)' :
                        type === 'error' ? 'linear-gradient(135deg, #e74c3c, #c0392b)' :
                        'linear-gradient(135deg, var(--brand), var(--brand-2))',
            color: '#fff',
            padding: '16px 24px',
            borderRadius: '12px',
            fontSize: '1.1rem',
            fontWeight: '700',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            zIndex: '10000',
            animation: 'toastSlideIn 0.4s ease-out'
        });

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.4s ease-out';
            setTimeout(() => toast.remove(), 400);
        }, 2000);
    }

    // 事件监听
    if (switchToRegister) {
        switchToRegister.addEventListener('click', switchToRegisterForm);
    }
    if (switchToLogin) {
        switchToLogin.addEventListener('click', switchToLoginForm);
    }
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    if (btnLogin) {
        btnLogin.addEventListener('click', openAuthModal);
    }
    if (btnLogout) {
        btnLogout.addEventListener('click', handleLogout);
    }

    // 点击弹窗外部关闭
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                closeAuthModal();
            }
        });
    }

    // 初始化：检查是否已登录
    // 等待DOM加载完成后再初始化UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updateUI();
        });
    } else {
        updateUI();
    }

    // 导出API供main.js使用
    window.AuthSystem = {
        getCurrentUser: getCurrentUser,
        getUserProgress: getUserProgress,
        saveUserProgress: saveUserProgress,
        isLoggedIn: () => getCurrentUser() !== null,
        openAuthModal: openAuthModal
    };

})();

