// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function BaralhoScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "26px", animation: "fadeUp .35s ease both" }}>
      <button className="dh18" onClick={v.goBaralhos} style={{ alignSelf: "flex-start", border: "none", background: "none", padding: "0", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", letterSpacing: ".06em", color: "#8A7C68" }}>
        ← baralhos
      </button>
      <div style={{ position: "relative", padding: "clamp(22px,4cqi,36px)", borderRadius: "26px", backgroundColor: v.dk.bg, backgroundImage: v.dk.pat, backgroundSize: v.dk.ps, display: "flex", flexWrap: "wrap", gap: "22px", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "0" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: v.dk.ink }}>
            {v.dk.sub}
          </span>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,58px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
            {v.dk.nome}
          </h1>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", color: v.dk.ink }}>
            {"último estudo: "}
            {v.dk.ultimo}
          </span>
          <div style={{ display: "flex", gap: "14px", marginTop: "4px" }}>
            <button onClick={v.editDeck} style={{ border: "none", background: "none", padding: "0", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: v.dk.ink, textDecoration: "underline" }}>
              editar
            </button>
            <button onClick={v.archiveDeck} style={{ border: "none", background: "none", padding: "0", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: v.dk.ink, textDecoration: "underline" }}>
              arquivar
            </button>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          <button className="dh19" onClick={v.goImport} style={{ height: "46px", padding: "0 18px", borderRadius: "999px", border: "1px solid rgba(74,64,52,.18)", background: "rgba(253,251,245,.7)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
            Importar PDF
          </button>
          <button className="dh19" onClick={v.goCriar} style={{ height: "46px", padding: "0 18px", borderRadius: "999px", border: "1px solid rgba(74,64,52,.18)", background: "rgba(253,251,245,.7)", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
            + Novo card
          </button>
          {!!(v.dk.hasDue) && (
              <button className="dh14" onClick={v.dk.study} style={{ height: "46px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
                Estudar agora →
              </button>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", borderTop: "1px solid #E3D9C4", borderBottom: "1px solid #E3D9C4" }}>
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", color: "#8A7C68" }}>
            TOTAL
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "34px" }}>
            {v.dk.totalFmt}
          </span>
        </div>
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", color: "#8A7C68" }}>
            PARA REVISAR
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "34px", color: "#A8436E" }}>
            {v.dk.due}
          </span>
        </div>
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", color: "#8A7C68" }}>
            NOVOS
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "34px", color: "#4F7358" }}>
            {v.dk.novos}
          </span>
        </div>
        <div style={{ padding: "16px 14px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".1em", color: "#8A7C68" }}>
            DOMINADOS
          </span>
          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "34px" }}>
            {v.dk.prog}
            %
          </span>
        </div>
      </div>
      {!!(v.dk.empty) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "14px", padding: "56px 24px", borderRadius: "26px", border: "1.5px dashed #E3D9C4", backgroundImage: "repeating-linear-gradient(to bottom,transparent 0 27px,rgba(127,160,184,.14) 27px 28px)" }}>
            <div style={{ width: "84px", height: "60px", borderRadius: "8px", background: "#FDFBF5", border: "1px solid #E3D9C4", transform: "rotate(-6deg)", boxShadow: "8px 8px 0 -1px #FAEBF0, 8px 8px 0 0 #E3D9C4" }} />
            <h3 style={{ margin: "10px 0 0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "26px" }}>
              {"Este baralho ainda está "}
              <span style={{ fontStyle: "italic", color: "#A8436E" }}>
                em branco.
              </span>
            </h3>
            <p style={{ margin: "0", maxWidth: "380px", fontSize: "14.5px", lineHeight: "1.5", color: "#6E6250" }}>
              Escreva o primeiro card à mão ou traga um resumo em PDF — você revisa tudo antes de salvar.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginTop: "6px" }}>
              <button onClick={v.goCriar} style={{ height: "46px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                Escrever um card
              </button>
              <button onClick={v.goImport} style={{ height: "46px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                Importar PDF
              </button>
            </div>
          </div>
      )}
      {!!(v.dk.notEmpty) && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "space-between", paddingBottom: "12px" }}>
              <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "24px" }}>
                Cards
              </h2>
              <input value={v.search} onChange={v.onSearch} placeholder="Buscar pergunta ou resposta…" style={{ flex: "0 1 300px", minWidth: "0", height: "42px", padding: "0 18px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontSize: "14px", outline: "none" }} />
            </div>
            {v.dkCards.map((c, i_c) => (
              <Fragment key={i_c}>
                <div className="dh20" onClick={c.edit} title="Editar card" style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", alignItems: "baseline", padding: "14px 4px", borderTop: "1px solid #E3D9C4", cursor: "pointer", borderRadius: "4px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", width: "26px" }}>
                    {c.n}
                  </span>
                  <span style={{ flex: "1 1 260px", minWidth: "0", fontFamily: "'Fraunces',serif", fontSize: "17px", lineHeight: "1.3" }}>
                    {c.q}
                  </span>
                  <span style={{ flex: "1.2 1 260px", minWidth: "0", fontSize: "14px", color: "#6E6250", lineHeight: "1.45" }}>
                    {c.a}
                  </span>
                  <span style={{ display: "flex", gap: "8px", alignItems: "center", marginLeft: "auto" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".08em", padding: "3px 9px", borderRadius: "999px", background: c.tb, color: c.tc }}>
                      {c.state}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", minWidth: "72px", textAlign: "right" }}>
                      {c.next}
                    </span>
                  </span>
                </div>
              </Fragment>
            ))}
            {!!(v.dkNoResults) && (
                <div style={{ padding: "30px 4px", borderTop: "1px solid #E3D9C4", fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "18px", color: "#8A7C68" }}>
                  Nenhum card com “
                  {v.search}
                  ”.
                </div>
            )}
            <p style={{ margin: "12px 0 0", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
              {"mostrando "}
              {v.dkShown}
              {" de "}
              {v.dk.totalFmt}
            </p>
          </div>
      )}
    </div>
  );
}
