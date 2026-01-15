# 后端部署详细指南

本指南将一步步带你完成用户账号系统的后端部署。

## 📋 准备工作

在开始之前，确保你已完成：

- [X] Cloudflare 账号（免费即可注册）
- [X] 已安装 Node.js 和 npm
- [X] 项目文件夹已通过 GitHub Desktop 克隆到本地

---

## 🚀 开始部署

### 第 1 步：打开终端

按 `Win + R`，输入 `powershell` 或 `cmd`，回车。

**进入项目目录：**

```bash
cd "F:\新建文件夹\范小羊\love-story"
```

**确认当前位置：**

```bash
dir
```

你应该能看到 `backend` 文件夹。

---

### 第 2 步：安装 Cloudflare Workers CLI

```bash
npm install -g wrangler
```

**说明：** 这会安装 Cloudflare 的命令行工具，可能需要 1-2 分钟。

**验证安装：**

```bash
wrangler --version
```

应该显示类似 `4.xx.x` 的版本号。

**如果失败：**

- 确保 npm 已安装：`npm --version`
- 尝试重新安装：`npm install -g wrangler`

---

### 第 3 步：登录 Cloudflare

```bash
wrangler login
```

**会发生什么：**

1. 浏览器自动打开
2. 显示 Cloudflare 授权页面
3. 点击 "授权" 或 "Authorize"
4. 授权成功后关闭浏览器

**如果浏览器没自动打开：**

- 复制终端中显示的 URL
- 手动粘贴到浏览器地址栏打开

**验证登录：**

```bash
wrangler whoami
```

应该显示你的 Cloudflare 账号信息。

---

### 第 4 步：进入后端目录

```bash
cd backend
dir
```

**你应该看到这些文件：**

- worker.js
- schema.sql
- wrangler.toml
- package.json
- .gitignore
- DEPLOYMENT.md
- test-api.js

---

### 第 5 步：创建生产环境数据库

```bash
wrangler d1 create love-story-db
```

**执行后会显示：**

```
✅ Successfully created DB 'love-story-db'

database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"

View this database in the dashboard:
https://dash.cloudflare.com/...
```

### ⭐ 关键操作：复制 database_id

**非常重要！**

1. 复制 `database_id =` 后面引号中的内容
2. 例如：`a1b2c3d4-e5f6-7890-abcd-ef1234567890`
3. **保存到记事本**，稍后会用到

---

### 第 6 步：编辑配置文件 wrangler.toml

**用记事本或 VS Code 打开文件：**

```
backend\wrangler.toml
```

**找到这一行：**

```toml
database_id = "YOUR_DATABASE_ID"
```

**替换为你的真实 database_id：**

```toml
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
```

**完整示例：**

```toml
[[d1_databases]]
binding = "DB"
database_name = "love-story-db"
database_id = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"  # ← 这里替换
```

**保存文件并关闭。**

---

### 第 7 步：创建开发环境数据库（可选，但推荐）

```bash
wrangler d1 create love-story-db-dev
```

同样会返回一个 `database_id`，复制它。

**再次编辑 `wrangler.toml`**，找到：

```toml
database_id = "YOUR_DEV_DATABASE_ID"
```

替换为开发环境的真实 ID。

**保存文件。**

---

### 第 8 步：安装项目依赖

```bash
npm install
```

**说明：** 这会安装 itty-router 等依赖包。

**等待安装完成**（可能需要 1 分钟）。

---

### 第 9 步：初始化数据库结构

```bash
wrangler d1 execute love-story-db --file=schema.sql
```

**成功后显示：**

```
🚣 Executing on love-story-db (a1b2c3d4...):
✅ Successfully executed 13 commands.
```

**验证表是否创建成功：**

```bash
wrangler d1 execute love-story-db --command "SELECT name FROM sqlite_master WHERE type='table';"
```

**应该看到：**

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

### 第 10 步：设置 JWT 密钥（推荐）

```bash
wrangler secret put JWT_SECRET
```

**会提示：**

```
Enter the secret value you would like assigned to JWT_SECRET on the production script:
```

**输入一个强密码（至少 32 个字符），例如：**

```
my-super-secret-love-story-jwt-key-2024
```

按回车确认。

**说明：** 这个密钥用于加密用户 Token，提高安全性。

