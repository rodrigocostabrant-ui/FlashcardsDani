// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function EstudarScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          02 · estudar
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
          {"Hoje você "}
          <span style={{ fontStyle: "italic", color: "#A8436E" }}>
            consegue.
          </span>
        </h1>
      </div>
      <div style={{ position: "relative", overflow: "hidden", display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "center", justifyContent: "space-between", padding: "clamp(22px,4cqi,40px)", borderRadius: "28px", backgroundColor: "#F4D9E3", backgroundImage: "repeating-linear-gradient(135deg,rgba(201,72,91,.10) 0 1px,transparent 1px 9px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", minWidth: "0" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#9C3E66" }}>
            sessão completa · todos os baralhos
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: "clamp(64px,10cqi,96px)", lineHeight: ".85", letterSpacing: "-.04em" }}>
              {v.dueTotal}
            </span>
            <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "22px" }}>
              cards esperando
            </span>
          </div>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "#9C3E66" }}>
            aprendendo primeiro · revisões · novos espalhados no meio
          </span>
        </div>
        <button className="dh6" onClick={v.startAll} style={{ display: "inline-flex", alignItems: "center", gap: "12px", height: "58px", padding: "0 32px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "17px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
          Estudar tudo →
        </button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
        <h2 style={{ margin: "0 0 12px", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "26px" }}>
          {"Ou escolha "}
          <span style={{ fontStyle: "italic", color: "#4F7358" }}>
            um baralho
          </span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: "14px" }}>
          {v.decksDue.map((d, i_d) => (
            <Fragment key={i_d}>
              <button className="dh7" onClick={d.study} style={{ display: "flex", flexDirection: "column", gap: "14px", padding: "20px", borderRadius: "20px", border: "1px solid #E3D9C4", background: "#FDFBF5", textAlign: "left", cursor: "pointer", transition: "transform .15s" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <span style={{ width: "34px", height: "10px", borderRadius: "999px", background: d.dot }} />
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                    {d.ultimo}
                  </span>
                </div>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: "22px", lineHeight: "1.1" }}>
                  {d.nome}
                </span>
                <div style={{ display: "flex", gap: "14px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                  <span style={{ color: "#A8436E" }}>
                    {d.due}
                    {" revisar"}
                  </span>
                  <span style={{ color: "#4F7358" }}>
                    {d.novos}
                    {" novos"}
                  </span>
                </div>
              </button>
            </Fragment>
          ))}
        </div>
        {!!(v.noDecksDue) && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "10px", padding: "24px", borderRadius: "22px", backgroundColor: "#DCEBD9", backgroundImage: "radial-gradient(rgba(62,107,74,.14) 1.2px,transparent 1.7px)", backgroundSize: "14px 14px" }}>
              <span style={{ fontSize: "26px", color: "#4F7358" }}>
                ✓
              </span>
              <span style={{ fontFamily: "'Fraunces',serif", fontSize: "22px", lineHeight: "1.15" }}>
                {"Tudo em dia "}
                <span style={{ fontStyle: "italic" }}>
                  por hoje.
                </span>
              </span>
              <span style={{ fontSize: "13.5px", color: "#3E6B4A", lineHeight: "1.45" }}>
                Nenhum card vence até amanhã. Que tal escrever alguns cards novos?
              </span>
            </div>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "center", padding: "18px 22px", borderRadius: "18px", border: "1px dashed #E3D9C4" }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "17px" }}>
          Atalhos
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
          <kbd style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", padding: "3px 8px", borderRadius: "6px", background: "#FDFBF5", border: "1px solid #E3D9C4", borderBottomWidth: "2px" }}>
            espaço
          </kbd>
          mostrar resposta
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px" }}>
          <kbd style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", padding: "3px 8px", borderRadius: "6px", background: "#FDFBF5", border: "1px solid #E3D9C4", borderBottomWidth: "2px" }}>
            1 2 3 4
          </kbd>
          Errei · Difícil · Bom · Fácil
        </span>
        <span style={{ flex: "1 1 240px", fontSize: "13px", color: "#8A7C68", lineHeight: "1.5" }}>
          Intervalos calculados pelo FSRS, o mesmo algoritmo moderno do Anki. Avalie com sinceridade — é isso que faz ele acertar.
        </span>
      </div>
    </div>
  );
}
