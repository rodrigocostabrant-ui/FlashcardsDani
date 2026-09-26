// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function CriarScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          {v.ccHeader}
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
          {v.ccTitleA}
          {" "}
          <span style={{ fontStyle: "italic", color: "#A8436E" }}>
            ficha.
          </span>
        </h1>
        {!!(v.cc.fromLeech) && (
            <p style={{ margin: "0", fontSize: "14.5px", color: "#6E6250" }}>
              Reescrevendo um card difícil. Dica: divida em perguntas menores.
            </p>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "flex-start" }}>
        <div style={{ flex: "1.5 1 420px", minWidth: "0", position: "relative", borderRadius: "10px 10px 22px 22px", background: "#FDFBF5", border: "1px solid #E3D9C4", boxShadow: "0 2px 8px rgba(150,130,100,.08), 0 24px 40px -28px rgba(150,130,100,.5)" }}>
          <div style={{ position: "absolute", top: "-11px", left: "36px", width: "96px", height: "22px", background: "rgba(244,217,227,.9)", transform: "rotate(-3deg)", backgroundImage: "radial-gradient(rgba(201,72,91,.2) 1px,transparent 1.5px)", backgroundSize: "7px 7px" }} />
          <div style={{ position: "absolute", top: "0", bottom: "0", left: "clamp(34px,6cqi,56px)", width: "1.5px", background: "rgba(201,72,91,.35)" }} />
          <div style={{ padding: "30px clamp(18px,4cqi,34px) 26px clamp(46px,8.5cqi,76px)", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", color: "#A8436E" }}>
                PERGUNTA · FRENTE
              </label>
              <textarea value={v.cc.q} onChange={v.onCcQ} rows={3} placeholder="Ex.: Qual o antídoto da intoxicação por heparina?" style={{ width: "100%", resize: "vertical", border: "none", outline: "none", background: "repeating-linear-gradient(to bottom,transparent 0 33px,rgba(127,160,184,.28) 33px 34px)", lineHeight: "34px", fontFamily: "'Fraunces',serif", fontSize: "22px", padding: "0", minHeight: "102px" }} />
              {!!(v.ccErrQ) && (
                  <span style={{ fontSize: "12.5px", color: "#A3303F" }}>
                    Escreva a pergunta antes de salvar.
                  </span>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", color: "#4F7358" }}>
                RESPOSTA · VERSO
              </label>
              <textarea value={v.cc.a} onChange={v.onCcA} rows={4} placeholder="Ex.: Sulfato de protamina." style={{ width: "100%", resize: "vertical", border: "none", outline: "none", background: "repeating-linear-gradient(to bottom,transparent 0 33px,rgba(127,160,184,.28) 33px 34px)", lineHeight: "34px", fontSize: "17px", padding: "0", minHeight: "136px" }} />
              {!!(v.ccErrA) && (
                  <span style={{ fontSize: "12.5px", color: "#A3303F" }}>
                    Falta a resposta.
                  </span>
              )}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", paddingTop: "6px", borderTop: "1px dashed #E3D9C4" }}>
              <div style={{ flex: "1 1 200px", display: "flex", flexDirection: "column", gap: "6px", paddingTop: "12px" }}>
                <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", color: "#8A7C68" }}>
                  BARALHO
                </label>
                <select value={v.cc.deck} onChange={v.onCcDeck} style={{ height: "44px", padding: "0 16px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#F6EFE0", fontSize: "14px", fontWeight: "600", outline: "none", cursor: "pointer" }}>
                  {v.decksV.map((d, i_d) => (
                    <Fragment key={i_d}>
                      <option value={d.id}>
                        {d.nome}
                      </option>
                    </Fragment>
                  ))}
                </select>
              </div>
              <div style={{ flex: "1.4 1 240px", display: "flex", flexDirection: "column", gap: "6px", paddingTop: "12px" }}>
                <label style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", color: "#8A7C68" }}>
                  TAGS · OPCIONAL
                </label>
                <div style={{ minHeight: "44px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "6px", padding: "6px 8px 6px 12px", borderRadius: "22px", border: "1px solid #E3D9C4", background: "#F6EFE0" }}>
                  {v.ccTags.map((t, i_t) => (
                    <Fragment key={i_t}>
                      <button className="dh8" onClick={t.rm} style={{ height: "28px", padding: "0 10px", borderRadius: "999px", border: "none", background: "#F3E3B5", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", cursor: "pointer" }}>
                        #
                        {t.t}
                        {" ×"}
                      </button>
                    </Fragment>
                  ))}
                  <input value={v.cc.tagIn} onChange={v.onTagIn} onKeyDown={v.onTagKey} placeholder="enter p/ adicionar" style={{ flex: "1", minWidth: "110px", height: "30px", border: "none", outline: "none", background: "transparent", fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: "1 1 260px", minWidth: "0", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
            assim vai aparecer no estudo
          </div>
          <div style={{ padding: "22px", borderRadius: "18px", background: "#FDFBF5", border: "1px solid #E3D9C4", display: "flex", flexDirection: "column", gap: "12px", textAlign: "center" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: "18px", lineHeight: "1.3", color: v.ccPrevQc }}>
              {v.ccPrevQ}
            </span>
            <span style={{ borderTop: "1.5px dashed #E3D9C4" }} />
            <span style={{ fontSize: "14px", lineHeight: "1.5", color: v.ccPrevAc }}>
              {v.ccPrevA}
            </span>
          </div>
          <ul style={{ margin: "0", padding: "0 0 0 18px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13.5px", lineHeight: "1.45", color: "#6E6250" }}>
            <li>
              Uma ideia por card.
            </li>
            <li>
              Pergunte de um jeito que só exista uma resposta certa.
            </li>
            <li>
              Resposta curta lembra melhor que parágrafo.
            </li>
          </ul>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button className="dh6" onClick={v.saveCard} style={{ height: "52px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
              {v.ccSaveL}
            </button>
            <button className="dh1" onClick={v.saveCardAgain} style={{ height: "46px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "600", fontSize: "14px", cursor: "pointer", color: v.ccSave2C }}>
              {v.ccSave2L}
            </button>
            {!!(v.ccEditing) && (
                <button onClick={v.toggleSuspend} style={{ alignSelf: "center", border: "none", background: "none", padding: "0", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", textDecoration: "underline" }}>
                  {v.ccSuspL}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
