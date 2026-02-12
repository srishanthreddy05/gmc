'use client';

import { useState } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { OrdersList } from '@/components/OrdersList';
import { getDatabase } from '@/utils/firebase';
import { ref, update } from 'firebase/database';

export default function Orders() {
  const { orders, loading, error } = useOrders();
  const [loadingOrderIds, setLoadingOrderIds] = useState<Set<string>>(new Set());

  const handleToggleStatus = async (
    orderId: string,
    newStatus: string
  ) => {
    setLoadingOrderIds((prev) => new Set(prev).add(orderId));

    try {
      const database = getDatabase();
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, {
        status: newStatus,
      });
    } catch (err) {
      console.error('Failed to update order status:', err);
      alert('Failed to update order status. Please try again.');
    } finally {
      setLoadingOrderIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });
    }
  };

  if (error) {
    return (
      <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="bg-red-100 border-2 border-red-400 text-red-800 p-6 rounded-lg font-semibold">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <h1 className="text-5xl font-bold mb-8 text-slate-800">Orders</h1>

      <div className="bg-white border-2 border-blue-300 rounded-lg p-6 shadow-lg">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Loading orders...</p>
          </div>
        ) : (
          <OrdersList orders={orders} onToggleStatus={handleToggleStatus} loadingOrderIds={loadingOrderIds} />
        )}
      </div>
    </div>
  );
}
