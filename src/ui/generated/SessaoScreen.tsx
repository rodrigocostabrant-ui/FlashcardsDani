// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment, type CSSProperties } from 'react';
import type { VM } from '../vm';

export function SessaoScreen({ v }: { v: VM }) {
  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "22px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <button className="dh8" onClick={v.exitSession} style={{ height: "38px", padding: "0 14px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
          ← Sair
        </button>
        <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "21px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
            {v.sessName}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", color: "#8A7C68" }}>
            {"card "}
            {v.sPos}
            {" de "}
            {v.sTotal}
          </span>
        </div>
        <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", minWidth: "70px", textAlign: "right" }}>
          {"meta "}
          {v.answered}
          /
          {v.metaResp}
        </span>
      </div>
      <div style={{ height: "6px", borderRadius: "999px", background: "#F4D9E3", overflow: "hidden" }}>
        <div style={{ height: "100%", width: v.sProgW, background: "#D98CAE", borderRadius: "999px", transition: "width .4s ease" }} />
      </div>
      <div style={{ position: "relative", minHeight: "min(420px,62cqi)", padding: "clamp(26px,5cqi,48px) clamp(20px,5cqi,52px)", borderRadius: "24px", background: "#FDFBF5", border: `1.5px solid ${v.sBorder}`, boxShadow: "0 2px 8px rgba(150,130,100,.08), 0 18px 40px -24px rgba(150,130,100,.35)", display: "flex", flexDirection: "column", gap: "22px", transition: "border-color .2s, transform .25s", transform: v.sCardT }}>
        <div style={{ position: "absolute", top: "-11px", left: "50%", marginLeft: "-44px", width: "88px", height: "22px", background: "rgba(243,227,181,.9)", transform: "rotate(-2deg)", backgroundImage: "repeating-linear-gradient(90deg,rgba(201,72,91,.14) 0 2px,transparent 2px 7px)" }} />
        <div style={{ display: "flex", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", padding: "4px 10px", borderRadius: "999px", background: v.sCard.deckBg, color: v.sCard.deckInk }}>
            {v.sCard.deck}
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", color: "#8A7C68" }}>
            {v.sCard.kind}
          </span>
        </div>
        <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", gap: "24px", textAlign: "center" }}>
          {!!(v.sCard.q) && (
              <p style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "clamp(24px,4.2cqi,34px)", lineHeight: "1.25", letterSpacing: "-.01em", textWrap: "balance", whiteSpace: "pre-line" }}>
                {v.sCard.q}
              </p>
          )}
          {!!(v.sHasImgsQ) && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {v.sImgsQ.map((im, i_im) => (
                  <Fragment key={i_im}>
                    <img src={im.url} onClick={im.open} alt="Imagem da pergunta" title="Ampliar" style={{ maxWidth: "100%", maxHeight: "clamp(170px,36cqi,320px)", borderRadius: "14px", border: "1px solid #E3D9C4", background: "#FFF", cursor: "zoom-in", objectFit: "contain" }} />
                  </Fragment>
                ))}
              </div>
          )}
          {!!(v.revealed) && (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px", animation: "fadeUp .3s ease both" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ flex: "1", borderTop: "1.5px dashed #E3D9C4" }} />
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".14em", color: "#A8436E" }}>
                    RESPOSTA
                  </span>
                  <span style={{ flex: "1", borderTop: "1.5px dashed #E3D9C4" }} />
                </div>
                {!!(v.sCard.a) && (
                    <p style={{ margin: "0", fontSize: "clamp(17px,2.8cqi,21px)", lineHeight: "1.55", textWrap: "pretty", whiteSpace: "pre-line" }}>
                      <span style={{ background: "linear-gradient(transparent 58%,rgba(243,227,181,.9) 58%)", padding: "0 2px" }}>
                        {v.sCard.a}
                      </span>
                    </p>
                )}
                {!!(v.sHasImgsA) && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                      {v.sImgsA.map((im, i_im) => (
                        <Fragment key={i_im}>
                          <img src={im.url} onClick={im.open} alt="Imagem da resposta" title="Ampliar" style={{ maxWidth: "100%", maxHeight: "clamp(170px,36cqi,320px)", borderRadius: "14px", border: "1px solid #E3D9C4", background: "#FFF", cursor: "zoom-in", objectFit: "contain" }} />
                        </Fragment>
                      ))}
                    </div>
                )}
              </div>
          )}
        </div>
        {!!(v.hasStamp) && (
            <div style={{ position: "absolute", right: "22px", bottom: "20px", padding: "6px 14px", border: `2px solid ${v.stampC}`, borderRadius: "10px", color: v.stampC, fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", fontWeight: "500", letterSpacing: ".14em", textTransform: "uppercase", animation: "stampIn .35s ease both", background: "rgba(253,251,245,.9)" }}>
              {v.stampT}
            </div>
        )}
        {!!(v.isFacilFb) && (
            <div style={{ position: "absolute", right: "60px", bottom: "60px", pointerEvents: "none" }}>
              <span style={{ position: "absolute", color: "#D9BE6B", fontSize: "18px", "--dx": "-40px", "--dy": "-50px", animation: "sparkle .8s ease-out both" } as CSSProperties}>
                ✦
              </span>
              <span style={{ position: "absolute", color: "#D98CAE", fontSize: "14px", "--dx": "30px", "--dy": "-60px", animation: "sparkle .8s .05s ease-out both" } as CSSProperties}>
                ✦
              </span>
              <span style={{ position: "absolute", color: "#7FA886", fontSize: "12px", "--dx": "50px", "--dy": "-20px", animation: "sparkle .8s .1s ease-out both" } as CSSProperties}>
                ✦
              </span>
              <span style={{ position: "absolute", color: "#C9485B", fontSize: "10px", "--dx": "-60px", "--dy": "-10px", animation: "sparkle .8s .08s ease-out both" } as CSSProperties}>
                ♥
              </span>
            </div>
        )}
      </div>
      {!!(v.notRevealed) && (
          <button className="dh9" onClick={v.reveal} style={{ height: "64px", borderRadius: "20px", border: "none", background: "#4A4034", color: "#FDFBF5", fontSize: "17px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
            {"Mostrar resposta "}
            <kbd style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", fontWeight: "400", padding: "3px 8px", borderRadius: "6px", background: "rgba(253,251,245,.14)" }}>
              espaço
            </kbd>
          </button>
      )}
      {!!(v.revealed) && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,minmax(0,1fr))", gap: "clamp(6px,1.6cqi,12px)", animation: "fadeUp .25s ease both" }}>
            <button className="dh10" onClick={v.rate1} style={{ minHeight: "76px", padding: "12px 6px", borderRadius: "18px", border: "1.5px solid #E7A9BD", background: "#F7DCE3", color: "#9C2F4F", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "clamp(17px,3cqi,21px)" }}>
                Errei
              </span>
              {!!(v.showIntervals) && (
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                    {v.ivl1}
                  </span>
              )}
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9.5px", opacity: ".6" }}>
                1
              </span>
            </button>
            <button className="dh11" onClick={v.rate2} style={{ minHeight: "76px", padding: "12px 6px", borderRadius: "18px", border: "1.5px solid #E3CB85", background: "#F6EACB", color: "#6F5510", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "clamp(17px,3cqi,21px)" }}>
                Difícil
              </span>
              {!!(v.showIntervals) && (
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                    {v.ivl2}
                  </span>
              )}
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9.5px", opacity: ".6" }}>
                2
              </span>
            </button>
            <button className="dh12" onClick={v.rate3} style={{ minHeight: "76px", padding: "12px 6px", borderRadius: "18px", border: "1.5px solid #A9CBAE", background: "#DCEBD9", color: "#335C3E", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "clamp(17px,3cqi,21px)" }}>
                Bom
              </span>
              {!!(v.showIntervals) && (
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                    {v.ivl3}
                  </span>
              )}
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9.5px", opacity: ".6" }}>
                3
              </span>
            </button>
            <button className="dh13" onClick={v.rate4} style={{ minHeight: "76px", padding: "12px 6px", borderRadius: "18px", border: "1.5px solid #A9C1D2", background: "#DCE7EE", color: "#355A73", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "5px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "clamp(17px,3cqi,21px)" }}>
                Fácil
              </span>
              {!!(v.showIntervals) && (
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                    {v.ivl4}
                  </span>
              )}
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "9.5px", opacity: ".6" }}>
                4
              </span>
            </button>
          </div>
          <p style={{ margin: "0", textAlign: "center", fontSize: "12.5px", color: "#8A7C68" }}>
            {"O tempo abaixo de cada botão é quando este card volta. "}
            <strong style={{ color: "#6E6250" }}>
              Errei
            </strong>
            {" traz ele de volta ainda nesta sessão."}
          </p>
        </>
      )}
    </div>
  );
}
