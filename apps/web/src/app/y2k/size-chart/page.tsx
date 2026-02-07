"use client";

import React from "react";
import Link from "next/link";
import { Window95 } from "@/components/y2k/Window95";
import { RetroCard } from "@/components/y2k/RetroCard";
import { PixelButton } from "@/components/y2k/PixelButton";

export default function SizeChartPage() {
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
            title="Size Chart - Y2K E-Commerce"
            width="800px"
            showControls={false}
          >
            <div className="space-y-4">
              {/* サイズ表 */}
              <RetroCard
                title="サイズ表"
                variant="default"
                className="bg-white"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm font-mono text-black border-collapse">
                    <thead>
                      <tr className="bg-[#000080] text-white">
                        <th className="border-2 border-[#808080] px-3 py-2 text-left">サイズ</th>
                        <th className="border-2 border-[#808080] px-3 py-2 text-left">身長</th>
                        <th className="border-2 border-[#808080] px-3 py-2 text-left">バスト</th>
                        <th className="border-2 border-[#808080] px-3 py-2 text-left">ウエスト</th>
                        <th className="border-2 border-[#808080] px-3 py-2 text-left">ヒップ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-2 border-[#808080] px-3 py-2 font-bold">XS</td>
                        <td className="border-2 border-[#808080] px-3 py-2">~155cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">76-80cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">58-62cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">82-86cm</td>
                      </tr>
                      <tr className="bg-[#e0e0e0]">
                        <td className="border-2 border-[#808080] px-3 py-2 font-bold">S</td>
                        <td className="border-2 border-[#808080] px-3 py-2">155-160cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">80-84cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">62-66cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">86-90cm</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-[#808080] px-3 py-2 font-bold">M</td>
                        <td className="border-2 border-[#808080] px-3 py-2">160-165cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">84-88cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">66-70cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">90-94cm</td>
                      </tr>
                      <tr className="bg-[#e0e0e0]">
                        <td className="border-2 border-[#808080] px-3 py-2 font-bold">L</td>
                        <td className="border-2 border-[#808080] px-3 py-2">165-170cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">88-92cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">70-74cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">94-98cm</td>
                      </tr>
                      <tr>
                        <td className="border-2 border-[#808080] px-3 py-2 font-bold">XL</td>
                        <td className="border-2 border-[#808080] px-3 py-2">170-175cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">92-96cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">74-78cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">98-102cm</td>
                      </tr>
                      <tr className="bg-[#e0e0e0]">
                        <td className="border-2 border-[#808080] px-3 py-2 font-bold">XXL</td>
                        <td className="border-2 border-[#808080] px-3 py-2">175cm~</td>
                        <td className="border-2 border-[#808080] px-3 py-2">96-100cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">78-82cm</td>
                        <td className="border-2 border-[#808080] px-3 py-2">102-106cm</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </RetroCard>

              {/* 測り方ガイド */}
              <RetroCard
                title="測り方ガイド"
                variant="neon"
                className="bg-[#1a0a2e]"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                  <div>
                    <p className="text-[#ff00ff] font-bold mb-2">📏 バスト</p>
                    <p className="text-white text-xs">
                      胸の最も高い部分を水平に測ります。
                      軽く呼吸を止めて測定してください。
                    </p>
                  </div>
                  <div>
                    <p className="text-[#ff00ff] font-bold mb-2">📏 ウエスト</p>
                    <p className="text-white text-xs">
                      くびれの最も細い部分を水平に測ります。
                      腰を曲げずに立った状態で測定してください。
                    </p>
                  </div>
                  <div>
                    <p className="text-[#ff00ff] font-bold mb-2">📏 ヒップ</p>
                    <p className="text-white text-xs">
                      お尻の最も高い部分を水平に測ります。
                      足を揃えて立った状態で測定してください。
                    </p>
                  </div>
                  <div>
                    <p className="text-[#ff00ff] font-bold mb-2">💡 ヒント</p>
                    <p className="text-white text-xs">
                      サイズが中間の場合は、
                      ゆったり着たい場合は大きいサイズを、
                      ピッタリ着たい場合は小さいサイズをお選びください。
                    </p>
                  </div>
                </div>
              </RetroCard>

              {/* サイズ選択のヒント */}
              <RetroCard
                title="サイズ選択のヒント"
                variant="matrix"
                className="bg-black"
              >
                <div className="space-y-2 text-xs font-mono text-[#00ff00]">
                  <p>→ オーバーサイズをお好みの場合は、1サイズ上をお選びください</p>
                  <p>→ 日本サイズよりも若干大きめの作りになっています</p>
                  <p>→ 不明な点は、お問い合わせフォームからご連絡ください</p>
                  <p className="text-[#ff00ff] animate-pulse">
                    ※ 商品によりサイズ感が異なる場合がございます
                  </p>
                </div>
              </RetroCard>

              {/* アクションボタン */}
              <div className="flex gap-2 justify-center pt-4 border-t-2 border-[#808080]">
                <Link href="/y2k/catalog">
                  <PixelButton variant="primary">
                    カタログに戻る
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
          <span className="text-xs font-mono text-gray-600">Y2K E-Commerce - Size Chart</span>
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
