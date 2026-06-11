import React, { useState } from 'react';
import { Product } from '../types';
import { Package, Plus, AlertTriangle, FileSpreadsheet, FileCode, CheckCircle2, RotateCcw, ArrowDownToLine } from 'lucide-react';

interface StockManagerProps {
  products: Product[];
  onAddProduct: (prod: Omit<Product, 'id'>) => void;
  onUpdateStock: (productId: string, quantity: number, mode: 'set' | 'add', costPrice?: number) => void;
}

export default function StockManager({ products, onAddProduct, onUpdateStock }: StockManagerProps) {
  // Tabs: 'catalogo' or 'xml-import'
  const [activeTab, setActiveTab] = useState<'catalogo' | 'xml-import'>('catalogo');
  
  // New manual product form
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('Cafés');
  const [price, setPrice] = useState('10.00');
  const [costPrice, setCostPrice] = useState('3.00');
  const [stock, setStock] = useState('50');
  const [minStock, setMinStock] = useState('10');
  const [unit, setUnit] = useState<Product['unit']>('un');
  const [dept, setDept] = useState<Product['department']>('Copa/Balcão');
  
  // XML Import states
  const [xmlInput, setXmlInput] = useState('');
  const [importStatus, setImportStatus] = useState<{
    success: boolean;
    message: string;
    items?: Array<{ name: string; qty: number; unitPrice: number; rawUnit: string; code: string; ncm: string }>;
  } | null>(null);

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAddProduct({
      name,
      category,
      price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || 0,
      stock: parseFloat(stock) || 0,
      minStock: parseFloat(minStock) || 0,
      unit,
      ncm: '1905.90.90',
      cfop: '5102',
      department: dept
    });

    // Reset
    setName('');
    setShowAddForm(false);
  };

  // Simulated raw XML template of a real NFe, formatted for Brazillian NFe standard
  const sampleNFeXML = `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe35260655210111105943202611000100411000100418">
      <ide>
        <nNF>4255</nNF>
        <dhEmi>2026-06-11T09:00:00-03:00</dhEmi>
      </ide>
      <det nItem="1">
        <prod>
          <cProd>INF023</cProd>
          <xProd>Graos de Cafe Bistrô Premium Arábica (KG)</xProd>
          <NCM>21011110</NCM>
          <CFOP>5102</CFOP>
          <uCom>kg</uCom>
          <qCom>50.0000</qCom>
          <vUnCom>45.0000</vUnCom>
          <vProd>2250.00</vProd>
        </prod>
      </det>
      <det nItem="2">
        <prod>
          <cProd>INF099</cProd>
          <xProd>Massa folhada congelada para Croissants</xProd>
          <NCM>19059090</NCM>
          <CFOP>5102</CFOP>
          <uCom>un</uCom>
          <qCom>100.0000</qCom>
          <vUnCom>2.5000</vUnCom>
          <vProd>250.00</vProd>
        </prod>
      </det>
      <det nItem="3">
        <prod>
          <cProd>INF044</cProd>
          <xProd>Chocolate Belga Callebaut Meio Amargo</xProd>
          <NCM>18069000</NCM>
          <CFOP>5102</CFOP>
          <uCom>kg</uCom>
          <qCom>15.0000</qCom>
          <vUnCom>80.0000</vUnCom>
          <vProd>1200.00</vProd>
        </prod>
      </det>
    </infNFe>
  </NFe>
</nfeProc>`;

  const handleParseXML = () => {
    if (!xmlInput.trim()) {
      alert('Por favor, cole o XML ou clique em "Injetar XML de Teste" para avaliar.');
      return;
    }

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlInput, 'text/xml');
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName('parsererror');
      if (parseError.length > 0) {
        throw new Error('Formato XML Inválido.');
      }

      // Read Brazilian NFe elements
      const dets = xmlDoc.getElementsByTagName('det');
      if (dets.length === 0) {
        throw new Error('Nenhum item de mercadoria (<det>) encontrado no XML.');
      }

      const parsedItems: any[] = [];
      for (let i = 0; i < dets.length; i++) {
        const prod = dets[i].getElementsByTagName('prod')[0];
        if (prod) {
          const cProd = prod.getElementsByTagName('cProd')[0]?.textContent || '';
          const xProd = prod.getElementsByTagName('xProd')[0]?.textContent || '';
          const qCom = parseFloat(prod.getElementsByTagName('qCom')[0]?.textContent || '0');
          const vUnCom = parseFloat(prod.getElementsByTagName('vUnCom')[0]?.textContent || '0');
          const uCom = prod.getElementsByTagName('uCom')[0]?.textContent || 'un';
          const ncm = prod.getElementsByTagName('NCM')[0]?.textContent || '1905.90.90';

          parsedItems.push({
            code: cProd,
            name: xProd,
            qty: qCom,
            unitPrice: vUnCom,
            rawUnit: uCom,
            ncm
          });
        }
      }

      setImportStatus({
        success: true,
        message: `NF-e processada com sucesso! Emitidos ${parsedItems.length} registros para importação direta de estoque.`,
        items: parsedItems
      });

    } catch (err: any) {
      setImportStatus({
        success: false,
        message: `Falha ao interpretar XML: ${err.message || 'Verifique o padrão da Nota Fiscal eletrônica.'}`
      });
    }
  };

  const handleConfirmXMLImport = () => {
    if (!importStatus?.items) return;

    importStatus.items.forEach(item => {
      // Find matches in existing product catalogs by name (loose match) or code
      const matchedProd = products.find(p => p.name.toLowerCase().includes(item.name.split(' ')[0].toLowerCase()));
      
      if (matchedProd) {
        // Increment stock and adjust cost price
        onUpdateStock(matchedProd.id, item.qty, 'add', item.unitPrice);
      } else {
        // Automatically provision a new active product if unmatched
        onAddProduct({
          name: item.name,
          category: item.name.toLowerCase().includes('caf') ? 'Cafés' : 'Pratos',
          price: item.unitPrice * 2.5, // 150% standard markup rule for coffee
          costPrice: item.unitPrice,
          stock: item.qty,
          minStock: Math.floor(item.qty * 0.15),
          unit: item.rawUnit === 'kg' ? 'kg' : 'un',
          ncm: item.ncm,
          cfop: '5102',
          department: item.name.toLowerCase().includes('caf') ? 'Copa/Balcão' : 'Cozinha'
        });
      }
    });

    setImportStatus(null);
    setXmlInput('');
    setActiveTab('catalogo');
    alert('Estoques incrementados e custos ponderados recalculados no sistema!');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and top tab selectors */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <h2 className="text-xl font-semibold text-stone-900 tracking-tight flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-700" />
            Movimentação de Estoques & compras XML
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Geração de novos produtos, monitoramento de volumes críticos e entrada inteligente de NF-e mercantil.
          </p>
        </div>

        <div className="flex gap-2">
          {activeTab === 'catalogo' && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3.5 py-2 bg-stone-950 text-white hover:bg-stone-850 rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1"
              id="btn-show-add-product"
            >
              <Plus className="h-4 w-4" /> Cadastrar Produto
            </button>
          )}
          <button
            onClick={() => setActiveTab('catalogo')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
              activeTab === 'catalogo'
                ? 'bg-stone-100 text-stone-900 border-stone-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
          >
            Estoque / Catálogo
          </button>
          <button
            onClick={() => { setActiveTab('xml-import'); setImportStatus(null); }}
            className={`px-3 py-2 rounded-lg text-xs font-semibold border transition flex items-center gap-1 ${
              activeTab === 'xml-import'
                ? 'bg-stone-100 text-stone-900 border-stone-300'
                : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
            }`}
            id="tab-xml-import"
          >
            <FileCode className="h-3.5 w-3.5" /> Entrada de Mercadoria XML
          </button>
        </div>
      </div>

      {activeTab === 'catalogo' ? (
        /* Tab 1: Product list and Stock Statuses */
        <div className="space-y-4">
          
          {/* Quick Manual Add Form Drawer/Panel */}
          {showAddForm && (
            <div className="bg-white border rounded-xl p-5 shadow-md border-stone-200/80 animate-in slide-in-from-top-4 duration-200 max-w-2xl">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4">Adicionar Produto Individualmente</h3>
              
              <form onSubmit={handleManualAdd} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-stone-600 mb-1">Nome do Item</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Brownie de Nozes"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Cafés">Cafés</option>
                    <option value="Bebidas">Bebidas</option>
                    <option value="Salgados">Salgados</option>
                    <option value="Doces">Doces</option>
                    <option value="Confeitaria">Confeitaria</option>
                    <option value="Pratos">Pratos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Preço Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Preço Custo (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={costPrice}
                    onChange={e => setCostPrice(e.target.value)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Medida</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value as any)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs font-semibold"
                  >
                    <option value="un">Unidade (un)</option>
                    <option value="kg">Quilo (kg)</option>
                    <option value="lt">Litro (lt)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Estoque Inicial</label>
                  <input
                    type="number"
                    required
                    value={stock}
                    onChange={e => setStock(e.target.value)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Estoque Mínimo</label>
                  <input
                    type="number"
                    required
                    value={minStock}
                    onChange={e => setMinStock(e.target.value)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Impressão p/ Depto</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value as any)}
                    className="w-full bg-stone-50 p-2 border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Copa/Balcão">Copa / Baristas</option>
                    <option value="Cozinha">Cozinha Geral</option>
                    <option value="Confeitaria">Confeitaria Fina</option>
                  </select>
                </div>

                <div className="md:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-850 text-white rounded-lg text-xs font-semibold transition"
                    id="confirm-manual-add"
                  >
                    Adicionar no Sistema
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

          {/* Catalog grid and low stock warnings */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Left sidebar: Low stock alerts */}
            <div className="lg:col-span-1 space-y-4">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider pl-1">ALERTAS DE COBERTURA</h3>
              
              <div className="bg-white border rounded-xl p-4 shadow-sm border-stone-200/80 space-y-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700">
                  <AlertTriangle className="h-4 w-4 text-amber-500 animate-bounce" />
                  <span>Estoque Mínimo Excedido</span>
                </div>

                <div className="space-y-2">
                  {products.filter(p => p.stock <= p.minStock).length === 0 ? (
                    <p className="text-[11px] text-stone-400 italic">Nenhum alerta de escassez ativo hoje!</p>
                  ) : (
                    products.filter(p => p.stock <= p.minStock).map(prod => (
                      <div key={prod.id} className="p-2.5 bg-amber-50 border border-amber-200/50 rounded-lg text-xs space-y-1">
                        <div className="font-bold text-stone-900 truncate">{prod.name}</div>
                        <div className="flex justify-between text-[10px] text-stone-500">
                          <span>Atual: <b className="text-rose-600">{prod.stock} {prod.unit}</b></span>
                          <span>Segurança: {prod.minStock} {prod.unit}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right block: Catalog Table */}
            <div className="lg:col-span-3 bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold">
                    <th className="p-3">Nome</th>
                    <th className="p-3">Categoria</th>
                    <th className="p-3 text-right">Preço de Custo</th>
                    <th className="p-3 text-right">Preço de Venda</th>
                    <th className="p-3 text-center">Quantidade</th>
                    <th className="p-3">Ação Rápida</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-150">
                  {products.map(prod => {
                    const isLow = prod.stock <= prod.minStock;
                    return (
                      <tr key={prod.id} className={`hover:bg-stone-50/50 ${isLow ? 'bg-amber-50/20' : ''}`}>
                        <td className="p-3 font-semibold text-stone-900">
                          <div>
                            {prod.name}
                            <span className="block text-[9px] text-stone-400 font-mono">Depto: {prod.department} • NCM: {prod.ncm}</span>
                          </div>
                        </td>
                        <td className="p-3 text-stone-500">{prod.category}</td>
                        <td className="p-3 text-right font-mono font-medium text-stone-600">R$ {prod.costPrice.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono font-bold text-stone-900">R$ {prod.price.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded font-bold font-mono ${
                            isLow ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 text-stone-800'
                          }`}>
                            {prod.stock} {prod.unit}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                const addQty = prompt(`Adicionar quantidade ao estoque de: ${prod.name}`);
                                if (parseFloat(addQty || '')) {
                                  onUpdateStock(prod.id, parseFloat(addQty || '0'), 'add');
                                }
                              }}
                              className="px-2 py-1 bg-stone-100 font-bold text-[10px] hover:bg-stone-200 text-stone-700 rounded-lg"
                              title="Adicionar Lote"
                            >
                              + Entrada
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      ) : (
        /* Tab 2: XML Mercedes/Goods Arrivals parsing */
        <div className="bg-white border text-stone-800 border-stone-200/80 rounded-2xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-1.5 leading-none">
                <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
                Interpretação Automática de Danfe XML
              </h3>
              <p className="text-xs text-stone-500 mt-1.5 max-w-lg">
                Cole o XML da Nota Fiscal (NFe) emitida pelos distribuidores. Nosso processador cruzará itens, atualizará saldos na gôndola e recalculará os custos operacionais.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setXmlInput(sampleNFeXML)}
                className="px-3.5 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-lg text-xs font-bold transition flex items-center gap-1 border border-emerald-200"
                id="btn-inject-sample-xml"
              >
                <ArrowDownToLine className="h-3.5 w-3.5" /> Injetar XML de Teste
              </button>
              {xmlInput && (
                <button
                  onClick={() => setXmlInput('')}
                  className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-xs font-medium"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Limpar
                </button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-600">Pastas de Códigos XML do Emitente (NFe)</label>
            <textarea
              value={xmlInput}
              onChange={e => setXmlInput(e.target.value)}
              placeholder="Cole o código XML completo da NFe aqui (Nota Fiscal eletrônica)..."
              className="w-full h-40 bg-stone-50 p-3 border border-stone-300 rounded-2xl focus:outline-none focus:ring-1 focus:ring-stone-700 font-mono text-[10px] text-stone-700"
              id="raw-xml-textarea"
            />
          </div>

          <button
            onClick={handleParseXML}
            className="px-5 py-2.5 bg-stone-900 border hover:bg-stone-850 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
            id="btn-trigger-xml-parse"
          >
            Processar Pré-Visualização da Nota
          </button>

          {/* Interactive display of parsed elements */}
          {importStatus && (
            <div className={`p-5 rounded-xl border animate-in zoom-in-95 duration-150 ${
              importStatus.success ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/50 border-rose-200'
            }`}>
              <div className="flex items-start gap-2">
                <CheckCircle2 className={`h-5 w-5 mt-0.5 ${importStatus.success ? 'text-emerald-700' : 'text-rose-600'}`} />
                <div className="space-y-4 flex-grow">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">Resultado do Processamento</h4>
                    <p className="text-xs text-stone-600 mt-1">{importStatus.message}</p>
                  </div>

                  {importStatus.success && importStatus.items && (
                    <div className="space-y-3">
                      <h5 className="text-[10px] font-bold text-stone-500 uppercase tracking-widest border-b pb-1">Items Identificados na Nota Fiscal</h5>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {importStatus.items.map((item, idx) => {
                          // Find out if already exists
                          const exists = products.find(p => p.name.toLowerCase().includes(item.name.split(' ')[0].toLowerCase()));
                          return (
                            <div key={idx} className="flex justify-between items-center bg-white p-3 border rounded-lg text-xs">
                              <div>
                                <span className="font-bold text-stone-900">{item.name}</span>
                                <span className={`block text-[10px] font-bold mt-0.5 ${exists ? 'text-blue-600' : 'text-amber-600'}`}>
                                  {exists 
                                    ? `✓ Vincula ao produto: ${exists.name}` 
                                    : '🆕 Produto novo (Será provisionado automaticamente)'}
                                </span>
                              </div>
                              <div className="text-right font-mono">
                                <span className="block font-bold">Qtd: {item.qty} {item.rawUnit}</span>
                                <span className="block text-[10px] text-stone-500">Valor Unit: R$ {item.unitPrice.toFixed(2)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <button
                        onClick={handleConfirmXMLImport}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow"
                        id="btn-confirm-import-stock"
                      >
                        Vincular Notas e Lançar Itens no Estoque Ativo
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
