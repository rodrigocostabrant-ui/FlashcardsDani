// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function ImportarScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          importar
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
          {"Do resumo para "}
          <span style={{ fontStyle: "italic", color: "#4F7358" }}>
            os cards.
          </span>
        </h1>
      </div>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {v.impSteps.map((st, i_st) => (
          <Fragment key={i_st}>
            <div style={{ flex: "1 1 150px", display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", borderRadius: "999px", background: st.bg, border: `1px solid ${st.bd}` }}>
              <span style={{ width: "28px", height: "28px", flex: "none", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", background: st.cb, color: st.cc }}>
                {st.sym}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", letterSpacing: ".1em", color: st.tc }}>
                {st.l}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
      {!!(v.imp1) && (
        <>
          <div onDragOver={v.onDragOver} onDragLeave={v.onDragLeave} onDrop={v.onDrop} style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", padding: "clamp(36px,7cqi,64px) 24px", borderRadius: "28px", border: `2px dashed ${v.dropBd}`, backgroundColor: v.dropBg, backgroundImage: "repeating-linear-gradient(135deg,rgba(217,140,174,.10) 0 1px,transparent 1px 10px)", transition: "background-color .2s" }}>
            <div style={{ position: "relative", width: "92px", height: "116px", marginBottom: "6px", transform: "rotate(-4deg)" }}>
              <div style={{ position: "absolute", inset: "0", borderRadius: "6px", background: "#FDFBF5", border: "1px solid #E3D9C4", boxShadow: "6px 6px 0 -1px #F3E3B5", clipPath: "polygon(0 0,72% 0,100% 22%,100% 100%,0 100%)" }} />
              <div style={{ position: "absolute", right: "0", top: "0", width: "26px", height: "26px", background: "#E3D9C4", clipPath: "polygon(0 0,100% 100%,0 100%)", borderRadius: "0 0 0 4px" }} />
              <div style={{ position: "absolute", left: "14px", right: "18px", top: "40px", display: "flex", flexDirection: "column", gap: "7px" }}>
                <i style={{ height: "3px", background: "#E3D9C4", borderRadius: "2px" }} />
                <i style={{ height: "3px", background: "#E3D9C4", borderRadius: "2px", width: "80%" }} />
                <i style={{ height: "3px", background: "#F3E3B5", borderRadius: "2px" }} />
                <i style={{ height: "3px", background: "#E3D9C4", borderRadius: "2px", width: "60%" }} />
              </div>
              <span style={{ position: "absolute", left: "-10px", bottom: "14px", padding: "3px 8px", borderRadius: "5px", background: "#C9485B", color: "#FFF", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em" }}>
                PDF
              </span>
            </div>
            <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "clamp(26px,4.4cqi,36px)" }}>
              {"Arraste seu arquivo "}
              <span style={{ fontStyle: "italic", color: "#A8436E" }}>
                aqui
              </span>
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", padding: "4px 10px", borderRadius: "999px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
                PDF
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", padding: "4px 10px", borderRadius: "999px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
                ANKI .APKG
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", padding: "4px 10px", borderRadius: "999px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
                PLANILHA .CSV
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", padding: "4px 10px", borderRadius: "999px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
                TEXTO .TXT
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".08em", padding: "4px 10px", borderRadius: "999px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
                BARALHO .JSON
              </span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
              <button className="dh14" onClick={v.startImport} style={{ height: "50px", padding: "0 26px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
                Escolher arquivo
              </button>
              <button className="dh1" onClick={v.togglePaste} style={{ height: "50px", padding: "0 22px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>
                Colar texto
              </button>
            </div>
            <span style={{ fontSize: "13px", color: "#8A7C68", maxWidth: "440px", lineHeight: "1.5" }}>
              Baralhos do Anki vêm com imagens; do Quizlet, exporte como texto. O arquivo é lido aqui mesmo, no seu dispositivo — nada é enviado.
            </span>
          </div>
          {!!(v.impPasteOpen) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", padding: "22px", borderRadius: "22px", background: "#FDFBF5", border: "1px solid #E3D9C4", animation: "fadeUp .25s ease both" }}>
                <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", color: "#A8436E" }}>
                  COLE SEUS CARDS
                </label>
                <textarea value={v.impPaste} onChange={v.onImpPaste} rows={8} placeholder="Uma pergunta e resposta por linha, separadas por tab, “—” ou “|”. Também funciona com P: / R:, listas numeradas e blocos separados por linha em branco." style={{ width: "100%", resize: "vertical", padding: "14px 16px", borderRadius: "14px", border: "1px solid #E3D9C4", background: "#F6EFE0", fontSize: "14.5px", lineHeight: "1.5", outline: "none" }} />
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <button onClick={v.togglePaste} style={{ height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button className="dh14" onClick={v.importPasted} style={{ height: "44px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
                    Montar cards
                  </button>
                </div>
              </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "28px" }}>
            <div style={{ flex: "2 1 380px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <h3 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "21px" }}>
                {"Como a gente acha as "}
                <span style={{ fontStyle: "italic" }}>
                  perguntas
                </span>
              </h3>
              <ol style={{ margin: "0", padding: "0", listStyle: "none", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "8px 22px" }}>
                <li style={{ display: "flex", gap: "10px", fontSize: "13.5px", lineHeight: "1.4" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E" }}>
                    01
                  </span>
                  Prefixos como P: / R:
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "13.5px", lineHeight: "1.4" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E" }}>
                    02
                  </span>
                  Tabelas em duas colunas
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "13.5px", lineHeight: "1.4" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E" }}>
                    03
                  </span>
                  termo — definição
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "13.5px", lineHeight: "1.4" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E" }}>
                    04
                  </span>
                  Listas numeradas
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "13.5px", lineHeight: "1.4" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E" }}>
                    05
                  </span>
                  Linhas alternadas
                </li>
                <li style={{ display: "flex", gap: "10px", fontSize: "13.5px", lineHeight: "1.4" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E" }}>
                    06
                  </span>
                  Blocos separados por linha em branco
                </li>
              </ol>
            </div>
            <div style={{ flex: "1 1 220px", display: "flex", flexDirection: "column", gap: "8px", padding: "18px", borderRadius: "18px", background: "#E4E8D6" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "18px" }}>
                Nada entra sem você ver.
              </span>
              <span style={{ fontSize: "13px", color: "#55643F", lineHeight: "1.45" }}>
                Você revisa, edita e escolhe cada card antes de adicionar.
              </span>
            </div>
          </div>
        </>
      )}
      {!!(v.imp2) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "26px", padding: "clamp(24px,5cqi,48px)", borderRadius: "28px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ padding: "6px 10px", borderRadius: "6px", background: "#C9485B", color: "#FFF", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em" }}>
                {v.impFileTag}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                <span style={{ fontWeight: "700", fontSize: "15px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {v.impFileName}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                  {v.impFileMeta}
                </span>
              </div>
              <button className="dh1" onClick={v.cancelImport} style={{ height: "38px", padding: "0 16px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                Cancelar
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "clamp(26px,4.6cqi,38px)", lineHeight: "1.1" }}>
                {v.impMsg}
              </span>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: "32px", color: "#D98CAE", animation: "dot 1.2s infinite" }}>
                .
              </span>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: "32px", color: "#D98CAE", animation: "dot 1.2s .2s infinite" }}>
                .
              </span>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: "32px", color: "#D98CAE", animation: "dot 1.2s .4s infinite" }}>
                .
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ height: "12px", borderRadius: "999px", background: "#F6EFE0", overflow: "hidden", boxShadow: "inset 0 0 0 1px #E3D9C4" }}>
                <div style={{ height: "100%", width: v.impProgW, borderRadius: "999px", backgroundColor: "#D98CAE", backgroundImage: "repeating-linear-gradient(135deg,rgba(255,255,255,.35) 0 6px,transparent 6px 12px)", transition: "width .15s linear" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                <span>
                  {v.impPageLabel}
                </span>
                <span>
                  {v.impProgW}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {v.impChecks.map((c, i_c) => (
                <Fragment key={i_c}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: c.col }}>
                    <span style={{ width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", background: c.bg, border: c.bd, color: "#FFF" }}>
                      {c.sym}
                    </span>
                    {c.l}
                    {" "}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
      )}
      {!!(v.impErr) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "14px", padding: "clamp(24px,5cqi,44px)", borderRadius: "28px", backgroundColor: "#F6D8D8", backgroundImage: "radial-gradient(rgba(163,48,63,.14) 1.2px,transparent 1.7px)", backgroundSize: "14px 14px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", color: "#A3303F" }}>
              {v.impErrTag}
            </span>
            <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "clamp(26px,4.6cqi,36px)" }}>
              {v.impErrTitle}
              {" "}
              <span style={{ fontStyle: "italic", color: "#A3303F" }}>
                {v.impErrTitleEm}
              </span>
            </h2>
            <p style={{ margin: "0", maxWidth: "520px", fontSize: "15px", lineHeight: "1.55", color: "#6E3A40" }}>
              {v.impErrText}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
              <button className="dh22" onClick={v.restartImport} style={{ height: "48px", padding: "0 24px", borderRadius: "999px", border: "none", background: "#A3303F", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                Tentar outro arquivo
              </button>
              <button onClick={v.goCriar} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "1px solid rgba(163,48,63,.3)", background: "rgba(253,251,245,.7)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Escrever à mão
              </button>
            </div>
          </div>
      )}
      {!!(v.imp3) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "flex-end", justifyContent: "space-between" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,5cqi,42px)", lineHeight: "1" }}>
                  <span style={{ fontStyle: "italic", color: "#A8436E" }}>
                    {v.impN}
                  </span>
                  {" cards encontrados"}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", color: "#8A7C68" }}>
                  {v.impFileName}
                  {" · confiança "}
                  {v.impConf}
                </span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".12em", color: "#8A7C68" }}>
                    ESTRATÉGIA
                  </label>
                  <select value={v.imp.strat} onChange={v.onStrat} style={{ height: "42px", maxWidth: "280px", padding: "0 14px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontSize: "13.5px", outline: "none", cursor: "pointer" }}>
                    {v.strats.map((o, i_o) => (
                      <Fragment key={i_o}>
                        <option value={o.id}>
                          {o.lab}
                        </option>
                      </Fragment>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".12em", color: "#8A7C68" }}>
                    BARALHO
                  </label>
                  <select value={v.imp.deck} onChange={v.onImpDeck} style={{ height: "42px", padding: "0 14px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontSize: "13.5px", fontWeight: "600", outline: "none", cursor: "pointer" }}>
                    {v.decksV.map((d, i_d) => (
                      <Fragment key={i_d}>
                        <option value={d.id}>
                          {d.nome}
                        </option>
                      </Fragment>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            {!!(v.impLow) && (
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px 18px", borderRadius: "16px", background: "#F6EACB", fontSize: "14px", lineHeight: "1.5", color: "#6F5510" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", paddingTop: "2px" }}>
                    !
                  </span>
                  {v.impLowMsg}
                </div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 18px", alignItems: "center", fontSize: "13.5px", color: "#6E6250" }}>
              <button onClick={v.toggleAll} style={{ border: "none", background: "none", padding: "0", cursor: "pointer", fontWeight: "700", color: "#A8436E", textDecoration: "underline" }}>
                {v.toggleAllL}
              </button>
              <span>
                {v.impDupMsg}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {v.impItems.map((it, i_it) => (
                <Fragment key={i_it}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "16px", borderRadius: "18px", background: "#FDFBF5", border: `1px solid ${it.bd}`, opacity: it.op, transition: "opacity .2s" }}>
                    <button onClick={it.toggle} title="Incluir" style={{ width: "26px", height: "26px", flex: "none", borderRadius: "8px", border: `1.5px solid ${it.cbBd}`, background: it.cbBg, color: "#FFF", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {it.cbSym}
                    </button>
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexWrap: "wrap", gap: "10px 22px" }}>
                      <div style={{ flex: "1 1 180px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".12em", color: "#A8436E" }}>
                          {it.num}
                          {" · PERGUNTA"}
                        </span>
                        {!!(it.edit) && (
                            <textarea value={it.q} onChange={it.onQ} rows={2} style={{ width: "100%", resize: "vertical", padding: "8px 10px", borderRadius: "10px", border: "1px solid #D98CAE", background: "#FFF", fontFamily: "'Fraunces',serif", fontSize: "16px", outline: "none" }} />
                        )}
                        {!!(it.view) && (
                            <span style={{ fontFamily: "'Fraunces',serif", fontSize: "17px", lineHeight: "1.3" }}>
                              {it.q}
                            </span>
                        )}
                      </div>
                      <div style={{ flex: "2 1 240px", minWidth: "0", display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".12em", color: "#4F7358" }}>
                          RESPOSTA
                        </span>
                        {!!(it.edit) && (
                            <textarea value={it.a} onChange={it.onA} rows={2} style={{ width: "100%", resize: "vertical", padding: "8px 10px", borderRadius: "10px", border: "1px solid #A9CBAE", background: "#FFF", fontSize: "14.5px", outline: "none" }} />
                        )}
                        {!!(it.view) && (
                            <span style={{ fontSize: "14.5px", lineHeight: "1.45", color: "#6E6250" }}>
                              {it.a}
                            </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px", flex: "none" }}>
                      {!!(it.dup) && (
                          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9.5px", letterSpacing: ".1em", padding: "3px 8px", borderRadius: "999px", background: "#F4D9E3", color: "#9C3E66" }}>
                            JÁ EXISTE
                          </span>
                      )}
                      <div style={{ display: "flex", gap: "4px" }}>
                        <button className="dh1" onClick={it.onEdit} style={{ height: "32px", padding: "0 12px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontSize: "12.5px", fontWeight: "600", cursor: "pointer" }}>
                          {it.editL}
                        </button>
                        <button className="dh23" onClick={it.onDel} style={{ height: "32px", padding: "0 12px", borderRadius: "999px", border: "1px solid transparent", background: "transparent", fontSize: "12.5px", fontWeight: "600", color: "#A3303F", cursor: "pointer" }}>
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ position: "sticky", bottom: "12px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 12px 22px", borderRadius: "999px", background: "#4A4034", color: "#FDFBF5", boxShadow: "0 12px 30px -10px rgba(74,64,52,.5)" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                {v.impSel}
                {" de "}
                {v.impN}
                {" selecionados → "}
                {v.impDeckName}
              </span>
              <button className="dh2" onClick={v.addImport} style={{ height: "46px", padding: "0 24px", borderRadius: "999px", border: "none", background: "#F4D9E3", color: "#4A4034", fontWeight: "700", fontSize: "14.5px", cursor: "pointer" }}>
                Adicionar ao baralho
              </button>
            </div>
          </div>
      )}
      {!!(v.impDk) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(30px,5cqi,42px)", lineHeight: "1" }}>
                <span style={{ fontStyle: "italic", color: "#A8436E" }}>
                  {v.impDkTotal}
                </span>
                {" cards em "}
                {v.impDkN}
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", color: "#8A7C68" }}>
                {v.impFileName}
                {" · "}
                {v.impDkImgs}
              </span>
            </div>
            <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px 18px", borderRadius: "16px", background: "#E4E8D6", fontSize: "14px", lineHeight: "1.5", color: "#55643F" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", paddingTop: "2px" }}>
                i
              </span>
              Cada baralho entra como um baralho novo aqui, com os cards como novos: o progresso do app de origem não vem junto. Depois você edita, junta ou apaga o que quiser.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {v.impDkList.map((d, i_d) => (
                <Fragment key={i_d}>
                  <div style={{ display: "flex", gap: "14px", alignItems: "center", padding: "16px", borderRadius: "18px", background: "#FDFBF5", border: "1px solid #E3D9C4", opacity: d.op, transition: "opacity .2s" }}>
                    <button onClick={d.toggle} title="Incluir" style={{ width: "26px", height: "26px", flex: "none", borderRadius: "8px", border: `1.5px solid ${d.cbBd}`, background: d.cbBg, color: "#FFF", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {d.cbSym}
                    </button>
                    <span style={{ width: "14px", height: "18px", borderRadius: "3px", flex: "none", background: d.dot }} />
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "'Fraunces',serif", fontSize: "19px", lineHeight: "1.2" }}>
                        {d.nome}
                      </span>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                        {d.info}
                      </span>
                    </div>
                    <span style={{ flex: "1 1 200px", minWidth: "0", fontSize: "13px", color: "#6E6250", lineHeight: "1.4", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {d.exemplo}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ position: "sticky", bottom: "12px", display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", padding: "12px 12px 12px 22px", borderRadius: "999px", background: "#4A4034", color: "#FDFBF5", boxShadow: "0 12px 30px -10px rgba(74,64,52,.5)" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                {v.impDkSelLabel}
              </span>
              <button className="dh2" onClick={v.addImportDecks} style={{ height: "46px", padding: "0 24px", borderRadius: "999px", border: "none", background: "#F4D9E3", color: "#4A4034", fontWeight: "700", fontSize: "14.5px", cursor: "pointer" }}>
                Importar baralhos
              </button>
            </div>
          </div>
      )}
      {!!(v.imp4) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "14px", padding: "clamp(28px,5cqi,48px)", borderRadius: "28px", backgroundColor: "#DCEBD9", backgroundImage: "radial-gradient(rgba(62,107,74,.14) 1.2px,transparent 1.7px)", backgroundSize: "14px 14px", position: "relative", overflow: "hidden" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#FDFBF5", border: "2px solid #4F7358", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", color: "#4F7358", animation: "pop .5s ease both" }}>
              ✓
            </div>
            <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "clamp(28px,5cqi,40px)" }}>
              {v.impAdded}
              {" cards "}
              <span style={{ fontStyle: "italic", color: "#3E6B4A" }}>
                no lugar certo.
              </span>
            </h2>
            <p style={{ margin: "0", fontSize: "15px", color: "#3E6B4A" }}>
              {v.impDoneMsg}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "6px" }}>
              <button onClick={v.goImpDeck} style={{ height: "48px", padding: "0 24px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                {v.impDoneBtn}
              </button>
              <button onClick={v.restartImport} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "1px solid rgba(62,107,74,.3)", background: "rgba(253,251,245,.7)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Importar outro arquivo
              </button>
            </div>
          </div>
      )}
    </div>
  );
}
