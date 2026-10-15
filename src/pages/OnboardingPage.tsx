import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ExecutionMode } from '../types';
import { ArrowRight, Compass, CheckCircle2, ShieldCheck } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const { userProfile, updateUserProfile, navigateTo } = useApp();
  const [name, setName] = useState(userProfile.name === 'Você' ? '' : userProfile.name);
  const [business, setBusiness] = useState(userProfile.business || '');
  const [teamSize, setTeamSize] = useState(userProfile.teamSize || '1 pessoa');
  const [currentMode, setCurrentMode] = useState<ExecutionMode>(userProfile.currentMode || 'Normal');
  const [dailyMinutes, setDailyMinutes] = useState(userProfile.dailyMinutes || 20);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || 'Empreendedor',
      business: business.trim() || 'Negócio Próprio',
      teamSize,
      currentMode,
      dailyMinutes,
      onboardingCompleted: true,
      isDemo: false
    });
    navigateTo('/app');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
          <div className="space-y-1 border-b border-stone-100 pb-4">
            <span className="text-xs font-semibold text-[#EA580C] uppercase tracking-wide">
              Configuração Inicial
            </span>
            <h1 className="text-2xl font-serif font-bold text-stone-950">
              Personalize sua Central de Execução
            </h1>
            <p className="text-xs text-stone-600">
              Defina as bases da sua operação para que o sistema calibre o volume e o ritmo das suas missões.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Como você gostaria de ser chamado(a)? *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Rafael"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Qual é a área ou modelo do seu negócio? *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Consultoria B2B, Loja Virtual, Prestação de Serviços..."
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tamanho da Equipe
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value="1 pessoa">Apenas eu</option>
                  <option value="2 pessoas">2 pessoas</option>
                  <option value="3 a 5 pessoas">3 a 5 pessoas</option>
                  <option value="6 a 15 pessoas">6 a 15 pessoas</option>
                  <option value="Mais de 15 pessoas">Mais de 15 pessoas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Disponibilidade Diária
                </label>
                <select
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
                >
                  <option value={10}>10 min/dia</option>
                  <option value={15}>15 min/dia</option>
                  <option value={20}>20 min/dia (Padrão)</option>
                  <option value={30}>30 min/dia</option>
                  <option value={45}>45 min/dia</option>
                </select>
              </div>
            </div>

            {/* Mode selection */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Modo Operacional Inicial
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'Normal', label: 'Normal', note: 'Ritmo padrão' },
                  { id: 'Reduzido', label: 'Reduzido', note: 'Dias corridos' },
                  { id: 'Recuperação', label: 'Recuperação', note: 'Sem pressão' }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setCurrentMode(m.id as ExecutionMode)}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      currentMode === m.id
                        ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{m.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{m.note}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigateTo('/app')}
                className="text-xs text-stone-500 hover:text-stone-800"
              >
                Pular por enquanto
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors cursor-pointer"
              >
                <span>Concluir e Entrar no Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
