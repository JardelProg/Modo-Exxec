import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X } from 'lucide-react';

interface Props { open: boolean; onClose: () => void; }

export const GlobalSearch: React.FC<Props> = ({ open, onClose }) => {
  const { tasks, stages, projects, decisions, conversations, processes, missions, navigateTo } = useApp();
  const [q, setQ] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { if (open) { setQ(''); setTimeout(() => ref.current?.focus(), 30); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open, onClose]);

  const index = useMemo(() => [
    ...tasks.filter((t) => t.status !== 'arquivada').map((t) => {
      const stage = t.stageId ? stages.find((s) => s.id === t.stageId) : undefined;
      const targetProjectId = t.projectId || stage?.projectId;
      return {
        group: 'Cartões da Mesa',
        label: t.title,
        route: targetProjectId ? `/app/projetos/${targetProjectId}?cartao=${t.id}` : '/app/tarefas'
      };
    }),
    ...stages.map((s) => ({
      group: 'Etapas',
      label: s.title,
      route: `/app/projetos/${s.projectId}`
    })),
    ...projects.map((p) => ({ group: 'Projetos', label: p.name, route: `/app/projetos/${p.id}` })),
    ...decisions.map((d) => ({ group: 'Decisões', label: d.title, route: '/app/decisoes' })),
    ...conversations.map((c) => ({ group: 'Conversas', label: c.title, route: '/app/conversas' })),
    ...processes.map((p) => ({ group: 'Processos', label: p.title, route: '/app/processos' })),
    ...missions.map((m) => ({ group: 'Missões', label: `Dia ${m.day}: ${m.title}`, route: `/app/missao/${m.id}` })),
    { group: 'Materiais', label: 'Biblioteca e e-book', route: '/biblioteca' }
  ], [tasks, stages, projects, decisions, conversations, processes, missions]);

  const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const results = q.trim() ? index.filter((i) => norm(i.label).includes(norm(q))).slice(0, 8) : [];

  if (!open) return null;
  const go = (r: string) => { onClose(); navigateTo(r); };

  return (
    <div className="fixed inset-0 z-[60] bg-stone-950/60 flex items-start justify-center p-4 pt-[12vh]" onClick={onClose} role="dialog" aria-label="Busca global">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 border-b border-stone-200">
          <Search className="w-4 h-4 text-stone-400" />
          <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar tarefas, projetos ou materiais"
            className="flex-1 py-4 text-base outline-none bg-transparent" />
          <button onClick={onClose} aria-label="Fechar busca" className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.map((r, i) => (
            <button key={i} onClick={() => go(r.route)} className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-stone-50 cursor-pointer">
              <span className="text-sm text-stone-900 line-clamp-1">{r.label}</span>
              <span className="text-xs text-stone-500 shrink-0">{r.group}</span>
            </button>
          ))}
          {q.trim() && results.length === 0 && <p className="px-4 py-6 text-sm text-stone-500">Nada encontrado para "{q}". Tente uma palavra mais curta.</p>}
          {!q.trim() && <p className="px-4 py-6 text-sm text-stone-500">Digite para encontrar tarefas, projetos, decisões, conversas, processos e missões.</p>}
        </div>
      </div>
    </div>
  );
};
