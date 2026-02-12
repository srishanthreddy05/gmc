'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { CategoryWiseStockList } from '@/components/CategoryWiseStockList';
import { StockForm } from '@/components/StockForm';
import { Product } from '@/types';

export default function StockManager() {
  const { products, loading, error } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    handleCloseForm();
  };

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
      <h1 className="text-5xl font-bold mb-8 text-slate-800">Stock Manager</h1>

      {showForm && (
        <StockForm
          editingProduct={editingProduct}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {!showForm && (
        <button
          onClick={handleAddNew}
          className="mb-6 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg"
        >
          + Add New Product
        </button>
      )}

      <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Loading products...</p>
          </div>
        ) : (
          <CategoryWiseStockList products={products} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
