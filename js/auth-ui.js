/**
 * 认证界面管理
 * 处理注册、登录界面的显示和交互
 */

class AuthUI {
  constructor(authService) {
    this.authService = authService;
    this.modals = {};
    this.initModals();
  }

  /**
   * 初始化模态框
   */
  initModals() {
    // 如果模态框不存在，创建它们
    if (!document.getElementById('authModals')) {
      this.createModals();
    }
  }

  /**
   * 创建认证模态框
   */
  createModals() {
    const modalHTML = `
      <div id="authModals">
        <!-- 登录模态框 -->
        <div id="loginModal" class="auth-modal">
          <div class="auth-modal-content">
            <button class="auth-modal-close" onclick="authUI.closeModal('login')">&times;</button>
            <div class="auth-header">
              <h2>欢迎回来</h2>
              <p>登录以访问 Love Story</p>
            </div>
            <form id="loginForm" class="auth-form">
              <div class="auth-input-group">
                <input type="text" id="loginUsername" placeholder="用户名或邮箱" required>
              </div>
              <div class="auth-input-group">
                <input type="password" id="loginPassword" placeholder="密码" required>
              </div>
              <div id="loginError" class="auth-error"></div>
              <button type="submit" class="auth-btn">登录</button>
            </form>
            <div class="auth-footer">
              <p>还没有账号？ <a href="#" onclick="authUI.showModal('register'); authUI.closeModal('login'); return false;">立即注册</a></p>
            </div>
          </div>
        </div>

        <!-- 注册模态框 -->
        <div id="registerModal" class="auth-modal">
          <div class="auth-modal-content">
            <button class="auth-modal-close" onclick="authUI.closeModal('register')">&times;</button>
            <div class="auth-header">
              <h2>创建账号</h2>
              <p>注册以加入 Love Story</p>
            </div>
            <form id="registerForm" class="auth-form">
              <div class="auth-input-group">
                <input type="text" id="registerUsername" placeholder="用户名" required minlength="3">
              </div>
              <div class="auth-input-group">
                <input type="email" id="registerEmail" placeholder="邮箱" required>
              </div>
              <div class="auth-input-group">
                <input type="password" id="registerPassword" placeholder="密码（至少6位）" required minlength="6">
              </div>
              <div class="auth-input-group">
                <input type="password" id="registerPasswordConfirm" placeholder="确认密码" required minlength="6">
              </div>
              <div id="registerError" class="auth-error"></div>
              <button type="submit" class="auth-btn">注册</button>
            </form>
            <div class="auth-footer">
              <p>已有账号？ <a href="#" onclick="authUI.showModal('login'); authUI.closeModal('register'); return false;">立即登录</a></p>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.attachEventListeners();
  }

  /**
   * 绑定事件监听器
   */
  attachEventListeners() {
    // 登录表单
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // 注册表单
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleRegister();
      });
    }

    // 点击模态框背景关闭
    document.querySelectorAll('.auth-modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('auth-modal-show');
        }
      });
    });
  }

  /**
   * 显示登录模态框
   */
  showLogin() {
    this.showModal('login');
  }

  /**
   * 显示注册模态框
   */
  showRegister() {
    this.showModal('register');
  }

  /**
   * 显示模态框
   */
  showModal(type) {
    const modalId = type === 'login' ? 'loginModal' : 'registerModal';
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('auth-modal-show');
    }
  }

  /**
   * 关闭模态框
   */
  closeModal(type) {
    const modalId = type === 'login' ? 'loginModal' : 'registerModal';
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('auth-modal-show');
    }
  }

  /**
   * 处理登录
   */
  async handleLogin() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const errorDiv = document.getElementById('loginError');
    const submitBtn = document.querySelector('#loginForm .auth-btn');

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      errorDiv.textContent = '请填写所有字段';
      return;
    }

    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.textContent = '登录中...';
    errorDiv.textContent = '';

    try {
      const response = await this.authService.login(username, password);

      if (response.success) {
        // 登录成功
        this.closeModal('login');
        this.onLoginSuccess(response.data.user);
      } else {
        // 登录失败
        errorDiv.textContent = response.message;
      }
    } catch (error) {
      errorDiv.textContent = '登录失败，请稍后重试';
      console.error('Login error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '登录';
    }
  }

  /**
   * 处理注册
   */
  async handleRegister() {
    const usernameInput = document.getElementById('registerUsername');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const passwordConfirmInput = document.getElementById('registerPasswordConfirm');
    const errorDiv = document.getElementById('registerError');
    const submitBtn = document.querySelector('#registerForm .auth-btn');

    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    // 验证输入
    if (!username || !email || !password || !passwordConfirm) {
      errorDiv.textContent = '请填写所有字段';
      return;
    }

    if (username.length < 3) {
      errorDiv.textContent = '用户名至少需要3个字符';
      return;
    }

    if (password.length < 6) {
      errorDiv.textContent = '密码至少需要6个字符';
      return;
    }

    if (password !== passwordConfirm) {
      errorDiv.textContent = '两次输入的密码不一致';
      return;
    }

    // 显示加载状态
    submitBtn.disabled = true;
    submitBtn.textContent = '注册中...';
    errorDiv.textContent = '';

    try {
      const response = await this.authService.register(username, email, password);

      if (response.success) {
        // 注册成功
        this.closeModal('register');
        this.onLoginSuccess(response.data.user);
      } else {
        // 注册失败
        errorDiv.textContent = response.message;
      }
    } catch (error) {
      errorDiv.textContent = '注册失败，请稍后重试';
      console.error('Register error:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = '注册';
    }
  }

  /**
   * 登录成功回调
   */
  onLoginSuccess(user) {
    // 保存登录状态到 sessionStorage（与原有系统兼容）
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('userId', user.id);
    sessionStorage.setItem('username', user.username);

    // 刷新页面或跳转
    if (typeof showTOC === 'function') {
      showTOC(true);
    } else {
      window.location.reload();
    }
  }

  /**
   * 显示用户信息
   */
  showUserInfo() {
    const user = this.authService.getUser();
    if (user) {
      return `欢迎, ${user.username}`;
    }
    return '';
  }

  /**
   * 登出
   */
  logout() {
    this.authService.logout();
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('username');
    window.location.reload();
  }
}

// 创建全局实例
const authUI = new AuthUI(authService);

// 导出为全局对象
window.AuthUI = AuthUI;
window.authUI = authUI;
