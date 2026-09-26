// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function ResultadoScreen({ v }: { v: VM }) {
  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "28px", animation: "fadeUp .4s ease both" }}>
      <div style={{ position: "relative", padding: "clamp(28px,5cqi,48px)", borderRadius: "28px", backgroundColor: "#FDFBF5", backgroundImage: "radial-gradient(rgba(217,140,174,.2) 1.2px,transparent 1.7px)", backgroundSize: "16px 16px", border: "1px solid #E3D9C4", display: "flex", flexDirection: "column", gap: "16px", alignItems: "flex-start", overflow: "hidden" }}>
        <span style={{ position: "absolute", right: "34px", top: "26px", fontSize: "28px", color: "#D9BE6B", animation: "pop .6s .2s ease both" }}>
          ✦
        </span>
        <span style={{ position: "absolute", right: "74px", top: "62px", fontSize: "16px", color: "#D98CAE", animation: "pop .6s .35s ease both" }}>
          ✦
        </span>
        <span style={{ position: "absolute", right: "28px", top: "88px", fontSize: "14px", color: "#C9485B", animation: "pop .6s .5s ease both" }}>
          ♥
        </span>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          {v.sessName}
          {" · sessão concluída"}
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(38px,7cqi,62px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
          {"Seu cérebro está "}
          <span style={{ fontStyle: "italic", color: "#A8436E" }}>
            trabalhando.
          </span>
        </h1>
        <p style={{ margin: "0", fontSize: "16px", color: "#6E6250", lineHeight: "1.5" }}>
          {v.resMsg}
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "0", borderTop: "1px solid #E3D9C4", borderBottom: "1px solid #E3D9C4" }}>
        <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "6px", borderRight: "1px solid #E3D9C4" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8A7C68" }}>
            respondidos
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "40px", lineHeight: "1" }}>
            {v.resTotal}
          </span>
        </div>
        <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "6px", borderRight: "1px solid #E3D9C4" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8A7C68" }}>
            retenção
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "40px", lineHeight: "1" }}>
            {v.resRet}
          </span>
        </div>
        <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "6px", borderRight: "1px solid #E3D9C4" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8A7C68" }}>
            tempo
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "40px", lineHeight: "1" }}>
            {v.resTime}
          </span>
        </div>
        <div style={{ padding: "20px 18px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", textTransform: "uppercase", color: "#8A7C68" }}>
            meta de hoje
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "40px", lineHeight: "1" }}>
            {v.answered}
            <span style={{ fontSize: "20px", color: "#8A7C68" }}>
              /
              {v.metaResp}
            </span>
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          como você avaliou
        </div>
        <div style={{ display: "flex", gap: "2px", height: "18px", borderRadius: "999px", overflow: "hidden" }}>
          {v.resDist.map((r, i_r) => (
            <Fragment key={i_r}>
              <div style={{ flex: r.n, background: r.c }} />
            </Fragment>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
          {v.resDist.map((r, i_r) => (
            <Fragment key={i_r}>
              <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13.5px" }}>
                <i style={{ width: "10px", height: "10px", borderRadius: "3px", background: r.c }} />
                {r.l}
                {" "}
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "#8A7C68" }}>
                  {r.n}
                </span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderRadius: "18px", background: "#E4E8D6" }}>
        <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "18px" }}>
          Próxima revisão
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12.5px", color: "#55643F" }}>
          {v.nextRevLabel}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
        <button className="dh14" onClick={v.goEstudar} style={{ height: "50px", padding: "0 26px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
          Estudar outro baralho
        </button>
        <button className="dh1" onClick={v.goInicio} style={{ height: "50px", padding: "0 24px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "600", fontSize: "15px", cursor: "pointer" }}>
          Voltar ao início
        </button>
      </div>
    </div>
  );
}
