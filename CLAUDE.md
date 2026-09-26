# Flashcards da Dani

Repetição espaçada no espírito do Anki, feita para uma pessoa só (a Dani). Baralhos importados de PDF, quatro botões de avaliação, metas que ela mesma define, e uma página que mostra a evolução ao longo dos meses. Roda inteiro no navegador — sem servidor, sem conta, sem internet depois de carregado.

Status: implementado. Todas as telas, FSRS real, IndexedDB, import de PDF, metas/ofensiva/escudo, evolução e backup funcionando. O design de origem está em `docs/superpowers/specs/2026-09-05-flashcards-dani-design.md` (commit `13cd071`, em `C:\Users\otica\Projetos\flashcards-dani`); o visual veio do protótipo do Claude Design (`Flashcards da Dani.html`, bundle exportado).

## Comandos

```bash
npm run dev        # servidor de desenvolvimento (Vite)
npm test           # Vitest — lógica pura + banco (fake-indexeddb)
npm run typecheck  # tsc -b
npm run build      # typecheck + build de produção em dist/
node scripts/design-to-tsx.mjs   # regenera src/ui/generated/ a partir de design/markup.src.html
```

## Como a UI é montada (importante antes de mexer em tela)

O visual é gerado, não escrito à mão:

1. `design/markup.src.html` — markup do protótipo no formato do Claude Design (`sc-if`, `sc-for`, `{{bindings}}`, `style-hover`). Os números fixos do protótipo já foram trocados por bindings.
2. `scripts/design-to-tsx.mjs` converte isso em `src/ui/generated/View.tsx` + uma `*Screen.tsx` por tela + `hover.css`. **Não edite `src/ui/generated/` à mão** — edite o markup e rode o script.
3. `src/ui/vm.ts` (`useApp`) é o view-model: devolve um objeto com exatamente os nomes usados nos bindings, calculados a partir dos dados reais. O tipo `VM` é inferido dele, então binding sem campo correspondente quebra o `tsc`.
4. `src/ui/stats.ts` tem os cálculos de gráfico (calendário do ano, retenção, carga, composição da memória); `src/ui/theme.ts` as cores de baralho e rampas.
5. `src/ui/App.tsx` abre o banco, cria config/seed no primeiro uso, roda o escudo e carrega tudo com `useLiveQuery`.

`design/prototype-logic.jsx.txt` guarda a lógica original do protótipo, só como referência.

## Stack e decisões

| Decisão | Escolha | Por quê |
|---|---|---|
| Persistência | IndexedDB no dispositivo (via Dexie) | Sem servidor, sem conta, funciona offline, custo zero. Backup manual em JSON cobre perda de dispositivo. |
| Agendamento | FSRS com pesos padrão (via `ts-fsrs` 5.x, que implementa FSRS-6) | Padrão moderno do Anki; ~20-30% menos revisões que SM-2 para a mesma retenção. |
| Import | Detecção heurística + revisão obrigatória | PDF não tem estrutura de pergunta/resposta; humano precisa confirmar antes de gravar. |
| Estética | "Papelaria" | Amarelo manteiga, rosa e verde dessaturados, listras diagonais finas, serifada itálica. Descansa a vista em sessão longa. |
| Stack | Vite 8 + React 19 + TypeScript 5.9, CSS inline gerado do design | Estático e simples. Sem Tailwind: a estética depende de listras/sombras específicas. TypeScript fica em 5.9 (o 7 é binário nativo, e binário nativo já falhou nesta máquina). |
| Fontes | Fraunces, Karla e IBM Plex Mono em `src/assets/fonts/` | Servidas localmente para funcionar offline. |
| Extração de PDF | `pdfjs-dist` | Único jeito de pegar texto + coordenadas X/Y do PDF no navegador. |
| Testes | Vitest, TDD na lógica pura | `scheduler`, `pdf/detectCards` e `goals` são funções puras, testáveis sem navegador. |

## Módulos

Quatro núcleos de lógica pura, independentes da tela e do banco, mais a UI:

