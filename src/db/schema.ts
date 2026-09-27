import Dexie, { type Table } from 'dexie';
import type { DiaRec } from '../goals';
import type { Nota, SchedFields } from '../scheduler';

export interface Deck {
  id: string;
  nome: string;
  descricao: string;
  /** Índice em DECK_COLORS. */
  cor: number;
  criadoEm: number;
  arquivado: boolean;
}

export interface CardRow extends SchedFields {
  id: string;
  deckId: string;
  frente: string;
  verso: string;
  tags: string[];
  origem: 'manual' | 'pdf' | 'anki' | 'arquivo';
  criadoEm: number;
  suspenso: boolean;
  /** Ids na tabela media. Ausente em cards antigos = sem imagens. */
  imgsFrente?: string[];
  imgsVerso?: string[];
}

export interface Media {
  id: string;
  blob: Blob;
  mime: string;
  criadoEm: number;
}

/** Um registro por avaliação. Nunca editado nem apagado: é a fonte dos gráficos. */
export interface Review {
  id?: number;
  cardId: string;
  deckId: string;
  avaliadoEm: number;
  nota: Nota;
  estadoAntes: number;
  estadoDepois: number;
  intervaloDias: number;
  tempoMs: number;
}

export type Dia = DiaRec;

export interface Lembrete {
  titulo: string;
  /** YYYY-MM-DD */
  data: string;
}

export type Preset = 'leve' | 'firme' | 'intenso' | 'custom';

export interface Config {
  id: 'cfg';
  metaRespondidos: number;
  metaCriados: number;
  limiteNovosPorDia: number;
  preset: Preset;
  /** Seg..Dom */
  diasDescanso: boolean[];
  escudoDisponivel: boolean;
  escudoRecarregadoEm: string;
  escudoUltimoUso: string | null;
  /** Primeiro dia de uso. */
  inicio: string;
  ultimoBackup: number | null;
  lembrete: Lembrete | null;
}

export class FlashcardsDB extends Dexie {
  decks!: Table<Deck, string>;
  cards!: Table<CardRow, string>;
  reviews!: Table<Review, number>;
  dias!: Table<Dia, string>;
  config!: Table<Config, string>;
  media!: Table<Media, string>;

  constructor(name = 'flashcards-dani') {
    super(name);
    this.version(1).stores({
      decks: 'id',
      cards: 'id, deckId, due, state',
      reviews: '++id, cardId, deckId, avaliadoEm',
      dias: 'data',
      config: 'id',
    });
    this.version(2).stores({ media: 'id' });
  }
}

export const db = new FlashcardsDB();
