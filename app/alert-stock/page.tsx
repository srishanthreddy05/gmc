'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { LowStockList } from '@/components/LowStockList';

export default function AlertStock() {
  const { products, loading, error } = useProducts();

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-red-100 border border-red-400 text-red-800 p-4 rounded font-semibold">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mb-8">
        <a href="/" className="text-blue-600 hover:text-blue-800 font-semibold mb-4 inline-block">
          ← Back to Home
        </a>
      </div>
      
      <h1 className="text-5xl font-bold mb-2 text-slate-800">Stock Alert</h1>
      <p className="text-slate-600 mb-8 text-lg">Products with stock less than or equal to 2 units</p>

      <div className="bg-white border-2 border-red-300 rounded-lg p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Loading products...</p>
          </div>
        ) : (
          <LowStockList products={products} />
        )}
      </div>
    </div>
  );
}
