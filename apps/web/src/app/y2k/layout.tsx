import { Y2KCartProvider } from "@/context/y2k-cart-context";
import { Y2KWishlistProvider } from "@/context/y2k-wishlist-context";
import "./globals.css";
import { Y2KFonts } from "./y2k-fonts";

export default function Y2KLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Y2KCartProvider>
      <Y2KWishlistProvider>
        <Y2KFonts />
        {children}
      </Y2KWishlistProvider>
    </Y2KCartProvider>
  );
}
