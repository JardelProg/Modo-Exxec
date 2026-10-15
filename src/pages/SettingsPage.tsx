import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASSETS } from '../assets/images';
import { ExecutionMode } from '../types';
import {
  Settings,
  User,
  Shield,
  RotateCcw,
  Sparkles,
  Download,
  Upload,
  CheckCircle2,
  Trash2,
  Lock,
  Image as ImageIcon
} from 'lucide-react';
import { WallpaperModal } from '../components/modals/WallpaperModal';

export const SettingsPage: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    resetToDemoData,
    resetToCleanUser,
    showToast,
    missions,
    projects,
    tasks,
    decisions,
    wallpaper
  } = useApp();

  const [wallpaperModalOpen, setWallpaperModalOpen] = useState(false);

  const [name, setName] = useState(userProfile.name);
  const [business, setBusiness] = useState(userProfile.business);
  const [teamSize, setTeamSize] = useState(userProfile.teamSize);
  const [currentMode, setCurrentMode] = useState<ExecutionMode>(userProfile.currentMode);
  const [dailyMinutes, setDailyMinutes] = useState(userProfile.dailyMinutes);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      business,
      teamSize,
      currentMode,
      dailyMinutes
    });
  };

  const handleExportData = () => {
    const backup = {
      profile: userProfile,
      missions,
      projects,
      tasks,
      decisions,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `modo_execucao_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup Exportado', 'Seus dados foram salvos com segurança em arquivo JSON.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#EA580C] uppercase tracking-wide">
            <span>Preferências</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 font-mono">Conta & Privacidade</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 mt-1">
            Configurações da Central
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Personalize seu perfil operacional, controle a persistência local e alterne o modo de demonstração.
          </p>
        </div>
      </div>

      {/* Demo State Banner */}
      <div className="p-5 rounded-xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={ASSETS.avatarRafael}
            alt="Avatar do usuário Rafael"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-stone-300 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-900">{userProfile.name}</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-500 font-mono">
                {userProfile.isDemo ? 'Perfil Demo Ativo' : 'Conta Pessoal Ativa'}
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">{userProfile.business}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {userProfile.isDemo ? (
            <button
              onClick={resetToCleanUser}
              className="px-3.5 py-2 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Criar Minha Própria Conta
            </button>
          ) : (
            <button
              onClick={resetToDemoData}
              className="px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              Restaurar Dados Demo (Rafael)
            </button>
          )}
        </div>
      </div>

      {/* Form: Profile Information */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 space-y-6 shadow-xs">
        <div className="pb-3 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">
            Perfil Operacional
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Atualize os dados que alimentam os roteiros e as sugestões de processo.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome do Empreendedor
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome / Área da Empresa
              </label>
              <input
                type="text"
                required
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Tamanho da Equipe
              </label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white"
              >
                <option value="1 pessoa">Apenas eu</option>
                <option value="2 pessoas">2 pessoas</option>
                <option value="3 a 5 pessoas">3 a 5 pessoas</option>
                <option value="6 a 15 pessoas">6 a 15 pessoas</option>
                <option value="Mais de 15 pessoas">Mais de 15 pessoas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Disponibilidade Diária de Foco
              </label>
              <select
                value={dailyMinutes}
                onChange={(e) => setDailyMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg bg-white tabular-nums"
              >
                <option value={10}>10 minutos/dia (Modo Reduzido)</option>
                <option value={15}>15 minutos/dia</option>
                <option value={20}>20 minutos/dia (Padrão)</option>
                <option value={30}>30 minutos/dia</option>
                <option value={45}>45 minutos/dia (Aceleração)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Modo Operacional Ativo
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'Normal', label: 'Normal', note: 'Ritmo padrão' },
                { id: 'Reduzido', label: 'Reduzido', note: 'Dias corridos' },
                { id: 'Recuperação', label: 'Recuperação', note: 'Sem pressão' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setCurrentMode(m.id as ExecutionMode)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    currentMode === m.id
                      ? 'border-[#EA580C] bg-orange-50/40 ring-1 ring-[#EA580C]'
                      : 'border-stone-200 hover:border-stone-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-900">{m.label}</div>
                  <div className="text-[10px] text-stone-500 mt-0.5">{m.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-stone-100">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#EA580C] hover:bg-[#C2410C] rounded-lg transition-colors cursor-pointer"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
      </div>

      {/* Wallpaper & Atmosphere Card */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#EA580C]" />
              <span>Papel de Parede & Atmosfera Visual</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Escolha uma imagem de fundo para o sistema, configure o nível de desfoque e a opacidade desejada.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setWallpaperModalOpen(true)}
            className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-stone-800 rounded-xl transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            Personalizar Papel de Parede
          </button>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs">
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${wallpaper.enabled ? 'bg-emerald-500' : 'bg-stone-300'}`} />
            <span className="font-semibold text-stone-800">
              {wallpaper.enabled ? `Ativo: ${wallpaper.presetName}` : 'Desativado (Fundo neutro limpo)'}
            </span>
          </div>
          {wallpaper.enabled && (
            <div className="flex items-center gap-3 text-stone-500 font-mono text-[11px]">
              <span>Opacidade: {Math.round(wallpaper.opacity * 100)}%</span>
              <span>·</span>
              <span>Desfoque: {wallpaper.blur}px</span>
            </div>
          )}
        </div>
      </div>

      {/* Privacy, Storage & Export */}
      <div className="bg-white p-6 sm:p-7 rounded-2xl border border-stone-200 space-y-6 shadow-xs">
        <div className="pb-3 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">
            Privacidade & Persistência Local
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Seus dados são salvos com segurança no seu próprio navegador via armazenamento local de alto desempenho.
          </p>
        </div>

        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-start gap-3">
            <Lock className="w-4 h-4 text-stone-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-stone-600">
              <strong className="text-stone-900">Privacidade Absoluta: </strong>
              Nenhum dado das suas tarefas, finanças ou decisões pendentes é enviado para servidores de publicidade ou terceiros.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <div>
              <div className="font-semibold text-stone-900">Backup em Arquivo JSON</div>
              <div className="text-stone-500">Exporte todas as suas missões e evidências salvas.</div>
            </div>

            <button
              onClick={handleExportData}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Meus Dados</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-stone-100">
            <div>
              <div className="font-semibold text-rose-900">Limpar Tudo e Recomeçar</div>
              <div className="text-stone-500">Zere todas as tarefas e missões e volte ao primeiro dia.</div>
            </div>

            <button
              onClick={resetToCleanUser}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Zerar Dados</span>
            </button>
          </div>
        </div>
      </div>

      <WallpaperModal
        isOpen={wallpaperModalOpen}
        onClose={() => setWallpaperModalOpen(false)}
      />
    </div>
  );
};
