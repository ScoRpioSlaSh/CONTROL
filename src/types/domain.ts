export type Role = 'ADMIN' | 'OPERADOR' | 'LECTURA';

export type MovementType =
  | 'ENTRADA'
  | 'SALIDA'
  | 'AJUSTE_POSITIVO'
  | 'AJUSTE_NEGATIVO'
  | 'TRANSFERENCIA';

export interface Profile {
  id: string;
  full_name: string;
  role: Role;
  is_active: boolean;
  default_warehouse_id?: string | null;
}

export interface Warehouse {
  id: string;
  name: string;
  address?: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category?: string | null;
  brand?: string | null;
  unit?: string | null;
  description?: string | null;
  image_url?: string | null;
  qr_value: string;
  barcode_value?: string | null;
  min_stock?: number | null;
  active: boolean;
  average_cost?: number;
}

export interface InventoryMovement {
  id: string;
  created_at: string;
  created_by: string;
  type: MovementType;
  warehouse_origin_id?: string | null;
  warehouse_dest_id?: string | null;
  product_id: string;
  quantity: number;
  cost_unit?: number | null;
  reason?: string | null;
  reference?: string | null;
  notes?: string | null;
}

export interface StockRow {
  product_id: string;
  sku: string;
  name: string;
  min_stock: number;
  quantity: number;
  average_cost: number;
}
