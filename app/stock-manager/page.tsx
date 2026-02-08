'use client';

import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { StockList } from '@/components/StockList';
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
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          Error loading products: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-5xl font-bold mb-8 text-blue-300">Stock Manager</h1>

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

      <div className="bg-slate-700 border-2 border-blue-500 rounded-lg p-6 shadow-xl">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">Loading products...</p>
          </div>
        ) : (
          <StockList products={products} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
