**目录：**

- [中文版](README.md)
- [英文版](README.en.md)
- [日文版](README.ja.md)

# Keng0nion's Farm

![首页截图：带有网站标题的 WebGL 地球](./docs/screenshot-home.png)

**Kengo Kubota（Keng0nion）** 的双语个人项目档案，用于记录独立项目、实验，以及持续的开发旅程。

**网站：** [https://keng0nion.github.io/](https://keng0nion.github.io/)

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [本地开发](#本地开发)
- [验证](#验证)
- [素材署名](#素材署名)

## 功能特性

- 英文和中文路由，支持记忆语言偏好
- 带有 Matrix 雨和点击粒子效果的交互式赛博朋克首页体验
- 带有白天、夜晚、法线和云层纹理的 WebGL 地球
- 收录五份双语项目档案的项目档案库
- 关于、开发旅程、联系方式和素材署名页面
- 通过 GitHub Actions 进行静态 GitHub Pages 部署

## 技术栈

- Astro 7
- React 19
- TypeScript
- Three.js
- `react-globe.gl`

## 本地开发

```sh
npm install
npx astro dev --background
```

使用以下命令管理后台服务器：

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## 验证

```sh
npx astro check
npm run build
```

## 素材署名

地球和太空纹理由 Solar System Scope / INOVE 提供，遵循 CC BY 4.0 许可。开源渲染库在各自的 MIT 许可下使用。详情请参见 [`ATTRIBUTION.md`](./ATTRIBUTION.md) 和网站的 Credits 页面。
