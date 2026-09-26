import {
  useEffect, useMemo, useRef, useState,
  type ChangeEvent, type DragEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent,
} from 'react';
import { BackupInvalido, exportBackup as buildBackup, importBackup, validateBackup } from '../db/backup';
import * as repo from '../db/repo';
import { db, type CardRow, type Config, type Preset } from '../db/schema';
import { dayStatus, disciplina30, streak as calcStreak, type GoalCfg } from '../goals';
import { addDays, dayKey, diffDays, mondayOf, parseDayKey } from '../lib/dates';
import { DIAS_SEMANA, MESES, MESES_LONGOS, fmtMinutes, fmtNum, lastStudyLabel, nextDueLabel, plural, shortDate, todayLabel } from '../lib/format';
import { ESTRATEGIAS, detectCards, type EstrategiaId, type ResultadoDeteccao } from '../pdf/detect';
import { State, buildQueue, previewIntervals, rate as fsrsRate, type Nota } from '../scheduler';
import { downloadJson, pickFile } from './files';
import * as st from './stats';
import { DECK_COLORS, MEM_COLORS, STATE_TAGS, deckColor } from './theme';

type Screen = 'inicio' | 'estudar' | 'sessao' | 'resultado' | 'baralhos' | 'baralho' | 'criar' | 'importar' | 'evolucao' | 'ajustes';
type Modal = null | 'novoBaralho' | 'backup' | 'confirm' | 'lembrete';
type ImpErro = 'senha' | 'escaneado' | 'invalido' | 'vazio';

interface QItem { id: string; kind: string }
interface Session {
  queue: QItem[];
  pos: number;
  revealed: boolean;
  fb: 0 | Nota;
  fbText: string;
  results: [number, number, number, number];
  name: string;
  start: number;
  end: number;
  shownAt: number;
  metaHit: boolean;
}
interface ImpItem { id: number; q: string; a: string; on: boolean; dup: boolean; edit: boolean }
interface ImpState {
  step: 1 | 2 | 3 | 4 | 'erro';
  prog: number;
  pages: number;
  done: number;
  fileName: string;
  fileSize: number;
  items: ImpItem[];
  strat: EstrategiaId;
  deck: string;
  drag: boolean;
  result: ResultadoDeteccao | null;
  added: number;
  erro: ImpErro | null;
}
interface CC { q: string; a: string; deck: string; tags: string[]; tagIn: string; tried: boolean; fromLeech: boolean; editId: string | null }
interface NB { name: string; desc: string; color: number; tried: boolean; editId: string | null }
interface Confirm { title: string; titleEm: string; text: string; btn: string; action: () => void | Promise<void> }
interface Toast { kind: 'ok' | 'meta' | 'err'; text: string; k: number }

const EMPTY_SESSION: Session = { queue: [], pos: 0, revealed: false, fb: 0, fbText: '', results: [0, 0, 0, 0], name: '', start: 0, end: 0, shownAt: 0, metaHit: false };
const EMPTY_IMP: ImpState = { step: 1, prog: 0, pages: 0, done: 0, fileName: '', fileSize: 0, items: [], strat: 'sep', deck: '', drag: false, result: null, added: 0, erro: null };
const EMPTY_CC: CC = { q: '', a: '', deck: '', tags: [], tagIn: '', tried: false, fromLeech: false, editId: null };

const PRESET_INFO: { id: Exclude<Preset, 'custom'>; l: string; d: string; bg: string; pat: string; ps: string }[] = [
  { id: 'leve', l: 'Leve', d: 'Semana de prova de outra matéria, ou recomeço.', bg: '#DCEBD9', pat: 'radial-gradient(rgba(62,107,74,.16) 1.2px,transparent 1.7px)', ps: '12px 12px' },
  { id: 'firme', l: 'Firme', d: 'O ritmo do dia a dia. Sustentável.', bg: '#F3E3B5', pat: 'repeating-linear-gradient(to bottom,transparent 0 13px,rgba(201,72,91,.14) 13px 14px)', ps: 'auto' },
  { id: 'intenso', l: 'Intenso', d: 'Reta final antes da prova.', bg: '#F4D9E3', pat: 'repeating-linear-gradient(135deg,rgba(201,72,91,.13) 0 1px,transparent 1px 7px)', ps: 'auto' },
];

const IMP_ERRORS: Record<ImpErro, { tag: string; title: string; em: string; text: string }> = {
  escaneado: {
    tag: 'NÃO CONSEGUI LER O TEXTO', title: 'Esse PDF parece ser', em: 'uma foto.',
    text: 'Arquivos escaneados não têm texto selecionável, então não dá para montar cards. Nenhum card foi criado. Tente exportar o resumo de novo como PDF de texto, ou use um arquivo do Google Docs / Word.',
  },
  senha: { tag: 'PDF PROTEGIDO', title: 'Esse PDF tem', em: 'senha.', text: 'Remova a proteção e tente de novo — não importamos nada.' },
  invalido: {
    tag: 'ARQUIVO INVÁLIDO', title: 'Não consegui abrir', em: 'esse arquivo.',
    text: 'Confira se é mesmo um PDF e se ele abre normalmente no seu computador. Nenhum card foi criado.',
  },
  vazio: {
    tag: 'NENHUM PAR ENCONTRADO', title: 'Li o texto, mas não achei', em: 'perguntas.',
    text: 'O PDF tem texto, mas nenhuma das seis estratégias conseguiu montar pares. Resumos com P:/R:, “termo — definição” ou tabelas em duas colunas funcionam melhor. Nenhum card foi criado.',
  },
};

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const kindOf = (s: State) => (s === State.New ? 'NOVO' : s === State.Review ? 'REVISÃO' : 'APRENDENDO');

function stateTag(c: CardRow): keyof typeof STATE_TAGS {
  if (c.suspenso) return 'SUSPENSO';
  if (c.state === State.New) return 'NOVO';
  if (c.state !== State.Review) return 'APRENDENDO';
  return c.scheduled_days >= 21 ? 'DOMINADO' : 'REVISÃO';
}

