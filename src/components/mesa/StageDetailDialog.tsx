import React, { useState, useMemo } from 'react';
import { Stage, ProcessDoc } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Layers,
  Workflow,
  ArrowDownToLine,
  BookmarkPlus,
  CheckCircle2,
  Clock,
  Flag,
  ChevronRight,
  ListOrdered
} from 'lucide-react';

interface StageDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  stage: Stage | null;
  projectId: string;
}

export const StageDetailDialog: React.FC<StageDetailDialogProps> = ({
  isOpen,
  onClose,
  stage
}) => {
  const {
    processes,
    tasks,
    userProfile,
    importProcessIntoStage,
    addProcess,
    navigateTo
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'import' | 'save'>('overview');
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  // Filter and order stage cards
  const stageCards = useMemo(() => {
    if (!stage) return [];
    return tasks
      .filter((t) => t.stageId === stage.id && t.status !== 'arquivada')
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [tasks, stage]);

  const selectedProcess = useMemo(() => {
    return processes.find((p) => p.id === selectedProcessId) || null;
  }, [processes, selectedProcessId]);

  if (!isOpen || !stage) return null;

  const handleImport = (proc: ProcessDoc) => {
    importProcessIntoStage(proc, stage.id);
    setActiveTab('overview');
  };

  const handleSaveAsProcess = () => {
    const cardTitles = stageCards.map((c) => c.title);
    const steps = cardTitles.length > 0 ? cardTitles : ['Passo 1 em definição'];

    addProcess(
      {
        title: stage.title,
        trigger: 'Ao iniciar uma etapa parecida em outro projeto',
        steps,
        responsible: userProfile.name || 'Responsável',
        minimumStandard: stage.doneCriteria,
        commonMistakes: [],
        expectedResult: stage.doneCriteria
      },
      {
        toastTitle: 'Processo Documentado',
        toastMessage: `A etapa "${stage.title}" foi salva como processo operacional.`,
        action: {
          label: 'Ver processo',
          onClick: () => {
            onClose();
            navigateTo('/app/processos');
          }
        }
      }
    );
    setActiveTab('overview');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
      role="dialog"
      aria-label={`Detalhes da etapa ${stage.title}`}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col gap-5 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <Layers className="w-3.5 h-3.5 text-brand-signal" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-500">
                Etapa do Projeto
              </span>
              {stage.status === 'atual' && (
                <span className="px-2 py-0.5 rounded-full bg-brand-signal text-brand-primary text-[10px] font-extrabold uppercase">
                  Atual
                </span>
              )}
              {stage.status === 'concluida' && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Concluída
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug truncate">
              {stage.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors shrink-0"
            aria-label="Fechar diálogo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Visão geral</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'bg-brand-signal text-brand-primary font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ArrowDownToLine className="w-3.5 h-3.5" />
            <span>Importar de um processo</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('save')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'save'
                ? 'bg-brand-signal text-brand-primary font-bold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Salvar como processo</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Done Criteria Card */}
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase tracking-wide">
                  <Flag className="w-3.5 h-3.5 text-amber-600" />
                  <span>Critério de Saída (Evidência Observável)</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                  {stage.doneCriteria}
                </p>
              </div>

              {/* Cards in this stage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                  <span>Cartões na etapa ({stageCards.length})</span>
                  <span className="text-stone-400 font-normal">
                    {stageCards.filter((c) => c.status === 'concluida').length} concluídos
                  </span>
                </div>

                {stageCards.length === 0 ? (
                  <div className="p-6 text-center bg-stone-50 border border-dashed border-stone-200 rounded-xl space-y-2">
                    <p className="text-xs text-stone-500">
                      Nenhum cartão cadastrado nesta etapa ainda.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('import')}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-signal hover:underline cursor-pointer"
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Importar passos de um processo</span>
                    </button>
                  </div>
                ) : (
                  <ul className="space-y-1.5">
                    {stageCards.map((card, idx) => (
                      <li
                        key={card.id}
                        className="p-2.5 rounded-lg bg-white border border-stone-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-md bg-stone-100 flex items-center justify-center text-[11px] font-mono font-bold text-stone-600 shrink-0">
                            {idx + 1}
                          </span>
                          <span
                            className={`font-semibold truncate ${
                              card.status === 'concluida'
                                ? 'line-through text-stone-400'
                                : 'text-stone-900'
                            }`}
                          >
                            {card.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 text-stone-500">
                          <span className="inline-flex items-center gap-1 tabular-nums font-mono">
                            <Clock className="w-3 h-3" />
                            {card.durationMinutes}m
                          </span>
                          {card.isNextPhysicalAction && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-signal text-brand-primary font-bold text-[10px]">
                              Faça agora
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Quick Actions Footer inside overview */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('import')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5 text-brand-signal" />
                  <span>Importar de um processo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('save')}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-brand-signal" />
                  <span>Salvar etapa como processo</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: IMPORTAR DE UM PROCESSO */}
          {activeTab === 'import' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                Cada passo do processo escolhido criará um cartão de 15 minutos na etapa com a evidência baseada no padrão mínimo. Caso o limite da etapa seja atingido, os passos restantes serão estacionados como ideias.
              </div>

              {processes.length === 0 ? (
                <div className="p-8 text-center bg-stone-50 border border-stone-200 rounded-xl space-y-2">
                  <Workflow className="w-7 h-7 text-stone-400 mx-auto" />
                  <p className="text-xs text-stone-600">
                    Nenhum processo documentado na sua conta ainda.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigateTo('/app/processos');
                    }}
                    className="text-xs font-bold text-orange-700 hover:underline cursor-pointer"
                  >
                    Ir para Processos e documentar um padrão
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-stone-700 block">
                    Escolha o processo para importar ({processes.length}):
                  </span>
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {processes.map((proc) => {
                      const isSelected = selectedProcessId === proc.id;
                      return (
                        <div
                          key={proc.id}
                          onClick={() => setSelectedProcessId(proc.id)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'border-brand-signal bg-amber-50/50 ring-2 ring-brand-signal/20 shadow-xs'
                              : 'border-stone-200 hover:border-stone-300 bg-white'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-stone-900 text-sm leading-snug">
                                  {proc.title}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-mono text-[10px] tabular-nums">
                                  {proc.steps.length} {proc.steps.length === 1 ? 'passo' : 'passos'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-600 line-clamp-1">
                                Padrão: {proc.minimumStandard}
                              </p>
                            </div>
                            <ChevronRight
                              className={`w-4 h-4 shrink-0 transition-transform ${
                                isSelected ? 'rotate-90 text-brand-primary' : 'text-stone-300'
                              }`}
                            />
                          </div>

                          {/* Expanded Step Preview if selected */}
                          {isSelected && (
                            <div className="mt-3 pt-3 border-t border-stone-200/80 space-y-2.5 animate-in fade-in duration-100">
                              <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wide block">
                                Passos a serem convertidos em cartões:
                              </span>
                              <ol className="space-y-1 text-xs text-stone-700 pl-1">
                                {proc.steps.map((st, sIdx) => (
                                  <li key={sIdx} className="flex items-start gap-2">
                                    <span className="font-mono text-[10px] text-stone-400 pt-0.5">
                                      {sIdx + 1}.
                                    </span>
                                    <span className="line-clamp-2">{st}</span>
                                  </li>
                                ))}
                              </ol>

                              <div className="pt-2 flex justify-end">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleImport(proc);
                                  }}
                                  className="px-4 py-2 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5"
                                >
                                  <ArrowDownToLine className="w-3.5 h-3.5" />
                                  <span>Importar {proc.steps.length} passos agora</span>
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SALVAR ETAPA COMO PROCESSO */}
          {activeTab === 'save' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2 text-xs text-stone-700">
                <span className="font-bold text-stone-900 block text-xs">
                  Resumo do novo Processo Operacional:
                </span>
                <ul className="space-y-1.5">
                  <li>
                    <strong className="text-stone-900">Título: </strong> {stage.title}
                  </li>
                  <li>
                    <strong className="text-stone-900">Gatilho de início: </strong>{' '}
                    &quot;Ao iniciar uma etapa parecida em outro projeto&quot;
                  </li>
                  <li>
                    <strong className="text-stone-900">Responsável padrão: </strong>{' '}
                    {userProfile.name || 'Empreendedor'}
                  </li>
                  <li>
                    <strong className="text-stone-900">Padrão Mínimo e Resultado: </strong>{' '}
                    {stage.doneCriteria}
                  </li>
                  <li className="flex items-start gap-1">
                    <strong className="text-stone-900 shrink-0">Passos ({stageCards.length}): </strong>
                    <span className="truncate">
                      {stageCards.length > 0
                        ? stageCards.map((c) => c.title).join(' → ')
                        : 'Nenhum cartão cadastrado (será criado passo padrão)'}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-xl cursor-pointer"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={handleSaveAsProcess}
                  className="px-4 py-2 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer transition-colors shadow-xs inline-flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>Salvar etapa como processo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
