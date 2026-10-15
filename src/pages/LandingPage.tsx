import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ASSETS } from '../assets/images';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Compass,
  Footprints,
  FileCheck,
  HelpCircle,
  LifeBuoy,
  ChevronDown,
  Scale,
  MessageSquareWarning,
  Workflow
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'O MODO EXECUÇÃO é mais um aplicativo de tarefas ou planner?',
      a: 'Não. Planners e listas comuns acumulam desejos passivos e geram culpa quando o dia não cabe na lista. O MODO EXECUÇÃO é um protocolo guiado de desobstrução: cada dia traz um capítulo editorial, uma única próxima ação física observável e a exigência de uma evidência concreta para fechamento.'
    },
    {
      q: 'Quanto tempo diário preciso dedicar?',
      a: 'Entre 10 e 25 minutos por dia. Se o seu dia estiver caótico, você pode ativar o Modo Reduzido (ações de 3 a 5 minutos) ou o Modo Recuperação (limpeza de sobrecarga sem culpa).'
    },
    {
      q: 'Como funciona o acompanhamento com o e-book?',
      a: 'O livro digital de 30 capítulos contextualiza a raiz neurológica e operacional do adiamento em cada fase (preparação, rascunho, vendas, conversas difíceis, delegação). Ao final de cada leitura curta de 7 minutos, você clica no link e cai direto na missão prática correspondente dentro do app.'
    },
    {
      q: 'E se eu travar e não conseguir fazer a missão do dia?',
      a: 'Você clica no botão "Não consegui". Em vez de receber alertas vermelhos punitivos ou perder "ofensivas", o sistema pergunta a causa real do bloqueio (falta de tempo, clareza, cansaço, medo) e entrega na hora uma versão reduzida compatível com o seu momento.'
    },
    {
      q: 'Substitui acompanhamento psicológico ou consultoria especializada?',
      a: 'Não. O MODO EXECUÇÃO é uma ferramenta estritamente educacional e gerencial de organização e execução. Não diagnostica nem trata TDAH, depressão ou ansiedade clínica, nem substitui advogados ou contadores para assuntos regulatórios.'
    }
  ];

  return (
    <div className="min-h-screen bg-brand-surface text-brand-primary">
      {/* Hero */}
      <section className="relative bg-brand-accent text-white overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-70" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 lg:pt-24 lg:pb-24">
          <h1 className="text-[2.6rem] sm:text-6xl lg:text-[5.6rem] max-w-5xl text-balance">
            Você sabe o que precisa fazer. Então por que continua adiando?
          </h1>

          <div className="mt-10 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-6 space-y-8">
              <p className="text-lg text-white/85 leading-relaxed max-w-xl">
                Em 30 dias, o MODO EXECUÇÃO transforma tarefas represadas, conversas temidas e decisões emperradas em uma ação por dia, com evidência de que foi feita.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={() => navigateTo('/diagnostico')}
                  className="px-6 py-4 text-sm font-bold text-brand-primary bg-brand-signal hover:bg-white rounded-[4px] transition-colors cursor-pointer">
                  Começar o diagnóstico gratuito
                </button>
                <button onClick={() => navigateTo('/app')}
                  className="px-6 py-4 text-sm font-semibold text-white border border-white/40 hover:bg-white/10 rounded-[4px] transition-colors cursor-pointer">
                  Ver a demonstração completa
                </button>
              </div>
            </div>

            {/* Missão do dia: o produto, em vez de uma foto de banco */}
            <div className="lg:col-span-6">
              <div className="bg-white text-brand-primary rounded-[8px] overflow-hidden shadow-xl">
                <div className="relative h-36 bg-brand-accent">
                  <img src={ASSETS.heroDesk} alt="Mesa de trabalho de um empreendedor com caderno de execução"
                    referrerPolicy="no-referrer" className="absolute inset-0 w-full h-full object-cover grayscale mix-blend-multiply opacity-90" />
                  <div className="absolute left-4 bottom-3 inline-flex items-center gap-2 bg-brand-signal text-brand-primary text-xs font-bold px-2.5 py-1 rounded-[3px]">
                    Dia 3 · 15 min
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="font-display text-xl font-extrabold tracking-tight leading-tight [font-stretch:112%]">
                    Abra o documento de ofertas e escreva a promessa em 3 linhas
                  </div>
                  <p className="text-sm text-stone-600">Você termina com o arquivo salvo e a promessa validada.</p>
                  <div>
                    <div className="ribbon on-light" aria-label="Dia 3 de 30">
                      {Array.from({ length: 30 }, (_, i) => <i key={i} className={i < 2 ? 'done' : i === 2 ? 'now' : ''} />)}
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-stone-500 tabular-nums">
                      <span>2 concluídos</span><span>27 pela frente</span>
                    </div>
                  </div>
                  <button onClick={() => navigateTo('/app/missao/3')} className="text-sm font-bold text-brand-accent hover:underline cursor-pointer">
                    Abrir esta missão
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Difference: Não é mais um planner */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              Diferenciação Radical
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight text-balance">
              Por que mais um aplicativo de tarefas nunca resolveu o seu problema
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              O problema da execução nunca foi a falta de um lugar para anotar o que fazer. O problema é a fricção cognitiva entre a intenção mental e o primeiro movimento físico observável.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Planner Tradicional */}
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 space-y-4">
              <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                O Ciclo do Planner Comum
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                Listas passivas que acumulam culpa
              </h3>
              <ul className="space-y-3 text-xs text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">✕</span>
                  <span>Tarefas com nomes vagos como &quot;marketing&quot;, &quot;reunião&quot; ou &quot;financeiro&quot;.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">✕</span>
                  <span>20 itens anotados em um dia; 16 passam para o dia seguinte em bola de neve.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">✕</span>
                  <span>Falta de clareza sobre o que é uma &quot;conclusão real&quot;.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stone-400 font-bold">✕</span>
                  <span>Sensação crônica de atraso e de não ter saído do lugar.</span>
                </li>
              </ul>
            </div>

            {/* MODO EXECUÇÃO */}
            <div className="p-6 rounded-xl border-2 border-stone-900 bg-white space-y-4 shadow-sm">
              <div className="text-xs font-semibold text-brand-accent uppercase tracking-wide">
                A Arquitetura do Modo Execução
              </div>
              <h3 className="text-lg font-bold text-stone-950">
                Ação física guiada com evidência real
              </h3>
              <ul className="space-y-3 text-xs text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Apenas uma ação principal dominante por tela com duração fechada.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Ação redigida com verbo mecânico inicial (abrir, redigir, enviar).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Evidência física de conclusão obrigatória para zerar o ciclo.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Protocolo de desbloqueio &quot;Não consegui&quot; sem culpa ou punição.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* The 4-Step Cycle */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              O Método Integrado
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight text-balance">
              Como funciona o ciclo: Livro → Missão → Evidência → Próxima Ação
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              O conhecimento teórico só tem valor quando gera um impacto palpável no mundo real. Nosso ciclo foi calibrado para neutralizar o impulso de procrastinar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs font-mono font-bold text-brand-accent">
                01. LEITURA EDITORIAL
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Capítulo de 7 Minutos
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Você lê uma reflexão cirúrgica sobre o padrão de adiamento do dia e entende a raiz neuropsicológica do seu travamento.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs font-mono font-bold text-brand-accent">
                02. MISSÃO PRÁTICA
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Uma Ação Física no App
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                O capítulo te entrega uma tarefa de 10 a 20 minutos com a versão mínima já planejada caso o dia esteja atípico.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs font-mono font-bold text-brand-accent">
                03. EVIDÊNCIA VISÍVEL
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Registro Concreto
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Você registra o comprovante, o texto concluído ou a confirmação enviada. A mente fecha o ciclo com sensação de progresso real.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs font-mono font-bold text-brand-accent">
                04. PRÓXIMA AÇÃO
              </div>
              <h3 className="text-sm font-bold text-stone-900">
                Transição Sem Fricção
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                O sistema já alinha o próximo passo viável para o dia seguinte, sem acumular listas assustadoras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Execution Modes */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              Flexibilidade Adulta
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight text-balance">
              Três modos operacionais para a realidade da sua empresa
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              A vida empresarial não é uma linha reta. Quando a rotina apertar, alterne o modo do sistema em 1 clique em vez de abandonar o processo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 uppercase">Modo Normal</span>
                <span className="text-xs font-mono text-stone-500">15 a 25 min/dia</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Para dias com ritmo padrão. Missões estruturadas para movimentar os projetos estratégicos e resolver gargalos operacionais com profundidade.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-900 uppercase">Modo Reduzido</span>
                <span className="text-xs font-mono text-stone-500">5 a 10 min/dia</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Para dias cheios de reuniões ou emergências. A missão é condensada na sua versão mais enxuta para não romper a cadência de entrega.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-900 uppercase">Modo Recuperação</span>
                <span className="text-xs font-mono text-amber-800">SOS Sobrecarga</span>
              </div>
              <p className="text-xs text-amber-950 leading-relaxed">
                Para dias de saturação, cansaço ou acúmulo de bloqueios. Limpa pendências zumbis, pausa frentes não essenciais e elege um único passo viável.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules of the Platform */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              A Plataforma Completa
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight text-balance">
              Ferramentas cirúrgicas para onde o empresário mais trava
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Não entregamos centenas de abas inúteis. Apenas os 5 pontos de estrangulamento mais críticos da rotina executiva.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Scale className="w-4 h-4 text-brand-accent" />
                <span>Matriz de Decisões</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Mapeie decisões empacadas, calcule o custo real de continuar adiando e tome a decisão reversível em até 24 horas.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <MessageSquareWarning className="w-4 h-4 text-brand-accent" />
                <span>Conversas Difíceis</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Roteiros prontos para cobrar clientes atrasados, reajustar contratos defasados, dizer não e dar feedbacks sem desgaste emocional.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Workflow className="w-4 h-4 text-brand-accent" />
                <span>Processos & Delegação</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Crie padrões mínimos operacionais e delegue tarefas com contexto, autonomia e data de retorno combinada.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-brand-accent" />
                <span>Revisão Semanal em 8 Passos</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Um ritual de 20 minutos na sexta-feira para classificar entregas, cancelar compromissos zumbis e zerar a ansiedade do fim de semana.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <LifeBuoy className="w-4 h-4 text-brand-accent" />
                <span>Modo Recuperação</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Quando a carga acumular, ative a interface de desaceleração acolhedora que limpa o atrito e reabilita o fôlego.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="flex items-center gap-2 text-stone-900 font-bold text-sm">
                <Footprints className="w-4 h-4 text-brand-accent" />
                <span>Próxima Ação Física</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Filtre apenas o que você precisa fazer nos próximos 15 minutos. Zero sobrecarga de listas intermináveis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E-book Showcase Section */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-xs w-full rounded-2xl overflow-hidden shadow-2xl border border-stone-300">
                <img
                  src={ASSETS.ebookCover}
                  alt="Capa do Livro MODO EXECUÇÃO - 30 Dias para Empreendedores"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
                O Livro Interativo
              </span>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-stone-950 tracking-tight text-balance">
                O E-book que não deixa você ficar apenas na leitura
              </h2>

              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Você já comprou dezenas de livros de negócios e produtividade que terminaram abandonados na página 40? O e-book do <strong>MODO EXECUÇÃO</strong> foi estruturado como um manual diário de intervenção.
              </p>

              <div className="space-y-3 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>30 capítulos objetivos:</strong> leituras condensadas entre 6 e 9 minutos, sem enrolação teórica.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Áudios executivos:</strong> versão em áudio de cada lição para escutar no deslocamento ou café.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Link direto para a missão:</strong> ao fechar a leitura, você clica e já cai no campo de ação no app.</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('/biblioteca')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Explorar biblioteca de capítulos e áudios</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Identified Placeholder Testimonials (Compliance: no fake claims) */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-brand-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Casos de Estudo · Formato Piloto
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight">
              O que acontece quando o empresário foca em evidências
            </h2>
            <p className="text-xs text-stone-500">
              [Espaço reservado para depoimentos de participantes dos ciclos beta após validação formal]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs text-stone-500 italic leading-relaxed">
                &quot;Eu passava 3 semanas repensando propostas comerciais. O roteiro de ação mínima me fez disparar 5 ofertas na mesma tarde.&quot;
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <strong className="text-stone-800">Empreendedor Piloto A</strong> · Agência Digital (SP)
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs text-stone-500 italic leading-relaxed">
                &quot;O roteiro de conversa difícil me fez recuperar R$ 12.000 em faturas atrasadas sem perder a compostura nem brigar com o cliente.&quot;
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <strong className="text-stone-800">Empreendedor Piloto B</strong> · Consultoria de Engenharia (MG)
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
              <div className="text-xs text-stone-500 italic leading-relaxed">
                &quot;O botão de não consegui é o diferencial. Em vez de me sentir um fracasso por ter um dia corrido, recebi um passo viável e retomei.&quot;
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] text-stone-500">
                <strong className="text-stone-800">Empreendedor Piloto C</strong> · E-commerce e Distribuição (PR)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 sm:py-24 border-b border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-12">
            <span className="text-xs font-semibold text-brand-accent uppercase tracking-wider">
              Dúvidas Frequentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-950 tracking-tight">
              Perguntas e Respostas
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-4 text-left font-semibold text-xs text-stone-900 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-stone-500 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-stone-900' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-stone-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
            Chega de Ruminar
          </span>

          <h2 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-balance">
            Pronto para transformar sua intenção na primeira entrega física de hoje?
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
            Faça o diagnóstico gratuito em 3 minutos para descobrir o seu padrão dominante de adiamento e receber sua primeira missão orientada.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('/diagnostico')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-stone-950 bg-white hover:bg-stone-100 rounded-lg transition-all shadow-md cursor-pointer"
            >
              <span>Fazer diagnóstico gratuito</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('/app')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 text-xs font-medium text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 rounded-lg transition-colors cursor-pointer"
            >
              <span>Abrir dashboard direto</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