export function useApp(data: st.Snapshot, storageOk: boolean, aviso: string | null = null) {
  const cfg = data.config;
  const [, setTick] = useState(0);
  const now = Date.now();
  const today = dayKey(now);

  const [screen, setScreen] = useState<Screen>('inicio');
  const [deckId, setDeckId] = useState('');
  const [search, setSearch] = useState('');
  const [sess, setSess] = useState<Session>(EMPTY_SESSION);
  const [imp, setImpState] = useState<ImpState>(EMPTY_IMP);
  const [cc, setCCState] = useState<CC>(EMPTY_CC);
  const [modal, setModal] = useState<Modal>(null);
  const [nb, setNb] = useState<NB>({ name: '', desc: '', color: 0, tried: false, editId: null });
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [lb, setLb] = useState({ titulo: '', data: '', tried: false });
  const [toastState, setToast] = useState<Toast | null>(null);
  const [winW, setWinW] = useState(() => window.innerWidth);

  const mainRef = useRef<HTMLElement>(null);
  const toastT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fbT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const impCancel = useRef(false);
  const sessRef = useRef(sess);
  const screenRef = useRef(screen);
  const rateRef = useRef<(n: Nota) => void>(() => {});
  sessRef.current = sess;
  screenRef.current = screen;

  // ---------- derivados ----------
  const goalCfg: GoalCfg = useMemo(
    () => ({ metaRespondidos: cfg.metaRespondidos, diasDescanso: cfg.diasDescanso, inicio: cfg.inicio }),
    [cfg.metaRespondidos, cfg.diasDescanso, cfg.inicio],
  );
  const diasMap = useMemo(() => new Map(data.dias.map((d) => [d.data, d])), [data.dias]);
  const activeDecks = useMemo(() => data.decks.filter((d) => !d.arquivado).sort((a, b) => a.criadoEm - b.criadoEm), [data.decks]);
  const activeIds = useMemo(() => new Set(activeDecks.map((d) => d.id)), [activeDecks]);
  const deckById = useMemo(() => new Map(data.decks.map((d) => [d.id, d])), [data.decks]);
  const cardMap = useMemo(() => new Map(data.cards.map((c) => [c.id, c])), [data.cards]);
  const stats = useMemo(() => st.deckStats(data.cards, data.reviews, now), [data.cards, data.reviews, today]);
  const streakInfo = useMemo(() => calcStreak(today, diasMap, goalCfg), [today, diasMap, goalCfg]);
  const disc = useMemo(() => disciplina30(today, diasMap, goalCfg), [today, diasMap, goalCfg]);
  const avgSec = useMemo(() => st.avgSecondsPerCard(data.reviews), [data.reviews]);

  const todayRec = diasMap.get(today);
  const answered = todayRec?.respondidos ?? 0;
  const created = todayRec?.criados ?? 0;
  const novosHoje = todayRec?.novosVistos ?? 0;
  const novosRestantes = Math.max(0, cfg.limiteNovosPorDia - novosHoje);

  // ---------- efeitos ----------
  useEffect(() => {
    const onResize = () => setWinW(window.innerWidth);
    const t = setInterval(() => setTick((x) => x + 1), 60_000);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearInterval(t);
      clearTimeout(toastT.current);
      clearTimeout(fbT.current);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = (e.target as HTMLElement | null)?.tagName;
      if (t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || screenRef.current !== 'sessao') return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (!sessRef.current.revealed) setSess((s) => ({ ...s, revealed: true }));
      }
      if (['1', '2', '3', '4'].includes(e.key) && sessRef.current.revealed) rateRef.current(Number(e.key) as Nota);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (aviso) toast('meta', aviso);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aviso]);

  // ---------- ações básicas ----------
  const go = (s: Screen, extra?: { deckId?: string }) => {
    if (extra?.deckId !== undefined) setDeckId(extra.deckId);
    if (s === 'baralho') setSearch('');
    setScreen(s);
    setModal(null);
    mainRef.current?.scrollTo({ top: 0 });
  };

  const toast = (kind: Toast['kind'], text: string) => {
    clearTimeout(toastT.current);
    setToast({ kind, text, k: Date.now() });
    toastT.current = setTimeout(() => setToast(null), kind === 'meta' ? 3800 : 2800);
  };

  const safely = async (fn: () => Promise<void>) => {
    try {
      await fn();
    } catch (e) {
      console.error(e);
      toast('err', 'Não foi possível salvar. Tente de novo.');
    }
  };

  const saveConfig = (patch: Partial<Omit<Config, 'id'>>) => safely(() => repo.updateConfig(db, patch, Date.now()));

  // ---------- baralhos ----------
  const decksV = activeDecks.map((d) => {
    const s = stats.get(d.id) ?? { total: 0, due: 0, learn: 0, rev: 0, novos: 0, maduros: 0 };
    const col = deckColor(d.cor);
    const prog = s.total ? Math.round((s.maduros / s.total) * 100) : 0;
    const novos = Math.min(s.novos, novosRestantes);
    return {
      id: d.id, nome: d.nome,
      sub: d.descricao || (s.total ? `${fmtNum(s.total)} ${plural(s.total, 'card', 'cards')}` : 'Baralho novo'),
      bg: col.bg, ink: col.ink, dot: col.dot, pat: col.pat, ps: col.ps,
      total: s.total, totalFmt: fmtNum(s.total), due: s.due, learn: s.learn, rev: s.rev, novos,
      prog, progW: `${prog}%`, ultimo: lastStudyLabel(s.ultimo, now),
      hasDue: s.due + novos > 0, empty: s.total === 0, notEmpty: s.total > 0,
      open: () => go('baralho', { deckId: d.id }),
      study: () => startSession(d.id),
    };
  });
  const decksDue = decksV.filter((d) => d.hasDue);
  const dueTotal = decksV.reduce((a, d) => a + d.due, 0);
  const learnCount = decksV.reduce((a, d) => a + d.learn, 0);
  const revCount = decksV.reduce((a, d) => a + d.rev, 0);
  const newAvailable = Math.min(novosRestantes, decksV.reduce((a, d) => a + (stats.get(d.id)?.novos ?? 0), 0));

  const openNovoBaralho = () => {
    setNb({ name: '', desc: '', color: activeDecks.length % DECK_COLORS.length, tried: false, editId: null });
    setModal('novoBaralho');
  };

  const nameTaken = (name: string, exceptId: string | null) =>
    activeDecks.some((d) => d.id !== exceptId && norm(d.nome) === norm(name));

  const saveDeck = () =>
    safely(async () => {
      const name = nb.name.trim();
      if (!name || nameTaken(name, nb.editId)) {
        setNb({ ...nb, tried: true });
        return;
      }
      if (nb.editId) {
        await repo.updateDeck(db, nb.editId, { nome: name, descricao: nb.desc.trim(), cor: nb.color });
        setModal(null);
        toast('ok', 'Baralho atualizado.');
        return;
      }
      const id = await repo.createDeck(db, name, nb.desc, nb.color, Date.now());
      go('baralho', { deckId: id });
      toast('ok', `Baralho “${name}” criado.`);
    });

  // ---------- sessão ----------
  function startSession(only: string | null) {
    const ids = only ? new Set([only]) : activeIds;
    const q = buildQueue(data.cards, { now: Date.now(), novosRestantes, deckIds: ids });
    if (!q.length) {
      toast('ok', only ? 'Nada para estudar neste baralho hoje.' : 'Tudo em dia por hoje.');
      return;
    }
    const t = Date.now();
    setSess({
      ...EMPTY_SESSION,
      queue: q.map((c) => ({ id: c.id, kind: kindOf(c.state) })),
      name: only ? deckById.get(only)?.nome ?? '' : 'Todos os baralhos',
      start: t,
      shownAt: t,
    });
    go('sessao');
  }

  const advance = () => {
    if (screenRef.current !== 'sessao') return;
    const p = sessRef.current;
    const pos = p.pos + 1;
    if (pos >= p.queue.length) {
      setSess({ ...p, fb: 0, revealed: false, end: Date.now() });
      go('resultado');
    } else setSess({ ...p, pos, fb: 0, revealed: false, shownAt: Date.now() });
  };

  const rate = (n: Nota) => {
    const s = sessRef.current;
    if (!s.revealed || s.fb) return;
    const item = s.queue[s.pos];
    const card = item && cardMap.get(item.id);
    const t = Date.now();
    const results = [...s.results] as Session['results'];
    results[n - 1]++;
    let queue = s.queue;
    let fbText = ['', 'de novo', 'difícil', 'bom ✓', 'fácil ✦'][n];
    if (card) {
      const r = fsrsRate(card, n, t);
      if (r.estadoDepois === State.Learning || r.estadoDepois === State.Relearning) {
        queue = [...queue, { id: card.id, kind: n === 1 ? 'DE NOVO' : 'APRENDENDO' }];
      }
      if (n === 1) fbText = `volta em ${previewIntervals(card, t)[0]}`;
      void safely(async () => {
        await repo.recordReview(db, card, n, t, t - s.shownAt, r);
      });
    }
    const hitMeta = answered + 1 === cfg.metaRespondidos;
    setSess({ ...s, results, queue, fb: n, fbText, metaHit: s.metaHit || hitMeta });
    if (hitMeta) toast('meta', `Meta do dia cumprida. Ofensiva: ${streakInfo.atual + 1} dias.`);
    clearTimeout(fbT.current);
    fbT.current = setTimeout(advance, n === 4 ? 800 : 620);
  };
  rateRef.current = rate;

  const sessVals = () => {
    const item = sess.queue[sess.pos];
    const card = item ? cardMap.get(item.id) : undefined;
    const deck = card ? deckById.get(card.deckId) : undefined;
    const col = deckColor(deck?.cor ?? 0);
    const ivl = card ? previewIntervals(card, now) : ['', '', '', ''];
    const fbColors = ['#E3D9C4', '#C9485B', '#B8952F', '#4F7358', '#3D6580'];
    const tot = sess.results.reduce((a, b) => a + b, 0);
    const secs = Math.max(1, Math.round(((sess.end || now) - sess.start) / 1000));
    const ret = tot ? Math.round(((sess.results[2] + sess.results[3]) / tot) * 100) : 0;
    const tomorrow = st.dueByDay(data.cards, today, 2, activeIds)[1];
    return {
      sCard: { q: card?.frente ?? '', a: card?.verso ?? '', deck: deck?.nome ?? '', deckBg: col.bg, deckInk: col.ink, kind: item?.kind ?? '' },
      sessName: sess.name, sPos: Math.min(sess.pos + 1, sess.queue.length), sTotal: sess.queue.length,
      sProgW: `${sess.queue.length ? (sess.pos / sess.queue.length) * 100 : 0}%`,
      revealed: sess.revealed, notRevealed: !sess.revealed,
      reveal: () => setSess((s) => ({ ...s, revealed: true })),
      rate1: () => rate(1), rate2: () => rate(2), rate3: () => rate(3), rate4: () => rate(4),
      ivl1: ivl[0], ivl2: ivl[1], ivl3: ivl[2], ivl4: ivl[3],
      hasStamp: sess.fb > 0, stampC: fbColors[sess.fb], stampT: sess.fbText, isFacilFb: sess.fb === 4,
      sBorder: fbColors[sess.fb],
      sCardT: sess.fb === 3 || sess.fb === 4 ? 'translateY(-3px)' : sess.fb === 1 ? 'translateX(-3px)' : 'none',
      exitSession: () => {
        clearTimeout(fbT.current);
        if (sess.results.some((x) => x)) {
          setSess({ ...sess, fb: 0, end: Date.now() });
          go('resultado');
        } else go('estudar');
      },
      resTotal: tot, resRet: `${ret}%`, resTime: secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}min`,
      resDist: ([['Errei', '#E7A9BD'], ['Difícil', '#E3CB85'], ['Bom', '#87BC96'], ['Fácil', '#A9C1D2']] as const).map(([l, c], i) => ({ l, c, n: sess.results[i] })),
      resMsg: sess.metaHit
        ? `E a meta do dia foi batida no meio da sessão. Ofensiva: ${streakInfo.atual} ${plural(streakInfo.atual, 'dia seguido', 'dias seguidos')}.`
        : ret >= 80 ? 'Retenção ótima. Esses cards vão voltar mais espaçados.' : 'Os que você errou voltam logo — é assim que a memória fixa.',
      nextRevLabel: tomorrow
        ? `amanhã · ${tomorrow} ${plural(tomorrow, 'card', 'cards')} · ≈ ${fmtMinutes(tomorrow * avgSec * 1000)}`
        : 'amanhã está livre ✦',
    };
  };

  // ---------- criar / editar card ----------
  const setCC = (patch: Partial<CC>) => setCCState((c) => ({ ...c, ...patch }));
  const defaultDeck = () => (screen === 'baralho' && activeIds.has(deckId) ? deckId : activeIds.has(cc.deck) ? cc.deck : activeDecks[0]?.id ?? '');

  const goCriar = () => {
    setCCState({ ...EMPTY_CC, deck: defaultDeck(), tags: cc.editId ? [] : cc.tags });
    go('criar');
  };

  const editCard = (c: CardRow) => {
    setCCState({ ...EMPTY_CC, q: c.frente, a: c.verso, deck: c.deckId, tags: c.tags, editId: c.id });
    go('criar');
  };

  const saveCard = (again: boolean) =>
    safely(async () => {
      if (!cc.q.trim() || !cc.a.trim()) {
        setCC({ tried: true });
        return;
      }
      let deck = cc.deck && activeIds.has(cc.deck) ? cc.deck : activeDecks[0]?.id;
      if (!deck) deck = await repo.createDeck(db, 'Meu baralho', '', 0, Date.now());
      const nome = deckById.get(deck)?.nome ?? 'Meu baralho';
      if (cc.editId) {
        await repo.updateCard(db, cc.editId, { frente: cc.q.trim(), verso: cc.a.trim(), tags: cc.tags, deckId: deck });
        toast('ok', 'Card atualizado.');
        go('baralho', { deckId: deck });
        return;
      }
      await repo.addCards(db, deck, [{ frente: cc.q, verso: cc.a, tags: cc.tags }], 'manual', Date.now());
      toast('ok', `Card salvo em ${nome}.`);
      if (again) setCC({ q: '', a: '', tried: false, fromLeech: false, deck });
      else go('baralho', { deckId: deck });
    });

  const deckVals = () => {
    const found = decksV.find((d) => d.id === deckId) ?? decksV[0];
    const dk = found ?? { ...decksV[0], nome: '—', sub: '', bg: '#F6EFE0', ink: '#8A7C68', pat: 'none', ps: 'auto', ultimo: '—', totalFmt: '0', due: 0, novos: 0, prog: 0, hasDue: false, empty: true, notEmpty: false, study: () => {} };
    const q = norm(search);
    const all = found ? data.cards.filter((c) => c.deckId === found.id).sort((a, b) => a.criadoEm - b.criadoEm) : [];
    const filtered = q ? all.filter((c) => norm(`${c.frente} ${c.verso}`).includes(q)) : all;
    const shown = filtered.slice(0, 300);
    const editing = cc.editId ? cardMap.get(cc.editId) : undefined;
    return {
      dk,
      dkCards: shown.map((c, i) => {
        const tag = stateTag(c);
        return {
          n: String(i + 1).padStart(2, '0'), q: c.frente, a: c.verso, state: tag,
          tb: STATE_TAGS[tag][0], tc: STATE_TAGS[tag][1],
          next: c.suspenso ? '—' : c.state === State.New ? 'novo' : nextDueLabel(c.due, now),
          edit: () => editCard(c),
        };
      }),
      dkShown: shown.length, dkNoResults: !!q && !filtered.length, search,
      onSearch: (e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
      editDeck: () => {
        if (!found) return;
        const d = deckById.get(found.id)!;
        setNb({ name: d.nome, desc: d.descricao, color: d.cor, tried: false, editId: d.id });
        setModal('novoBaralho');
      },
      archiveDeck: () => {
        if (!found) return;
        setConfirm({
          title: 'Arquivar', titleEm: `“${found.nome}”?`,
          text: 'Os cards saem das sessões, mas nada é apagado: histórico e progresso ficam guardados. Dá para restaurar em Ajustes.',
          btn: 'Arquivar',
          action: () => safely(async () => {
            await repo.updateDeck(db, found.id, { arquivado: true });
            go('baralhos');
            toast('ok', `“${found.nome}” foi arquivado.`);
          }),
        });
        setModal('confirm');
      },
      cc, ccErrQ: cc.tried && !cc.q.trim(), ccErrA: cc.tried && !cc.a.trim(),
      ccHeader: cc.editId ? `editando card · ${deckById.get(editing?.deckId ?? '')?.nome ?? ''}` : `novo card · criados hoje ${created}/${cfg.metaCriados}`,
      ccTitleA: cc.editId ? 'Ajuste a' : 'Escreva uma',
      ccEditing: !!cc.editId,
      ccSaveL: cc.editId ? 'Salvar alterações' : 'Salvar card',
      ccSave2L: cc.editId ? 'Excluir card' : 'Salvar e escrever outro',
      ccSave2C: cc.editId ? '#A3303F' : '#4A4034',
      ccSuspL: editing?.suspenso ? 'card suspenso · reativar' : 'suspender este card',
      ccPrevQ: cc.q.trim() || 'Sua pergunta aparece aqui', ccPrevQc: cc.q.trim() ? '#4A4034' : '#B5A88F',
      ccPrevA: cc.a.trim() || 'e a resposta, depois de virar.', ccPrevAc: cc.a.trim() ? '#6E6250' : '#B5A88F',
      ccTags: cc.tags.map((t) => ({ t, rm: () => setCC({ tags: cc.tags.filter((x) => x !== t) }) })),
      onCcQ: (e: ChangeEvent<HTMLTextAreaElement>) => setCC({ q: e.target.value }),
      onCcA: (e: ChangeEvent<HTMLTextAreaElement>) => setCC({ a: e.target.value }),
      onCcDeck: (e: ChangeEvent<HTMLSelectElement>) => setCC({ deck: e.target.value }),
      onTagIn: (e: ChangeEvent<HTMLInputElement>) => setCC({ tagIn: e.target.value }),
      onTagKey: (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const t = cc.tagIn.trim().replace(/^#/, '').toLowerCase();
        setCC({ tags: t && !cc.tags.includes(t) ? [...cc.tags, t] : cc.tags, tagIn: '' });
      },
      saveCard: () => void saveCard(false),
      saveCardAgain: () => {
        if (!cc.editId) return void saveCard(true);
        const id = cc.editId;
        const deck = editing?.deckId ?? deckId;
        setConfirm({
          title: 'Excluir', titleEm: 'este card?',
          text: 'Ele sai do baralho de vez. As revisões que você já fez continuam contando nos gráficos.',
          btn: 'Excluir card',
          action: () => safely(async () => {
            await repo.deleteCard(db, id);
            setCCState(EMPTY_CC);
            go('baralho', { deckId: deck });
            toast('ok', 'Card excluído.');
          }),
        });
        setModal('confirm');
      },
      toggleSuspend: () => {
        if (!editing) return;
        void safely(async () => {
          await repo.updateCard(db, editing.id, { suspenso: !editing.suspenso });
          toast('ok', editing.suspenso ? 'Card reativado.' : 'Card suspenso. Ele não aparece mais nas sessões.');
        });
      },
    };
  };

  // ---------- importar PDF ----------
  const setImp = (patch: Partial<ImpState>) => setImpState((s) => ({ ...s, ...patch }));

  const itemsFrom = (result: ResultadoDeteccao, strat: EstrategiaId): ImpItem[] => {
    const existing = new Set(data.cards.map((c) => norm(c.frente)));
    const pares = result.estrategias.find((e) => e.id === strat)?.pares ?? [];
    return pares.map((p, i) => {
      const dup = existing.has(norm(p.frente));
      return { id: i + 1, q: p.frente, a: p.verso, on: !dup, dup, edit: false };
    });
  };

  const handleFile = async (file: File) => {
    if (!/\.pdf$/i.test(file.name) && file.type !== 'application/pdf') {
      toast('err', 'Escolha um arquivo PDF.');
      return;
    }
    impCancel.current = false;
    setImpState({ ...EMPTY_IMP, step: 2, fileName: file.name, fileSize: file.size, deck: imp.deck || defaultDeck() });
    try {
      const { extractText } = await import('../pdf/extract');
      const { paginas } = await extractText(
        file,
        (done, pages) => setImp({ done, pages, prog: Math.round((done / pages) * 70) }),
        () => impCancel.current,
      );
      setImp({ prog: 85 });
      const result = detectCards(paginas);
      const best = result.estrategias.find((e) => e.id === result.melhor)!;
      if (!best.pares.length) {
        setImp({ step: 'erro', erro: 'vazio', prog: 100 });
        return;
      }
      setImp({ step: 3, prog: 100, result, strat: result.melhor, items: itemsFrom(result, result.melhor) });
    } catch (e) {
      const tipo = (e as { tipo?: string }).tipo;
      if (tipo === 'cancelado') setImpState({ ...EMPTY_IMP, deck: imp.deck });
      else setImp({ step: 'erro', erro: tipo === 'senha' || tipo === 'escaneado' ? tipo : 'invalido' });
    }
  };

  const setItem = (id: number, patch: Partial<ImpItem>) =>
    setImpState((s) => ({ ...s, items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)) }));

  const impVals = () => {
    const stepN = imp.step === 'erro' ? 2 : imp.step;
    const impSteps = ['ENVIAR', 'PROCESSANDO', 'REVISAR'].map((l, i) => {
      const n = i + 1;
      const done = stepN > n;
      const act = stepN === n;
      const err = imp.step === 'erro' && n === 2;
      return {
        l: `0${n} — ${l}`, sym: done ? '✓' : err ? '!' : `0${n}`,
        bg: act ? (err ? '#F6D8D8' : '#FDFBF5') : 'transparent', bd: act ? (err ? '#E7A9BD' : '#D98CAE') : '#E3D9C4',
        cb: done ? '#7FA886' : act ? (err ? '#C9485B' : '#D98CAE') : '#F6EFE0', cc: done || act ? '#FFF' : '#8A7C68', tc: act || done ? '#4A4034' : '#8A7C68',
      };
    });
    const msgs = ['Lendo seu material', 'Identificando possíveis perguntas', 'Montando seus cards'];
    const mi = imp.prog < 70 ? 0 : imp.prog < 90 ? 1 : 2;
    const cur = imp.result?.estrategias.find((e) => e.id === imp.strat);
    const best = imp.result?.estrategias.find((e) => e.id === imp.result?.melhor);
    const sel = imp.items.filter((x) => x.on).length;
    const allOn = imp.items.length > 0 && sel === imp.items.length;
    const dups = imp.items.filter((x) => x.dup).length;
    const erro = IMP_ERRORS[imp.erro ?? 'invalido'];
    const deckNome = deckById.get(imp.deck)?.nome ?? imp.fileName.replace(/\.pdf$/i, '');
    return {
      imp, impSteps,
      imp1: imp.step === 1, imp2: imp.step === 2, imp3: imp.step === 3, imp4: imp.step === 4, impErr: imp.step === 'erro',
      dropBd: imp.drag ? '#B03D66' : '#D98CAE', dropBg: imp.drag ? '#F4D9E3' : '#FAEBF0',
      onDragOver: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!imp.drag) setImp({ drag: true });
      },
      onDragLeave: () => setImp({ drag: false }),
      onDrop: (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setImp({ drag: false });
        const f = e.dataTransfer.files[0];
        if (f) void handleFile(f);
      },
      startImport: () => void pickFile('application/pdf,.pdf').then((f) => f && handleFile(f)),
      cancelImport: () => {
        impCancel.current = true;
        setImpState({ ...EMPTY_IMP, deck: imp.deck });
      },
      restartImport: () => setImpState({ ...EMPTY_IMP, deck: imp.deck }),
      impFileName: imp.fileName,
      impFileMeta: `${imp.pages ? `${imp.pages} ${plural(imp.pages, 'página', 'páginas')} · ` : ''}${(imp.fileSize / 1_048_576).toFixed(1).replace('.', ',')} MB`,
      impMsg: msgs[mi], impProgW: `${imp.prog}%`, impPage: imp.done || 1, impPages: imp.pages || '…',
      impChecks: msgs.map((l, i) => ({
        l, sym: i < mi ? '✓' : '', col: i <= mi ? '#4A4034' : '#B5A88F',
        bg: i < mi ? '#7FA886' : 'transparent', bd: i < mi ? 'none' : i === mi ? '2px solid #D98CAE' : '1.5px dashed #E3D9C4',
      })),
      impErrTag: erro.tag, impErrTitle: erro.title, impErrTitleEm: erro.em, impErrText: erro.text,
      impN: imp.items.length, impSel: sel,
      impConf: `${Math.round((cur?.confianca ?? 0) * 100)}%`,
      impLow: (cur?.confianca ?? 0) < 0.6,
      impLowMsg: `Confiança baixa com essa estratégia — os pares podem estar trocados. Confira com calma${best && best.id !== imp.strat ? ` ou volte para “${best.label}”` : ''}.`,
      strats: (imp.result?.estrategias ?? ESTRATEGIAS.map((e) => ({ ...e, confianca: 0 }))).map((e) => ({ id: e.id, lab: `${e.label} · ${Math.round(e.confianca * 100)}%` })),
      onStrat: (e: ChangeEvent<HTMLSelectElement>) => {
        const strat = e.target.value as EstrategiaId;
        if (imp.result) setImp({ strat, items: itemsFrom(imp.result, strat) });
        toast('ok', 'Pares recalculados.');
      },
      onImpDeck: (e: ChangeEvent<HTMLSelectElement>) => setImp({ deck: e.target.value }),
      toggleAll: () => setImp({ items: imp.items.map((x) => ({ ...x, on: !allOn })) }),
      toggleAllL: allOn ? 'Desmarcar todos' : 'Marcar todos',
      impDupMsg: dups
        ? `· ${dups} ${plural(dups, 'card igual a um que você já tem veio desmarcado', 'cards iguais a outros que você já tem vieram desmarcados')}`
        : '',
      impItems: imp.items.map((it, i) => ({
        ...it, num: String(i + 1).padStart(2, '0'), view: !it.edit, editL: it.edit ? 'Pronto' : 'Editar',
        op: it.on ? 1 : 0.55, bd: it.edit ? '#D98CAE' : '#E3D9C4',
        cbBg: it.on ? '#4F7358' : '#FDFBF5', cbBd: it.on ? '#4F7358' : '#D8CCB3', cbSym: it.on ? '✓' : '',
        toggle: () => setItem(it.id, { on: !it.on }),
        onEdit: () => setItem(it.id, { edit: !it.edit }),
        onDel: () => setImpState((s) => ({ ...s, items: s.items.filter((x) => x.id !== it.id) })),
        onQ: (e: ChangeEvent<HTMLTextAreaElement>) => setItem(it.id, { q: e.target.value }),
        onA: (e: ChangeEvent<HTMLTextAreaElement>) => setItem(it.id, { a: e.target.value }),
      })),
      impDeckName: deckNome, impAdded: imp.added,
      addImport: () =>
        void safely(async () => {
          const chosen = imp.items.filter((x) => x.on && x.q.trim() && x.a.trim());
          if (!chosen.length) {
            toast('err', 'Marque pelo menos um card.');
            return;
          }
          let deck = activeIds.has(imp.deck) ? imp.deck : '';
          if (!deck) deck = await repo.createDeck(db, deckNome || 'Importados', '', activeDecks.length % DECK_COLORS.length, Date.now());
          await repo.addCards(db, deck, chosen.map((x) => ({ frente: x.q, verso: x.a })), 'pdf', Date.now());
          setImp({ step: 4, added: chosen.length, deck });
          mainRef.current?.scrollTo({ top: 0 });
        }),
      goImpDeck: () => go('baralho', { deckId: imp.deck }),
    };
  };

  // ---------- evolução (só calcula quando a tela está aberta) ----------
  const onEvolucao = screen === 'evolucao';
  const evo = useMemo(() => {
    if (!onEvolucao) return null;
    const t = Date.now();
    const grid = st.yearGrid(diasMap, cfg, today);
    const weeks = st.retentionWeeks(data.reviews, today);
    const load = st.dueByDay(data.cards, today, 14, activeIds);
    const mem = st.memoryComposition(data.cards.filter((c) => activeIds.has(c.deckId)), data.reviews, t);
    const ret30 = st.retention(data.reviews, t - 30 * 86_400_000);
    const firstCard = data.cards.reduce((m, c) => Math.min(m, c.criadoEm), Infinity);
    return { grid, weeks, load, mem, ret30, firstCard };
  }, [onEvolucao, diasMap, cfg, today, data.reviews, data.cards, activeIds]);

  const evoVals = () => {
    const scale = (v: number) => `${Math.max(0, ((v * 100 - 60) / 40) * 100).toFixed(0)}%`;
    const d = new Date(now);
    const base = {
      mesAtual: `${MESES_LONGOS[d.getMonth()]} de ${d.getFullYear()}`,
      ret30: '—', evoResumo: '', months: [] as string[], year: [] as { days: st.YearCell[] }[],
      retWeeks: [] as { h: string; t: string }[], ret90: scale(0.9), retAxis: [] as string[],
      load14: [] as { h: string; c: string; t: string }[], nextList: [] as { l: string; v: number }[],
      memLegend: [] as { l: string; c: string; v: number }[],
      memMonths: [] as { l: string; h: string; segs: { v: number; c: string; t: string }[] }[],
    };
    if (!evo) return base;
    const maxLoad = Math.max(1, ...evo.load);
    const totals = evo.mem.map((m) => m.counts.reduce((a, b) => a + b, 0));
    const mx = Math.max(1, ...totals);
    const last = evo.mem[evo.mem.length - 1]?.counts ?? [0, 0, 0, 0];
    const daysSince = Number.isFinite(evo.firstCard) ? diffDays(dayKey(evo.firstCard), today) : 0;
    const monthOf = (k: string) => MESES[parseDayKey(k).getMonth()];
    return {
      ...base,
      ret30: evo.ret30 === null ? '—' : `${Math.round(evo.ret30 * 100)}%`,
      evoResumo: `${fmtNum(daysSince)} ${plural(daysSince, 'dia', 'dias')} desde o primeiro card · ${fmtNum(data.reviews.length)} ${plural(data.reviews.length, 'revisão', 'revisões')}`,
      months: evo.grid.months, year: evo.grid.weeks,
      retWeeks: evo.weeks.map((w, i) => ({
        h: w.pct === null ? '0%' : scale(w.pct),
        t: `semana de ${shortDate(w.monday)} · ${w.pct === null ? 'sem revisões' : `${Math.round(w.pct * 100)}%`}${i === evo.weeks.length - 1 ? ' (esta)' : ''}`,
      })),
      retAxis: [monthOf(evo.weeks[0].monday), monthOf(evo.weeks[6].monday), monthOf(evo.weeks[11].monday)],
      load14: evo.load.map((v, i) => ({ h: `${(v / maxLoad) * 100}%`, c: i === 0 ? '#AE3D6B' : '#DE97B5', t: `${i === 0 ? 'hoje' : `+${i} ${plural(i, 'dia', 'dias')}`} · ${v}` })),
      nextList: [['Hoje', 0], ['Amanhã', 1], ['+2 dias', 2], ['+3 dias', 3]].map(([l, i]) => ({ l: l as string, v: evo.load[i as number] })),
      memLegend: st.FAIXAS.map((l, i) => ({ l, c: MEM_COLORS[i], v: last[i] })),
      memMonths: evo.mem.map((m, i) => ({
        l: m.label, h: `${(totals[i] / mx) * 100}%`,
        segs: m.counts.map((v, j) => ({ v, c: MEM_COLORS[j], t: `${st.FAIXAS[j]} · ${v}` })).reverse(),
      })),
    };
  };

  const leechList = st.leeches(data.cards.filter((c) => activeIds.has(c.deckId)));

  // ---------- ajustes ----------
  const cfgVals = () => ({
    presets: PRESET_INFO.map((p) => {
      const a = cfg.preset === p.id;
      return {
        ...p, v: repo.PRESETS[p.id].metaRespondidos,
        bd: a ? '2px solid #4A4034' : '2px solid transparent', ck: a ? '#4A4034' : 'rgba(74,64,52,.12)', sym: a ? '✓' : '',
        pick: () => void saveConfig({ preset: p.id, ...repo.PRESETS[p.id] }),
      };
    }),
    steppers: (
      [
        ['metaRespondidos', 'Cards respondidos por dia', 'sua meta diária', 5, 5, 200],
        ['limiteNovosPorDia', 'Novos cards por dia', 'limite de cards novos na fila', 5, 0, 100],
        ['metaCriados', 'Cards criados por dia', 'meta de escrita', 1, 0, 30],
      ] as const
    ).map(([key, l, d, step, min, max]) => ({
      l, d, v: cfg[key],
      dec: () => void saveConfig({ [key]: Math.max(min, cfg[key] - step), preset: 'custom' }),
      inc: () => void saveConfig({ [key]: Math.min(max, cfg[key] + step), preset: 'custom' }),
    })),
    restDays: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((l, i) => {
      const on = cfg.diasDescanso[i];
      return {
        l, bg: on ? '#FAEBF0' : '#FDFBF5', bd: on ? '#D98CAE' : '#E3D9C4', c: on ? '#9C3E66' : '#4A4034',
        toggle: () => void saveConfig({ diasDescanso: cfg.diasDescanso.map((x, j) => (j === i ? !x : x)) }),
      };
    }),
    ultimoBackup: cfg.ultimoBackup
      ? `último backup: ${(() => {
          const dd = diffDays(dayKey(cfg.ultimoBackup), today);
          return dd === 0 ? 'hoje' : dd === 1 ? 'ontem' : `há ${dd} dias`;
        })()}`
      : 'nenhum backup ainda',
    exportBackup: () =>
      void safely(async () => {
        const t = Date.now();
        downloadJson(`backup-flashcards-${dayKey(t)}.json`, await buildBackup(db, t));
        await repo.updateConfig(db, { ultimoBackup: t }, t);
        toast('ok', `backup-flashcards-${dayKey(t)}.json salvo.`);
      }),
    openImportBackup: () => setModal('backup'),
    hasArchived: data.decks.some((d) => d.arquivado),
    archived: data.decks.filter((d) => d.arquivado).map((d) => ({
      nome: d.nome, dot: deckColor(d.cor).dot, totalFmt: fmtNum(stats.get(d.id)?.total ?? 0),
      restore: () => void safely(async () => {
        await repo.updateDeck(db, d.id, { arquivado: false });
        toast('ok', `“${d.nome}” voltou para os baralhos.`);
      }),
    })),
  });

  // ---------- lembrete ----------
  const lemb = cfg.lembrete;
  const lembQuando = (() => {
    if (!lemb) return '';
    const d = parseDayKey(lemb.data);
    const n = diffDays(today, lemb.data);
    const rel = n > 1 ? `em ${n} dias` : n === 1 ? 'amanhã' : n === 0 ? 'é hoje!' : `foi há ${-n} ${plural(-n, 'dia', 'dias')}`;
    return `${DIAS_SEMANA[d.getDay()]} ${String(d.getDate()).padStart(2, '0')} ${MESES[d.getMonth()]} · ${rel}`;
  })();

  // ---------- início ----------
  const faltam = Math.max(0, cfg.metaRespondidos - answered);
  const monday = mondayOf(today);
  const week = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((l, i) => {
    const k = addDays(monday, i);
    const s = dayStatus(k, today, diasMap, goalCfg);
    if (s === 'cumprido') return k === today ? { l, sym: '✦', bg: '#D98CAE', bd: 'none', c: '#FFF' } : { l, sym: '✓', bg: '#DCEBD9', bd: 'none', c: '#3E6B4A' };
    if (s === 'hoje') return { l, sym: '', bg: '#FDFBF5', bd: '1.5px solid #D98CAE', c: '#A8436E' };
    if (s === 'escudo') return { l, sym: '✓', bg: '#E4E8D6', bd: '1.5px dashed #55643F', c: '#55643F' };
    if (s === 'pouco') return { l, sym: '·', bg: '#F3E3B5', bd: 'none', c: '#7A5F14' };
    if (s === 'falhou') return { l, sym: '×', bg: '#F4D9E3', bd: 'none', c: '#9C3E66' };
    if (s === 'descanso') return { l, sym: '–', bg: 'transparent', bd: '1.5px dashed #E3D9C4', c: '#8A7C68' };
    return { l, sym: '·', bg: 'transparent', bd: '1.5px dashed #E3D9C4', c: '#8A7C68' };
  });
  const m30 = disc.dias.map((d) => {
    const t = shortDate(d.data);
    if (d.status === 'antes') return { bg: '#FDFBF5', sh: 'inset 0 0 0 1px #E3D9C4', t: `${t} · antes de começar` };
    if (d.status === 'descanso') return { bg: '#FDFBF5', sh: 'inset 0 0 0 1px #E3D9C4', t: `${t} · descanso` };
    if (d.status === 'cumprido') return { bg: d.respondidos >= 2 * d.meta ? '#579C70' : '#87BC96', sh: 'none', t: `${t} · meta batida` };
    const escudo = d.status === 'escudo' ? ' · escudo' : '';
    if (d.respondidos > 0) return { bg: '#F3E3B5', sh: 'none', t: `${t} · abaixo da meta${escudo}` };
    return { bg: '#F4D9E3', sh: 'none', t: `${t} · sem estudo${escudo}` };
  });
  const next7raw = st.dueByDay(data.cards, today, 7, activeIds);
  const next7max = Math.max(1, ...next7raw);
  const estMin = Math.round(((dueTotal + newAvailable) * avgSec) / 60);

  const escudoUso = cfg.escudoUltimoUso;

  // ---------- layout ----------
  const isMobile = winW < 760;
  const isTablet = !isMobile && winW < 1100;
  const sec = ({ inicio: 'inicio', estudar: 'estudar', sessao: 'estudar', resultado: 'estudar', baralhos: 'baralhos', baralho: 'baralhos', criar: 'baralhos', importar: 'baralhos', evolucao: 'evolucao', ajustes: 'ajustes' } as const)[screen];
  const nav = ([
    { id: 'inicio', n: '01', label: 'Início', tint: '#F3E3B5' },
    { id: 'estudar', n: '02', label: 'Estudar', tint: '#F4D9E3' },
    { id: 'baralhos', n: '03', label: 'Baralhos', tint: '#DCEBD9' },
    { id: 'evolucao', n: '04', label: 'Evolução', tint: '#E4E8D6' },
    { id: 'ajustes', n: '05', label: 'Ajustes', tint: '#FAEBF0' },
  ] as const).map((it) => {
    const a = sec === it.id;
    return {
      ...it, bg: a ? it.tint : 'transparent', mark: a && !isTablet ? '#B03D66' : 'transparent',
      fs: a ? 'italic' : 'normal', fw: a ? '700' : '500', full: !isTablet, justify: isTablet ? 'center' : 'flex-start',
      onClick: () => go(it.id),
    };
  });

  // ---------- overlays ----------
  const nbName = nb.name.trim();
  const nbDup = !!nbName && nameTaken(nbName, nb.editId);
  const nbErr = nb.tried && (!nbName || nbDup);
  const nbC = deckColor(nb.color);
  const TK = { ok: ['#FDFBF5', '#4A4034', '#4F7358', '✓'], meta: ['#F3E3B5', '#4A4034', '#D98CAE', '✦'], err: ['#F6D8D8', '#8C2635', '#C9485B', '!'] } as const;
  const tk = TK[toastState?.kind ?? 'ok'];
  const editingDeckTotal = nb.editId ? stats.get(nb.editId)?.total ?? 0 : 0;

  return {
    // layout
    deskPad: '0', frameMax: '100%', frameH: '100dvh', frameRadius: '0', frameShadow: 'none',
    showSidebar: !isMobile, sideFull: !isTablet, sideCompact: isTablet, sideW: isTablet ? '84px' : '248px',
    isMobile, nav, mainRef, showIntervals: true,
    storageDot: storageOk ? '#7FA886' : '#C9485B', storageMsg: storageOk ? 'salvo neste dispositivo' : 'não está salvando',
    isInicio: screen === 'inicio', isEstudar: screen === 'estudar', isSessao: screen === 'sessao', isResultado: screen === 'resultado',
    isBaralhos: screen === 'baralhos', isBaralho: screen === 'baralho', isCriar: screen === 'criar', isImportar: screen === 'importar',
    isEvolucao: onEvolucao, isAjustes: screen === 'ajustes',

    // metas e ofensiva
    streak: streakInfo.atual, recorde: streakInfo.recorde,
    answered, metaResp: cfg.metaRespondidos, metaCriar: cfg.metaCriados, metaNovos: cfg.limiteNovosPorDia, created, novosHoje,
    createdPct: `${cfg.metaCriados ? Math.min(100, (created / cfg.metaCriados) * 100) : 100}%`,
    novosPct: `${cfg.limiteNovosPorDia ? Math.min(100, (novosHoje / cfg.limiteNovosPorDia) * 100) : 100}%`,
    faltam, faltamCards: plural(faltam, 'card', 'cards'), metaFeita: faltam === 0,
    ringOffset: (326.7 * (1 - Math.min(1, answered / Math.max(1, cfg.metaRespondidos)))).toFixed(1),
    metaMsg: faltam ? `Faltam ${faltam}.` : 'Meta cumprida ✦',
    week, m30, m30count: disc.contados, m30met: disc.cumpridos,
    m30pct: disc.contados ? `${Math.round((disc.cumpridos / disc.contados) * 100)}%` : '—',
    escudoTitulo: cfg.escudoDisponivel ? 'Disponível' : 'Usado esta semana',
    escudoTexto: cfg.escudoDisponivel
      ? 'Se você falhar um dia, ele protege a ofensiva sozinho. Recarrega segunda.'
      : `Protegeu ${escudoUso ? `${DIAS_SEMANA[parseDayKey(escudoUso).getDay()]}, ${shortDate(escudoUso)}` : 'um dia'}. Recarrega segunda.`,
    escudoStatus: cfg.escudoDisponivel ? 'disponível' : 'usado',
    escudoUltimo: escudoUso ? `último uso: ${shortDate(escudoUso)}` : 'ainda não usado',
    todayLabel: todayLabel(today),
    hasLembrete: !!lemb, noLembrete: !lemb, lembTitulo: lemb?.titulo ?? '', lembQuando,
    openLembrete: () => {
      setLb({ titulo: lemb?.titulo ?? '', data: lemb?.data ?? '', tried: false });
      setModal('lembrete');
    },

    // início / estudar
    dueTotal, learnCount, revCount,
    estLabel: dueTotal + newAvailable ? `≈ ${Math.max(1, estMin)} min · + ${newAvailable} ${plural(newAvailable, 'novo', 'novos')}` : 'nada pendente hoje',
    decksV, decksDue, noDecksDue: !decksDue.length,
    next7: next7raw.map((v, i) => ({
      v, l: i === 0 ? 'hoje' : DIAS_SEMANA[parseDayKey(addDays(today, i)).getDay()],
      h: `${Math.round((v / next7max) * 80)}px`, c: i === 0 ? '#D98CAE' : '#F4D9E3',
    })),
    startAll: () => startSession(null),
    deckCount: activeDecks.length,
    cardCount: fmtNum(data.cards.filter((c) => activeIds.has(c.deckId)).length),

    ...sessVals(),
    ...deckVals(),
    ...impVals(),
    ...evoVals(),
    ...cfgVals(),

    leeches: leechList.map((c) => ({
      q: c.frente, deck: deckById.get(c.deckId)?.nome ?? '', err: c.lapses,
      active: !c.suspenso, susp: c.suspenso, op: c.suspenso ? 0.55 : 1,
      rewrite: () => {
        setCCState({ ...EMPTY_CC, q: c.frente, deck: c.deckId, fromLeech: true });
        go('criar');
      },
      suspend: () => void safely(async () => {
        await repo.updateCard(db, c.id, { suspenso: !c.suspenso });
        if (!c.suspenso) toast('ok', 'Card suspenso. Ele não aparece mais nas sessões.');
      }),
    })),
    noLeeches: !leechList.length,

    // navegação
    goCriar, goInicio: () => go('inicio'), goEstudar: () => go('estudar'), goAjustes: () => go('ajustes'), goBaralhos: () => go('baralhos'),
    goImport: () => {
      setImpState({ ...EMPTY_IMP, deck: defaultDeck() });
      go('importar');
    },
    openNovoBaralho,

    // modais
    modalNb: modal === 'novoBaralho', modalBackup: modal === 'backup', modalConfirm: modal === 'confirm' && !!confirm, modalLemb: modal === 'lembrete',
    closeModal: () => setModal(null),
    stop: (e: ReactMouseEvent) => e.stopPropagation(),
    nb, nbC, nbErr, nbBd: nbErr ? '#C9485B' : '#E3D9C4',
    nbErrMsg: nbDup ? 'Já existe um baralho com esse nome.' : 'Dê um nome ao baralho.',
    nbTag: nb.editId ? 'EDITAR BARALHO' : 'NOVO BARALHO', nbBtn: nb.editId ? 'Salvar' : 'Criar baralho',
    nbPrev: nbName || 'Nome do baralho', nbPrevC: nbName ? '#4A4034' : '#B5A88F',
    nbPrevSub: nb.editId ? `${fmtNum(editingDeckTotal)} cards` : '0 cards · pronto para começar',
    onNbName: (e: ChangeEvent<HTMLInputElement>) => setNb({ ...nb, name: e.target.value }),
    onNbDesc: (e: ChangeEvent<HTMLInputElement>) => setNb({ ...nb, desc: e.target.value }),
    nbColors: DECK_COLORS.map((c, i) => ({
      ...c, pick: () => setNb({ ...nb, color: i }),
      sh: nb.color === i ? '0 0 0 3px #FDFBF5, 0 0 0 5px #4A4034' : 'inset 0 0 0 1px rgba(74,64,52,.1)',
    })),
    createDeck: () => void saveDeck(),
    confirmBackup: () => {
      setModal(null);
      void pickFile('application/json,.json').then(async (f) => {
        if (!f) return;
        try {
          const b = validateBackup(JSON.parse(await f.text()));
          await importBackup(db, b);
          setScreen('inicio');
          toast('ok', 'Backup restaurado.');
        } catch (e) {
          if (!(e instanceof BackupInvalido || e instanceof SyntaxError)) console.error(e);
          toast('err', 'Esse arquivo não parece um backup do app.');
        }
      });
    },
    confTitle: confirm?.title ?? '', confTitleEm: confirm?.titleEm ?? '', confText: confirm?.text ?? '', confBtn: confirm?.btn ?? '',
    confirmAction: () => {
      setModal(null);
      void confirm?.action();
    },
    lb, lbErr: lb.tried && (!lb.titulo.trim() || !lb.data), lbBd: lb.tried && (!lb.titulo.trim() || !lb.data) ? '#C9485B' : '#E3D9C4',
    onLbTitulo: (e: ChangeEvent<HTMLInputElement>) => setLb({ ...lb, titulo: e.target.value }),
    onLbData: (e: ChangeEvent<HTMLInputElement>) => setLb({ ...lb, data: e.target.value }),
    saveLembrete: () => {
      if (!lb.titulo.trim() || !lb.data) {
        setLb({ ...lb, tried: true });
        return;
      }
      setModal(null);
      void saveConfig({ lembrete: { titulo: lb.titulo.trim(), data: lb.data } });
    },
    removeLembrete: () => {
      setModal(null);
      void saveConfig({ lembrete: null });
    },
    hasToast: !!toastState, toastText: toastState?.text ?? '', toastBg: tk[0], toastC: tk[1], toastIc: tk[2], toastSym: tk[3],
    toastMeta: toastState?.kind === 'meta', toastBottom: isMobile ? '96px' : '28px',
  };
}

export type VM = ReturnType<typeof useApp>;
