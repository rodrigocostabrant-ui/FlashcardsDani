// Gerado por scripts/design-to-tsx.mjs a partir de design/markup.src.html — não edite à mão.
import { Fragment } from 'react';
import type { VM } from '../vm';

export function AjustesScreen({ v }: { v: VM }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "34px", animation: "fadeUp .35s ease both", maxWidth: "880px" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", textTransform: "uppercase", color: "#8A7C68" }}>
          05 · ajustes
        </div>
        <h1 style={{ fontFamily: "'Fraunces',serif", fontWeight: "380", fontSize: "clamp(36px,6.4cqi,60px)", lineHeight: "1", letterSpacing: "-.025em", margin: "0" }}>
          {"Do "}
          <span style={{ fontStyle: "italic", color: "#A8436E" }}>
            seu
          </span>
          {" jeito."}
        </h1>
      </div>
      <section style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", paddingTop: "22px", borderTop: "1px solid #E3D9C4" }}>
        <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", color: "#A8436E" }}>
            01 · RITMO
          </span>
          <span style={{ fontSize: "13.5px", color: "#6E6250", lineHeight: "1.45" }}>
            Um ponto de partida. Dá para ajustar cada número depois.
          </span>
        </div>
        <div style={{ flex: "1 1 420px", minWidth: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "12px" }}>
          {v.presets.map((p, i_p) => (
            <Fragment key={i_p}>
              <button className="dh24" onClick={p.pick} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px", padding: "18px", borderRadius: "20px", border: p.bd, backgroundColor: p.bg, backgroundImage: p.pat, backgroundSize: p.ps, textAlign: "left", cursor: "pointer", transition: "transform .15s" }}>
                <span style={{ position: "absolute", right: "14px", top: "14px", width: "22px", height: "22px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", background: p.ck, color: "#FFF" }}>
                  {p.sym}
                </span>
                <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "26px", lineHeight: "1" }}>
                  {p.l}
                </span>
                <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11.5px" }}>
                  {p.v}
                  {" cards/dia"}
                </span>
                <span style={{ fontSize: "12.5px", color: "#6E6250", lineHeight: "1.4" }}>
                  {p.d}
                </span>
              </button>
            </Fragment>
          ))}
        </div>
      </section>
      <section style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", paddingTop: "22px", borderTop: "1px solid #E3D9C4" }}>
        <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", color: "#A8436E" }}>
            02 · METAS
          </span>
          <span style={{ fontSize: "13.5px", color: "#6E6250", lineHeight: "1.45" }}>
            Meta é alvo: não encerra a sessão. O limite de novos é teto.
          </span>
        </div>
        <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column" }}>
          {v.steppers.map((t, i_t) => (
            <Fragment key={i_t}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px 0", borderBottom: "1px dashed #E3D9C4" }}>
                <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                  <span style={{ fontWeight: "700", fontSize: "15px" }}>
                    {t.l}
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#8A7C68" }}>
                    {t.d}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", padding: "4px", borderRadius: "999px", background: "#FDFBF5", border: "1px solid #E3D9C4" }}>
                  <button className="dh8" onClick={t.dec} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "none", background: "#F6EFE0", fontSize: "18px", cursor: "pointer" }}>
                    −
                  </button>
                  <span style={{ minWidth: "44px", textAlign: "center", fontFamily: "'IBM Plex Mono',monospace", fontSize: "15px" }}>
                    {t.v}
                  </span>
                  <button className="dh15" onClick={t.inc} style={{ width: "38px", height: "38px", borderRadius: "50%", border: "none", background: "#F6EFE0", fontSize: "18px", cursor: "pointer" }}>
                    +
                  </button>
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      </section>
      <section style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", paddingTop: "22px", borderTop: "1px solid #E3D9C4" }}>
        <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", color: "#A8436E" }}>
            03 · DESCANSO
          </span>
          <span style={{ fontSize: "13.5px", color: "#6E6250", lineHeight: "1.45" }}>
            Dias de descanso não quebram a ofensiva.
          </span>
        </div>
        <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {v.restDays.map((d, i_d) => (
            <Fragment key={i_d}>
              <button onClick={d.toggle} style={{ minWidth: "56px", height: "48px", padding: "0 14px", borderRadius: "999px", border: `1px solid ${d.bd}`, background: d.bg, fontWeight: "700", fontSize: "14px", cursor: "pointer", color: d.c }}>
                {d.l}
              </button>
            </Fragment>
          ))}
        </div>
      </section>
      <section style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", paddingTop: "22px", borderTop: "1px solid #E3D9C4" }}>
        <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", gap: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", color: "#A8436E" }}>
            04 · BACKUP
          </span>
        </div>
        <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ position: "relative", padding: "22px 24px", borderRadius: "22px", backgroundColor: "#FAEBF0", backgroundImage: "radial-gradient(rgba(201,72,91,.14) 1.2px,transparent 1.7px)", backgroundSize: "14px 14px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <span style={{ fontFamily: "'Fraunces',serif", fontStyle: "italic", fontSize: "24px" }}>
              Seu estudo fica com você.
            </span>
            <span style={{ fontSize: "14px", lineHeight: "1.5", color: "#6E4A57" }}>
              Seus dados são armazenados localmente neste dispositivo — sem conta, sem servidor, funciona offline. Faça backups periódicos para não perder seu progresso.
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#9C3E66", marginTop: "4px" }}>
              {v.ultimoBackup}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <button className="dh25" onClick={v.exportBackup} style={{ height: "48px", padding: "0 22px", borderRadius: "999px", border: "none", background: "#4A4034", color: "#FDFBF5", fontWeight: "700", fontSize: "14px", cursor: "pointer" }}>
              Exportar dados
            </button>
            <button className="dh1" onClick={v.openImportBackup} style={{ height: "48px", padding: "0 22px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "600", fontSize: "14px", cursor: "pointer" }}>
              Importar dados
            </button>
          </div>
        </div>
      </section>
      {!!(v.hasArchived) && (
          <section style={{ display: "flex", flexWrap: "wrap", gap: "16px 40px", paddingTop: "22px", borderTop: "1px solid #E3D9C4" }}>
            <div style={{ flex: "0 0 190px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", letterSpacing: ".12em", color: "#A8436E" }}>
                05 · ARQUIVADOS
              </span>
              <span style={{ fontSize: "13.5px", color: "#6E6250", lineHeight: "1.45" }}>
                Fora das sessões, mas com todo o histórico guardado.
              </span>
            </div>
            <div style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column" }}>
              {v.archived.map((d, i_d) => (
                <Fragment key={i_d}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: "1px dashed #E3D9C4" }}>
                    <span style={{ width: "14px", height: "18px", borderRadius: "3px", flex: "none", background: d.dot }} />
                    <div style={{ flex: "1", minWidth: "0", display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{ fontFamily: "'Fraunces',serif", fontSize: "18px" }}>
                        {d.nome}
                      </span>
                      <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "11px", color: "#8A7C68" }}>
                        {d.totalFmt}
                        {" cards"}
                      </span>
                    </div>
                    <button className="dh23" onClick={d.remove} style={{ height: "36px", padding: "0 14px", borderRadius: "999px", border: "none", background: "transparent", fontWeight: "600", fontSize: "13px", color: "#A3303F", cursor: "pointer" }}>
                      Excluir
                    </button>
                    <button className="dh15" onClick={d.restore} style={{ height: "36px", padding: "0 16px", borderRadius: "999px", border: "1px solid #E3D9C4", background: "#FDFBF5", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}>
                      Restaurar
                    </button>
                  </div>
                </Fragment>
              ))}
            </div>
          </section>
      )}
    </div>
  );
}
