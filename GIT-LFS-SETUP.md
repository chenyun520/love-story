# Git LFS 大文件管理配置指南

## 为什么使用Git LFS？

你的舟山出游视频文件大小为498MB，属于大文件。Git LFS (Large File Storage) 是Git的扩展，专门用来处理大文件：

- **普通Git问题**：大文件会让仓库变得巨大，克隆和操作变慢
- **Git LFS优势**：大文件存储在专门的服务器上，Git仓库只保存指针文件

## 安装步骤

### 1. 安装Git
1. 访问：https://git-scm.com/download/win
2. 下载并安装Git for Windows
3. 安装时选择默认设置即可

### 2. 验证安装
安装完成后，重新打开PowerShell/命令提示符，执行：
```bash
git --version
git lfs --version
```

### 3. 自动配置（推荐）
运行项目根目录下的脚本：
```bash
setup-git-lfs.bat
```

### 4. 手动配置（如果需要）
```bash
# 初始化Git LFS
git lfs install

# 配置要跟踪的文件类型
git lfs track "*.mp4"
git lfs track "*.avi" 
git lfs track "*.mov"

# 添加配置文件
git add .gitattributes

# 添加视频文件
git add videos/舟山出游小记.mp4

# 提交更改
git commit -m "添加大视频文件使用Git LFS"

# 推送到远程仓库
git push
```

## 验证配置

### 检查文件是否被LFS跟踪
```bash
git lfs ls-files
```

### 检查LFS状态
```bash
git lfs status
```

### 查看跟踪规则
```bash
git lfs track
```

## 常用命令

```bash
# 查看LFS文件列表
git lfs ls-files

# 拉取LFS文件
git lfs pull

# 推送LFS文件
git lfs push origin main

# 检查LFS存储使用情况
git lfs env
```

## 注意事项

1. **第一次配置**：确保在添加大文件之前先配置LFS跟踪
2. **团队协作**：所有团队成员都需要安装Git LFS
3. **存储限制**：不同Git托管服务对LFS存储有不同限制
4. **网络要求**：上传下载大文件需要稳定网络连接

## GitHub LFS 限制

- **免费账户**：每月1GB带宽，1GB存储
- **付费账户**：可购买额外存储和带宽
- **文件大小限制**：单个文件最大2GB

## 故障排除

### 常见问题
1. **Git命令不存在**：确保已正确安装Git并重启终端
2. **LFS命令不存在**：可能需要单独安装Git LFS
3. **上传失败**：检查网络连接和远程仓库LFS支持

### 检查配置
```bash
# 检查Git配置
git config --list

# 检查LFS配置
git lfs env

# 查看远程仓库信息
git remote -v
```

## 完成配置后

配置完成后，你的498MB视频文件将：
1. 被Git LFS管理，不会占用Git仓库空间
2. 在克隆仓库时快速下载
3. 支持版本控制和协作开发
4. 确保网站能正常加载和播放视频

现在你可以放心地管理大视频文件了！ 