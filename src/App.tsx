/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AppNavigation } from './components/common/AppNavigation';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { ToastContainer } from './components/common/ToastContainer';
import { SmoothCursor } from './components/common/SmoothCursor';
import { SiteWallpaper } from './components/common/SiteWallpaper';
import { MacOsDock } from './components/common/MacOsDock';
import { PostItNote } from './components/common/PostItNote';
import { parseRoute } from './lib/router';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DiagnosticPage } from './pages/DiagnosticPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProgramPage } from './pages/ProgramPage';
import { MissionDetailPage } from './pages/MissionDetailPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { MesaPage } from './pages/MesaPage';
import { TasksPage } from './pages/TasksPage';
import { DecisionsPage } from './pages/DecisionsPage';
import { ConversationsPage } from './pages/ConversationsPage';
import { ProcessesPage } from './pages/ProcessesPage';
import { WeeklyReviewPage } from './pages/WeeklyReviewPage';
import { RecoveryPage } from './pages/RecoveryPage';
import { LibraryPage } from './pages/LibraryPage';
import { SettingsPage } from './pages/SettingsPage';

const AppRouter: React.FC = () => {
  const { currentRoute, activeTodayMission, wallpaper } = useApp();
  const [postItOpen, setPostItOpen] = useState(false);

  const renderContent = () => {
    const { name, params } = parseRoute(currentRoute);

    switch (name) {
      case 'landing':
        return <LandingPage />;

      case 'diagnostico':
        return <DiagnosticPage />;

      case 'onboarding':
        return <OnboardingPage />;

      case 'biblioteca':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LibraryPage />
          </div>
        );

      case 'configuracoes':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <SettingsPage />
          </div>
        );

      case 'missao': {
        const parsedId = params.id ? parseInt(params.id, 10) : NaN;
        const missionId = isNaN(parsedId) ? activeTodayMission.id : parsedId;

        return (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            <AppNavigation />
            <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
              <MissionDetailPage missionId={missionId} />
            </main>
          </div>
        );
      }

      case 'app-home':
      case 'programa':
      case 'projetos':
      case 'projeto-mesa':
      case 'tarefas':
      case 'decisoes':
      case 'conversas':
      case 'processos':
      case 'revisao':
      case 'recuperacao': {
        let subView: React.ReactNode;

        switch (name) {
          case 'programa':
            subView = <ProgramPage />;
            break;
          case 'projetos':
            subView = <ProjectsPage />;
            break;
          case 'projeto-mesa':
            subView = <MesaPage projectId={params.projectId} />;
            break;
          case 'tarefas':
            subView = <TasksPage />;
            break;
          case 'decisoes':
            subView = <DecisionsPage />;
            break;
          case 'conversas':
            subView = <ConversationsPage />;
            break;
          case 'processos':
            subView = <ProcessesPage />;
            break;
          case 'revisao':
            subView = <WeeklyReviewPage />;
            break;
          case 'recuperacao':
            subView = <RecoveryPage />;
            break;
          case 'app-home':
          default:
            subView = <DashboardPage />;
            break;
        }

        return (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
            <AppNavigation />
            <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 lg:pb-8">
              {subView}
            </main>
          </div>
        );
      }

      case 'not-found':
      default:
        return <LandingPage />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col relative transition-colors duration-300 ${
        wallpaper.enabled ? 'bg-[#080a14] text-brand-primary' : 'bg-brand-surface text-brand-primary'
      }`}
    >
      <SiteWallpaper />
      <SmoothCursor />
      <Header />
      <div className="flex-1 pt-14 sm:pt-20 pb-24 sm:pb-28 relative z-10">
        {renderContent()}
      </div>
      <Footer />
      <MacOsDock onOpenPostIt={() => setPostItOpen((prev: boolean) => !prev)} />
      <PostItNote isOpen={postItOpen} onClose={() => setPostItOpen(false)} />
      <MobileBottomBar onOpenPostIt={() => setPostItOpen(true)} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
