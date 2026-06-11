/**
 * Types for Cafeteria e Confeitaria Bistrô Management System
 */

export interface Product {
  id: string;
  name: string;
  category: 'Cafés' | 'Bebidas' | 'Salgados' | 'Doces' | 'Confeitaria' | 'Pratos';
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  unit: 'un' | 'kg' | 'lt';
  ncm: string;
  cfop: string;
  department: 'Cozinha' | 'Confeitaria' | 'Copa/Balcão';
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export type TableStatus = 'livre' | 'ocupada' | 'conta';

export interface TableOrComanda {
  id: string;
  type: 'mesa' | 'comanda';
  number: string;
  status: TableStatus;
  items: CartItem[];
  waiterName?: string;
  startTime?: string;
  customerName?: string;
}

export interface ProductionItem {
  id: string;
  productName: string;
  quantity: number;
  note?: string;
  department: 'Cozinha' | 'Confeitaria' | 'Copa/Balcão';
}

export interface ProductionTicket {
  id: string;
  tableNumber: string;
  type: 'mesa' | 'comanda';
  items: ProductionItem[];
  status: 'pendente' | 'preparando' | 'pronto' | 'entregue';
  timestamp: string;
  waiterName?: string;
}

export interface CashierTransaction {
  id: string;
  type: 'entrada' | 'saida' | 'venda-suprimento';
  amount: number;
  method: 'Dinheiro' | 'Cartão' | 'PIX';
  description: string;
  timestamp: string;
}

export interface CashierSession {
  id: string;
  status: 'aberto' | 'fechado';
  openTime: string;
  closeTime?: string;
  initialCash: number;
  finalCash?: number;
  transactions: CashierTransaction[];
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  profit: number;
  paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX';
  timestamp: string;
  customerName?: string;
  customerId?: string;
  cashierSessionId: string;
  tableNumber?: string;
  taxEmitted: boolean;
  nfeNumber?: string;
  nfeChave?: string;
  cpf?: string;
}

export interface FinancialRecord {
  id: string;
  description: string;
  type: 'receber' | 'pagar';
  amount: number;
  category: string;
  dueDate: string;
  status: 'pendente' | 'pago';
  paymentDate?: string;
}

export interface Customer {
  id: string;
  name: string;
  cpf?: string;
  phone?: string;
  email?: string;
  birthday: string; // YYYY-MM-DD
  purchaseCount: number;
  totalSpent: number;
}
