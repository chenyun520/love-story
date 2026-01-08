/**
 * API 测试脚本
 * 用于测试 Cloudflare Workers API 是否正常工作
 */

const API_BASE_URL = 'https://love-story-api.YOUR_SUBDOMAIN.workers.dev'; // 替换为你的 Worker URL

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

// 测试函数
async function testAPI() {
  log('\n=== Love Story API 测试 ===\n', 'blue');

  // 1. 健康检查
  log('\n1. 健康检查...', 'yellow');
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();
    if (data.status === 'ok') {
      success('API 运行正常');
      info(`版本: ${data.version}`);
    } else {
      error('API 响应异常');
      return;
    }
  } catch (err) {
    error('无法连接到 API');
    error(`错误: ${err.message}`);
    return;
  }

  // 2. 注册测试用户
  log('\n2. 测试用户注册...', 'yellow');
  const testUser = {
    username: `test_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'test123456'
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const data = await response.json();

    if (data.success) {
      success('注册成功');
      info(`用户 ID: ${data.data.user.id}`);
      info(`用户名: ${data.data.user.username}`);
      info(`Token: ${data.data.token.substring(0, 20)}...`);

      // 保存 token 用于后续测试
      const token = data.data.token;
      const userId = data.data.user.id;

      // 3. 登录测试
      log('\n3. 测试用户登录...', 'yellow');
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testUser.username,
          password: testUser.password
        })
      });
      const loginData = await loginResponse.json();

      if (loginData.success) {
        success('登录成功');
        info(`收到新 Token`);
      } else {
        error('登录失败');
        error(`错误: ${loginData.message}`);
      }

      // 4. Token 验证测试
      log('\n4. 测试 Token 验证...', 'yellow');
      const verifyResponse = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const verifyData = await verifyResponse.json();

      if (verifyData.success) {
        success('Token 验证成功');
        info(`用户: ${verifyData.data.user.username}`);
      } else {
        error('Token 验证失败');
        error(`错误: ${verifyData.message}`);
      }

      // 5. 获取用户资料
      log('\n5. 测试获取用户资料...', 'yellow');
      const profileResponse = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const profileData = await profileResponse.json();

      if (profileData.success) {
        success('获取用户资料成功');
        info(`邮箱: ${profileData.data.user.email}`);
        info(`注册时间: ${profileData.data.user.createdAt}`);
      } else {
        error('获取用户资料失败');
        error(`错误: ${profileData.message}`);
      }

      // 6. 测试错误情况 - 重复注册
      log('\n6. 测试重复注册（应该失败）...', 'yellow');
      const duplicateResponse = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      });
      const duplicateData = await duplicateResponse.json();

      if (!duplicateData.success) {
        success('正确拒绝了重复注册');
        info(`错误信息: ${duplicateData.message}`);
      } else {
        error('允许了重复注册（这是 bug）`);
      }

      // 7. 测试错误情况 - 错误密码
      log('\n7. 测试错误密码登录（应该失败）...', 'yellow');
      const wrongPasswordResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testUser.username,
          password: 'wrongpassword'
        })
      });
      const wrongPasswordData = await wrongPasswordResponse.json();

      if (!wrongPasswordData.success) {
        success('正确拒绝了错误密码');
        info(`错误信息: ${wrongPasswordData.message}`);
      } else {
        error('允许了错误密码（这是 bug）`);
      }

    } else {
      error('注册失败');
      error(`错误: ${data.message}`);
    }
  } catch (err) {
    error('请求失败');
    error(`错误: ${err.message}`);
  }

  log('\n=== 测试完成 ===\n', 'blue');
}

// 运行测试
testAPI().catch(err => {
  error('测试脚本出错');
  error(`${err.message}`);
  process.exit(1);
});