---

### 第 11 步：部署到 Cloudflare Workers

```bash
npm run deploy
```

**或者：**

```bash
wrangler deploy
```

**部署过程：**

```
⛅️ wrangler 4.xx.x
-------------------
✅ Successfully built your worker
✅ Uploaded worker
✨ Deployed at https://love-story-api.abc123defg.workers.dev
```

### ⭐ 关键操作：复制 Worker URL

**非常重要！**

1. 复制完整的 URL
2. 例如：`https://love-story-api.abc123defg.workers.dev`
3. **保存到记事本**，下一步要用

---

### 第 12 步：测试 API 是否正常

**方法 1：浏览器测试**

在浏览器地址栏输入你的 Worker URL：

```
https://love-story-api.你的子域名.workers.dev/
```

**应该看到：**

```json
{
  "status": "ok",
  "message": "Love Story API is running",
  "version": "1.0.0"
}
```

**方法 2：使用测试脚本**

1. 编辑 `backend\test-api.js`（用记事本打开）
2. 找到第 1 行，替换 URL：
   ```javascript
   const API_BASE_URL = 'https://love-story-api.你的子域名.workers.dev';
   ```
3. 保存文件
4. 运行测试：
   ```bash
   node test-api.js
   ```

**全部测试通过会显示：**

```
=== Love Story API 测试 ===

1. 健康检查...
✓ API 运行正常

2. 测试用户注册...
✓ 注册成功

3. 测试用户登录...
✓ 登录成功

4. 测试 Token 验证...
✓ Token 验证成功

5. 测试获取用户资料...
✓ 获取用户资料成功

=== 测试完成 ===
```

---

### 第 13 步：配置前端连接后端

**编辑文件：`js\auth.js`**

1. 用记事本或编辑器打开 `js\auth.js`
2. 找到第 8 行：
   ```javascript
   this.apiBaseUrl = 'https://love-story-api.YOUR_SUBDOMAIN.workers.dev';
   ```
3. 替换为你的真实 Worker URL：
   ```javascript
   this.apiBaseUrl = 'https://love-story-api.abc123defg.workers.dev';
   ```
4. **保存文件**

**编辑文件：`index.html`**（可选）

1. 打开 `index.html`
2. 找到第 223 行左右：
   ```javascript
   // authService.setApiUrl('https://love-story-api.YOUR_SUBDOMAIN.workers.dev');
   ```
3. 取消注释并替换：
   ```javascript
   authService.setApiUrl('https://love-story-api.abc123defg.workers.dev');
   ```
4. **保存文件**

---

### 第 14 步：提交代码到 GitHub

**在 GitHub Desktop 中操作：**

1. 打开 GitHub Desktop
2. 查看当前变更（应该能看到修改的文件）
3. 填写提交信息：
   ```
   配置后端 API URL，添加用户认证系统
   ```
4. 点击 "Commit to main"
5. 点击 "Push origin"

**说明：** Cloudflare Pages 会自动检测到更新并重新部署，通常需要 1-2 分钟。

---

### 第 15 步：最终测试

1. 访问：`https://love-story-ehe.pages.dev/`
2. 点击 "📝 账号登录/注册"
3. 点击 "立即注册"
4. 填写信息：
   - 用户名：`testuser`
   - 邮箱：`test@example.com`
   - 密码：`123456`
   - 确认密码：`123456`
5. 点击 "注册"

**成功标志：**

- ✅ 模态框关闭
- ✅ 自动进入主页（显示目录）
- ✅ 可以浏览漫画和游戏

---

## ✅ 部署完成检查清单

确认以下所有项都已完成：

- [ ] Cloudflare CLI (wrangler) 已安装
- [ ] 已成功登录 Cloudflare
- [ ] 生产数据库 `love-story-db` 已创建
- [ ] 开发数据库 `love-story-db-dev` 已创建（可选）
- [ ] `wrangler.toml` 中的 `database_id` 已替换
- [ ] 项目依赖已安装
- [ ] 数据库表结构已初始化
- [ ] JWT 密钥已设置（推荐）
- [ ] Worker 已成功部署
- [ ] API 测试通过
- [ ] 前端 `js/auth.js` 已配置后端 URL
- [ ] 前端 `index.html` 已配置后端 URL（可选）
- [ ] 代码已提交到 GitHub
- [ ] 用户注册测试成功

