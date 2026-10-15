import React, { useState, useRef, useEffect } from 'react';
import { Project, Stage, Task, ProjectStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Calendar, MoreVertical, Pause, Play, CheckCircle2, Edit3, Trash2, Lightbulb } from 'lucide-react';
import { EditProjectModal } from './EditProjectModal';

interface ProjectHeaderProps {
  project: Project;
  stages: Stage[];
  tasks: Task[];
  onOpenIdeaParking?: () => void;
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  ativo: 'Ativo',
  pausado: 'Pausado',
  concluido: 'Concluído',
  cancelado: 'Cancelado'
};

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  stages,
  tasks,
  onOpenIdeaParking
}) => {
  const { updateProject, deleteProject, navigateTo, ideas } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeIdeasCount = ideas.filter(
    (i) => i.projectId === project.id && !i.promotedTaskId && !i.discardedAt
  ).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentStage = stages.find((s) => s.status === 'atual');
  const currentStageIndex = currentStage ? stages.findIndex((s) => s.id === currentStage.id) : -1;

  const stageProgressText =
    stages.length === 0
      ? 'Sem etapas cadastradas'
      : currentStageIndex >= 0
      ? `Etapa ${currentStageIndex + 1} de ${stages.length}`
      : stages.every((s) => s.status === 'concluida')
      ? `Todas as ${stages.length} etapas concluídas`
      : `0 de ${stages.length} etapas ativas`;

  const projectTasks = tasks.filter(
    (t) => t.projectId === project.id && t.status !== 'arquivada'
  );
  const completedTasks = projectTasks.filter((t) => t.status === 'concluida');

  const blockedTasksInCurrentStage = currentStage
    ? tasks.filter((t) => t.stageId === currentStage.id && t.status === 'bloqueada').length
    : 0;

  const cardProgressText = `${completedTasks.length} de ${projectTasks.length} ${
    projectTasks.length === 1 ? 'cartão concluído' : 'cartões concluídos'
  }`;

  const handleTogglePause = () => {
    setMenuOpen(false);
    if (project.status === 'ativo') {
      updateProject(project.id, { status: 'pausado' });
    } else {
      updateProject(project.id, { status: 'ativo' });
    }
  };

  const handleCompleteProject = () => {
    setMenuOpen(false);
    updateProject(project.id, { status: 'concluido' });
  };

  const handleDeleteProject = () => {
    setMenuOpen(false);
    if (window.confirm(`Tem certeza que deseja excluir o projeto "${project.name}"?`)) {
      deleteProject(project.id);
      navigateTo('/app/projetos');
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-4">
      {/* Back button link */}
      <div>
        <button
          onClick={() => navigateTo('/app/projetos')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Projetos</span>
        </button>
      </div>

      {/* Main header row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Status Chip */}
            <span
              className={`px-2.5 py-0.5 rounded-full font-medium ${
                project.status === 'ativo'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : project.status === 'pausado'
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : project.status === 'concluido'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {STATUS_LABEL[project.status]}
            </span>

            {/* Priority Chip */}
            <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 font-medium">
              Prioridade {project.priority.toLowerCase()}
            </span>

            {/* Deadline (plain text, never red) */}
            {project.deadline && (
              <span className="inline-flex items-center gap-1 text-stone-600 font-normal">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Prazo: {project.deadline}</span>
              </span>
            )}

            {/* Ideas Parking Counter Badge */}
            <button
              type="button"
              onClick={onOpenIdeaParking}
              title="Abrir Estacionamento de Ideias"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>
                {activeIdeasCount} {activeIdeasCount === 1 ? 'ideia estacionada' : 'ideias estacionadas'}
              </span>
            </button>

            {/* Blocked cards in current stage chip (neutral color) */}
            {blockedTasksInCurrentStage > 0 && (
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('column-bloqueada');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  }
                }}
                title="Rolar até os cartões travados da etapa atual"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <span>Travados: {blockedTasksInCurrentStage}</span>
              </button>
            )}
          </div>

          {/* Project name as single h1 */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 tracking-tight leading-tight">
            {project.name}
          </h1>

          {/* Desired outcome */}
          <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
            <span className="font-semibold text-stone-900">Resultado: </span>
            {project.desiredOutcome}
          </p>

          {/* Progress summary */}
          <div className="pt-1 text-xs sm:text-sm font-semibold text-stone-500 tabular-nums">
            {stageProgressText} · {cardProgressText}
          </div>
        </div>

        {/* Action button & Kebab Menu */}
        <div className="flex items-center gap-2 self-start shrink-0 relative" ref={menuRef}>
          <button
            onClick={() => setEditModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg cursor-pointer transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Opções do projeto"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg cursor-pointer transition-colors"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Kebab dropdown */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-stone-200 rounded-xl shadow-lg py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setEditModalOpen(true);
                }}
                className="w-full px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2 text-left cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-400" />
                <span>Editar projeto</span>
              </button>

              <button
                onClick={handleTogglePause}
                className="w-full px-3.5 py-2 text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2 text-left cursor-pointer"
              >
                {project.status === 'ativo' ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pausar projeto</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Reativar projeto</span>
                  </>
                )}
              </button>

              {project.status !== 'concluido' && (
                <button
                  onClick={handleCompleteProject}
                  className="w-full px-3.5 py-2 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 text-left cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Concluir projeto</span>
                </button>
              )}

              <div className="my-1 border-t border-stone-100" />

              <button
                onClick={handleDeleteProject}
                className="w-full px-3.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2 text-left cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Excluir projeto</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <EditProjectModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        project={project}
      />
    </div>
  );
};
