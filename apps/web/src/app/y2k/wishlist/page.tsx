"use client";

import React from "react";
import Link from "next/link";
import { Window95, RetroCard } from "@/components/y2k";
import { PixelButton } from "@/components/y2k";
import { useY2KWishlist } from "@/context/y2k-wishlist-context";
import { ArrowLeft, Home, Trash2, Heart, ShoppingBag } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist, getWishlistCount } = useY2KWishlist();

  const handleClearWishlist = () => {
    if (confirm("ウィッシュリストをクリアしますか？")) {
      clearWishlist();
    }
  };

  const isEmpty = wishlist.length === 0;

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
              <Link href="/y2k/catalog">
                <PixelButton variant="default" size="sm">
                  <ArrowLeft size={14} />
                  Catalog
                </PixelButton>
              </Link>
              <h1 className="text-white font-mono font-bold text-xl flex items-center gap-2">
                <Heart size={20} className="text-[#ff00ff]" />
                WISHLIST
              </h1>
            </div>
            <div className="text-white font-mono text-sm">
              {getWishlistCount()} items
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto p-4">
        {isEmpty ? (
          /* 空ウィッシュリスト表示 */
          <Window95
            title="Your Wishlist is Empty"
            width="500px"
            className="mx-auto"
          >
            <div className="text-center py-8">
              <div className="text-6xl mb-4">
                <Heart size={64} className="mx-auto text-gray-400" />
              </div>
              <p className="font-mono text-black mb-4">
                ウィッシュリストに商品がありません
              </p>
              <p className="font-mono text-xs text-gray-600 mb-6">
                気になるY2Kグッズを追加しておこう！
              </p>
              <Link href="/y2k/catalog">
                <PixelButton variant="primary">
                  カタログを見る
                </PixelButton>
              </Link>
            </div>
          </Window95>
        ) : (
          /* ウィッシュリスト内容 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ウィッシュリストアイテムリスト */}
            <div className="lg:col-span-2 space-y-4">
              {/* ヘッダーアクション */}
              <div className="flex justify-between items-center">
                <h2 className="text-white font-mono font-bold text-lg">
                  SAVED ITEMS ({wishlist.length})
                </h2>
                <PixelButton
                  variant="danger"
                  size="sm"
                  onClick={handleClearWishlist}
                >
                  <Trash2 size={12} />
                  Clear All
                </PixelButton>
              </div>

              {/* ウィッシュリストアイテム */}
              {wishlist.map((item) => (
                <RetroCard
                  key={item.product.id}
                  variant="default"
                  size="sm"
                  className="flex flex-col sm:flex-row gap-4"
                >
                  {/* 商品画像 */}
                  <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-[#ff00ff] to-[#00ffff] flex items-center justify-center flex-shrink-0">
                    <span className="font-mono text-xs bg-black/50 text-white px-1">
                      {item.product.category.toUpperCase()}
                    </span>
                  </div>

                  {/* 商品情報 */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/y2k/product/${item.product.id}`}>
                      <h3 className="font-mono font-bold text-black hover:underline cursor-pointer truncate">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                      {item.product.description}
                    </p>
                    <p className="text-sm font-mono text-green-600 mt-1">
                      ¥{item.product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Added: {new Date(item.addedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* アクション */}
                  <div className="flex flex-col gap-2 items-end justify-between">
                    <PixelButton
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromWishlist(item.product.id)}
                    >
                      <Trash2 size={10} />
                    </PixelButton>
                    <Link href={`/y2k/product/${item.product.id}`}>
                      <PixelButton variant="primary" size="sm">
                        View
                      </PixelButton>
                    </Link>
                  </div>
                </RetroCard>
              ))}
            </div>

            {/* サイドバー */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* ウィッシュリストサマリー */}
                <Window95
                  title="Wishlist Summary"
                  showControls={false}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-sm">
                      <span>Total Items</span>
                      <span>{getWishlistCount()}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm">
                      <span>Total Value</span>
                      <span>
                        ¥{wishlist.reduce((sum, item) => sum + item.product.price, 0).toLocaleString()}
                      </span>
                    </div>

                    {/* アクションボタン */}
                    <div className="pt-3 space-y-2">
                      <Link href="/y2k/cart">
                        <PixelButton variant="primary" className="w-full">
                          <ShoppingBag size={14} />
                          View Cart
                        </PixelButton>
                      </Link>
                      <Link href="/y2k/catalog">
                        <PixelButton variant="default" className="w-full">
                          Continue Shopping
                        </PixelButton>
                      </Link>
                    </div>
                  </div>
                </Window95>

                {/* Y2K豆知識 */}
                <Window95
                  title="Y2K Nostalgia"
                  showControls={false}
                >
                  <div className="text-xs font-mono text-black space-y-2">
                    <p>• ウィッシュリストは「お気に入り」のこと</p>
                    <p>• 懐かしのブックマーク機能</p>
                    <p>• 後で買う予定のアイテムを保存</p>
                  </div>
                </Window95>

                {/* シェア（ダミー） */}
                <Window95
                  title="Share Wishlist"
                  showControls={false}
                >
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={`https://y2k-store.com/wishlist/${Math.random().toString(36).substring(7)}`}
                      readOnly
                      className="w-full bg-white border-2 border-[#808080] border-t border-l border-white px-2 py-1 font-mono text-xs"
                    />
                    <PixelButton variant="default" className="w-full" size="sm">
                      Copy Link
                    </PixelButton>
                  </div>
                </Window95>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
