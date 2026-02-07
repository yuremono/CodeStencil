"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { Product } from "./y2k-cart-context";

// ウィッシュリストアイテム型定義
export interface WishlistItem {
  product: Product;
  addedAt: string;
}

// コンテキスト型定義
interface Y2KWishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getWishlistCount: () => number;
}

// コンテキスト作成
const Y2KWishlistContext = createContext<Y2KWishlistContextType | undefined>(undefined);

// プロバイダーコンポーネント
export function Y2KWishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);

  // ウィッシュリストに商品を追加
  const addToWishlist = useCallback((product: Product) => {
    setWishlist((prevWishlist) => {
      const existingItem = prevWishlist.find((item) => item.product.id === product.id);

      if (!existingItem) {
        return [
          ...prevWishlist,
          {
            product,
            addedAt: new Date().toISOString(),
          },
        ];
      }

      return prevWishlist;
    });
  }, []);

  // ウィッシュリストから商品を削除
  const removeFromWishlist = useCallback((productId: string) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.product.id !== productId)
    );
  }, []);

  // ウィッシュリストをクリア
  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // 商品がウィッシュリストにあるかチェック
  const isInWishlist = useCallback(
    (productId: string): boolean => {
      return wishlist.some((item) => item.product.id === productId);
    },
    [wishlist]
  );

  // ウィッシュリストの商品数を取得
  const getWishlistCount = useCallback(() => {
    return wishlist.length;
  }, [wishlist]);

  const value: Y2KWishlistContextType = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return <Y2KWishlistContext.Provider value={value}>{children}</Y2KWishlistContext.Provider>;
}

// フックを作成
export function useY2KWishlist() {
  const context = useContext(Y2KWishlistContext);
  if (!context) {
    throw new Error("useY2KWishlist must be used within Y2KWishlistProvider");
  }
  return context;
}
