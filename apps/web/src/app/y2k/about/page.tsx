"use client";

import React from "react";
import Link from "next/link";
import { Window95 } from "@/components/y2k/Window95";
import { RetroCard } from "@/components/y2k/RetroCard";
import { PixelButton } from "@/components/y2k/PixelButton";

export default function AboutPage() {
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
          <Link href="/y2k/contact">
            <PixelButton variant="default" size="sm">
              Contact
            </PixelButton>
          </Link>
        </div>

        {/* メインウィンドウ */}
        <div className="flex justify-center">
          <Window95
            title="About Us - Y2K E-Commerce"
            width="700px"
            showControls={false}
          >
            <div className="space-y-4">
              {/* Y2Kストーリーカード */}
              <RetroCard
                title="Y2Kストーリー"
                variant="default"
                className="bg-white"
              >
                <div className="space-y-3 text-sm font-mono text-black">
                  <p>
                    <span className="font-bold">Y2K E-Commerce</span> は、
                    ミレニアムムーブメントの精神を受け継ぐ、懐かしくて新しい
                    ショッピング体験を提供します。
                  </p>
                  <p>
                    1999年の興奮と、2024年のテクノロジーが出会う場所。
                    そこが私たちのスタートラインです。
                  </p>
                  <div className="bg-black text-[#00ff00] p-2 border-2 border-[#808080]">
                    <p className="text-xs">
                      > SYSTEM MESSAGE: Welcome to the future of retro shopping
                    </p>
                  </div>
                </div>
              </RetroCard>

              {/* ミッションステートメント */}
              <RetroCard
                title="ミッションステートメント"
                variant="neon"
                className="bg-[#1a0a2e]"
              >
                <div className="space-y-2 text-sm font-mono">
                  <p className="text-[#ff00ff] drop-shadow-[0_0_5px_#ff00ff]">
                    🔮 ビジョン
                  </p>
                  <p className="text-white">
                    レトロフューチャーを世界に届ける
                  </p>

                  <p className="text-[#00ffff] mt-3">
                    🎯 ミッション
                  </p>
                  <p className="text-white">
                    Y2K美学と現代のテクノロジーを融合し、
                    ノスタルジックでイノベーティブなショッピング体験を提供する
                  </p>

                  <p className="text-[#ff00ff] mt-3">
                    💎 バリュー
                  </p>
                  <ul className="text-white text-xs space-y-1 ml-4">
                    <li>• 懐かしさと革新の両立</li>
                    <li>• コミュニティファースト</li>
                    <li>• サステナブルなファッション</li>
                    <li>• オープンで包括的な文化</li>
                  </ul>
                </div>
              </RetroCard>

              {/* タイムライン */}
              <RetroCard
                title="タイムライン"
                variant="matrix"
                className="bg-black"
              >
                <div className="space-y-2 text-xs font-mono text-[#00ff00]">
                  <div className="flex gap-2">
                    <span className="text-[#00ffff]">1999</span>
                    <span>Y2Kムーブメント全盛期</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#00ffff]">2000</span>
                    <span>ミレニアム到来</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#00ffff]">2024</span>
                    <span>Y2K E-Commerce ローンチ</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#ff00ff]">FUTURE</span>
                    <span className="animate-pulse">>>> 続く <<<</span>
                  </div>
                </div>
              </RetroCard>

              {/* アクションボタン */}
              <div className="flex gap-2 justify-center pt-4 border-t-2 border-[#808080]">
                <Link href="/y2k/catalog">
                  <PixelButton variant="primary">
                    ショッピングを始める
                  </PixelButton>
                </Link>
                <Link href="/y2k/contact">
                  <PixelButton variant="default">
                    お問い合わせ
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
          <span className="text-xs font-mono text-gray-600">Y2K E-Commerce - About Us</span>
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
