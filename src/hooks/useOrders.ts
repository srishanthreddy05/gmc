'use client';

import { useEffect, useState } from 'react';
import { getDatabase } from '@/utils/firebase';
import { ref, onValue, off } from 'firebase/database';
import { Order } from '@/types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const database = getDatabase();
      const ordersRef = ref(database, 'orders');
      const unsubscribe = onValue(
        ordersRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const ordersList = Object.entries(data).map(([key, value]) => ({
              orderId: key,
              ...(value as Omit<Order, 'orderId'>),
            }));
            // Sort by createdAt (newest first)
            ordersList.sort((a, b) => b.createdAt - a.createdAt);
            setOrders(ordersList);
          } else {
            setOrders([]);
          }
          setLoading(false);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        off(ordersRef);
        unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  return { orders, loading, error };
};
