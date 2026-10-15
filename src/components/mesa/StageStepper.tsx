import React, { useState } from 'react';
import { Stage, Task } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Plus,
  CheckCircle2,
  MoreHorizontal,
  Edit2,
  Trash2,
  ArrowRightCircle,
  Flag,
  Workflow
} from 'lucide-react';
import { NewStageModal, EditStageModal, CompleteStageModal } from './StageModals';
import { StageDetailDialog } from './StageDetailDialog';

interface StageStepperProps {
  projectId: string;
  stages: Stage[];
  tasks: Task[];
  selectedStageId?: string;
  onSelectStage?: (stageId: string) => void;
}

export const StageStepper: React.FC<StageStepperProps> = ({
  projectId,
  stages,
  tasks,
  selectedStageId,
  onSelectStage
}) => {
  const { setCurrentStage, deleteStage } = useApp();
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [editStage, setEditStage] = useState<Stage | null>(null);
  const [detailStage, setDetailStage] = useState<Stage | null>(null);
  const [completeModalOpen, setCompleteModalOpen] = useState(false);
  const [activeMenuStageId, setActiveMenuStageId] = useState<string | null>(null);

  const currentStage = stages.find((s) => s.status === 'atual');

  // Open tasks in current stage
  const currentStageOpenTasks = currentStage
    ? tasks.filter(
        (t) =>
          t.stageId === currentStage.id &&
          t.status !== 'concluida' &&
          t.status !== 'arquivada'
      ).length
    : 0;

  const handleStageClick = (stage: Stage) => {
    if (onSelectStage) {
      onSelectStage(stage.id);
    }
  };

  const handleDelete = (stage: Stage) => {
    setActiveMenuStageId(null);
    const stageTasks = tasks.filter((t) => t.stageId === stage.id && t.status !== 'arquivada');
    if (stageTasks.length > 0) {
      const confirmMove = window.confirm(
        `Esta etapa tem ${stageTasks.length} cartão(ões). Deseja excluí-la? Os cartões ficarão sem etapa atribuída.`
      );
      if (!confirmMove) return;
    } else {
      if (!window.confirm(`Excluir a etapa "${stage.title}"?`)) return;
    }
    deleteStage(stage.id);
  };

  return (
    <div className="space-y-4">
      {/* Header of the Roadmap section */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Layers className="w-5 h-5 text-brand-signal" />
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Roadmap do Projeto
          </h2>
          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-semibold tabular-nums">
            {stages.length} {stages.length === 1 ? 'etapa' : 'etapas'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentStage && (
            <button
              onClick={() => setCompleteModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Concluir etapa atual</span>
            </button>
          )}

          <button
            onClick={() => setNewModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-lg cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova etapa</span>
          </button>
        </div>
      </div>

      {stages.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center space-y-3">
          <Layers className="w-8 h-8 text-stone-400 mx-auto" />
          <h3 className="text-base font-semibold text-stone-900">
            Nenhuma etapa definida para este projeto
          </h3>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            O roadmap divide sua meta em etapas sequenciais com critérios claros de entrega.
          </p>
          <button
            onClick={() => setNewModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-brand-primary bg-brand-signal rounded-lg cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Criar primeira etapa</span>
          </button>
        </div>
      ) : (
        /* Horizontally scrollable stepper with scroll-snap */
        <div className="relative">
          <div
            className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scrollbar-thin"
            role="region"
            aria-label="Etapas do projeto"
          >
            {stages.map((stage, idx) => {
              const isAtual = stage.status === 'atual';
              const isConcluida = stage.status === 'concluida';
              const isSelected = selectedStageId === stage.id;

              const stageCards = tasks.filter(
                (t) => t.stageId === stage.id && t.status !== 'arquivada'
              );
              const doneCards = stageCards.filter((t) => t.status === 'concluida');
              const totalCards = stageCards.length;
              const progressPct =
                totalCards > 0
                  ? Math.round((doneCards.length / totalCards) * 100)
                  : isConcluida
                  ? 100
                  : 0;

              return (
                <div
                  key={stage.id}
                  onClick={() => handleStageClick(stage)}
                  className={`snap-start min-w-[280px] sm:min-w-[320px] max-w-[340px] shrink-0 rounded-2xl p-5 flex flex-col justify-between transition-all duration-150 cursor-pointer relative ${
                    isAtual
                      ? 'bg-amber-50/40 border-2 border-brand-signal shadow-md ring-2 ring-brand-signal/20'
                      : isConcluida
                      ? 'bg-stone-50 border border-emerald-200 hover:border-emerald-300'
                      : 'bg-white border border-stone-200 hover:border-stone-300'
                  } ${isSelected && !isAtual ? 'ring-2 ring-stone-400' : ''}`}
                >
                  {/* Top Row: Number, status badge & options menu */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isAtual
                              ? 'bg-brand-signal text-brand-primary'
                              : isConcluida
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 text-stone-600'
                          }`}
                        >
                          {idx + 1}
                        </span>

                        {/* Status Badge */}
                        {isAtual && (
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-signal text-brand-primary text-xs font-extrabold shadow-xs">
                            Atual
                          </span>
                        )}
                        {isConcluida && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Concluída</span>
                          </span>
                        )}
                        {!isAtual && !isConcluida && (
                          <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-xs font-medium">
                            {idx === 1 && stages[0]?.status === 'atual' ? 'Próxima' : 'Futura'}
                          </span>
                        )}
                      </div>

                      {/* Dropdown Menu Toggle */}
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuStageId(
                              activeMenuStageId === stage.id ? null : stage.id
                            );
                          }}
                          aria-label="Opções da etapa"
                          className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md cursor-pointer transition-colors"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {activeMenuStageId === stage.id && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute right-0 top-full mt-1 w-44 bg-white border border-stone-200 rounded-xl shadow-lg py-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                          >
                            {!isAtual && !isConcluida && (
                              <button
                                onClick={() => {
                                  setActiveMenuStageId(null);
                                  setCurrentStage(projectId, stage.id);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <ArrowRightCircle className="w-3.5 h-3.5 text-brand-signal" />
                                <span>Definir como atual</span>
                              </button>
                            )}

                            {isAtual && (
                              <button
                                onClick={() => {
                                  setActiveMenuStageId(null);
                                  setCompleteModalOpen(true);
                                }}
                                className="w-full px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Concluir etapa</span>
                              </button>
                            )}

                            <button
                              onClick={() => {
                                setActiveMenuStageId(null);
                                setDetailStage(stage);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <Workflow className="w-3.5 h-3.5 text-brand-signal" />
                              <span>Detalhes e Processos</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveMenuStageId(null);
                                setEditStage(stage);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5 text-stone-400" />
                              <span>Editar etapa</span>
                            </button>

                            <button
                              onClick={() => handleDelete(stage)}
                              className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                              <span>Excluir etapa</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Stage Title */}
                    <h3
                      className={`font-bold text-base leading-snug ${
                        isAtual ? 'text-stone-950 font-extrabold' : 'text-stone-800'
                      }`}
                    >
                      {stage.title}
                    </h3>

                    {/* Done Criteria (one-line) */}
                    <div className="text-xs text-stone-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-stone-200/80">
                      <span className="font-semibold text-stone-700 block mb-0.5 flex items-center gap-1">
                        <Flag className="w-3 h-3 text-stone-400" />
                        <span>Critério de entrega:</span>
                      </span>
                      <p className="line-clamp-2 text-stone-700">{stage.doneCriteria}</p>
                    </div>
                  </div>

                  {/* Progress Bar & Card Count */}
                  <div className="pt-4 mt-3 border-t border-stone-200/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span>Progresso</span>
                      <span className="font-semibold tabular-nums">
                        {doneCards.length} de {totalCards} {totalCards === 1 ? 'cartão' : 'cartões'}
                      </span>
                    </div>

                    <div className="h-2 w-full bg-stone-200/80 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isConcluida
                            ? 'bg-emerald-600'
                            : isAtual
                            ? 'bg-brand-primary'
                            : 'bg-stone-500'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modals */}
      <NewStageModal
        isOpen={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        projectId={projectId}
      />

      <EditStageModal
        isOpen={Boolean(editStage)}
        onClose={() => setEditStage(null)}
        stage={editStage}
      />

      <StageDetailDialog
        isOpen={Boolean(detailStage)}
        onClose={() => setDetailStage(null)}
        stage={detailStage}
        projectId={projectId}
      />

      {currentStage && (
        <CompleteStageModal
          isOpen={completeModalOpen}
          onClose={() => setCompleteModalOpen(false)}
          projectId={projectId}
          stageTitle={currentStage.title}
          pendingTasksCount={currentStageOpenTasks}
        />
      )}
    </div>
  );
};
