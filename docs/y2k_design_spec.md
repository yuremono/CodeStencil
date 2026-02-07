# Y2K Ecommerce デザイン仕様書

> **デザインソース**: [Y2K Ecommerce by Devix Digital](https://dribbble.com/shots/22715311-Y2K-Ecommerce)
> **作成日**: 2026-02-07
> **担当**: @member3

---

## 1. デザインコンセプト

### 1.1 コンセプト概要

1990年代後半から2000年代初期の懐かしいデジタル美学を再現したEコマースサイト。

**キーワード**:
- Windows 95 風デスクトップインターフェース
- レトロフューチャリスティック
- ピクセルアート美学
- デジタルノスタルジア

---

## 2. カラーパレット

### 2.1 定義

| 色名 | 用途 | HEX | Tailwind クラス（推奨） |
|------|------|-----|----------------------|
| **Pink Purple** | 背景メイン | `#9D4EDD` / `#C77DFF` | `bg-purple-500` / `bg-purple-400` |
| **Deep Purple** | 背景アクセント | `#7B2CBF` | `bg-purple-700` |
| **Yellow** | アクセント | `#FFB703` | `text-yellow-400` / `bg-yellow-400` |
| **Blue** | アクセント | `#00B4D8` | `text-cyan-400` / `bg-cyan-400` |
| **White** | テキスト | `#FFFFFF` | `text-white` |
| **Black** | テキスト/ボーダー | `#000000` | `text-black` / `border-black` |

### 2.2 Tailwind CSS 設定

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        y2k: {
          pink: '#9D4EDD',
          pinkLight: '#C77DFF',
          purple: '#7B2CBF',
          yellow: '#FFB703',
          blue: '#00B4D8',
        },
      },
    },
  },
}
```

---

## 3. フォント

### 3.1 フォント選定

**要件**: ピクセル化されたフォント（初期デジタル表示風）

**推奨フォント**:

| フォント名 | 提供元 | 特徴 |
|-----------|--------|------|
| **Press Start 2P** | Google Fonts | クラシックなゲームフォント |
| **VT323** | Google Fonts | 端末風等幅フォント |
| **DotGothic16** | Google Fonts | 日本語対応ドットフォント |

### 3.2 導入手順

```bash
# Next.js / React プロジェクトの場合
npm install @fontsource/press-start-2p
npm install @fontsource/vt323
```

```typescript
// app/layout.tsx または pages/_app.tsx
import '@fontsource/press-start-2p'
import { Press_Start_2P, VT323 } from 'next/font/google'

const pixelFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
})

const terminalFont = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-terminal',
})
```

```css
/* globals.css */
:root {
  --font-pixel: 'Press Start 2P', cursive;
  --font-terminal: 'VT323', monospace;
}

.font-pixel {
  font-family: var(--font-pixel);
}

.font-terminal {
  font-family: var(--font-terminal);
  font-size: 1.25rem;
  line-height: 1.4;
}
```

---

## 4. コンポーネント構成

### 4.1 フォルダーアイコン（デスクトップメイン）

以下のフォルダーアイコンをWindows 95風で配置：

| アイコン名 | 機能 |
|-----------|------|
| Catalog | 商品カタログ |
| Contact | お問い合わせ |
| TikTok | SNS連携 |
| Wishlist | お気に入り |
| Search | 商品検索 |
| Winamp | ミュージックプレイヤー（装飾） |
| Instagram | SNS連携 |
| Cart | ショッピングカート |
| Size Chart | サイズガイド |
| About Us | 会社概要 |
| Chat | チャットサポート |

### 4.2 コンポーネント階層

```
Desktop
├── Taskbar (Windows 95風)
│   ├── Start Button
│   ├── Window Tabs
│   └── System Tray (時計)
│
├── Folders (デスクトップ上のアイコン)
│   ├── FolderIcon
│   │   ├── Icon (イメージ)
│   │   └── Label (テキスト)
│   └── ...
│
└── Windows (開いたフォルダ)
    ├── WindowFrame (Windows 95風枠)
    │   ├── TitleBar (閉じる/最大化/最小化ボタン)
    │   ├── MenuBar (File, Edit, View...)
    │   └── ContentArea
    └── ...
