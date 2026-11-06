"use client";

import { buttonStyles } from "@/components/tailgrids/core/button";
import { Badge } from "@/components/tailgrids/core/badge";
import { createContext, useEffect, useState, type ReactNode } from "react";
import Header from "@/components/Header";
import Link from "next/link";
import Footer from "@/components/Footer";
import "./globals.css";
import { usePathname, useRouter } from "next/navigation";
import { fetchProducts, Product } from "@/data/products";
import { doLogout } from "@/utils/login";

export interface GlobalDataContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  carts: Product[];
  setCarts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const GlobalDataContext = createContext<GlobalDataContextType | null>(null);
export const GlobalDataconText = GlobalDataContext;
export const globalsDatacontext = GlobalDataContext;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [carts, setCarts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((data) => setProducts(data as Product[]))
      .catch(() => setProducts([]));
  }, []);

  const handleLogout = () => {
    doLogout(router, "/login");
  };

  const isLoginPage = pathname === "/login";

  return (
    <GlobalDataContext.Provider value={{ products, setProducts, carts, setCarts }}>
      <html lang="th">
        <body className="font-sans antialiased min-h-screen flex flex-col bg-[#fdfdfd]">
          {!isLoginPage && <Header />}

          {!isLoginPage && (
            <nav className="mt-3 flex flex-wrap justify-center items-center gap-1.5 px-4">
              <Link
                href="/"
                className={buttonStyles({
                  appearance: pathname === "/" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Home
              </Link>

              <Link
                href="/calculator"
                className={buttonStyles({
                  appearance: pathname === "/calculator" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Calculator
              </Link>

              <Link
                href="/animation"
                className={buttonStyles({
                  appearance: pathname === "/animation" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Animation
              </Link>

              <Link
                href="/todos"
                className={buttonStyles({
                  appearance: pathname === "/todos" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Todos
              </Link>

              <Link
                href="/products"
                className={buttonStyles({
                  appearance: pathname === "/products" ? "fill" : "outline",
                  variant: "primary",
                  size: "sm",
                })}
              >
                Products ({products.length})
              </Link>

              {/* Carts with floating badge as taught in video 32 */}
              <div className="relative inline-flex items-center">
                <Link
                  href="/carts"
                  className={buttonStyles({
                    appearance: pathname === "/carts" ? "fill" : "outline",
                    variant: "primary",
                    size: "sm",
                  })}
                >
                  Carts
                </Link>
                {carts.length > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 bg-red-600 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-xs"
                    size="sm"
                  >
                    {carts.length}
                  </Badge>
                )}
              </div>

              {/* Logout button as taught in video 36 */}
              <button
                type="button"
                onClick={handleLogout}
                className={buttonStyles({
                  appearance: "outline",
                  variant: "danger",
                  size: "sm",
                  className: "ml-1 cursor-pointer hover:bg-red-50",
                })}
              >
                Logout
              </button>
            </nav>
          )}

          <main className="w-full flex-1">
            {children}
          </main>

          {!isLoginPage && <Footer />}
        </body>
      </html>
    </GlobalDataContext.Provider>
  );
}
