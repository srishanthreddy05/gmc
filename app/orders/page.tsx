'use client';

import { useState, useMemo } from 'react';
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

  // 🔥 Split Orders by Status
  const currentOrders = useMemo(
    () => orders.filter((order) => order.status === 'Pending'),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === 'Delivered'),
    [orders]
  );

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-6 py-10">

        <h1 className="text-4xl font-bold mb-10 text-slate-800">
          Orders
        </h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600 text-lg">Loading orders...</p>
          </div>
        ) : (
          <div className="space-y-12">

            {/* 🔵 Current Orders */}
            <section>
              <h2 className="text-2xl font-semibold text-blue-700 mb-6">
                Current Orders ({currentOrders.length})
              </h2>

              <div className="bg-white border rounded-xl p-6 shadow-md">
                <OrdersList
                  orders={currentOrders}
                  onToggleStatus={handleToggleStatus}
                  loadingOrderIds={loadingOrderIds}
                />
              </div>
            </section>

            {/* 🟢 Completed Orders */}
            <section>
              <h2 className="text-2xl font-semibold text-green-700 mb-6">
                Completed Orders ({completedOrders.length})
              </h2>

              <div className="bg-white border rounded-xl p-6 shadow-md">
                <OrdersList
                  orders={completedOrders}
                  onToggleStatus={handleToggleStatus}
                  loadingOrderIds={loadingOrderIds}
                />
              </div>
            </section>

          </div>
        )}
      </div>
    </div>
  );
}