```

---

## 5. UI要素の詳細仕様

### 5.1 ウィンドウフレーム (Windows 95風)

```css
/* Windows 95 ウィンドウスタイル */
.window-frame {
  border: 2px solid;
  border-color: #dfdfdf #000 #000 #dfdfdf;
  box-shadow: inset 1px 1px 0 #fff, inset -1px -1px 0 #808080;
}

.title-bar {
  background: linear-gradient(90deg, #000080, #1084d0);
  padding: 4px 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-bar-button {
  width: 16px;
  height: 16px;
  background: #c0c0c0;
  border: 1px solid;
  border-color: #fff #000 #000 #fff;
}
```

### 5.2 フォルダーアイコン

```tsx
// components/Desktop/FolderIcon.tsx
interface FolderIconProps {
  name: string
  icon: React.ReactNode
  onClick: () => void
}

export function FolderIcon({ name, icon, onClick }: FolderIconProps) {
  return (
    <div
      className="flex flex-col items-center gap-2 p-2 cursor-pointer hover:bg-white/10"
      onClick={onClick}
    >
      <div className="w-16 h-16">{icon}</div>
      <span className="font-pixel text-xs text-white text-center px-2">
        {name}
      </span>
    </div>
  )
}
```

### 5.3 タスクバー

```tsx
// components/Desktop/Taskbar.tsx
export function Taskbar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-200 border-t-2 border-white flex items-center px-2">
      {/* Start Button */}
      <button className="px-4 py-1 font-pixel text-sm">
        Start
      </button>

      {/* Window Tabs */}
      <div className="flex-1 flex gap-1 px-2">
        {/* 動的に追加されるウィンドウタブ */}
      </div>

      {/* System Tray */}
      <div className="font-terminal text-sm">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  )
}
```

---

## 6. レイアウト構成

### 6.1 デスクトップレイアウト

```
+--------------------------------------------------+
|                                                  |
|   [Catalog]  [Contact]  [TikTok]  [Wishlist]    |
|                                                  |
|   [Search]  [Winamp]  [Instagram]  [Cart]       |
|                                                  |
|   [Size Chart]  [About Us]  [Chat]              |
|                                                  |
|                                                  |
+--------------------------------------------------+
| Start |  [Window Tab 1]  [Window Tab 2]  | 21:30 |
+--------------------------------------------------+
```

### 6.2 モバイル対応

- フォルダーアイコンはグリッドレイアウトに変更
- タスクバーは下部に固定
- ウィンドウはモーダルとして表示

---

## 7. アニメーション効果

### 7.1 推奨アニメーション

| 効果 | 説明 |
|------|------|
| ウィンドウオープン | Windows 95風の拡大アニメーション |
| ホバー | 輝くエフェクト（グロー） |
| クリック | 立体ボタンの押下エフェクト |
| スクロール | ピクセル風スムーズスクロール |

### 7.2 Framer Motion 実装例

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{
    type: 'spring',
    stiffness: 300,
    damping: 20,
  }}
>
  {/* ウィンドウコンテンツ */}
</motion.div>
```

---

## 8. 実装チェックリスト

### Phase 1: 基盤整備
- [ ] Tailwind CSS カスタムカラー設定
- [ ] フォントの導入と設定
- [ ] 基本的なレイアウト構築

### Phase 2: コンポーネント実装
- [ ] FolderIcon コンポーネント
- [ ] WindowFrame コンポーネント
- [ ] Taskbar コンポーネント
- [ ] Desktop コンテナ

### Phase 3: 機能実装
- [ ] ウィンドウの開閉ロジック
- [ ] フォルダー選択時の遷移
- [ ] レスポンシブ対応

---

## 9. 技術スタック推奨

| カテゴリ | 推奨技術 |
|---------|----------|
| フレームワーク | Next.js 14 (App Router) |
| スタイリング | Tailwind CSS |
| アニメーション | Framer Motion |
| アイコン | Lucide React / カスタムSVG |
| フォント | @fontsource/press-start-2p |

---

## 10. 参考リソース

- [Y2K Ecommerce - Dribbble](https://dribbble.com/shots/22715311-Y2K-Ecommerce)
- [Press Start 2P - Google Fonts](https://fonts.google.com/specimen/Press+Start+2P)
- [Windows 95 CSS Art - Reference](https://95.css.atom.so/)
