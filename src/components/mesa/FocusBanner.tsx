import React, { useState } from 'react';
import { Project, Stage, Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { sortByOrder } from '../../lib/boardUtils';
import { Clock, FileCheck2, CheckCircle2, AlertCircle, Plus, CheckSquare } from 'lucide-react';

interface FocusBannerProps {
  project: Project;
  currentStage: Stage | undefined;
  tasks: Task[];
  onAddNewCard?: () => void;
  onOpenCard?: (task: Task) => void;
}

import { UnblockDialog } from './UnblockDialog';

export const FocusBanner: React.FC<FocusBannerProps> = ({
  project,
  currentStage,
  tasks,
  onAddNewCard,
  onOpenCard
}) => {
  const { moveCard, showToast } = useApp();
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);

  // 1. Check if the project has an active card flagged as isNextPhysicalAction
  const projectActiveTasks = tasks.filter(
    (t) => t.projectId === project.id && t.status !== 'concluida' && t.status !== 'arquivada'
  );

  let focusCard: Task | undefined = projectActiveTasks.find((t) => t.isNextPhysicalAction);

  // 2. If not, pick the first 'pronta' card of the current stage by order
  if (!focusCard && currentStage) {
    const stageReadyCards = sortByOrder(
      projectActiveTasks.filter(
        (t) => t.stageId === currentStage.id && t.status === 'pronta'
      )
    );
    if (stageReadyCards.length > 0) {
      focusCard = stageReadyCards[0];
    }
  }

  // 3. Fallback: check if there's an 'em_andamento' card in current stage or project
  if (!focusCard && currentStage) {
    const stageDoingCards = projectActiveTasks.filter(
      (t) => t.stageId === currentStage.id && t.status === 'em_andamento'
    );
    if (stageDoingCards.length > 0) {
      focusCard = stageDoingCards[0];
    }
  }

  // 4. Fallback: any ready card in the project
  if (!focusCard) {
    const anyReady = sortByOrder(projectActiveTasks.filter((t) => t.status === 'pronta'));
    if (anyReady.length > 0) {
      focusCard = anyReady[0];
    }
  }

  const handleComplete = () => {
    if (!focusCard) return;
    moveCard(focusCard.id, { status: 'concluida' });
    showToast(
      'Cartão concluído!',
      `"${focusCard.title}" foi concluído com sucesso.`,
      'success'
    );
  };

  if (!focusCard) {
    return (
      <section
        className="bg-brand-primary text-white rounded-2xl p-6 sm:p-7 space-y-4 shadow-xs"
        aria-label="Faça agora"
      >
        <div className="flex items-center justify-between">
          <span className="inline-block px-2.5 py-1 rounded-full bg-brand-signal text-brand-primary text-xs sm:text-sm font-semibold">
            Faça agora
          </span>
          <span className="text-xs text-white/60">
            {currentStage ? `Etapa: ${currentStage.title}` : 'Sem etapa ativa'}
          </span>
        </div>

        <div className="space-y-1.5 py-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Escolha o próximo cartão ou crie um novo.
          </h2>
          <p className="text-sm text-white/70 max-w-xl">
            {currentStage
              ? `Não há cartões prontos na etapa atual (${currentStage.title}). Defina a próxima ação física para começar.`
              : 'Defina a etapa atual do projeto para avançar.'}
          </p>
        </div>

        {onAddNewCard && currentStage && (
          <div className="pt-2">
            <button
              onClick={onAddNewCard}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-brand-primary bg-brand-signal hover:bg-white rounded-xl cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Criar cartão na etapa atual</span>
            </button>
          </div>
        )}
      </section>
    );
  }

  return (
    <section
      className="bg-brand-primary text-white rounded-2xl p-6 sm:p-7 space-y-5 shadow-xs"
      aria-label="Faça agora"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="inline-block px-2.5 py-1 rounded-full bg-brand-signal text-brand-primary text-xs sm:text-sm font-semibold">
          Faça agora
        </span>
        {currentStage && (
          <span className="text-xs text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full">
            Etapa: {currentStage.title}
          </span>
        )}
      </div>

      <h2>
        <button
          type="button"
          onClick={() => onOpenCard?.(focusCard)}
          className="text-left text-2xl sm:text-3xl font-bold text-balance leading-snug hover:text-brand-signal transition-colors cursor-pointer"
        >
          {focusCard.title}
        </button>
      </h2>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
        <span className="inline-flex items-center gap-2 tabular-nums">
          <Clock className="w-4 h-4 text-brand-signal" />
          {focusCard.durationMinutes} minutos
        </span>
        {(focusCard.expectedEvidence || focusCard.evidenceNote) && (
          <span className="inline-flex items-start gap-2">
            <FileCheck2 className="w-4 h-4 text-brand-signal mt-0.5 shrink-0" />
            <span>Termina quando: {focusCard.expectedEvidence || focusCard.evidenceNote}</span>
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        <button
          onClick={handleComplete}
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-brand-primary bg-brand-signal hover:bg-white rounded-xl cursor-pointer transition-colors shadow-xs"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>Concluir</span>
        </button>
        <button
          onClick={() => setUnblockDialogOpen(true)}
          className="px-5 py-3.5 text-sm font-semibold border border-white/25 hover:bg-white/10 rounded-xl cursor-pointer transition-colors text-center"
        >
          Estou travado nesta
        </button>
      </div>

      {unblockDialogOpen && focusCard && (
        <UnblockDialog
          isOpen={unblockDialogOpen}
          onClose={() => setUnblockDialogOpen(false)}
          task={focusCard}
          project={project}
          stage={currentStage}
        />
      )}
    </section>
  );
};
