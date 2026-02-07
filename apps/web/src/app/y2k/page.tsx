"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Window95, DesktopFolder, Winamp, ChatWindow } from "@/components/y2k";
import { PixelButton } from "@/components/y2k";
import { y2kProducts } from "@/data/y2k-products";
import type { Product } from "@/context/y2k-cart-context";

// デスクトップアイコン型
interface DesktopIcon {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
}

// デスクトップアイコンのSVG
const ShoppingIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400">
    <rect x="8" y="12" width="32" height="24" rx="2" fill="currentColor" />
    <rect x="12" y="16" width="24" height="16" fill="#000" />
    <rect x="20" y="38" width="8" height="2" fill="currentColor" />
    <rect x="16" y="40" width="16" height="2" fill="currentColor" />
  </svg>
);

const CatalogIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-400">
    <rect x="8" y="8" width="16" height="14" fill="currentColor" />
    <rect x="24" y="8" width="16" height="14" fill="currentColor" />
    <rect x="8" y="26" width="16" height="14" fill="currentColor" />
    <rect x="24" y="26" width="16" height="14" fill="currentColor" />
  </svg>
);

const CartIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-400">
    <circle cx="16" cy="38" r="4" fill="currentColor" />
    <circle cx="34" cy="38" r="4" fill="currentColor" />
    <path d="M10 10 L14 10 L18 30 L38 30 L42 14 L18 14" stroke="currentColor" strokeWidth="3" fill="none" />
  </svg>
);

const ReadmeIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
    <rect x="10" y="6" width="28" height="36" rx="2" fill="currentColor" />
    <rect x="14" y="12" width="20" height="2" fill="#000" />
    <rect x="14" y="18" width="16" height="2" fill="#000" />
    <rect x="14" y="24" width="18" height="2" fill="#000" />
    <rect x="14" y="30" width="12" height="2" fill="#000" />
  </svg>
);

const AboutIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-400">
    <circle cx="24" cy="16" r="8" fill="currentColor" />
    <path d="M12 40 C12 32, 18 28, 24 28 C30 28, 36 32, 36 40" fill="currentColor" />
  </svg>
);

const ContactIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-400">
    <rect x="8" y="10" width="32" height="28" rx="2" fill="currentColor" />
    <path d="M8 14 L24 24 L40 14" stroke="#000" strokeWidth="2" fill="none" />
  </svg>
);

const SizeChartIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
    <rect x="8" y="8" width="32" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="38" x2="40" y2="38" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="8" x2="18" y2="40" stroke="currentColor" strokeWidth="2" />
    <line x1="28" y1="8" x2="28" y2="40" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const WinampIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-400">
    <rect x="8" y="12" width="32" height="24" rx="2" fill="currentColor" />
    <rect x="12" y="16" width="24" height="8" fill="#000" />
    <circle cx="18" cy="30" r="2" fill="#00ff00" />
    <circle cx="24" cy="30" r="2" fill="#00ff00" />
    <circle cx="30" cy="30" r="2" fill="#00ff00" />
  </svg>
);

const ChatIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
    <rect x="8" y="10" width="32" height="24" rx="2" fill="currentColor" />
    <path d="M8 34 L16 42 L40 42 L40 34 Z" fill="currentColor" />
    <rect x="12" y="16" width="24" height="2" fill="#000" />
    <rect x="12" y="20" width="20" height="2" fill="#000" />
    <rect x="12" y="24" width="16" height="2" fill="#000" />
  </svg>
);

const WishlistIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-400">
    <path d="M24 42 C24 42, 8 28, 8 16 C8 10, 12 6, 18 6 C21 6, 24 9, 24 9 C24 9, 27 6, 30 6 C36 6, 40 10, 40 16 C40 28, 24 42, 24 42 Z" fill="currentColor" />
  </svg>
);

