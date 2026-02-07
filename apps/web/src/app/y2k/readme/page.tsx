"use client";

import React from "react";
import Link from "next/link";
import { Window95, RetroCard } from "@/components/y2k";
import { PixelButton } from "@/components/y2k";
import { Home, BookOpen, Star, Zap } from "lucide-react";

export default function ReadmePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#000033] via-[#1a0033] to-[#001a00] pb-16">
      {/* スキャンライン効果 */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />

      {/* ヘッダー */}
      <header className="relative z-10 bg-[#000080] border-b-4 border-[#808080] p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/y2k">
                <PixelButton variant="default" size="sm">
                  <Home size={14} />
                  Home
                </PixelButton>
              </Link>
              <h1 className="text-white font-mono font-bold text-xl">
                Y2K E-COMMERCE README
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto p-4 space-y-6">
        {/* タイトルセクション */}
        <Window95
          title="Welcome to Y2K E-Commerce!"
          showControls={false}
        >
          <div className="text-center py-4">
            <div className="text-6xl mb-4">
              <BookOpen size={64} className="mx-auto text-[#00ff00]" />
            </div>
            <h2 className="font-mono font-bold text-2xl text-black mb-2">
              Y2K E-Commerce v1.0
            </h2>
            <p className="font-mono text-sm text-gray-600">
              ミレニアム・ベストに捧げる、懐かしのEコマース体験
            </p>
          </div>
        </Window95>

        {/* 特徴 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RetroCard variant="neon" title="Authentic Y2K Design">
            <p className="text-sm text-[#00ffff]">
              Windows 98/2000風のUIで、2000年当時の雰囲気を再現
            </p>
          </RetroCard>

          <RetroCard variant="matrix" title="State Management">
            <p className="text-sm text-[#00ff00]">
              React Contextによるカート管理でシームレスな体験
            </p>
          </RetroCard>

          <RetroCard variant="vaporwave" title="Next.js App Router">
            <p className="text-sm text-white">
              最新のNext.jsで構築されたモダンなアーキテクチャ
            </p>
          </RetroCard>
        </div>

        {/* 使い方 */}
        <Window95
          title="How to Use"
          showControls={false}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-[#000080] text-white w-8 h-8 flex items-center justify-center font-mono font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-mono font-bold text-black">ホームから始める</h3>
                <p className="text-sm text-gray-600">
                  デスクトップ上の「Y2K Shopping」フォルダをクリックしてウェルカムウィンドウを開きます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#000080] text-white w-8 h-8 flex items-center justify-center font-mono font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-mono font-bold text-black">カタログから商品を選ぶ</h3>
                <p className="text-sm text-gray-600">
                  検索やカテゴリフィルターで探している商品を見つけます
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#000080] text-white w-8 h-8 flex items-center justify-center font-mono font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-mono font-bold text-black">商品詳細を確認</h3>
                <p className="text-sm text-gray-600">
                  商品をクリックして詳細情報やY2Kトリビアをチェック
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#000080] text-white w-8 h-8 flex items-center justify-center font-mono font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="font-mono font-bold text-black">カートに追加</h3>
                <p className="text-sm text-gray-600">
                  気に入った商品をカートに入れて、チェックアウトへ
                </p>
              </div>
            </div>
          </div>
        </Window95>

        {/* 技術スタック */}
        <Window95
          title="Tech Stack"
          showControls={false}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white border-2 border-[#808080]">
              <Zap className="mx-auto text-[#ff00ff] mb-2" size={24} />
              <p className="font-mono text-xs font-bold">Next.js 15</p>
            </div>
            <div className="text-center p-3 bg-white border-2 border-[#808080]">
              <Star className="mx-auto text-[#00ffff] mb-2" size={24} />
              <p className="font-mono text-xs font-bold">React 19</p>
            </div>
            <div className="text-center p-3 bg-white border-2 border-[#808080]">
              <Zap className="mx-auto text-[#ffff00] mb-2" size={24} />
              <p className="font-mono text-xs font-bold">TypeScript</p>
            </div>
            <div className="text-center p-3 bg-white border-2 border-[#808080]">
              <Star className="mx-auto text-[#00ff00] mb-2" size={24} />
              <p className="font-mono text-xs font-bold">Tailwind CSS</p>
            </div>
          </div>
        </Window95>

        {/* 機能一覧 */}
        <Window95
          title="Features"
          showControls={false}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="font-mono text-sm">商品カタログ（検索・フィルター対応）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="font-mono text-sm">商品詳細ページ</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="font-mono text-sm">カート機能（追加・削除・数量変更）</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="font-mono text-sm">在庫管理表示</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="font-mono text-sm">レスポンシブデザイン</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500" />
              <span className="font-mono text-sm">Y2K風アニメーション効果</span>
            </div>
          </div>
        </Window95>

        {/* ナビゲーションボタン */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/y2k/catalog">
            <PixelButton variant="primary">
              カタログを見る
            </PixelButton>
          </Link>
          <Link href="/y2k">
            <PixelButton variant="default">
              ホームに戻る
            </PixelButton>
          </Link>
        </div>

        {/* フッター */}
        <div className="text-center py-8">
          <p className="font-mono text-xs text-[#00ff00]">
            *** Made with nostalgia for the millennium ***
          </p>
          <p className="font-mono text-xs text-[#ff00ff] mt-2">
            © 2026 Y2K E-Commerce | Built with Next.js & React
          </p>
        </div>
      </main>
    </div>
  );
}
