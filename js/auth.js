/**
 * Love Story 前端认证系统
 * 提供用户注册、登录、验证等功能
 */

class AuthService {
  constructor() {
    // API 基础 URL - 需要根据实际部署地址修改
    this.apiBaseUrl = 'https://love-story-api.gaolujie26.workers.dev'; // 替换为你的 Worker URL
    this.tokenKey = 'love_story_token';
    this.userKey = 'love_story_user';
  }

  /**
   * 设置 API 基础 URL
   */
  setApiUrl(url) {
    this.apiBaseUrl = url;
  }

  /**
   * 获取存储的 Token
   */
  getToken() {
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * 保存 Token
   */
  setToken(token) {
    localStorage.setItem(this.tokenKey, token);
  }

  /**
   * 获取用户信息
   */
  getUser() {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * 保存用户信息
   */
  setUser(user) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  /**
   * 清除认证信息
   */
  clearAuth() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  /**
   * 检查是否已登录
   */
  isLoggedIn() {
    return !!this.getToken();
  }

  /**
   * 发送 API 请求
   */
  async request(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}${endpoint}`;
    const token = this.getToken();

    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  /**
   * 用户注册
   */
  async register(username, email, password) {
    try {
      const response = await this.request('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password })
      });

      if (response.success) {
        // 保存 Token 和用户信息
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || '注册失败，请稍后重试'
      };
    }
  }

  /**
   * 用户登录
   */
  async login(username, password) {
    try {
      const response = await this.request('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });

      if (response.success) {
        // 保存 Token 和用户信息
        this.setToken(response.data.token);
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || '登录失败，请稍后重试'
      };
    }
  }

  /**
   * 验证 Token
   */
  async verifyToken() {
    try {
      const response = await this.request('/api/auth/verify', {
        method: 'GET'
      });

      return response;
    } catch (error) {
      // Token 无效，清除本地存储
      this.clearAuth();
      return {
        success: false,
        message: error.message || '验证失败'
      };
    }
  }

  /**
   * 获取用户资料
   */
  async getProfile() {
    try {
      const response = await this.request('/api/user/profile', {
        method: 'GET'
      });

      if (response.success) {
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || '获取用户信息失败'
      };
    }
  }

  /**
   * 更新用户资料
   */
  async updateProfile(email) {
    try {
      const response = await this.request('/api/user/profile', {
        method: 'PUT',
        body: JSON.stringify({ email })
      });

      if (response.success) {
        this.setUser(response.data.user);
      }

      return response;
    } catch (error) {
      return {
        success: false,
        message: error.message || '更新失败'
      };
    }
  }

  /**
   * 用户登出
   */
  logout() {
    this.clearAuth();
  }
}

// 创建全局实例
const authService = new AuthService();

// 将认证系统导出为全局对象，以便其他页面使用
window.AuthService = AuthService;
window.authService = authService;