- **`src/db/`** — schema Dexie (`schema.ts`), operações (`repo.ts`), backup (`backup.ts`), baralhos de exemplo (`seed.ts`). Único lugar que fala com o IndexedDB. As funções recebem o `db` como parâmetro, então os testes usam bancos isolados.
- **`src/scheduler/`** — envelope fino sobre o `ts-fsrs`, sem efeito colateral:
  - `rate(card, nota, agora)` → `{ next, estadoAntes, estadoDepois, intervaloDias }`
  - `previewIntervals(card, agora)` → os quatro intervalos formatados
  - `buildQueue(cards, { now, novosRestantes, deckIds })` → fila ordenada
- **`src/pdf/`** — `extract.ts` depende do pdf.js (carregado sob demanda, em chunk separado); `detect.ts` é puro:
  - `extractText(file, onProgress, cancelado)` → `{ paginas }`
  - `detectCards(paginas)` → `ResultadoDeteccao`
- **`src/lib/`** — datas locais (`YYYY-MM-DD`, semana começando na segunda) e formatação em pt-BR.
- **`src/goals/`** — contadores do dia, ofensiva, disciplina, escudo. Funções puras sobre o histórico.

**Regra que sustenta os testes**: `scheduler`, `pdf/detectCards` e `goals` não conhecem Dexie nem React. Entrada → saída. É isso que torna os testes possíveis.

## Modelo de dados (IndexedDB, 5 tabelas)

Datas são guardadas em epoch ms (`number`), não `Date`, para o backup JSON ser ida-e-volta sem conversão.

**`decks`**
`id` · `nome` · `descricao` (assuntos, aparece como subtítulo) · `cor` (índice 0-4 em `DECK_COLORS`) · `criadoEm` · `arquivado`

**`cards`** — conteúdo + estado FSRS guardado tal como a biblioteca o produz
`id` · `deckId` · `frente` · `verso` · `tags[]` · `origem` (manual | pdf) · `criadoEm` · `suspenso`
`due` · `stability` · `difficulty` · `elapsed_days` · `scheduled_days` · `learning_steps` · `reps` · `lapses` · `state` · `last_review`

**`reviews`** — um registro por avaliação, nunca editado nem apagado (nem quando o card é excluído); fonte de todos os gráficos
`id` · `cardId` · `deckId` · `avaliadoEm` · `nota` (1-4) · `estadoAntes` · `estadoDepois` · `intervaloDias` · `tempoMs`
(`estadoDepois` permite reconstruir a composição da memória em meses passados.)

**`dias`** — um registro por dia, chaveado por data
`data` (YYYY-MM-DD) · `respondidos` · `criados` · `novosVistos` · `metaRespondidos` · `metaCriados` · `descanso` · `escudoUsado`

**`config`** — registro único (`id: 'cfg'`)
`metaRespondidos` = 30 · `metaCriados` = 5 · `limiteNovosPorDia` = 20 · `preset` · `diasDescanso` (7 booleanos, Seg..Dom) · `escudoDisponivel` · `escudoRecarregadoEm` (segunda da semana) · `escudoUltimoUso` · `inicio` (primeiro dia de uso; dias anteriores não contam como falha) · `ultimoBackup` · `lembrete` (`{ titulo, data }` da próxima prova, ou null)

Índices em `cards`: `deckId`, `due`, `state`.

**Primeiro uso**: cria a config e os 5 baralhos de exemplo do protótipo (Anatomia II, Fisiologia, Farmacologia, Patologia, Clínica Médica). Dá para arquivá-los.

**Por que a meta é copiada para dentro do dia**: as metas são copiadas para o registro do dia no primeiro evento daquele dia. Se a meta subir de 30 para 60, dias passados continuam avaliados contra a meta que valia na época — senão, mudar a meta reescreveria o histórico e transformaria dias cumpridos em falhados.

Dia sem nenhum evento não gera registro. Na leitura, ausência conta como dia falhado — a menos que o dia da semana esteja em `diasDescanso`, e aí é neutro.

## Agendamento (FSRS)

