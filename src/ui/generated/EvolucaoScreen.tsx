// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function EvolucaoScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "34px", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          {"04 · evolução · "}
          {v.mesAtual}
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
          {"O que você "}
          <span style={{ fontStyle: "italic", color: "#55643F" }}>
            já construiu.
          </span>
        </h1>
        <p style={{ margin: "0", fontSize: "15.5px", color: "#6E6250" }}>
          {v.evoResumo}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: "0", borderTop: "1.5px solid #4A4034" }}>
        <div style={{ padding: "18px 18px 18px 0", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#8A7C68" }}>
            OFENSIVA
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "46px", lineHeight: "1" }}>
            {v.streak}
            <span style={{ fontSize: "18px", fontStyle: "italic" }}>
              {" dias"}
            </span>
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
            {"recorde "}
            {v.recorde}
          </span>
        </div>
        <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "6px", borderLeft: "1px solid #E3D9C4" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#8A7C68" }}>
            DISCIPLINA 30D
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "46px", lineHeight: "1" }}>
            {v.m30pct}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
            {v.m30met}
            {" de "}
            {v.m30count}
            {" dias"}
          </span>
        </div>
        <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "6px", borderLeft: "1px solid #E3D9C4", background: "#F3E3B5", borderRadius: "0 0 18px 18px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#7A5F14" }}>
            RETENÇÃO
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "46px", lineHeight: "1" }}>
            {v.ret30}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#7A5F14" }}>
            meta FSRS 90%
          </span>
        </div>
        <div style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "6px", borderLeft: "1px solid #E3D9C4" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#8A7C68" }}>
            ESCUDO
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "30px", lineHeight: "1.2", fontStyle: "italic" }}>
            {v.escudoStatus}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
            {v.escudoUltimo}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "clamp(18px,3.4cqi,30px)", borderRadius: "24px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "space-between", alignItems: "baseline" }}>
          <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "24px" }}>
            {"Um ano "}
            <span style={{ fontStyle: "italic", color: "#4F7358" }}>
              de estudo
            </span>
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#8A7C68" }}>
            {"menos "}
            <i style={{ width: "11px", height: "11px", borderRadius: "3px", background: "#EDE4D0" }} />
            <i style={{ width: "11px", height: "11px", borderRadius: "3px", background: "#C9E0CC" }} />
            <i style={{ width: "11px", height: "11px", borderRadius: "3px", background: "#87BC96" }} />
            <i style={{ width: "11px", height: "11px", borderRadius: "3px", background: "#579C70" }} />
            <i style={{ width: "11px", height: "11px", borderRadius: "3px", background: "#37794E" }} />
            {" mais "}
            <i style={{ width: "11px", height: "11px", borderRadius: "3px", marginLeft: "10px", boxShadow: "inset 0 0 0 1.5px #D98CAE" }} />
            {" meta batida"}
          </div>
        </div>
        <div style={{ overflowX: "auto", paddingBottom: "4px" }}>
          <div style={{ minWidth: "640px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", paddingRight: "20px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#8A7C68" }}>
              {v.months.map((m, i_m) => (
                <Fragment key={i_m}>
                  <span>
                    {m}
                  </span>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(53,1fr)", gap: "3px" }}>
              {v.year.map((wk, i_wk) => (
                <Fragment key={i_wk}>
                  <div style={{ display: "grid", gridTemplateRows: "repeat(7,1fr)", gap: "3px" }}>
                    {wk.days.map((c, i_c) => (
                      <Fragment key={i_c}>
                        <div title={c.t} style={{ aspectRatio: "1", borderRadius: "3px", background: c.bg, boxShadow: c.sh }} />
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "22px" }}>
        <div style={{ flex: "1 1 320px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px", padding: "24px", borderRadius: "24px", backgroundColor: "#E4E8D6", backgroundImage: "repeating-linear-gradient(135deg,rgba(85,100,63,.07) 0 1px,transparent 1px 9px)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "22px" }}>
              {"Retenção "}
              <span style={{ fontStyle: "italic" }}>
                por semana
              </span>
            </h2>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#55643F" }}>
              % bom + fácil
            </span>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "flex-end", gap: "6px", height: "150px", paddingTop: "14px" }}>
            <div style={{ position: "absolute", left: "0", right: "0", bottom: v.ret90, borderTop: "1px dashed rgba(85,100,63,.5)" }}>
              <span style={{ position: "absolute", right: "0", top: "-16px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "9.5px", color: "#55643F" }}>
                90%
              </span>
            </div>
            {v.retWeeks.map((b, i_b) => (
              <Fragment key={i_b}>
                <div title={b.t} style={{ flex: "1", height: b.h, borderRadius: "4px 4px 2px 2px", background: "#579C70", position: "relative" }} />
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#55643F" }}>
            {v.retAxis.map((x, i_x) => (
              <Fragment key={i_x}>
                <span>
                  {x}
                </span>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 320px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px", padding: "24px", borderRadius: "24px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "22px" }}>
              {"Próximas "}
              <span style={{ fontStyle: "italic", color: "#A8436E" }}>
                revisões
              </span>
            </h2>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#8A7C68" }}>
              14 dias
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "110px" }}>
            {v.load14.map((b, i_b) => (
              <Fragment key={i_b}>
                <div title={b.t} style={{ flex: "1", height: b.h, borderRadius: "4px 4px 2px 2px", background: b.c }} />
              </Fragment>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", borderTop: "1px dashed #E3D9C4", paddingTop: "12px" }}>
            {v.nextList.map((n, i_n) => (
              <Fragment key={i_n}>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#8A7C68" }}>
                    {n.l}
                  </span>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: "26px" }}>
                    {n.v}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", alignItems: "flex-start" }}>
        <div style={{ flex: "1.3 1 340px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
          <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "24px" }}>
            {"Composição "}
            <span style={{ fontStyle: "italic", color: "#4F7358" }}>
              da memória
            </span>
          </h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            {v.memLegend.map((m, i_m) => (
              <Fragment key={i_m}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px" }}>
                  <i style={{ width: "11px", height: "11px", borderRadius: "50%", background: m.c }} />
                  {m.l}
                  {" "}
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "#8A7C68" }}>
                    {m.v}
                  </span>
                </span>
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", height: "170px" }}>
            {v.memMonths.map((mo, i_mo) => (
              <Fragment key={i_mo}>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", maxWidth: "44px", height: mo.h, display: "flex", flexDirection: "column", gap: "2px" }}>
                    {mo.segs.map((sg, i_sg) => (
                      <Fragment key={i_sg}>
                        <div title={sg.t} style={{ flex: sg.v, background: sg.c, borderRadius: "4px" }} />
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#8A7C68" }}>
                    {mo.l}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ flex: "1 1 320px", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
          <h2 style={{ margin: "0 0 8px", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "24px" }}>
            {"Cards que estão te "}
            <span style={{ fontStyle: "italic", color: "#A3303F" }}>
              dando trabalho
            </span>
          </h2>
          {v.leeches.map((l, i_l) => (
            <Fragment key={i_l}>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "14px 0", borderTop: "1px solid #E3D9C4", opacity: l.op }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "baseline", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: "16.5px", lineHeight: "1.3" }}>
                    {l.q}
                  </span>
                  <span style={{ flex: "none", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A3303F" }}>
                    {l.err}
                    {" erros"}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#8A7C68", marginRight: "auto" }}>
                    {l.deck}
                  </span>
                  {!!(l.active) && (
                    <>
                      <button className="dh8" onClick={l.rewrite} style={{ height: "32px", padding: "0 14px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontSize: "12.5px", fontWeight: "700", cursor: "pointer" }}>
                        Reescrever
                      </button>
                      <button className="dh1" onClick={l.suspend} style={{ height: "32px", padding: "0 14px", borderRadius: "999px", border: "none", background: "transparent", fontSize: "12.5px", fontWeight: "600", color: "#8A7C68", cursor: "pointer" }}>
                        Suspender
                      </button>
                    </>
                  )}
                  {!!(l.susp) && (
                      <button onClick={l.suspend} style={{ height: "32px", padding: "0 14px", borderRadius: "999px", border: "1px dashed #E3D9C4", background: "transparent", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", cursor: "pointer" }}>
                        suspenso · reativar
                      </button>
                  )}
                </div>
              </div>
            </Fragment>
          ))}
          {!!(v.noLeeches) && (
              <div style={{ padding: "16px 0", borderTop: "1px solid #E3D9C4", fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "17px", color: "#8A7C68" }}>
                Nenhum card com 8 erros ou mais. Até agora, tudo firme.
              </div>
          )}
        </div>
      </div>
    </div>
  );
}
