// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment, type CSSProperties } from 'react';
import type { VM } from '../vm';
import { InicioScreen } from './InicioScreen';
import { EstudarScreen } from './EstudarScreen';
import { SessaoScreen } from './SessaoScreen';
import { ResultadoScreen } from './ResultadoScreen';
import { BaralhosScreen } from './BaralhosScreen';
import { BaralhoScreen } from './BaralhoScreen';
import { CriarScreen } from './CriarScreen';
import { ImportarScreen } from './ImportarScreen';
import { EvolucaoScreen } from './EvolucaoScreen';
import { AjustesScreen } from './AjustesScreen';
import './hover.css';

export function View({ v }: { v: VM }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: v.deskPad, background: "#E9DFCB" }}>
      <div style={{ width: "100%", maxWidth: v.frameMax, height: v.frameH, borderRadius: v.frameRadius, boxShadow: v.frameShadow, overflow: "hidden", display: "flex", position: "relative", backgroundColor: "#F6EFE0", backgroundImage: "repeating-linear-gradient(135deg,rgba(217,140,174,.09) 0 1px,transparent 1px 11px)" }}>
        {!!(v.showSidebar) && (
            <aside style={{ width: v.sideW, flex: "none", height: "100%", display: "flex", flexDirection: "column", gap: "28px", padding: "28px 18px 22px", background: "#FDFBF5", borderRight: "1px solid #E3D9C4", position: "relative" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "0 8px" }}>
                {!!(v.sideFull) && (
                  <>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
                      <div style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontWeight: "400", fontSize: "27px", lineHeight: ".95", letterSpacing: "-.02em", color: "#4A4034" }}>
                        Flashcards
                        <br />
                        <span style={{ fontStyle: "normal", fontSize: "17px", color: "#A8436E", letterSpacing: "0" }}>
                          da Dani
                        </span>
                      </div>
                      <svg width="18" height="18" viewBox="0 0 24 24" style={{ marginTop: "2px", transform: "rotate(12deg)" }}>
                        <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="#F4D9E3" stroke="#C9485B" strokeWidth="1.6" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".08em", color: "#8A7C68", textTransform: "uppercase" }}>
                      estudar hoje · lembrar depois
                    </div>
                  </>
                )}
                {!!(v.sideCompact) && (
                    <div style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "26px", color: "#A8436E", textAlign: "center" }}>
                      D.
                    </div>
                )}
              </div>
              <nav style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {v.nav.map((it, i_it) => (
                  <Fragment key={i_it}>
                    <button className="dh1" onClick={it.onClick} title={it.label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 12px", border: "none", borderRadius: "14px", background: it.bg, cursor: "pointer", textAlign: "left", position: "relative", justifyContent: it.justify }}>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68", width: "20px", flex: "none" }}>
                        {it.n}
                      </span>
                      {!!(it.full) && (
                          <span style={{ fontFamily: "'Fraunces',serif", fontSize: "19px", fontStyle: it.fs, color: "#4A4034" }}>
                            {it.label}
                          </span>
                      )}
                      <span style={{ position: "absolute", right: "10px", top: "50%", width: "6px", height: "6px", marginTop: "-3px", borderRadius: "50%", background: it.mark }} />
                    </button>
                  </Fragment>
                ))}
              </nav>
              {!!(v.sideFull) && (
                  <button className="dh2" onClick={v.goCriar} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", height: "44px", borderRadius: "999px", border: "1.5px dashed #D98CAE", background: "transparent", color: "#A8436E", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    + Novo card
                  </button>
              )}
              <div style={{ flex: "1" }} />
              {!!(v.sideFull) && (
                <>
                  <div style={{ position: "relative", padding: "16px 14px 14px", borderRadius: "16px", backgroundColor: "#F3E3B5", backgroundImage: "repeating-linear-gradient(to bottom,transparent 0 17px,rgba(201,72,91,.13) 17px 18px)", transform: "rotate(-1.2deg)" }}>
                    <div style={{ position: "absolute", top: "-9px", left: "50%", marginLeft: "-30px", width: "60px", height: "18px", background: "rgba(244,217,227,.85)", transform: "rotate(3deg)" }} />
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", letterSpacing: ".1em", color: "#7A5F14", textTransform: "uppercase" }}>
                      ofensiva
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px" }}>
                      <span style={{ fontFamily: "'Fraunces',serif", fontSize: "34px", lineHeight: "1", color: "#4A4034" }}>
                        {v.streak}
                      </span>
                      <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "15px" }}>
                        dias seguidos
                      </span>
                    </div>
                    <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#7A5F14", marginTop: "6px" }}>
                      {v.answered}
                      /
                      {v.metaResp}
                      {" hoje"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "0 8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", color: "#8A7C68" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: v.storageDot }} />
                      {v.storageMsg}
                    </div>
                  </div>
                </>
              )}
            </aside>
        )}
        <main ref={v.mainRef} style={{ flex: "1", minWidth: "0", height: "100%", overflowY: "auto", overflowX: "hidden", containerType: "inline-size", display: "flex", flexDirection: "column" }}>
          {!!(v.isMobile) && (
              <div style={{ position: "sticky", top: "0", zIndex: "5", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "rgba(246,239,224,.92)", borderBottom: "1px solid #E3D9C4", backdropFilter: "blur(6px)" }}>
                <div style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "20px", color: "#4A4034" }}>
                  {"Flashcards "}
                  <span style={{ fontStyle: "normal", fontSize: "14px", color: "#A8436E" }}>
                    da Dani
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "5px 10px", borderRadius: "999px", background: "#F3E3B5", fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#7A5F14" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24">
                    <path d="M12 2c1 5 6 7 6 13a6 6 0 0 1-12 0c0-4 3-5 3-9 1 2 2 2 3-4z" fill="#D98CAE" />
                  </svg>
                  {v.streak}
                  {" dias "}
                </div>
              </div>
          )}
          <div style={{ width: "100%", maxWidth: "1140px", margin: "0 auto", padding: "clamp(18px,4.6cqi,52px)", paddingBottom: "56px", flex: "1" }}>
            {v.isInicio && <InicioScreen v={v} />}
            {v.isEstudar && <EstudarScreen v={v} />}
            {v.isSessao && <SessaoScreen v={v} />}
            {v.isResultado && <ResultadoScreen v={v} />}
            {v.isBaralhos && <BaralhosScreen v={v} />}
            {v.isBaralho && <BaralhoScreen v={v} />}
            {v.isCriar && <CriarScreen v={v} />}
            {v.isImportar && <ImportarScreen v={v} />}
            {v.isEvolucao && <EvolucaoScreen v={v} />}
            {v.isAjustes && <AjustesScreen v={v} />}
          </div>
          {!!(v.isMobile) && (
              <nav style={{ position: "sticky", bottom: "0", zIndex: "6", display: "grid", gridTemplateColumns: "repeat(5,1fr)", padding: "8px 6px 14px", background: "#FDFBF5", borderTop: "1px solid #E3D9C4" }}>
                {v.nav.map((it, i_it) => (
                  <Fragment key={i_it}>
                    <button onClick={it.onClick} style={{ border: "none", background: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "6px 0", minHeight: "52px", cursor: "pointer" }}>
                      <span style={{ width: "34px", height: "24px", borderRadius: "999px", display: "flex", alignItems: "center", justifyContent: "center", background: it.bg, fontFamily: "'IBM Plex Mono',monospace", fontSize: "10px", color: "#8A7C68" }}>
                        {it.n}
                      </span>
                      <span style={{ fontSize: "11.5px", fontWeight: it.fw, color: "#4A4034" }}>
                        {it.label}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </nav>
          )}
        </main>
        {!!(v.modalNb) && (
            <div onClick={v.closeModal} style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(74,64,52,.32)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeUp .2s ease both" }}>
              <div onClick={v.stop} style={{ position: "relative", width: "100%", maxWidth: "480px", maxHeight: "100%", overflow: "auto", padding: "30px", borderRadius: "28px", background: "#FDFBF5", boxShadow: "0 30px 60px -20px rgba(74,64,52,.45)", display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ position: "absolute", top: "-10px", left: "50%", marginLeft: "-40px", width: "80px", height: "20px", background: "rgba(220,235,217,.95)", transform: "rotate(-3deg)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#8A7C68" }}>
                    {v.nbTag}
                  </span>
                  <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "30px" }}>
                    {"Qual é a "}
                    <span style={{ fontStyle: "italic", color: "#4F7358" }}>
                      matéria?
                    </span>
                  </h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <input value={v.nb.name} onChange={v.onNbName} placeholder="Ex.: Microbiologia" style={{ height: "50px", padding: "0 20px", borderRadius: "999px", border: `1.5px solid ${v.nbBd}`, background: "#F6EFE0", fontSize: "16px", outline: "none" }} />
                  {!!(v.nbErr) && (
                      <span style={{ fontSize: "12.5px", color: "#A3303F", paddingLeft: "20px" }}>
                        {v.nbErrMsg}
                      </span>
                  )}
                  <input value={v.nb.desc} onChange={v.onNbDesc} placeholder="Assuntos (opcional) · ex.: bactérias · vírus" style={{ height: "44px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#F6EFE0", fontSize: "14px", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#8A7C68" }}>
                    COR DA FICHA
                  </span>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {v.nbColors.map((c, i_c) => (
                      <Fragment key={i_c}>
                        <button onClick={c.pick} title={c.n} style={{ width: "44px", height: "44px", borderRadius: "50%", border: "none", background: c.bg, boxShadow: c.sh, cursor: "pointer" }} />
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", borderRadius: "18px", border: "1px solid #E3D9C4" }}>
                  <div style={{ width: "64px", height: "48px", borderRadius: "10px", flex: "none", background: v.nbC.bg }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: "0" }}>
                    <span style={{ fontFamily: "'Fraunces',serif", fontSize: "19px", color: v.nbPrevC }}>
                      {v.nbPrev}
                    </span>
                    <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                      {v.nbPrevSub}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <button onClick={v.closeModal} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button className="dh14" onClick={v.createDeck} style={{ height: "48px", padding: "0 24px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
                    {v.nbBtn}
                  </button>
                </div>
              </div>
            </div>
        )}
        {!!(v.modalBackup) && (
            <div onClick={v.closeModal} style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(74,64,52,.32)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeUp .2s ease both" }}>
              <div onClick={v.stop} style={{ width: "100%", maxWidth: "440px", padding: "30px", borderRadius: "28px", background: "#FDFBF5", boxShadow: "0 30px 60px -20px rgba(74,64,52,.45)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#A3303F" }}>
                  CONFIRMAR
                </span>
                <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "28px", lineHeight: "1.1" }}>
                  {"Substituir tudo pelo "}
                  <span style={{ fontStyle: "italic" }}>
                    backup?
                  </span>
                </h2>
                <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.5", color: "#6E6250" }}>
                  Os baralhos, cards e histórico atuais serão trocados pelo conteúdo do arquivo. Se estiver em dúvida, exporte um backup antes.
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "6px" }}>
                  <button onClick={v.closeModal} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button className="dh21" onClick={v.confirmBackup} style={{ height: "48px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#A3303F", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    Escolher arquivo e substituir
                  </button>
                </div>
              </div>
            </div>
        )}
        {!!(v.modalConfirm) && (
            <div onClick={v.closeModal} style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(74,64,52,.32)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeUp .2s ease both" }}>
              <div onClick={v.stop} style={{ width: "100%", maxWidth: "440px", padding: "30px", borderRadius: "28px", background: "#FDFBF5", boxShadow: "0 30px 60px -20px rgba(74,64,52,.45)", display: "flex", flexDirection: "column", gap: "16px" }}>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#A3303F" }}>
                  CONFIRMAR
                </span>
                <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "28px", lineHeight: "1.1" }}>
                  {v.confTitle}
                  {" "}
                  <span style={{ fontStyle: "italic" }}>
                    {v.confTitleEm}
                  </span>
                </h2>
                <p style={{ margin: "0", fontSize: "14.5px", lineHeight: "1.5", color: "#6E6250" }}>
                  {v.confText}
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap", marginTop: "6px" }}>
                  <button onClick={v.closeModal} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button className="dh21" onClick={v.confirmAction} style={{ height: "48px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#A3303F", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
                    {v.confBtn}
                  </button>
                </div>
              </div>
            </div>
        )}
        {!!(v.modalLemb) && (
            <div onClick={v.closeModal} style={{ position: "absolute", inset: "0", zIndex: "20", background: "rgba(74,64,52,.32)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", animation: "fadeUp .2s ease both" }}>
              <div onClick={v.stop} style={{ position: "relative", width: "100%", maxWidth: "440px", padding: "30px", borderRadius: "28px", background: "#FDFBF5", boxShadow: "0 30px 60px -20px rgba(74,64,52,.45)", display: "flex", flexDirection: "column", gap: "18px" }}>
                <div style={{ position: "absolute", top: "-10px", left: "50%", marginLeft: "-40px", width: "80px", height: "20px", background: "rgba(243,227,181,.95)", transform: "rotate(3deg)" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "10.5px", letterSpacing: ".12em", color: "#A3303F" }}>
                    LEMBRETE ✦
                  </span>
                  <h2 style={{ margin: "0", fontFamily: "'Fraunces',serif", fontWeight: "400", fontSize: "30px" }}>
                    {"Qual é a "}
                    <span style={{ fontStyle: "italic", color: "#A8436E" }}>
                      próxima prova?
                    </span>
                  </h2>
                </div>
                <input value={v.lb.titulo} onChange={v.onLbTitulo} placeholder="Ex.: Prova de Anatomia II" style={{ height: "50px", padding: "0 20px", borderRadius: "999px", border: `1.5px solid ${v.lbBd}`, background: "#F6EFE0", fontSize: "16px", outline: "none" }} />
                <input type="date" value={v.lb.data} onChange={v.onLbData} style={{ height: "50px", padding: "0 20px", borderRadius: "999px", border: `1.5px solid ${v.lbBd}`, background: "#F6EFE0", fontSize: "15px", fontFamily: "'IBM Plex Mono',monospace", outline: "none" }} />
                {!!(v.lbErr) && (
                    <span style={{ fontSize: "12.5px", color: "#A3303F", paddingLeft: "20px" }}>
                      Preencha o nome e a data.
                    </span>
                )}
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", flexWrap: "wrap" }}>
                  {!!(v.hasLembrete) && (
                      <button className="dh22" onClick={v.removeLembrete} style={{ height: "48px", padding: "0 18px", borderRadius: "999px", border: "none", background: "transparent", fontWeight: "600", fontSize: "14px", color: "#A3303F", cursor: "pointer", marginRight: "auto" }}>
                        Remover
                      </button>
                  )}
                  <button onClick={v.closeModal} style={{ height: "48px", padding: "0 20px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "transparent", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
                    Cancelar
                  </button>
                  <button className="dh14" onClick={v.saveLembrete} style={{ height: "48px", padding: "0 24px", borderRadius: "999px", border: "none", background: "#B03D66", color: "#FFF8F3", fontWeight: "700", fontSize: "14px", cursor: "pointer", boxShadow: "0 3px 0 #8C2F51" }}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
        )}
        {!!(v.hasToast) && (
            <div style={{ position: "absolute", left: "50%", bottom: v.toastBottom, transform: "translateX(-50%)", zIndex: "30", display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px 12px 12px", borderRadius: "999px", background: v.toastBg, color: v.toastC, boxShadow: "0 14px 30px -12px rgba(74,64,52,.45)", fontSize: "14px", fontWeight: "600", whiteSpace: "nowrap", maxWidth: "92%", animation: "fadeUp .3s ease both" }}>
              <span style={{ width: "30px", height: "30px", borderRadius: "50%", flex: "none", display: "flex", alignItems: "center", justifyContent: "center", background: v.toastIc, color: "#FFF", fontSize: "14px", animation: "pop .45s ease both" }}>
                {v.toastSym}
              </span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                {v.toastText}
              </span>
              {!!(v.toastMeta) && (
                  <span style={{ position: "absolute", left: "24px", top: "0", pointerEvents: "none" }}>
                    <span style={{ position: "absolute", color: "#D9BE6B", "--dx": "-10px", "--dy": "-44px", animation: "sparkle 1s ease-out both" } as CSSProperties}>
                      ✦
                    </span>
                    <span style={{ position: "absolute", color: "#D98CAE", "--dx": "26px", "--dy": "-50px", animation: "sparkle 1s .08s ease-out both" } as CSSProperties}>
                      ✦
                    </span>
                    <span style={{ position: "absolute", color: "#C9485B", "--dx": "60px", "--dy": "-34px", animation: "sparkle 1s .16s ease-out both" } as CSSProperties}>
                      ♥
                    </span>
                    <span style={{ position: "absolute", color: "#7FA886", "--dx": "100px", "--dy": "-48px", animation: "sparkle 1s .12s ease-out both" } as CSSProperties}>
                      ✦
                    </span>
                  </span>
              )}
            </div>
        )}
      </div>
    </div>
  );
}
