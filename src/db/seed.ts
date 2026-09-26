/** Baralhos de exemplo do protótipo, criados só no primeiro uso. */
export const SEED: { nome: string; descricao: string; cor: number; cards: [string, string][] }[] = [
  {
    nome: 'Anatomia II', descricao: 'Membro superior · tórax', cor: 0,
    cards: [
      ['Quais ramos ventrais formam o plexo braquial?', 'C5, C6, C7, C8 e T1.'],
      ['Qual nervo é lesado na fratura do colo cirúrgico do úmero?', 'Nervo axilar — perda da abdução do ombro (deltoide) e da sensibilidade na face lateral do braço.'],
      ['Artéria que irriga o nó sinoatrial na maioria das pessoas', 'Artéria coronária direita (cerca de 60% dos casos).'],
      ['Músculos do manguito rotador', 'Supraespinal, infraespinal, redondo menor e subescapular.'],
      ['“Mão em garra” sugere lesão de qual nervo?', 'Nervo ulnar.'],
    ],
  },
  {
    nome: 'Fisiologia', descricao: 'Cardiovascular · renal', cor: 1,
    cards: [
      ['O que diz a lei de Frank-Starling?', 'Quanto maior o volume diastólico final, maior a força de contração ventricular — até um limite.'],
      ['Onde o ADH age no néfron?', 'No ducto coletor: insere aquaporina-2 na membrana e aumenta a reabsorção de água.'],
      ['Fase 2 do potencial de ação do cardiomiócito', 'Platô — a entrada de Ca²⁺ (canais tipo L) equilibra a saída de K⁺.'],
      ['Principal estímulo para liberação de renina', 'Queda da pressão de perfusão na arteríola aferente.'],
    ],
  },
  {
    nome: 'Farmacologia', descricao: 'Autonômico · anti-hipertensivos', cor: 2,
    cards: [
      ['Mecanismo de ação dos IECA', 'Inibem a enzima conversora de angiotensina → ↓ angiotensina II e ↑ bradicinina (daí a tosse seca).'],
      ['Antídoto da intoxicação por paracetamol', 'N-acetilcisteína — repõe a glutationa hepática.'],
      ['Principais efeitos adversos dos aminoglicosídeos', 'Nefrotoxicidade e ototoxicidade, ambas dose-dependentes.'],
      ['Warfarina: qual exame monitora a dose?', 'TP/INR — alvo habitual entre 2 e 3.'],
      ['Betabloqueadores cardiosseletivos — exemplos', 'Atenolol, metoprolol e bisoprolol (β1 > β2).'],
      ['Antídoto dos benzodiazepínicos', 'Flumazenil.'],
      ['Mecanismo dos IBP (omeprazol)', 'Inibição irreversível da H⁺/K⁺-ATPase da célula parietal.'],
      ['Sinal clássico de intoxicação digitálica', 'Xantopsia (visão amarelada), náuseas e arritmias.'],
    ],
  },
  {
    nome: 'Patologia', descricao: 'Inflamação · neoplasias', cor: 4,
    cards: [
      ['Tríade de Virchow', 'Estase, lesão endotelial e hipercoagulabilidade.'],
      ['Tipo de necrose do infarto do miocárdio', 'Necrose de coagulação.'],
      ['Tipo de necrose da tuberculose', 'Necrose caseosa.'],
      ['Hiperplasia × hipertrofia', 'Hiperplasia: ↑ número de células. Hipertrofia: ↑ tamanho das células.'],
    ],
  },
  {
    nome: 'Clínica Médica', descricao: 'Cardiologia · pneumologia', cor: 3,
    cards: [
      ['Critérios de Light: quando o derrame é exsudato?', 'Proteína pleural/sérica > 0,5, LDH pleural/sérica > 0,6 ou LDH pleural > 2/3 do limite superior.'],
      ['Tríade de Beck', 'Hipotensão, turgência jugular e abafamento de bulhas — tamponamento cardíaco.'],
      ['CURB-65: o que cada letra avalia?', 'Confusão, Ureia > 50, FR ≥ 30, PA baixa e idade ≥ 65.'],
    ],
  },
];
