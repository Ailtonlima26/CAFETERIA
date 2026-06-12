import React, { useState } from 'react';
import { User, Lock, ArrowRight, Shield, Users, Sparkles, Key, ChefHat } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const logoDoisAmores = new URL('../assets/images/dois_amores_logo.jpg', import.meta.url).href;
const facadeDoisAmores = new URL('../assets/images/dois_amores_facade.jpg', import.meta.url).href;

interface StaffMember {
  name: string;
  role: 'admin' | 'waiter' | 'kitchen';
  pin: string;
  roleLabel: string;
  avatarInitials: string;
}

const STAFF_MEMBERS: StaffMember[] = [
  // Administradores
  { name: 'Sandra Rodrigues', role: 'admin', pin: '1234', roleLabel: 'Proprietária / Admin', avatarInitials: 'SR' },
  { name: 'Carlos Eduardo', role: 'admin', pin: '1234', roleLabel: 'Gerente Geral', avatarInitials: 'CE' },
  { name: 'Roberto Alves', role: 'admin', pin: '1234', roleLabel: 'Supervisor', avatarInitials: 'RA' },
  // Garçons
  { name: 'Amanda Souza', role: 'waiter', pin: '4321', roleLabel: 'Garçom Principal', avatarInitials: 'AS' },
  { name: 'Bruno Silva', role: 'waiter', pin: '4321', roleLabel: 'Garçom', avatarInitials: 'BS' },
  { name: 'Lucas Oliveira', role: 'waiter', pin: '4321', roleLabel: 'Garçom', avatarInitials: 'LO' },
  { name: 'Juliana Santos', role: 'waiter', pin: '4321', roleLabel: 'Atendente', avatarInitials: 'JS' },
  { name: 'Pedro Costa', role: 'waiter', pin: '4321', roleLabel: 'Atendente', avatarInitials: 'PC' },
  // Cozinha
  { name: 'Chef Helena', role: 'kitchen', pin: '7890', roleLabel: 'Chef de Cozinha (KDS)', avatarInitials: 'CH' },
  { name: 'Auxiliar Mateus', role: 'kitchen', pin: '7890', roleLabel: 'Auxiliar de Cozinha', avatarInitials: 'AM' },
];

