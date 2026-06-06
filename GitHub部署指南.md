# 青程科创官网 GitHub 部署指南

本文档用于把 `青程科创官网` 这个静态网站上传到 GitHub，并通过 GitHub Pages 部署成可访问的网址。

## 1. 准备 GitHub 仓库

1. 登录 GitHub。
2. 点击右上角 `+`，选择 `New repository`。
3. 仓库名建议使用：

```text
qingcheng-tech-website
```

4. 仓库可选择 `Public`，这样 GitHub Pages 可以免费部署。
5. 不需要勾选 `Add a README file`，因为本地已经有网站文件。
6. 创建仓库后，复制 GitHub 给出的仓库地址，例如：

```text
https://github.com/你的用户名/qingcheng-tech-website.git
```

## 2. 本地整理网站文件

当前官网目录是：

```text
青程科创官网/
```

需要上传的核心文件包括：

```text
index.html
styles.css
script.js
assets/
resources/
README.md
GitHub部署指南.md
```

如果只部署官网，可以把 `青程科创官网` 目录作为仓库根目录上传。

注意：GitHub Pages 只能访问仓库内的文件，不能访问本机电脑上的 `../2026寒假科创营/...` 或 `../2026.6二师水火箭/...` 这类上级目录。当前项目已把需要公开访问的成果页、积分统计页、SOP 和迭代文档复制到 `resources/` 目录，部署时必须一起提交。

## 3. 初始化 Git 并提交

在终端进入官网目录：

```powershell
cd "E:\大学学习资料\上课\青程科创\青程科创官网"
```

初始化 Git：

```powershell
git init
```

添加所有文件：

```powershell
git add .
```

提交：

```powershell
git commit -m "Initial website deployment"
```

绑定远程仓库：

```powershell
git remote add origin https://github.com/你的用户名/qingcheng-tech-website.git
```

推送到 GitHub：

```powershell
git branch -M main
git push -u origin main
```

## 4. 开启 GitHub Pages

1. 打开 GitHub 仓库页面。
2. 进入 `Settings`。
3. 左侧找到 `Pages`。
4. 在 `Build and deployment` 区域：
   - `Source` 选择 `Deploy from a branch`
   - `Branch` 选择 `main`
   - 文件夹选择 `/root`
5. 点击 `Save`。

等待 1-3 分钟后，GitHub 会生成访问地址，通常格式是：

```text
https://你的用户名.github.io/qingcheng-tech-website/
```

## 5. 后续更新网站

每次修改网站后，在 `青程科创官网` 目录执行：

```powershell
git add .
git commit -m "Update website"
git push
```

GitHub Pages 会自动重新部署。

## 6. 注意事项

- `index.html` 必须在仓库根目录，否则 GitHub Pages 找不到首页。
- `assets` 文件夹必须一起上传，否则图片、GIF、视频和 DOCX 会丢失。
- `resources` 文件夹必须一起上传，否则成果页、积分统计、SOP、迭代文档等内部链接会失效。
- 当前网站是纯静态页面，不需要服务器或数据库。
- `resources/scoreboard.html` 是静态演示页；GitHub Pages 不能运行 Python 后端，所以在线保存积分功能需要后续单独接数据库、飞书表格或其他后端服务。
- 表单数据目前保存在访问者自己的浏览器本地，不会自动发送到团队邮箱或后台。
- 如果未来要接入真实报名系统，可以把表单提交改成飞书表格、腾讯文档、Notion、数据库或自建后端接口。

## 7. 可选：绑定自定义域名

如果未来购买了域名，例如：

```text
www.qingchengtech.com
```

可以在 GitHub Pages 的 `Custom domain` 中填写域名，并在域名服务商处配置 CNAME。

常见配置：

```text
主机记录：www
记录类型：CNAME
记录值：你的用户名.github.io
```

配置完成后，在 GitHub Pages 页面勾选 `Enforce HTTPS`。
