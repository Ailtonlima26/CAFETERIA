import { Product, TableOrComanda, Customer, FinancialRecord, Sale } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // Cafés
  {
    id: 'p1',
    name: 'Espresso Gourmet Bistrô',
    category: 'Cafés',
    price: 7.50,
    costPrice: 1.80,
    stock: 450,
    minStock: 50,
    unit: 'un',
    ncm: '2101.11.10',
    cfop: '5102',
    department: 'Copa/Balcão'
  },
  {
    id: 'p2',
    name: 'Cappuccino Italiano',
    category: 'Cafés',
    price: 11.90,
    costPrice: 3.20,
    stock: 120,
    minStock: 30,
    unit: 'un',
    ncm: '2101.11.10',
    cfop: '5102',
    department: 'Copa/Balcão'
  },
  {
    id: 'p3',
    name: 'Latte Trufado de Macadâmia',
    category: 'Cafés',
    price: 15.50,
    costPrice: 4.50,
    stock: 80,
    minStock: 20,
    unit: 'un',
    ncm: '2101.11.10',
    cfop: '5102',
    department: 'Copa/Balcão'
  },
  {
    id: 'p4',
    name: 'Coado Espacial Hario V60',
    category: 'Cafés',
    price: 9.00,
    costPrice: 1.50,
    stock: 200,
    minStock: 40,
    unit: 'un',
    ncm: '2101.11.10',
    cfop: '5102',
    department: 'Copa/Balcão'
  },

  // Bebidas
  {
    id: 'p5',
    name: 'Soda Italiana Cranberry',
    category: 'Bebidas',
    price: 13.90,
    costPrice: 3.80,
    stock: 95,
    minStock: 25,
    unit: 'un',
    ncm: '2202.10.00',
    cfop: '5102',
    department: 'Copa/Balcão'
  },
  {
    id: 'p6',
    name: 'Suco de Laranja Natural 400ml',
    category: 'Bebidas',
    price: 12.00,
    costPrice: 2.90,
    stock: 150,
    minStock: 30,
    unit: 'un',
    ncm: '2009.19.00',
    cfop: '5102',
    department: 'Copa/Balcão'
  },

  // Salgados (Cozinha)
  {
    id: 'p7',
    name: 'Croissant Sourdough Frango & Brie',
    category: 'Salgados',
    price: 22.90,
    costPrice: 7.90,
    stock: 14,
    minStock: 10,
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Cozinha'
  },
  {
    id: 'p8',
    name: 'Quiche Lorraine Clássica',
    category: 'Salgados',
    price: 18.50,
    costPrice: 5.50,
    stock: 8,
    minStock: 5,
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Cozinha'
  },
  {
    id: 'p9',
    name: 'Pão de Queijo Canastra Multigrãos',
    category: 'Salgados',
    price: 6.90,
    costPrice: 1.40,
    stock: 80,
    minStock: 20,
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Cozinha'
  },

  // Confeitaria / Doces (Confeitaria)
  {
    id: 'p10',
    name: 'Torta Red Velvet Premium',
    category: 'Confeitaria',
    price: 16.90,
    costPrice: 4.80,
    stock: 12,
    minStock: 8,
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Confeitaria'
  },
  {
    id: 'p11',
    name: 'Mille-Feuille (Folhado) Doce de Leite',
    category: 'Confeitaria',
    price: 14.50,
    costPrice: 3.50,
    stock: 15,
    minStock: 6,
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Confeitaria'
  },
  {
    id: 'p12',
    name: 'Éclair de Pistache Siciliano',
    category: 'Confeitaria',
    price: 15.90,
    costPrice: 4.10,
    stock: 6,
    minStock: 8, // triggers low stock warning!
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Confeitaria'
  },
  {
    id: 'p13',
    name: 'Torta Ópera de Chocolate Belga',
    category: 'Confeitaria',
    price: 19.00,
    costPrice: 5.80,
    stock: 5,
    minStock: 5,
    unit: 'un',
    ncm: '1905.90.90',
    cfop: '5102',
    department: 'Confeitaria'
  }
];

