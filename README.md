# Love Story 💕 爱情纪念杂志

一个充满创意的爱情纪念杂志网站，包含漫画恋爱史、互动游戏、爱情计时器等多个主题模块。采用纯前端技术实现，无需后端支持，双击即可运行。

## ✨ 项目简介

这是一个专为情侣打造的互动式爱情纪念网站，将爱情故事以杂志形式呈现。项目包含精美的3D翻书漫画、趣味闯关游戏、实时爱情计时器以及四季特效系统，创造独特的爱情回忆体验。

### 🎯 核心特性

- **📖 杂志风格设计**：精美的杂志封面和布局设计
- **👤 用户账号系统**：支持用户注册、登录、数据云端同步（基于 Cloudflare Workers + D1）
- **🔐 双重登录方式**：管理员密码登录 + 用户账号登录
- **📱 完美响应式**：适配桌面端和移动端
- **🎨 纯前端实现**：无需构建工具，开箱即用
- **💾 进度自动保存**：本地存储游戏进度和设置

## 🎮 功能模块

### 1. 杂志封面系统 (index.html)

入口页面，包含：
- 精美的杂志封面设计
- **双重登录系统**：
  - 管理员密码登录（默认密码：`251105`）
  - 用户账号注册/登录（支持注册新账号）
- 爱情照片轮播展示
- 导航菜单（漫画阅读、游戏中心等）

### 2. 漫画恋爱史 (manga.html)

记录从初识到恋爱的完整故事：
- **📚 3D翻书效果**：真实的书籍翻页动画
- **💬 对话气泡系统**：区分双方对话（☁️ 牧羊人 vs 🐑 小羊）
- **📸 照片插入**：支持真实照片与漫画混合展示
- **📅 时间线展示**：按时间顺序记录恋爱历程
- **🔄 页面导航**：支持点击翻页和按钮控制

### 3. 游戏中心 (game.html)

双模式游戏系统：

#### 🛠️ 工具归位模式
- 将下方托盘中的工具拖到上方对应的凹槽中
- 限时挑战，剩余时间越多星级越高
- 星级可获得时间奖励，用于后续关卡

#### 🍉 水果派对模式
- 全新的水果匹配玩法
- 趣味性强，适合轻松休闲

#### 游戏特色
- **4档难度**：新手 / 进阶 / 高手 / 地狱
- **100个关卡**：全部解锁，可自由跳关
- **3种主题**：牧场 / 儿童房 / 车库
- **星级评价**：1-3星评分系统
- **时间奖励机制**：快速通关获得额外时间
- **进度保存**：自动保存关卡进度
- **干扰元素**：高难度加入干扰工具和晃动效果

### 4. 爱情计时器 (love_timer.js)

实时记录相爱时长：
- 从 2025.11.05 开始计时
- 精确到秒的实时更新
- 可爱的小羊动画效果
- 显示天数、小时、分钟、秒数

### 5. 季节特效系统 (seasons.js)

动态背景特效：
- **🌸 春季**：花瓣飘落效果
- **☀️ 夏季**：阳光明媚主题
- **🍂 秋季**：落叶纷飞特效
- **❄️ 冬季**：雪花飘落动画

## 📁 项目结构

```
love-story/
├── index.html          # 杂志封面页（登录入口）
├── manga.html          # 漫画恋爱史页面
├── game.html           # 游戏中心页面
├── css/
│   ├── magazine.css    # 杂志主题样式
│   ├── style.css       # 游戏样式
│   ├── updates.css     # 季节特效样式
│   └── auth.css        # 认证界面样式
├── js/
│   ├── main.js         # 游戏核心逻辑（1031行）
│   ├── book.js         # 3D翻书效果（181行）
│   ├── love_timer.js   # 爱情计时器（151行）
│   ├── seasons.js      # 季节特效系统（167行）
│   ├── auth.js         # 认证系统客户端
│   └── auth-ui.js      # 认证界面管理
├── backend/            # 后端服务（Cloudflare Workers）
│   ├── worker.js       # Worker 主文件（API 路由）
│   ├── schema.sql      # 数据库初始化脚本
│   ├── wrangler.toml   # Cloudflare 配置
│   ├── package.json    # 依赖配置
│   ├── DEPLOYMENT.md   # 详细部署文档
│   └── test-api.js     # API 测试脚本
├── image/              # 图片素材资源
├── README.md           # 项目说明文档
└── QUICKSTART.md       # 快速开始指南
```

## 🚀 快速开始

### 方式一：纯前端模式（无需后端）

1. 克隆或下载项目到本地
2. 双击 `index.html` 在浏览器中打开
3. 使用管理员密码登录：`251105`

### 方式二：完整模式（支持用户注册）

如果你想启用用户注册和登录功能，需要部署后端服务：

**🚀 10分钟快速部署：** 查看 [QUICKSTART.md](QUICKSTART.md)

