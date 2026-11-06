"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkLogin } from "@/utils/login";
import { GlobalDataContext } from "@/app/layout";
import { Product } from "@/data/products";

export default function CartsPage() {
  const router = useRouter();
  const context = useContext(GlobalDataContext);

  useEffect(() => {
    checkLogin(router, "/carts");
  }, [router]);

  if (!context) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading...
      </div>
    );
  }

  const { products, setProducts, carts, setCarts } = context;

  const handleRemove = (item: Product) => {
    setCarts((prev) => prev.filter((t) => t.id !== item.id));
    setProducts((prev) => [...prev, item]);
  };

  const totalPrice = carts && Array.isArray(carts)
    ? carts.reduce((acc, item) => acc + (item.price || 0), 0).toFixed(2)
    : "0.00";

  return (
    <div className="mt-4 w-full max-w-4xl mx-auto px-2">
      {/* Cart Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 p-2 border border-gray-300 rounded-[18px] bg-cyan-400/30 h-[560px] scrollbar-thin overflow-auto">
        {carts && Array.isArray(carts) && carts.map((e: Product) => (
          <div key={e.id} className="mx-auto my-1">
            <div className="relative w-[150px] h-[150px] rounded-t-[10px] overflow-hidden border border-gray-200 bg-white">
              <img
                src={e.thumbnailUrl || e.thumbuailurl || `https://picsum.photos/seed/${e.id}/150`}
                alt={e.title}
                width={150}
                height={150}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 line-clamp-2">
                {e.title}
              </div>
              <div className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1.5 rounded-lg">
                ${e.price.toFixed(2)}
              </div>
            </div>
            <div
              className="p-3 w-[150px] flex items-center justify-center bg-red-200/50 hover:bg-red-300/60 active:scale-95 border border-red-500 text-red-900 font-semibold text-sm rounded-b-[10px] cursor-pointer transition select-none"
              onClick={() => handleRemove(e)}
            >
              Remove
            </div>
          </div>
        ))}
      </div>

      {/* Summary Badges below */}
      <div className="mt-4 flex items-center justify-center gap-5">
        <div className="p-2.5 px-4 flex items-center justify-center bg-yellow-200/50 border border-yellow-500 text-yellow-900 font-semibold text-sm rounded-[10px] shadow-xs">
          Count: {carts.length} items
        </div>
        <div className="p-2.5 px-4 flex items-center justify-center bg-red-200/50 border border-red-500 text-red-900 font-semibold text-sm rounded-[10px] shadow-xs">
          Price: ${totalPrice}
        </div>
      </div>
    </div>
  );
}
