// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function InicioScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", animation: "fadeUp .35s ease both" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-end", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxWidth: "620px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
            {v.todayLabel}
          </div>
          <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0", color: "#4A4034" }}>
            {"Oi, Dani. "}
            <span style={{ fontStyle: "italic", color: "#A8436E" }}>
              Vamos estudar?
            </span>
          </h1>
          {!!(v.faltam) && (
              <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#6E6250", textWrap: "pretty", maxWidth: "480px" }}>
                {"Cada revisão de hoje é um plantão mais tranquilo amanhã. Você está a "}
                <strong style={{ color: "#4A4034" }}>
                  {v.faltam}
                  {" "}
                  {v.faltamCards}
                </strong>
                {" da meta."}
              </p>
          )}
          {!!(v.metaFeita) && (
              <p style={{ margin: "0", fontSize: "16px", lineHeight: "1.55", color: "#6E6250", textWrap: "pretty", maxWidth: "480px" }}>
                {"Meta de hoje cumprida. "}
                <strong style={{ color: "#4A4034" }}>
                  Tudo o que vier agora é bônus.
                </strong>
              </p>
          )}
        </div>
        {!!(v.hasLembrete) && (
            <div onClick={v.openLembrete} title="Editar lembrete" style={{ position: "relative", width: "196px", padding: "20px 18px 16px", background: "#FFF6D8", boxShadow: "0 6px 14px rgba(150,130,100,.12)", transform: "rotate(2.2deg)", borderRadius: "4px 4px 14px 4px", cursor: "pointer" }}>
              <div style={{ position: "absolute", top: "-10px", left: "60px", width: "72px", height: "20px", background: "rgba(220,235,217,.9)", transform: "rotate(-4deg)", backgroundImage: "repeating-linear-gradient(90deg,rgba(127,168,134,.25) 0 2px,transparent 2px 6px)" }} />
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".1em", color: "#A3303F", textTransform: "uppercase" }}>
                lembrete ✦
              </div>
              <div style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "19px", lineHeight: "1.15", marginTop: "6px" }}>
                {v.lembTitulo}
              </div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", marginTop: "6px" }}>
                {v.lembQuando}
              </div>
            </div>
        )}
        {!!(v.noLembrete) && (
            <button className="dh3" onClick={v.openLembrete} style={{ width: "196px", padding: "18px", borderRadius: "4px 4px 14px 4px", border: "1.5px dashed #E3D9C4", background: "transparent", transform: "rotate(2.2deg)", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px", textAlign: "left" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".1em", color: "#A3303F", textTransform: "uppercase" }}>
                lembrete ✦
              </span>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "17px", lineHeight: "1.15", color: "#8A7C68" }}>
                + anotar uma prova
              </span>
            </button>
        )}
      </div>
      {!!(v.hasRecado) && (
          <div style={{ position: "relative", display: "flex", gap: "18px", alignItems: "flex-start", padding: "clamp(20px,3.4cqi,30px) clamp(20px,3.6cqi,34px)", borderRadius: "6px 22px 22px 22px", backgroundColor: "#FDFBF5", backgroundImage: "repeating-linear-gradient(to bottom,transparent 0 31px,rgba(217,140,174,.16) 31px 32px)", border: "1px solid #E3D9C4", boxShadow: "0 8px 22px -12px rgba(150,130,100,.35)", animation: "fadeUp .45s ease both" }}>
            <div style={{ position: "absolute", top: "-10px", left: "28px", width: "84px", height: "20px", background: "rgba(244,217,227,.92)", transform: "rotate(-3deg)", backgroundImage: "radial-gradient(rgba(201,72,91,.2) 1px,transparent 1.5px)", backgroundSize: "7px 7px" }} />
            <svg width="34" height="34" viewBox="0 0 24 24" style={{ flex: "none", marginTop: "4px", animation: "floaty 6s ease-in-out infinite" }}>
              <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#F4D9E3" stroke="#C9485B" strokeWidth="1.6" strokeLinejoin="round" />
            </svg>
            <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", textTransform: "uppercase", color: "#A8436E" }}>
                um recadinho pra você
              </span>
              <p style={{ margin: "0", fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "clamp(19px,2.8cqi,24px)", lineHeight: "1.4", color: "#4A4034", whiteSpace: "pre-line", textWrap: "pretty" }}>
                {v.recadoTexto}
              </p>
              {!!(v.recadoAssinatura) && (
                  <span style={{ alignSelf: "flex-end", fontFamily: "'Fraunces',serif", fontSize: "17px", color: "#A8436E" }}>
                    {"— "}
                    {v.recadoAssinatura}
                  </span>
              )}
            </div>
          </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
        <div style={{ flex: "2 1 420px", minWidth: "0", position: "relative", overflow: "hidden", padding: "clamp(22px,3.6cqi,36px)", borderRadius: "26px", backgroundColor: "#F3E3B5", backgroundImage: "repeating-linear-gradient(to bottom,transparent 0 27px,rgba(201,72,91,.10) 27px 28px)", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ position: "absolute", left: "clamp(14px,2.4cqi,24px)", top: "0", bottom: "0", width: "1px", background: "rgba(201,72,91,.25)" }} />
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#7A5F14", paddingLeft: "14px" }}>
            para revisar hoje
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "14px", flexWrap: "wrap", paddingLeft: "14px" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontWeight: "340", fontSize: "clamp(88px,15cqi,148px)", lineHeight: ".8", letterSpacing: "-.05em", color: "#4A4034" }}>
              {v.dueTotal}
            </span>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingBottom: "8px" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "26px", lineHeight: "1" }}>
                cards
              </span>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px", color: "#7A5F14" }}>
                {v.learnCount}
                {" aprendendo · "}
                {v.revCount}
                {" para revisar"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", paddingLeft: "14px" }}>
            <button className="dh4" onClick={v.startAll} style={{ display: "inline-flex", alignItems: "center", gap: "12px", height: "56px", padding: "0 30px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "17px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
              {"Começar estudo "}
              <span style={{ fontSize: "20px" }}>
                →
              </span>
            </button>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px", color: "#7A5F14" }}>
              {v.estLabel}
            </span>
          </div>
          <svg width="190" height="30" viewBox="0 0 190 30" style={{ position: "absolute", right: "22px", bottom: "18px", opacity: ".55" }}>
            <path d="M0 18 H70 L78 18 L84 4 L92 28 L98 12 L104 18 H190" fill="none" stroke="#C9485B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ flex: "1 1 260px", minWidth: "0", padding: "26px", borderRadius: "26px", background: "#FDFBF5", border: "1px solid #E3D9C4", boxShadow: "0 2px 8px rgba(150,130,100,.08)", display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
              meta de hoje
            </div>
            <button onClick={v.goAjustes} style={{ border: "none", background: "none", padding: "0", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#A8436E", textDecoration: "underline" }}>
              ajustar
            </button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            <div style={{ position: "relative", width: "124px", height: "124px", flex: "none" }}>
              <svg width="124" height="124" viewBox="0 0 124 124">
                <circle cx="62" cy="62" r="52" fill="none" stroke="#F4D9E3" strokeWidth="12" />
                <circle cx="62" cy="62" r="52" fill="none" stroke="#D98CAE" strokeWidth="12" strokeLinecap="round" strokeDasharray="326.7" strokeDashoffset={v.ringOffset} transform="rotate(-90 62 62)" style={{ transition: "stroke-dashoffset .6s ease" }} />
              </svg>
              <div style={{ position: "absolute", inset: "0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "'Fraunces',serif", fontSize: "34px", lineHeight: "1" }}>
                  {v.answered}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                  {"de "}
                  {v.metaResp}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", minWidth: "0" }}>
              <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "20px", lineHeight: "1.1" }}>
                {v.metaMsg}
              </span>
              <span style={{ fontSize: "13.5px", color: "#6E6250", lineHeight: "1.4" }}>
                cards respondidos
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingTop: "4px", borderTop: "1px dashed #E3D9C4" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", paddingTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span>
                  Cards criados
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                  {v.created}
                  {" / "}
                  {v.metaCriar}
                </span>
              </div>
              <div style={{ height: "8px", borderRadius: "999px", background: "#EAF1E6", overflow: "hidden" }}>
                <div style={{ height: "100%", width: v.createdPct, background: "#7FA886", borderRadius: "999px", transition: "width .4s" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span>
                  Novos vistos
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "12px" }}>
                  {v.novosHoje}
                  {" / "}
                  {v.metaNovos}
                </span>
              </div>
              <div style={{ height: "8px", borderRadius: "999px", background: "#F6EFE0", overflow: "hidden" }}>
                <div style={{ height: "100%", width: v.novosPct, background: "#D9BE6B", borderRadius: "999px" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "18px" }}>
        <div style={{ flex: "1 1 250px", minWidth: "0", padding: "24px", borderRadius: "24px", backgroundColor: "#F4D9E3", backgroundImage: "radial-gradient(rgba(201,72,91,.16) 1.2px,transparent 1.7px)", backgroundSize: "14px 14px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#9C3E66" }}>
            ofensiva
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "10px" }}>
            <svg width="30" height="36" viewBox="0 0 24 28">
              <path d="M12 1c1.2 6 7 8.2 7 15a7 7 0 0 1-14 0c0-4.6 3.4-5.8 3.4-10.2 1.2 2.3 2.4 2.3 3.6-4.8z" fill="#FDFBF5" stroke="#C9485B" strokeWidth="1.4" />
              <path d="M12 13c.6 3 3.4 4 3.4 7a3.4 3.4 0 0 1-6.8 0c0-2 1.6-2.6 1.6-4.6.6 1 1.2 1 1.8-2.4z" fill="#D98CAE" />
            </svg>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: "52px", lineHeight: ".85" }}>
              {v.streak}
            </span>
            <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "19px", paddingBottom: "3px" }}>
              dias
            </span>
            <span style={{ marginLeft: "auto", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#9C3E66" }}>
              {"recorde "}
              {v.recorde}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "6px", padding: "12px", borderRadius: "16px", background: "#FDFBF5" }}>
            {v.week.map((d, i_d) => (
              <Fragment key={i_d}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#8A7C68" }}>
                    {d.l}
                  </span>
                  <span style={{ width: "26px", height: "26px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", background: d.bg, border: d.bd, color: d.c }}>
                    {d.sym}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
        <div style={{ flex: "1.4 1 300px", minWidth: "0", padding: "24px", borderRadius: "24px", background: "#FDFBF5", border: "1px solid #E3D9C4", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
              disciplina · 30 dias
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
              {v.m30met}
              {" de "}
              {v.m30count}
              {" dias"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontSize: "44px", lineHeight: "1" }}>
              {v.m30pct}
            </span>
            <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "17px", color: "#6E6250" }}>
              dos dias cumpridos
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(15,1fr)", gap: "5px" }}>
            {v.m30.map((c, i_c) => (
              <Fragment key={i_c}>
                <div title={c.t} style={{ aspectRatio: "1", borderRadius: "5px", background: c.bg, boxShadow: c.sh }} />
              </Fragment>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "14px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#8A7C68" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#87BC96" }} />
              meta batida
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#F3E3B5" }} />
              estudou pouco
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#FDFBF5", boxShadow: "inset 0 0 0 1px #E3D9C4" }} />
              descanso
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <i style={{ width: "10px", height: "10px", borderRadius: "3px", background: "#F4D9E3" }} />
              não estudou
            </span>
          </div>
        </div>
        <div style={{ flex: ".8 1 200px", minWidth: "0", padding: "24px", borderRadius: "24px", backgroundColor: "#E4E8D6", backgroundImage: "repeating-linear-gradient(135deg,rgba(85,100,63,.08) 0 1px,transparent 1px 8px)", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#55643F" }}>
            escudo semanal
          </div>
          <svg width="58" height="64" viewBox="0 0 40 44" style={{ animation: "floaty 5s ease-in-out infinite" }}>
            <path d="M20 2 L36 8 V21 C36 31 28 38 20 42 C12 38 4 31 4 21 V8 Z" fill="#FDFBF5" stroke="#55643F" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M20 8 L31 12 V21 C31 28 26 33 20 36 Z" fill="#DCEBD9" />
            <path d="M20 14 l1.8 3.8 4.2.5-3.1 2.8.9 4.1-3.8-2.1-3.8 2.1.9-4.1-3.1-2.8 4.2-.5z" fill="#D98CAE" />
          </svg>
          <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "21px", lineHeight: "1.1" }}>
            {v.escudoTitulo}
          </span>
          <span style={{ fontSize: "13px", lineHeight: "1.45", color: "#55643F" }}>
            {v.escudoTexto}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "36px", paddingTop: "6px" }}>
        <div style={{ flex: "1.6 1 380px", minWidth: "0", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingBottom: "10px" }}>
            <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "26px" }}>
              {"Baralhos "}
              <span style={{ fontStyle: "italic", color: "#4F7358" }}>
                de hoje
              </span>
            </h2>
            <button onClick={v.goBaralhos} style={{ border: "none", background: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", textDecoration: "underline" }}>
              ver todos
            </button>
          </div>
          {v.decksDue.map((d, i_d) => (
            <Fragment key={i_d}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 4px", borderTop: "1px solid #E3D9C4" }}>
                <span style={{ width: "14px", height: "18px", borderRadius: "3px", flex: "none", background: d.dot }} />
                <button onClick={d.open} style={{ flex: "1", minWidth: "0", border: "none", background: "none", padding: "0", textAlign: "left", cursor: "pointer", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontFamily: "'Fraunces',serif", fontSize: "18px" }}>
                    {d.nome}
                  </span>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                    {d.due}
                    {" revisar · "}
                    {d.novos}
                    {" novos"}
                  </span>
                </button>
                <button className="dh5" onClick={d.study} style={{ height: "36px", padding: "0 16px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                  Estudar
                </button>
              </div>
            </Fragment>
          ))}
          {!!(v.noDecksDue) && (
              <div style={{ padding: "16px 4px", borderTop: "1px solid #E3D9C4", fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "17px", color: "#8A7C68" }}>
                Tudo em dia por hoje. Que tal escrever uns cards novos?
              </div>
          )}
        </div>
        <div style={{ flex: "1 1 260px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
          <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "26px" }}>
            {"Próximos "}
            <span style={{ fontStyle: "italic", color: "#A8436E" }}>
              dias
            </span>
          </h2>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px", paddingTop: "10px" }}>
            {v.next7.map((b, i_b) => (
              <Fragment key={i_b}>
                <div style={{ flex: "1", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px" }}>
                    {b.v}
                  </span>
                  <div style={{ width: "100%", maxWidth: "26px", height: b.h, borderRadius: "6px 6px 3px 3px", background: b.c }} />
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#8A7C68" }}>
                    {b.l}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>
          <p style={{ margin: "0", fontSize: "13px", color: "#8A7C68", lineHeight: "1.5" }}>
            Revisões já agendadas pelo FSRS. Manter a meta hoje deixa a semana mais leve.
          </p>
        </div>
      </div>
    </div>
  );
}
