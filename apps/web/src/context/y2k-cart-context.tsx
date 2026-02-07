"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

// 商品型定義
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  tags: string[];
  stock: number;
}

// カートアイテム型定義
export interface CartItem {
  product: Product;
  quantity: number;
}

// コンテキスト型定義
interface Y2KCartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

// コンテキスト作成
const Y2KCartContext = createContext<Y2KCartContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function Y2KCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // カートに商品を追加
  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prevCart, { product, quantity }];
    });
  }, []);

  // カートから商品を削除
  const removeFromCart = useCallback((productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  }, []);

  // 数量を更新
  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  // カートをクリア
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // 合計金額を取得
  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  // カート内の商品数を取得
  const getCartCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  const value: Y2KCartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
  };

  return <Y2KCartContext.Provider value={value}>{children}</Y2KCartContext.Provider>;
}

// フックを作成
export function useY2KCart() {
  const context = useContext(Y2KCartContext);
  if (!context) {
    throw new Error("useY2KCart must be used within Y2KCartProvider");
  }
  return context;
}