export const INITIAL_TABLES_AND_COMANDAS: TableOrComanda[] = [
  // Mesas
  { id: 't1', type: 'mesa', number: 'Mesa 01', status: 'livre', items: [] },
  { id: 't2', type: 'mesa', number: 'Mesa 02', status: 'ocupada', items: [
    { product: INITIAL_PRODUCTS[0], quantity: 2, note: 'Espresso curto' }, // 2x Gourmet Espresso
    { product: INITIAL_PRODUCTS[9], quantity: 1 } // Torta Red Velvet
  ], startTime: '2026-06-11T13:30:00Z', waiterName: 'Carlos Silva' },
  { id: 't3', type: 'mesa', number: 'Mesa 03', status: 'livre', items: [] },
  { id: 't4', type: 'mesa', number: 'Mesa 04', status: 'conta', items: [
    { product: INITIAL_PRODUCTS[1], quantity: 1 }, // Cappuccino
    { product: INITIAL_PRODUCTS[6], quantity: 1, note: 'Sem brie' }, // Croissant
    { product: INITIAL_PRODUCTS[10], quantity: 2 } // Mille-Feuille
  ], startTime: '2026-06-11T13:05:00Z', waiterName: 'Marta Souza', customerName: 'Felipe Amorim' },
  { id: 't5', type: 'mesa', number: 'Mesa 05', status: 'livre', items: [] },
  { id: 't6', type: 'mesa', number: 'Mesa 06', status: 'livre', items: [] },
  { id: 't7', type: 'mesa', number: 'Mesa 07', status: 'livre', items: [] },
  { id: 't8', type: 'mesa', number: 'Mesa 08', status: 'livre', items: [] },

  // Comandas
  { id: 'c1', type: 'comanda', number: 'Comanda 101', status: 'ocupada', items: [
    { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Latte Trufado
    { product: INITIAL_PRODUCTS[11], quantity: 1 } // Éclair de Pistache
  ], startTime: '2026-06-11T13:45:00Z', waiterName: 'Carlos Silva', customerName: 'Juliana Costa' },
  { id: 'c2', type: 'comanda', number: 'Comanda 102', status: 'livre', items: [] },
  { id: 'c3', type: 'comanda', number: 'Comanda 103', status: 'livre', items: [] },
  { id: 'c4', type: 'comanda', number: 'Comanda 104', status: 'livre', items: [] },
  { id: 'c5', type: 'comanda', number: 'Comanda 105', status: 'livre', items: [] }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cst1',
    name: 'Juliana Costa Lima',
    cpf: '123.456.789-00',
    phone: '11 98888-7711',
    email: 'juliana.lima@email.com',
    birthday: '1992-06-14', // Birthday in June! (Current time is June 11, 2026)
    purchaseCount: 22,
    totalSpent: 485.40
  },
  {
    id: 'cst2',
    name: 'Felipe Amorim Mendes',
    cpf: '987.654.321-99',
    phone: '11 97777-6655',
    email: 'felipe.amorim@email.com',
    birthday: '1987-06-25', // Birthday in June!
    purchaseCount: 18,
    totalSpent: 398.20
  },
  {
    id: 'cst3',
    name: 'Mariana Duarte',
    cpf: '456.789.123-11',
    phone: '11 91234-5678',
    email: 'mari.duarte@email.com',
    birthday: '1995-10-02',
    purchaseCount: 42,
    totalSpent: 915.00 // Biggest buyer!
  },
  {
    id: 'cst4',
    name: 'Roberto Alencar',
    cpf: '321.654.987-22',
    phone: '11 93333-2222',
    email: 'robalencar@email.com',
    birthday: '1982-06-03', // Birthday in June!
    purchaseCount: 12,
    totalSpent: 198.50
  },
  {
    id: 'cst5',
    name: 'Sônia Maria',
    cpf: '789.123.456-44',
    phone: '11 94444-1111',
    email: 'soniamaria@email.com',
    birthday: '1965-07-20',
    purchaseCount: 5,
    totalSpent: 75.00
  }
];

export const INITIAL_FINANCIAL_RECORDS: FinancialRecord[] = [
  // A pagar
  {
    id: 'f1',
    description: 'Fornecedor de Grãos de Café Gourmet - Lote 42',
    type: 'pagar',
    amount: 1450.00,
    category: 'Mercadorias para Revenda',
    dueDate: '2026-06-15',
    status: 'pendente'
  },
  {
    id: 'f2',
    description: 'Aluguel do Espaço - Av. Paulista',
    type: 'pagar',
    amount: 4500.00,
    category: 'Infraestrutura',
    dueDate: '2026-06-10',
    status: 'pago',
    paymentDate: '2026-06-09'
  },
  {
    id: 'f3',
    description: 'Conta de Energia Elétrica - Enel',
    type: 'pagar',
    amount: 680.40,
    category: 'Custos Operacionais',
    dueDate: '2026-06-20',
    status: 'pendente'
  },
  {
    id: 'f4',
    description: 'Embalagens Kraft de Delivery',
    type: 'pagar',
    amount: 350.00,
    category: 'Embalagens',
    dueDate: '2026-06-12',
    status: 'pendente'
  },

  // A receber
  {
    id: 'f5',
    description: 'Serviço de Coffee Break Empresarial - Tech Startup SA',
    type: 'receber',
    amount: 2800.00,
    category: 'Eventos',
    dueDate: '2026-06-18',
    status: 'pendente'
  },
  {
    id: 'f6',
    description: 'Catering Aniversário Sra. Antônia',
    type: 'receber',
    amount: 1200.00,
    category: 'Eventos',
    dueDate: '2026-05-30',
    status: 'pago',
    paymentDate: '2026-05-30'
  }
];