Os quatro botões mapeiam direto nas notas do FSRS. Cada um exibe o intervalo resultante **antes** do clique (calculado para as quatro notas de uma vez), para ensinar a pessoa a calibrar a própria avaliação:

| Nota | Botão | Intervalo típico |
|---|---|---|
| 1 | Errei | ~1 min |
| 2 | Difícil | ~3 dias |
| 3 | Bom | ~9 dias |
| 4 | Fácil | ~21 dias |

**Errei** zera o progresso do card, incrementa `lapses` e o devolve ainda na sessão atual (estado vira Reaprendendo, `due` cai em ~1 min). As outras três empurram o card para frente.

**Montagem da fila** (nessa ordem):
1. Aprendendo/Reaprendendo com `due` ≤ agora
2. Revisão com `due` até o fim do dia de hoje
3. Novos, até `limiteNovosPorDia` menos os novos já vistos hoje

Novos são distribuídos ao longo da fila, não empilhados no começo.

**Dentro da sessão**: todo card que sai de uma avaliação ainda em Aprendendo/Reaprendendo volta para o fim da fila (marcado "DE NOVO" se foi Errei, "APRENDENDO" nos demais). É o comportamento do Anki: com os passos padrão (1m, 10m), um card novo avaliado Bom aparece mais uma vez antes de graduar. A decisão de reenfileirar usa `rate()` síncrono; a gravação no banco acontece em paralelo.

**Distinção importante**: `limiteNovosPorDia` é teto (corta a fila); `metaRespondidos` é alvo (só pinta o anel de progresso). Bater a meta não encerra a sessão; não bater não impede de continuar.

## Import de PDF

Três passos: extrair → detectar → revisar. Nada entra no banco sem confirmação.

**Extração**: `pdfjs-dist` devolve, por página, fragmentos de texto com coordenadas X/Y (necessárias para reconhecer layout de duas colunas).

**Detecção — seis estratégias, em ordem de especificidade**:
1. Prefixos (`P:`/`R:`, `Q:`/`A:`, `Pergunta:`/`Resposta:`, `Frente:`/`Verso:`)
2. Duas colunas (agrupamento por coordenada X; coluna esquerda = frente)
3. Separador na linha (`termo — definição`, `termo | definição`, `termo ⇥ definição`)
4. Lista numerada (`1.` pergunta seguida da resposta)
5. Linhas alternadas (ímpar = frente, par = verso)
6. Blocos separados por linha em branco (primeira linha = frente, resto = verso)

Par válido: frente e verso não vazios, frente ≤ 300 caracteres, verso ≤ 1000 caracteres.

**Critério de desempate**: `confiança = pares válidos / (pares válidos + linhas descartadas)`. Vence a maior confiança; empate desempata pela ordem acima (mais específica → mais genérica), porque prefixos explícitos são sinal muito mais forte que "linhas alternadas" (que casa com quase qualquer texto).

**Desvio do spec, necessário**: sem ajuste, "linhas alternadas" tira ~100% em quase qualquer texto (nunca descarta linha) e venceria sempre. Por isso as genéricas têm peso: alternadas × 0,6, blocos × 0,8 (`ESTRATEGIAS` em `detect.ts`). Blocos também exige pelo menos dois blocos. Confiança abaixo de 60% mostra o aviso amarelo na revisão.

**Linhas e vãos**: a extração agrupa fragmentos por Y em linhas; dentro da linha, um vão horizontal grande vira um segmento separado (é o que alimenta "duas colunas" e o separador por tab). Um espaço vertical maior que 1,5× o passo normal marca quebra de bloco. PDF com menos de ~10 caracteres por página é tratado como escaneado.

Se nenhuma estratégia monta pares, o import mostra erro ("não achei perguntas") em vez de uma revisão vazia. Se não houver baralho, o import cria um com o nome do arquivo.

**Revisão**: tabela editável mostrando a estratégia vencedora e a confiança. Ela pode trocar a estratégia num seletor (recalcula na hora), editar qualquer célula, apagar linhas e escolher o baralho de destino. Cards idênticos a algum já existente vêm marcados como duplicados e desmarcados por padrão.

