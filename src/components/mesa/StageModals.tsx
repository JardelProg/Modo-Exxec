import React, { useState, useEffect } from 'react';
import { Stage } from '../../types';
import { useApp } from '../../context/AppContext';
import { getBoardRules, canAddStage, validateDoneCriteria } from '../../lib/boardRules';
import { X, Layers, Edit2, CheckCircle2, AlertTriangle } from 'lucide-react';

interface NewStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export const NewStageModal: React.FC<NewStageModalProps> = ({
  isOpen,
  onClose,
  projectId
}) => {
  const { userProfile, stages, addStage, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [doneCriteria, setDoneCriteria] = useState('');
  const [error, setError] = useState<string | null>(null);

  const rules = getBoardRules(userProfile);
  const projectStages = stages.filter((s) => s.projectId === projectId);

  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDoneCriteria('');
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const stageLimitCheck = canAddStage(projectStages, rules);
    if (stageLimitCheck) {
      setError(`${stageLimitCheck.message} ${stageLimitCheck.hint}`);
      showToast('Limite de Etapas', stageLimitCheck.message, 'warning');
      return;
    }

    const criteriaCheck = validateDoneCriteria(doneCriteria, rules);
    if (criteriaCheck) {
      setError(`${criteriaCheck.message} ${criteriaCheck.hint}`);
      return;
    }

    const created = addStage(projectId, {
      title: title.trim(),
      doneCriteria: doneCriteria.trim()
    });

    if (created) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-signal" />
            <h3 className="text-base font-semibold text-stone-900">Nova Etapa do Projeto</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome da Etapa *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Prototipagem da oferta e validação inicial"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Critério de Conclusão (O que torna a etapa terminada?) *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Três conversas exploratórias realizadas e tabela de preços definida em documento único."
              value={doneCriteria}
              onChange={(e) => setDoneCriteria(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Defina uma evidência observável para saber quando a etapa foi cumprida sem ambiguidade.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-lg cursor-pointer transition-colors"
            >
              Criar Etapa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stage: Stage | null;
}

export const EditStageModal: React.FC<EditStageModalProps> = ({
  isOpen,
  onClose,
  stage
}) => {
  const { updateStage } = useApp();
  const [title, setTitle] = useState('');
  const [doneCriteria, setDoneCriteria] = useState('');

  useEffect(() => {
    if (stage) {
      setTitle(stage.title);
      setDoneCriteria(stage.doneCriteria);
    }
  }, [stage]);

  if (!isOpen || !stage) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !doneCriteria.trim()) return;

    updateStage(stage.id, {
      title: title.trim(),
      doneCriteria: doneCriteria.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-brand-signal" />
            <h3 className="text-base font-semibold text-stone-900">Editar Etapa</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Nome da Etapa *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Critério de Conclusão *
            </label>
            <textarea
              required
              rows={3}
              value={doneCriteria}
              onChange={(e) => setDoneCriteria(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-lg cursor-pointer transition-colors"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface CompleteStageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  stageTitle: string;
  pendingTasksCount: number;
}

export const CompleteStageModal: React.FC<CompleteStageModalProps> = ({
  isOpen,
  onClose,
  projectId,
  stageTitle,
  pendingTasksCount
}) => {
  const { completeCurrentStage } = useApp();
  const [leftovers, setLeftovers] = useState<'move_next' | 'park' | 'archive'>('move_next');

  if (!isOpen) return null;

  const handleConfirm = () => {
    completeCurrentStage(projectId, { leftovers, ignoreDecisions: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-stone-900">Concluir Etapa Atual</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-sm text-stone-700">
            Você está concluindo a etapa <strong>&quot;{stageTitle}&quot;</strong>.
          </p>

          {pendingTasksCount > 0 ? (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="text-xs font-semibold text-amber-900">
                Ainda há {pendingTasksCount} {pendingTasksCount === 1 ? 'cartão aberto' : 'cartões abertos'} nesta etapa. O que deseja fazer?
              </div>
              <div className="space-y-1.5 text-xs text-stone-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leftovers"
                    value="move_next"
                    checked={leftovers === 'move_next'}
                    onChange={() => setLeftovers('move_next')}
                    className="accent-brand-primary"
                  />
                  <span>Mover cartões abertos para a próxima etapa</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leftovers"
                    value="park"
                    checked={leftovers === 'park'}
                    onChange={() => setLeftovers('park')}
                    className="accent-brand-primary"
                  />
                  <span>Guardar no Estacionamento de ideias</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="leftovers"
                    value="archive"
                    checked={leftovers === 'archive'}
                    onChange={() => setLeftovers('archive')}
                    className="accent-brand-primary"
                  />
                  <span>Arquivar cartões não concluídos</span>
                </label>
              </div>
            </div>
          ) : (
            <p className="text-xs text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-200">
              Todos os cartões desta etapa foram concluídos. A próxima etapa será promovida a etapa atual.
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg cursor-pointer transition-colors"
            >
              Confirmar Conclusão
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
