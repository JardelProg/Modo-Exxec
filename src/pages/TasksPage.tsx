import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Task, TASK_STATUS_LABEL } from '../types';
import {
  Plus,
  Clock,
  FileCheck2,
  CheckCircle2,
  Circle,
  Trash2,
  Unlock,
  ArrowUp,
  CheckSquare,
  Archive,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { NewTaskModal } from '../components/modals/NewItemModals';
import { getFocusTask } from '../lib/selectors';
import { UnblockDialog } from '../components/mesa/UnblockDialog';

export const TasksPage: React.FC = () => {
  const { tasks, projects, stages, toggleTaskComplete, deleteTask, updateTask, navigateTo } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [blocking, setBlocking] = useState(false);
  const [reason, setReason] = useState('');

  const stagesMap = useMemo(() => new Map(stages.map((s) => [s.id, s])), [stages]);
  const projectsMap = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);

  const open = tasks.filter((t) => t.status !== 'concluida' && t.status !== 'arquivada');
  const blocked = open.filter((t) => t.status === 'bloqueada');
  const ready = open.filter((t) => t.status !== 'bloqueada');

  // Global "Faça agora" uses getFocusTask
  const focus = useMemo(
    () => getFocusTask(tasks, projects, stages) ?? ready.find((t) => t.isNextPhysicalAction) ?? ready[0],
    [tasks, projects, stages, ready]
  );

  const queue = ready.filter((t) => t.id !== focus?.id);
  const done = tasks.filter((t) => t.status === 'concluida');
  const archived = tasks.filter((t) => t.status === 'arquivada');
  const queueMinutes = ready.reduce((sum, t) => sum + t.durationMinutes, 0);

  const makeNext = (t: Task) => {
    if (focus && focus.id !== t.id) updateTask(focus.id, { isNextPhysicalAction: false });
    updateTask(t.id, { isNextPhysicalAction: true });
  };
  const saveBlock = () => {
    if (!focus || !reason.trim()) return;
    updateTask(focus.id, { status: 'bloqueada', blockedReason: reason.trim(), isNextPhysicalAction: false });
    setReason(''); setBlocking(false);
  };
  const unblock = (t: Task) => updateTask(t.id, { status: 'pronta', blockedReason: undefined });
  const restoreTask = (t: Task) => {
    updateTask(t.id, {
      status: 'pronta',
      archivedAt: undefined,
      archiveReason: undefined
    });
  };
  const remove = (t: Task) => { if (window.confirm(`Excluir "${t.title}"?`)) deleteTask(t.id); };

  const meta = (t: Task) => {
    const stage = t.stageId ? stagesMap.get(t.stageId) : undefined;
    const project = t.projectId ? projectsMap.get(t.projectId) : (stage?.projectId ? projectsMap.get(stage.projectId) : undefined);
    const projectName = t.projectName || project?.name;
    const targetProjectId = t.projectId || stage?.projectId;

    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-stone-500">
        {projectName && <span className="font-medium text-stone-700">{projectName}</span>}
        {stage && (
          <span className="text-xs px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium">
            {stage.title}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 tabular-nums">
          <Clock className="w-3.5 h-3.5" /> {t.durationMinutes} min
        </span>
        {t.stageId && targetProjectId && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo(`/app/projetos/${targetProjectId}?cartao=${t.id}`);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 hover:text-orange-800 hover:underline cursor-pointer"
          >
            <span>Abrir na mesa</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Minhas tarefas</h1>
          <p className="text-stone-600 mt-1 tabular-nums">
            {ready.length} {ready.length === 1 ? 'ação pronta' : 'ações prontas'}, cerca de {queueMinutes} min no total
            {blocked.length > 0 && ` · ${blocked.length} ${blocked.length === 1 ? 'travada' : 'travadas'}`}
            {archived.length > 0 && ` · ${archived.length} ${archived.length === 1 ? 'arquivada' : 'arquivadas'}`}
          </p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer shrink-0">
          <Plus className="w-4 h-4" /> Nova ação
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="p-10 text-center bg-white border border-stone-200 rounded-2xl space-y-3">
          <CheckSquare className="w-8 h-8 text-stone-400 mx-auto" />
          <h2 className="text-lg">Nenhuma ação cadastrada</h2>
          <p className="text-stone-600 max-w-sm mx-auto">Escreva a primeira ação física de um projeto: algo que você consegue fazer em até 25 minutos e mostrar pronto.</p>
          <button onClick={() => setModalOpen(true)} className="px-5 py-3 text-sm font-bold text-brand-primary bg-brand-signal rounded-xl cursor-pointer">Escrever primeira ação</button>
        </div>
      ) : (
        <>
          {/* Faça agora */}
          {focus ? (
            <section className="bg-brand-primary text-white rounded-2xl p-6 sm:p-7 space-y-5" aria-label="Faça agora">
              <span className="inline-block px-2.5 py-1 rounded-full bg-brand-signal text-brand-primary text-sm font-semibold">Faça agora</span>
              <h2 className="text-2xl sm:text-3xl text-balance">{focus.title}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-white/80">
                {focus.projectName && <span className="font-semibold text-white">{focus.projectName}</span>}
                {focus.stageId && stagesMap.get(focus.stageId) && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-white font-medium">
                    {stagesMap.get(focus.stageId)?.title}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 tabular-nums"><Clock className="w-4 h-4 text-brand-signal" /> {focus.durationMinutes} minutos</span>
                <span className="inline-flex items-start gap-2"><FileCheck2 className="w-4 h-4 text-brand-signal mt-0.5 shrink-0" /> Termina quando: {focus.expectedEvidence}</span>
                {(() => {
                  const targetProjectId = focus.projectId || (focus.stageId ? stagesMap.get(focus.stageId)?.projectId : undefined);
                  if (!focus.stageId || !targetProjectId) return null;
                  return (
                    <button
                      type="button"
                      onClick={() => navigateTo(`/app/projetos/${targetProjectId}?cartao=${focus.id}`)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-signal hover:text-white underline underline-offset-2 cursor-pointer transition-colors"
                    >
                      <span>Abrir na mesa</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  );
                })()}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => toggleTaskComplete(focus.id)}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-brand-primary bg-brand-signal hover:bg-white rounded-xl cursor-pointer transition-colors">
                  <CheckCircle2 className="w-5 h-5" /> Concluir tarefa
                </button>
                <button onClick={() => setBlocking(true)} className="px-5 py-3.5 text-sm font-semibold border border-white/25 hover:bg-white/10 rounded-xl cursor-pointer transition-colors">Estou travado nesta</button>
              </div>

              {blocking && focus && (
                <UnblockDialog
                  isOpen={blocking}
                  onClose={() => setBlocking(false)}
                  task={focus}
                  project={projects.find((p) => p.id === focus.projectId)}
                  stage={stages.find((s) => s.id === focus.stageId)}
                  onSuccess={() => setBlocking(false)}
                />
              )}
            </section>
          ) : (
            <p className="p-5 bg-white border border-stone-200 rounded-2xl text-stone-600">Nenhuma ação pronta no momento. Destrave uma tarefa abaixo ou cadastre a próxima.</p>
          )}

          {/* Na fila */}
          {queue.length > 0 && (
            <section aria-label="Na fila">
              <h2 className="text-xl mb-3">Na fila</h2>
              <ul className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-200">
                {queue.map((t) => (
                  <li key={t.id} className="flex items-start gap-3 p-4 sm:p-5">
                    <button onClick={() => toggleTaskComplete(t.id)} aria-label={`Concluir: ${t.title}`} className="mt-0.5 text-stone-400 hover:text-emerald-600 cursor-pointer"><Circle className="w-5 h-5" /></button>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="font-semibold text-stone-900 leading-snug">{t.title}</div>
                      {meta(t)}
                      <div className="text-sm text-stone-600">Evidência: {t.expectedEvidence}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => makeNext(t)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg border border-stone-300 hover:bg-stone-100 cursor-pointer"><ArrowUp className="w-3.5 h-3.5" /> Fazer primeiro</button>
                      <button onClick={() => remove(t)} aria-label={`Excluir: ${t.title}`} className="p-2 text-stone-400 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Travadas */}
          {blocked.length > 0 && (
            <section aria-label="Travadas">
              <h2 className="text-xl mb-3">Travadas</h2>
              <ul className="space-y-3">
                {blocked.map((t) => (
                  <li key={t.id} className="p-4 sm:p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900 leading-snug">{t.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800">
                          {TASK_STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      {t.blockedReason && <p className="text-sm text-amber-900">Impedimento: {t.blockedReason}</p>}
                      {meta(t)}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => unblock(t)} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-lg cursor-pointer"><Unlock className="w-4 h-4" /> Destravar</button>
                      <button onClick={() => remove(t)} aria-label={`Excluir: ${t.title}`} className="p-2 text-stone-500 hover:text-rose-600 cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Concluídas */}
          {done.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-stone-700 font-semibold list-none flex items-center gap-2 select-none">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{done.length} {done.length === 1 ? 'concluída' : 'concluídas'}</span>
                <span className="text-sm font-normal text-stone-500 group-open:hidden">Mostrar</span>
              </summary>
              <ul className="mt-3 bg-white border border-stone-200 rounded-2xl divide-y divide-stone-200">
                {done.map((t) => (
                  <li key={t.id} className="flex items-center gap-3 p-4">
                    <button onClick={() => toggleTaskComplete(t.id)} aria-label={`Reabrir: ${t.title}`} className="cursor-pointer"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></button>
                    <span className="flex-1 text-stone-500 line-through">{t.title}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Arquivadas */}
          {archived.length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-stone-700 font-semibold list-none flex items-center gap-2 select-none">
                <Archive className="w-4 h-4 text-stone-500" />
                <span>Arquivadas ({archived.length})</span>
                <span className="text-sm font-normal text-stone-500 group-open:hidden">Mostrar</span>
              </summary>
              <ul className="mt-3 space-y-3">
                {archived.map((t) => (
                  <li
                    key={t.id}
                    className="p-4 sm:p-5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800 leading-snug">{t.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-200 text-stone-700">
                          {TASK_STATUS_LABEL[t.status]}
                        </span>
                      </div>
                      {t.archiveReason && (
                        <p className="text-xs text-stone-500">
                          Motivo do arquivamento: <span className="font-medium text-stone-700">{t.archiveReason}</span>
                        </p>
                      )}
                      {t.blockedReason && (
                        <p className="text-xs text-amber-800">
                          Impedimento original: {t.blockedReason}
                        </p>
                      )}
                      {meta(t)}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => restoreTask(t)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 cursor-pointer transition-colors shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-stone-600" />
                        Restaurar
                      </button>
                      <button
                        onClick={() => remove(t)}
                        aria-label={`Excluir: ${t.title}`}
                        className="p-2 text-stone-400 hover:text-rose-600 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </>
      )}
      <NewTaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
