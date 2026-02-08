import { getDatabase } from '@/utils/firebase';
import { ref, get, update } from 'firebase/database';

/**
 * Safely decrements stock for a product
 * @param productId - ID of the product
 * @param quantity - Quantity to decrement
 * @returns Promise<boolean> - true if successful, false if stock would go below zero
 */
export async function decrementStock(productId: string, quantity: number): Promise<boolean> {
  try {
    const database = getDatabase();
    const productRef = ref(database, `stock/${productId}`);
    const snapshot = await get(productRef);

    if (!snapshot.exists()) {
      console.error(`Product ${productId} not found`);
      return false;
    }

    const product = snapshot.val();
    const currentStock = product.stock || 0;

    // Prevent stock from going below zero
    if (currentStock < quantity) {
      console.warn(
        `Insufficient stock for product ${productId}. Current: ${currentStock}, Requested: ${quantity}`
      );
      return false;
    }

    const newStock = currentStock - quantity;

    // Update the stock and updatedAt timestamp
    await update(productRef, {
      stock: newStock,
      updatedAt: Date.now(),
    });

    return true;
  } catch (error) {
    console.error(`Error decrementing stock for product ${productId}:`, error);
    return false;
  }
}

/**
 * Gets the availability status of a product
 * @param enabled - Whether the product is enabled
 * @param stock - Current stock count
 * @returns 'available' | 'out-of-stock'
 */
export function getProductAvailability(enabled: boolean, stock: number): 'available' | 'out-of-stock' {
  if (enabled && stock > 0) {
    return 'available';
  }
  return 'out-of-stock';
}
