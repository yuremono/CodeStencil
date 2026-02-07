"use client";

import React from "react";
import Link from "next/link";
import { Window95, RetroCard } from "@/components/y2k";
import { PixelButton } from "@/components/y2k";
import { useY2KCart } from "@/context/y2k-cart-context";
import { ArrowLeft, Home, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartCount } = useY2KCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (confirm("カートをクリアしますか？")) {
      clearCart();
    }
  };

  const isEmpty = cart.length === 0;

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
                SHOPPING CART
              </h1>
            </div>
            <div className="text-white font-mono text-sm">
              {getCartCount()} items
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="relative z-10 container mx-auto p-4">
        {isEmpty ? (
          /* 空カート表示 */
          <Window95
            title="Your Cart is Empty"
            width="500px"
            className="mx-auto"
          >
            <div className="text-center py-8">
              <div className="text-6xl mb-4">
                <ShoppingBag size={64} className="mx-auto text-gray-400" />
              </div>
              <p className="font-mono text-black mb-4">
                カートに商品が入っていません
              </p>
              <p className="font-mono text-xs text-gray-600 mb-6">
                懐かしのY2Kグッズを見に行きませんか？
              </p>
              <Link href="/y2k/catalog">
                <PixelButton variant="primary">
                  カタログを見る
                </PixelButton>
              </Link>
            </div>
          </Window95>
        ) : (
          /* カート内容 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* カートアイテムリスト */}
            <div className="lg:col-span-2 space-y-4">
              {/* ヘッダーアクション */}
              <div className="flex justify-between items-center">
                <h2 className="text-white font-mono font-bold text-lg">
                  CART ITEMS ({cart.length})
                </h2>
                <PixelButton
                  variant="danger"
                  size="sm"
                  onClick={handleClearCart}
                >
                  <Trash2 size={12} />
                  Clear All
                </PixelButton>
              </div>

              {/* カートアイテム */}
              {cart.map((item) => (
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
                  </div>

                  {/* 数量コントロール */}
                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex items-center gap-1">
                      <PixelButton
                        variant="default"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      >
                        <Minus size={10} />
                      </PixelButton>
                      <span className="w-12 text-center font-mono font-bold">
                        {item.quantity}
                      </span>
                      <PixelButton
                        variant="default"
                        size="sm"
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus size={10} />
                      </PixelButton>
                    </div>
                    <PixelButton
                      variant="danger"
                      size="sm"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 size={10} />
                    </PixelButton>
                  </div>

                  {/* 小計 */}
                  <div className="text-right font-mono font-bold text-lg">
                    ¥{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                </RetroCard>
              ))}
            </div>

            {/* 注文サマリー */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4">
                {/* 注文サマリーウィンドウ */}
                <Window95
                  title="Order Summary"
                  showControls={false}
                >
                  <div className="space-y-3">
                    {/* 小計 */}
                    <div className="flex justify-between font-mono text-sm">
                      <span>Subtotal</span>
                      <span>¥{getCartTotal().toLocaleString()}</span>
                    </div>

                    {/* 送料（ダミー） */}
                    <div className="flex justify-between font-mono text-sm">
                      <span>Shipping</span>
                      <span>¥{getCartTotal() >= 5000 ? "0 (Free!)" : "500"}</span>
                    </div>

                    {/* 消費税（ダミー） */}
                    <div className="flex justify-between font-mono text-sm">
                      <span>Tax (10%)</span>
                      <span>¥{Math.floor(getCartTotal() * 0.1).toLocaleString()}</span>
                    </div>

                    {/* 合計 */}
                    <div className="border-t-2 border-[#808080] pt-3">
                      <div className="flex justify-between font-mono font-bold text-lg">
                        <span>Total</span>
                        <span className="text-green-600">
                          ¥{(Math.floor(getCartTotal() * 1.1) + (getCartTotal() >= 5000 ? 0 : 500)).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* チェックアウトボタン */}
                    <div className="pt-3 space-y-2">
                      <PixelButton variant="primary" className="w-full">
                        Checkout
                      </PixelButton>
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
                  title="Did You Know?"
                  showControls={false}
                >
                  <div className="text-xs font-mono text-black space-y-2">
                    <p>• 2000年1月1日、世界は無事に迎えられました</p>
                    <p>• 懐かしの「ピーポー」という音</p>
                    <p>• iMac G3の5色は時代の象徴でした</p>
                  </div>
                </Window95>

                {/* クーポンコード（ダミー） */}
                <Window95
                  title="Coupon Code"
                  showControls={false}
                >
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Enter code..."
                      className="w-full bg-white border-2 border-[#808080] border-t border-l border-white px-2 py-1 font-mono text-sm"
                    />
                    <PixelButton variant="default" className="w-full" size="sm">
                      Apply
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
