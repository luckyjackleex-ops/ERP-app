# NovaERP - 跨境电商全链路出海协同系统

全功能跨境电商 ERP 中台系统，支持多平台店铺矩阵（Amazon、TikTok Shop、Shopee、AliExpress 等）、全链路订单履约与风控、智能库存多仓调拨、财务利润实时核算、多语言客服与工单协同，以及基于 Google Gemini 3.8 Flash 的全栈端到端爆款 Listing 智能生成与多语言 AI 客服回复引擎。

---

## 🚀 方式一：直接使用当前已上线的官方网址（无需配置）

系统当前已在 Google Cloud 云端容器就绪并支持公网直接访问：

* **公网分享预览地址**：[点击访问体验](https://ais-pre-lzzhjhh2g7qfnkyjwo25ar-205701171224.asia-southeast1.run.app)
* **一键正式发布**：在 Google AI Studio 界面右上角点击 **「Deploy」** 按钮，即可由平台全自动生成高可用的永久独立域名。

---

## 📦 方式二：导出到 GitHub 并在 Netlify 部署上线

### 1. 将代码上传到 GitHub

在 **Google AI Studio** 界面右上角菜单中：
1. 点击右上角设置菜单（三点或齿轮图标）。
2. 选择 **「Export to GitHub」**（或选择 **「Download ZIP」** 下载源码包）。
3. 授权您的 GitHub 账号，系统将自动在您的 GitHub 下创建新仓库并推送全部源码。

> 如果您选择下载了 ZIP 压缩包，也可以在本地解压后执行以下标准 Git 命令推送到您的 GitHub：
> ```bash
> git init
> git add .
> git commit -m "feat: initial commit of NovaERP"
> git branch -M main
> git remote add origin https://github.com/你的用户名/你的仓库名.git
> git push -u origin main
> ```

---

### 2. 在 Netlify 上一键部署生成网址

1. 打开 [Netlify 官网 (netlify.com)](https://www.netlify.com/) 并使用 GitHub 账号登录。
2. 点击 **「Add new site」** -> **「Import an existing project」**。
3. 选择 **GitHub**，并找到授权并选定刚才推送的 `NovaERP` 仓库。
4. Netlify 会自动识别项目根目录的 `netlify.toml`，构建参数如下（如需手动核对）：
   * **Base directory**: 留空（根目录）
   * **Build command**: `vite build`
   * **Publish directory**: `dist`
5. 点击 **「Deploy site」**。
6. 等待约 1 分钟，Netlify 会自动生成类似 `https://your-nova-erp.netlify.app` 的公网上线网址！

---

## ⚡ 方式三：全栈服务上线推荐（支持 Node.js 服务端与 Gemini API）

由于本项目配备了专用的 Node.js Express 后端 API，用于在服务端安全调用 **Google Gemini 3.8 Flash**（确保您的 API Key 零泄露）：

如果您希望后端真实 API 接口与前端一同运行，推荐使用支持全栈 Node.js 的免费/低成本托管平台：

### 推荐平台：Render / Railway / Vercel

* **Render (render.com)**：
  1. 新建 **Web Service**，关联 GitHub 仓库。
  2. Build Command: `npm run build`
  3. Start Command: `npm run start`
  4. 环境变量 Environment Variables 中添加：`GEMINI_API_KEY=您的密钥`
  5. 自动生成专属公网全栈域名 `https://xxx.onrender.com`。

---

## 💻 本地开发运行指南

```bash
# 1. 安装依赖
npm install

# 2. 复制并配置环境变量
cp .env.example .env
# 在 .env 中填入 GEMINI_API_KEY=your_api_key

# 3. 启动开发服务器（端口 3000）
npm run dev
```

在浏览器中打开 `http://localhost:3000` 即可开始本地开发与调试。
