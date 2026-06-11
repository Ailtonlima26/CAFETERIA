import React, { useState } from 'react';
import { Product, TableOrComanda, CartItem, ProductionTicket, ProductionItem } from '../types';
import { User, ShoppingBag, Plus, Minus, Send, CheckCircle2, ClipboardList, UtensilsCrossed, FileText, Laptop } from 'lucide-react';

interface WaiterAppProps {
  products: Product[];
  tablesAndComandas: TableOrComanda[];
  onAddOrderToTable: (id: string, items: CartItem[], waiterName: string) => void;
  onSetTableStatus: (id: string, status: 'livre' | 'ocupada' | 'conta') => void;
  isStandalone?: boolean;
  onExitStandalone?: () => void;
  dbConnected?: boolean;
  dbError?: string | null;
}

const REGISTERED_WAITERS = ['Carlos Silva', 'Marta Souza', 'Letícia Cruz', 'Rodrigo Melo'];

export default function WaiterApp({
  products,
  tablesAndComandas,
  onAddOrderToTable,
  onSetTableStatus,
  isStandalone = false,
  onExitStandalone,
  dbConnected = true,
  dbError = null
}: WaiterAppProps) {
  const [currentWaiter, setCurrentWaiter] = useState<string>('');
  const [newWaiterName, setNewWaiterName] = useState<string>('');
  const [waiterList, setWaiterList] = useState<string[]>(REGISTERED_WAITERS);
  
  const [selectedTableId, setSelectedTableId] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [tempCart, setTempCart] = useState<CartItem[]>([]);
  const [customNote, setCustomNote] = useState<{ [productId: string]: string }>({});
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Filter products
  const filteredProducts = activeCategory === 'Todos'
    ? products
    : products.filter(p => p.category === activeCategory);

  const activeTable = tablesAndComandas.find(t => t.id === selectedTableId);

  const handleAddWaiter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newWaiterName.trim() && !waiterList.includes(newWaiterName.trim())) {
      setWaiterList([...waiterList, newWaiterName.trim()]);
      setCurrentWaiter(newWaiterName.trim());
      setNewWaiterName('');
    }
  };

  const updateCartItemQty = (product: Product, speed: number) => {
    const existing = tempCart.find(i => i.product.id === product.id);
    if (!existing && speed > 0) {
      setTempCart([...tempCart, { product, quantity: 1, note: customNote[product.id] || '' }]);
    } else if (existing) {
      const updated = tempCart.map(item => {
        if (item.product.id === product.id) {
          const nextQty = item.quantity + speed;
          return { ...item, quantity: nextQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
      setTempCart(updated);
    }
  };

  const handleNoteChange = (productId: string, val: string) => {
    setCustomNote({ ...customNote, [productId]: val });
    setTempCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        return { ...item, note: val };
      }
      return item;
    }));
  };

  const handleSendToProduction = () => {
    if (!selectedTableId || !currentWaiter || tempCart.length === 0) return;

    onAddOrderToTable(selectedTableId, tempCart, currentWaiter);
    
    // Reset state
    setTempCart([]);
    setCustomNote({});
    setSuccessAnimation(true);
    
    setTimeout(() => {
      setSuccessAnimation(false);
      setSelectedTableId(''); // Go back to table select
    }, 1800);
  };

  const handlePedirConta = () => {
    if (!selectedTableId) return;
    onSetTableStatus(selectedTableId, 'conta');
    alert(`Conta solicitada para o ${activeTable?.number}! Status alterado para 'Fechamento' no Caixa.`);
  };

  const getCartProductQty = (productId: string) => {
    return tempCart.find(item => item.product.id === productId)?.quantity || 0;
  };

  // Render core sub-views (reusable in mockup or standalone)
  const renderCoreContent = () => (
    <>
      {/* App Header (Only included in standard layout - standalone layout has its own premium header) */}
      {!isStandalone && (
        <div className="bg-gradient-to-b from-stone-900 to-stone-800 text-stone-100 p-5 pb-6 shadow-md relative">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-serif font-bold text-cream-50 tracking-tight">Garçom Bistrô</h1>
                <span className={`inline-flex items-center gap-1 text-[8.5px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  dbConnected ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  {dbConnected ? 'CONECTADO EM TEMPO REAL' : 'OFFLINE / ERRO'}
                </span>
              </div>
              <p className="text-[10px] text-stone-400 mt-0.5">Canal de Lançamento Digital Ativo</p>
              {dbError && (
                <p className="text-[8.5px] text-rose-300 font-mono mt-1 max-w-xs shrink line-clamp-2">
                  Aviso: {dbError}
                </p>
              )}
            </div>
            {currentWaiter && (
              <div className="flex items-center gap-1.5 bg-stone-700/60 px-2.5 py-1 rounded-full border border-stone-600/40">
                <User className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-xs font-medium max-w-[80px] truncate">{currentWaiter}</span>
                <button onClick={() => setCurrentWaiter('')} className="text-stone-400 hover:text-white text-[10px] ml-1">🔀</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 1: Select Waiter */}
      {!currentWaiter ? (
        <div className="p-6 space-y-6 flex-grow flex flex-col justify-center">
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-full bg-stone-900 flex items-center justify-center mx-auto text-stone-100">
              <User className="h-6 w-6" />
            </div>
            <h2 className="font-semibold text-stone-900 text-sm">Quem está operando agora?</h2>
            <p className="text-stone-500 text-xs">Identifique-se para computar as comissões e encaminhar os pedidos.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {waiterList.map(w => (
              <button
                key={w}
                onClick={() => setCurrentWaiter(w)}
                className="p-3 bg-white border border-stone-200 text-stone-800 font-medium rounded-xl text-xs hover:border-stone-450 hover:bg-stone-50 transition text-center shadow-sm active:scale-95"
              >
                {w}
              </button>
            ))}
          </div>

          <form onSubmit={handleAddWaiter} className="pt-4 border-t border-stone-200 mt-auto">
            <label className="block text-xs font-semibold text-stone-700 mb-2">Cadastrar Novo Atendente (Ilimitado)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newWaiterName}
                onChange={e => setNewWaiterName(e.target.value)}
                placeholder="Nome do Garçom..."
                className="flex-grow p-2.5 text-xs bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-850 transition"
                id="btn-add-waiter"
              >
                Cadastrar
              </button>
            </div>
          </form>
        </div>
      ) : !selectedTableId ? (
        /* Step 2: Select Table or Comanda */
        <div className={`p-4 space-y-4 overflow-y-auto ${isStandalone ? 'flex-grow' : 'max-h-[520px]'}`}>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs font-bold uppercase text-stone-500 tracking-wider flex items-center gap-1">
              <ClipboardList className="h-3.5 w-3.5" />
              Selecione o Local / Registro
            </h3>
          </div>

          {/* Quick Stats of occupied */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-sm">
              <div className="text-[10px] text-stone-400 font-medium">MESAS OCUPADAS</div>
              <div className="text-xl font-bold text-stone-900">
                {tablesAndComandas.filter(t => t.type === 'mesa' && t.status !== 'livre').length} / {tablesAndComandas.filter(t => t.type === 'mesa').length}
              </div>
            </div>
            <div className="bg-white p-3 rounded-xl border border-stone-200/80 shadow-sm">
              <div className="text-[10px] text-stone-400 font-medium">COMANDAS EM USO</div>
              <div className="text-xl font-bold text-stone-900">
                {tablesAndComandas.filter(t => t.type === 'comanda' && t.status !== 'livre').length}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Mesas Section */}
            <div>
              <h4 className="text-[11px] font-bold text-stone-600 mb-2 pl-1">MESAS DO SALÃO</h4>
              <div className="grid grid-cols-4 gap-2">
                {tablesAndComandas.filter(t => t.type === 'mesa').map(table => {
                  const isOcupada = table.status === 'ocupada';
                  const isConta = table.status === 'conta';
                  return (
                    <button
                      key={table.id}
                      onClick={() => setSelectedTableId(table.id)}
                      className={`h-14 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                        isConta ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-inner' :
                        isOcupada ? 'bg-stone-900 border-stone-950 text-white shadow-md' :
                        'bg-white border-stone-200 text-stone-800 hover:border-stone-400 shadow-sm'
                      }`}
                    >
                      <span className="font-semibold text-xs font-sans">{table.number.split(' ')[1]}</span>
                      <span className="text-[8px] font-medium opacity-85 uppercase">
                        {isConta ? 'CONTA' : isOcupada ? 'OCUPADA' : 'LIVRE'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comandas Section */}
            <div>
              <h4 className="text-[11px] font-bold text-stone-600 mb-2 pl-1">COMANDAS MAGNÉTICAS</h4>
              <div className="grid grid-cols-3 gap-2">
                {tablesAndComandas.filter(t => t.type === 'comanda').map(comanda => {
                  const isOcupada = comanda.status === 'ocupada';
                  const isConta = comanda.status === 'conta';
                  return (
                    <button
                      key={comanda.id}
                      onClick={() => setSelectedTableId(comanda.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                        isConta ? 'bg-amber-50 border-amber-300 text-amber-950' :
                        isOcupada ? 'bg-stone-900 border-stone-950 text-white shadow-md' :
                        'bg-white border-stone-200 text-stone-800 hover:border-stone-400 shadow-sm'
                      }`}
                    >
                      <span className="font-semibold text-[11px] tracking-tight">{comanda.number}</span>
                      <span className="text-[7px] tracking-widest font-bold opacity-80 mt-0.5">
                        {isConta ? 'CONTA' : isOcupada ? 'EM USO' : 'DISPONÍVEL'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Step 3: Take Order Menu & Basket */
        <div className={`p-4 space-y-4 overflow-y-auto relative ${isStandalone ? 'flex-grow scrollbar-none' : 'max-h-[520px]'}`}>
          
          {/* Active Header for table */}
          <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-stone-200 shadow-sm">
            <div>
              <span className="text-[10px] text-stone-400 font-bold block uppercase leading-none">REGISTRANDO EM</span>
              <span className="font-serif font-black text-stone-900 text-sm">{activeTable?.number}</span>
              {activeTable?.status !== 'livre' && (
                <span className="text-[9px] text-rose-500 font-medium block mt-0.5">Consumo Atual: R$ {activeTable?.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toFixed(2)}</span>
              )}
            </div>
            <div className="flex gap-2">
              {activeTable?.status === 'ocupada' && (
                <button
                  onClick={handlePedirConta}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-0.5"
                >
                  <FileText className="h-3 w-3" /> Pedir Conta
                </button>
              )}
              <button
                onClick={() => { setSelectedTableId(''); setTempCart([]); }}
                className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-[10px] font-bold transition"
              >
                Voltar
              </button>
            </div>
          </div>

          {/* Categories Tab */}
          <div className="flex gap-1 overflow-x-auto pb-1 max-w-full scrollbar-none">
            {['Todos', 'Cafés', 'Bebidas', 'Salgados', 'Doces', 'Confeitaria'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-stone-900 text-stone-100 shadow'
                    : 'bg-white border text-stone-500 border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products List for Waiter */}
          <div className="space-y-2">
            {filteredProducts.map(prod => {
              const qty = getCartProductQty(prod.id);
              const isLowStock = prod.stock <= prod.minStock;

              return (
                <div key={prod.id} className="bg-white p-3 rounded-xl border border-stone-200 shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="max-w-[70%]">
                      <div className="font-semibold text-stone-900 text-xs leading-snug">{prod.name}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1">
                        <span>R$ {prod.price.toFixed(2)}</span>
                        <span>•</span>
                        <span className={isLowStock ? 'text-amber-600 font-bold' : ''}>
                          Estoque: {prod.stock} {prod.unit}
                        </span>
                      </div>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center bg-stone-100 rounded-lg p-0.5 border border-stone-200 select-none">
                      <button
                        onClick={() => updateCartItemQty(prod, -1)}
                        className="h-6 w-6 rounded hover:bg-white text-stone-700 flex items-center justify-center font-bold text-xs active:scale-90 transition"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-stone-900">{qty}</span>
                      <button
                        onClick={() => updateCartItemQty(prod, 1)}
                        className="h-6 w-6 rounded hover:bg-white text-stone-700 flex items-center justify-center font-bold text-xs active:scale-90 transition"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Obs note field (only triggers when qty > 0 to save space) */}
                  {qty > 0 && (
                    <input
                      type="text"
                      value={customNote[prod.id] || ''}
                      onChange={e => handleNoteChange(prod.id, e.target.value)}
                      placeholder="Obs: Sem açúcar, gelo, bem quente, etc..."
                      className="w-full bg-stone-50/50 p-1.5 rounded-lg border border-stone-200 text-[10px] focus:outline-none focus:ring-1 focus:ring-stone-400 italic text-stone-600"
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Sticky checkout button for Mobile feel */}
          {tempCart.length > 0 && (
            <div className="sticky bottom-0 left-0 right-0 pt-2 pb-1 bg-gradient-to-t from-stone-50 via-stone-50 to-transparent z-10">
              <button
                onClick={handleSendToProduction}
                className="w-full bg-emerald-750 text-white bg-[#d4a373] text-stone-950 hover:bg-[#eac098] rounded-xl py-3 text-xs font-black transition flex items-center justify-center gap-2 shadow-lg active:scale-95"
              >
                <Send className="h-3.5 w-3.5 animate-pulse" />
                Confirmar & Enviar {tempCart.reduce((sum, item) => sum + item.quantity, 0)} Itens
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success feedback animation */}
      {successAnimation && (
        <div className="absolute inset-0 bg-stone-900/95 flex flex-col items-center justify-center z-40 text-stone-100 p-6 animate-in fade-in duration-200 text-center">
          <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-xl">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 animate-bounce" />
          </div>
          <h3 className="font-serif font-black text-[#d4a373] text-xl">Sucesso!</h3>
          <p className="text-stone-300 text-xs mt-1.5 max-w-[250px]">O pedido foi enviado aos setores e sincronizado instantaneamente.</p>
        </div>
      )}
    </>
  );

  if (isStandalone) {
    return (
      <div className="min-h-screen w-full bg-stone-50 text-stone-900 flex flex-col font-sans select-none overflow-x-hidden">
        
        {/* Standalone Real Mobile Header */}
        <header className="bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-stone-100 border-b border-stone-850 sticky top-0 z-50 px-4 py-3 shadow-md">
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-[#d4a373] flex items-center justify-center font-serif text-xs font-black tracking-tight text-stone-950">
                CB
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xs font-serif font-black tracking-tight leading-none text-white">
                    Cafeteria Bistrô
                  </h1>
                  <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500 animate-pulse'}`} title={dbConnected ? 'Sincronizado em tempo real' : `Erro de sincronização: ${dbError}`} />
                </div>
                <p className="text-[8px] text-[#d4a373] leading-none mt-1 font-bold uppercase tracking-wide">CANAL DO GARÇOM</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentWaiter && (
                <div className="flex items-center gap-1 bg-stone-850 px-2.5 py-1 rounded-full border border-stone-800">
                  <User className="h-3 w-3 text-[#d4a373] animate-pulse" />
                  <span className="text-[10px] font-semibold text-stone-200 max-w-[65px] truncate">{currentWaiter}</span>
                  <button onClick={() => setCurrentWaiter('')} className="text-stone-400 hover:text-white text-[9px] ml-1" title="Trocar Atendente">🔀</button>
                </div>
              )}
              {onExitStandalone && (
                <button
                  onClick={onExitStandalone}
                  className="px-2.5 py-1 bg-stone-800 hover:bg-stone-750 text-stone-200 border border-stone-700 rounded-full text-[10px] font-bold transition flex items-center gap-1 active:scale-95"
                >
                  <Laptop className="h-3 w-3 text-[#d4a373]" /> Gestão
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Real Full Screen Workspace layout with maximum vertical and touch real estate */}
        <div className="flex-grow w-full max-w-lg mx-auto flex flex-col relative pb-8">
          {renderCoreContent()}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-stone-50 border border-stone-200 rounded-[2.5rem] shadow-2xl overflow-hidden relative flex flex-col" style={{ minHeight: '650px' }}>
      
      {/* Smartphone Notch design */}
      <div className="bg-stone-900 text-stone-100 py-2.5 px-6 flex justify-between items-center text-[11px] font-medium tracking-tight">
        <span>09:41 ☕</span>
        <div className="w-24 h-4 bg-black rounded-b-xl absolute left-1/2 transform -translate-x-1/2 top-0"></div>
        <div className="flex items-center gap-1.5 grayscale">
          <span>📶</span>
          <span>🔋 100%</span>
        </div>
      </div>

      {renderCoreContent()}
      
      {/* Smartphone Home Indicator line */}
      <div className="bg-stone-50/50 py-2 mt-auto flex justify-center items-center">
        <div className="w-32 h-1.5 bg-stone-400 rounded-full"></div>
      </div>
    </div>
  );
}
