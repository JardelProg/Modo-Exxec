import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export const ProgramPage: React.FC = () => {
  const { missions, navigateTo } = useApp();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredMissions = missions.filter((m) => {
    if (filter === 'completed') return m.completed;
    if (filter === 'pending') return !m.completed;
    return true;
  });

  const completedCount = missions.filter((m) => m.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#EA580C] uppercase tracking-wide">
            <span>Roteiro de 30 Dias</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 font-mono tabular-nums">
              {completedCount} de 30 entregas realizadas
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 mt-1">
            Programa MODO EXECUÇÃO
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Cada dia traz um capítulo editorial e uma missão prática. Sem acúmulo e sem cobrança por dias pulados.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs font-medium self-start sm:self-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todas (30)
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pendentes ({30 - completedCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              filter === 'completed'
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Concluídas ({completedCount})
          </button>
        </div>
      </div>

      {/* Mission list */}
      <div className="space-y-3">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            onClick={() => navigateTo(`/app/missao/${mission.id}`)}
            className="p-4 sm:p-5 rounded-xl bg-white border border-stone-200 hover:border-stone-400 transition-all cursor-pointer group flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono font-bold text-[#EA580C]">
                  DIA {mission.day.toString().padStart(2, '0')}
                </span>
                <span className="text-stone-400">·</span>
                <span className="text-stone-500 font-mono tabular-nums">
                  {mission.estimatedMinutes} min
                </span>
                {mission.blockedReason && (
                  <>
                    <span className="text-stone-400">·</span>
                    <span className="text-amber-700 font-medium">Bloqueio registrado</span>
                  </>
                )}
              </div>
              <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#EA580C] transition-colors truncate">
                {mission.title}
              </h3>
              <p className="text-xs text-stone-500 line-clamp-1">
                {mission.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              {mission.completed ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Concluída</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-stone-700 group-hover:text-stone-900">
                  <span>Abrir</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
