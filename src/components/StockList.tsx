'use client';

import { Product } from '@/types';
import Image from 'next/image';

interface StockListProps {
  products: Product[];
  onEdit: (product: Product) => void;
}

export const StockList = ({ products, onEdit }: StockListProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-300 text-lg">No products found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b-2 border-blue-500">
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Image</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Name</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Price</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Stock</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Status</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.productId} className="border-b border-slate-600 hover:bg-slate-600 transition">
              <td className="border border-slate-600 p-4">
                <div className="relative w-12 h-12">
                  <Image
                    src={product.displayImage}
                    alt={product.name}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              </td>
              <td className="border border-slate-600 p-4 font-semibold text-slate-100">{product.name}</td>
              <td className="border border-slate-600 p-4 text-slate-100">₹{product.price.toFixed(2)}</td>
              <td className="border border-slate-600 p-4">
                <span className={product.stock > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  {product.stock}
                </span>
              </td>
              <td className="border border-slate-600 p-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    product.enabled
                      ? 'bg-green-700 text-green-200'
                      : 'bg-red-700 text-red-200'
                  }`}
                >
                  {product.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </td>
              <td className="border border-slate-600 p-4">
                <button
                  onClick={() => onEdit(product)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
