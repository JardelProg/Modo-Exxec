import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EBOOK_CHAPTERS } from '../data/seedData';
import { ASSETS } from '../assets/images';
import {
  BookOpen,
  Headphones,
  FileText,
  Download,
  ArrowRight,
  Play,
  Pause,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const { navigateTo, showToast } = useApp();
  const [playingChapterId, setPlayingChapterId] = useState<number | null>(null);

  const togglePlayAudio = (chapterId: number) => {
    if (playingChapterId === chapterId) {
      setPlayingChapterId(null);
    } else {
      setPlayingChapterId(chapterId);
      showToast('Áudio Executivo', 'Reproduzindo resumo em áudio do capítulo selecionado.', 'info');
    }
  };

  const handleDownload = (filename: string) => {
    showToast('Download Iniciado', `O material "${filename}" foi preparado e baixado.`, 'success');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#EA580C] uppercase tracking-wide">
            <span>Acervo de Apoio</span>
            <span aria-hidden="true">·</span>
            <span className="text-stone-500 font-mono">30 Capítulos · Templates · Áudios</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-950 mt-1">
            Biblioteca & E-book Interativo
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Cada capítulo do livro se conecta a uma missão no aplicativo para transformar conhecimento em tração real.
          </p>
        </div>
      </div>

      {/* Book Spotlight Banner */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col md:flex-row gap-6 items-center">
        <div className="w-36 shrink-0 rounded-xl overflow-hidden shadow-md border border-stone-300">
          <img
            src={ASSETS.ebookCover}
            alt="Capa do E-book MODO EXECUÇÃO"
            referrerPolicy="no-referrer"
            className="w-full h-auto object-cover"
          />
        </div>

        <div className="space-y-3 flex-1">
          <span className="text-xs font-bold text-[#EA580C] uppercase tracking-wider">
            Publicação Oficial
          </span>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-950">
            MODO EXECUÇÃO: O Sistema de 30 Dias para Vencer a Procrastinação
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Um guia denso, sem jargões motivacionais, que aborda as razões psicológicas, neurológicas e operacionais do adiamento. Cada lição termina com uma missão direta.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => handleDownload('Modo_Execucao_Ebook_Completo.pdf')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar E-book em PDF</span>
            </button>
            <button
              onClick={() => navigateTo('/app/programa')}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
            >
              <span>Ver todas as 30 missões</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* E-book Chapters Grid */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
          Capítulos em Destaque & Áudios Executivos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {EBOOK_CHAPTERS.map((chap) => {
            const isPlaying = playingChapterId === chap.id;

            return (
              <div
                key={chap.id}
                className="p-5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all space-y-4 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-100">
                  <span className="font-mono font-bold text-[#EA580C]">
                    CAPÍTULO {chap.id.toString().padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{chap.readingTimeMin} min de leitura</span>
                    <span aria-hidden="true">·</span>
                    <button
                      onClick={() => togglePlayAudio(chap.id)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                        isPlaying
                          ? 'bg-amber-100 text-amber-900 font-semibold'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-3 h-3 text-amber-700 animate-pulse" />
                          <span>Pausar Áudio</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-stone-500" />
                          <span>Ouvir ({chap.audioDurationMin} min)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-base font-bold text-stone-950 leading-snug">
                    {chap.title}
                  </h4>
                  <p className="text-xs text-stone-600 italic">
                    {chap.quote}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs text-stone-700 space-y-1">
                  <span className="font-bold text-stone-900 text-[11px] uppercase">
                    Lição Central:
                  </span>
                  <p className="leading-relaxed">{chap.coreLesson}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-stone-500 uppercase">
                    Tópicos de Reflexão:
                  </span>
                  <ul className="space-y-1 text-xs text-stone-600">
                    {chap.summaryBulletPoints.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-[#EA580C] font-bold">·</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => navigateTo(`/app/missao/${chap.day}`)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#EA580C] hover:underline cursor-pointer"
                  >
                    <span>Executar Missão Prática #{chap.day}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Templates & Worksheets */}
      <div className="space-y-4 pt-4 border-t border-stone-200">
        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wide">
          Templates & Guias Operacionais Prontos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              title: 'Checklist do Padrão Mínimo Operacional',
              type: 'PDF · 2 Páginas',
              desc: 'Critérios objetivos para aprovar rascunhos sem perder dias em revisões infinitas.',
              file: 'Checklist_Padrao_Minimo.pdf'
            },
            {
              title: 'Planilha de Custo de Inércia',
              type: 'XLSX · 1 Planilha',
              desc: 'Calculadora simples para mensurar quanto custa adiar decisões e ferramentas sem uso.',
              file: 'Calculadora_Custo_Inercia.xlsx'
            },
            {
              title: 'Roteiros de Cobrança Sem Pedir Desculpas',
              type: 'DOCX · 4 Roteiros',
              desc: 'Modelos de e-mail e WhatsApp para reaver notas atrasadas com elegância e firmeza.',
              file: 'Roteiros_Cobranca_Empresarial.docx'
            },
            {
              title: 'Matriz de Decisão Reversível em 24h',
              type: 'PDF · 1 Página',
              desc: 'Fluxograma de 4 etapas para classificar o risco de escolhas e fechar posições.',
              file: 'Matriz_Decisao_Reversivel.pdf'
            },
            {
              title: 'Ficha Padrão de Delegação de Tarefas',
              type: 'DOCX · 1 Página',
              desc: 'Gatilho, contexto, critérios mínimos e ponto de retorno combinado com a equipe.',
              file: 'Ficha_Padrao_Delegacao.docx'
            },
            {
              title: 'Protocolo de Revisão de Sexta-Feira',
              type: 'PDF · 2 Páginas',
              desc: 'As 8 perguntas essenciais para zerar pendências e proteger o descanso de fim de semana.',
              file: 'Protocolo_Revisao_Sexta.pdf'
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-stone-200 hover:border-stone-300 transition-all space-y-2 text-xs shadow-xs"
            >
              <div className="flex items-center justify-between text-stone-400 font-mono text-[10px]">
                <span className="flex items-center gap-1 text-stone-600 font-semibold">
                  <FileText className="w-3.5 h-3.5 text-[#EA580C]" />
                  <span>{item.type}</span>
                </span>
              </div>
              <h4 className="font-bold text-stone-900 leading-snug">
                {item.title}
              </h4>
              <p className="text-stone-500 leading-relaxed">
                {item.desc}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleDownload(item.file)}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-800 font-medium transition-colors cursor-pointer"
                >
                  <Download className="w-3 h-3 text-stone-500" />
                  <span>Baixar Arquivo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
