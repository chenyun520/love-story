# 问题排查助手

本文档包含所有测试代码和命令，可以直接复制执行。

---

## 🔍 步骤 1：测试后端 Worker API

### 方法 A：浏览器测试

**在浏览器地址栏输入：**
```
https://love-story-api.gaolujie26.workers.dev/
```

**预期结果：**
```json
{
  "status": "ok",
  "message": "Love Story API is running",
  "version": "1.0.0"
}
```

**如果看到这个，说明后端正常运行！** ✅

---

### 方法 B：使用 curl 测试

**打开 PowerShell 或 CMD，复制粘贴：**
```bash
curl https://love-story-api.gaolujie26.workers.dev/
```

---

## 📊 步骤 2：检查数据库

### 2.1 查看数据库表

**打开 PowerShell，复制粘贴：**
```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler d1 execute love-story-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

**预期结果：**
```
✅ Successfully executed the command.
name
-------------------------
users
user_sessions
comments
likes
game_progress
```

---

### 2.2 查看所有用户

**复制粘贴：**
```bash
wrangler d1 execute love-story-db --command "SELECT id, username, email, created_at FROM users;"
```

---

### 2.3 删除测试用户（可选）

**如果需要清理测试数据：**
```bash
wrangler d1 execute love-story-db --command "DELETE FROM users WHERE username = 'testuser';"
```

---

## 🧪 步骤 3：测试用户注册 API

### 方法 A：浏览器 Console 测试

1. 打开浏览器访问：`https://love-story-ehe.pages.dev/`
2. 按 `F12` 打开开发者工具
3. 切换到 **Console** 标签
4. **复制粘贴以下代码并按回车：**

```javascript
fetch('https://love-story-api.gaolujie26.workers.dev/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'testuser',
    email: 'test@example.com',
    password: '123456'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ 注册结果:', data);
  if (data.success) {
    console.log('用户 ID:', data.data.user.id);
    console.log('用户名:', data.data.user.username);
    console.log('Token:', data.data.token);
  }
})
.catch(error => {
  console.error('❌ 错误:', error);
});
```

**预期结果：**
```
✅ 注册结果: {success: true, message: "注册成功", data: {...}}
用户 ID: 1
用户名: testuser
Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 方法 B：测试登录 API

**在浏览器 Console 中复制粘贴：**

```javascript
fetch('https://love-story-api.gaolujie26.workers.dev/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'testuser',
    password: '123456'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ 登录结果:', data);
  if (data.success) {
    console.log('用户信息:', data.data.user);
    console.log('Token:', data.data.token);
  }
})
.catch(error => {
  console.error('❌ 错误:', error);
});
```

---

### 方法 C：测试 Token 验证

**先登录获取 Token（上面的方法 B），然后复制粘贴：**

```javascript
// 替换为你的真实 Token
const token = 'YOUR_TOKEN_HERE';

