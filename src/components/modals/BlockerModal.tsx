import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BlockerReason, Mission } from '../../types';
import { X, ArrowRight, HeartHandshake, ShieldCheck } from 'lucide-react';
import { BLOCKER_OPTIONS } from '../../data/blockerCopy';

interface BlockerModalProps {
  mission: Mission;
  isOpen: boolean;
  onClose: () => void;
  onAcceptReduced: () => void;
}

export const BlockerModal: React.FC<BlockerModalProps> = ({
  mission,
  isOpen,
  onClose,
  onAcceptReduced
}) => {
  const { blockMission } = useApp();
  const [selectedReason, setSelectedReason] = useState<BlockerReason | null>(null);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState<'reason' | 'solution'>('reason');

  if (!isOpen) return null;

  const handleSelectReason = (reason: BlockerReason) => {
    setSelectedReason(reason);
    blockMission(mission.id, reason, notes);
    setStep('solution');
  };

  const handleFinish = () => {
    onClose();
    onAcceptReduced();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-start justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-brand-accent" />
            <h3 className="text-base font-semibold text-stone-900">
              {step === 'reason' ? 'Acolhendo o Bloqueio' : 'Plano de Redução'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {step === 'reason' ? (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-stone-600 leading-relaxed">
              Não conseguir executar hoje não é falha nem falta de força de vontade. É apenas um sinal de atrito. Para desarmar a resistência, selecione o motivo que mais se aproxima do seu bloqueio:
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {BLOCKER_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleSelectReason(opt.id)}
                  className="w-full text-left p-3 rounded-lg border border-stone-200 hover:border-stone-400 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="text-xs font-semibold text-stone-900 group-hover:text-brand-accent">
                    {opt.label}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                    {opt.explanation}
                  </div>
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-medium text-stone-600 mb-1">
                Anotação rápida opcional (para seu registro pessoal):
              </label>
              <input
                type="text"
                placeholder="Ex: O cliente não me enviou o arquivo ainda..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="bg-amber-50/70 border border-amber-200/80 p-4 rounded-lg">
              <span className="text-[11px] font-semibold text-amber-900 uppercase tracking-wide">
                Sem Culpa · Ação Mínima Desenhada
              </span>
              <p className="text-xs text-amber-950 mt-1.5 leading-relaxed">
                Quando a missão completa encontra fricção, o segredo da execução contínua é recuar um degrau sem abandonar a postura executiva.
              </p>
            </div>

            <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
              <div className="text-xs font-medium text-stone-500 mb-1">
                Missão Reduzida Sugerida:
              </div>
              <div className="text-sm font-semibold text-stone-900 leading-snug">
                {mission.minimalAction}
              </div>
              <div className="text-[11px] text-stone-600 mt-2">
                Tempo estimado: <strong>3 a 5 minutos</strong>.
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
              >
                Retomar mais tarde
              </button>
              <button
                onClick={handleFinish}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-accent hover:bg-brand-accent-hover rounded-lg transition-colors cursor-pointer"
              >
                <span>Fazer Versão Mínima Agora</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