---

## 📊 常用管理命令

部署完成后，你可以使用这些命令管理后端：

```bash
# 在 backend 目录中执行

# 查看所有数据库
wrangler d1 list

# 查看用户列表
wrangler d1 execute love-story-db --command "SELECT id, username, email, created_at FROM users;"

# 查看游戏进度
wrangler d1 execute love-story-db --command "SELECT * FROM game_progress;"

# 删除测试用户
wrangler d1 execute love-story-db --command "DELETE FROM users WHERE username = 'testuser';"

# 查看数据库表结构
wrangler d1 execute love-story-db --command ".schema"

# 查看 Worker 实时日志
wrangler tail

# 本地开发测试
npm run dev

# 重新部署后端
npm run deploy
```

---

## 🔧 常见问题解决

### 问题 1：wrangler: command not found

**原因：** wrangler 没有正确安装或不在系统路径中

**解决：**

```bash
# 重新安装
npm install -g wrangler

# 验证
wrangler --version

# 如果还不行，尝试
npm update -g wrangler
```

---

### 问题 2：登录失败

**原因：** 未登录或登录过期

**解决：**

```bash
# 检查登录状态
wrangler whoami

# 重新登录
wrangler login
```

---

### 问题 3：数据库创建失败

**原因：** 未登录或账号权限不足

**解决：**

```bash
# 1. 确认已登录
wrangler whoami

# 2. 检查账号是否有创建数据库权限
# 登录 https://dash.cloudflare.com 查看账号状态

# 3. 尝试重新创建
wrangler d1 create love-story-db
```

---

### 问题 4：配置文件找不到

**原因：** 不在 backend 目录中

**解决：**

```bash
# 确认当前位置
pwd

# 进入 backend 目录
cd backend

# 确认文件存在
dir wrangler.toml
```

---

### 问题 5：部署失败

**原因：** 配置错误或 network 问题

**解决：**

```bash
# 1. 检查配置文件
cat wrangler.toml
# 确认 database_id 已正确替换

# 2. 检查网络连接
ping workers.dev

# 3. 尝试重新部署
wrangler deploy
```

---

### 问题 6：API 测试失败

**原因：** URL 配置错误或 Worker 未正确部署

**解决：**

```bash
# 1. 确认 Worker URL 正确
# 浏览器访问：https://你的URL/
# 应该看到：{"status":"ok",...}

# 2. 检查前端配置
# 打开 js/auth.js，确认 apiBaseUrl 正确

# 3. 检查浏览器控制台
# 按 F12，查看是否有错误信息
```

---

### 问题 7：注册时出现 CORS 错误

**原因：** 前端域名未在 CORS 白名单中

**解决：**

```bash
# 1. 检查 worker.js 中的 CORS 配置
# 确认允许所有源：'*'

# 2. 重新部署后端
npm run deploy

# 3. 清除浏览器缓存后重试
```

---

### 问题 8：用户注册成功但无法登录

**原因：** Token 存储问题或密码验证错误

**解决：**

```bash
# 1. 检查浏览器控制台（F12）
# 查看 localStorage 中是否有 token

# 2. 清除浏览器缓存和 localStorage
# F12 → Application → Local Storage → Clear

# 3. 查看数据库中的用户
wrangler d1 execute love-story-db --command "SELECT * FROM users;"
```

---

## 🎯 下一步

后端部署成功后，你可以：

1. **查看所有 API 接口：** 阅读 `backend/DEPLOYMENT.md` 的 API 文档部分
2. **实现评论功能：** 数据库已预留 comments 表
3. **同步游戏进度：** 数据库已预留 game_progress 表
4. **管理用户数据：** 使用上面的管理命令查看和管理用户

---

## 📞 需要帮助？

如果按照步骤操作遇到问题：

1. **仔细阅读错误信息**：终端或浏览器会显示具体的错误
2. **检查配置文件**：确认所有 ID 和 URL 都已正确替换
3. **查看日志**：使用 `wrangler tail` 查看实时日志
4. **提问时请提供：**
   - 具体在哪一步出错
   - 完整的错误信息
   - 你的操作步骤

---

**准备好了吗？开始第一步吧！** 💕

有任何问题随时问我！
