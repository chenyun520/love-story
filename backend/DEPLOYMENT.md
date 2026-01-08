# Love Story 账号系统部署指南

本指南将帮助你完整部署 Love Story 的用户注册和登录系统。

## 📋 前置要求

- Cloudflare 账号（免费即可）
- Node.js 和 npm（本地开发需要）
- Git（用于版本控制）

## 🚀 部署步骤

### 第一步：安装 Cloudflare Workers CLI

在本地终端执行：

```bash
npm install -g wrangler
```

登录 Cloudflare：

```bash
wrangler login
```

### 第二步：创建 D1 数据库

#### 1. 创建生产环境数据库

```bash
# 创建数据库
wrangler d1 create love-story-db

# 记录返回的 database_id，类似：
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

#### 2. 创建开发环境数据库（可选）

```bash
# 创建开发数据库
wrangler d1 create love-story-db-dev

# 同样记录返回的 database_id
```

### 第三步：配置项目

#### 1. 更新 `backend/wrangler.toml`

将 `wrangler.toml` 中的 `YOUR_DATABASE_ID` 替换为实际的数据库 ID：

```toml
[[d1_databases]]
binding = "DB"
database_name = "love-story-db"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"  # 替换这里

[env.development]
name = "love-story-api-dev"

[[env.development.d1_databases]]
binding = "DB"
database_name = "love-story-db-dev"
database_id = "yyyyyyyy-yyyy-yyyy-yyyy-yyyyyyyyyyyy"  # 替换这里（开发环境）
```

#### 2. 设置环境变量（可选）

如果需要设置 JWT 密钥：

```bash
# 在 Cloudflare Dashboard 中设置，或者使用 wrangler secret
wrangler secret put JWT_SECRET
# 输入你的密钥（建议使用强随机字符串）
```

### 第四步：初始化数据库

#### 1. 初始化生产环境数据库

```bash
# 进入 backend 目录
cd backend

# 执行数据库初始化脚本
wrangler d1 execute love-story-db --file=schema.sql
```

#### 2. 初始化开发环境数据库（可选）

```bash
wrangler d1 execute love-story-db-dev --file=schema.sql
```

#### 3. 验证数据库创建

```bash
# 查看数据库表
wrangler d1 execute love-story-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

你应该看到以下表：
- users
- user_sessions
- comments
- likes
- game_progress

### 第五步：安装依赖

```bash
# 在 backend 目录
npm install
```

### 第六步：本地测试（可选）

```bash
# 启动本地开发服务器
npm run dev

# 或者
wrangler dev
```

访问 `http://localhost:8787` 测试 API。

### 第七步：部署到 Cloudflare

```bash
# 部署生产环境
npm run deploy

# 或者
wrangler deploy
```

部署成功后，你会看到类似输出：

```
✨ Success! Uploaded worker
✨ Deployed at https://love-story-api.YOUR_SUBDOMAIN.workers.dev
```

**重要：记录这个 URL，稍后配置前端时需要用到！**

### 第八步：配置前端

#### 1. 更新 `js/auth.js`

打开 `js/auth.js`，修改 API URL：

```javascript
this.apiBaseUrl = 'https://love-story-api.YOUR_SUBDOMAIN.workers.dev'; // 替换为你的 Worker URL
```

#### 2. 在 `index.html` 中配置（可选验证）

打开 `index.html`，取消注释并更新 URL：

```javascript
// 配置 API 地址（部署后需要修改为实际的 Worker URL）
authService.setApiUrl('https://love-story-api.YOUR_SUBDOMAIN.workers.dev');
```

#### 3. 部署前端

前端已经部署在 GitHub Pages 和 Cloudflare Pages，直接推送代码即可：

```bash
git add .
git commit -m "Add user authentication system"
git push
```

Cloudflare Pages 会自动重新部署。

### 第九步：测试功能

#### 1. 测试注册

1. 访问 `https://love-story-ehe.pages.dev/`
2. 点击 "📝 账号登录/注册"
3. 在注册页面填写：
   - 用户名：testuser
   - 邮箱：test@example.com
   - 密码：123456
   - 确认密码：123456
