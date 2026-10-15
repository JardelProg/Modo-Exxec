import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { Decision } from '../types';
import { Plus, CheckCircle2, Scale, AlertCircle, ArrowRight, ChevronUp, RotateCcw } from 'lucide-react';
import { NewDecisionModal } from '../components/modals/NewItemModals';
import { LiquidGlassButton } from '../components/common/LiquidGlassButton';
import { SwatchAccordion, SwatchItem } from '../components/dashboard/SwatchAccordion';

const RISK_BADGES: Record<string, { bg: string; text: string; border: string }> = {
  Baixo: { bg: 'bg-emerald-400/15', text: 'text-emerald-300', border: 'border-emerald-400/30' },
  Médio: { bg: 'bg-amber-400/15', text: 'text-amber-300', border: 'border-amber-400/30' },
  Alto: { bg: 'bg-rose-400/15', text: 'text-rose-300', border: 'border-rose-400/30' },
};

export const DecisionsPage: React.FC = () => {
  const { decisions, resolveDecision } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Estado para resolver a decisão selecionada
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [choice, setChoice] = useState('');
  const [custom, setCustom] = useState('');
  const [rationale, setRationale] = useState('');

  const openDecisions = decisions
    .filter((d) => d.status === 'pendente')
    .sort((a, b) => b.openDays - a.openDays);
  const decidedDecisions = decisions.filter((d) => d.status === 'decidida');

  const topDecision = openDecisions[0];

  const beginResolving = (d: Decision) => {
    setResolvingId(d.id);
    setChoice(d.options?.[0]?.label ?? '');
    setCustom('');
    setRationale('');
  };

  const finalChoice = custom.trim() || choice;

  const handleConfirmDecision = (d: Decision) => {
    if (!finalChoice) return;
    resolveDecision(d.id, finalChoice, rationale.trim());
    setResolvingId(null);
  };

  // Montagem dos itens do SwatchAccordion clone da decisão prioritária
  const swatchItems: SwatchItem[] = topDecision
    ? [
        {
          id: 'dec-impact',
          title: 'Custo de Adiar',
          description: topDecision.postponeCost,
          tags: [`${topDecision.openDays} DIAS EM ABERTO`, 'IMPACTO DIRETO'],
          button: 'Avaliar Opções',
          onButtonClick: () => {
            beginResolving(topDecision);
          },
          content: (
            <div className="space-y-2 mb-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-300">
                <span className="font-mono text-amber-400 font-semibold">
                  Prazo de revisão: {topDecision.reviewDate}
                </span>
                <span className="text-white/20">·</span>
                <span className="text-white/60">
                  Princípio dos 70%: decida se o risco for reversível em 30 dias.
                </span>
              </div>
            </div>
          ),
        },
        {
          id: 'dec-options',
          title: 'Opções em Jogo',
          description:
            topDecision.options && topDecision.options.length > 0
              ? 'Compare prós, contras e nível de risco de cada alternativa mapeada:'
              : 'Defina as opções viáveis para fechar essa bifurcação hoje.',
          tags: [`${topDecision.options?.length || 0} OPÇÕES`, 'MATRIZ DE RISCO'],
          button: resolvingId === topDecision.id ? 'Confirmar Escolha' : 'Decidir Agora',
          onButtonClick: () => {
            if (resolvingId === topDecision.id) {
              handleConfirmDecision(topDecision);
            } else {
              beginResolving(topDecision);
            }
          },
          content: (
            <div className="space-y-3 mb-2">
              {resolvingId === topDecision.id ? (
                /* Formulário interativo de resolução */
                <div className="bg-black/40 rounded-2xl p-3.5 border border-white/10 space-y-3">
                  {topDecision.options && topDecision.options.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono font-bold text-amber-400 uppercase block">
                        Selecione a opção:
                      </span>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {topDecision.options.map((o) => {
                          const isSelected = choice === o.label && !custom;
                          return (
                            <label
                              key={o.label}
                              className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2 ${
                                isSelected
                                  ? 'bg-amber-400/20 border-amber-400/60 text-white'
                                  : 'bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`opt-clone-${topDecision.id}`}
                                checked={isSelected}
                                onChange={() => {
                                  setChoice(o.label);
                                  setCustom('');
                                }}
                                className="mt-0.5 accent-amber-400"
                              />
                              <div className="min-w-0 flex-1">
                                <span className="font-semibold block leading-tight">
                                  {o.label}
                                </span>
                                <span className="text-[10px] text-white/50 mt-0.5 block">
                                  Risco {o.risk}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <input
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="Ou escreva uma resolução personalizada..."
                      className="w-full rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/15 px-3 py-2 text-xs outline-none focus:border-amber-400 transition-colors"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={1}
                      value={rationale}
                      onChange={(e) => setRationale(e.target.value)}
                      placeholder="Motivo ou salvaguarda desta decisão (opcional)..."
                      className="w-full rounded-xl bg-white/10 text-white placeholder:text-white/40 border border-white/15 px-3 py-2 text-xs outline-none focus:border-amber-400 transition-colors resize-none"
                    />
                  </div>
                </div>
              ) : (
                /* Lista visual das opções com tags de risco */
                <div className="grid sm:grid-cols-2 gap-2">
                  {topDecision.options?.map((o, idx) => {
                    const badge = RISK_BADGES[o.risk] || RISK_BADGES.Baixo;
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs space-y-1"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="font-semibold text-white leading-tight">
                            {o.label}
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${badge.bg} ${badge.text} ${badge.border}`}
                          >
                            {o.risk}
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-300/90 leading-tight">
                          + {o.pros}
                        </p>
                        <p className="text-[11px] text-white/50 leading-tight">
                          - {o.cons}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ),
        },
        {
          id: 'dec-nextstep',
          title: 'Próxima Ação',
          description: topDecision.nextStep,
          tags: ['AÇÃO PRÁTICA', 'REVERSÍVEL'],
          button: 'Fechar Pendência',
          onButtonClick: () => {
            beginResolving(topDecision);
          },
          content: (
            <div className="space-y-2 mb-2">
              <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs">
                <span className="text-[11px] font-mono text-amber-400/90 font-bold uppercase block mb-1">
                  Informação que faltava:
                </span>
                <p className="text-white/70">{topDecision.missingInformation}</p>
              </div>
            </div>
          ),
        },
      ]
    : [];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Cabeçalho superior */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900">Decisões</h1>
          <p className="text-stone-600 mt-1 text-sm sm:text-base">
            Não decidir também custa. Se der para desfazer em 30 dias com pouco prejuízo, decida com 70% da informação.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer shrink-0 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nova decisão
        </button>
      </div>

      {/* CLONE DO COMPONENTE SWATCHACCORDION PARA A CATEGORIA DE DECISÕES (Aberto diretamente) */}
      {topDecision && (
        <section aria-label="Decisão em Destaque" className="w-full space-y-3">
          {/* Barra superior com indicador e título da decisão */}
          <div className="flex items-center justify-between pb-1 w-full">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)] shrink-0 animate-pulse" />
              <span className="text-xs font-mono tracking-wider text-amber-500 font-bold uppercase truncate">
                DECISÃO PRIORITÁRIA
              </span>
              <span className="text-stone-300">·</span>
              <h2 className="text-sm font-semibold text-stone-800 truncate">
                {topDecision.title}
              </h2>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-stone-500 shrink-0">
              <span className="text-amber-700 font-semibold">{topDecision.openDays} dias aberta</span>
              <span>·</span>
              <span>Revisão: {topDecision.reviewDate}</span>
            </div>
          </div>

          {/* CLONE EXATO DO SWATCH ACCORDION PARA DECISÕES - ABERTO DIRETAMENTE */}
          <SwatchAccordion
            items={swatchItems}
            openItem={1}
            trigger="hover"
            direction="auto"
            stripWidth={84}
            barHeight={56}
            numbers={true}
            padding="20px"
            gap="8px"
            radius="20px"
            textColor="#FFFFFF"
            buttonColor="#FBBF24"
            buttonTextColor="#0B0F19"
          />
        </section>
      )}

      {/* LISTA DE DEMAIS DECISÕES PENDENTES (se houver mais de uma) */}
      {openDecisions.length > 1 && (
        <section className="space-y-4 pt-4 border-t border-stone-200">
          <h2 className="text-sm font-mono uppercase tracking-wider text-stone-500 font-semibold">
            Outras Decisões Pendentes ({openDecisions.length - 1})
          </h2>

          <ul className="space-y-4">
            {openDecisions.slice(1).map((d) => (
              <li
                key={d.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
                      <span className="text-amber-700 font-semibold">Aberta há {d.openDays} dias</span>
                      <span>·</span>
                      <span>Revisão: {d.reviewDate}</span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">{d.title}</h3>
                  </div>

                  <button
                    onClick={() => beginResolving(d)}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
                  >
                    Decidir
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-stone-50 border-l-4 border-amber-500 text-xs text-stone-700">
                  <span className="font-semibold block text-stone-900 mb-0.5">Custo de adiar:</span>
                  {d.postponeCost}
                </div>

                {resolvingId === d.id && (
                  <div className="p-4 bg-stone-100 rounded-xl space-y-3">
                    {d.options && d.options.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-stone-800 block">Opções:</span>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {d.options.map((o) => (
                            <label
                              key={o.label}
                              className={`p-2.5 rounded-lg border text-xs cursor-pointer bg-white flex items-start gap-2 ${
                                choice === o.label && !custom ? 'border-stone-900 ring-1 ring-stone-900' : 'border-stone-200'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`opt-list-${d.id}`}
                                checked={choice === o.label && !custom}
                                onChange={() => {
                                  setChoice(o.label);
                                  setCustom('');
                                }}
                                className="mt-0.5 accent-stone-900"
                              />
                              <div className="min-w-0">
                                <span className="font-semibold block">{o.label}</span>
                                <span className="text-[10px] text-stone-500">Risco {o.risk}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <input
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="Ou escreva outra decisão..."
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white outline-none focus:border-stone-900"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleConfirmDecision(d)}
                        disabled={!finalChoice}
                        className="px-4 py-2 text-xs font-bold text-white bg-stone-900 rounded-lg disabled:opacity-40 cursor-pointer"
                      >
                        Registrar decisão
                      </button>
                      <button
                        onClick={() => setResolvingId(null)}
                        className="px-3 py-2 text-xs font-semibold border border-stone-300 rounded-lg bg-white hover:bg-stone-50 cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Caso não haja decisões abertas */}
      {openDecisions.length === 0 && (
        <div className="p-10 text-center bg-white border border-stone-200 rounded-2xl space-y-3">
          <Scale className="w-8 h-8 text-stone-400 mx-auto" />
          <h2 className="text-lg font-bold text-stone-900">Nenhuma decisão em aberto</h2>
          <p className="text-stone-600 max-w-sm mx-auto text-sm">
            Tem alguma escolha rodando na sua cabeça? Registre o que está em jogo e o que custa esperar.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 text-sm font-bold text-brand-primary bg-brand-signal rounded-xl cursor-pointer"
          >
            Registrar uma decisão
          </button>
        </div>
      )}

      {/* Histórico de decisões tomadas */}
      {decidedDecisions.length > 0 && (
        <details className="group pt-2">
          <summary className="cursor-pointer font-semibold text-stone-700 list-none flex items-center gap-2 text-sm select-none">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {decidedDecisions.length}{' '}
              {decidedDecisions.length === 1 ? 'decisão tomada' : 'decisões tomadas'}
            </span>
            <span className="text-xs font-normal text-stone-400 group-open:hidden">
              · Mostrar histórico
            </span>
          </summary>
          <ul className="mt-3 bg-white border border-stone-200 rounded-2xl divide-y divide-stone-200 shadow-sm">
            {decidedDecisions.map((d) => (
              <li key={d.id} className="p-4 sm:p-5 space-y-1">
                <div className="font-semibold text-stone-900 text-sm">{d.title}</div>
                <div className="text-xs text-stone-700">
                  <span className="font-semibold text-emerald-700">Decidido: </span>
                  {d.chosenOption}
                </div>
                {d.rationale && (
                  <div className="text-xs text-stone-500">
                    <span className="font-medium">Motivo: </span>
                    {d.rationale}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}

      <NewDecisionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
