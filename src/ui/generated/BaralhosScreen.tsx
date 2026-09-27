// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function BaralhosScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
            {"03 · baralhos · "}
            {v.deckCount}
            {" baralhos · "}
            {v.cardCount}
            {" cards"}
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
            {"Suas "}
            <span style={{ fontStyle: "italic", color: "#4F7358" }}>
              fichas.
            </span>
          </h1>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button className="dh15" onClick={v.goImport} style={{ height: "46px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
            Importar
          </button>
          <button className="dh14" onClick={v.openNovoBaralho} style={{ height: "46px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
            + Novo baralho
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(250px,1fr))", gap: "22px 18px" }}>
        {v.decksV.map((d, i_d) => (
          <Fragment key={i_d}>
            <button className="dh16" onClick={d.open} style={{ position: "relative", display: "flex", flexDirection: "column", padding: "0", borderRadius: "20px", border: "1px solid #E3D9C4", background: "#FDFBF5", textAlign: "left", cursor: "pointer", overflow: "visible", boxShadow: "0 2px 8px rgba(150,130,100,.08)", transition: "transform .18s, box-shadow .18s" }}>
              <div style={{ position: "absolute", top: "-9px", right: "26px", width: "54px", height: "18px", background: "rgba(253,251,245,.75)", transform: "rotate(5deg)", boxShadow: "0 1px 2px rgba(150,130,100,.2)" }} />
              <div style={{ height: "92px", borderRadius: "19px 19px 0 0", backgroundColor: d.bg, backgroundImage: d.pat, backgroundSize: d.ps, padding: "16px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", color: d.ink, textTransform: "uppercase" }}>
                  {d.totalFmt}
                  {" cards"}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: d.ink }}>
                  {d.prog}
                  %
                </span>
              </div>
              <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: "23px", lineHeight: "1.1" }}>
                    {d.nome}
                  </span>
                  <span style={{ fontSize: "13px", color: "#8A7C68" }}>
                    {d.sub}
                  </span>
                </div>
                <div style={{ height: "6px", borderRadius: "999px", background: "#F6EFE0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: d.progW, background: d.dot, borderRadius: "999px" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px" }}>
                  <span>
                    <span style={{ color: "#A8436E" }}>
                      {d.due}
                    </span>
                    {" revisar · "}
                    <span style={{ color: "#4F7358" }}>
                      {d.novos}
                    </span>
                    {" novos"}
                  </span>
                  <span style={{ color: "#8A7C68" }}>
                    {d.ultimo}
                  </span>
                </div>
              </div>
            </button>
          </Fragment>
        ))}
        <button className="dh17" onClick={v.openNovoBaralho} style={{ minHeight: "230px", borderRadius: "20px", border: "1.5px dashed #A9CBAE", backgroundColor: "transparent", backgroundImage: "radial-gradient(rgba(127,168,134,.22) 1.2px,transparent 1.7px)", backgroundSize: "14px 14px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", color: "#4F7358" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "40px", lineHeight: "1" }}>
            +
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "19px" }}>
            Novo baralho
          </span>
        </button>
      </div>
    </div>
  );
}
