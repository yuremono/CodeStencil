"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Window95, RetroCard } from "@/components/y2k";
import { PixelButton } from "@/components/y2k";
import { y2kProducts } from "@/data/y2k-products";
import { useY2KCart } from "@/context/y2k-cart-context";
import { ArrowLeft, ShoppingCart, Home, Star } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const { addToCart, cart, updateQuantity } = useY2KCart();
  const productId = params.id as string;

  const product = y2kProducts.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.product.id === productId);
  const currentQuantity = cartItem?.quantity || 0;

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#000033] via-[#1a0033] to-[#001a00] flex items-center justify-center p-4">
        <Window95
          title="Error"
          width="400px"
        >
          <div className="text-center py-8">
            <p className="font-mono text-black mb-4">
              商品が見つかりませんでした
            </p>
            <Link href="/y2k/catalog">
              <PixelButton variant="default">
                カタログに戻る
              </PixelButton>
            </Link>
          </div>
        </Window95>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleUpdateQuantity = (delta: number) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity > 0) {
      updateQuantity(product.id, newQuantity);
    } else if (cartItem) {
      // 0にする場合は削除
      updateQuantity(product.id, 0);
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
              <Link href="/y2k/catalog">
                <PixelButton variant="default" size="sm">
                  <ArrowLeft size={14} />
                  Catalog
                </PixelButton>
              </Link>
              <h1 className="text-white font-mono font-bold text-xl">
                {product.name}
              </h1>
            </div>
            <Link href="/y2k/cart">
              <PixelButton variant="primary" size="sm">
                <ShoppingCart size={14} />
                Cart
              </PixelButton>
            </Link>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 商品画像エリア */}
          <Window95
            title="Product Image"
            showControls={false}
          >
            <div className="aspect-square bg-gradient-to-br from-[#ff00ff] via-[#00ffff] to-[#ffff00] flex items-center justify-center">
              <div className="text-center">
                <div className="w-48 h-48 bg-black/20 backdrop-blur-sm flex items-center justify-center mb-4">
                  <span className="font-mono text-6xl">
                    {product.category === "software" ? "💾" :
                     product.category === "hardware" ? "🖥️" :
                     product.category === "gaming" ? "🎮" :
                     product.category === "audio" ? "📻" :
                     product.category === "toys" ? "🧸" :
                     product.category === "media" ? "📼" :
                     product.category === "fashion" ? "👟" :
                     product.category === "storage" ? "💿" :
                     product.category === "survival" ? "🕯️" : "📦"}
                  </span>
                </div>
                <span className="font-mono text-sm bg-black/50 text-white px-2 py-1">
                  {product.category.toUpperCase()}
                </span>
              </div>
            </div>
          </Window95>

          {/* 商品情報エリア */}
          <div className="space-y-4">
            {/* 商品基本情報 */}
            <RetroCard
              variant="default"
              title={product.name}
              subtitle={`¥${product.price.toLocaleString()}`}
            >
              <p className="text-sm text-gray-700 mb-4">
                {product.description}
              </p>

              {/* 評価（ダミー） */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                ))}
                <span className="text-xs font-mono text-gray-600">
                  (4.0) 42 reviews
                </span>
              </div>

              {/* タグ */}
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono bg-[#000080] text-white px-2 py-1"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* 在庫状況 */}
              <div className="border-2 border-[#808080] p-2 mb-4 bg-white">
                <p className="text-xs font-mono text-black">
                  {product.stock > 10 ? (
                    <span className="text-green-600">◎ 在庫あり ({product.stock}個)</span>
                  ) : product.stock > 0 ? (
                    <span className="text-orange-600">△ 残りわずか ({product.stock}個)</span>
                  ) : (
                    <span className="text-red-600">× 売切れ</span>
                  )}
                </p>
              </div>

              {/* カート操作 */}
              <div className="space-y-2">
                {currentQuantity > 0 ? (
                  <div className="flex items-center gap-2">
                    <PixelButton
                      variant="default"
                      size="sm"
                      onClick={() => handleUpdateQuantity(-1)}
                    >
                      -
                    </PixelButton>
                    <div className="flex-1 text-center font-mono font-bold">
                      {currentQuantity} in cart
                    </div>
                    <PixelButton
                      variant="default"
                      size="sm"
                      onClick={() => handleUpdateQuantity(1)}
                      disabled={currentQuantity >= product.stock}
                    >
                      +
                    </PixelButton>
                  </div>
                ) : (
                  <PixelButton
                    variant="primary"
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={14} />
                    カートに追加
                  </PixelButton>
                )}

                <Link href="/y2k/cart" className="block">
                  <PixelButton
                    variant="success"
                    className="w-full"
                    disabled={currentQuantity === 0}
                  >
                    レジに進む
                  </PixelButton>
                </Link>
              </div>
            </RetroCard>

            {/* Y2K豆知識ウィンドウ */}
            <Window95
              title="Y2K Trivia"
              showControls={false}
            >
              <div className="text-xs font-mono text-black space-y-2">
                <p>• 1999年、Y2K問題への懸念で大騒動でした</p>
                <p>• 懐かしの56kモデムで接続音が聞けるかも？</p>
                <p>• フロッピーディスクは1.44MBの大容量！</p>
              </div>
            </Window95>
          </div>
        </div>

        {/* 関連商品 */}
        <div className="mt-8">
          <h2 className="text-white font-mono font-bold text-lg mb-4">
            RELATED PRODUCTS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {y2kProducts
              .filter((p) => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((related) => (
                <Link key={related.id} href={`/y2k/product/${related.id}`}>
                  <RetroCard variant="default" size="sm" className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="w-full h-20 bg-gradient-to-br from-[#ff00ff] to-[#00ffff] mb-2 flex items-center justify-center">
                      <span className="font-mono text-[10px] bg-black/50 text-white px-1">
                        {related.category.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs font-bold font-mono truncate">{related.name}</p>
                    <p className="text-sm font-mono text-green-600">
                      ¥{related.price.toLocaleString()}
                    </p>
                  </RetroCard>
                </Link>
              ))}
          </div>
        </div>
      </main>
    </div>
  );
}
