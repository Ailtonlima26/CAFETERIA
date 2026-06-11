import React from 'react';
import { Sale, Product, Customer } from '../types';
import { TrendingUp, Award, Calendar, AlertCircle, ShoppingCart, Percent, UserCheck, Zap } from 'lucide-react';

interface ReportsManagerProps {
  sales: Sale[];
  products: Product[];
  customers: Customer[];
}

export default function ReportsManager({ sales, products, customers }: ReportsManagerProps) {
  const currentMonth = '06'; // June 2026

  // 1. Faturamento & Lucro
  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const totalProfit = sales.reduce((sum, s) => sum + s.profit, 0);

  // 2. Ticket Médio
  const ticketMedio = sales.length > 0 ? totalRevenue / sales.length : 0;

  // 3. Produtos mais vendidos
  const productSalesMap: { [productName: string]: { qty: number; total: number } } = {};
  sales.forEach(sale => {
    sale.items.forEach(item => {
      const pName = item.product.name;
      if (!productSalesMap[pName]) {
        productSalesMap[pName] = { qty: 0, total: 0 };
      }
      productSalesMap[pName].qty += item.quantity;
      productSalesMap[pName].total += item.product.price * item.quantity;
    });
  });

  const bestSellers = Object.entries(productSalesMap)
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  // 4. Clientes que mais compram
  const loyalCustomers = [...customers]
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  // 5. Horário de Pico
  const hourlySalesMap: { [hour: string]: number } = {};
  // Hydrate all major coffee hours
  for (let i = 8; i <= 20; i++) {
    const hrString = i.toString().padStart(2, '0') + ':00';
    hourlySalesMap[hrString] = 0;
  }

  sales.forEach(s => {
    const d = new Date(s.timestamp);
    const hr = d.getHours();
    const rangeStr = hr.toString().padStart(2, '0') + ':00';
    if (hourlySalesMap[rangeStr] !== undefined) {
      hourlySalesMap[rangeStr] += s.total;
    } else {
      hourlySalesMap[rangeStr] = s.total;
    }
  });

  const peakHours = Object.entries(hourlySalesMap)
    .map(([hour, val]) => ({ hour, val }))
    .sort((a, b) => b.val - a.val);

  // 6. Aniversariantes do Mês (June - Month "06")
  const birthdayCustomers = customers.filter(c => {
    // bDay pattern: YYYY-MM-DD
    const bMonth = c.birthday.split('-')[1];
    return bMonth === currentMonth;
  });

  // 7. Investimento em Estoque Geral
  const totalStockInvestment = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
  const totalStockPotentialValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const itemsCountAndStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Upper Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Faturamento */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm border-stone-200/80">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Faturamento Operacional</span>
              <p className="text-2xl font-bold font-serif text-stone-900 mt-1">R$ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-emerald-600 mt-3 font-semibold">⚡ Processamento de {sales.length} vendas ilimitadas</p>
        </div>

        {/* Lucratividade Real */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm border-stone-200/80">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Lucro Líquido Real</span>
              <p className="text-2xl font-bold font-serif text-emerald-700 mt-1">R$ {totalProfit.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
              <Percent className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-stone-500 mt-3">Margem operacional média de ~{(totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0).toFixed(1)}%</p>
        </div>

        {/* Ticket Médio */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm border-stone-200/80">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Ticket Médio de Consumo</span>
              <p className="text-2xl font-bold font-serif text-stone-900 mt-1">R$ {ticketMedio.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-stone-100 rounded-lg text-stone-700">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-stone-500 mt-3">Faturamento médio por cupom fiscal fechado</p>
        </div>

        {/* Patrimônio Líquido de Forno */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm border-stone-200/80">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Valuation do Estoque</span>
              <p className="text-2xl font-bold font-serif text-stone-900 mt-1">R$ {totalStockPotentialValue.toFixed(2)}</p>
            </div>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-800">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-[10px] text-stone-500 mt-3">Custo de compra atrelado: R$ {totalStockInvestment.toFixed(2)}</p>
        </div>

      </div>

      {/* Graphs & Rankings (Sleek visual bar representations) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Best sellers chart - custom bars */}
        <div className="bg-white border text-stone-850 p-6 rounded-2xl shadow-sm border-stone-200/80">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2 mb-5">
            <Award className="h-4 w-4 text-emerald-700" />
            Os 5 Produtos Mais Vendidos (Bestsellers)
          </h3>
          
          <div className="space-y-4">
            {bestSellers.length === 0 ? (
              <p className="text-xs text-stone-400 italic py-10 text-center">Nenhuma venda computada ainda para montar o ranking.</p>
            ) : (
              bestSellers.map((prod, index) => {
                const maxQty = bestSellers[0].qty;
                const widthPercent = Math.max(12, (prod.qty / maxQty) * 100);
                return (
                  <div key={index} className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-semibold text-stone-800">
                      <span>{index + 1}. {prod.name}</span>
                      <span>{prod.qty} un (R$ {prod.total.toFixed(2)})</span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                        style={{ width: `${widthPercent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Peak Hours chart - custom bars */}
        <div className="bg-white border text-stone-850 p-6 rounded-2xl shadow-sm border-stone-200/80">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2 mb-5">
            <Zap className="h-4 w-4 text-amber-500" />
            Horários de Pico (Fluxo de Faturamento por Hora)
          </h3>
          
          <div className="space-y-3.5">
            {peakHours.slice(0, 5).map((point, idx) => {
              const maxVal = Math.max(...peakHours.map(p => p.val)) || 1;
              const widthPct = Math.max(8, (point.val / maxVal) * 100);
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-10 font-bold text-stone-500 font-mono">{point.hour}</span>
                  <div className="flex-grow bg-stone-100 h-3 rounded-md overflow-hidden">
                    <div
                      className="bg-stone-900 h-full rounded-md"
                      style={{ width: `${widthPct}%` }}
                    ></div>
                  </div>
                  <span className="w-20 text-right font-bold font-mono text-stone-800">R$ {point.val.toFixed(2)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loyal Clients Leaderboard */}
        <div className="bg-white border text-stone-850 p-6 rounded-2xl shadow-sm border-stone-200/80">
          <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2 mb-4">
            <UserCheck className="h-4 w-4 text-emerald-700" />
            Clientes recorrentes / Maiores Compradores
          </h3>

          <div className="divide-y divide-stone-100">
            {loyalCustomers.map((cust, idx) => (
              <div key={cust.id} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-stone-900">{idx + 1}. {cust.name}</span>
                  <span className="block text-[10px] text-stone-500 font-mono">CPF: {cust.cpf || 'Não informado'} • compras: {cust.purchaseCount}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-emerald-800 block">R$ {cust.totalSpent.toFixed(2)}</span>
                  <span className="text-[9px] text-stone-400">Total Acumulado</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room for Birthdays (Aniversariantes do Mês) */}
        <div className="bg-white border text-stone-850 p-6 rounded-2xl shadow-sm border-stone-200/80 flex flex-col justify-between">
          <div>
            <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-rose-500" />
              Aniversariantes do Mês (Junho 🎉)
            </h3>
            
            <div className="space-y-3">
              {birthdayCustomers.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-10 text-center">Nenhum aniversariante cadastrado neste mês de Junho.</p>
              ) : (
                birthdayCustomers.map(cust => {
                  const bDate = new Date(cust.birthday);
                  const formattedDay = (bDate.getDate() + 1).toString().padStart(2, '0'); // Correct timezone offset roughly
                  return (
                    <div key={cust.id} className="p-3 bg-stone-50 hover:bg-stone-100/50 rounded-xl border border-stone-200 flex justify-between items-center text-xs transition">
                      <div className="font-semibold text-stone-900 flex items-center gap-2">
                        <span>🍰</span>
                        <div>
                          <span>{cust.name}</span>
                          <span className="block text-[10px] text-stone-400 font-mono">Fidelizado em {cust.purchaseCount} visitas</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-rose-50 text-rose-700 font-black rounded-lg font-serif">
                        Dia {formattedDay}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-[10px] text-amber-900 mt-4 leading-relaxed font-semibold">
            🛎️ DICA DO BISTRÔ: Ofereça uma fatia de Torta Red Velvet ao aniversariante quando fecharem a conta para fidelização de clientela!
          </div>
        </div>

      </div>

    </div>
  );
}
