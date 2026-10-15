import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DifficultConversationScenario as Scenario } from '../types';
import { Copy, Check, MessageSquareWarning } from 'lucide-react';
import { useQueryParams } from '../lib/router';

const Panel: React.FC<{ s: Scenario }> = ({ s }) => {
  const { showToast } = useApp();
  const [msg, setMsg] = useState(s.shortScriptMessage);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(msg); } catch { /* ignora */ }
    setCopied(true);
    showToast('Mensagem copiada', 'Cole no WhatsApp ou no e-mail e envie.', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const steps = [
    { t: 'Seu objetivo', body: s.objective },
    { t: 'O que aconteceu (só fatos)', body: `"${s.observableFacts}"` },
    { t: 'O impacto no negócio', body: s.impact },
    { t: 'O que você pede e o seu limite', body: `Pedido: ${s.request}\nLimite: ${s.limit}`, key: true },
    { t: 'O que você pode oferecer', body: s.alternative }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold text-orange-700">{s.category}</div>
        <h2 className="text-2xl mt-1">{s.title}</h2>
        <p className="text-stone-600 mt-1">{s.summary}</p>
      </div>

      {/* Resultado primeiro: a mensagem pronta, editável */}
      <section className="bg-brand-primary text-white rounded-2xl p-5 sm:p-6 space-y-4" aria-label="Mensagem pronta">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg">Mensagem pronta para enviar</h3>
          <span className="text-sm text-white/60">Você pode editar</span>
        </div>
        <textarea value={msg} onChange={(e) => setMsg(e.target.value)} rows={7} aria-label="Texto da mensagem"
          className="w-full rounded-xl bg-white/[0.07] border border-white/15 p-4 leading-relaxed outline-none focus:border-brand-signal resize-y" />
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={copy} className="inline-flex items-center justify-center gap-2 px-6 py-3.5 font-bold text-brand-primary bg-brand-signal hover:bg-white rounded-xl cursor-pointer transition-colors">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Copiada' : 'Copiar mensagem'}
          </button>
          {msg !== s.shortScriptMessage && (
            <button onClick={() => setMsg(s.shortScriptMessage)} className="px-5 py-3.5 text-sm font-semibold border border-white/25 hover:bg-white/10 rounded-xl cursor-pointer">Voltar ao texto original</button>
          )}
        </div>
      </section>

      {/* Preparação: aqui a ordem importa, então os passos são numerados */}
      <section aria-label="Como se preparar">
        <h3 className="text-lg mb-3">Antes de enviar, confira os 5 passos</h3>
        <ol className="bg-white border border-stone-200 rounded-2xl divide-y divide-stone-200">
          {steps.map((st, i) => (
            <li key={i} className={`flex gap-4 p-4 sm:p-5 ${st.key ? 'bg-orange-50' : ''}`}>
              <span className={`w-7 h-7 rounded-full grid place-items-center text-sm font-bold shrink-0 ${st.key ? 'bg-brand-signal text-brand-primary' : 'bg-stone-100 text-stone-700'}`}>{i + 1}</span>
              <div className="min-w-0">
                <div className="font-semibold text-stone-900">{st.t}</div>
                <p className="text-stone-700 leading-relaxed mt-0.5 whitespace-pre-line">{st.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
};

export const ConversationsPage: React.FC = () => {
  const { conversations } = useApp();
  const queryParams = useQueryParams();
  const scenarioSlugFromUrl = queryParams.get('cenario');

  const [selectedId, setSelectedId] = useState(() => {
    if (scenarioSlugFromUrl) {
      const matched = conversations.find(
        (c) => c.slug === scenarioSlugFromUrl || c.id === scenarioSlugFromUrl
      );
      if (matched) return matched.id;
    }
    return conversations[0]?.id ?? '';
  });

  // Keep synced if query param changes
  React.useEffect(() => {
    if (scenarioSlugFromUrl) {
      const matched = conversations.find(
        (c) => c.slug === scenarioSlugFromUrl || c.id === scenarioSlugFromUrl
      );
      if (matched) setSelectedId(matched.id);
    }
  }, [scenarioSlugFromUrl, conversations]);

  const selected = conversations.find((c) => c.id === selectedId) ?? conversations[0];

  if (!selected) {
    return (
      <div className="p-10 text-center bg-white border border-stone-200 rounded-2xl max-w-xl space-y-3">
        <MessageSquareWarning className="w-8 h-8 text-stone-400 mx-auto" />
        <h1 className="text-xl">Nenhum roteiro disponível</h1>
        <p className="text-stone-600">Os roteiros de conversas difíceis aparecem aqui assim que forem carregados.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl">Conversas difíceis</h1>
        <p className="text-stone-600 mt-1 max-w-2xl">Escolha a situação, ajuste a mensagem e envie. Cobrar, reajustar e dizer não é parte de proteger o seu negócio.</p>
      </div>

      <div className="lg:hidden">
        <label htmlFor="scenario" className="block text-sm font-semibold mb-1.5">Qual conversa você precisa ter?</label>
        <select id="scenario" value={selected.id} onChange={(e) => setSelectedId(e.target.value)}
          className="w-full p-3.5 bg-white border border-stone-300 rounded-xl font-medium">
          {conversations.map((c) => <option key={c.id} value={c.id}>{c.category}: {c.title}</option>)}
        </select>
      </div>

      <div className="grid lg:grid-cols-[280px_minmax(0,1fr)] gap-8 items-start">
        <nav className="hidden lg:block sticky top-24 space-y-1" aria-label="Situações">
          <div className="px-3 mb-2 text-sm text-stone-500">{conversations.length} situações</div>
          {conversations.map((c) => {
            const active = c.id === selected.id;
            return (
              <button key={c.id} onClick={() => setSelectedId(c.id)} aria-current={active}
                className={`relative w-full text-left px-4 py-3 rounded-xl cursor-pointer transition-colors ${active ? 'bg-white border border-stone-200 shadow-sm' : 'hover:bg-stone-100'}`}>
                {active && <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-brand-signal rounded-full" />}
                <div className="text-xs text-stone-500">{c.category}</div>
                <div className={`leading-snug ${active ? 'font-semibold text-stone-950' : 'text-stone-700'}`}>{c.title}</div>
              </button>
            );
          })}
        </nav>
        <Panel key={selected.id} s={selected} />
      </div>
    </div>
  );
};