fetch('https://love-story-api.gaolujie26.workers.dev/api/auth/verify', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(response => response.json())
.then(data => {
  console.log('✅ 验证结果:', data);
})
.catch(error => {
  console.error('❌ 错误:', error);
});
```

---

## 🌐 步骤 4：测试前端界面

### 4.1 通过界面注册

1. 访问：`https://love-story-ehe.pages.dev/`
2. 点击 "📝 账号登录/注册" 按钮
3. 点击 "立即注册"
4. 填写表单：
   - 用户名：`testuser2`
   - 邮箱：`test2@example.com`
   - 密码：`123456`
   - 确认密码：`123456`
5. 点击 "注册"

**预期结果：**
- 模态框关闭
- 自动进入主页（显示目录）
- 可以浏览漫画和游戏

---

### 4.2 查看浏览器 Console

按 `F12` 打开开发者工具，查看 Console 标签：

**如果有错误，会显示：**
- 红色错误信息
- CORS 错误
- Network 请求失败

**常见的错误信息：**

#### 错误 1：CORS 错误
```
Access to fetch at 'https://...' from origin 'https://love-story-ehe.pages.dev' has been blocked by CORS policy
```

**解决方案：** 后端 worker.js 中的 CORS 配置可能有问题

---

#### 错误 2：Network Error
```
NetworkError when attempting to fetch resource
```

**解决方案：** Worker URL 可能配置错误，检查 `js/auth.js` 中的 URL

---

#### 错误 3：404 Not Found
```
404 Not Found
```

**解决方案：** API 路径错误或 Worker 未正确部署

---

## 🔧 步骤 5：检查配置文件

### 5.1 检查 js/auth.js

**打开文件：** `js\auth.js`

**第 8-9 行应该是：**
```javascript
// API 基础 URL - 需要根据实际部署地址修改
this.apiBaseUrl = 'https://love-story-api.gaolujie26.workers.dev'; // 替换为你的 Worker URL
```

**确认 URL 正确！**

---

### 5.2 检查 index.html

**打开文件：** `index.html`

**找到第 223 行左右：**
```javascript
// authService.setApiUrl('https://love-story-api.gaolujie26.workers.dev');
```

**取消注释（删除开头的 `//`）：**
```javascript
authService.setApiUrl('https://love-story-api.gaolujie26.workers.dev');
```

**保存文件！**

---

### 5.3 检查 backend/wrangler.toml

**打开文件：** `backend\wrangler.toml`

**确认 database_id 已替换：**
```toml
[[d1_databases]]
binding = "DB"
database_name = "love-story-db"
database_id = "735f67a6-d65a-4a5c-8e73-3bcda87c5dc6"  # 应该是真实的 ID
```

**确认 ID 已替换！**

---

## 🚀 步骤 6：查看 Worker 实时日志

**打开 PowerShell，复制粘贴：**
```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler tail
```

**保持运行，然后在浏览器中注册账号**

**你会看到实时的请求日志：**
```
GET /api/auth/register HTTP/1.1 200
POST /api/auth/register HTTP/1.1 200
```

**按 `Ctrl+C` 停止查看日志**

---

## 🔨 步骤 7：重新部署后端（如果需要）

**如果后端有问题，重新部署：**

```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler deploy
```

**预期输出：**
```
✅ Successfully built your worker
✅ Uploaded worker
✨ Deployed at https://love-story-api.gaolujie26.workers.dev
```

---

## 📝 步骤 8：提交前端代码到 GitHub

**在 GitHub Desktop 中：**

1. 查看当前变更
2. 如果 `index.html` 或 `js/auth.js` 被修改
3. 填写提交信息：
   ```
   配置后端 API URL
   ```
4. 点击 "Commit to main"
5. 点击 "Push origin"

**等待 Cloudflare Pages 自动部署完成（1-2分钟）**

---

## 🧪 步骤 9：完整测试流程

### 测试 1：后端健康检查

**在浏览器地址栏输入：**
```
https://love-story-api.gaolujie26.workers.dev/
```

**应该返回：**
```json
{"status":"ok","message":"Love Story API is running","version":"1.0.0"}
```

**状态：** ⬜ 通过 / ✅ 通过 / ❌ 失败

---

### 测试 2：数据库连接

**在 PowerShell 执行：**
```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler d1 execute love-story-db --command "SELECT COUNT(*) as count FROM users;"
```

**应该返回用户数量**

**状态：** ⬜ 通过 / ✅ 通过 / ❌ 失败

---

### 测试 3：用户注册

**在浏览器 Console 执行步骤 3 的代码**

**状态：** ⬜ 通过 / ✅ 通过 / ❌ 失败

---

### 测试 4：用户登录

**在浏览器 Console 执行步骤 3 方法 B 的代码**

**状态：** ⬜ 通过 / ✅ 通过 / ❌ 失败

---

### 测试 5：前端界面注册

**通过网站界面注册新用户**

**状态：** ⬜ 通过 / ✅ 通过 / ❌ 失败

---

## ❓ 常见问题快速解决

### 🔴 问题：注册时返回 500 错误

**错误信息：**
```
Failed to load resource: the server responded with a status of 500
API request error: Error: 服务器错误，请稍后重试
```

**这是最常见的错误，按以下步骤排查：**

#### 方法 1：查看 Worker 实时日志（最重要！）

**打开 PowerShell，复制粘贴：**
```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler tail
```

**保持这个窗口运行，然后：**
1. 打开浏览器访问 `https://love-story-ehe.pages.dev/`
2. 点击 "账号登录/注册"
3. 尝试注册
4. **立即回到 PowerShell 查看日志**

**你会看到类似这样的错误信息：**
```
GET /api/auth/register HTTP/1.1 500
Error: XXX is not defined
或者
ReferenceError: XXX is not defined
```

**⚠️ 把完整的错误信息复制给我！**

**按 `Ctrl+C` 停止日志**

---

#### 方法 2：检查 worker.js 代码

**打开文件：** `backend\worker.js`

**检查第 1-3 行，确保正确导入：**
```javascript
import { Router } from 'itty-router';

const router = Router();
```

**如果没有这行代码，需要添加！**

---

#### 方法 3：检查 package.json 依赖

**打开文件：** `backend\package.json`

**确认有这些依赖：**
```json
{
  "dependencies": {
    "itty-router": "^4.0.20"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
```

**如果没有，复制粘贴以下完整内容到 `package.json`：**

```json
{
  "name": "love-story-backend",
  "version": "1.0.0",
  "description": "Cloudflare Workers backend for Love Story authentication",
  "main": "worker.js",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "d1:create": "wrangler d1 create love-story-db",
    "d1:query": "wrangler d1 execute love-story-db --file=schema.sql",
    "d1:query:dev": "wrangler d1 execute love-story-db-dev --file=schema.sql",
    "d1:console": "wrangler d1 execute love-story-db --command"
  },
  "keywords": [
    "cloudflare",
    "workers",
    "authentication",
    "api"
  ],
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "wrangler": "^3.0.0"
  },
  "dependencies": {
    "itty-router": "^4.0.20"
  }
}
```

**保存后，在 PowerShell 执行：**
```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
npm install
```

---

#### 方法 4：重新部署

```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler deploy
```

---

### 问题：Worker URL 404

**测试：**
```bash
curl https://love-story-api.gaolujie26.workers.dev/
```

**如果失败：**
```bash
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler deploy
```

---

### 问题：CORS 错误

**检查配置：**
```bash
cd backend
cat wrangler.toml
```

**确认 database_id 正确**

**重新初始化数据库：**
```bash
wrangler d1 execute love-story-db --file=schema.sql
```

---

### 问题：前端配置错误

**检查 API URL：**

1. 打开 `js/auth.js`
2. 找到第 9 行
3. 确认 URL 是：`https://love-story-api.gaolujie26.workers.dev`
4. 保存文件
5. 提交到 GitHub
6. 等待 Cloudflare Pages 重新部署

---

## 📊 问题诊断表

按照以下顺序检查，在对应项打勾：

### 后端检查

- [ ] Worker URL 可以访问（返回 {"status":"ok"}）
- [ ] 数据库表已创建（users, comments, likes 等）
- [ ] 可以通过 Console 注册用户
- [ ] 可以通过 Console 登录用户
- [ ] wrangler tail 能看到请求日志

### 前端检查

- [ ] `js/auth.js` 中的 API URL 正确
- [ ] `index.html` 中的 API URL 已取消注释
- [ ] 前端代码已提交到 GitHub
- [ ] Cloudflare Pages 已重新部署
- [ ] 浏览器 Console 无 CORS 错误
- [ ] 可以通过界面注册用户

### 功能检查

- [ ] 注册后自动登录
- [ ] 登录后可以进入主页
- [ ] 刷新页面保持登录状态
- [ ] 可以浏览漫画和游戏

---

## 📞 如何向我反馈问题

**请提供以下信息：**

1. **哪一步失败了？**
   - 例如："步骤 3 测试用户注册 API 失败"

2. **完整的错误信息**
   - 复制浏览器 Console 中的红色错误
   - 或 PowerShell 中的错误输出

3. **测试结果**
   - 告诉我上面 "问题诊断表" 中哪些通过、哪些失败

4. **你做了什么操作**
   - 例如："我访问了网站，点击注册按钮，填了信息，然后..."

---

## 🎯 快速诊断命令

**一键检查所有（复制粘贴到 PowerShell）：**

```bash
# 检查 Worker
echo "=== 1. 测试 Worker ==="
curl https://love-story-api.gaolujie26.workers.dev/

echo ""
echo "=== 2. 检查数据库 ==="
cd "F:\新建文件夹\范小羊\love-story\backend"
wrangler d1 execute love-story-db --command "SELECT name FROM sqlite_master WHERE type='table';"

echo ""
echo "=== 3. 查看用户数量 ==="
wrangler d1 execute love-story-db --command "SELECT COUNT(*) as user_count FROM users;"

echo ""
echo "=== 检查完成 ==="
```

---

## ✅ 成功标志

当你看到以下所有项都完成时，说明系统正常运行：

1. ✅ 访问 Worker URL 返回 `{"status":"ok"}`
2. ✅ 数据库有 5 个表（users, user_sessions, comments, likes, game_progress）
3. ✅ Console 可以注册用户
4. ✅ Console 可以登录用户
5. ✅ 网站界面可以注册新用户
6. ✅ 注册后自动进入主页
7. ✅ 可以浏览漫画和游戏

---

**按照本文档一步步操作，把结果告诉我！** 💕
