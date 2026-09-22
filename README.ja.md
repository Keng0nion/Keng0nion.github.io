**目次：**

- [中国語](README.md)
- [英語](README.en.md)
- [日本語](README.ja.md)

# Keng0nion's Farm

![ホームページのスクリーンショット：サイトタイトルとともに表示される WebGL 地球](./docs/screenshot-home.png)

**Kengo Kubota（Keng0nion）** によるバイリンガルの個人プロジェクトアーカイブ。独立したプロジェクト、実験、そして続いていく開発の歩みを記録するために作られました。

**ウェブサイト：** [https://keng0nion.github.io/](https://keng0nion.github.io/)

## 目次

- [機能](#機能)
- [技術スタック](#技術スタック)
- [ローカル開発](#ローカル開発)
- [検証](#検証)
- [素材のクレジット](#素材のクレジット)

## 機能

- 英語・中国語のルートと、記憶される言語設定
- Matrix の雨とクリックパーティクルを備えた、インタラクティブなサイバーパンクのホーム体験
- 昼・夜・法線・雲のテクスチャを備えた WebGL 地球
- 5 件のバイリンガル・プロジェクト資料を収めたプロジェクトアーカイブ
- アバウト、開発の歩み、連絡先、素材のクレジットの各ページ
- GitHub Actions による静的 GitHub Pages デプロイ

## 技術スタック

- Astro 7
- React 19
- TypeScript
- Three.js
- `react-globe.gl`

## ローカル開発

```sh
npm install
npx astro dev --background
```

バックグラウンドサーバーの管理には、以下のコマンドを使用します：

```sh
npx astro dev status
npx astro dev logs
npx astro dev stop
```

## 検証

```sh
npx astro check
npm run build
```

## 素材のクレジット

地球および宇宙のテクスチャは、Solar System Scope / INOVE により CC BY 4.0 のもとで提供されています。オープンソースのレンダリングライブラリは、それぞれの MIT ライセンスのもとで使用されています。詳細は [`ATTRIBUTION.md`](./ATTRIBUTION.md) およびウェブサイトのクレジットページをご覧ください。
