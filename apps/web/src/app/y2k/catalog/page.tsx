"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Window95, RetroCard } from "@/components/y2k";
import { PixelButton } from "@/components/y2k";
import { y2kProducts } from "@/data/y2k-products";
import { useY2KCart } from "@/context/y2k-cart-context";
import { Search, ShoppingCart, Home } from "lucide-react";

export default function CatalogPage() {
  const { addToCart, getCartCount } = useY2KCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  // カテゴリ一覧
  const categories = useMemo(() => {
    const cats = ["all", ...new Set(y2kProducts.map((p) => p.category))];
    return cats;
  }, []);

  // フィルタリング済み商品
  const filteredProducts = useMemo(() => {
    return y2kProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // カートに追加
  const handleAddToCart = (productId: string) => {
    const product = y2kProducts.find((p) => p.id === productId);
    if (product) {
      addToCart(product);
      setAddedProduct(productId);
      setTimeout(() => setAddedProduct(null), 1000);
    }
  };

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
                Y2K CATALOG
              </h1>
            </div>
            <Link href="/y2k/cart">
              <PixelButton variant="primary" size="sm">
                <ShoppingCart size={14} />
                Cart ({getCartCount()})
              </PixelButton>
            </Link>
          </div>

          {/* Marquee風メッセージ */}
          <div className="mt-3 bg-black text-[#00ff00] font-mono text-sm p-2 border-2 border-[#808080]">
            <p className="animate-pulse">
              *** Y2Kセール開催中！*** 限定商品を見逃すな！ *** 56kモデムでアクセス中！ ***
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto p-4">
        {/* 検索・フィルターウィンドウ */}
        <Window95
          title="Search & Filter"
          className="mb-6"
          width="100%"
          showControls={false}
        >
          <div className="space-y-4">
            {/* 検索バー */}
            <div className="flex items-center gap-2">
              <Search size={16} className="text-black" />
              <input
                type="text"
                placeholder="商品を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-white border-2 border-[#808080] border-t border-l border-white px-2 py-1 font-mono text-sm focus:outline-none"
              />
            </div>

            {/* カテゴリフィルター */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 font-mono text-xs border-2 ${
                    selectedCategory === category
                      ? "bg-[#000080] text-white border-[#808080]"
                      : "bg-[#c0c0c0] text-black border-t border-l border-white border-b border-r border-[#808080]"
                  }`}
                >
                  {category.toUpperCase()}
                </button>
              ))}
            </div>

            {/* 結果数 */}
            <div className="text-xs font-mono text-black">
              {filteredProducts.length} items found
            </div>
          </div>
        </Window95>

        {/* 商品グリッド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => (
            <RetroCard
              key={product.id}
              variant="default"
              size="default"
              title={product.name}
              subtitle={`¥${product.price.toLocaleString()}`}
              className="hover:shadow-lg transition-shadow"
            >
              {/* 商品画像プレースホルダー */}
              <div className="w-full h-32 bg-gradient-to-br from-[#ff00ff] to-[#00ffff] mb-3 flex items-center justify-center">
                <span className="font-mono text-xs bg-black/50 text-white px-2 py-1">
                  {product.category.toUpperCase()}
                </span>
              </div>

              {/* 商品説明 */}
              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                {product.description}
              </p>

              {/* タグ */}
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono bg-[#000080] text-white px-1 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* 在庫状況 */}
              <div className="text-xs font-mono mb-3">
                {product.stock > 10 ? (
                  <span className="text-green-600">◎ 在庫あり</span>
                ) : product.stock > 0 ? (
                  <span className="text-orange-600">△ 残りわずか</span>
                ) : (
                  <span className="text-red-600">× 売切れ</span>
                )}
              </div>

              {/* アクションボタン */}
              <div className="flex gap-2">
                <Link href={`/y2k/product/${product.id}`} className="flex-1">
                  <PixelButton variant="default" size="sm" className="w-full">
                    詳細
                  </PixelButton>
                </Link>
                <PixelButton
                  variant="primary"
                  size="sm"
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0 || addedProduct === product.id}
                  className={addedProduct === product.id ? "state-active" : ""}
                >
                  {addedProduct === product.id ? "Added!" : "Cart"}
                </PixelButton>
              </div>
            </RetroCard>
          ))}
        </div>

        {/* 商品がない場合 */}
        {filteredProducts.length === 0 && (
          <Window95
            title="No Results"
            className="text-center"
            width="400px"
            showControls={false}
          >
            <div className="py-8">
              <p className="font-mono text-black mb-4">
                該当する商品が見つかりませんでした
              </p>
              <PixelButton
                variant="default"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                リセット
              </PixelButton>
            </div>
          </Window95>
        )}
      </main>
    </div>
  );
}
