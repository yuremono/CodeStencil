import { Y2KCartProvider } from "@/context/y2k-cart-context";
import "./y2k/globals.css";

export default function Y2KLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Y2KCartProvider>
      {children}
    </Y2KCartProvider>
  );
}
