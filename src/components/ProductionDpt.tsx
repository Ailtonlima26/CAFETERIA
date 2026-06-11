import React, { useState } from 'react';
import { ProductionTicket, ProductionItem } from '../types';
import { Printer, Check, Clock, Utensils, Coffee, Cake, Bell } from 'lucide-react';

interface ProductionDptProps {
  tickets: ProductionTicket[];
  onUpdateStatus: (ticketId: string, status: 'pendente' | 'preparando' | 'pronto' | 'entregue') => void;
}

export default function ProductionDpt({ tickets, onUpdateStatus }: ProductionDptProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<'Todos' | 'Cozinha' | 'Confeitaria' | 'Copa/Balcão'>('Todos');
  const [printedReceipt, setPrintedReceipt] = useState<ProductionTicket | null>(null);

  // Dynamic physical printer setup loaded from shared local storage settings
  const [paperWidth, setPaperWidth] = useState<'80mm' | '58mm'>(() => {
    return (localStorage.getItem('bistro_print_paper_width') as '80mm' | '58mm') || '80mm';
  });
  const [extraFeedLines, setExtraFeedLines] = useState<number>(() => {
    const saved = localStorage.getItem('bistro_print_feed_lines');
    return saved ? parseInt(saved, 10) : 2;
  });

  // Filter tickets that are not yet 'entregue'
  const activeTickets = tickets.filter(t => t.status !== 'entregue');

  // Filter items in each ticket by the selected department
  const getFilteredItems = (ticket: ProductionTicket): ProductionItem[] => {
    if (selectedDepartment === 'Todos') return ticket.items;
    return ticket.items.filter(item => item.department === selectedDepartment);
  };

  const getDepartmentIcon = (dept: string) => {
    switch (dept) {
      case 'Cozinha': return <Utensils className="h-4 w-4 text-amber-700" />;
      case 'Confeitaria': return <Cake className="h-4 w-4 text-emerald-700" />;
      default: return <Coffee className="h-4 w-4 text-brown-700" />;
    }
  };

  const speakAlert = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePrint = (ticket: ProductionTicket) => {
    setPrintedReceipt(ticket);
    speakAlert(`Imprimindo pedido do ${ticket.tableNumber}`);
    setTimeout(() => {
      // Simulate real browser print window but inside styled overlay
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Printer className="h-5 w-5 text-emerald-700" />
            Painel KDS / Impressão por Departamento
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Visualização de comandas direcionadas automaticamente para Cozinha, Confeitaria ou Copa.
          </p>
        </div>

        {/* Tab-styled filters */}
        <div className="flex flex-wrap p-1 bg-stone-100 rounded-lg gap-1 border border-stone-200/60 self-start">
          {(['Todos', 'Cozinha', 'Confeitaria', 'Copa/Balcão'] as const).map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedDepartment === dept
                  ? 'bg-white text-stone-900 shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-50/50'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of active production tickets */}
      {activeTickets.filter(t => getFilteredItems(t).length > 0).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-stone-200/80 p-8 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
            <Check className="h-6 w-6 text-emerald-700" />
          </div>
          <h3 className="font-medium text-stone-800 text-sm">Tudo em dia!</h3>
          <p className="text-stone-500 text-xs max-w-sm mt-1">
            Nenhum pedido pendente de preparação {selectedDepartment !== 'Todos' ? `no setor ${selectedDepartment}` : 'nos departamentos'}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTickets
            .filter(t => getFilteredItems(t).length > 0)
            .map(ticket => {
              const displayItems = getFilteredItems(ticket);
              const isPendente = ticket.status === 'pendente';
              const isPreparando = ticket.status === 'preparando';
              const isPronto = ticket.status === 'pronto';

              return (
                <div
                  key={ticket.id}
                  className={`bg-white border text-stone-800 rounded-xl shadow-sm transition-all relative overflow-hidden flex flex-col justify-between ${
                    isPendente ? 'border-amber-200 ring-2 ring-amber-100/50' : 
                    isPreparando ? 'border-blue-200 ring-2 ring-blue-50' : 'border-stone-200'
                  }`}
                  id={`ticket-${ticket.id}`}
                >
                  {/* Status Banner */}
                  <div className={`px-4 py-2 text-xs font-semibold flex justify-between items-center ${
                    isPendente ? 'bg-amber-50 text-amber-800' :
                    isPreparando ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    <span className="capitalize flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      {isPendente ? 'Pendente' : isPreparando ? 'Em Preparação' : 'Pronto para Servir'}
                    </span>
                    <span>
                      {new Date(ticket.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Receipt body resembling thermal paper */}
                  <div className="p-5 flex-grow font-mono text-xs">
                    <div className="border-b-2 border-dashed border-stone-200 pb-3 mb-3">
                      <div className="flex justify-between items-start font-sans font-bold text-base text-stone-900">
                        <span>{ticket.tableNumber}</span>
                        <span className="text-xs px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-medium">
                          {ticket.type === 'mesa' ? 'Mesa' : 'Comanda'}
                        </span>
                      </div>
                      <div className="text-stone-400 mt-1 font-sans text-xs">
                        Atendente: {ticket.waiterName || 'Balcão'}
                      </div>
                    </div>

                    {/* Filtered Order Items */}
                    <div className="space-y-3 pb-3 border-b-2 border-dashed border-stone-200">
                      {displayItems.map((item, idx) => (
                        <div key={idx} className="flex flex-col bg-stone-50/50 p-2 rounded">
                          <div className="flex justify-between font-bold text-stone-900 text-sm">
                            <span className="flex items-center gap-1.5">
                              {getDepartmentIcon(item.department)}
                              {item.productName}
                            </span>
                            <span className="text-stone-700 bg-stone-200/70 px-1.5 rounded font-sans pr-1">
                              x{item.quantity}
                            </span>
                          </div>
                          {item.note && (
                            <span className="text-rose-600 mt-1 font-sans text-xs font-semibold pl-5">
                              * Obs: {item.note}
                            </span>
                          )}
                          {selectedDepartment === 'Todos' && (
                            <span className="text-[10px] text-stone-400 pl-5 uppercase font-sans mt-0.5">
                              Depto: {item.department}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 text-stone-400 text-[10px] text-center">
                      #ID {ticket.id.slice(0, 8).toUpperCase()} • IMPRESSORA TERMICA LPT1
                    </div>
                  </div>

                  {/* Control actions */}
                  <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex gap-2">
                    <button
                      onClick={() => handlePrint(ticket)}
                      title="Imprimir Cupom de Produção"
                      className="px-3 py-2 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-100 hover:text-stone-900 transition flex items-center justify-center"
                      id={`print-${ticket.id}`}
                    >
                      <Printer className="h-4 w-4" />
                    </button>

                    {isPendente && (
                      <button
                        onClick={() => {
                          onUpdateStatus(ticket.id, 'preparando');
                          speakAlert(`Preparando pedido da ${ticket.tableNumber}`);
                        }}
                        className="flex-grow py-2 bg-stone-950 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition shadow-sm"
                        id={`prep-${ticket.id}`}
                      >
                        Iniciar Preparo
                      </button>
                    )}

                    {isPreparando && (
                      <button
                        onClick={() => {
                          onUpdateStatus(ticket.id, 'pronto');
                          speakAlert(`Pedido da ${ticket.tableNumber} concluído e pronto para servir`);
                        }}
                        className="flex-grow py-2 bg-emerald-700 text-white rounded-lg text-xs font-medium hover:bg-emerald-800 transition shadow-sm"
                        id={`done-${ticket.id}`}
                      >
                        Concluir Preparo
                      </button>
                    )}

                    {isPronto && (
                      <button
                        onClick={() => onUpdateStatus(ticket.id, 'entregue')}
                        className="flex-grow py-2 bg-stone-250 text-stone-800 border border-stone-300 rounded-lg text-xs font-medium hover:bg-stone-300/80 transition"
                        id={`deliver-${ticket.id}`}
                      >
                        Despachar / Entregar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* Styled virtual receipt print preview modal */}
      {printedReceipt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-stone-100 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3 pb-2 border-b">
              <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                <Bell className="h-3.5 w-3.5 text-emerald-600 animate-bounce" /> Via de Produção (KDS)
              </span>
              <button
                onClick={() => setPrintedReceipt(null)}
                className="text-stone-400 hover:text-stone-600 text-xs font-black"
                id="close-receipt-modal"
              >
                ✕ Fechar
              </button>
            </div>

            {/* Quick config options on top of thermal ticket */}
            <div className="grid grid-cols-2 gap-2 mb-3.5 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
              <div>
                <label className="block text-[8.5px] font-black uppercase text-stone-500 tracking-wider mb-1">Largura da Bobina</label>
                <select
                  value={paperWidth}
                  onChange={(e) => {
                    const val = e.target.value as '80mm' | '58mm';
                    setPaperWidth(val);
                    localStorage.setItem('bistro_print_paper_width', val);
                  }}
                  className="w-full bg-white border border-stone-300 text-[10.5px] p-1.5 rounded focus:outline-none"
                >
                  <option value="80mm">80mm (Padrão)</option>
                  <option value="58mm">58mm (Estreta)</option>
                </select>
              </div>
              <div>
                <label className="block text-[8.5px] font-black uppercase text-stone-500 tracking-wider mb-1">Corte térmico (FEED)</label>
                <select
                  value={extraFeedLines}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setExtraFeedLines(val);
                    localStorage.setItem('bistro_print_feed_lines', String(val));
                  }}
                  className="w-full bg-white border border-stone-300 text-[10.5px] p-1.5 rounded focus:outline-none"
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

            {/* Thermal Slip mockup */}
            <div 
              className="bg-stone-50/70 border p-5 rounded-lg font-mono text-xs text-stone-800 shadow-inner relative print-thermal-source print:max-h-none print:overflow-visible print:border-none print:p-0 print:shadow-none print:bg-white"
              style={{
                width: paperWidth === '58mm' ? '54mm' : '76mm',
                margin: '0 auto',
                fontSize: paperWidth === '58mm' ? '10px' : '11px',
                lineHeight: '1.2'
              }}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%)] bg-[size:10px_10px] print:hidden"></div>
              
              <div className="text-center font-bold text-stone-900 border-b-2 border-dashed border-stone-300 pb-2 mt-1">
                <p className="text-sm font-sans tracking-tight font-black">VIA DE PRODUÇÃO</p>
                <p className="text-[10px] font-normal text-stone-400 font-sans">IMPRESSÃO EXCLUSIVA DA COZINHA</p>
              </div>

              <div className="py-2.5 border-b-2 border-dashed border-stone-300 space-y-0.5">
                <p className="text-sm font-bold text-stone-900">MESA/COMANDA: {printedReceipt.tableNumber}</p>
                <p className="text-[10px] text-stone-500 font-sans">Data: {new Date(printedReceipt.timestamp).toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-stone-500 font-sans">Atendente: {printedReceipt.waiterName || 'Balcão/Mesa'}</p>
                <p className="text-[10px] text-emerald-800 font-bold font-sans uppercase">Filtro: {selectedDepartment}</p>
              </div>

              <div className="py-3 border-b-2 border-dashed border-stone-300 space-y-2">
                {printedReceipt.items
                  .filter(item => selectedDepartment === 'Todos' || item.department === selectedDepartment)
                  .map((item, idx) => (
                    <div key={idx} className="flex flex-col text-[11px] leading-tight select-text py-0.5">
                      <div className="flex justify-between font-bold text-stone-950">
                        <span>[{item.department.slice(0,3).toUpperCase()}] {item.productName}</span>
                        <span className="bg-stone-200 px-1 rounded pr-1 font-black text-xs">x{item.quantity}</span>
                      </div>
                      {item.note && (
                        <p className="text-rose-600 font-sans text-[10px] font-bold mt-0.5 whitespace-normal leading-normal">
                          * OBS: {item.note}
                        </p>
                      )}
                    </div>
                  ))}
              </div>

              {/* Footer of the layout */}
              <div className="text-center text-[9px] text-stone-400 pt-3">
                SISTEMA INTEGRADO BISTRO MANAGER • COMS
              </div>

              {/* Prevention cutting mechanism loop */}
              {Array.from({ length: extraFeedLines }).map((_, idx) => (
                <div key={`feed-${idx}`} className="h-4" aria-hidden="true">&nbsp;</div>
              ))}
            </div>

            {/* Print Help Tooltip */}
            <div className="mt-3 bg-amber-50 border border-amber-200 p-2 text-[9px] rounded-xl text-stone-700 leading-tight">
              <b>Dica térmica:</b> No driver de impressão do Windows/macOS/Linux, configure o rolo como tamanho contínuo ou correspondente à bobina. Deixe Margens: <b>NENHUMA</b> nas opções.
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-grow py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                id="btn-print-hardware"
              >
                <Printer className="h-3.5 w-3.5" /> IMPRIMIR NA TÉRMICA
              </button>
              <button
                onClick={() => setPrintedReceipt(null)}
                className="px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition cursor-pointer"
                id="btn-print-cancel"
              >
                Voltar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
