/**
 * Cloudflare Worker for Love Story User Authentication
 * 提供用户注册、登录、验证等功能
 */

import { Router } from 'itty-router';

const router = Router();

// CORS 配置
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// 密码加密工具（简单的哈希，生产环境建议使用 bcrypt）
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// HMAC SHA256 签名
async function hmacSha256(message, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// 获取密钥（从环境变量或使用默认值）
function getSecret(env) {
  return env?.JWT_SECRET || 'love-story-secret-key-change-in-production';
}

// 生成 JWT Token
async function generateToken(userId, username, env) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    userId: userId,
    username: username,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7天过期
  };

  const secret = getSecret(env);

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  const signature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, secret);

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// 验证 JWT Token
async function verifyToken(token, env) {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      return null;
    }

    const secret = getSecret(env);
    const expectedSignature = await hmacSha256(`${encodedHeader}.${encodedPayload}`, secret);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(atob(encodedPayload));

    // 检查过期时间
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

// 处理 OPTIONS 请求（CORS 预检）
router.options('*', () => {
  return new Response(null, { headers: CORS_HEADERS });
});

// 健康检查
router.get('/', () => {
  return Response.json({
    status: 'ok',
    message: 'Love Story API is running',
    version: '1.0.0'
  });
});

// ==================== 用户注册 ====================
router.post('/api/auth/register', async (request, env) => {
  try {
    const { username, email, password } = await request.json();

    // 验证输入
    if (!username || !email || !password) {
      return Response.json({
        success: false,
        message: '用户名、邮箱和密码不能为空'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({
        success: false,
        message: '邮箱格式不正确'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 验证密码长度
    if (password.length < 6) {
      return Response.json({
        success: false,
        message: '密码长度至少为6位'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 检查用户名是否已存在
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE username = ? OR email = ?'
    ).bind(username, email).first();

    if (existingUser) {
      return Response.json({
        success: false,
        message: '用户名或邮箱已被注册'
      }, { status: 409, headers: CORS_HEADERS });
    }

    // 加密密码
    const hashedPassword = await hashPassword(password);

    // 创建用户
    const result = await env.DB.prepare(
      'INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, datetime("now"))'
    ).bind(username, email, hashedPassword).run();

    if (!result.success) {
      return Response.json({
        success: false,
        message: '注册失败，请稍后重试'
      }, { status: 500, headers: CORS_HEADERS });
    }

    // 获取新创建的用户 ID
    const newUser = await env.DB.prepare(
      'SELECT id, username, email, created_at FROM users WHERE username = ?'
    ).bind(username).first();

    // 生成 Token
    const token = await generateToken(newUser.id, newUser.username, env);

    return Response.json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.created_at
        },
        token: token
      }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Register error:', error);
    return Response.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500, headers: CORS_HEADERS });
  }
});

// ==================== 用户登录 ====================
router.post('/api/auth/login', async (request, env) => {
  try {
    const { username, password } = await request.json();

    // 验证输入
    if (!username || !password) {
      return Response.json({
        success: false,
        message: '用户名和密码不能为空'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 查找用户
    const user = await env.DB.prepare(
      'SELECT id, username, email, password FROM users WHERE username = ? OR email = ?'
    ).bind(username, username).first();

    if (!user) {
      return Response.json({
        success: false,
        message: '用户名或密码错误'
      }, { status: 401, headers: CORS_HEADERS });
    }

    // 验证密码
    const hashedPassword = await hashPassword(password);
    if (user.password !== hashedPassword) {
      return Response.json({
        success: false,
        message: '用户名或密码错误'
      }, { status: 401, headers: CORS_HEADERS });
    }

    // 生成 Token
    const token = await generateToken(user.id, user.username, env);

    // 更新最后登录时间
    await env.DB.prepare(
      'UPDATE users SET last_login = datetime("now") WHERE id = ?'
    ).bind(user.id).run();

    return Response.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token: token
      }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500, headers: CORS_HEADERS });
  }
});

// ==================== 验证 Token ====================
router.get('/api/auth/verify', async (request, env) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({
        success: false,
        message: '未提供有效的认证令牌'
      }, { status: 401, headers: CORS_HEADERS });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, env);

    if (!payload) {
      return Response.json({
        success: false,
        message: '令牌无效或已过期'
      }, { status: 401, headers: CORS_HEADERS });
    }

    // 从数据库获取用户信息
    const user = await env.DB.prepare(
      'SELECT id, username, email, created_at FROM users WHERE id = ?'
    ).bind(payload.userId).first();

    if (!user) {
      return Response.json({
        success: false,
        message: '用户不存在'
      }, { status: 404, headers: CORS_HEADERS });
    }

    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at
        }
      }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Verify error:', error);
    return Response.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500, headers: CORS_HEADERS });
  }
});

// ==================== 获取用户信息 ====================
router.get('/api/user/profile', async (request, env) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({
        success: false,
        message: '未提供有效的认证令牌'
      }, { status: 401, headers: CORS_HEADERS });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, env);

    if (!payload) {
      return Response.json({
        success: false,
        message: '令牌无效或已过期'
      }, { status: 401, headers: CORS_HEADERS });
    }

    // 获取用户信息
    const user = await env.DB.prepare(
      'SELECT id, username, email, created_at, last_login FROM users WHERE id = ?'
    ).bind(payload.userId).first();

    if (!user) {
      return Response.json({
        success: false,
        message: '用户不存在'
      }, { status: 404, headers: CORS_HEADERS });
    }

    return Response.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          createdAt: user.created_at,
          lastLogin: user.last_login
        }
      }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500, headers: CORS_HEADERS });
  }
});

// ==================== 更新用户信息 ====================
router.put('/api/user/profile', async (request, env) => {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json({
        success: false,
        message: '未提供有效的认证令牌'
      }, { status: 401, headers: CORS_HEADERS });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, env);

    if (!payload) {
      return Response.json({
        success: false,
        message: '令牌无效或已过期'
      }, { status: 401, headers: CORS_HEADERS });
    }

    const { email } = await request.json();

    if (!email) {
      return Response.json({
        success: false,
        message: '邮箱不能为空'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({
        success: false,
        message: '邮箱格式不正确'
      }, { status: 400, headers: CORS_HEADERS });
    }

    // 检查邮箱是否被其他用户使用
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ? AND id != ?'
    ).bind(email, payload.userId).first();

    if (existingUser) {
      return Response.json({
        success: false,
        message: '该邮箱已被其他用户使用'
      }, { status: 409, headers: CORS_HEADERS });
    }

    // 更新用户信息
    await env.DB.prepare(
      'UPDATE users SET email = ? WHERE id = ?'
    ).bind(email, payload.userId).run();

    return Response.json({
      success: true,
      message: '更新成功',
      data: {
        user: {
          id: payload.userId,
          username: payload.username,
          email: email
        }
      }
    }, { headers: CORS_HEADERS });

  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json({
      success: false,
      message: '服务器错误，请稍后重试'
    }, { status: 500, headers: CORS_HEADERS });
  }
});

// ==================== 404 处理 ====================
router.all('*', () => {
  return Response.json({
    success: false,
    message: 'API 路由不存在'
  }, { status: 404, headers: CORS_HEADERS });
});

// 导出 Worker
export default {
  fetch: (request, env, ctx) => router.handle(request, env, ctx)
};