**📖 完整部署指南：** 查看 [backend/DEPLOYMENT.md](backend/DEPLOYMENT.md)

**主要步骤：**
1. 安装 Cloudflare Workers CLI：`npm install -g wrangler`
2. 创建 D1 数据库
3. 配置并部署后端 Worker
4. 更新前端 API URL
5. 完成！

### 在线部署

可部署到任意静态网站托管服务：
- GitHub Pages
- Netlify
- Vercel
- Cloudflare Pages

## 🛠️ 技术栈

### 前端技术
- **HTML5**：语义化标签
- **CSS3**：
  - 渐变背景、毛玻璃效果
  - 3D变换和动画
  - Flexbox 和 Grid 布局
  - CSS 变量系统
- **原生 JavaScript (ES6+)**：
  - Class 类语法
  - 模块化设计
  - Pointer Events 统一交互

### 后端技术（可选，用于用户注册功能）
- **Cloudflare Workers**：Serverless 计算平台
- **Cloudflare D1**：分布式 SQLite 数据库
- **itty-router**：轻量级路由框架
- **JWT**：用户认证和授权
- **RESTful API**：标准化的 API 设计

### 核心实现

#### 1. 拖拽系统 (main.js)
```javascript
// 基于 Pointer Events 的统一拖拽
- setPointerCapture 确保事件连续性
- 精确的碰撞检测（getBoundingClientRect）
- 平滑的跟随动画
- 防误触机制
```

#### 2. 3D翻书效果 (book.js)
```javascript
// CSS3 3D变换实现翻页
- transform-style: preserve-3d
- rotateY(-180deg) 翻转动画
- z-index 层级管理
```

#### 3. 数据持久化
```javascript
// 本地存储
- sessionStorage：临时登录状态
- localStorage：游戏进度和设置
- 自动保存和读取机制

// 云端存储（需部署后端）
- Cloudflare D1：用户账号、游戏进度
- JWT Token：安全的用户认证
```

### 外部依赖
- **前端**：Google Fonts（Didot + Noto Sans SC）
- **后端**（可选）：
  - itty-router：API 路由
  - Cloudflare Workers：Serverless 运行时
  - Cloudflare D1：云数据库

## 🎨 设计亮点

1. **杂志美学**：采用杂志排版风格，优雅大方
2. **小羊元素**：可爱的羊形图标和动画贯穿全站
3. **毛玻璃效果**：现代化的 UI 设计
4. **流畅动画**：精心设计的过渡和交互动画
5. **主题一致性**：统一的视觉语言和配色方案

## 🔧 自定义配置

### 修改密码
在 `index.html` 中修改：
```javascript
const correctPassword = '251105'; // 修改为你的密码
```

### 修改爱情起始日期
在 `js/love_timer.js` 中修改：
```javascript
const startDate = new Date('2025-11-05T18:25:00');
```

### 调整游戏难度
在 `js/main.js` 的 `DIFFS` 配置中修改：
```javascript
const DIFFS = [
  { name: '新手', time: 60, tools: 3, shake: 0, distractions: 0 },
  // ... 其他难度配置
];
```

### 更新漫画内容
编辑 `manga.html` 中的 `.book-page` 元素，添加你的故事和照片。

## 🐛 调试功能

- **重置进度**：长按游戏页面标题约 3 秒可清空所有进度
- **控制台日志**：详细的调试信息输出到 console
- **图片加载失败处理**：自动降级和错误提示

## 📱 浏览器兼容性

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+

## 🔒 已知问题修复

### 拖拽问题修复
**问题**：匹配一次成功后，下一次拖拽容易"拉不动"或误触发其他点击

**修复方案**：
- 使用 `setPointerCapture` 确保事件连续性
- 监听 `pointercancel` 防止系统手势干扰
- `preventDefault()` 阻止默认滚动和文本选中
- CSS 增强：添加 `user-select: none` 和 `-webkit-user-drag: none`
- 失败回落时统一恢复可交互性

相关代码位置：`js/main.js:enableDrag` 和 `css/style.css`

### 图片加载优化
- 添加图片加载失败的 fallback 机制
- CDN 图片加载优化
- 响应式图片尺寸适配

## 🎯 使用场景

- **情人节礼物**：为爱人制作专属纪念网站
- **求婚创意**：在游戏中隐藏求婚信息
- **纪念日庆祝**：记录和回顾美好时光
- **学习参考**：前端技术学习和实践
- **二次创作**：基于模板修改为自己的故事

## 📄 版权说明

- 本项目代码仅供学习与交流使用
- 图片素材请自检授权或替换为自有资源
- 商用请确保获得所有素材的合法授权

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进项目！

## 📞 联系方式

如有问题或建议，欢迎通过以下方式联系：
- 提交 GitHub Issue
- 发送邮件讨论

---

**Made with ❤️ for Love**