**Casos de erro no import**:
- PDF escaneado sem camada de texto → avisar em português claro, não importar zero cards em silêncio.
- PDF grande → processar página a página, com barra de progresso.
- PDF protegido por senha → avisar e abortar.

## Metas e disciplina

**Metas** (editáveis a qualquer momento — tela Hoje tocando no anel, ou Ajustes):
- Responder N cards/dia (padrão 30)
- Criar N cards/dia (padrão 5)
- Presets: Leve 15 · Firme 30 · Intenso 60
- Dias de descanso configuráveis (não contam como falha, não quebram ofensiva)

**Disciplina**: dia conta como cumprido ao atingir a meta de respondidos. Três números, não um:
- **Ofensiva**: dias seguidos cumpridos + recorde
- **Disciplina 30 dias**: % de dias cumpridos, descontando dias de descanso
- **Escudo**: 1 por semana, recarrega na segunda

**Por que três e não um**: ofensiva sozinha é frágil — uma semana de gripe zera 40 dias de esforço, e é aí que a pessoa larga o app. A disciplina de 30 dias absorve tropeços e continua honesta; o escudo dá margem humana.

**Como o escudo é gasto**: automaticamente, na primeira vez que ela abrir o app depois de um dia falhado (a tela Hoje avisa que foi usado). Não é um botão — pedir para reivindicar manualmente o perdão de uma falha é constrangedor e ninguém clica. O dia coberto conta como cumprido para a ofensiva, mas **continua falhado no cálculo da disciplina de 30 dias**: a ofensiva é motivação, a disciplina é medição, e a medição não pode mentir.

Detalhes de implementação (`aplicarEscudo` em `goals/index.ts`): o escudo cobre o último dia útil falhado (pulando descansos, até 7 dias atrás), usando o escudo *da semana daquele dia*. Uma falha no domingo, vista na segunda, usa o escudo da semana anterior e ainda recarrega o da nova. Roda ao abrir o app e de novo na virada do dia se o app ficar aberto.

## Telas

Navegação: Início · Estudar · Baralhos · Evolução · Ajustes (barra lateral no desktop, compacta no tablet, barra inferior no celular).

1. **Início** — anel da meta, cards para revisar hoje com estimativa de tempo, ofensiva com a semana, disciplina 30 dias, escudo, baralhos com pendências, carga dos próximos 7 dias. Lembrete de prova editável (post-it no canto).
2. **Estudar** → **Sessão** → **Resultado** — frente → virar → avaliar; atalhos 1-4 e espaço; carimbo animado de feedback; resultado com retenção, tempo e distribuição das notas.
3. **Baralhos** → **Baralho** → **Criar/editar card** — criar, editar (nome, assuntos, cor) e arquivar baralho; busca; clicar num card abre a edição (salvar, excluir, suspender).
4. **Importar PDF** — arrastar ou escolher arquivo, progresso por página, revisão editável, conclusão.
5. **Evolução** — painel de longo prazo (ver abaixo). Só é calculado com a tela aberta.
6. **Ajustes** — presets, metas, dias de descanso, backup (exportar/importar com confirmação), baralhos arquivados (restaurar).

A tela "componentes & estados" do protótipo era um mostruário do design system e não entrou no app.

## Página Evolução

1. Quatro indicadores: ofensiva, disciplina 30d, retenção, escudo
2. Calendário de estudo: um ano de quadrados, mais escuro = mais cards respondidos, contorno rosa nos dias em que bateu a meta
3. Retenção por semana: % de revisões avaliadas Bom ou Fácil (só conta cards que estavam em Revisão; aprendizado inicial não entra)
4. Carga dos próximos 14 dias: quantas revisões o FSRS já agendou
5. Composição da memória: Novo/Aprendendo/Jovem/Maduro, mês a mês (faixa vem de `state`; em Revisão, `scheduled_days` < 21 = Jovem, ≥ 21 = Maduro — mesmo corte do Anki). Meses passados são reconstruídos pela última revisão de cada card antes do fim do mês (`estadoDepois` + `intervaloDias`).
6. Cards que mais derrubam: tabela de leeches (8+ lapsos), com botão para reescrever ou suspender

