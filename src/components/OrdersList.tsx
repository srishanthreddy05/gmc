'use client';

import { Order } from '@/types';

interface OrdersListProps {
  orders: Order[];
  onToggleStatus: (orderId: string, newStatus: 'delivered' | 'not-delivered') => void;
  loadingOrderIds: Set<string>;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const getItemSummary = (order: Order) => {
  return order.items.map((item) => `${item.quantity}x Product`).join(', ');
};

export const OrdersList = ({ orders, onToggleStatus, loadingOrderIds }: OrdersListProps) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-300 text-lg">No orders found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-800 to-slate-700 border-b-2 border-blue-500">
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Order ID</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Customer Name</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Email</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Items</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Created At</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Status</th>
            <th className="border border-slate-600 p-4 text-left text-blue-300 font-bold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId} className="border-b border-slate-600 hover:bg-slate-600 transition">
              <td className="border border-slate-600 p-4 font-mono text-sm text-slate-100">{order.orderId}</td>
              <td className="border border-slate-600 p-4 font-semibold text-slate-100">{order.customerName}</td>
              <td className="border border-slate-600 p-4 text-slate-100">{order.email}</td>
              <td className="border border-slate-600 p-4">
                <span className="text-sm text-slate-100">{getItemSummary(order)}</span>
              </td>
              <td className="border border-slate-600 p-4 text-sm text-slate-100">{formatDate(order.createdAt)}</td>
              <td className="border border-slate-600 p-4">
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    order.deliveryStatus === 'delivered'
                      ? 'bg-green-700 text-green-200'
                      : 'bg-yellow-700 text-yellow-200'
                  }`}
                >
                  {order.deliveryStatus === 'delivered' ? 'Delivered' : 'Not Delivered'}
                </span>
              </td>
              <td className="border border-slate-600 p-4">
                <button
                  onClick={() =>
                    onToggleStatus(
                      order.orderId,
                      order.deliveryStatus === 'delivered' ? 'not-delivered' : 'delivered'
                    )
                  }
                  disabled={loadingOrderIds.has(order.orderId)}
                  className={`px-3 py-2 rounded text-sm font-semibold transition ${
                    order.deliveryStatus === 'delivered'
                      ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:opacity-50 shadow`}
                >
                  {loadingOrderIds.has(order.orderId)
                    ? 'Updating...'
                    : order.deliveryStatus === 'delivered'
                      ? 'Mark Not Delivered'
                      : 'Mark Delivered'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
