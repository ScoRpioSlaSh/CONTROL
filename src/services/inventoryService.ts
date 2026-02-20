import { supabase } from '../lib/supabase';
import { InventoryMovement, MovementType, Product, StockRow } from '../types/domain';

export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('name');
  if (error) throw error;
  return (data ?? []) as Product[];
};

export const upsertProduct = async (product: Partial<Product>) => {
  const payload = {
    ...product,
    qr_value: product.qr_value ?? product.sku,
  };
  const { error } = await supabase.from('products').upsert(payload).select().single();
  if (error) throw error;
};

export const getKardex = async (productId?: string) => {
  let query = supabase.from('inventory_movements').select('*').order('created_at', { ascending: false });
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as InventoryMovement[];
};

export const calculateStockFromMovements = (movements: InventoryMovement[]) => {
  const map: Record<string, { quantity: number; averageCost: number; costInventory: number }> = {};

  movements.forEach((m) => {
    if (!map[m.product_id]) {
      map[m.product_id] = { quantity: 0, averageCost: 0, costInventory: 0 };
    }
    const acc = map[m.product_id];

    switch (m.type as MovementType) {
      case 'ENTRADA': {
        const qtyBefore = acc.quantity;
        const newQty = qtyBefore + m.quantity;
        const incomingCost = (m.cost_unit ?? 0) * m.quantity;
        const totalCost = acc.costInventory + incomingCost;
        acc.quantity = newQty;
        acc.costInventory = totalCost;
        acc.averageCost = newQty > 0 ? totalCost / newQty : 0;
        break;
      }
      case 'SALIDA':
      case 'AJUSTE_NEGATIVO': {
        acc.quantity -= m.quantity;
        acc.costInventory = acc.quantity * acc.averageCost;
        break;
      }
      case 'AJUSTE_POSITIVO': {
        acc.quantity += m.quantity;
        acc.costInventory = acc.quantity * acc.averageCost;
        break;
      }
      case 'TRANSFERENCIA':
        break;
      default:
        break;
    }
  });

  return map;
};

export const getStockReport = async () => {
  const [products, moves] = await Promise.all([getProducts(), getKardex()]);
  const stockMap = calculateStockFromMovements(moves);
  return products.map((product) => {
    const value = stockMap[product.id] ?? { quantity: 0, averageCost: 0 };
    return {
      product_id: product.id,
      sku: product.sku,
      name: product.name,
      min_stock: product.min_stock ?? 0,
      quantity: value.quantity,
      average_cost: value.averageCost,
    } as StockRow;
  });
};

export const createMovement = async (movement: Partial<InventoryMovement>) => {
  const { data: settings } = await supabase.from('app_settings').select('allow_negative_stock').eq('id', 1).single();
  if ((movement.type === 'SALIDA' || movement.type === 'AJUSTE_NEGATIVO') && !settings?.allow_negative_stock) {
    const stockRows = await getStockReport();
    const productStock = stockRows.find((row) => row.product_id === movement.product_id)?.quantity ?? 0;
    if ((movement.quantity ?? 0) > productStock) {
      throw new Error('Stock insuficiente para salida/ajuste negativo');
    }
  }

  const { error } = await supabase.from('inventory_movements').insert(movement);
  if (error) throw error;
};