const SizeChartIcon = () => (
  <svg width={48} height={48} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-cyan-400">
    <rect x="8" y="8" width="32" height="32" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="18" x2="40" y2="18" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="2" />
    <line x1="8" y1="38" x2="40" y2="38" stroke="currentColor" strokeWidth="2" />
    <line x1="18" y1="8" x2="18" y2="40" stroke="currentColor" strokeWidth="2" />
    <line x1="28" y1="8" x2="28" y2="40" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default function Y2KPage() {
  const [openWindow, setOpenWindow] = useState<string | null>(null);
  const [featuredProduct] = useState<Product>(y2kProducts[0]);

  const desktopIcons: DesktopIcon[] = [
    { id: "catalog", label: "Catalog", icon: <CatalogIcon />, href: "/y2k/catalog" },
    { id: "cart", label: "Cart", icon: <CartIcon />, href: "/y2k/cart" },
    { id: "readme", label: "README", icon: <ReadmeIcon />, href: "/y2k/readme" },
    { id: "about", label: "About Us", icon: <AboutIcon />, href: "/y2k/about" },
    { id: "contact", label: "Contact", icon: <ContactIcon />, href: "/y2k/contact" },
    { id: "size-chart", label: "Size Chart", icon: <SizeChartIcon />, href: "/y2k/size-chart" },
  ];

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

      {/* デスクトップアイコン */}
      <div className="relative z-10 p-8 grid grid-cols-1 gap-8 content-start min-h-[calc(100vh-48px)]">
        {/* Shoppingフォルダ（メイン） */}
        <DesktopFolder
          label="Y2K Shopping"
          isOpen={openWindow === "shopping"}
          onClick={() => setOpenWindow("shopping")}
          icon={<ShoppingIcon />}
        />

        {/* カタログ */}
        <Link href="/y2k/catalog">
          <DesktopFolder
            label="Catalog"
            icon={<CatalogIcon />}
          />
        </Link>

        {/* カート */}
        <Link href="/y2k/cart">
          <DesktopFolder
            label="Cart"
            icon={<CartIcon />}
          />
        </Link>

        {/* README */}
        <Link href="/y2k/readme">
          <DesktopFolder
            label="README"
            icon={<ReadmeIcon />}
          />
        </Link>

        {/* About Us */}
        <Link href="/y2k/about">
          <DesktopFolder
            label="About Us"
            icon={<AboutIcon />}
          />
        </Link>

        {/* Contact */}
        <Link href="/y2k/contact">
          <DesktopFolder
            label="Contact"
            icon={<ContactIcon />}
          />
        </Link>

        {/* Size Chart */}
        <Link href="/y2k/size-chart">
          <DesktopFolder
            label="Size Chart"
            icon={<SizeChartIcon />}
          />
        </Link>
      </div>

      {/* ウェルカムウィンドウ */}
      {openWindow === "shopping" && (
        <div className="fixed inset-0 flex items-center justify-center p-8 z-20">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpenWindow(null)} />
          <Window95
            title="Y2K E-Commerce - Welcome!"
            onClose={() => setOpenWindow(null)}
            width="500px"
            className="relative z-30"
          >
            <div className="space-y-4">
              {/* Marquee風メッセージ */}
              <div className="bg-black text-green-400 font-mono text-sm p-2 border-2 border-[#808080]">
                <p className="animate-pulse">*** ようこそY2Kショッピングへ！ミレニアムセール開催中！ ***</p>
              </div>

              {/* 注目商品 */}
              <div className="border-2 border-[#808080] p-4 bg-white">
                <h3 className="font-mono font-bold text-sm mb-2 text-black">FEATURED PRODUCT</h3>
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#ff00ff] to-[#00ffff] flex items-center justify-center text-xs font-mono">
                    IMG
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold font-mono text-black">{featuredProduct.name}</h4>
                    <p className="text-xs text-gray-600 mt-1">{featuredProduct.description}</p>
                    <p className="text-lg font-mono font-bold text-green-600 mt-2">
                      ¥{featuredProduct.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* ボタン */}
              <div className="flex flex-wrap gap-2">
                <Link href="/y2k/catalog">
                  <PixelButton variant="primary">
                    カタログを見る
                  </PixelButton>
                </Link>
                <Link href="/y2k/cart">
                  <PixelButton variant="default">
                    カートを確認
                  </PixelButton>
                </Link>
                <Link href="/y2k/about">
                  <PixelButton variant="default">
                    About Us
                  </PixelButton>
                </Link>
                <Link href="/y2k/contact">
                  <PixelButton variant="default">
                    お問い合わせ
                  </PixelButton>
                </Link>
              </div>

              {/* Y2Kカウンター */}
              <div className="bg-black text-[#00ff00] font-mono text-xs p-2 border-2 border-[#00ff00]">
                <p>Y2Kまであと: ---日 --時間 --分 --秒</p>
                <p className="text-[#ff00ff] mt-1">*** 準備はいい？ ***</p>
              </div>
            </div>
          </Window95>
        </div>
      )}

      {/* タスクバー風フッター */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-[#c0c0c0] border-t-2 border-white flex items-center px-2 z-50">
        <PixelButton variant="default" size="sm" className="font-bold">
          Start
        </PixelButton>
        <div className="flex-1 mx-2 h-8 bg-[#c0c0c0] border-t border-l border-white border-b border-r border-[#808080] px-2 flex items-center">
          <span className="text-xs font-mono text-gray-600">Y2K E-Commerce v1.0</span>
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
