import { useLiveQuery } from 'dexie-react-hooks';
import { useEffect, useRef, useState } from 'react';
import { ensureSetup, runShield } from '../db/repo';
import { db } from '../db/schema';
import { dayKey, parseDayKey } from '../lib/dates';
import { DIAS_SEMANA, shortDate } from '../lib/format';
import { View } from './generated/View';
import type { Snapshot } from './stats';
import { useApp } from './vm';

type Boot = 'loading' | 'ready' | 'blocked';

const shieldMsg = (k: string) => `Escudo usado: ${DIAS_SEMANA[parseDayKey(k).getDay()]}, ${shortDate(k)}, ficou protegido.`;

export function App() {
  const [boot, setBoot] = useState<Boot>('loading');
  const [aviso, setAviso] = useState<string | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let lastDay = dayKey(Date.now());
    (async () => {
      try {
        await db.open();
        await ensureSetup(db, Date.now());
        const used = await runShield(db, Date.now());
        if (used) setAviso(shieldMsg(used));
        setBoot('ready');
      } catch (e) {
        console.error(e);
        setBoot('blocked');
      }
    })();
    // Se o app ficar aberto na virada do dia, confere o escudo de novo.
    const t = setInterval(() => {
      const d = dayKey(Date.now());
      if (d === lastDay) return;
      lastDay = d;
      void runShield(db, Date.now()).then((used) => used && setAviso(shieldMsg(used)));
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  const data = useLiveQuery(async (): Promise<Snapshot | undefined> => {
    if (boot !== 'ready') return undefined;
    const [decks, cards, reviews, dias, config] = await Promise.all([
      db.decks.toArray(), db.cards.toArray(), db.reviews.toArray(), db.dias.toArray(), db.config.get('cfg'),
    ]);
    return config ? { decks, cards, reviews, dias, config } : undefined;
  }, [boot]);

  if (boot === 'blocked') return <Blocked />;
  if (!data) return <Loading />;
  return <Main data={data} aviso={aviso} />;
}

function Main({ data, aviso }: { data: Snapshot; aviso: string | null }) {
  const v = useApp(data, true, aviso);
  return <View v={v} />;
}

const center = {
  minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
  background: '#F6EFE0', backgroundImage: 'repeating-linear-gradient(135deg,rgba(217,140,174,.09) 0 1px,transparent 1px 11px)',
} as const;

function Loading() {
  return (
    <div style={center}>
      <div style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12, padding: 24, borderRadius: 22, background: '#FDFBF5', border: '1px solid #E3D9C4' }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.12em', color: '#8A7C68' }}>CARREGANDO</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['70%', '90%', '50%'].map((w, i) => (
            <i key={w} style={{ height: 14, width: w, borderRadius: 999, background: '#F6EFE0', animation: `dot 1.4s ${i * 0.2}s infinite` }} />
          ))}
        </div>
        <span style={{ fontFamily: "'Fraunces',serif", fontStyle: 'italic', fontSize: 17, color: '#8A7C68' }}>Abrindo seus baralhos…</span>
      </div>
    </div>
  );
}

function Blocked() {
  return (
    <div style={center}>
      <div style={{ maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 10, padding: 28, borderRadius: 22, background: '#F6D8D8' }}>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.12em', color: '#A3303F' }}>ARMAZENAMENTO BLOQUEADO</span>
        <span style={{ fontFamily: "'Fraunces',serif", fontSize: 24, lineHeight: 1.15, color: '#4A4034' }}>Aqui não dá para guardar seu progresso.</span>
        <span style={{ fontSize: 14.5, color: '#6E3A40', lineHeight: 1.5 }}>
          O navegador bloqueou o armazenamento local — isso costuma acontecer em aba anônima. Abra o app numa janela normal para não perder nada.
        </span>
      </div>
    </div>
  );
}
