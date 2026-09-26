import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DAY_MS, dayKey } from '../lib/dates';
import { State } from '../scheduler';
import { BackupInvalido, exportBackup, importBackup, validateBackup } from './backup';
import { addCards, createDeck, ensureSetup, recordReview, runShield, updateConfig } from './repo';
import { FlashcardsDB } from './schema';
import { SEED } from './seed';

const NOW = new Date(2026, 8, 26, 10, 0).getTime();
let db: FlashcardsDB;
let n = 0;

beforeEach(async () => {
  db = new FlashcardsDB(`test-${++n}`);
  await db.open();
});
afterEach(async () => {
  await db.delete();
});

describe('ensureSetup', () => {
  it('no primeiro uso cria config e baralhos de exemplo, e só uma vez', async () => {
    await ensureSetup(db, NOW);
    await ensureSetup(db, NOW);
    expect(await db.decks.count()).toBe(SEED.length);
    expect(await db.cards.count()).toBe(SEED.reduce((a, d) => a + d.cards.length, 0));
    const cfg = await db.config.get('cfg');
    expect(cfg?.inicio).toBe(dayKey(NOW));
  });
});

describe('recordReview', () => {
  it('grava card, histórico e contadores do dia', async () => {
    await ensureSetup(db, NOW, false);
    const deckId = await createDeck(db, 'Micro', '', 0, NOW);
    await addCards(db, deckId, [{ frente: 'a', verso: 'b' }], 'manual', NOW);
    const card = (await db.cards.toArray())[0];
    await recordReview(db, card, 3, NOW + 1000, 4200);
    const after = await db.cards.get(card.id);
    expect(after?.state).not.toBe(State.New);
    const reviews = await db.reviews.toArray();
    expect(reviews).toHaveLength(1);
    expect(reviews[0]).toMatchObject({ nota: 3, estadoAntes: State.New, tempoMs: 4200 });
    const dia = await db.dias.get(dayKey(NOW));
    expect(dia).toMatchObject({ respondidos: 1, criados: 1, novosVistos: 1, metaRespondidos: 30 });
  });
});

describe('updateConfig', () => {
  it('mudar a meta atualiza hoje mas não ontem', async () => {
    await ensureSetup(db, NOW - DAY_MS, false);
    const deckId = await createDeck(db, 'Micro', '', 0, NOW);
    await addCards(db, deckId, [{ frente: 'a', verso: 'b' }], 'manual', NOW - DAY_MS);
    await addCards(db, deckId, [{ frente: 'c', verso: 'd' }], 'manual', NOW);
    await updateConfig(db, { metaRespondidos: 60 }, NOW);
    expect((await db.dias.get(dayKey(NOW - DAY_MS)))?.metaRespondidos).toBe(30);
    expect((await db.dias.get(dayKey(NOW)))?.metaRespondidos).toBe(60);
  });
});

describe('runShield', () => {
  it('cobre ontem e registra o uso', async () => {
    await ensureSetup(db, NOW - 3 * DAY_MS, false);
    const usado = await runShield(db, NOW);
    expect(usado).toBe(dayKey(NOW - DAY_MS));
    expect((await db.dias.get(usado!))?.escudoUsado).toBe(true);
    expect((await db.config.get('cfg'))?.escudoDisponivel).toBe(false);
    expect(await runShield(db, NOW)).toBeNull();
  });
});

describe('backup', () => {
  it('ida e volta preserva tudo', async () => {
    await ensureSetup(db, NOW);
    const card = (await db.cards.toArray())[0];
    await recordReview(db, card, 4, NOW, 1000);
    const b = await exportBackup(db, NOW);
    const json = JSON.parse(JSON.stringify(b));

    const other = new FlashcardsDB(`test-${++n}`);
    await importBackup(other, validateBackup(json));
    expect(await other.cards.count()).toBe(await db.cards.count());
    expect(await other.reviews.count()).toBe(1);
    expect((await other.cards.get(card.id))?.state).toBe((await db.cards.get(card.id))?.state);
    await other.delete();
  });

  it('recusa arquivo que não é backup, sem tocar em nada', async () => {
    expect(() => validateBackup({ foo: 1 })).toThrow(BackupInvalido);
    expect(() => validateBackup({ app: 'flashcards-dani', versao: 1, decks: [], cards: [{ id: 'x', deckId: 'nope' }], reviews: [], dias: [], config: {} })).toThrow(BackupInvalido);
  });
});