// Seed sales to generate fully realized charts
export const HISTORICAL_SALES: Sale[] = [
  // 8:30 Peak
  {
    id: 's1',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 2 }, // Espresso
      { product: INITIAL_PRODUCTS[8], quantity: 2 }  // Pão de Queijo
    ],
    total: 28.80,
    profit: 20.00,
    paymentMethod: 'PIX',
    timestamp: '2026-06-10T08:34:00Z',
    customerName: 'Juliana Costa Lima',
    customerId: 'cst1',
    cashierSessionId: 'sess_prev',
    taxEmitted: true,
    nfeNumber: '10041',
    nfeChave: '35260611234567890123550010000100411000100418'
  },
  // 9:15 Peak
  {
    id: 's2',
    items: [
      { product: INITIAL_PRODUCTS[1], quantity: 3 }, // Cappuccino
      { product: INITIAL_PRODUCTS[6], quantity: 2 }  // Croissant
    ],
    total: 81.50,
    profit: 56.10,
    paymentMethod: 'Cartão de Crédito',
    timestamp: '2026-06-10T09:12:00Z',
    customerName: 'Mariana Duarte',
    customerId: 'cst3',
    cashierSessionId: 'sess_prev',
    taxEmitted: false
  },
  // 12:30 Quick lunch
  {
    id: 's3',
    items: [
      { product: INITIAL_PRODUCTS[7], quantity: 1 }, // Quiche
      { product: INITIAL_PRODUCTS[5], quantity: 1 }  // Suco de Laranja
    ],
    total: 30.50,
    profit: 22.10,
    paymentMethod: 'Cartão de Débito',
    timestamp: '2026-06-10T12:25:00Z',
    cashierSessionId: 'sess_prev',
    taxEmitted: true,
    nfeNumber: '10042',
    nfeChave: '35260611234567890123550010000100421000100429'
  },
  // 15:45 Afternoon peak
  {
    id: 's4',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Latte Trufado
      { product: INITIAL_PRODUCTS[10], quantity: 1 }, // Mille-Feuille
      { product: INITIAL_PRODUCTS[12], quantity: 1 } // Torta Ópera
    ],
    total: 49.00,
    profit: 35.20,
    paymentMethod: 'PIX',
    timestamp: '2026-06-10T15:48:00Z',
    customerName: 'Felipe Amorim Mendes',
    customerId: 'cst2',
    cashierSessionId: 'sess_prev',
    taxEmitted: true,
    nfeNumber: '10043',
    nfeChave: '35260611234567890123550010000100431000100430'
  },
  // 16:30 Afternoon peak
  {
    id: 's5',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 4 }, // Espresso
      { product: INITIAL_PRODUCTS[11], quantity: 4 } // Éclair de Pistache
    ],
    total: 93.60,
    profit: 70.00,
    paymentMethod: 'Dinheiro',
    timestamp: '2026-06-10T16:32:00Z',
    customerName: 'Mariana Duarte',
    customerId: 'cst3',
    cashierSessionId: 'sess_prev',
    taxEmitted: true,
    nfeNumber: '10044',
    nfeChave: '35260611234567890123550010000100441000100441'
  },
  // 17:15 Peak
  {
    id: 's6',
    items: [
      { product: INITIAL_PRODUCTS[3], quantity: 2 }, // Coado V60
      { product: INITIAL_PRODUCTS[9], quantity: 1 }  // Torta Red Velvet
    ],
    total: 34.90,
    profit: 27.10,
    paymentMethod: 'Cartão de Crédito',
    timestamp: '2026-06-10T17:10:00Z',
    cashierSessionId: 'sess_prev',
    taxEmitted: false
  },
  // Today 08:15 (June 11)
  {
    id: 's7',
    items: [
      { product: INITIAL_PRODUCTS[0], quantity: 1 }, // Espresso
      { product: INITIAL_PRODUCTS[8], quantity: 1 }  // Pão de Queijo
    ],
    total: 14.40,
    profit: 11.20,
    paymentMethod: 'Dinheiro',
    timestamp: '2026-06-11T08:15:00Z',
    customerName: 'Roberto Alencar',
    customerId: 'cst4',
    cashierSessionId: 'sess_today',
    taxEmitted: true,
    nfeNumber: '10045',
    nfeChave: '35260611234567890123550010000100451000100452'
  },
  // Today 09:30 (June 11)
  {
    id: 's8',
    items: [
      { product: INITIAL_PRODUCTS[2], quantity: 1 }, // Latte Trufado
      { product: INITIAL_PRODUCTS[6], quantity: 1 }  // Croissant
    ],
    total: 38.40,
    profit: 26.00,
    paymentMethod: 'PIX',
    timestamp: '2026-06-11T09:30:00Z',
    customerName: 'Juliana Costa Lima',
    customerId: 'cst1',
    cashierSessionId: 'sess_today',
    taxEmitted: false
  }
];
