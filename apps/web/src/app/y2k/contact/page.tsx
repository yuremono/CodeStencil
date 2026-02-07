"use client";

import React from "react";
import Link from "next/link";
import { Window95 } from "@/components/y2k/Window95";
import { RetroCard } from "@/components/y2k/RetroCard";
import { PixelButton } from "@/components/y2k/PixelButton";

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#000033] via-[#1a0033] to-[#001a00]">
      {/* スター背景アニメーション */}
      <div className="fixed inset-0 pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* スキャンライン効果 */}
      <div className="fixed inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.1)_2px,rgba(0,0,0,0.1)_4px)]" />

      {/* メインコンテンツ */}
      <div className="relative z-10 p-8">
        {/* ヘッダーナビゲーション */}
        <div className="mb-6 flex gap-2">
          <Link href="/y2k">
            <PixelButton variant="default" size="sm">
              ← Home
            </PixelButton>
          </Link>
          <Link href="/y2k/catalog">
            <PixelButton variant="default" size="sm">
              Catalog
            </PixelButton>
          </Link>
          <Link href="/y2k/about">
            <PixelButton variant="default" size="sm">
              About
            </PixelButton>
          </Link>
        </div>

        {/* メインウィンドウ */}
        <div className="flex justify-center">
          <Window95
            title="Contact - Y2K E-Commerce"
            width="700px"
            showControls={false}
          >
            <div className="space-y-4">
              {/* お問い合わせフォーム */}
              <RetroCard
                title="お問い合わせフォーム"
                variant="default"
                className="bg-white"
              >
                <form className="space-y-3 text-sm font-mono">
                  <div>
                    <label className="block text-black font-bold mb-1">
                      お名前:
                    </label>
                    <input
                      type="text"
                      className="w-full bg-white border-2 border-[#808080] px-2 py-1 font-mono text-sm text-black focus:outline-none focus:border-[#000080]"
                      placeholder="山田太郎"
                    />
                  </div>

                  <div>
                    <label className="block text-black font-bold mb-1">
                      メールアドレス:
                    </label>
                    <input
                      type="email"
                      className="w-full bg-white border-2 border-[#808080] px-2 py-1 font-mono text-sm text-black focus:outline-none focus:border-[#000080]"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-black font-bold mb-1">
                      お問い合わせ種別:
                    </label>
                    <select className="w-full bg-white border-2 border-[#808080] px-2 py-1 font-mono text-sm text-black focus:outline-none focus:border-[#000080]">
                      <option value="">選択してください</option>
                      <option value="order">ご注文について</option>
                      <option value="product">商品について</option>
                      <option value="shipping">配送について</option>
                      <option value="other">その他</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-black font-bold mb-1">
                      お問い合わせ内容:
                    </label>
                    <textarea
                      rows={4}
                      className="w-full bg-white border-2 border-[#808080] px-2 py-1 font-mono text-sm text-black focus:outline-none focus:border-[#000080] resize-none"
                      placeholder="お問い合わせ内容をご記入ください..."
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <PixelButton variant="primary" type="submit">
                      送信する
                    </PixelButton>
                  </div>
                </form>
              </RetroCard>

              {/* 連絡先情報 */}
              <RetroCard
                title="連絡先情報"
                variant="neon"
                className="bg-[#1a0a2e]"
              >
                <div className="space-y-3 text-sm font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-[#ff00ff] text-lg">📧</span>
                    <div>
                      <p className="text-[#00ffff] text-xs">Email</p>
                      <p className="text-white">contact@y2k-ecommerce.example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#ff00ff] text-lg">📍</span>
                    <div>
                      <p className="text-[#00ffff] text-xs">Address</p>
                      <p className="text-white">〒100-0001 東京都千代田区...</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[#ff00ff] text-lg">⏰</span>
                    <div>
                      <p className="text-[#00ffff] text-xs">Business Hours</p>
                      <p className="text-white">平日 10:00 - 18:00 (JST)</p>
                    </div>
                  </div>
                </div>
              </RetroCard>

              {/* SNSリンク */}
              <RetroCard
                title="SNS & コミュニティ"
                variant="vaporwave"
                className="bg-gradient-to-br from-[#ff6ec7] to-[#7873f5]"
              >
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <PixelButton variant="default" className="w-full bg-white text-black">
                      𝕏 Twitter
                    </PixelButton>
                  </Link>
                  <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <PixelButton variant="default" className="w-full bg-white text-black">
                      📸 Instagram
                    </PixelButton>
                  </Link>
                  <Link href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                    <PixelButton variant="default" className="w-full bg-white text-black">
                      🎵 TikTok
                    </PixelButton>
                  </Link>
                  <Link href="https://discord.com" target="_blank" rel="noopener noreferrer">
                    <PixelButton variant="default" className="w-full bg-white text-black">
                      💬 Discord
                    </PixelButton>
                  </Link>
                </div>
              </RetroCard>

              {/* よくある質問リンク */}
              <div className="text-center pt-2 border-t-2 border-[#808080]">
                <p className="font-mono text-xs text-gray-600 mb-2">
                  よくある質問はこちらをチェックしてください
                </p>
                <Link href="/y2k/faq">
                  <PixelButton variant="success" size="sm">
                    FAQ を見る
                  </PixelButton>
                </Link>
              </div>
            </div>
          </Window95>
        </div>
      </div>

      {/* タスクバー風フッター */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 z-50">
        <PixelButton variant="default" size="sm" className="font-bold">
          Start
        </PixelButton>
        <div className="flex-1 mx-2 h-8 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] px-2 flex items-center">
          <span className="text-xs font-mono text-gray-600">Y2K E-Commerce - Contact</span>
        </div>
        <div className="bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] px-3 py-1 font-mono text-xs">
          {new Date().toLocaleString("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
