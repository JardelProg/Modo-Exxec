import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckSquare } from 'lucide-react';

interface NewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  stageId: string;
  projectId: string;
  projectName: string;
}

export const NewCardModal: React.FC<NewCardModalProps> = ({
  isOpen,
  onClose,
  stageId,
  projectId,
  projectName
}) => {
  const { addCard } = useApp();
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [expectedEvidence, setExpectedEvidence] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addCard(stageId, {
      title: title.trim(),
      durationMinutes: Number(durationMinutes) || 20,
      expectedEvidence:
        expectedEvidence.trim() || 'Ação executada e evidência gerada',
      projectId,
      projectName
    });

    setTitle('');
    setDurationMinutes(20);
    setExpectedEvidence('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-brand-signal" />
            <h3 className="text-base font-semibold text-stone-900">Novo Cartão na Etapa</h3>
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
              Ação Física Concreta *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Escrever os 3 parágrafos da promessa da consultoria"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Comece com um verbo de ação física visível.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Duração Estimada (min)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                step="5"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Evidência Observável
              </label>
              <input
                type="text"
                placeholder="Ex: Arquivo salvo na pasta"
                value={expectedEvidence}
                onChange={(e) => setExpectedEvidence(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg bg-white"
              />
            </div>
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
              Adicionar Cartão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
