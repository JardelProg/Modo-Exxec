import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectStatus } from '../types';
import { Plus, Calendar, FolderKanban, ArrowRight } from 'lucide-react';
import { NewProjectModal } from '../components/modals/NewItemModals';
import { getIdleDays } from '../lib/projectUtils';
import { getBoardRules } from '../lib/boardRules';
import { getActiveProjectsProgress } from '../lib/selectors';

const TABS: { id: 'all' | ProjectStatus; label: string }[] = [
  { id: 'ativo', label: 'Ativos' }, { id: 'pausado', label: 'Pausados' },
  { id: 'concluido', label: 'Concluídos' }, { id: 'cancelado', label: 'Cancelados' }, { id: 'all', label: 'Todos' }
];
const STATUS_LABEL: Record<ProjectStatus, string> = { ativo: 'Ativo', pausado: 'Pausado', concluido: 'Concluído', cancelado: 'Cancelado' };

export const ProjectsPage: React.FC = () => {
  const { userProfile, projects, stages, tasks, updateProject, deleteProject, navigateTo } = useApp();
  const [filter, setFilter] = useState<'all' | ProjectStatus>('ativo');
  const [modalOpen, setModalOpen] = useState(false);

  const projectsProgress = useMemo(
    () => getActiveProjectsProgress(projects, stages, tasks),
    [projects, stages, tasks]
  );

  const limit = getBoardRules(userProfile).maxActiveProjects;
  const activeCount = projects.filter((p) => p.status === 'ativo').length;
  const overLimit = activeCount > limit;
  const list = projects
    .filter((p) => filter === 'all' || p.status === filter)
    .sort((a, b) => getIdleDays(b) - getIdleDays(a));

  const btn = 'px-3.5 py-2 text-sm font-semibold rounded-lg border border-stone-300 hover:bg-stone-100 cursor-pointer transition-colors';

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl">Projetos</h1>
          <p className="text-stone-600 mt-1">Cada projeto precisa de um resultado claro e de uma próxima ação física.</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-brand-primary bg-brand-signal hover:bg-brand-accent-hover rounded-xl cursor-pointer shrink-0">
          <Plus className="w-4 h-4" /> Novo projeto
        </button>
      </div>

      {/* Limite de foco */}
      <div className={`rounded-2xl p-5 border ${overLimit ? 'bg-amber-50 border-amber-200' : 'bg-white border-stone-200'}`}>
        <div className="flex items-center justify-between gap-4">
          <div className="font-bold text-lg tabular-nums">{activeCount} de {limit} projetos ativos</div>
          <div className="flex gap-1.5" aria-hidden="true">
            {Array.from({ length: Math.max(limit, activeCount) }, (_, i) => (
              <span key={i} className={`w-8 h-2 rounded-full ${i < activeCount ? (i >= limit ? 'bg-amber-500' : 'bg-brand-primary') : 'bg-stone-200'}`} />
            ))}
          </div>
        </div>
        <p className="text-sm text-stone-600 mt-2">
          {overLimit
            ? `Você tem ${activeCount - limit} projeto${activeCount - limit > 1 ? 's' : ''} acima do limite. Pause o que não é para agora e o foco volta.`
            : 'Poucos projetos ativos aumentam a chance de terminar cada um.'}
        </p>
      </div>

      <div role="tablist" aria-label="Filtrar projetos" className="inline-flex flex-wrap p-1 bg-stone-100 rounded-xl">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={filter === t.id} onClick={() => setFilter(t.id)}
            className={`px-3.5 py-1.5 text-sm rounded-lg cursor-pointer transition-colors ${filter === t.id ? 'bg-white text-stone-950 font-semibold shadow-sm' : 'text-stone-600 hover:text-stone-950'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="p-10 text-center bg-white border border-stone-200 rounded-2xl space-y-3">
          <FolderKanban className="w-8 h-8 text-stone-400 mx-auto" />
          <h2 className="text-lg">{filter === 'ativo' ? 'Nenhum projeto ativo' : 'Nada por aqui'}</h2>
          <p className="text-stone-600 max-w-sm mx-auto">Defina o resultado que você quer e a primeira ação física para começar.</p>
          <button onClick={() => setModalOpen(true)} className="px-5 py-3 text-sm font-bold text-brand-primary bg-brand-signal rounded-xl cursor-pointer">Criar projeto</button>
        </div>
      ) : (
        <ul className="grid md:grid-cols-2 gap-4">
          {list.map((p) => {
            const idleDays = getIdleDays(p);
            const stalled = p.status === 'ativo' && idleDays >= 7;
            const openTasks = tasks.filter((t) => t.projectId === p.id && t.status !== 'concluida' && t.status !== 'arquivada').length;
            const prog = projectsProgress[p.id];
            const currentStageTitle = prog?.currentStage?.title;
            const stageLabel = currentStageTitle
              ? `Etapa ${prog.stageNumber}/${prog.totalStages} · ${currentStageTitle}`
              : prog?.totalStages && prog.totalStages > 0
              ? `${prog.totalStages} etapas`
              : null;

            return (
              <li key={p.id} className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">{STATUS_LABEL[p.status]}</span>
                    {stalled && <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium tabular-nums">{idleDays} dias sem mover</span>}
                    <span className="text-stone-500">Prioridade {p.priority.toLowerCase()}</span>
                  </div>
                  <h2 className="text-xl leading-tight font-bold">
                    <button
                      onClick={() => navigateTo(`/app/projetos/${p.id}`)}
                      className="text-left text-stone-900 hover:text-brand-signal transition-colors cursor-pointer"
                    >
                      {p.name}
                    </button>
                  </h2>
                  <p className="text-stone-600 leading-relaxed">
                    <span className="font-semibold text-stone-800">Resultado: </span>
                    {p.desiredOutcome}
                  </p>

                  {/* Stage and thin progress bar under outcome */}
                  <div className="pt-1 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span>{stageLabel || 'Sem etapas definidas'}</span>
                      {prog && prog.totalCardsCount > 0 && (
                        <span className="tabular-nums font-medium">
                          {prog.doneCardsCount} de {prog.totalCardsCount} cartões ({prog.progressPercent}%)
                        </span>
                      )}
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden" aria-hidden="true">
                      <div
                        className="h-full bg-brand-primary transition-all duration-300"
                        style={{ width: `${prog?.progressPercent ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-stone-50 border-l-4 border-brand-signal p-4">
                  <div className="text-sm text-stone-500 mb-0.5">Próxima ação física</div>
                  <div className="font-semibold text-stone-900 leading-snug">{p.nextAction}</div>
                </div>

                <div className="flex items-center justify-between text-sm text-stone-500 mt-auto">
                  <button
                    onClick={() => navigateTo(`/app/projetos/${p.id}`)}
                    className="font-semibold text-orange-700 hover:underline cursor-pointer tabular-nums"
                  >
                    {openTasks} {openTasks === 1 ? 'tarefa aberta' : 'tarefas abertas'}
                  </button>
                  {p.deadline && <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {p.deadline}</span>}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200">
                  <button
                    className="px-4 py-2 text-sm font-bold rounded-xl bg-brand-signal text-brand-primary hover:bg-brand-accent-hover cursor-pointer transition-colors shadow-2xs inline-flex items-center gap-1.5"
                    onClick={() => navigateTo(`/app/projetos/${p.id}`)}
                  >
                    <span>Abrir mesa</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  {p.status === 'ativo' && <button className={btn} onClick={() => updateProject(p.id, { status: 'pausado' })}>Pausar</button>}
                  {p.status === 'pausado' && <button className={btn} onClick={() => updateProject(p.id, { status: 'ativo' })}>Reativar</button>}
                  {(p.status === 'ativo' || p.status === 'pausado') && (
                    <button className={`${btn} text-emerald-700`} onClick={() => updateProject(p.id, { status: 'concluido' })}>Concluir</button>
                  )}
                  <button className="ml-auto px-3 py-2 text-sm text-stone-500 hover:text-rose-600 cursor-pointer"
                    onClick={() => { if (window.confirm(`Excluir o projeto "${p.name}"?`)) deleteProject(p.id); }}>Excluir</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <NewProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};
