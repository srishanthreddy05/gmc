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
    newStatus: 'delivered' | 'not-delivered'
  ) => {
    setLoadingOrderIds((prev) => new Set(prev).add(orderId));

    try {
      const database = getDatabase();
      const orderRef = ref(database, `orders/${orderId}`);
      await update(orderRef, {
        deliveryStatus: newStatus,
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
      <div className="p-8 min-h-screen">
        <div className="bg-red-900 border-2 border-red-600 text-red-200 p-6 rounded-lg font-semibold">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-5xl font-bold mb-8 text-blue-300">Orders</h1>

      <div className="bg-slate-700 border-2 border-blue-500 rounded-lg p-6 shadow-xl">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-300 text-lg">Loading orders...</p>
          </div>
        ) : (
          <OrdersList orders={orders} onToggleStatus={handleToggleStatus} loadingOrderIds={loadingOrderIds} />
        )}
      </div>
    </div>
  );
}