### Paleta dos gráficos

Validada com `validate_palette.js` contra superfície `#FDFBF5` (modo claro). Nada escolhido no olho.

- Rampa verde (calendário, composição): `#87BC96` → `#579C70` → `#37794E` → `#1A5133`
- Rampa rosa (alternativa): `#DE97B5` → `#C86691` → `#AE3D6B` → `#7B2749`
- Duas séries: `#C2456F` (rosa) + `#2F7FBF` (azul) — CVD ΔE 13,7

**Restrição da validação**: rosa e verde **nunca** codificam duas séries no mesmo gráfico — o par reprova em daltonismo deutan (ΔE 3,5, as duas séries ficam indistinguíveis). Cores da marca continuam rosa/verde; codificação de dados usa rosa/azul.

**Regras de marca em todos os gráficos**: série única não leva legenda (o título já nomeia); duas+ levam legenda e rótulo direto; linha de 2px; marcadores de 8px+; ponta de barra arredondada em 4px ancorada na base; 2px de respiro entre segmentos empilhados; grade recessiva; tooltip no hover. Rótulo e valor em cor de texto, nunca na cor da série.

## Design system — estética "Papelaria"

| Token | Cor | Uso |
|---|---|---|
| manteiga | `#F6EFE0` | fundo |
| papel | `#FDFBF5` | superfície |
| tinta | `#4A4034` | texto |
| suave | `#8A7C68` | secundário |
| linha | `#E3D9C4` | bordas |
| rosa | `#D98CAE` | acento e Errei |
| verde | `#7FA886` | acerto e Bom |
| amarelo | `#D9BE6B` | Difícil |
| azul | `#7FA0B8` | Fácil |

Listras diagonais finas a 135° em `rgba(217,140,174,.09)`; títulos em serifada itálica (Fraunces); corpo em Karla; monoespaçada IBM Plex Mono para labels/metadados; sombras suaves `0 2px 8px rgba(150,130,100,.08)`; cantos de 12px.

## Erros tratados

- **IndexedDB indisponível** (aba anônima): avisar, não perder trabalho em silêncio.
- **Sessão fechada no meio**: fila se reconstrói do banco — nada se perde, cada avaliação grava na hora.
- **Import duplicado**: detectado e desmarcado por padrão.
- **Backup corrompido**: valida schema antes de gravar, recusa com mensagem clara.
- **Relógio do sistema alterado**: revisões usam a data do momento da gravação, nunca recalculada retroativamente.

## Testes

Vitest, escritos antes do código (TDD), cobrindo a lógica pura:

- **scheduler**: as quatro notas a partir de cada estado; Errei devolve o card à sessão; intervalos crescem com a nota; montagem e ordenação da fila; teto de novos por dia.
- **pdf/detectCards**: cada uma das seis estratégias com um PDF de exemplo; a pontuação escolhe a certa; texto sem estrutura devolve confiança baixa em vez de lixo.
- **goals**: cumprir e falhar a meta; dia de descanso não quebra a ofensiva; escudo cobre um dia e recarrega na segunda; disciplina de 30 dias com descansos no meio; mudar a meta hoje não reescreve ontem.
- **db**: migrações e ida-e-volta do backup.

A UI não tem teste automatizado — é verificada rodando o app no navegador, com screenshots anexados ao final de cada etapa.

## Fora de escopo

Sincronização em nuvem · login · modo escuro · otimização dos pesos do FSRS · cards cloze · imagens ou áudio nos cards · import de `.apkg` · compartilhamento de baralhos · aplicativo nativo.

Modo escuro e otimização dos pesos são as duas primeiras candidatas a uma segunda fase — a otimização só faz sentido depois de alguns meses de histórico acumulado (precisa de centenas de revisões para treinar).
