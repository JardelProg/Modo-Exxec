import React from 'react';
import { X, HelpCircle, Target, Footprints, CheckSquare, Sparkles } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-start justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#EA580C]" />
            <h3 className="text-base font-semibold text-stone-900">
              Guia Rápido de Execução Imediata
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Sempre que você sentir hesitação ou confusão mental diante de qualquer tarefa ou projeto, faça a si mesmo estas três perguntas fundamentais:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <Target className="w-4 h-4 text-[#EA580C]" />
                <span>1. O que importa agora?</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                Isole a prioridade dominante. Não tente resolver a semana toda em uma tarde. O que move o ponteiro hoje?
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <Footprints className="w-4 h-4 text-[#EA580C]" />
                <span>2. Qual é a próxima ação física?</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                Substitua termos vagos como &quot;planejar marketing&quot; por ações mecânicas: &quot;Abrir o documento de texto e escrever 3 parágrafos&quot;.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 bg-stone-50">
              <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>3. Como saberei que concluí?</span>
              </div>
              <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                Defina a <strong>evidência visível</strong>: um e-mail enviado, um PDF exportado, um print salvo, um áudio gravado. Sem evidência, a tarefa nunca parece terminada.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-stone-100 text-stone-700 text-xs">
            <div className="font-semibold text-stone-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Dica de Ouro: A Regra dos 120 Segundos</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Você não precisa concluir o projeto todo agora. Apenas posicione as mãos no teclado e comprometa-se a executar os primeiros 2 minutos. A inércia inicial é a parte mais pesada da jornada.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              Entendi, voltar à execução
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
