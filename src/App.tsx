import React, { useState, useEffect } from 'react';
import {
  Product,
  TableOrComanda,
  Customer,
  FinancialRecord,
  Sale,
  ProductionTicket,
  CartItem,
  CashierSession,
  ProductionItem
} from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_TABLES_AND_COMANDAS,
  INITIAL_CUSTOMERS,
  INITIAL_FINANCIAL_RECORDS,
  HISTORICAL_SALES
} from './data/defaultData';

// Firebase Firestore Imports
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';

// Component imports
import WaiterApp from './components/WaiterApp';
import ProductionDpt from './components/ProductionDpt';
import CashierManager from './components/CashierManager';
import StockManager from './components/StockManager';
import FinanceManager from './components/FinanceManager';
import ReportsManager from './components/ReportsManager';

// Lucide icons
import {
  Coffee,
  Grid,
  Smartphone,
  ChefHat,
  DollarSign,
  Package,
  LineChart,
  Landmark,
  Plus,
  Trash2,
  FileText,
  User,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function App() {
  // --- Persistent & Synchronized App State ---
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bistro_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [tablesAndComandas, setTablesAndComandas] = useState<TableOrComanda[]>(() => {
    const saved = localStorage.getItem('bistro_tables');
    return saved ? JSON.parse(saved) : INITIAL_TABLES_AND_COMANDAS;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('bistro_customers');
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('bistro_finance');
    return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_RECORDS;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('bistro_sales');
    return saved ? JSON.parse(saved) : HISTORICAL_SALES;
  });

  const [productionTickets, setProductionTickets] = useState<ProductionTicket[]>(() => {
    const saved = localStorage.getItem('bistro_production');
    return saved ? JSON.parse(saved) : [];
  });

  const [cashierSession, setCashierSession] = useState<CashierSession | null>(() => {
    const saved = localStorage.getItem('bistro_cashier_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation Panel tab
  const [activeTab, setActiveTab] = useState<'salao' | 'waiter-app' | 'producao' | 'caixa' | 'estoque' | 'financeiro' | 'relatorios'>('salao');

  // Standalone app mode: 'admin' (complete control panel) or 'waiter' (exclusive full-screen waiter app)
  const [appMode, setAppMode] = useState<'admin' | 'waiter'>(() => {
    const params = new URLSearchParams(window.location.search);
    const m = params.get('mode') || params.get('view');
    if (m === 'waiter' || m === 'garcom') {
      return 'waiter';
    }
    const saved = localStorage.getItem('bistro_app_mode');
    return saved === 'waiter' ? 'waiter' : 'admin';
  });

  const [linkCopied, setLinkCopied] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('bistro_app_mode', appMode);
  }, [appMode]);

  // Dining Room visualizer selected element context
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [quickAddProductId, setQuickAddProductId] = useState<string>('');
  const [quickAddQty, setQuickAddQty] = useState<number>(1);
  const [quickAddNote, setQuickAddNote] = useState<string>('');

  // --- Real-time Cloud Sync Engine (Firestore Snapshot Watchers) ---
  useEffect(() => {
    // Helper to log successful sync
    const markSuccess = () => {
      setDbConnected(true);
      setDbError(null);
    };

    // Helper to log sync error
    const markError = (err: unknown) => {
      setDbConnected(false);
      setDbError(err instanceof Error ? err.message : String(err));
    };

    // 1. Live Products catalog sync
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      markSuccess();
      if (snapshot.empty) {
        // Seed initial core list if empty
        INITIAL_PRODUCTS.forEach(async (p) => {
          try {
            await setDoc(doc(db, 'products', p.id), p);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `products/${p.id}`);
          }
        });
      } else {
        const list: Product[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Product);
        });
        const sorted = list.sort((a, b) => a.id.localeCompare(b.id));
        setProducts(sorted);
        localStorage.setItem('bistro_products', JSON.stringify(sorted));
      }
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'products');
    });

    // 2. Live Tables/Comandas active consumption sync
    const unsubTables = onSnapshot(collection(db, 'tables_comandas'), (snapshot) => {
      markSuccess();
      if (snapshot.empty) {
        // Seed default table/comanda list if empty
        INITIAL_TABLES_AND_COMANDAS.forEach(async (t) => {
          try {
            await setDoc(doc(db, 'tables_comandas', t.id), t);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `tables_comandas/${t.id}`);
          }
        });
      } else {
        const list: TableOrComanda[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as TableOrComanda);
        });
        const sorted = list.sort((a, b) => a.id.localeCompare(b.id));
        setTablesAndComandas(sorted);
        localStorage.setItem('bistro_tables', JSON.stringify(sorted));
      }
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'tables_comandas');
    });

    // 3. Live Customers CRM logs sync
    const unsubCustomers = onSnapshot(collection(db, 'customers'), (snapshot) => {
      markSuccess();
      if (snapshot.empty) {
        INITIAL_CUSTOMERS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'customers', c.id), c);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `customers/${c.id}`);
          }
        });
      } else {
        const list: Customer[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Customer);
        });
        const sorted = list.sort((a, b) => a.id.localeCompare(b.id));
        setCustomers(sorted);
        localStorage.setItem('bistro_customers', JSON.stringify(sorted));
      }
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'customers');
    });

    // 4. Live Accounts Ledger (Pagar/Receber) financials sync
    const unsubFinance = onSnapshot(collection(db, 'financial_records'), (snapshot) => {
      markSuccess();
      if (snapshot.empty) {
        INITIAL_FINANCIAL_RECORDS.forEach(async (f) => {
          try {
            await setDoc(doc(db, 'financial_records', f.id), f);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `financial_records/${f.id}`);
          }
        });
      } else {
        const list: FinancialRecord[] = [];
        snapshot.forEach((doc) => {
          doc.data();
          list.push(doc.data() as FinancialRecord);
        });
        const sorted = list.sort((a, b) => b.id.localeCompare(a.id));
        setFinancialRecords(sorted);
        localStorage.setItem('bistro_finance', JSON.stringify(sorted));
      }
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'financial_records');
    });

    // 5. Live Closed sales receipt log sync
    const unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
      markSuccess();
      if (snapshot.empty) {
        HISTORICAL_SALES.forEach(async (s) => {
          try {
            await setDoc(doc(db, 'sales', s.id), s);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, `sales/${s.id}`);
          }
        });
      } else {
        const list: Sale[] = [];
        snapshot.forEach((doc) => {
          list.push(doc.data() as Sale);
        });
        const sorted = list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        setSales(sorted);
        localStorage.setItem('bistro_sales', JSON.stringify(sorted));
      }
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'sales');
    });

    // 6. Live Active Production kitchen tickets sync
    const unsubProduction = onSnapshot(collection(db, 'production_tickets'), (snapshot) => {
      markSuccess();
      const list: ProductionTicket[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as ProductionTicket);
      });
      const sorted = list.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
      setProductionTickets(sorted);
      localStorage.setItem('bistro_production', JSON.stringify(sorted));
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'production_tickets');
    });

    // 7. Live Opened Cash register drawer session sync
    const unsubCashier = onSnapshot(collection(db, 'cashier_sessions'), (snapshot) => {
      markSuccess();
      let activeSession: CashierSession | null = null;
      snapshot.forEach((doc) => {
        const sess = doc.data() as CashierSession;
        if (sess.status === 'aberto') {
          activeSession = sess;
        }
      });
      setCashierSession(activeSession);
      if (activeSession) {
        localStorage.setItem('bistro_cashier_session', JSON.stringify(activeSession));
      } else {
        localStorage.removeItem('bistro_cashier_session');
      }
    }, (error) => {
      markError(error);
      handleFirestoreError(error, OperationType.LIST, 'cashier_sessions');
    });

    return () => {
      unsubProducts();
      unsubTables();
      unsubCustomers();
      unsubFinance();
      unsubSales();
      unsubProduction();
      unsubCashier();
    };
  }, []);

  // Utility to find the correct, public non-403 shared URL of the application
  const getSharedUrl = () => {
    const origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-');
    }
    return origin;
  };

  // --- Operational State Modifiers (Piped to Cloud) ---

  // 1. Open daily Cash Register
  const handleOpenCashier = async (initialCash: number) => {
    const newSession: CashierSession = {
      id: 'sess_' + Date.now(),
      status: 'aberto',
      openTime: new Date().toISOString(),
      initialCash,
      transactions: []
    };
    try {
      await setDoc(doc(db, 'cashier_sessions', newSession.id), newSession);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `cashier_sessions/${newSession.id}`);
    }
  };

  // 2. Close daily Cash Register
  const handleCloseCashier = async (finalCash: number) => {
    if (!cashierSession) return;
    const closedSession: CashierSession = {
      ...cashierSession,
      status: 'fechado',
      closeTime: new Date().toISOString(),
      finalCash
    };

    try {
      await setDoc(doc(db, 'cashier_sessions', closedSession.id), closedSession);

      const finId = 'fin_' + Date.now();
      const newRec: FinancialRecord = {
        id: finId,
        description: `Fechamento do Caixa Turno #${closedSession.id.slice(-6)}`,
        type: 'receber',
        amount: finalCash - closedSession.initialCash,
        category: 'Proventos de Vendas',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pago',
        paymentDate: new Date().toISOString()
      };
      await setDoc(doc(db, 'financial_records', finId), newRec);

      alert('Caixa Diário fechado com sucesso! Os saldos líquidos foram direcionados ao histórico financeiro.');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `close_cashier_flow`);
    }
  };

  // 3. Add rapid cash float / withdrawals
  const handleAddCashierTransaction = async (
    type: 'entrada' | 'saida',
    amount: number,
    method: 'Dinheiro' | 'Cartão' | 'PIX',
    description: string
  ) => {
    if (!cashierSession) return;

    const newTransaction = {
      id: 'trx_' + Date.now(),
      type,
      amount,
      method,
      description,
      timestamp: new Date().toISOString()
    };

    const updatedSession = {
      ...cashierSession,
      transactions: [...cashierSession.transactions, newTransaction]
    };

    try {
      await setDoc(doc(db, 'cashier_sessions', cashierSession.id), updatedSession);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `cashier_sessions/${cashierSession.id}`);
    }
  };

  // 4. Update table status directly
  const handleSetTableStatus = async (id: string, status: 'livre' | 'ocupada' | 'conta') => {
    try {
      const match = tablesAndComandas.find(t => t.id === id);
      if (match) {
        await setDoc(doc(db, 'tables_comandas', id), { ...match, status });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `tables_comandas/${id}`);
    }
  };

  // 5. Add order items to table or comanda + Split & Dispatch for production!
  const handleAddOrderToTable = async (tableOrComandaId: string, cartItems: CartItem[], waiterName: string) => {
    const targetTable = tablesAndComandas.find(t => t.id === tableOrComandaId);
    if (!targetTable) return;

    const updatedItems = [...targetTable.items];
    cartItems.forEach(cartItem => {
      const existingIdx = updatedItems.findIndex(i => i.product.id === cartItem.product.id);
      if (existingIdx > -1) {
        updatedItems[existingIdx].quantity += cartItem.quantity;
        if (cartItem.note) {
          const prevNote = updatedItems[existingIdx].note;
          updatedItems[existingIdx].note = prevNote ? `${prevNote} / ${cartItem.note}` : cartItem.note;
        }
      } else {
        updatedItems.push({ ...cartItem });
      }
    });

    const refreshedTable: TableOrComanda = {
      ...targetTable,
      status: 'ocupada',
      items: updatedItems,
      waiterName,
      startTime: targetTable.startTime || new Date().toISOString()
    };

    const productionItems: ProductionItem[] = cartItems.map((item, idx) => ({
      id: `pitem_${idx}_${Date.now()}`,
      productName: item.product.name,
      quantity: item.quantity,
      note: item.note,
      department: item.product.department
    }));

    const tableNumber = targetTable.number;
    const tableType = targetTable.type;

    const newTicket: ProductionTicket = {
      id: 'tkt_' + Date.now(),
      tableNumber,
      type: tableType,
      items: productionItems,
      status: 'pendente',
      timestamp: new Date().toISOString(),
      waiterName
    };

    try {
      await setDoc(doc(db, 'tables_comandas', tableOrComandaId), refreshedTable);
      await setDoc(doc(db, 'production_tickets', newTicket.id), newTicket);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `add_order_flow`);
    }
  };

  // 6. Checkout sale and clear table consumption
  const handleCheckout = (
    tableOrComandaId: string | null,
    items: CartItem[],
    paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX',
    cpf?: string,
    customerName?: string
  ): { saleId: string } | null => {
    if (!cashierSession) {
      alert('Impossível realizar pagamentos. O Caixa Diário está fechado.');
      return null;
    }

    const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const totalCost = items.reduce((sum, item) => sum + item.product.costPrice * item.quantity, 0);
    const profit = total - totalCost;
    const saleId = 'sale_' + Date.now();

    // Fire asynchronous background database update and return ID synchronously for immediate receipt
    (async () => {
      try {
        // Stock Deduction
        const productUpdatePromises = products.map(async (p) => {
          const itemInCart = items.find(it => it.product.id === p.id);
          if (itemInCart) {
            const updatedProduct = { ...p, stock: Math.max(0, p.stock - itemInCart.quantity) };
            await setDoc(doc(db, 'products', p.id), updatedProduct);
          }
        });
        await Promise.all(productUpdatePromises);

        // Record Sale
        const newSale: Sale = {
          id: saleId,
          items,
          total,
          profit,
          paymentMethod,
          timestamp: new Date().toISOString(),
          customerName: customerName || 'Consumidor Final',
          cashierSessionId: cashierSession.id,
          taxEmitted: true,
          cpf,
          nfeNumber: (10046 + sales.length).toString(),
          nfeChave: '352606' + Math.floor(100000000000000000 + Math.random() * 900000000000000000)
        };
        await setDoc(doc(db, 'sales', saleId), newSale);

        // Record cashier Session Transactions
        const cashierTrxName = tableOrComandaId
          ? `Fechamento ${tablesAndComandas.find(t => t.id === tableOrComandaId)?.number || 'Mesa'}`
          : 'Venda de Balcão';

        const newTrx = {
          id: 'trx_' + Date.now(),
          type: 'venda-suprimento' as const,
          amount: total,
          method: paymentMethod.includes('Cartão') ? ('Cartão' as const) : paymentMethod === 'PIX' ? ('PIX' as const) : ('Dinheiro' as const),
          description: `${cashierTrxName} #${saleId.slice(-4)}`,
          timestamp: new Date().toISOString()
        };

        const updatedSession = {
          ...cashierSession,
          transactions: [...cashierSession.transactions, newTrx]
        };
        await setDoc(doc(db, 'cashier_sessions', cashierSession.id), updatedSession);

        // Clear Table items
        if (tableOrComandaId) {
          const originalTable = tablesAndComandas.find(t => t.id === tableOrComandaId);
          if (originalTable) {
            const clearedTable: TableOrComanda = {
              ...originalTable,
              items: [],
              status: 'livre',
              waiterName: undefined,
              startTime: undefined,
              customerName: undefined
            };
            await setDoc(doc(db, 'tables_comandas', tableOrComandaId), clearedTable);
          }
        }

        // Record CRM Loyalty Info
        if (customerName) {
          const match = customers.find(c => c.name.toLowerCase() === customerName.toLowerCase() || (cpf && c.cpf === cpf));
          if (match) {
            const updatedCustomer = { ...match, purchaseCount: match.purchaseCount + 1, totalSpent: match.totalSpent + total };
            await setDoc(doc(db, 'customers', match.id), updatedCustomer);
          } else {
            const cstId = 'cst_' + Date.now();
            const newCust: Customer = {
              id: cstId,
              name: customerName,
              cpf,
              birthday: '1995-06-15',
              purchaseCount: 1,
              totalSpent: total
            };
            await setDoc(doc(db, 'customers', cstId), newCust);
          }
        }
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `checkout_order_flow`);
      }
    })();

    return { saleId };
  };

  // 7. Update production ticket cooking flags
  const handleUpdateProductionStatus = async (ticketId: string, status: ProductionTicket['status']) => {
    try {
      const match = productionTickets.find(t => t.id === ticketId);
      if (match) {
        await setDoc(doc(db, 'production_tickets', ticketId), { ...match, status });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `production_tickets/${ticketId}`);
    }
  };

  // 8. Financial accounts payable toggler
  const handleToggleRecordStatus = async (id: string) => {
    try {
      const match = financialRecords.find(r => r.id === id);
      if (match) {
        const nextStatus = match.status === 'pago' ? 'pendente' : 'pago';
        const updatedRec = {
          ...match,
          status: nextStatus,
          paymentDate: nextStatus === 'pago' ? new Date().toISOString() : undefined
        };
        await setDoc(doc(db, 'financial_records', id), updatedRec);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `financial_records/${id}`);
    }
  };

  const handleAddFinancialRecord = async (rec: Omit<FinancialRecord, 'id'>) => {
    const finId = 'fin_' + Date.now();
    const newRecord: FinancialRecord = {
      ...rec,
      id: finId
    };
    try {
      await setDoc(doc(db, 'financial_records', finId), newRecord);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `financial_records/${finId}`);
    }
  };

  // 9. Manual additions to product catalog
  const handleAddProduct = async (prod: Omit<Product, 'id'>) => {
    const pId = 'p_' + Date.now();
    const newProduct: Product = {
      ...prod,
      id: pId
    };
    try {
      await setDoc(doc(db, 'products', pId), newProduct);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${pId}`);
    }
  };

  // 10. Update product stock levels
  const handleUpdateStock = async (productId: string, qty: number, mode: 'set' | 'add', costPrice?: number) => {
    try {
      const p = products.find(prod => prod.id === productId);
      if (!p) return;
      
      const finalStock = mode === 'set' ? qty : p.stock + qty;
      let finalCostPrice = p.costPrice;
      if (costPrice && costPrice > 0) {
        const totalInventory = Math.max(1, p.stock + qty);
        finalCostPrice = ((p.stock * p.costPrice) + (qty * costPrice)) / totalInventory;
      }

      const updatedProduct = {
        ...p,
        stock: finalStock,
        costPrice: Number(finalCostPrice.toFixed(2))
      };
      await setDoc(doc(db, 'products', productId), updatedProduct);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `products/${productId}`);
    }
  };

  // --- Virtual Dining Room helpers & elements ---
  const selectedTable = tablesAndComandas.find(t => t.id === selectedTableId);

  const handleQuickAddManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTableId || !quickAddProductId) return;

    const matchedProd = products.find(p => p.id === quickAddProductId);
    if (!matchedProd) return;

    const orderLines: CartItem[] = [
      {
        product: matchedProd,
        quantity: quickAddQty,
        note: quickAddNote || undefined
      }
    ];

    handleAddOrderToTable(selectedTableId, orderLines, 'Administrador');
    
    // Clear temp layout form
    setQuickAddProductId('');
    setQuickAddQty(1);
    setQuickAddNote('');
  };

  const handleRemoveSingleLineItem = async (tableId: string, idx: number) => {
    try {
      const table = tablesAndComandas.find(t => t.id === tableId);
      if (!table) return;

      const nextLines = table.items.filter((_, i) => i !== idx);
      const updatedTable: TableOrComanda = {
        ...table,
        items: nextLines,
        status: nextLines.length === 0 ? 'livre' as const : table.status
      };
      await setDoc(doc(db, 'tables_comandas', tableId), updatedTable);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `tables_comandas/${tableId}`);
    }
  };

  if (appMode === 'waiter') {
    return (
      <WaiterApp
        products={products}
        tablesAndComandas={tablesAndComandas}
        onAddOrderToTable={handleAddOrderToTable}
        onSetTableStatus={handleSetTableStatus}
        isStandalone={true}
        onExitStandalone={() => setAppMode('admin')}
        dbConnected={dbConnected}
        dbError={dbError}
      />
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 select-none text-stone-900 flex flex-col font-sans">
      
      {/* Upper Brand executive Banner - Swiss/Modern minimalism */}
      <header className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-cream-50 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-full bg-emerald-700/80 hover:bg-emerald-700 transition flex items-center justify-center font-serif text-lg font-black tracking-tight text-white shadow-inner">
              CB
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tight flex items-center gap-2">
                Cafeteria & Confeitaria Bistrô
                <span className="text-[10px] bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  SGC PRO v4.1
                </span>
              </h1>
              <p className="text-[10px] text-stone-400 tracking-wide mt-0.5">ESTABILIZAÇÃO ADMINISTRATIVA CENTRAL E APP DO GARÇOM INTEGRADO</p>
            </div>
          </div>

          {/* Quick status of cashier & Smartphone Standalone Trigger */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAppMode('waiter')}
              className="px-3.5 py-1.5 bg-[#d4a373] hover:bg-[#eac098] text-stone-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-sm cursor-pointer"
              title="Abrir App exclusivo do Garçom em Tela Cheia"
              id="btn-trigger-waiter-fullscreen"
            >
              <Smartphone className="h-3.5 w-3.5" /> Modo Garçom
            </button>

            <div className="h-4 w-px bg-stone-800"></div>

            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${cashierSession ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
              <span className="text-[11px] font-bold text-stone-300 uppercase tracking-wider">
                {cashierSession ? `Caixa Aberto • R$ ${cashierSession.initialCash.toFixed(2)} Initial` : 'Caixa Diário Fechado'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main workspace navigation tabs */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 overflow-x-auto flex scrollbar-none">
          {([
            { id: 'salao', label: 'Salão & Comandas', icon: <Grid className="h-4 w-4" /> },
            { id: 'waiter-app', label: 'App do Garçom', icon: <Smartphone className="h-4 w-4 text-emerald-700" /> },
            { id: 'producao', label: 'Cozinha KDS', icon: <ChefHat className="h-4 w-4" /> },
            { id: 'caixa', label: 'Caixa Diário / PDV', icon: <DollarSign className="h-4 w-4" /> },
            { id: 'estoque', label: 'Estoque / Notas XML', icon: <Package className="h-4 w-4" /> },
            { id: 'financeiro', label: 'Financeiro', icon: <Landmark className="h-4 w-4" /> },
            { id: 'relatorios', label: 'BI Relatórios', icon: <LineChart className="h-4 w-4" /> }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedTableId('');
              }}
              className={`px-4.5 py-4 text-xs font-bold transition-all relative flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-stone-900 border-b-2 border-stone-900 font-extrabold bg-stone-50/50'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              id={`nav-tab-${tab.id}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main layout container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {activeTab === 'salao' && (
          /* Tab: Visual salon space */
          <div className="space-y-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">Salão & Mesas Físicas</h2>
              <p className="text-xs text-stone-500 mt-0.5">Selecione uma mesa ou comanda para gerenciar o consumo local, adicionar produtos ou solicitar fechamento.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Salon Visual Grid on left */}
              <div className="lg:col-span-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1 mb-3.5">Mesas de Atendimento</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {tablesAndComandas.filter(t => t.type === 'mesa').map(table => {
                      const isOcupada = table.status === 'ocupada';
                      const isConta = table.status === 'conta';
                      const totalLines = table.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);

                      return (
                        <button
                          key={table.id}
                          onClick={() => setSelectedTableId(table.id)}
                          className={`min-h-[100px] p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            selectedTableId === table.id ? 'ring-2 ring-stone-900 ring-offset-2' : ''
                          } ${
                            isConta ? 'bg-amber-50/70 border-amber-300 hover:bg-amber-50' :
                            isOcupada ? 'bg-stone-900 border-stone-950 text-white hover:bg-stone-850' :
                            'bg-white border-stone-200 hover:border-stone-400 hover:shadow-sm'
                          }`}
                        >
                          <div>
                            <span className="text-[10px] font-mono tracking-widest opacity-60 block leading-none">MESA</span>
                            <span className="font-serif font-black text-base">{table.number.split(' ')[1]}</span>
                          </div>
                          
                          <div className="space-y-0.5">
                            {isOcupada || isConta ? (
                              <>
                                <span className="block text-[8px] font-bold tracking-wider opacity-90 uppercase">
                                  {isConta ? '👉 PEDIU CONTA' : '🍖 REFEIÇÃO'}
                                </span>
                                <span className={`text-[11px] font-black font-mono block ${isConta ? 'text-amber-800' : 'text-emerald-400'}`}>
                                  R$ {totalLines.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <span className="text-[9px] font-bold text-stone-400 uppercase tracking-wider">Livre</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t pt-5">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest pl-1 mb-3.5">Comandas Individuais Ativas</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                    {tablesAndComandas.filter(t => t.type === 'comanda').map(comanda => {
                      const isOcupada = comanda.status === 'ocupada';
                      const isConta = comanda.status === 'conta';
                      const totalLines = comanda.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);

                      return (
                        <button
                          key={comanda.id}
                          onClick={() => setSelectedTableId(comanda.id)}
                          className={`p-3.5 rounded-xl border text-left transition ${
                            selectedTableId === comanda.id ? 'ring-2 ring-stone-900 ring-offset-1' : ''
                          } ${
                            isConta ? 'bg-amber-50/70 border-amber-300' :
                            isOcupada ? 'bg-stone-900 border-stone-950 text-stone-100 hover:bg-stone-850' :
                            'bg-white border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-[9px] font-bold block opacity-65 font-mono">{comanda.number}</span>
                          <div className="mt-2.5">
                            {isOcupada || isConta ? (
                              <span className="font-black text-xs font-mono text-emerald-400">R$ {totalLines.toFixed(2)}</span>
                            ) : (
                              <span className="text-[8px] font-bold text-stone-400 uppercase tracking-wider">Livre</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Detail Panel Sidebar of Selected Mesa/comanda */}
              <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm min-h-[350px]">
                {!selectedTable ? (
                  <div className="flex flex-col items-center justify-center p-10 text-center min-h-[300px] text-stone-400">
                    <div className="h-10 w-10 rounded-full bg-stone-50 flex items-center justify-center mb-3">
                      <HelpCircle className="h-5 w-5" />
                    </div>
                    <span className="font-medium text-xs text-stone-500">Aguardando Seleção</span>
                    <p className="text-[11px] text-stone-400 mt-1 max-w-[200px]">Clique em qualquer Mesa ou Comanda à esquerda para gerenciar itens ou lançar consumos.</p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    
                    {/* Header detail selected */}
                    <div className="border-b pb-4 flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">{selectedTable.type === 'mesa' ? 'Atendimento de Mesa' : 'Comanda em Uso'}</span>
                        <h4 className="font-serif font-black text-lg text-stone-900 leading-none mt-0.5">{selectedTable.number}</h4>
                        <p className="text-[10.5px] text-stone-400 mt-1">Servido por: <b className="text-stone-700">{selectedTable.waiterName || 'Sem garçom associado'}</b></p>
                      </div>

                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg ${
                        selectedTable.status === 'conta' ? 'bg-amber-100 text-amber-800' :
                        selectedTable.status === 'ocupada' ? 'bg-stone-900 text-stone-100' : 'bg-stone-100 text-stone-500'
                      }`}>
                        {selectedTable.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Quick item lines */}
                    <div className="space-y-3">
                      <h5 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest pl-0.5">Consumo Cadastrado</h5>
                      
                      {selectedTable.items.length === 0 ? (
                        <p className="text-xs text-stone-400 italic py-6 pl-1">Sem lançamentos de consumo nesta mesa.</p>
                      ) : (
                        <div className="divide-y divide-stone-100 max-h-56 overflow-y-auto pr-1">
                          {selectedTable.items.map((line, idx) => (
                            <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-stone-900">{line.product.name}</span>
                                <span className="block text-[10px] text-stone-400 mt-0.5">
                                  {line.quantity}x R$ {line.product.price.toFixed(2)}
                                </span>
                                {line.note && <span className="block text-[9px] text-rose-500 font-semibold mt-0.5 italic">* {line.note}</span>}
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-800 font-mono">
                                  R$ {(line.product.price * line.quantity).toFixed(2)}
                                </span>
                                <button
                                  onClick={() => handleRemoveSingleLineItem(selectedTable.id, idx)}
                                  className="p-1 text-stone-300 hover:text-stone-600 transition"
                                  title="Remover Item"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Adding manual item Form inside Salon panel */}
                    <form onSubmit={handleQuickAddManualItem} className="pt-4 border-t border-stone-150 space-y-3">
                      <h5 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest pl-0.5 flex items-center gap-1.5">
                        <Plus className="h-3.5 w-3.5 text-stone-500" />
                        Lançamento Rápido no Balcão
                      </h5>

                      <div className="grid grid-cols-4 gap-2">
                        <select
                          required
                          value={quickAddProductId}
                          onChange={e => setQuickAddProductId(e.target.value)}
                          className="col-span-3 bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
                          id="salon-quickinstall-p"
                        >
                          <option value="">-- Selecione o Produto --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id}>{p.name} - R$ {p.price.toFixed(2)}</option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          required
                          value={quickAddQty}
                          onChange={e => setQuickAddQty(parseInt(e.target.value) || 1)}
                          className="bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs text-center font-bold"
                        />
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Nota coz. (Ex: Sem gelo)"
                          value={quickAddNote}
                          onChange={e => setQuickAddNote(e.target.value)}
                          className="flex-grow bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs italic"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 bg-stone-900 border text-white hover:bg-stone-850 rounded-lg text-xs font-bold transition"
                          id="salon-quickinstall-submit"
                        >
                          Lançar
                        </button>
                      </div>
                    </form>

                    {/* Operational trigger checks */}
                    <div className="border-t pt-4 flex gap-2">
                      {selectedTable.items.length > 0 && (
                        <>
                          <button
                            onClick={() => {
                              setActiveTab('caixa');
                              // Open PDV automatically with this table selected!
                              // We simulate a small timeout
                            }}
                            className="flex-grow py-3 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition flex items-center justify-center gap-1.5 shadow-sm"
                            id="btn-shortcut-checkout"
                          >
                            <DollarSign className="h-4 w-4" /> Fechar & Faturar (PDV)
                          </button>

                          {selectedTable.status !== 'conta' && (
                            <button
                              onClick={() => handleSetTableStatus(selectedTable.id, 'conta')}
                              className="px-3 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 border rounded-xl text-xs font-bold transition"
                              id="btn-shortcut-bill"
                            >
                              Pedir Conta
                            </button>
                          )}
                        </>
                      )}

                      {selectedTable.items.length === 0 && selectedTable.status === 'livre' && (
                        <button
                          onClick={() => {
                            const name = prompt('Nome/Apelido do consumidor associado:');
                            if (name) {
                              setTablesAndComandas(prev =>
                                prev.map(t =>
                                  t.id === selectedTable.id
                                    ? { ...t, status: 'ocupada', customerName: name, waiterName: 'Balcão' }
                                    : t
                                )
                              );
                            }
                          }}
                          className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 border text-xs font-bold rounded-xl transition"
                          id="btn-occupy-manually"
                        >
                          Marcar Mesa Ocupada Manulamente
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {activeTab === 'waiter-app' && (
          /* Tab: Waiter Smartphone view mockup with standalone info */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-stone-200 pb-4 max-w-xl mx-auto text-center">
              <h2 className="text-xl font-serif font-black text-stone-900">Aplicativo Exclusivo do Garçom</h2>
              <p className="text-xs text-stone-500 mt-1.5">
                Para que o garçom opere com autonomia, ele utiliza apenas o app móvel. Abaixo você pode simular o celular dele ou pegar o link de acesso externo para abrir em qualquer smartphone de verdade!
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
              
              {/* Left column: Standalone Connection setup for Waiter */}
              <div className="lg:col-span-5 bg-white border border-stone-200 rounded-3xl p-6.5 shadow-sm space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest text-[#d4a373] uppercase">Acesso Autônomo</span>
                  <h3 className="font-serif font-black text-lg text-stone-900 mt-0.5">Celular do Atendente</h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Gere o QR Code ou envie o link abaixo direto para o celular da equipe. O garçom não terá acesso aos dados financeiros e de estoque da loja.
                  </p>
                </div>

                {/* Simulated QR Code card */}
                <div className="bg-stone-50 border border-stone-150 rounded-2xl p-5 flex flex-col items-center text-center">
                  <div className="w-40 h-40 bg-white border border-stone-200 rounded-xl p-3 flex flex-col items-center justify-center relative shadow-sm">
                    {/* Retro Elegant Pattern Vector QR Code */}
                    <div className="grid grid-cols-4 gap-1.5 opacity-80">
                      {[1,0,1,1,0,1,0,1,1,1,0,0,0,1,1,1].map((val, idx) => (
                        <div key={idx} className={`w-6 h-6 rounded ${val ? 'bg-stone-900' : 'bg-[#d4a373]'}`} />
                      ))}
                    </div>
                    <div className="absolute inset-0 bg-white/10 flex items-center justify-center">
                      <div className="bg-stone-900 text-[#d4a373] rounded-full p-2.5 shadow-md flex items-center justify-center font-serif text-xs font-black">
                        CB
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-mono mt-3 uppercase tracking-wider">Mesa de Atendimento / Escaneie</span>
                </div>

                {/* Direct Standalone Link input */}
                <div className="space-y-3">
                  {/* Explanation of the 403 error and the correct public shared URL */}
                  <div className="bg-emerald-50/90 border border-emerald-250 rounded-2xl p-4 text-xs text-stone-850 select-text">
                    <div className="flex items-center gap-1.5 font-black text-emerald-800 uppercase tracking-wider text-[10px] mb-1">
                      <span>💡</span> TESTAR EM MÚLTIPLOS APARELHOS (SEM ERRO 403)
                    </div>
                    <p className="text-[11.5px] leading-relaxed">
                      O link de desenvolvimento normal da barra de endereço requer login na sua conta Google principal (por isso outros celulares/garçons recebem o erro <b>403 Forbidden</b>).
                    </p>
                    <p className="text-[11.5px] leading-relaxed mt-1.5 font-bold text-emerald-900">
                      Utilize o link público de compartilhamento (Shared Link) gerado abaixo! Ele permite que seus 6 garçons e 3 administradores acessem em tempo real ao mesmo tempo de qualquer celular ou tablet sem restrição!
                    </p>
                    <div className="mt-2.5 pt-2 border-t border-emerald-200/50 space-y-1 text-[11px]">
                      <div><b>Passos simples para rodar:</b></div>
                      <ol className="list-decimal list-inside space-y-1 text-stone-600 mt-1 pl-1">
                        <li>Copie o link público abaixo.</li>
                        <li>Envie para os celulares por WhatsApp ou e-mail.</li>
                        <li><b>Sincronização 100% Real-time:</b> Ao lançar um pedido em qualquer aparelho, ele aparece de forma instantânea nas mesas do administrador e na tela da cozinha!</li>
                      </ol>
                    </div>
                  </div>

                  <label className="block text-xs font-bold text-stone-700 mt-2">Link Sincronizado para os Garçons</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={`${getSharedUrl()}/?mode=garcom`}
                      className="flex-grow bg-stone-50 border border-stone-250 p-2.5 rounded-xl text-[11px] font-mono text-stone-600 focus:outline-[#d4a373] select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${getSharedUrl()}/?mode=garcom`);
                        setLinkCopied(true);
                        setTimeout(() => setLinkCopied(false), 2000);
                      }}
                      className="px-3 py-2.5 bg-stone-900 text-[#d4a373] border hover:bg-stone-850 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 active:scale-95"
                    >
                      {linkCopied ? 'Copiado!' : 'Copiar'}
                    </button>
                  </div>
                </div>

                {/* Standalone Button Trigger */}
                <button
                  onClick={() => setAppMode('waiter')}
                  className="w-full bg-[#d4a373] hover:bg-[#e4b383] text-stone-950 font-black py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 active:scale-95 shadow-sm cursor-pointer"
                  id="btn-direct-waiter-trigger"
                >
                  <Smartphone className="h-4 w-4" /> Entrar no Modo Garçom Standalone
                </button>

                {/* Bullet advantages */}
                <div className="border-t border-stone-150 pt-4 space-y-2.5 text-[11px] text-stone-500">
                  <div className="flex items-start gap-2">
                    <span className="text-[#d4a373] font-bold">✔</span>
                    <p><b>Integração instantânea:</b> Lançamentos no celular atualizam o painel de mesas e o caixa na hora.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#d4a373] font-bold">✔</span>
                    <p><b>Setorização automática:</b> Pratos vão para a Cozinha, cafés e bebidas para a Copa/Balcão de forma splitada.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#d4a373] font-bold">✔</span>
                    <p><b>Retenção de estoque:</b> Baixa automática dos ingredientes no ato da confirmação.</p>
                  </div>
                </div>
              </div>

              {/* Right column: Interactive Frame mock for testing */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <span className="text-xs font-bold text-stone-400 mb-3 uppercase tracking-wider">Simulador do Celular do Garçom</span>
                <WaiterApp
                  products={products}
                  tablesAndComandas={tablesAndComandas}
                  onAddOrderToTable={handleAddOrderToTable}
                  onSetTableStatus={handleSetTableStatus}
                  dbConnected={dbConnected}
                  dbError={dbError}
                />
              </div>

            </div>
          </div>
        )}

        {activeTab === 'producao' && (
          /* Tab: Production Tickets list split by Depts */
          <ProductionDpt
            tickets={productionTickets}
            onUpdateStatus={handleUpdateProductionStatus}
          />
        )}

        {activeTab === 'caixa' && (
          /* Tab: Cash flow sessions Open/Close and PDV billing */
          <CashierManager
            session={cashierSession}
            onOpenSession={handleOpenCashier}
            onCloseSession={handleCloseCashier}
            onAddTransaction={handleAddCashierTransaction}
            tablesAndComandas={tablesAndComandas}
            products={products}
            customers={customers}
            onCheckout={handleCheckout}
          />
        )}

        {activeTab === 'estoque' && (
          /* Tab: Stock grid listing + XML imports */
          <StockManager
            products={products}
            onAddProduct={handleAddProduct}
            onUpdateStock={handleUpdateStock}
          />
        )}

        {activeTab === 'financeiro' && (
          /* Tab: Finance module Accounts payable & receivable */
          <FinanceManager
            records={financialRecords}
            onAddRecord={handleAddFinancialRecord}
            onToggleRecordStatus={handleToggleRecordStatus}
          />
        )}

        {activeTab === 'relatorios' && (
          /* Tab: Reports metrics insights */
          <ReportsManager
            sales={sales}
            products={products}
            customers={customers}
          />
        )}

      </main>

      {/* Footer layout detail */}
      <footer className="bg-stone-50 border-t border-stone-200 mt-12 py-6 text-center text-xs text-stone-400 font-mono tracking-tight">
        <p>© 2026 CAFETERIA E CONFEITARIA BISTRÔ • CNPJ SIMULADO: 12.345.678/0001-99</p>
        <p className="mt-1 opacity-75">SISTEMA COMPLETO DE GESTÃO - TODOS OS DIREITOS RESERVADOS</p>
      </footer>

    </div>
  );
}
