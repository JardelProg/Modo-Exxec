import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Priority, ProjectStatus, CreateProjectWithMesaInput, ProcessDoc } from '../../types';
import { PROJECT_TEMPLATES, ProjectTemplate } from '../../data/projectTemplates';
import { getBoardRules } from '../../lib/boardRules';
import { mapStepToCardData } from '../../lib/processImport';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Check,
  Rocket,
  Briefcase,
  UserPlus,
  Coins,
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Star,
  AlertTriangle,
  Layers,
  FileCheck2,
  CheckCircle2,
  Workflow
} from 'lucide-react';

interface NewMesaWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimpleModal?: () => void;
}

interface EditableStage {
  id: string;
  title: string;
  doneCriteria: string;
  cards: {
    id: string;
    title: string;
    durationMinutes: number;
    expectedEvidence: string;
    isNextPhysicalAction?: boolean;
  }[];
}

const TEMPLATE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Rocket,
  Briefcase,
  UserPlus,
  Coins
};

export const NewMesaWizard: React.FC<NewMesaWizardProps> = ({
  isOpen,
  onClose,
  onOpenSimpleModal
}) => {
  const { userProfile, projects, processes, createProjectWithMesa, navigateTo } = useApp();
  const rules = getBoardRules(userProfile);

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 State
  const [name, setName] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState<Priority>('Alta');
  const [status, setStatus] = useState<ProjectStatus>('ativo');

  // Step 2 State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  // Step 3 & 4 State
  const [stages, setStages] = useState<EditableStage[]>([]);
  const [selectedNextActionCardId, setSelectedNextActionCardId] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  const activeProjectsCount = projects.filter((p) => p.status === 'ativo').length;
  const isOverProjectLimit = activeProjectsCount >= rules.maxActiveProjects;

  const isDirty = useMemo(() => {
    return Boolean(name.trim() || desiredOutcome.trim() || selectedTemplateId || stages.length > 0);
  }, [name, desiredOutcome, selectedTemplateId, stages]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setName('');
      setDesiredOutcome('');
      setDeadline('');
      setPriority('Alta');
      setStatus('ativo');
      setSelectedTemplateId(null);
      setStages([]);
      setSelectedNextActionCardId(null);
    }
  }, [isOpen]);

  // Esc key with confirmation if dirty
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleSafeClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDirty]);

  const handleSafeClose = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm('Deseja descartar a criação desta mesa?');
      if (!confirmDiscard) return;
    }
    onClose();
  };

  // Template selection
  const handleSelectTemplate = (template: ProjectTemplate) => {
    setSelectedTemplateId(template.id);
    if (!name.trim()) {
      setName(template.name);
    }
    if (!desiredOutcome.trim()) {
      setDesiredOutcome(template.description);
    }

    const newStages: EditableStage[] = template.stages.map((stg, sIdx) => ({
      id: `stg-${sIdx}-${Date.now()}`,
      title: stg.title,
      doneCriteria: stg.doneCriteria,
      cards: stg.cards.map((c, cIdx) => ({
        id: `card-${sIdx}-${cIdx}-${Date.now()}`,
        title: c.title,
        durationMinutes: c.durationMinutes,
        expectedEvidence: c.expectedEvidence,
        isNextPhysicalAction: sIdx === 0 && cIdx === 0
      }))
    }));

    setStages(newStages);
    if (newStages[0]?.cards[0]) {
      setSelectedNextActionCardId(newStages[0].cards[0].id);
    }
  };

  // Process as source
  const handleSelectProcess = (proc: ProcessDoc) => {
    setSelectedTemplateId(`process-${proc.id}`);
    if (!name.trim()) {
      setName(proc.title);
    }
    if (!desiredOutcome.trim()) {
      setDesiredOutcome(
        proc.expectedResult || proc.minimumStandard || 'Etapa do processo concluída com padrão mínimo'
      );
    }

    const maxCards = rules.maxOpenCardsCurrentStage;
    const cappedSteps = proc.steps.slice(0, maxCards);

    const singleStage: EditableStage = {
      id: `stg-proc-${Date.now()}`,
      title: proc.title,
      doneCriteria:
        proc.minimumStandard ||
        proc.expectedResult ||
        'Passos do processo executados com padrão mínimo',
      cards: cappedSteps.map((step, idx) => {
        const cardData = mapStepToCardData(step, proc);
        return {
          id: `card-proc-${idx}-${Date.now()}`,
          title: cardData.title,
          durationMinutes: cardData.durationMinutes,
          expectedEvidence: cardData.expectedEvidence,
          isNextPhysicalAction: idx === 0
        };
      })
    };

    setStages([singleStage]);
    if (singleStage.cards[0]) {
      setSelectedNextActionCardId(singleStage.cards[0].id);
    }
  };

  const handleSelectFromScratch = () => {
    setSelectedTemplateId('scratch');
    const defaultStages: EditableStage[] = [
      {
        id: `stg-0-${Date.now()}`,
        title: 'Diagnóstico e primeiro passo',
        doneCriteria: 'Primeira entrega concluída e documentada',
        cards: [
          {
            id: `card-0-${Date.now()}`,
            title: 'Definir o arquivo inicial e a primeira ação de 15 minutos',
            durationMinutes: 15,
            expectedEvidence: 'Arquivo aberto e primeiros parágrafos salvos',
            isNextPhysicalAction: true
          }
        ]
      },
      {
        id: `stg-1-${Date.now()}`,
        title: 'Execução e entregas intermediárias',
        doneCriteria: 'Protótipo concluído',
        cards: []
      },
      {
        id: `stg-2-${Date.now()}`,
        title: 'Revisão final e entrega',
        doneCriteria: 'Resultado entregue ao destinatário final',
        cards: []
      }
    ];

    setStages(defaultStages);
    setSelectedNextActionCardId(defaultStages[0].cards[0].id);
  };

  // Stage Manipulation in Step 3
  const handleAddStage = () => {
    if (stages.length >= rules.maxStagesPerProject) return;
    const newIdx = stages.length + 1;
    setStages((prev) => [
      ...prev,
      {
        id: `stg-${Date.now()}`,
        title: `Etapa ${newIdx}`,
        doneCriteria: '',
        cards: []
      }
    ]);
  };

  const handleRemoveStage = (index: number) => {
    if (stages.length <= 1) return;
    setStages((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleMoveStage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= stages.length) return;
    const copy = [...stages];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIdx, 0, moved);
    setStages(copy);
  };

  // Cards Manipulation in Step 4
  const firstStage = stages[0];
  const firstStageCards = firstStage ? firstStage.cards : [];

  const handleAddCardToFirstStage = () => {
    if (!firstStage) return;
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      title: '',
      durationMinutes: 20,
      expectedEvidence: '',
      isNextPhysicalAction: false
    };

    setStages((prev) =>
      prev.map((s, idx) =>
        idx === 0 ? { ...s, cards: [...s.cards, newCard] } : s
      )
    );

    if (!selectedNextActionCardId) {
      setSelectedNextActionCardId(newCard.id);
    }
  };

  const handleRemoveCardFromFirstStage = (cardId: string) => {
    if (!firstStage) return;
    setStages((prev) =>
      prev.map((s, idx) =>
        idx === 0 ? { ...s, cards: s.cards.filter((c) => c.id !== cardId) } : s
      )
    );

    if (selectedNextActionCardId === cardId) {
      const remaining = firstStage.cards.filter((c) => c.id !== cardId);
      if (remaining.length > 0) {
        setSelectedNextActionCardId(remaining[0].id);
      } else {
        setSelectedNextActionCardId(null);
      }
    }
  };

  const handleUpdateCardInFirstStage = (
    cardId: string,
    updates: Partial<{ title: string; durationMinutes: number; expectedEvidence: string }>
  ) => {
    setStages((prev) =>
      prev.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              cards: s.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c))
            }
          : s
      )
    );
  };

  // Final Submit
  const handleFinalSubmit = () => {
    if (!name.trim() || !desiredOutcome.trim() || stages.length === 0) return;

    // Build creation input
    const input: CreateProjectWithMesaInput = {
      name: name.trim(),
      desiredOutcome: desiredOutcome.trim(),
      deadline: deadline || undefined,
      priority,
      status,
      templateId: selectedTemplateId && selectedTemplateId !== 'scratch' ? selectedTemplateId : undefined,
      stages: stages.map((stg, sIdx) => ({
        title: stg.title.trim() || `Etapa ${sIdx + 1}`,
        doneCriteria: stg.doneCriteria.trim() || 'Critério de entrega da etapa',
        cards: stg.cards.map((c) => ({
          title: c.title.trim() || 'Primeira ação física',
          durationMinutes: c.durationMinutes || 20,
          expectedEvidence: c.expectedEvidence.trim() || 'Evidência concluída',
          isNextPhysicalAction: c.id === selectedNextActionCardId
        }))
      }))
    };

    const newProjectId = createProjectWithMesa(input);
    onClose();
    navigateTo(`/app/projetos/${newProjectId}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Montar Mesa de Criação"
        className="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Wizard Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-brand-signal" />
              <h2 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight">
                Montar Mesa de Criação
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Passo {step} de 4 —{' '}
              {step === 1 && 'Qual resultado você quer?'}
              {step === 2 && 'Como começar?'}
              {step === 3 && 'Etapas do Roadmap'}
              {step === 4 && 'Primeiro passo físico'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSafeClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-stone-100 w-full overflow-hidden">
          <div
            className="h-full bg-brand-signal transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Wizard Step Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* STEP 1: Qual resultado você quer? */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {isOverProjectLimit && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-2">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">
                        Você já tem {activeProjectsCount} de {rules.maxActiveProjects} projetos ativos.
                      </p>
                      <p className="text-amber-800 text-[11px] mt-0.5">
                        Poucos projetos ativos garantem mais velocidade. Você pode criá-lo como pausado para focar no que já começou.
                      </p>
                    </div>
                  </div>
                  {status === 'ativo' && (
                    <button
                      type="button"
                      onClick={() => setStatus('pausado')}
                      className="px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded-lg cursor-pointer text-xs transition-colors"
                    >
                      Criar como pausado
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Nome do Projeto *
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  autoFocus
                  placeholder="Ex: Nova oferta de consultoria"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600 bg-white"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>Dê um nome direto e fácil de reconhecer.</span>
                  <span>{name.length}/80</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Resultado Desejado (Critério de Conclusão) *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Complete: 'Quando isso estiver pronto, eu terei...'"
                  value={desiredOutcome}
                  onChange={(e) => setDesiredOutcome(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-stone-600 bg-white leading-relaxed"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Ex: Três clientes pagantes com propostas assinadas e primeiro ciclo entregue.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-stone-600"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Média">Média</option>
                    <option value="Baixa">Baixa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Prazo Opcional
                  </label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-stone-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                {onOpenSimpleModal && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenSimpleModal();
                    }}
                    className="text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
                  >
                    Criar projeto simples
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: Como começar? (Templates) */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <p className="text-xs text-stone-600">
                Escolha uma estrutura testada para economizar tempo ou comece com um plano em branco.
              </p>

              <div className="grid sm:grid-cols-2 gap-3">
                {PROJECT_TEMPLATES.map((tpl) => {
                  const IconComp = TEMPLATE_ICONS[tpl.icon] || Rocket;
                  const isSelected = selectedTemplateId === tpl.id;

                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                        isSelected
                          ? 'border-brand-signal bg-amber-50/50 ring-2 ring-brand-signal/20 shadow-xs'
                          : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                          <IconComp className="w-4 h-4 text-brand-primary" />
                        </div>
                        <h4 className="text-sm font-bold text-stone-900 leading-snug">
                          {tpl.name}
                        </h4>
                        <p className="text-xs text-stone-600 leading-relaxed">
                          {tpl.description}
                        </p>
                      </div>

                      <div className="text-[11px] font-semibold text-stone-400">
                        4 etapas · 3 a 5 ações estruturadas
                      </div>
                    </button>
                  );
                })}

                {/* Usar um processo meu */}
                <div
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-3 ${
                    selectedTemplateId?.startsWith('process-')
                      ? 'border-brand-signal bg-amber-50/50 ring-2 ring-brand-signal/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-brand-primary">
                      <Workflow className="w-4 h-4 text-brand-primary" />
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      Usar um processo meu
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Transforme os passos de um processo documentado na etapa inicial desta mesa.
                    </p>
                  </div>

                  {processes.length === 0 ? (
                    <div className="text-[11px] text-stone-400 italic">
                      Nenhum processo documentado ainda.
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <select
                        aria-label="Selecionar processo"
                        value={
                          selectedTemplateId?.startsWith('process-')
                            ? selectedTemplateId.replace('process-', '')
                            : ''
                        }
                        onChange={(e) => {
                          const proc = processes.find((p) => p.id === e.target.value);
                          if (proc) handleSelectProcess(proc);
                        }}
                        className="w-full text-xs px-2.5 py-1.5 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 font-medium text-stone-800"
                      >
                        <option value="">Escolha um processo ({processes.length})...</option>
                        {processes.map((proc) => (
                          <option key={proc.id} value={proc.id}>
                            {proc.title} ({proc.steps.length} {proc.steps.length === 1 ? 'passo' : 'passos'})
                          </option>
                        ))}
                      </select>
                      <div className="text-[11px] font-semibold text-stone-400">
                        Cria 1 etapa com cartões mapeados
                      </div>
                    </div>
                  )}
                </div>

                {/* Começar do zero */}
                <button
                  type="button"
                  onClick={handleSelectFromScratch}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                    selectedTemplateId === 'scratch'
                      ? 'border-brand-signal bg-amber-50/50 ring-2 ring-brand-signal/20 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300 bg-white hover:bg-stone-50/50'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-800">
                      <Layers className="w-4 h-4 text-stone-600" />
                    </div>
                    <h4 className="text-sm font-bold text-stone-900 leading-snug">
                      Começar do zero
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      Defina suas próprias etapas e passos conforme sua necessidade.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-stone-400">
                    Roadmap flexível
                  </div>
                </button>

                {/* Sugerir etapas com IA — em breve */}
                <div className="p-3.5 rounded-xl border border-stone-200/60 bg-stone-50/60 text-left opacity-60 cursor-not-allowed flex flex-col justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-stone-200/50 flex items-center justify-center text-stone-400">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 bg-stone-200/60 px-2 py-0.5 rounded-full">
                        Em breve
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-stone-700 leading-snug">
                      Sugerir etapas com IA
                    </h4>
                    <p className="text-xs text-stone-500 leading-relaxed">
                      Geração de etapas personalizadas a partir do seu objetivo.
                    </p>
                  </div>
                  <div className="text-[11px] font-semibold text-stone-400">
                    Disponível no próximo módulo
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Etapas do Roadmap */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Revise as etapas do seu projeto
                  </h3>
                  <p className="text-xs text-stone-500">
                    Poucas etapas facilitam manter a tração. Máximo de {rules.maxStagesPerProject} etapas.
                  </p>
                </div>
                {stages.length < rules.maxStagesPerProject && (
                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-lg cursor-pointer transition-colors shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar etapa</span>
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {stages.map((stg, index) => (
                  <div
                    key={stg.id}
                    className="p-3.5 bg-stone-50 border border-stone-200 rounded-xl space-y-2.5 relative"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-stone-200 text-stone-700 font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        {index === 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-brand-signal text-brand-primary text-[10px] font-extrabold uppercase tracking-wider">
                            Etapa atual
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveStage(index, 'up')}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === stages.length - 1}
                          onClick={() => handleMoveStage(index, 'down')}
                          className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {stages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStage(index)}
                            className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Nome da etapa"
                        value={stg.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStages((prev) =>
                            prev.map((s, idx) => (idx === index ? { ...s, title: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                      />

                      <textarea
                        rows={2}
                        required
                        placeholder="Critério de entrega: o que comprova que a etapa terminou?"
                        value={stg.doneCriteria}
                        onChange={(e) => {
                          const val = e.target.value;
                          setStages((prev) =>
                            prev.map((s, idx) => (idx === index ? { ...s, doneCriteria: val } : s))
                          );
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Primeiro passo (Faça agora) */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-stone-900">
                  Defina o primeiro passo físico
                </h3>
                <p className="text-xs text-stone-600">
                  Cartões de até 25 minutos para você começar agora mesmo. Selecione exatamente <strong>um</strong> cartão como &quot;Faça agora&quot;.
                </p>
              </div>

              {firstStageCards.length === 0 ? (
                <div className="p-6 bg-stone-50 border border-stone-200 rounded-xl text-center space-y-3">
                  <p className="text-xs text-stone-600">
                    Nenhum cartão cadastrado para a primeira etapa.
                  </p>
                  <button
                    type="button"
                    onClick={handleAddCardToFirstStage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-brand-primary bg-brand-signal rounded-lg cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar primeiro cartão</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {firstStageCards.map((card, idx) => {
                    const isSelectedNext = card.id === selectedNextActionCardId;

                    return (
                      <div
                        key={card.id}
                        className={`p-3.5 rounded-xl border transition-all ${
                          isSelectedNext
                            ? 'bg-amber-50/60 border-brand-signal ring-2 ring-brand-signal/20'
                            : 'bg-white border-stone-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-stone-100">
                          <button
                            type="button"
                            onClick={() => setSelectedNextActionCardId(card.id)}
                            className="inline-flex items-center gap-2 cursor-pointer text-left"
                          >
                            <Star
                              className={`w-4 h-4 ${
                                isSelectedNext
                                  ? 'fill-amber-400 text-amber-500'
                                  : 'text-stone-300 hover:text-stone-500'
                              }`}
                            />
                            <span
                              className={`text-xs font-bold ${
                                isSelectedNext ? 'text-amber-950' : 'text-stone-600'
                              }`}
                            >
                              {isSelectedNext
                                ? 'Faça agora (Próximo passo físico)'
                                : 'Definir como "Faça agora"'}
                            </span>
                          </button>

                          {firstStageCards.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCardFromFirstStage(card.id)}
                              className="text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="mt-2.5 space-y-2">
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Ação física (Ex: Escrever a promessa em 3 linhas)"
                              value={card.title}
                              onChange={(e) =>
                                handleUpdateCardInFirstStage(card.id, { title: e.target.value })
                              }
                              className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
                            />
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-1">
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">
                                Duração (min)
                              </label>
                              <input
                                type="number"
                                min={5}
                                max={45}
                                step={5}
                                value={card.durationMinutes}
                                onChange={(e) =>
                                  handleUpdateCardInFirstStage(card.id, {
                                    durationMinutes: Number(e.target.value) || 15
                                  })
                                }
                                className="w-full px-2 py-1 text-xs border border-stone-300 rounded-lg bg-white"
                              />
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] font-bold text-stone-500 mb-0.5">
                                Evidência observável
                              </label>
                              <input
                                type="text"
                                placeholder="Termina quando..."
                                value={card.expectedEvidence}
                                onChange={(e) =>
                                  handleUpdateCardInFirstStage(card.id, {
                                    expectedEvidence: e.target.value
                                  })
                                }
                                className="w-full px-2 py-1 text-xs border border-stone-300 rounded-lg bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={handleAddCardToFirstStage}
                    className="w-full py-2 border-2 border-dashed border-stone-200 hover:border-stone-400 text-stone-600 hover:text-stone-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar outro cartão na etapa atual</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Wizard Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3 | 4)}
                className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl cursor-pointer bg-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                disabled={
                  (step === 1 && (!name.trim() || !desiredOutcome.trim())) ||
                  (step === 2 && !selectedTemplateId) ||
                  (step === 3 && (stages.length === 0 || stages.some((s) => !s.title.trim())))
                }
                onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3 | 4)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer disabled:opacity-40 transition-colors shadow-xs"
              >
                <span>Avançar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={
                  firstStageCards.length === 0 ||
                  firstStageCards.some((c) => !c.title.trim())
                }
                onClick={handleFinalSubmit}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer disabled:opacity-40 transition-colors shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Criar mesa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
