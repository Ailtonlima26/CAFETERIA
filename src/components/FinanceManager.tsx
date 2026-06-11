import React, { useState } from 'react';
import { FinancialRecord } from '../types';
import { Landmark, ArrowUpRight, ArrowDownLeft, Plus, CheckCircle, Clock } from 'lucide-react';

interface FinanceManagerProps {
  records: FinancialRecord[];
  onAddRecord: (rec: Omit<FinancialRecord, 'id'>) => void;
  onToggleRecordStatus: (id: string) => void;
}

export default function FinanceManager({ records, onAddRecord, onToggleRecordStatus }: FinanceManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form elements
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'receber' | 'pagar'>('pagar');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Insumos');
  const [dueDate, setDueDate] = useState('2026-06-15');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    onAddRecord({
      description,
      type,
      amount: parseFloat(amount) || 0,
      category,
      dueDate,
      status: 'pendente'
    });

    setDescription('');
    setAmount('');
    setShowAddForm(false);
  };

  const calculateFinanceTotals = () => {
    let totalPagar = 0;
    let paidPagar = 0;
    let totalReceber = 0;
    let paidReceber = 0;

    records.forEach(r => {
      if (r.type === 'pagar') {
        totalPagar += r.amount;
        if (r.status === 'pago') paidPagar += r.amount;
      } else {
        totalReceber += r.amount;
        if (r.status === 'pago') paidReceber += r.amount;
      }
    });

    return {
      totalPagar,
      pendingPagar: totalPagar - paidPagar,
      totalReceber,
      pendingReceber: totalReceber - paidReceber,
      estimatedProfit: totalReceber - totalPagar
    };
  };

  const metrics = calculateFinanceTotals();

  return (
    <div className="space-y-6">
      
      {/* Header operations */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Landmark className="h-5 w-5 text-emerald-700" />
            Controle de Contas a Pagar & Receber
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Gestão financeira, controle de fornecimento de café, aluguel, recebíveis de catering e faturamento previsto.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3.5 py-2 bg-stone-950 text-white hover:bg-stone-850 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1 self-start"
          id="btn-show-finance-form"
        >
          <Plus className="h-4 w-4" /> Registrar Título / Lançamento
        </button>
      </div>

      {/* Finance totals row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contas a receber */}
        <div className="bg-white p-5 border text-stone-850 rounded-2xl shadow-sm border-stone-200/80">
          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
            Contas a Receber
          </div>
          <div className="text-2xl font-bold font-serif text-stone-950 mt-1.5">R$ {metrics.totalReceber.toFixed(2)}</div>
          <div className="text-[10px] text-stone-500 mt-1.5 flex justify-between">
            <span>Aguardando: R$ {metrics.pendingReceber.toFixed(2)}</span>
            <span>Estabilidade de Caixa</span>
          </div>
        </div>

        {/* Contas a pagar */}
        <div className="bg-white p-5 border text-stone-850 rounded-2xl shadow-sm border-stone-200/80">
          <div className="text-[10px] font-bold text-rose-600 uppercase tracking-widest flex items-center gap-1">
            <ArrowDownLeft className="h-4 w-4 text-rose-500" />
            Contas a Pagar
          </div>
          <div className="text-2xl font-bold font-serif text-stone-950 mt-1.5 text-rose-700">R$ {metrics.totalPagar.toFixed(2)}</div>
          <div className="text-[10px] text-stone-500 mt-1.5 flex justify-between">
            <span>Pendente de Quitação: R$ {metrics.pendingPagar.toFixed(2)}</span>
            <span>Vencimento crítico</span>
          </div>
        </div>

        {/* Projected balance */}
        <div className="bg-white p-5 border text-stone-855 rounded-2xl shadow-sm border-stone-200/80">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Saldo Projetado Comercial</div>
          <div className={`text-2xl font-bold font-serif mt-1.5 ${metrics.estimatedProfit >= 0 ? 'text-stone-950' : 'text-rose-600'}`}>
            R$ {metrics.estimatedProfit.toFixed(2)}
          </div>
          <div className="text-[10px] text-stone-500 mt-1.5">
            Margem com base no fechamento previsto do mês operacional.
          </div>
        </div>
      </div>

      {/* Manual record insert drawer */}
      {showAddForm && (
        <div className="bg-white border rounded-xl p-5 border-stone-200/80 shadow-md animate-in slide-in-from-top-4 duration-205">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Adicionar Lançamento Financeiro</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-stone-600 mb-1">Descrição do Lançamento</label>
              <input
                type="text"
                required
                placeholder="Ex: Fornecedor de embalagens Kraft S/A"
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Tipo de Fluxo</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as any)}
                className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
              >
                <option value="pagar">Contas a Pagar (Saída / Custo)</option>
                <option value="receber">Contas a Receber (Emissão / Entrada)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Valor do Título (R$)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Categoria de Custo</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
              >
                <option value="Insumos">Mercadorias / Insumos</option>
                <option value="Aluguel">Aluguel & Infraestrutura</option>
                <option value="Serviços">Custos Operacionais (Enel, Sabesp)</option>
                <option value="Marketing">Marketing & Brindes</option>
                <option value="Catering">Eventos / Catering</option>
                <option value="Outros">Outras Provisões</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-600 mb-1">Data Vencimento</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="md:col-span-4 flex justify-end gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 border text-white hover:bg-stone-850 rounded-lg text-xs font-bold transition"
                id="btn-confirm-finance-submit"
              >
                Lançar Registro
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Financial list tables */}
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm border-stone-200/80">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
              <th className="p-3.5">Título</th>
              <th className="p-3.5">Categoria</th>
              <th className="p-3.5">Tipo</th>
              <th className="p-3.5 font-mono">Vencimento</th>
              <th className="p-3.5 text-right font-mono">Valor</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-150">
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-10 text-center text-stone-400 italic">
                  Nenhum título financeiro listado no sistema.
                </td>
              </tr>
            ) : (
              records.map(rec => {
                const isPagar = rec.type === 'pagar';
                const isPaid = rec.status === 'pago';
                return (
                  <tr key={rec.id} className="hover:bg-stone-50/50">
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-900">{rec.description}</div>
                      {rec.paymentDate && (
                        <span className="block text-[10px] text-emerald-600">Pago em: {new Date(rec.paymentDate).toLocaleDateString()}</span>
                      )}
                    </td>
                    <td className="p-3.5 text-stone-500">{rec.category}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isPagar ? 'bg-rose-50 text-rose-800' : 'bg-emerald-50 text-emerald-800'
                      }`}>
                        {isPagar ? 'A Pagar (Custo)' : 'A Receber (Faturamento)'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-stone-500">{new Date(rec.dueDate).toLocaleDateString('pt-BR')}</td>
                    <td className={`p-3.5 text-right font-mono font-bold ${isPagar ? 'text-rose-600' : 'text-emerald-700'}`}>
                      R$ {rec.amount.toFixed(2)}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold flex items-center justify-center gap-1 mx-auto w-24 ${
                        isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {isPaid ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            LIQUIDADO
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 animate-pulse" />
                            PENDENTE
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => onToggleRecordStatus(rec.id)}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-lg transition ${
                          isPaid 
                            ? 'bg-stone-100 hover:bg-stone-200 text-stone-700' 
                            : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                        }`}
                        id={`toggle-finance-${rec.id}`}
                      >
                        {isPaid ? 'Estornar Pago' : 'Quitar / Baixar'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