4. 点击 "注册"

#### 2. 测试登录

1. 退出登录（刷新页面）
2. 点击 "📝 账号登录/注册"
3. 输入刚才注册的用户名和密码
4. 点击 "登录"

#### 3. 测试 API 直接调用

使用 curl 或 Postman 测试：

```bash
# 注册
curl -X POST https://love-story-api.YOUR_SUBDOMAIN.workers.dev/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"123456"}'

# 登录
curl -X POST https://love-story-api.YOUR_SUBDOMAIN.workers.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"123456"}'
```

## 🔧 管理数据库

### 查看用户列表

```bash
wrangler d1 execute love-story-db --command "SELECT id, username, email, created_at FROM users;"
```

### 删除用户

```bash
wrangler d1 execute love-story-db --command "DELETE FROM users WHERE username = 'testuser';"
```

### 查看游戏进度

```bash
wrangler d1 execute love-story-db --command "SELECT * FROM game_progress WHERE user_id = 1;"
```

## 🔒 安全建议

### 1. 修改 JWT 密钥

生产环境务必使用强密钥：

```bash
wrangler secret put JWT_SECRET
# 输入一个 32 字符以上的随机字符串
```

### 2. 启用 CORS 限制

在 `wrangler.toml` 中限制允许的前端域名：

```toml
[env.production.vars]
ALLOWED_ORIGINS = "https://love-story-ehe.pages.dev"
```

然后修改 `worker.js` 中的 CORS 配置使用这个环境变量。

### 3. 定期备份数据库

```bash
# 导出数据库
wrangler d1 export love-story-db --output=backup.sql
```

## 📊 监控和日志

### 查看 Worker 日志

```bash
wrangler tail
```

### 在 Cloudflare Dashboard 查看

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages
3. 选择 `love-story-api`
4. 查看 Logs、Metrics 等

## 🐛 常见问题

### 问题1：CORS 错误

**症状**：前端调用 API 时出现跨域错误。

**解决方案**：
- 确保后端 CORS 配置正确
- 检查 `ALLOWED_ORIGINS` 是否包含前端域名
- 确保 Worker 已正确部署

### 问题2：数据库连接失败

**症状**：API 返回 500 错误，日志显示数据库错误。

**解决方案**：
- 检查 `wrangler.toml` 中的 database_id 是否正确
- 确认数据库已创建并初始化
- 运行 `wrangler d1 list` 查看所有数据库

### 问题3：Token 验证失败

**症状**：登录后刷新页面，提示未登录。

**解决方案**：
- 检查 JWT_SECRET 是否设置
- 确认浏览器 localStorage 能正常存储
- 查看浏览器控制台错误信息

### 问题4：部署失败

**症状**：`wrangler deploy` 返回错误。

**解决方案**：
```bash
# 检查 wrangler 版本
wrangler --version

# 更新 wrangler
npm update -g wrangler

# 清除缓存并重新安装
cd backend
rm -rf node_modules package-lock.json
npm install
```

## 📝 API 文档

### 注册接口

**请求**：
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

**响应**：
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-01-01 00:00:00"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 登录接口

**请求**：
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "123456"
}
```

**响应**：
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 验证 Token 接口

**请求**：
```http
GET /api/auth/verify
Authorization: Bearer <token>
```

**响应**：
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "createdAt": "2024-01-01 00:00:00"
    }
  }
}
```

## 🎯 下一步

账号系统部署完成后，你可以继续实现：

1. **评论功能**：用户可以在漫画和游戏页面评论
2. **点赞系统**：用户可以喜欢评论和内容
3. **游戏进度同步**：将游戏进度保存到云端
4. **用户资料页**：查看和编辑用户信息
5. **社交功能**：用户之间可以互动

详细实现请参考后续文档！

## 📞 技术支持

如果遇到问题：
1. 检查本文档的 "常见问题" 部分
2. 查看 Cloudflare Workers 官方文档：https://developers.cloudflare.com/workers/
3. 提交 Issue 到项目仓库

---

**祝部署顺利！** 💕
