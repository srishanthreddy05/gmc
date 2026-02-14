'use client';

import { Product } from '@/types';
import Image from 'next/image';

interface LowStockListProps {
  products: Product[];
}

const CATEGORY_LABELS: Record<string, string> = {
  'car-frames': 'Car Frames',
  'car-poster-frames': 'Car Poster Frames',
  'hotwheels': 'Hotwheels',
  'hotwheel-bouquets': 'Hotwheel Bouquets',
  'keychains': 'Keychains',
  'phone-cases': 'Phone Cases',
  'posters': 'Posters',
  't-shirts': 'T-Shirts',
  'valentine-gifts': 'Valentine Gifts',
};

export const LowStockList = ({ products }: LowStockListProps) => {
  // Filter products with stock less than or equal to 2
  const lowStockProducts = products.filter((product) => product.stock <= 2);

  if (lowStockProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">✓</div>
        <p className="text-slate-600 text-lg font-semibold">All products have sufficient stock!</p>
        <p className="text-slate-500 text-sm mt-2">No products with stock less than or equal to 2 units</p>
      </div>
    );
  }

  // Group products by category
  const groupedByCategory = lowStockProducts.reduce(
    (acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {} as Record<string, Product[]>
  );

  const sortedCategories = Object.keys(groupedByCategory).sort();

  return (
    <div className="space-y-8">
      {sortedCategories.map((category) => {
        const categoryProducts = groupedByCategory[category];
        const categoryLabel = CATEGORY_LABELS[category] || category;

        return (
          <div key={category} className="bg-white rounded-lg border-2 border-red-300 overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-red-200 to-red-100 px-6 py-4 border-b-2 border-red-300">
              <h2 className="text-2xl font-bold text-slate-800">{categoryLabel}</h2>
              <p className="text-sm text-slate-600">{categoryProducts.length} product(s) with low stock</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b-2 border-slate-300">
                    <th className="border border-slate-300 p-4 text-left text-slate-800 font-bold">Image</th>
                    <th className="border border-slate-300 p-4 text-left text-slate-800 font-bold">Name</th>
                    <th className="border border-slate-300 p-4 text-left text-slate-800 font-bold">Price</th>
                    <th className="border border-slate-300 p-4 text-left text-slate-800 font-bold">MRP</th>
                    <th className="border border-slate-300 p-4 text-left text-slate-800 font-bold">Stock</th>
                    <th className="border border-slate-300 p-4 text-left text-slate-800 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryProducts.map((product) => (
                    <tr key={product.productId} className="border-b border-slate-200 hover:bg-red-50 transition">
                      <td className="border border-slate-300 p-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={product.displayImage}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      </td>
                      <td className="border border-slate-300 p-4 font-semibold text-slate-900">{product.name}</td>
                      <td className="border border-slate-300 p-4 text-slate-900 font-bold">₹{product.price.toFixed(2)}</td>
                      <td className="border border-slate-300 p-4 text-slate-900 font-semibold">₹{product.mrp.toFixed(2)}</td>
                      <td className="border border-slate-300 p-4">
                        <span className="bg-red-200 text-red-800 px-3 py-1 rounded font-bold text-lg">
                          {product.stock}
                        </span>
                      </td>
                      <td className="border border-slate-300 p-4">
                        <span
                          className={`px-3 py-1 rounded text-sm font-semibold ${
                            product.enabled
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {product.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};