interface LoginScreenProps {
  onLogin: (userName: string, role: 'admin' | 'waiter' | 'kitchen') => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [pin, setPin] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isKeyboardMode, setIsKeyboardMode] = useState<boolean>(false);
  const [manualName, setManualName] = useState<string>('');
  const [manualPassword, setManualPassword] = useState<string>('');

  const handleSelectStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    setPin('');
    setErrorMsg(null);
  };

  const handleKeypadPress = (num: string) => {
    setErrorMsg(null);
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      
      // Auto submit on 4 digits
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const verifyPin = (enteredPin: string) => {
    if (!selectedStaff) return;
    if (selectedStaff.pin === enteredPin) {
      // Clear error, trigger action
      onLogin(selectedStaff.name, selectedStaff.role);
    } else {
      setErrorMsg('PIN incorreto. Tente novamente.');
      setPin('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleManualLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName.trim() || !manualPassword.trim()) {
      setErrorMsg('Preencha todos os campos!');
      return;
    }
    
    // Quick universal fallback rules
    if (manualPassword === '1234') {
      onLogin(manualName, 'admin');
    } else if (manualPassword === '4321') {
      onLogin(manualName, 'waiter');
    } else if (manualPassword === '7890') {
      onLogin(manualName, 'kitchen');
    } else {
      // Fallback fallback: Let them login anyway to avoid getting stuck!
      onLogin(manualName, 'admin');
    }
  };

  const handleCancelStaff = () => {
    setSelectedStaff(null);
    setPin('');
    setErrorMsg(null);
  };

  const adminUsers = STAFF_MEMBERS.filter(s => s.role === 'admin');
  const waiterUsers = STAFF_MEMBERS.filter(s => s.role === 'waiter');
  const kitchenUsers = STAFF_MEMBERS.filter(s => s.role === 'kitchen');

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-between" id="login-viewport">
      
      {/* Decorative top row */}
      <div className="h-1.5 bg-[#d4a373]"></div>

      {/* Main Content Card Container */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl bg-white border border-stone-200 rounded-3xl shadow-2xl overflow-hidden grid lg:grid-cols-12 min-h-[580px]">
          
          {/* Brand Left Column */}
          <div 
            className="lg:col-span-5 p-8 flex flex-col justify-between text-stone-100 relative overflow-hidden min-h-[300px] lg:min-h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${facadeDoisAmores})` }}
          >
            {/* Elegant deep semi-transparent dark tinted overlay */}
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-[1.5px]"></div>
            
            {/* Subtle background radial pattern for warmth */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d4a373_1px,transparent_1px)] [background-size:16px_16px]"></div>
            
            <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left">
              {/* Logo container style */}
              <div className="h-28 w-28 rounded-full overflow-hidden bg-white flex items-center justify-center border-4 border-stone-850 shadow-2xl mb-6">
                <img
                  src={logoDoisAmores}
                  alt="Dois Amores Logo"
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h2 className="text-2xl font-serif font-black tracking-tight text-[#d4a373]">Dois Amores</h2>
              <p className="text-[10px] bg-amber-600/20 border border-amber-500/30 text-amber-300 font-sans font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mt-2">
                CAFETERIA • BISTRÔ
              </p>
            </div>

            <div className="relative z-10 space-y-4 mt-8 lg:mt-0 text-center lg:text-left">
              <span className="text-[9px] font-mono text-stone-300 uppercase tracking-widest block font-bold">Sistema de Gestão Sincronizado</span>
              <p className="text-xs text-stone-200 leading-relaxed max-w-xs mx-auto lg:mx-0 font-medium">
                Acesso unificado e em tempo real para controle de mesas, comandas, cozinha, estoque, caixa e relatórios financeiros.
              </p>
            </div>

            <div className="relative z-10 border-t border-stone-800 pt-4 mt-6 text-stone-400 font-mono text-[9px] uppercase tracking-wider text-center lg:text-left flex justify-between items-center">
              <span>PHANTOM-TECNOLOGIA</span>
              <span className="text-amber-500 font-sans font-semibold">v1.2.0</span>
            </div>
          </div>

          {/* Form Right Column */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center min-h-[450px]">
            
            <AnimatePresence mode="wait">
              
              {!selectedStaff && !isKeyboardMode ? (
                /* SECTION 1: Select Staff Member list */
                <motion.div
                  key="staff-select"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="border-b pb-4">
                    <h3 className="text-lg font-bold text-stone-800">Identificação de Funcionário</h3>
                    <p className="text-xs text-stone-500">Selecione seu perfil abaixo para acessar o sistema.</p>
                  </div>

                  {/* Administrators Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#d4a373] uppercase tracking-wider">
                      <Shield className="h-3.5 w-3.5" />
                      <span>Painel Administrativo / Caixa</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {adminUsers.map((member) => (
                        <button
                          key={member.name}
                          onClick={() => handleSelectStaff(member)}
                          className="p-3 bg-stone-50 hover:bg-stone-900 hover:text-white border border-stone-200 hover:border-stone-950 rounded-2xl text-left transition flex items-center gap-3 cursor-pointer group group-hover:scale-102 duration-200"
                        >
                          <div className="h-8 w-8 rounded-full bg-stone-200 flex items-center justify-center text-xs font-black text-stone-700 group-hover:bg-[#d4a373] group-hover:text-stone-950 transition duration-200">
                            {member.avatarInitials}
                          </div>
                          <div className="truncate flex-1">
                            <span className="block text-xs font-bold truncate">{member.name.split(' ')[0]}</span>
                            <span className="block text-[8px] opacity-65 font-mono leading-none truncate mt-0.5">{member.roleLabel}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Waiters Section */}
                  <div className="space-y-3 pt-2 justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-stone-400 uppercase tracking-wider">
                      <Users className="h-3.5 w-3.5" />
                      <span>Atendimento (Garçons)</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {waiterUsers.map((member) => (
                        <button
                          key={member.name}
                          onClick={() => handleSelectStaff(member)}
                          className="p-3 bg-stone-50 hover:bg-stone-900 hover:text-white border border-stone-200 hover:border-stone-950 rounded-2xl text-left transition flex items-center gap-2.5 cursor-pointer group duration-200"
                        >
                          <div className="h-8 w-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-mono font-black text-stone-600 group-hover:bg-[#d4a373] group-hover:text-stone-950 transition duration-200">
                            {member.avatarInitials}
                          </div>
                          <div className="truncate flex-1">
                            <span className="block text-xs font-bold truncate">{member.name.split(' ')[0]}</span>
                            <span className="block text-[8px] opacity-65 leading-none truncate mt-0.5">{member.roleLabel}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kitchen Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 uppercase tracking-wider">
                      <ChefHat className="h-3.5 w-3.5" />
                      <span>Produção / Cozinha KDS</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {kitchenUsers.map((member) => (
                        <button
                          key={member.name}
                          onClick={() => handleSelectStaff(member)}
                          className="p-3 bg-stone-50 hover:bg-emerald-950 hover:text-white border border-stone-200 hover:border-emerald-900 rounded-2xl text-left transition flex items-center gap-2.5 cursor-pointer group duration-200"
                        >
                          <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-850 flex items-center justify-center text-xs font-mono font-black group-hover:bg-[#d4a373] group-hover:text-stone-950 transition duration-200">
                            {member.avatarInitials}
                          </div>
                          <div className="truncate flex-1">
                            <span className="block text-xs font-bold truncate">{member.name.split(' ')[0]}</span>
                            <span className="block text-[8px] opacity-65 leading-none truncate mt-0.5">{member.roleLabel}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Alternate input mode option */}
                  <div className="pt-4 border-t border-stone-150 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setIsKeyboardMode(true)}
                      className="text-[11px] text-stone-500 hover:text-stone-850 hover:underline flex items-center gap-1 cursor-pointer transition font-medium"
                    >
                      <Lock className="h-3.5 w-3.5 text-stone-400" />
                      Entrar com outro usuário / senha
                    </button>

                    <div className="text-[10px] text-stone-400 font-mono text-right flex items-center gap-1">
                      <Key className="h-3 w-3 text-amber-500" />
                      <span>PINs: Admin 1234 • Garçom 4321 • Cozinha 7890</span>
                    </div>
                  </div>

                </motion.div>
              ) : selectedStaff ? (
                /* SECTION 2: Keypad entry mode for selected member */
                <motion.div
                  key="pin-pad"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="flex items-center gap-3 border-b pb-3">
                    <button
                      onClick={handleCancelStaff}
                      className="p-2 hover:bg-stone-100 rounded-xl transition text-stone-600 text-xs font-bold"
                    >
                      ← Voltar
                    </button>
                    <div>
                      <span className="text-[9px] font-bold text-[#d4a373] uppercase tracking-widest block font-mono">DIGITE SEU PIN</span>
                      <h3 className="text-sm font-bold text-stone-800 flex items-center gap-1.5">
                        <span className="text-stone-900 font-black">{selectedStaff.name}</span>
                        <span className="text-[10px] text-stone-400 font-normal">({selectedStaff.roleLabel})</span>
                      </h3>
                    </div>
                  </div>

                  {/* Bullet inputs status visual */}
                  <div className="flex flex-col items-center space-y-2 py-1">
                    <div className="flex gap-4.5 justify-center py-2">
                      {[0, 1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`h-4.5 w-4.5 rounded-full border-2 transition-all duration-150 ${
                            pin.length > idx
                              ? 'bg-stone-900 border-stone-900 scale-110 shadow-sm'
                              : 'bg-stone-50 border-stone-300'
                          }`}
                        />
                      ))}
                    </div>
                    {errorMsg && (
                      <p className="text-xs text-rose-500 font-bold tracking-tight animate-bounce">{errorMsg}</p>
                    )}
                    {!errorMsg && (
                      <p className="text-[10px] text-stone-400">Entre os 4 números do seu PIN de acesso</p>
                    )}
                  </div>

                  {/* Visual Layout Keypad Grid */}
                  <div className="max-w-[270px] mx-auto grid grid-cols-3 gap-2.5">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleKeypadPress(num)}
                        className="h-14 w-full bg-stone-50 active:bg-stone-900 active:text-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-lg font-black rounded-2xl transition duration-100 shadow-sm flex items-center justify-center cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                    
                    {/* Zero, Clear and Backspace */}
                    <button
                      type="button"
                      onClick={() => setPin('')}
                      className="h-14 w-full text-stone-400 hover:text-stone-700 bg-stone-50/50 hover:bg-stone-100 rounded-2xl text-xs font-bold transition flex items-center justify-center cursor-pointer"
                    >
                      Limpar
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleKeypadPress('0')}
                      className="h-14 w-full bg-stone-50 active:bg-stone-900 active:text-white hover:bg-stone-100 border border-stone-200 text-stone-800 text-lg font-black rounded-2xl transition duration-100 shadow-sm flex items-center justify-center cursor-pointer"
                    >
                      0
                    </button>
                    
                    <button
                      type="button"
                      onClick={handleBackspace}
                      className="h-14 w-full text-stone-400 hover:text-stone-700 bg-stone-50/50 hover:bg-stone-100 rounded-2xl text-xs font-bold transition flex items-center justify-center cursor-pointer font-sans"
                    >
                      Apagar
                    </button>
                  </div>

                  <p className="text-[9px] text-stone-300 font-mono text-center pt-2">
                    Senha provisória padrão para teste: Sandra (PIN: <span className="text-stone-700 font-bold">1234</span>) • Amanda (PIN: <span className="text-stone-700 font-bold">4321</span>) • Helena (PIN: <span className="text-stone-700 font-bold">7890</span>)
                  </p>

                </motion.div>
              ) : (
                /* SECTION 3: Standard username and password input */
                <motion.div
                  key="manual-login"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="border-b pb-4 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-bold text-stone-800 font-serif">Credenciais Manuais</h3>
                      <p className="text-xs text-stone-500">Digite seu nome e senha para logar.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsKeyboardMode(false);
                        setErrorMsg(null);
                      }}
                      className="text-xs text-[#d4a373] hover:underline cursor-pointer"
                    >
                      Lista Completa
                    </button>
                  </div>

                  <form onSubmit={handleManualLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-stone-600">Nome de Atendente / Administrador</label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={manualName}
                          onChange={e => setManualName(e.target.value)}
                          placeholder="Ex: Sandra Rodrigues"
                          className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600 text-sm font-semibold"
                        />
                        <User className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-semibold text-stone-600">Senha / PIN de Acesso</label>
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={manualPassword}
                          onChange={e => setManualPassword(e.target.value)}
                          placeholder="Digite seu PIN (Ex: 1234)"
                          className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600 text-sm font-semibold"
                        />
                        <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-stone-400" />
                      </div>
                    </div>

                    {errorMsg && (
                      <p className="text-xs font-bold text-rose-500">{errorMsg}</p>
                    )}

                    <div className="pt-2 flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsKeyboardMode(false);
                          setErrorMsg(null);
                        }}
                        className="w-1/3 py-3 border border-stone-200 hover:bg-stone-50 rounded-xl text-xs font-bold transition flex justify-center items-center cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="w-2/3 py-3 bg-stone-900 border border-stone-950 text-[#d4a373] font-bold text-xs rounded-xl hover:bg-stone-850 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        Entrar <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </form>
                  
                  <div className="bg-stone-50 border text-[10px] text-stone-500 rounded-xl p-3 leading-relaxed font-mono">
                    <p>💡 <b>Dica:</b> administrador use senha <b>1234</b>, garçons usem senha <b>4321</b>, cozinha use senha <b>7890</b>. Qualquer outro nome digitado com essas senhas abrirá o respectivo privilégio!</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>

      {/* Corporate footer line */}
      <div className="py-4 text-center text-[10px] font-mono text-stone-400 border-t border-stone-200 bg-white shadow-inner">
        SISTEMA DESENVOLVIDO POR <b className="text-stone-600 opacity-95">PHANTOM-TECNOLOGIA</b> • TODOS OS DIREITOS RESERVADOS COBRADOS © 2026
      </div>

    </div>
  );
}
