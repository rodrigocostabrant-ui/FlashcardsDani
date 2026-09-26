export const DECK_COLORS = [
  { bg: '#F4D9E3', ink: '#9C3E66', dot: '#D98CAE', n: 'Rosa bebê', pat: 'radial-gradient(rgba(201,72,91,.18) 1.2px,transparent 1.7px)', ps: '12px 12px' },
  { bg: '#DCEBD9', ink: '#3E6B4A', dot: '#7FA886', n: 'Verde claro', pat: 'repeating-linear-gradient(135deg,rgba(62,107,74,.12) 0 1px,transparent 1px 8px)', ps: 'auto' },
  { bg: '#F3E3B5', ink: '#7A5F14', dot: '#D9BE6B', n: 'Manteiga', pat: 'repeating-linear-gradient(to bottom,transparent 0 13px,rgba(201,72,91,.14) 13px 14px)', ps: 'auto' },
  { bg: '#E4E8D6', ink: '#55643F', dot: '#A9B89A', n: 'Sálvia', pat: 'linear-gradient(rgba(85,100,63,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(85,100,63,.08) 1px,transparent 1px)', ps: '12px 12px' },
  { bg: '#F6D8D8', ink: '#A3303F', dot: '#C9485B', n: 'Cereja', pat: 'radial-gradient(rgba(163,48,63,.16) 1.2px,transparent 1.7px)', ps: '10px 10px' },
] as const;

export const deckColor = (i: number) => DECK_COLORS[((i % DECK_COLORS.length) + DECK_COLORS.length) % DECK_COLORS.length];

/** Rampa verde do calendário, validada contra #FDFBF5. */
export const YEAR_LEVELS = ['#EDE4D0', '#C9E0CC', '#87BC96', '#579C70', '#37794E'];
export const MEM_COLORS = ['#C9E0CC', '#87BC96', '#579C70', '#1A5133'];

export const STATE_TAGS = {
  REVISÃO: ['#F4D9E3', '#9C3E66'],
  NOVO: ['#DCEBD9', '#3E6B4A'],
  APRENDENDO: ['#F3E3B5', '#7A5F14'],
  DOMINADO: ['#E4E8D6', '#55643F'],
  SUSPENSO: ['#F6EFE0', '#8A7C68'],
} as const;
