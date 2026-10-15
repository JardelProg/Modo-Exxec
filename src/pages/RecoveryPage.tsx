import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  LifeBuoy,
  HeartHandshake,
  CheckCircle2,
  PauseCircle,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Footprints
} from 'lucide-react';
import { getIdleDays } from '../lib/projectUtils';

export const RecoveryPage: React.FC = () => {
  const {
    tasks,
    projects,
    missions,
    activateRecoveryMode,
    navigateTo,
    userProfile
  } = useApp();

  const [cleanBlocked, setCleanBlocked] = useState(true);
  const [pauseStale, setPauseStale] = useState(true);
  const [blockReason, setBlockReason] = useState('Sobrecarga de demandas e cansaço mental');
  const [selectedMinimalMission, setSelectedMinimalMission] = useState<number>(1);
  const [activated, setActivated] = useState(false);

  const blockedCount = tasks.filter((t) => t.status === 'bloqueada').length;
  const staleProjectsCount = projects.filter(
    (p) => p.status === 'ativo' && getIdleDays(p) > 3
  ).length;

  const handleApplyRecovery = () => {
    activateRecoveryMode({
      cleanBlockedTasks: cleanBlocked,
      pauseStaleProjects: pauseStale,
      chosenMinimalMissionId: selectedMinimalMission,
      notes: blockReason
    });
    setActivated(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Calm, warm header without aggressive red */}
      <div className="p-6 sm:p-8 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-900 uppercase tracking-wide">
          <HeartHandshake className="w-4 h-4 text-amber-700" />
          <span>Protocolo de Desobstrução Operacional</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-amber-950">
          Não vamos compensar tudo. Vamos escolher o próximo passo possível.
        </h1>
        <p className="text-xs sm:text-sm text-amber-900/80 leading-relaxed">
          Dias difíceis e semanas caóticas acontecem com todo empresário sério. O erro fatal é tentar trabalhar 16 horas para &quot;compensar o atraso&quot;, gerando mais cansaço e paralisia. Vamos limpar o atrito agora.
        </p>
      </div>

      {!activated ? (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 space-y-6 shadow-xs">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-stone-900">
              O que você deseja fazer para desanuviar a operação?
            </h2>

            {/* Action 1: Clean blocked tasks */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={cleanBlocked}
                onChange={(e) => setCleanBlocked(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900">
                  Arquivar tarefas com atrito ({blockedCount} encontradas)
                </span>
                <p className="text-xs text-stone-500">
                  Tira a culpa de ver tarefas bloqueadas na lista. Elas são arquivadas sem julgamento.
                </p>
              </div>
            </label>

            {/* Action 2: Pause stale projects */}
            <label className="flex items-start gap-3 p-4 rounded-xl border border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={pauseStale}
                onChange={(e) => setPauseStale(e.target.checked)}
                className="mt-1 rounded border-stone-300 text-[#EA580C] focus:ring-[#EA580C]"
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-stone-900">
                  Pausar projetos parados há mais de 3 dias ({staleProjectsCount} encontrados)
                </span>
                <p className="text-xs text-stone-500">
                  Muda o status para &quot;Pausado conscientemente&quot;. Você não desistiu; apenas priorizou o fôlego.
                </p>
              </div>
            </label>

            {/* Choose one minimal micro-mission */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wide mb-2">
                Escolha uma microação de 5 a 10 minutos para hoje:
              </label>
              <div className="space-y-2">
                {[
                  {
                    id: 1,
                    title: 'Fazer o descarrego mental em papel cru',
                    desc: 'Apenas escrever 3 pendências e fechar o caderno.'
                  },
                  {
                    id: 2,
                    title: 'Abrir 1 documento e redigir 2 linhas',
                    desc: 'Dar apenas a partida mecânica sem compromisso de terminar tudo.'
                  },
                  {
                    id: 13,
                    title: 'Organizar apenas a área do teclado e tomar um café com calma',
                    desc: 'Limpeza física para recarregar o campo visual.'
                  }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedMinimalMission(item.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      selectedMinimalMission === item.id
                        ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900">{item.title}</div>
                    <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Register reason */}
            <div>
              <label className="block text-xs font-bold text-stone-900 uppercase tracking-wide mb-1">
                Motivo do bloqueio recente (para autoconhecimento):
              </label>
              <input
                type="text"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={() => navigateTo('/app')}
              className="text-xs font-medium text-stone-600 hover:text-stone-900"
            >
              Cancelar e voltar
            </button>
            <button
              onClick={handleApplyRecovery}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <span>Aplicar Limpeza e Ativar Recuperação</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
          <h2 className="text-xl font-serif font-bold text-stone-950">
            Terreno Desobstruído
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            As pendências foram desarmadas e seu painel está em <strong>Modo Recuperação</strong>. Faça apenas o passo mínimo escolhido e descanse sem peso na consciência.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigateTo('/app')}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors cursor-pointer"
            >
              <span>Retornar ao Dashboard com Fôlego</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
