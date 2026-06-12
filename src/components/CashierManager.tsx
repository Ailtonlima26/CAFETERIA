import React, { useState } from 'react';
import { CashierSession, CashierTransaction, TableOrComanda, Product, CartItem, Sale, Customer } from '../types';
import { DollarSign, ArrowUpRight, ArrowDownLeft, Lock, Unlock, ClipboardList, ShoppingCart, User, Plus, Minus, CreditCard, Receipt } from 'lucide-react';

const logoDoisAmores = new URL('../assets/images/dois_amores_logo.jpg', import.meta.url).href;

// Complete high-fidelity programmatic thermal printing driver
const printElementProgrammatically = (elementId: string, paperWidth: '80mm' | '58mm') => {
  const el = document.getElementById(elementId);
  if (!el) {
    window.print();
    return;
  }

  // Create isolated programmatical iframe inside body
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Cupom - Dois Amores</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
            body {
              font-family: 'JetBrains Mono', monospace;
              margin: 0;
              padding: 4px;
              background-color: #fff;
              color: #000;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .font-semibold { font-weight: 600; }
            .font-medium { font-weight: 500; }
            .font-black { font-weight: 950; }
            .font-sans { font-family: sans-serif; }
            .font-mono { font-family: 'JetBrains Mono', monospace; }
            .uppercase { text-transform: uppercase; }
            .tracking-tight { letter-spacing: -0.025em; }
            .tracking-widest { letter-spacing: 0.1em; }
            .leading-tight { line-height: 1.25; }
            .leading-none { line-height: 1; }
            .text-sm { font-size: 14px; }
            .text-xs { font-size: 12px; }
            .text-\\[11px\\] { font-size: 11px; }
            .text-\[11px\] { font-size: 11px; }
            .text-\\[9px\\] { font-size: 9px; }
            .text-\[9px\] { font-size: 9px; }
            .text-\\[8px\\] { font-size: 8px; }
            .text-\[8px\] { font-size: 8px; }
            .text-\\[10px\\] { font-size: 10px; }
            .text-\[10px\] { font-size: 10px; }
            .text-stone-400 { color: #888; }
            .text-stone-500 { color: #666; }
            .text-stone-600 { color: #555; }
            .text-stone-750 { color: #2d241e; }
            .text-stone-800 { color: #2d241e; }
            .text-stone-900 { color: #111; }
            .text-rose-600 { color: #dc2626; }
            .text-amber-700 { color: #b45309; }
            .text-emerald-800 { color: #065f46; }
            .border-b { border-bottom: 2px solid #000; }
            .border-b-2 { border-bottom: 2px solid #000; }
            .border-dashed { border-style: dashed; }
            .border-stone-300 { border-color: #999; }
            .py-2 { padding-top: 8px; padding-bottom: 8px; }
            .py-2\\.5 { padding-top: 10px; padding-bottom: 10px; }
            .py-3 { padding-top: 12px; padding-bottom: 12px; }
            .py-0\\.5 { padding-top: 2px; padding-bottom: 2px; }
            .pb-2 { padding-bottom: 8px; }
            .mb-1\\.5 { margin-bottom: 6px; }
            .mt-1 { margin-top: 4px; }
            .mt-2 { margin-top: 8px; }
            .mt-2\\.5 { margin-top: 10px; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .h-14 { height: 56px; }
            .w-14 { width: 56px; }
            .h-4 { height: 16px; }
            .rounded-full { border-radius: 9999px; }
            .object-cover { object-fit: cover; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .justify-between { justify-content: space-between; }
            .tabular-nums { font-variant-numeric: tabular-nums; }
            .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
            .max-w-\\[130px\\] { max-width: 130px; }
            .break-all { word-break: break-all; }
            .space-y-0\\.5 > * + * { margin-top: 2px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .space-y-2 > * + * { margin-top: 8px; }
            .bg-stone-200 { background-color: #eee; }
            .bg-stone-50 { background-color: #f9f9f9; }
            .border { border: 1px solid #000; }
            .whitespace-pre-line { white-space: pre-line; }
            .text-[#d4a373] { color: #d4a373; }
            @media print {
              body { padding: 0; margin: 0; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div style="width: ${paperWidth === '58mm' ? '54mm' : '76mm'}; margin: 0 auto;">
            ${el.innerHTML}
          </div>
          <script>
            // Wait for images to load completely before printing
            const imgs = document.getElementsByTagName('img');
            let loadedCount = 0;
            if (imgs.length === 0) {
              triggerPrint();
            } else {
              for (let i = 0; i < imgs.length; i++) {
                if (imgs[i].complete) {
                  incrementCounter();
                } else {
                  imgs[i].addEventListener('load', incrementCounter);
                  imgs[i].addEventListener('error', incrementCounter);
                }
              }
            }
            function incrementCounter() {
              loadedCount++;
              if (loadedCount === imgs.length) {
                triggerPrint();
              }
            }
            function triggerPrint() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.frameElement.remove();
                }, 1000);
              }, 150);
            }
          </script>
        </body>
      </html>
    `);
    doc.close();
  }
};

interface CashierManagerProps {
  session: CashierSession | null;
  onOpenSession: (initialCash: number) => void;
  onCloseSession: (finalCash: number) => void;
  onAddTransaction: (type: 'entrada' | 'saida', amount: number, method: 'Dinheiro' | 'Cartão' | 'PIX', description: string) => void;
  tablesAndComandas: TableOrComanda[];
  products: Product[];
  customers: Customer[];
  onCheckout: (
    tableOrComandaId: string | null,
    items: CartItem[],
    paymentMethod: 'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX',
    cpf?: string,
    customerName?: string
  ) => { saleId: string } | null;
}

export default function CashierManager({
  session,
  onOpenSession,
  onCloseSession,
  onAddTransaction,
  tablesAndComandas,
  products,
  customers,
  onCheckout
}: CashierManagerProps) {
  // Tabs: 'fluxo-caixa' or 'pdv'
  const [activeTab, setActiveTab] = useState<'fluxo-caixa' | 'pdv'>('fluxo-caixa');
  
  // Thermal Printer Local Configuration
  const [paperWidth, setPaperWidth] = useState<'80mm' | '58mm'>(() => {
    return (localStorage.getItem('bistro_print_paper_width') as '80mm' | '58mm') || '80mm';
  });
  const [extraFeedLines, setExtraFeedLines] = useState<number>(() => {
    const saved = localStorage.getItem('bistro_print_feed_lines');
    return saved ? parseInt(saved, 10) : 2;
  });
  const [numCopies, setNumCopies] = useState<number>(() => {
    const saved = localStorage.getItem('bistro_print_copies');
    return saved ? parseInt(saved, 10) : 1;
  });
  const [customHeader, setCustomHeader] = useState<string>(() => {
    return localStorage.getItem('bistro_print_header') || 'CAFETERIA BISTRÔ';
  });
  const [customFooter, setCustomFooter] = useState<string>(() => {
    return localStorage.getItem('bistro_print_footer') || 'Obrigado pela preferência!\nVolte sempre!';
  });
  const [showPrinterSettings, setShowPrinterSettings] = useState(false);
  
  // Cashier opening/adjustment states
  const [cashAmount, setCashAmount] = useState<string>('200.00');
  const [adjustType, setAdjustType] = useState<'entrada' | 'saida'>('entrada');
  const [adjustAmount, setAdjustAmount] = useState<string>('');
  const [adjustDesc, setAdjustDesc] = useState<string>('');
  const [adjustMethod, setAdjustMethod] = useState<'Dinheiro' | 'Cartão' | 'PIX'>('Dinheiro');
  const [showAdjustModal, setShowAdjustModal] = useState(false);

  // PDV Terminal State
  const [selectedCheckoutTableId, setSelectedCheckoutTableId] = useState<string>('');
  const [counterCart, setCounterCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Dinheiro' | 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX'>('Dinheiro');
  const [customerCPF, setCustomerCPF] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [cashReceived, setCashReceived] = useState<string>('');
  const [checkoutComplete, setCheckoutComplete] = useState<Sale | null>(null);
  const [showClosingConfirmation, setShowClosingConfirmation] = useState<boolean>(false);

  // Filter tables and comandas that are in active/occupied state
  const activeTablesToClose = tablesAndComandas.filter(t => t.status !== 'livre');

  const handleOpenLocalCashier = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(cashAmount) || 0;
    onOpenSession(val);
  };

  const handleCloseLocalCashier = () => {
    if (!session) return;
    const finalCalculated = calculateTotalInCashier();
    if (confirm(`Confirmar fechamento do caixa diário? Saldo final calculado em dinheiro: R$ ${finalCalculated.toFixed(2)}`)) {
      onCloseSession(finalCalculated);
    }
  };

  const handleAddAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(adjustAmount) || 0;
    if (amount <= 0 || !adjustDesc) return;
    
    onAddTransaction(adjustType, amount, adjustMethod, adjustDesc);
    setAdjustAmount('');
    setAdjustDesc('');
    setShowAdjustModal(false);
  };

  const calculateTotalInCashier = (): number => {
    if (!session) return 0;
    let total = session.initialCash;
    session.transactions.forEach(t => {
      // We only compute physical money floats (cash) strictly
      if (t.method === 'Dinheiro') {
        if (t.type === 'entrada' || t.type === 'venda-suprimento') {
          total += t.amount;
        } else if (t.type === 'saida') {
          total -= t.amount;
        }
      }
    });
    return total;
  };

  const calculateSessionMetrics = () => {
    if (!session) return { totalSales: 0, cash: 0, card: 0, pix: 0, sangria: 0, suprimento: 0 };
    let cash = session.initialCash;
    let card = 0;
    let pix = 0;
    let sangria = 0;
    let suprimento = 0;

    session.transactions.forEach(t => {
      if (t.type === 'venda-suprimento') {
        if (t.method === 'Dinheiro') cash += t.amount;
        else if (t.method === 'Cartão') card += t.amount;
        else if (t.method === 'PIX') pix += t.amount;
      } else if (t.type === 'entrada') {
        suprimento += t.amount;
        if (t.method === 'Dinheiro') cash += t.amount;
      } else if (t.type === 'saida') {
        sangria += t.amount;
        if (t.method === 'Dinheiro') cash -= t.amount;
      }
    });

    return {
      totalSales: (cash - session.initialCash - suprimento + sangria) + card + pix,
      cash,
      card,
      pix,
      sangria,
      suprimento
    };
  };

  // Run PDV sales
  const handlePDVSubmit = (autoPrint: boolean = false) => {
    let itemsToBill: CartItem[] = [];
    let tableId: string | null = null;

    if (selectedCheckoutTableId === 'balcao') {
      if (counterCart.length === 0) {
        alert('Adicione itens antes de fechar a venda.');
        return;
      }
      itemsToBill = counterCart;
    } else {
      const tb = tablesAndComandas.find(t => t.id === selectedCheckoutTableId);
      if (!tb) return;
      itemsToBill = tb.items;
      tableId = tb.id;
    }

    const res = onCheckout(tableId, itemsToBill, paymentMethod, customerCPF, customerName);
    if (res) {
      // Simulate receipt layout
      const totalCostNum = itemsToBill.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      const simulatedSale: Sale = {
        id: res.saleId,
        items: itemsToBill,
        total: totalCostNum,
        profit: totalCostNum * 0.7, // Simulated direct margin
        paymentMethod,
        timestamp: new Date().toISOString(),
        customerName: customerName || 'Consumidor Final',
        cashierSessionId: session?.id || '',
        taxEmitted: true,
        cpf: customerCPF,
        nfeNumber: (10000 + Math.floor(Math.random() * 500)).toString(),
        nfeChave: '352606' + Math.floor(100000000000000000 + Math.random() * 900000000000000000)
      };
      
      setCheckoutComplete(simulatedSale);
      
      // Clean up local checkout states
      setCounterCart([]);
      setSelectedCheckoutTableId('');
      setCustomerCPF('');
      setCustomerName('');
      setCashReceived('');
      setShowClosingConfirmation(false);

      if (autoPrint) {
        // Automatically trigger browser print workflow for seamless experience
        setTimeout(() => {
          printElementProgrammatically('thermal-receipt-printable', paperWidth);
        }, 500);
      }
    }
  };

  // Validate and initiate order checkout by asking printing choices
  const handleInitiateCheckout = () => {
    if (!selectedCheckoutTableId) {
      alert('Por favor, selecione uma mesa, comanda ou o botão balcão.');
      return;
    }

    if (selectedCheckoutTableId === 'balcao') {
      if (counterCart.length === 0) {
        alert('Adicione itens antes de fechar a venda.');
        return;
      }
    } else {
      const tb = tablesAndComandas.find(t => t.id === selectedCheckoutTableId);
      if (!tb || tb.items.length === 0) {
        alert('Este pedido/comanda está vazio ou indisponível.');
        return;
      }
    }
    
    // Validate custom cash received value
    if (paymentMethod === 'Dinheiro') {
      const total = getCheckoutTotal();
      // Se não digitou nada (deixou em branco), assume o valor exato para facilitar e não bloquear!
      const received = cashReceived.trim() === '' ? total : (parseFloat(cashReceived) || 0);
      if (received < total) {
        alert(`O valor em dinheiro pago pelo cliente (R$ ${received.toFixed(2)}) é menor que o total do consumo (R$ ${total.toFixed(2)}).`);
        return;
      }
    }

    setShowClosingConfirmation(true);
  };

  const addToCounterCart = (prod: Product) => {
    const existing = counterCart.find(i => i.product.id === prod.id);
    if (existing) {
      setCounterCart(counterCart.map(item => item.product.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCounterCart([...counterCart, { product: prod, quantity: 1 }]);
    }
  };

  const updateCounterQty = (prodId: string, delta: number) => {
    setCounterCart(counterCart.map(item => {
      if (item.product.id === prodId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }).filter(i => i.quantity > 0));
  };

  const getCheckoutTotal = (): number => {
    if (selectedCheckoutTableId === 'balcao') {
      return counterCart.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);
    }
    const tb = tablesAndComandas.find(t => t.id === selectedCheckoutTableId);
    return tb ? tb.items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0) : 0;
  };

  const changeDue = parseFloat(cashReceived) ? parseFloat(cashReceived) - getCheckoutTotal() : 0;

  return (
    <div className="space-y-6">
      {/* Session closed warning */}
      {!session ? (
        <div className="bg-white border text-stone-800 rounded-2xl shadow-sm border-stone-200/80 p-8 max-w-md mx-auto text-center space-y-6 mt-8">
          <div className="h-16 w-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <Lock className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl tracking-tight text-stone-900">Caixa Diário Fechado</h2>
            <p className="text-stone-500 text-xs mt-1.5 max-w-sm mx-auto">
              Para realizar vendas e gerenciar mesas, você precisa fazer a abertura do caixa informando o fundo de reserva (fundo de troco).
            </p>
          </div>

          <form onSubmit={handleOpenLocalCashier} className="space-y-4 pt-4 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1.5 uppercase tracking-wider text-left pl-1">Fundo de Troco Inicial (R$)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs text-stone-400 font-bold">R$</span>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={cashAmount}
                  onChange={e => setCashAmount(e.target.value)}
                  className="w-full bg-stone-50/50 hover:bg-stone-50 p-2.5 pl-10 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-800 text-sm font-bold text-stone-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-950 text-white hover:bg-stone-800 rounded-xl text-xs font-bold transition shadow-md flex items-center justify-center gap-1"
              id="submit-open-cashier"
            >
              <Unlock className="h-3.5 w-3.5" /> Abrir Caixa Diário
            </button>
          </form>
        </div>
      ) : (
        /* Caixa is OPEN: Manage flows */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                  <DollarSign className="h-5 w-5 text-emerald-700" />
                  Operações de Caixa & Frente de Loja (PDV)
                </h2>
                <span className="px-2 py-0.5 bg-emerald-150 border border-emerald-300 text-emerald-800 text-[10px] font-bold rounded-full animate-pulse">
                  CAIXA OPERACIONAL ABERTO
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Sessão iniciada em {new Date(session.openTime).toLocaleString('pt-BR')}.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowPrinterSettings(true)}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-250 border border-stone-200 text-stone-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                title="Configurações da Impressora de Cupom"
                id="btn-printer-setup"
              >
                🖨️ Configurar Impressora
              </button>
              <button
                onClick={() => setActiveTab('fluxo-caixa')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                  activeTab === 'fluxo-caixa'
                    ? 'bg-stone-950 text-white border-stone-950'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
                id="tab-cashflow"
              >
                Fluxo de Caixa
              </button>
              <button
                onClick={() => setActiveTab('pdv')}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
                  activeTab === 'pdv'
                    ? 'bg-stone-950 text-white border-stone-950'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
                id="tab-pdv"
              >
                <ShoppingCart className="h-3.5 w-3.5" /> Terminal de Vendas (PDV)
              </button>
              <button
                onClick={handleCloseLocalCashier}
                className="px-3 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded-lg text-xs font-semibold transition flex items-center gap-1"
                id="btn-close-cashier"
              >
                <Lock className="h-3.5 w-3.5" /> Fechar Caixa
              </button>
            </div>
          </div>

          {activeTab === 'fluxo-caixa' ? (
            /* Tab Content 1: Caixa Flow Overview */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Financial balances summary */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pl-1">Resumo de Saldos do Turno</h3>
                
                {/* Physical Cash flow */}
                <div className="bg-white p-5 border text-stone-800 rounded-2xl shadow-sm border-stone-200/80">
                  <div className="text-xs font-bold text-stone-400">DINHEIRO EM GAVETA (FÍSICO)</div>
                  <div className="text-2xl font-bold font-serif text-stone-950 mt-1">R$ {calculateTotalInCashier().toFixed(2)}</div>
                  <div className="text-[10px] text-stone-500 mt-2">
                    Fundo de Troco Inicial: <span className="font-semibold text-stone-700">R$ {session.initialCash.toFixed(2)}</span>
                  </div>
                </div>

                {/* Card and PIX summaries */}
                <div className="bg-white p-5 border text-stone-800 rounded-2xl shadow-sm border-stone-200/80 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold text-stone-400">VENDAS EM CARTÃO</div>
                    <div className="text-lg font-bold text-stone-900">R$ {calculateSessionMetrics().card.toFixed(2)}</div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-[10px] font-bold text-stone-400">VENDAS EM PIX</div>
                    <div className="text-lg font-bold text-stone-900">R$ {calculateSessionMetrics().pix.toFixed(2)}</div>
                  </div>
                  <div className="border-t pt-2">
                    <div className="text-[10px] font-bold text-stone-400">TOTAL FATURADO HOJE</div>
                    <div className="text-lg font-bold text-emerald-700">R$ {calculateSessionMetrics().totalSales.toFixed(2)}</div>
                  </div>
                </div>

                {/* Quick actions for Cash flow */}
                <button
                  onClick={() => { setAdjustType('entrada'); setShowAdjustModal(true); }}
                  className="w-full py-3 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-xl text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5"
                  id="btn-suprimento"
                >
                  <ArrowUpRight className="h-4 w-4 text-emerald-600" /> Registrar Suprimento (Entrada)
                </button>
                <button
                  onClick={() => { setAdjustType('saida'); setShowAdjustModal(true); }}
                  className="w-full py-3 bg-white border border-stone-300 text-stone-800 hover:bg-stone-50 rounded-xl text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5"
                  id="btn-sangria"
                >
                  <ArrowDownLeft className="h-4 w-4 text-rose-500" /> Registrar Sangria (Retirada)
                </button>
              </div>

              {/* Center & Right Column: Transaction Logs of the Cashier */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pl-1">Movimentações de Receita / Despesas Diárias</h3>
                <div className="bg-white border rounded-2xl overflow-hidden shadow-sm border-stone-200/80">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                        <th className="p-3.5">Horário</th>
                        <th className="p-3.5">Descrição</th>
                        <th className="p-3.5">Forma</th>
                        <th className="p-3.5">Tipo</th>
                        <th className="p-3.5 text-right">Valor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {session.transactions.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-10 text-center text-stone-400 italic">
                            Nenhuma movimentação realizada ainda neste turno de caixa.
                          </td>
                        </tr>
                      ) : (
                        [...session.transactions].reverse().map((t, idx) => (
                          <tr key={idx} className="hover:bg-stone-50/50">
                            <td className="p-3.5 font-mono text-stone-500">
                              {new Date(t.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="p-3.5 font-medium text-stone-800">{t.description}</td>
                            <td className="p-3.5">
                              <span className="px-1.5 py-0.5 bg-stone-100 rounded font-medium text-stone-600">
                                {t.method}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.type === 'entrada' ? 'bg-emerald-50 text-emerald-800' :
                                t.type === 'venda-suprimento' ? 'bg-blue-50 text-blue-800' :
                                'bg-rose-50 text-rose-800'
                              }`}>
                                {t.type === 'entrada' ? 'Suprimento (Entrada)' :
                                 t.type === 'venda-suprimento' ? 'Venda PDV' : 'Sangria (Retirada)'}
                              </span>
                            </td>
                            <td className={`p-3.5 text-right font-bold ${
                              t.type === 'saida' ? 'text-rose-600' : 'text-emerald-700'
                            }`}>
                              {t.type === 'saida' ? '-' : '+'}R$ {t.amount.toFixed(2)}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            /* Tab Content 2: PDV (Point of Sale Interface) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Selection Column (Left: Mesas/Comandas or Balcão) */}
              <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Origem do Atendimento</h3>
                
                <div className="space-y-2">
                  {/* Select option structure */}
                  <label className="block text-xs font-semibold text-stone-700">Escolha o que faturar:</label>
                  <select
                    value={selectedCheckoutTableId}
                    onChange={e => {
                      setSelectedCheckoutTableId(e.target.value);
                      // Clear billing feedback
                      setCheckoutComplete(null);
                    }}
                    className="w-full bg-stone-50 p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600 font-medium text-stone-800 text-sm"
                    id="select-checkout-origin"
                  >
                    <option value="">-- Selecione uma mesa/comanda ativa --</option>
                    <option value="balcao">🏪 Venda Direta / Balcão (Avulso)</option>
                    {activeTablesToClose.map(table => (
                      <option key={table.id} value={table.id}>
                        {table.type === 'mesa' ? '🪑 ' : '🏷️ '} {table.number} ({table.status === 'conta' ? 'SOLICITOU CONTA' : 'EM CONSUMO'}) - R$ {table.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subview for Direct counter sales (Balcão) product list picker */}
                {selectedCheckoutTableId === 'balcao' && (
                  <div className="space-y-3 pt-3 border-t">
                    <label className="block text-xs font-semibold text-stone-700">Clique para lançar ao carrinho:</label>
                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                      {products.map(p => (
                        <button
                          key={p.id}
                          onClick={() => addToCounterCart(p)}
                          className="p-2 bg-stone-50 hover:bg-stone-100 border text-stone-800 rounded-lg text-[11px] font-medium transition text-left"
                        >
                          {p.name}
                          <span className="block font-bold text-stone-500 mt-0.5">R$ {p.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Customer CPF registry inside payment process */}
                {selectedCheckoutTableId && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Identificar Cliente (Opcional p/ Nota)</h4>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Nome do cliente"
                        className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={customerCPF}
                        onChange={e => setCustomerCPF(e.target.value)}
                        placeholder="CPF do cliente (000.000.000-00)"
                        className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Middle Column: Current Order Items in Checkout Basket */}
              <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between" style={{ minHeight: '380px' }}>
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Itens do Cupom Consumo</h3>
                  
                  {!selectedCheckoutTableId ? (
                    <div className="text-center py-20 text-stone-400 italic text-xs">
                      Selecione uma mesa ou comanda à esquerda para analisar os itens de consumo e processar o pagamento.
                    </div>
                  ) : selectedCheckoutTableId === 'balcao' && counterCart.length === 0 ? (
                    <div className="text-center py-20 text-stone-400 italic text-xs">
                      Sua venda direta está vazia. Toque nos produtos da esquerda para montá-la.
                    </div>
                  ) : (
                    <div className="divide-y max-h-64 overflow-y-auto pr-1">
                      {(selectedCheckoutTableId === 'balcao' 
                        ? counterCart 
                        : (tablesAndComandas.find(t => t.id === selectedCheckoutTableId)?.items || [])
                      ).map((item, idx) => (
                        <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <span className="font-bold text-stone-900">{item.product.name}</span>
                            {item.note && <span className="block text-[10px] text-rose-500 font-semibold mt-0.5">* Obs: {item.note}</span>}
                          </div>

                          <div className="flex items-center gap-3">
                            {selectedCheckoutTableId === 'balcao' ? (
                              <div className="flex items-center bg-stone-100 rounded-lg p-0.5">
                                <button onClick={() => updateCounterQty(item.product.id, -1)} className="h-5 w-5 bg-white text-stone-600 rounded flex items-center justify-center font-bold text-xs shadow-sm">-</button>
                                <span className="w-5 text-center font-bold text-stone-700">{item.quantity}</span>
                                <button onClick={() => updateCounterQty(item.product.id, 1)} className="h-5 w-5 bg-white text-stone-600 rounded flex items-center justify-center font-bold text-xs shadow-sm">+</button>
                              </div>
                            ) : (
                              <span className="font-semibold text-stone-500">x{item.quantity}</span>
                            )}
                            <span className="font-bold text-stone-800">R$ {(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Subtotal displays */}
                {selectedCheckoutTableId && (
                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Subtotal Geral</span>
                      <span>R$ {getCheckoutTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-900">
                      <span>Total à Receber</span>
                      <span className="text-emerald-700 text-lg">R$ {getCheckoutTotal().toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Payments selection and checkout trigger */}
              <div className="lg:col-span-4 bg-white border border-stone-200/80 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Formas de Pagamento</h3>
                
                {!selectedCheckoutTableId ? (
                  <div className="text-center py-20 text-stone-400 italic text-xs">
                    Preparações liberadas após faturamento.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        { key: 'Dinheiro', icon: '💵' },
                        { key: 'Cartão de Crédito', icon: '💳' },
                        { key: 'Cartão de Débito', icon: '💳' },
                        { key: 'PIX', icon: '⚡' }
                      ] as const).map(m => (
                        <button
                          key={m.key}
                          onClick={() => setPaymentMethod(m.key)}
                          className={`p-3 rounded-xl border font-bold text-xs transition flex flex-col items-center justify-center gap-1 ${
                            paymentMethod === m.key
                              ? 'bg-stone-900 border-stone-900 text-white shadow-md'
                              : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          <span className="text-lg">{m.icon}</span>
                          <span>{m.key}</span>
                        </button>
                      ))}
                    </div>

                    {/* Change due calculations if money */}
                    {paymentMethod === 'Dinheiro' && (
                      <div className="space-y-2 pt-2 border-t text-xs">
                        <div className="flex justify-between items-center">
                          <label className="font-semibold text-stone-700">Valor Entregue pelo Cliente (R$):</label>
                          <span className="text-[10px] text-stone-400 font-mono">(Deixe em branco para valor exato)</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          value={cashReceived}
                          onChange={e => setCashReceived(e.target.value)}
                          className="w-full bg-stone-50 p-2.5 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600 text-sm font-bold"
                        />
                        
                        {/* Botões de atalho rápido de valor */}
                        <div className="flex gap-1.5 flex-wrap pt-1">
                          <button
                            type="button"
                            onClick={() => setCashReceived(getCheckoutTotal().toFixed(2))}
                            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-2 py-1.5 rounded-lg text-[10px] transition border border-stone-200"
                          >
                            Valor Exato (R$ {getCheckoutTotal().toFixed(2)})
                          </button>
                          {[10, 20, 50, 100, 200].map(val => {
                            const total = getCheckoutTotal();
                            if (val >= total) {
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onClick={() => setCashReceived(val.toFixed(2))}
                                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold px-2 py-1.5 rounded-lg text-[10px] transition border border-stone-200"
                                >
                                  R$ {val.toFixed(2)}
                                </button>
                              );
                            }
                            return null;
                          })}
                        </div>

                        {parseFloat(cashReceived) > 0 && (
                          <div className="flex justify-between items-center p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl mt-2">
                            <span className="font-semibold text-[10px]">TROCO CALCULADO:</span>
                            <span className="font-bold text-sm">
                              {changeDue >= 0 ? `R$ ${changeDue.toFixed(2)}` : 'Aguardando valor restante...'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Checkout dispatch */}
                    <button
                      onClick={handleInitiateCheckout}
                      className="w-full py-4 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800 transition shadow-md flex items-center justify-center gap-1 mt-2 cursor-pointer"
                      id="btn-confirm-billing"
                    >
                      <Receipt className="h-4 w-4" /> Registrar & Fechar Cupom Fiscal
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* Checkout Completed success modal with NFC-e representation! */}
          {checkoutComplete && (
            <div className="fixed inset-0 bg-stone-950/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border text-stone-800 animate-in fade-in zoom-in-95 duration-250 max-h-[95vh] overflow-y-auto">
                <div className="text-center pb-3 border-b mb-4">
                  <span className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-1 font-bold">
                    ✓
                  </span>
                  <h3 className="font-serif font-black text-stone-900 text-base">Venda Concluída!</h3>
                  <p className="text-[10px] text-stone-400">Cupom Fiscal NFC-e emitido e pronto para impressão</p>
                </div>

                {/* Paper Width and formatting config inline selector */}
                <div className="grid grid-cols-2 gap-2 mb-3 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  <div>
                    <label className="block text-[9px] font-black uppercase text-stone-500 tracking-wider mb-1">Largura da Bobina</label>
                    <select
                      value={paperWidth}
                      onChange={(e) => {
                        const val = e.target.value as '80mm' | '58mm';
                        setPaperWidth(val);
                        localStorage.setItem('bistro_print_paper_width', val);
                      }}
                      className="w-full bg-white border border-stone-300 text-[11px] p-1.5 rounded focus:outline-none"
                    >
                      <option value="80mm">80mm (Padrão)</option>
                      <option value="58mm">58mm (Estreta)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-black uppercase text-stone-500 tracking-wider mb-1">Corte térmico (FEED)</label>
                    <select
                      value={extraFeedLines}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setExtraFeedLines(val);
                        localStorage.setItem('bistro_print_feed_lines', String(val));
                      }}
                      className="w-full bg-white border border-stone-300 text-[11px] p-1.5 rounded focus:outline-none"
                    >
                      <option value="0">Sem avanço</option>
                      <option value="1">1 Linha vazia</option>
                      <option value="2">2 Linhas vazias</option>
                      <option value="3">3 Linhas vazias</option>
                      <option value="4">4 Linhas vazias</option>
                      <option value="5">5 Linhas vazias</option>
                    </select>
                  </div>
                </div>

                {/* Thermal Ticket visualization */}
                <div 
                  id="thermal-receipt-printable"
                  className="bg-stone-50/70 border p-5 rounded-lg border-stone-250 font-mono text-xs text-stone-800 max-h-72 overflow-y-auto select-none shadow-inner print-thermal-source print:max-h-none print:overflow-visible print:border-none print:p-0 print:shadow-none print:bg-white"
                  style={{ 
                    width: paperWidth === '58mm' ? '54mm' : '76mm', 
                    margin: '0 auto',
                    fontSize: paperWidth === '58mm' ? '10px' : '11px',
                    lineHeight: '1.2'
                  }}
                >
                  <div className="text-center pb-2 border-b border-dashed border-stone-300">
                    <img
                      src={logoDoisAmores}
                      alt="Dois Amores Logo"
                      className="h-14 w-14 rounded-full object-cover mx-auto mb-1.5 border border-stone-250 bg-white"
                      referrerPolicy="no-referrer"
                    />
                    <p className="text-sm font-sans tracking-tight uppercase leading-tight font-black">Dois Amores</p>
                    <p className="text-[8px] font-sans tracking-widest text-amber-700 font-bold uppercase -mt-0.5 leading-none">Cafeteria • Confeitaria • Bistrô</p>
                    <p className="text-[9px] font-normal text-stone-400 font-sans mt-1">AV. PAULISTA, 1000 - SÃO PAULO/SP</p>
                    <p className="text-[9px] font-normal text-stone-400 font-sans">CNPJ: 12.345.678/0001-99</p>
                  </div>

                  <div className="py-2 text-[9px] space-y-0.5 border-b border-dashed border-stone-300 text-stone-500">
                    <p>DOC FISCAL: NFC-e Nº {checkoutComplete.nfeNumber}</p>
                    <p>SÉRIE: 001 | CHAVE DE ACESSO: </p>
                    <p className="break-all tracking-tighter text-[9px] text-stone-700">{checkoutComplete.nfeChave}</p>
                    <p>DATA: {new Date(checkoutComplete.timestamp).toLocaleString('pt-BR')}</p>
                    <p>CLIENTE: {checkoutComplete.customerName}</p>
                    {checkoutComplete.cpf && <p>CPF: {checkoutComplete.cpf}</p>}
                  </div>

                  <div className="py-2 border-b border-dashed border-stone-300 text-[10px]">
                    <div className="flex justify-between font-bold text-stone-900 pb-1">
                      <span>DESCRIÇÃO</span>
                      <span>QTD x UNIT = TOTAL</span>
                    </div>
                    {checkoutComplete.items.map((it, i) => (
                      <div key={i} className="flex justify-between text-[9px] leading-tight select-text">
                        <span className="truncate max-w-[130px] font-medium">{it.product.name}</span>
                        <span className="tabular-nums font-semibold">{it.quantity}x R${it.product.price.toFixed(2)} = R${(it.product.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="py-2 border-b border-dashed border-stone-300 space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-stone-900 text-sm">
                      <span>TOTAL CONSUMO</span>
                      <span className="tabular-nums">R$ {checkoutComplete.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-stone-600 text-[10px]">
                      <span>FORMA PAGTO ({checkoutComplete.paymentMethod})</span>
                      <span className="tabular-nums font-bold">R$ {checkoutComplete.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="text-center pt-3 font-sans space-y-1 text-[9px] text-stone-400">
                    <p>TRIBUTOS INCIDENTES (LEI 12.741): R$ {(checkoutComplete.total * 0.1345).toFixed(2)} (13.45%)</p>
                    <div className="w-16 h-16 bg-stone-200 border text-stone-600 font-mono text-[9px] mx-auto mt-2 flex items-center justify-center font-bold">QR CODE</div>
                    <p className="text-stone-700 font-mono text-[9px] leading-tight whitespace-pre-line mt-2.5 font-bold uppercase">{customFooter}</p>
                  </div>

                  {Array.from({ length: extraFeedLines }).map((_, idx) => (
                    <div key={`feed-${idx}`} className="h-4" aria-hidden="true">&nbsp;</div>
                  ))}
                </div>

                {/* Printer guidance notification helper box */}
                <div className="mt-3 bg-amber-50 border border-amber-200 p-2 text-[9.5px] rounded-xl text-stone-700 space-y-1">
                  <span className="font-bold text-amber-800">💡 AJUSTE DE IMPRESSÃO REAL:</span>
                  <p className="leading-tight">
                    Ao abrir a tela do sistema (Ctrl+P / Command+P): defina Margens: <b>NENHUMA</b>, desmarque <b>Cabeçalhos/Rodapés</b>, e defina a Escala como <b>Caber na Largura</b> para um aproveitamento térmico de 100%.
                  </p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      printElementProgrammatically('thermal-receipt-printable', paperWidth);
                    }}
                    className="flex-grow py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                    id="btn-print-thermal-receipt"
                  >
                    🖨️ IMPRIMIR CUPOM AGORA
                  </button>
                  <button
                    onClick={() => setCheckoutComplete(null)}
                    className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold transition cursor-pointer"
                    id="checkout-close-success"
                  >
                    Voltar / Fechar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Adjust float cash flow modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border text-stone-800">
            <div className="flex justify-between items-center mb-4 border-b pb-1.5">
              <h3 className="font-serif font-black text-stone-900 text-sm">
                Registrar {adjustType === 'entrada' ? 'Suprimento (Entrada de Caixa)' : 'Sangria (Retirada de Caixa)'}
              </h3>
              <button onClick={() => setShowAdjustModal(false)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <form onSubmit={handleAddAdjustment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">VALOR (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={adjustAmount}
                  onChange={e => setAdjustAmount(e.target.value)}
                  className="w-full bg-stone-50 p-2.5 border border-stone-300 rounded-xl font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">MEIO</label>
                <select
                  value={adjustMethod}
                  onChange={e => setAdjustMethod(e.target.value as any)}
                  className="w-full bg-stone-50 p-2 border border-stone-300 rounded-xl focus:outline-none text-xs"
                >
                  <option value="Dinheiro">Dinheiro Físico</option>
                  <option value="Cartão">Cartão</option>
                  <option value="PIX">PIX</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-600 mb-1">MOTIVO / DESCRIÇÃO JUSTIFICADA</label>
                <textarea
                  required
                  placeholder="Ex: Troco de notas de R$ 2,00 ou Retirada p/ pagamento de boy externo."
                  value={adjustDesc}
                  onChange={e => setAdjustDesc(e.target.value)}
                  className="w-full bg-stone-50 p-2 border border-stone-300 rounded-xl text-xs focus:outline-none h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-grow py-2.5 bg-stone-950 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition"
                  id="confirm-adjustment"
                >
                  Confirmar Registro
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation of checkout wizard modal */}
      {showClosingConfirmation && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-md flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-stone-200 text-stone-900 animate-in zoom-in-95 duration-150">
            <div className="text-center pb-4 border-b mb-4">
              <span className="inline-flex h-12 w-12 bg-amber-50 text-amber-600 rounded-full items-center justify-center mb-2 font-bold text-xl">
                ❓
              </span>
              <h3 className="font-serif font-black text-stone-900 text-base">Fechar Pedido / Comanda</h3>
              <p className="text-xs text-stone-500 mt-1">
                Como deseja encerrar este pedido de <strong className="text-stone-900">R$ {getCheckoutTotal().toFixed(2)}</strong>?
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handlePDVSubmit(true)}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center justify-center gap-2 cursor-pointer border-0"
                id="modal-confirm-print-close"
              >
                🖨️ Imprimir Cupom e Fechar Pedido
              </button>

              <button
                type="button"
                onClick={() => handlePDVSubmit(false)}
                className="w-full py-3 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border-0"
                id="modal-confirm-close-only"
              >
                🚫 Apenas Fechar Pedido (Sem Cupom)
              </button>

              <button
                type="button"
                onClick={() => setShowClosingConfirmation(false)}
                className="w-full py-2.5 px-4 bg-white hover:bg-stone-50 text-stone-500 font-bold text-xs rounded-xl border border-stone-200 transition flex items-center justify-center cursor-pointer"
              >
                Cancelar (Voltar)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thermal Printer Config Modal */}
      {showPrinterSettings && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border text-stone-850 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-stone-200">
              <h3 className="font-serif font-black text-stone-900 text-sm flex items-center gap-1.5">
                🖨️ Configuração da Impressora Térmica
              </h3>
              <button 
                onClick={() => setShowPrinterSettings(false)} 
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 text-stone-800 p-3 rounded-xl leading-relaxed">
                Configure aqui as definições físicas da sua impressora de rolo (térmica) para otimizar o preenchimento de papel:
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">TAMANHO DA BOBINA / LARGURA DO PAPEL</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaperWidth('80mm');
                      localStorage.setItem('bistro_print_paper_width', '80mm');
                    }}
                    className={`py-2 px-3 border rounded-xl font-bold transition text-[11px] ${
                      paperWidth === '80mm'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-250 hover:bg-stone-100'
                    }`}
                  >
                    80mm (Padrão de Mesa)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPaperWidth('58mm');
                      localStorage.setItem('bistro_print_paper_width', '58mm');
                    }}
                    className={`py-2 px-3 border rounded-xl font-bold transition text-[11px] ${
                      paperWidth === '58mm'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-250 hover:bg-stone-100'
                    }`}
                  >
                    58mm (Mini Impressora)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">CABEÇALHO PERSONALIZADO DO CUPOM</label>
                <input
                  type="text"
                  value={customHeader}
                  onChange={(e) => {
                    setCustomHeader(e.target.value);
                    localStorage.setItem('bistro_print_header', e.target.value);
                  }}
                  className="w-full bg-stone-50/50 p-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-850 text-xs text-stone-900 font-bold"
                  placeholder="Ex: CAFETERIA BISTRÔ"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">MENSAGEM DE RODAPÉ PERSONALIZADA</label>
                <textarea
                  value={customFooter}
                  onChange={(e) => {
                    setCustomFooter(e.target.value);
                    localStorage.setItem('bistro_print_footer', e.target.value);
                  }}
                  className="w-full bg-stone-50/50 p-2 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-850 text-xs text-stone-900 h-16 font-semibold"
                  placeholder="Mensagem final do cupom..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">QUANTIDADE DE VIAS AUTOMÁTICAS</label>
                <select
                  value={numCopies}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setNumCopies(val);
                    localStorage.setItem('bistro_print_copies', String(val));
                  }}
                  className="w-full bg-stone-50/50 p-2 border border-stone-300 rounded-xl focus:outline-none text-xs"
                >
                  <option value="1">1 Via (Padrão)</option>
                  <option value="2">2 Vias (Cliente + Estabelecimento)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">AVANÇO DE LINHA FINAL (FEED)</label>
                <select
                  value={extraFeedLines}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setExtraFeedLines(val);
                    localStorage.setItem('bistro_print_feed_lines', String(val));
                  }}
                  className="w-full bg-stone-50/50 p-2 border border-stone-300 rounded-xl focus:outline-none text-xs"
                >
                  <option value="0">0 Linhas (Sem corte)</option>
                  <option value="1">1 Linha vazia</option>
                  <option value="2">2 Linhas vazias (Padrão)</option>
                  <option value="3">3 Linhas vazias</option>
                  <option value="4">4 Linhas vazias</option>
                  <option value="5">5 Linhas vazias (Manual extra)</option>
                </select>
                <p className="text-[10px] text-stone-400 mt-1">Garante que o papel suba um pouco após a impressão para permitir o corte perfeito sem truncar as últimas linhas.</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPrinterSettings(false)}
                className="px-6 py-2 bg-stone-950 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition cursor-pointer"
              >
                OK, Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
