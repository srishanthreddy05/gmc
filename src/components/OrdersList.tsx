'use client';

import { Order } from '@/types';

interface OrdersListProps {
  orders: Order[];
  onToggleStatus?: (orderId: string, newStatus: string) => void;
  loadingOrderIds?: Set<string>;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const OrdersList = ({
  orders,
  onToggleStatus,
  loadingOrderIds = new Set(),
}: OrdersListProps) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-slate-800 rounded-xl shadow-xl border border-slate-700">
      <table className="min-w-full text-sm text-slate-200">
        
        {/* Header */}
        <thead>
          <tr className="bg-slate-700 border-b border-slate-600 text-slate-300 uppercase text-xs tracking-wider">
            <th className="p-4 text-left">Order ID</th>
            <th className="p-4 text-left">Customer</th>
            <th className="p-4 text-left">Email</th>
            <th className="p-4 text-left">Phone</th>
            <th className="p-4 text-left">Items</th>
            <th className="p-4 text-left">Payment</th>
            <th className="p-4 text-left">Amount</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">Order Date</th>
            {onToggleStatus && <th className="p-4 text-left">Actions</th>}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {orders.map((order) => {
            const currentStatus =
              order.status || order.deliveryStatus || 'Pending';

            const isDelivered =
              currentStatus.toLowerCase() === 'delivered';

            const newStatus = isDelivered ? 'Pending' : 'Delivered';

            return (
              <tr
                key={order.orderId}
                className="border-b border-slate-700 hover:bg-slate-700 transition"
              >
                <td className="p-4 font-mono text-xs text-slate-300">
                  {order.orderId}
                </td>

                <td className="p-4 font-medium text-slate-100">
                  {order.name}
                </td>

                <td className="p-4 text-slate-300">
                  {order.email}
                </td>

                <td className="p-4 font-mono text-slate-300">
                  {order.phone}
                </td>

                <td className="p-4 text-slate-300">
                  {order.itemNames?.join(', ') || 'N/A'}
                </td>

                <td className="p-4 text-slate-300 font-medium">
                  {order.paymentMode}
                </td>

                <td className="p-4 font-semibold text-slate-100">
                  ₹{order.totalAmount?.toFixed(2)}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      isDelivered
                        ? 'bg-green-600/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}
                  >
                    {currentStatus}
                  </span>
                </td>

                <td className="p-4 text-slate-400 text-xs">
                  {formatDate(order.createdAt)}
                </td>

                {onToggleStatus && (
                  <td className="p-4">
                    <button
                      onClick={() =>
                        onToggleStatus(order.orderId, newStatus)
                      }
                      disabled={loadingOrderIds.has(order.orderId)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                        isDelivered
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      } disabled:opacity-50`}
                    >
                      {loadingOrderIds.has(order.orderId)
                        ? 'Updating...'
                        : isDelivered
                        ? 'Mark Pending'
                        : 'Mark Delivered'}
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
