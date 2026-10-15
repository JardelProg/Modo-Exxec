import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  CheckCircle2,
  Scale,
  CheckSquare,
  Menu,
  X,
  CalendarCheck2,
  FolderKanban,
  MessageSquareWarning,
  Workflow,
  Sparkles,
  LifeBuoy,
  BookOpen,
  Settings,
  ArrowRight,
  StickyNote
} from 'lucide-react';

interface MobileBottomBarProps {
  onOpenPostIt?: () => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ onOpenPostIt }) => {
  const { currentRoute, navigateTo, activeTodayMission, userProfile } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const cleanPath = currentRoute.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  const isApp = cleanPath.startsWith('/app');
  if (!isApp) return null;

  const quickNav = [
    { label: 'Hoje', route: '/app', icon: Compass, active: cleanPath === '/app' },
    { label: 'Tarefas', route: '/app/tarefas', icon: CheckSquare, active: cleanPath === '/app/tarefas' },
    { label: 'Decisões', route: '/app/decisoes', icon: Scale, active: cleanPath === '/app/decisoes' }
  ];

  const drawerItems = [
    { label: 'Programa 30 Dias', route: '/app/programa', icon: CalendarCheck2 },
    { label: 'Projetos Ativos', route: '/app/projetos', icon: FolderKanban },
    { label: 'Conversas Difíceis', route: '/app/conversas', icon: MessageSquareWarning },
    { label: 'Processos & Delegação', route: '/app/processos', icon: Workflow },
    { label: 'Revisão Semanal', route: '/app/revisao', icon: Sparkles },
    { label: 'Modo Recuperação', route: '/app/recuperacao', icon: LifeBuoy, highlight: true },
    {
      label: 'Post-it (Notas Rápidas)',
      icon: StickyNote,
      postItAction: true
    },
    { label: 'Biblioteca & E-book', route: '/biblioteca', icon: BookOpen },
    { label: 'Configurações', route: '/configuracoes', icon: Settings }
  ];

  return (
    <>
      {/* Fixed Bottom Dock for Mobile */}
      <nav
        aria-label="Navegação rápida mobile"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-2 py-1"
      >
        <div className="grid grid-cols-4 items-center h-14 max-w-md mx-auto">
          {quickNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => {
                  setDrawerOpen(false);
                  navigateTo(item.route);
                }}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
                  item.active ? 'text-orange-700' : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${item.active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                  {item.active && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-accent" />
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 tracking-tight ${
                    item.active ? 'font-bold text-stone-950' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* More button triggering high-ticket bottom sheet */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
              drawerOpen ? 'text-orange-700' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <div className="relative">
              {drawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[1.8]" />}
            </div>
            <span className="text-[10px] font-medium mt-0.5 tracking-tight">Mais</span>
          </button>
        </div>
      </nav>

      {/* High-Ticket Slide-Up Bottom Drawer Sheet */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-stone-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full bg-white rounded-t-3xl max-h-[82vh] overflow-y-auto p-5 pb-20 shadow-2xl border-t border-stone-200 animate-in slide-in-from-bottom duration-250"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab Handle */}
            <div className="w-12 h-1.5 bg-stone-300 rounded-full mx-auto mb-4" />

            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-orange-700 font-bold">
                  Central Executiva
                </span>
                <h3 className="text-base font-serif font-bold text-stone-950">
                  {userProfile.business}
                </h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 min-h-[36px] min-w-[36px] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of secondary modules */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.route;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      setDrawerOpen(false);
                      if (item.postItAction) {
                        onOpenPostIt?.();
                      } else if (item.route) {
                        navigateTo(item.route);
                      }
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-stone-900 bg-stone-900 text-white font-semibold'
                        : item.postItAction
                        ? 'border-yellow-300 bg-yellow-50 text-yellow-950 hover:bg-yellow-100'
                        : item.highlight
                        ? 'border-amber-200 bg-amber-50/70 text-amber-950 hover:bg-amber-100'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/60 text-stone-800'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.postItAction ? 'text-yellow-700' : item.highlight ? 'text-amber-700' : 'text-orange-700'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Mode & SOS Callout in drawer */}
            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <span>Modo Atual: <strong className="text-stone-900">{userProfile.currentMode}</strong></span>
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  navigateTo('/app/recuperacao');
                }}
                className="text-orange-700 font-semibold hover:underline"
              >
                Abrir Recuperação
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
