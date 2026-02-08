'use client';

import { useEffect, useState } from 'react';
import { getDatabase } from '@/utils/firebase';
import { ref, onValue, off } from 'firebase/database';
import { Product } from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const database = getDatabase();
      const productsRef = ref(database, 'stock');
      const unsubscribe = onValue(
        productsRef,
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const productsList = Object.entries(data).map(([key, value]) => ({
              productId: key,
              ...(value as Omit<Product, 'productId'>),
            }));
            setProducts(productsList);
          } else {
            setProducts([]);
          }
          setLoading(false);
        },
        (error) => {
          setError(error.message);
          setLoading(false);
        }
      );

      return () => {
        off(productsRef);
        unsubscribe();
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, []);

  return { products, loading, error };
};
