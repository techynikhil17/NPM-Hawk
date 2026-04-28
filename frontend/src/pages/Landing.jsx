import React, { useEffect, useRef, useState } from "react";

/* ─── Scroll reveal ─────────────────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold });
    if (ref.current) o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  return [ref, vis];
}

function Reveal({ children, delay = 0 }) {
  const [ref, vis] = useInView();
  return (
    <div ref={ref} style={{ opacity: vis ? 1 : 0, transform: vis ? "none" : "translateY(30px)", transition: `opacity .8s ${delay}ms cubic-bezier(0.16, 1, 0.3, 1), transform .8s ${delay}ms cubic-bezier(0.16, 1, 0.3, 1)` }}>
      {children}
    </div>
  );
}

/* ─── Typewriter ────────────────────────────────────────────────────── */
function Typewriter({ text, speed = 60 }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => { i++; setOut(text.slice(0, i)); if (i >= text.length) clearInterval(t); }, speed);
    return () => clearInterval(t);
  }, [text]);
  return <>{out}<span style={{ borderRight: "2px solid #38bdf8", marginLeft: 2, animation: "cur .9s step-end infinite", boxShadow: "0 0 8px #38bdf8" }} /></>;
}

/* ─── Components ────────────────────────────────────────────────────── */
function Tag({ children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 20, border: "1px solid rgba(56, 189, 248, 0.3)", background: "rgba(56, 189, 248, 0.05)", fontSize: 12, color: "#7dd3fc", fontWeight: 600, letterSpacing: ".05em", textTransform: "uppercase", boxShadow: "0 0 15px rgba(56, 189, 248, 0.1), inset 0 0 10px rgba(56, 189, 248, 0.05)", backdropFilter: "blur(4px)" }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#38bdf8", boxShadow: "0 0 8px #38bdf8" }} />
      {children}
    </span>
  );
}

function PrimaryBtn({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: "14px 32px", borderRadius: 8, border: "1px solid rgba(56, 189, 248, 0.6)", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit", background: hover ? "rgba(56, 189, 248, 0.15)" : "rgba(56, 189, 248, 0.05)", color: "#e0f2fe", transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)", letterSpacing: ".05em", textTransform: "uppercase", boxShadow: hover ? "0 0 30px rgba(56, 189, 248, 0.4), inset 0 0 15px rgba(56, 189, 248, 0.2)" : "0 0 15px rgba(56, 189, 248, 0.1)", position: "relative", overflow: "hidden", backdropFilter: "blur(4px)" }}>
      <div style={{ position: "absolute", top: 0, left: "-100%", width: "50%", height: "100%", background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)", transform: hover ? "translateX(400%)" : "none", transition: "transform .6s" }} />
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ padding: "14px 32px", borderRadius: 8, border: "1px solid " + (hover ? "rgba(56, 189, 248, 0.6)" : "rgba(56, 189, 248, 0.2)"), cursor: "pointer", fontSize: 14, fontWeight: 600, fontFamily: "inherit", background: hover ? "rgba(56, 189, 248, 0.08)" : "transparent", color: hover ? "#bae6fd" : "#7dd3fc", transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)", letterSpacing: ".02em", boxShadow: hover ? "0 0 20px rgba(56, 189, 248, 0.2)" : "none", backdropFilter: "blur(4px)" }}>
      {children}
    </button>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.3) 20%, rgba(239, 68, 68, 0.3) 80%, transparent)", margin: "0 auto", width: "100%", maxWidth: 1000 }} />;
}

/* ─── Nav ───────────────────────────────────────────────────────────── */
function Nav({ onEnter }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, height: 64, display: "flex", alignItems: "center", padding: "0 32px", justifyContent: "space-between", background: scrolled ? "rgba(6, 9, 15, 0.85)" : "transparent", backdropFilter: "blur(16px)", borderBottom: scrolled ? "1px solid rgba(56, 189, 248, 0.15)" : "1px solid transparent", transition: "all .4s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: 12, background: "linear-gradient(135deg, #38bdf8 0%, #8b5cf6 100%)", boxShadow: "0 0 20px rgba(56, 189, 248, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          🦅
        </div>
        <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>NPM Hawk</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        {["Features", "Health Score", "Security"].map(l => (
          <a key={l} href="#" onClick={e => { e.preventDefault(); const id = l.toLowerCase().replace(/ /g, "-"); const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: "smooth", block: "start" }); }}
            style={{ position: "relative", fontSize: 13, color: "#94a3b8", textDecoration: "none", transition: "color .2s", fontWeight: 600, letterSpacing: "0.02em" }}
            onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.children[0].style.transform = "scaleX(1)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.children[0].style.transform = "scaleX(0)"; }}>
            {l}
            <span style={{ position: "absolute", bottom: -6, left: 0, width: "100%", height: 2, background: "linear-gradient(90deg, #38bdf8, #8b5cf6)", transform: "scaleX(0)", transformOrigin: "left", transition: "transform .3s cubic-bezier(0.16, 1, 0.3, 1)" }} />
          </a>
        ))}
      </div>
      <button onClick={() => onEnter("dashboard")} style={{ padding: "10px 24px", borderRadius: 6, border: "1px solid rgba(56, 189, 248, 0.4)", background: "rgba(56, 189, 248, 0.1)", color: "#7dd3fc", fontSize: 13, fontWeight: 700, cursor: "pointer", transition: "all .2s", boxShadow: "0 0 15px rgba(56, 189, 248, 0.15)" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#38bdf8"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.boxShadow = "0 0 25px rgba(56, 189, 248, 0.4)"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.4)"; e.currentTarget.style.color = "#7dd3fc"; e.currentTarget.style.boxShadow = "0 0 15px rgba(56, 189, 248, 0.15)"; }}>
        Open Dashboard →
      </button>
    </nav>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────── */
function Hero({ onEnter }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "120px 24px 80px", textAlign: "center", position: "relative" }}>
      {/* Background Arc Reactor & Hexagon Grid */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", perspective: "1000px" }} />
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
      
      <Reveal>
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Tag>JARVIS_PROTOCOL // ONLINE</Tag>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-.02em", margin: "24px 0 16px", maxWidth: 700 }}>
            Monitor your packages.<br />
            <span style={{ color: "#e0f2fe", textShadow: "0 0 40px rgba(56, 189, 248, 0.5), 0 0 15px rgba(56, 189, 248, 0.3)" }}>With absolute precision.</span>
          </h1>
          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.6, maxWidth: 540, margin: "0 auto 40px", fontWeight: 400 }}>
            Link your npm identity. Auto-discover your dependency tree. Analyze metrics, health, and vulnerabilities through a sleek, high-tech HUD.
          </p>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryBtn onClick={() => onEnter("link")}>Initialize Link</PrimaryBtn>
            <GhostBtn onClick={() => onEnter("demo")}>View Simulation</GhostBtn>
          </div>
        </div>
      </Reveal>

      {/* Sleek Glass Data Panel */}
      <Reveal delay={200}>
        <div style={{ marginTop: 72, width: "100%", maxWidth: 700, borderRadius: 12, overflow: "hidden", border: "1px solid rgba(56, 189, 248, 0.2)", background: "rgba(11, 15, 25, 0.6)", backdropFilter: "blur(12px)", textAlign: "left", position: "relative", zIndex: 1, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(56, 189, 248, 0.1), inset 0 0 20px rgba(56, 189, 248, 0.05)" }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(56, 189, 248, 0.15)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(56, 189, 248, 0.05)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              {["#ef4444","#f59e0b","#38bdf8"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 10px ${c}` }} />)}
            </div>
            <span style={{ fontSize: 11, color: "#7dd3fc", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase" }}>J.A.R.V.I.S. // Identity_Scan</span>
          </div>
          <div style={{ padding: "28px 32px", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 2, color: "#94a3b8" }}>
            <div><span style={{ color: "#38bdf8" }}>[SYSTEM]</span> Scanning registry for maintainer: <span style={{ color: "#fca5a5", textShadow: "0 0 10px rgba(239,68,68,0.5)" }}><Typewriter text="sindresorhus" speed={50} /></span></div>
            <div style={{ color: "#bae6fd", marginTop: 16 }}>&gt; Found <span style={{ color: "#fff", fontWeight: 700 }}>250 packages</span> linked to identity.</div>
            <div style={{ color: "#bae6fd" }}>&gt; Extrapolating download telemetry<span style={{ color: "#38bdf8", animation: "blink 1s infinite" }}>...</span></div>
            <div style={{ color: "#bae6fd" }}>&gt; Cross-referencing OSV.dev threat database<span style={{ color: "#38bdf8", animation: "blink 1s infinite", animationDelay: "0.2s" }}>...</span></div>
            <div style={{ color: "#f87171", marginTop: 16, fontWeight: 700, textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>[!] HUD INTERFACE INITIALIZED</div>
          </div>
        </div>
      </Reveal>

      {/* Floating HUD nodes */}
      <Reveal delay={300}>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 40, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
          {[
            { name: "react", dl: "130M/wk", status: "OPTIMAL", color: "#38bdf8" },
            { name: "lodash", dl: "98M/wk", status: "OPTIMAL", color: "#38bdf8" },
            { name: "express", dl: "45M/wk", status: "WARNING", color: "#f59e0b" },
          ].map((p, i) => (
            <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 24px", borderRadius: 8, border: `1px solid rgba(${p.color === '#f59e0b' ? '245,158,11' : '56,189,248'}, 0.3)`, background: "rgba(11, 15, 25, 0.7)", backdropFilter: "blur(8px)", boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 20px rgba(${p.color === '#f59e0b' ? '245,158,11' : '56,189,248'}, 0.15)`, transform: `translateY(${i%2===0 ? '0' : '-8px'})` }}>
              <span style={{ width: 12, height: 12, borderRadius: "50%", background: p.color, boxShadow: `0 0 12px ${p.color}` }} />
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 600 }}>{p.name}</span>
              <span style={{ fontSize: 13, color: "#94a3b8" }}>{p.dl}</span>
              <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, background: `rgba(${p.color === '#f59e0b' ? '245,158,11' : '56,189,248'}, 0.1)`, border: `1px solid ${p.color}`, color: p.color, fontWeight: 700, letterSpacing: "1px" }}>{p.status}</span>
            </div>
          ))}
        </div>
      </Reveal>
      <style>{`@keyframes cur { 0%,100%{opacity:1} 50%{opacity:0} } @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </section>
  );
}

/* ─── Features ──────────────────────────────────────────────────────── */
const FEATURES = [
  { icon: "⚡", title: "Telemetry Feed", desc: "Weekly, monthly, and all-time download counts straight from the npm registry. Watch trends shift in real time.", tag: "NPM API" },
  { icon: "🛡️", title: "Threat Detection", desc: "Every package checked against OSV.dev — Google's open-source vulnerability database. CRITICAL to MODERATE.", tag: "OSV.DEV" },
  { icon: "🎯", title: "Target Health", desc: "Five-dimension composite score: Maintenance, Popularity, Quality, Security, and Community. Sourced from npms.io.", tag: "NPMS.IO" },
  { icon: "🌐", title: "Web Intelligence", desc: "Stars, forks, open issues, last push, and license from the GitHub REST API — no token required for public repos.", tag: "GITHUB" },
  { icon: "⚖️", title: "Tactical Compare", desc: "Select up to 5 packages, compare overlaid download trends, health gauges, and a full side-by-side table.", tag: "HUD VIEW" },
  { icon: "🧬", title: "Identity Sync", desc: "Enter your npm username — we auto-discover every package where you're listed as a maintainer. Zero config.", tag: "AUTO-DISCOVER" },
];

function Features() {
  return (
    <section id="features" style={{ scrollMarginTop: 64, padding: "140px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <Reveal>
          <div style={{ marginBottom: 72, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, textShadow: "0 0 15px rgba(56, 189, 248, 0.4)" }}>Capabilities</p>
            <h2 style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, color: "#fff", letterSpacing: "-.02em", margin: "0 auto" }}>
              Arsenal Deployed
            </h2>
          </div>
        </Reveal>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 28 }}>
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 100}>
              <div style={{ padding: "36px 32px", borderRadius: 12, background: "rgba(15, 20, 35, 0.4)", border: "1px solid rgba(56, 189, 248, 0.15)", position: "relative", overflow: "hidden", transition: "all .4s cubic-bezier(0.16, 1, 0.3, 1)", backdropFilter: "blur(12px)" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.5)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(56, 189, 248, 0.15), inset 0 0 20px rgba(56, 189, 248, 0.05)"; e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.children[0].style.opacity = 0.2; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(56, 189, 248, 0.15)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; e.currentTarget.children[0].style.opacity = 0.05; }}>
                
                {/* Tech accent */}
                <div style={{ position: "absolute", top: -30, right: -20, opacity: 0.05, fontSize: 160, color: "#38bdf8", lineHeight: 1, transition: "opacity .4s" }}>⬢</div>
                
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)", border: "1px solid rgba(56, 189, 248, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 0 20px rgba(56, 189, 248, 0.15)" }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: "rgba(56, 189, 248, 0.1)", border: "1px solid rgba(56, 189, 248, 0.2)", color: "#7dd3fc", fontWeight: 600, letterSpacing: "1px" }}>{f.tag}</span>
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 12, letterSpacing: "-0.01em" }}>{f.title}</div>
                <div style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Health Score ───────────────────────────────────────────────────── */
const DIMS = [
  { label: "Maintenance", pts: 25, desc: "Commit recency & release cadence", color: "#38bdf8" },
  { label: "Security",    pts: 25, desc: "Known CVEs from OSV.dev",          color: "#ef4444" },
  { label: "Popularity",  pts: 20, desc: "Weekly download volume & trend",   color: "#f59e0b" },
  { label: "Quality",     pts: 20, desc: "TS support, tests, documentation", color: "#a78bfa" },
  { label: "Community",   pts: 10, desc: "GitHub stars, forks, issues",      color: "#34d399" },
];

function HealthSection() {
  const [active, setActive] = useState(null);
  const circ = 2 * Math.PI * 100;
  let offset = 0;

  return (
    <section id="health-score" style={{ scrollMarginTop: 64, padding: "140px 24px", background: "linear-gradient(180deg, transparent 0%, rgba(56, 189, 248, 0.03) 50%, transparent 100%)", position: "relative", overflow: "hidden" }}>
      {/* Background arc reactor rings */}
      <div style={{ position: "absolute", top: "50%", right: "10%", transform: "translate(50%, -50%)", width: 900, height: 900, borderRadius: "50%", border: "1px solid rgba(56, 189, 248, 0.05)", opacity: 0.8, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "50%", right: "10%", transform: "translate(50%, -50%)", width: 700, height: 700, borderRadius: "50%", border: "1px dashed rgba(56, 189, 248, 0.1)", opacity: 0.6, pointerEvents: "none" }} />
      
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center", position: "relative", zIndex: 1 }}>
        <Reveal>
          <p style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, textShadow: "0 0 15px rgba(56, 189, 248, 0.4)" }}>Diagnostics</p>
          <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 900, color: "#fff", letterSpacing: "-.02em", marginBottom: 20 }}>Core Integrity</h2>
          <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: 44 }}>
            A 0–100 composite score across five weighted dimensions. Sourced directly from <span style={{ color: "#fff", fontWeight: 600 }}>npms.io</span> and <span style={{ color: "#fff", fontWeight: 600 }}>OSV.dev</span>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {DIMS.map(d => (
              <div key={d.label}
                onMouseEnter={() => setActive(d.label)}
                onMouseLeave={() => setActive(null)}
                style={{ display: "flex", alignItems: "center", gap: 18, padding: "18px 24px", borderRadius: 8, background: active === d.label ? "rgba(15, 20, 35, 0.8)" : "rgba(15, 20, 35, 0.3)", border: `1px solid ${active === d.label ? d.color : 'rgba(56, 189, 248, 0.1)'}`, transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)", cursor: "default", boxShadow: active === d.label ? `0 10px 30px rgba(0,0,0,0.3), 0 0 25px ${d.color}22, inset 0 0 12px ${d.color}15` : "none", transform: active === d.label ? "translateX(10px)" : "none", backdropFilter: "blur(8px)" }}>
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: active === d.label || active === null ? d.color : "rgba(255,255,255,0.1)", boxShadow: active === d.label ? `0 0 15px ${d.color}` : "none", transition: "all .3s", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: active === d.label ? "#fff" : "#cbd5e1", transition: "color .3s", letterSpacing: "0.5px" }}>{d.label}</div>
                  <div style={{ fontSize: 14, color: "#64748b", marginTop: 2 }}>{d.desc}</div>
                </div>
                <span style={{ fontSize: 15, fontWeight: 700, color: active === d.label ? d.color : "#475569", transition: "color .3s" }}>{d.pts}pts</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
            {/* Reactor core central glow */}
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, #38bdf8 0%, transparent 60%)", opacity: 0.25, filter: "blur(20px)" }} />
            
            <div style={{ position: "relative", width: 320, height: 320 }}>
              <svg width="320" height="320" viewBox="0 0 240 240" style={{ transform: "rotate(-90deg)", filter: "drop-shadow(0 0 15px rgba(56,189,248,0.3))" }}>
                {/* Background tracks */}
                <circle cx="120" cy="120" r="100" fill="none" stroke="rgba(56,189,248,0.08)" strokeWidth="18" />
                <circle cx="120" cy="120" r="76" fill="none" stroke="rgba(56,189,248,0.15)" strokeWidth="1" strokeDasharray="4 6" />
                
                {DIMS.map(d => {
                  const len = (d.pts / 100) * circ;
                  const gap = 5;
                  const el = (
                    <circle key={d.label} cx="120" cy="120" r="100" fill="none"
                      stroke={active === d.label || active === null ? d.color : "rgba(255,255,255,0.05)"}
                      strokeWidth={active === d.label ? 20 : 18}
                      strokeDasharray={`${len - gap} ${circ - len + gap}`}
                      strokeDashoffset={-offset}
                      strokeLinecap="round"
                      style={{ transition: "all .5s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
                  );
                  offset += len;
                  return el;
                })}
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 64, fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-.02em", textShadow: "0 0 25px rgba(255,255,255,0.6)" }}>79</span>
                <span style={{ fontSize: 13, color: "#38bdf8", fontWeight: 600, marginTop: 4, letterSpacing: "1px" }}>/100</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#38bdf8", marginTop: 12, textTransform: "uppercase", letterSpacing: "1px", border: "1px solid rgba(56,189,248,0.3)", padding: "4px 14px", borderRadius: 20, background: "rgba(56,189,248,0.1)", boxShadow: "0 0 15px rgba(56,189,248,0.2)" }}>Class B</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Security ───────────────────────────────────────────────────────── */
const VULNS = [
  { pkg: "qs",          sev: "HIGH",     id: "GHSA-g53w",  desc: "Prototype pollution via query string" },
  { pkg: "handlebars",  sev: "CRITICAL", id: "GHSA-hg79",  desc: "RCE via eval() in template engine"   },
  { pkg: "minimatch",   sev: "MODERATE", id: "GHSA-cph5",  desc: "Regular expression denial of service" },
];
const SEV = { CRITICAL: "#ef4444", HIGH: "#f59e0b", MODERATE: "#38bdf8" };

function SecuritySection() {
  return (
    <section id="security" style={{ scrollMarginTop: 64, padding: "140px 24px" }}>
      <div style={{ maxWidth: 1040, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
        
        <Reveal delay={120}>
          <div style={{ border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: 12, overflow: "hidden", background: "rgba(11, 15, 25, 0.7)", boxShadow: "0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(239, 68, 68, 0.15), inset 0 0 20px rgba(239, 68, 68, 0.05)", position: "relative", backdropFilter: "blur(12px)" }}>
            {/* Caution tape header */}
            <div style={{ height: 6, width: "100%", background: "repeating-linear-gradient(45deg, #ef4444, #ef4444 15px, #7f1d1d 15px, #7f1d1d 30px)" }} />
            
            <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(239, 68, 68, 0.05)" }}>
              <span style={{ fontSize: 13, color: "#fca5a5", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase" }}>Threat_Log</span>
              <span style={{ fontSize: 12, padding: "4px 12px", borderRadius: 20, background: "rgba(239, 68, 68, 0.15)", border: "1px solid #ef4444", color: "#ef4444", fontWeight: 700, letterSpacing: "0.5px" }}>3 DETECTED</span>
            </div>
            {VULNS.map((v, i) => (
              <div key={v.id} style={{ padding: "22px 24px", borderBottom: i < VULNS.length - 1 ? "1px solid rgba(239, 68, 68, 0.1)" : "none", position: "relative", overflow: "hidden", transition: "background .2s" }}
                onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 4, height: "60%", borderRadius: "0 4px 4px 0", background: SEV[v.sev], boxShadow: `0 0 10px ${SEV[v.sev]}` }} />
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, paddingLeft: 6 }}>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 4, background: `${SEV[v.sev]}15`, border: `1px solid ${SEV[v.sev]}`, color: SEV[v.sev], fontWeight: 800, letterSpacing: "1px" }}>{v.sev}</span>
                  <span style={{ fontSize: 15, color: "#fff", fontWeight: 700 }}>{v.pkg}</span>
                  <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace" }}>{v.id}</span>
                </div>
                <div style={{ fontSize: 14, color: "#cbd5e1", paddingLeft: 6 }}>{v.desc}</div>
              </div>
            ))}
            <div style={{ padding: "14px 24px", borderTop: "1px solid rgba(239, 68, 68, 0.2)", fontSize: 12, color: "#fca5a5", fontWeight: 600, display: "flex", justifyContent: "space-between", background: "rgba(0,0,0,0.3)" }}>
              <span>DATA SRC: OSV.DEV</span>
              <span style={{ animation: "blink 2s infinite", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 8px #ef4444" }}/> LIVE SYNC...
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div style={{ paddingLeft: 20 }}>
            <p style={{ fontSize: 13, color: "#ef4444", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12, textShadow: "0 0 15px rgba(239, 68, 68, 0.4)" }}>Threat Analysis</p>
            <h2 style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 900, color: "#fff", letterSpacing: "-.02em", marginBottom: 20 }}>Anticipate.<br/>Neutralize.</h2>
            <p style={{ fontSize: 16, color: "#94a3b8", lineHeight: 1.7, marginBottom: 32 }}>
              Continuous scan protocol active. We query <span style={{ color: "#fff", fontWeight: 600 }}>OSV.dev</span> — Google's open vulnerability database — for every package in your perimeter. 
            </p>
            {["Real-time scan on dashboard load", "Severity classification (CRITICAL/HIGH/MODERATE)", "Direct GitHub Advisory links", "Agentless, zero-config monitoring"].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 15, color: "#cbd5e1", marginBottom: 18 }}>
                <span style={{ color: "#ef4444", fontSize: 18, textShadow: "0 0 15px rgba(239, 68, 68, 0.6)" }}>◈</span> {t}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Stats ──────────────────────────────────────────────────────────── */
function Stats() {
  return (
    <Reveal>
      <div style={{ padding: "40px 24px 120px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", border: "1px solid rgba(56, 189, 248, 0.2)", borderRadius: 12, background: "rgba(11, 15, 25, 0.6)", display: "grid", gridTemplateColumns: "repeat(4,1fr)", boxShadow: "0 20px 40px rgba(0,0,0,0.4), 0 0 30px rgba(56, 189, 248, 0.1), inset 0 0 20px rgba(56, 189, 248, 0.05)", backdropFilter: "blur(12px)" }}>
          {[
            { v: "250+", l: "Packages / Profile" },
            { v: "OSV", l: "Vulnerability DB" },
            { v: "5-AXIS", l: "Health Matrix" },
            { v: "OPEN", l: "No Auth Required" },
          ].map((s, i) => (
            <div key={i} style={{ padding: "48px 24px", textAlign: "center", borderRight: i < 3 ? "1px solid rgba(56, 189, 248, 0.15)" : "none", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: i % 2 === 0 ? "#ef4444" : "#38bdf8", opacity: 0.6, boxShadow: `0 0 15px ${i % 2 === 0 ? '#ef4444' : '#38bdf8'}` }} />
              <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", letterSpacing: "1px", marginBottom: 12, textShadow: "0 0 20px rgba(255,255,255,0.4)" }}>{s.v}</div>
              <div style={{ fontSize: 13, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────── */
function CTA({ onEnter }) {
  return (
    <section style={{ padding: "80px 24px 160px", textAlign: "center", position: "relative", overflow: "hidden" }}>
      {/* Background radial glow */}
      <div style={{ position: "absolute", bottom: "-20%", left: "50%", transform: "translateX(-50%)", width: 1000, height: 500, background: "radial-gradient(ellipse, rgba(239, 68, 68, 0.15) 0%, transparent 60%)", pointerEvents: "none", zIndex: 0 }} />
      
      <Divider />
      <Reveal>
        <div style={{ paddingTop: 120, position: "relative", zIndex: 1 }}>
          <h2 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, color: "#fff", letterSpacing: "-.02em", marginBottom: 24, textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>
            System ready.
          </h2>
          <p style={{ fontSize: 18, color: "#94a3b8", marginBottom: 48, letterSpacing: "0.5px" }}>No account. No credit card. Just your npm identity.</p>
          <PrimaryBtn onClick={() => onEnter("link")}>Link npm Account →</PrimaryBtn>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── Root export ────────────────────────────────────────────────────── */
export function Landing({ onEnter }) {
  useEffect(() => {
    const prev = document.body.style.background;
    document.body.style.background = "#050810";
    return () => { document.body.style.background = prev; };
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#050810", color: "#e2e8f0", minHeight: "100vh" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      
      {/* Tech Grid background pattern */}
      <div style={{ position:"fixed", inset:0, backgroundImage: "linear-gradient(rgba(56, 189, 248, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.05) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents:"none", zIndex:0, opacity: 0.8 }} />
      <div style={{ position:"fixed", inset:0, background: "radial-gradient(circle at center, transparent 0%, #050810 100%)", pointerEvents:"none", zIndex:0 }} />
      
      <Nav onEnter={onEnter} />
      <div style={{ paddingTop: 64 }}>
        <Hero onEnter={onEnter} />
        <Divider />
        <Features />
        <HealthSection />
        <Divider />
        <SecuritySection />
        <Stats />
        <CTA onEnter={onEnter} />
      </div>
    </div>
  );
}
