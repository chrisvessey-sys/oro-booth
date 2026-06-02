import { useState } from "react";

// ── CONFIG ────────────────────────────────────────────────────────────────────
const MODULES = [
  { id: "intake",   label: "Intake",               icon: "📥", url: "https://orolabs.navattic.com/zn14070z" },
  { id: "sourcing", label: "Sourcing",             icon: "🔍", url: "https://orolabs.navattic.com/ynr0b0l" },
  { id: "contract", label: "Contracting",          icon: "📄", url: "https://orolabs.navattic.com/z1r0sfh" },
  { id: "invoice",  label: "Invoicing & Payments", icon: "💳", url: "https://orolabs.navattic.com/2dr0fsh" },
  { id: "supplier", label: "Supplier Management",  icon: "🤝", url: "https://orolabs.navattic.com/mar0r0i" },
  { id: "risk",     label: "Supplier Risk",        icon: "🛡️", url: "https://orolabs.navattic.com/28r0bjk" },
  { id: "agents",   label: "ORO Agents",           icon: "🤖", url: "https://orolabs.navattic.com/rns083n" },
];

const TECH_STACK = {
  "Sourcing":           ["Ariba", "GEP", "Fairmarket", "Keelvar", "Procurify", "Globality"],
  "Contracting":        ["iCertis", "Sirion", "Agiloft", "Ariba", "Coupa"],
  "Buying & Invoicing": ["Ariba", "Coupa", "iValua", "Jaggaer", "Fieldglass", "Beeline"],
  "ERP":                ["Oracle", "SAP S/4", "Workday", "NetSuite"],
};

const PAIN_POINTS = ["Commerciality", "Compliance Risk", "Speed", "Transparency", "User Experience", "Automation", "Effectiveness"];

const QUAL_QUESTIONS = [
  { field: "companySize", label: "How large is your company?", options: [
    { val: "a", label: "A  –  Under 500 employees" },
    { val: "b", label: "B  –  500 – 5,000 employees" },
    { val: "c", label: "C  –  5,000+ employees" },
  ]},
  { field: "procTeam", label: "How big is your procurement team?", options: [
    { val: "a", label: "A  –  1–5 people" },
    { val: "b", label: "B  –  6–20 people" },
    { val: "c", label: "C  –  20+ people" },
  ]},
  { field: "turnover", label: "What is your annual spend / turnover?", options: [
    { val: "a", label: "A  –  $0 – $2Bn" },
    { val: "b", label: "B  –  $2Bn – $10Bn" },
    { val: "c", label: "C  –  $10Bn+" },
  ]},
  { field: "geography", label: "Where do you primarily operate?", options: [
    { val: "a", label: "A  –  Single country" },
    { val: "b", label: "B  –  2–5 countries" },
    { val: "c", label: "C  –  6+ countries / global" },
  ]},
];

const DEMO_SLOTS = (() => {
  const slots = [];
  ["Wed 3 June", "Thu 4 June"].forEach(day => {
    for (let h = 9; h <= 16; h++) {
      const ampm = h < 12 ? "am" : "pm";
      const hour = h > 12 ? h - 12 : h;
      slots.push({ id: `${day}-${h}`, day, time: `${hour}:00${ampm}` });
    }
  });
  return slots;
})();

const AIRTABLE_TOKEN = process.env.REACT_APP_AIRTABLE_TOKEN;
const AIRTABLE_BASE  = "appMnMeae9iHxuFX7";
const AIRTABLE_TABLE = "Leads";

async function submitToSheet(data) {
  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          "Name":               data.name            || "",
          "Company":            data.company         || "",
          "Email":              data.email           || "",
          "Qualified":          data.qualified ? "Yes" : "No",
          "Company Size":       data.companySize     || "",
          "Proc Team Size":     data.procTeam        || "",
          "Turnover":           data.turnover        || "",
          "Geography":          data.geography       || "",
          "Tech Stack":         (data.techStack      || []).join(", "),
          "Pain Points":        (data.pains          || []).join(", "),
          "Modules Viewed":     (data.viewedModules  || []).join(", "),
          "Group Demo Day":     data.groupDemoDay    || "",
          "Group Demo Time":    data.groupDemoTime   || "",
          "Group Demo Email":   data.groupDemoEmail  || "",
          "SE Discovery Notes": data.presalesNotes   || "",
          "Agreed Next Steps":  data.agreed          || "",
          "Presales Email":     data.presalesEmail   || "",
          "Email Consent":      data.emailConsent ? "Yes" : "No",
        }
      })
    });
    const json = await res.json();
    console.log("Airtable response:", JSON.stringify(json));
  } catch (err) {
    console.error("Airtable submission error:", err);
  }
}

const CUSTOMERS = [
  "Coca-Cola","Pfizer","Novartis","Bayer","GSK","Roche",
  "BASF","Liberty Blume","Booking.com","Allianz","Kyndryl","Millennium",
  "PTC Therapeutics","Regeneron","Enbridge","Danone","Siemens Energy","Gilead",
  "Opella","Bristol Myers Squibb","ThermoFisher","UKG","Lonza","Stellantis",
  "Iovance","Jamf","Sandoz","SageSure","Canpotex","Grünenthal",
  "Optimizely","Smith+Nephew","CSL","Haleon"
];

const C = {
  dark: "#1a1a2e", navy: "#16213e", gold: "#f0a500",
  red: "#e53935", green: "#2e7d32", bg: "#f7f7f9", white: "#fff", muted: "#888"
};

const emptyForm = () => ({ companySize: null, procTeam: null, turnover: null, geography: null });

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
function Btn({ label, onClick, color, textColor = C.white, mt = 8 }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: 14, borderRadius: 12, border: "none", cursor: "pointer",
      background: color || C.dark, color: textColor, fontSize: 16, fontWeight: 700, marginTop: mt
    }}>{label}</button>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 0.7, marginBottom: 5 }}>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{
      width: "100%", padding: "11px 13px", borderRadius: 10, border: "1.5px solid #e0e0e0",
      fontSize: 15, boxSizing: "border-box", outline: "none"
    }} />
  );
}

function Chip({ label, on, onClick, activeColor }) {
  return (
    <button onClick={onClick} style={{
      padding: "7px 13px", borderRadius: 20, border: "none", cursor: "pointer",
      fontSize: 13, fontWeight: 500, transition: "all .15s",
      background: on ? (activeColor || C.dark) : "#f0f0f0",
      color: on ? C.white : "#555"
    }}>{on ? "✓ " : ""}{label}</button>
  );
}

// ── HEADER ────────────────────────────────────────────────────────────────────
function Header({ screen }) {
  const steps = [
    { s: 0,           label: "About You" },
    { s: 1,           label: "Overview" },
    { s: [2,"qualified",4], label: "Demos" },
    { s: [3,41,5],    label: "Next Steps" },
  ];
  const cur = steps.findIndex(st => Array.isArray(st.s) ? st.s.includes(screen) : st.s === screen);
  return (
    <div style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.navy} 100%)`, padding: "16px 20px 14px" }}>
      <div style={{ fontSize: 10, letterSpacing: 2, opacity: 0.5, color: C.white, textTransform: "uppercase" }}>Oro Labs</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>Conference Experience</div>
      <div style={{ display: "flex", alignItems: "center" }}>
        {steps.map((st, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < steps.length - 1 ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i < cur ? C.gold : i === cur ? C.white : "rgba(255,255,255,0.2)",
                color: i <= cur ? C.dark : "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 700
              }}>{i < cur ? "✓" : i + 1}</div>
              <div style={{ fontSize: 9, color: i === cur ? C.gold : "rgba(255,255,255,0.4)", marginTop: 3, fontWeight: i === cur ? 700 : 400, whiteSpace: "nowrap" }}>{st.label}</div>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex: 1, height: 1, background: i < cur ? C.gold : "rgba(255,255,255,0.2)", margin: "0 4px", marginBottom: 14 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ORCH SLIDES ───────────────────────────────────────────────────────────────
const orchSlides = [
  {
    id: "hero", title: "Intro",
    render: () => (
      <div style={{ background: `linear-gradient(160deg, ${C.dark} 0%, #0d1b2a 100%)`, borderRadius: 16, padding: "32px 24px", textAlign: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <svg width="80" height="44" viewBox="0 0 200 110">
            <circle cx="48" cy="55" r="38" fill="none" stroke="white" strokeWidth="14"/>
            <circle cx="48" cy="55" r="18" fill={C.dark}/>
            <text x="90" y="78" fontSize="72" fontWeight="900" fill="url(#g)">RO</text>
            <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f0a500"/><stop offset="100%" stopColor="#ffd700"/></linearGradient></defs>
          </svg>
        </div>
        <div style={{ color: C.white, fontSize: 16, lineHeight: 1.6 }}>
          is a procurement platform that orchestrates workflows across{" "}
          <span style={{ color: C.gold, fontWeight: 700 }}>Humans, Systems, Data,</span>{" "}
          and <span style={{ color: C.gold, fontWeight: 700 }}>AI Agents</span>
        </div>
      </div>
    )
  },
  {
    id: "value", title: "Value",
    render: () => (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.dark, marginBottom: 12, textAlign: "center" }}>Value that ORO Delivers</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🧠", title: "Intelligent UX",            body: "38k users adopted ORO in 2 weeks at one global CPG company." },
            { icon: "⚡", title: "Agentic Accelerators",       body: "Individual agents processing >15k PRs/month. 4 week deploy." },
            { icon: "🛡️", title: "Native Control & Compliance", body: "Enterprise grade auditability & extensible workflows." },
            { icon: "🔗", title: "Integrate Seamlessly",       body: "1000+ out-of-the-box integrations, deployed in partnership." },
          ].map(v => (
            <div key={v.title} style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.navy})`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 22, marginBottom: 6 }}>{v.icon}</div>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{v.title}</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, lineHeight: 1.4 }}>{v.body}</div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "customers", title: "Customers",
    render: () => (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.dark, marginBottom: 12, textAlign: "center" }}>Global brands powered by ORO</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {CUSTOMERS.map(c => (
            <div key={c} style={{ background: C.white, border: "1px solid #e8e8e8", borderRadius: 8, padding: "8px 6px", fontSize: 10, fontWeight: 700, color: C.dark, textAlign: "center", lineHeight: 1.3 }}>{c}</div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: "ecosystem", title: "Ecosystem",
    render: () => (
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 800, fontSize: 17, color: C.dark, marginBottom: 4, textAlign: "center" }}>ORO connects your entire ecosystem</div>
        <div style={{ color: C.muted, fontSize: 13, textAlign: "center", marginBottom: 12 }}>1000+ integrations across every category</div>
        {[
          { cat: "Source & Negotiate",  tools: "Archlet · Fairmarkit · Globality · Keelvar · Pactum · Nnamu" },
          { cat: "Contract & E-Sign",   tools: "Conga · Ironclad · DocuSign · Sirion · iCertis" },
          { cat: "S2P Solutions",       tools: "SAP Ariba · Coupa · GEP · Jaggaer · iValua · Candex" },
          { cat: "ERP & Finance",       tools: "SAP ECC · SAP S/4HANA · Basware · Workday · MS Dynamics · Oracle NetSuite" },
          { cat: "Risk Management",     tools: "RapidRatings · ProcessUnity · Cybervadis · EcoVadis · OneTrust · Exiger" },
        ].map(r => (
          <div key={r.cat} style={{ background: C.white, borderRadius: 10, padding: "10px 14px", marginBottom: 8, borderLeft: `3px solid ${C.gold}` }}>
            <div style={{ fontWeight: 700, fontSize: 12, color: C.dark }}>{r.cat}</div>
            <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{r.tools}</div>
          </div>
        ))}
      </div>
    )
  }
];

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen]             = useState(0);
  const [form, setForm]                 = useState(emptyForm());
  const [qualified, setQualified]       = useState(false);
  const [contact, setContact]           = useState({ name: "", company: "", email: "" });
  const [orchSlide, setOrchSlide]       = useState(0);
  const [viewedModules, setViewedModules] = useState([]);
  const [techStack, setTechStack]       = useState([]);
  const [techOther, setTechOther]       = useState("");
  const [pains, setPains]               = useState([]);
  const [presalesNotes, setPresalesNotes] = useState("");
  const [agreed, setAgreed]             = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [presalesEmail, setPresalesEmail] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [nqEmail, setNqEmail]           = useState("");
  const [nqDone, setNqDone]             = useState(false);

  const setField = (field, val) => setForm(f => ({ ...f, [field]: val }));

  const calcQualified = () => {
    const { companySize, procTeam, turnover } = form;
    return ["b","c"].includes(companySize?.val) &&
           ["b","c"].includes(procTeam?.val) &&
           ["b","c"].includes(turnover?.val);
  };

  const goQualify = () => {
    if (!contact.name || !contact.company) { alert("Please enter your name and company."); return; }
    if (!QUAL_QUESTIONS.every(q => form[q.field])) { alert("Please answer all four questions."); return; }
    const q = calcQualified();
    setQualified(q);
    setScreen(1);
  };

  const buildPayload = (extra = {}) => ({
    name:          contact.name,
    company:       contact.company,
    email:         contact.email,
    qualified,
    companySize:   form.companySize?.label || "",
    procTeam:      form.procTeam?.label    || "",
    turnover:      form.turnover?.label    || "",
    geography:     form.geography?.label   || "",
    techStack:     techStack.map(t => t.split(":")[1]),
    pains,
    viewedModules: viewedModules.map(id => MODULES.find(m => m.id === id)?.label || id),
    groupDemoDay:  selectedSlot?.day   || "",
    groupDemoTime: selectedSlot?.time  || "",
    groupDemoEmail: nqEmail,
    presalesNotes,
    agreed,
    presalesEmail,
    emailConsent,
    ...extra,
  });

  const resetAll = () => {
    setScreen(0); setForm(emptyForm()); setQualified(false);
    setContact({ name: "", company: "", email: "" }); setOrchSlide(0);
    setViewedModules([]); setTechStack([]); setTechOther(""); setPains([]);
    setPresalesNotes(""); setAgreed(""); setEmailConsent(false); setPresalesEmail("");
    setSelectedSlot(null); setNqEmail(""); setNqDone(false);
  };

  const groupedSlots = DEMO_SLOTS.reduce((acc, s) => {
    acc[s.day] = acc[s.day] || [];
    acc[s.day].push(s);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", fontFamily: "-apple-system, sans-serif", background: C.bg, minHeight: "100vh" }}>
      <Header screen={screen} />
      <div style={{ padding: 20 }}>

        {/* ── 0: QUALIFY ── */}
        {screen === 0 && (
          <>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>Welcome to ORO Labs</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Tell us a little about yourself to personalise your experience.</div>
            <div style={{ marginBottom: 14 }}><Label>Your Name *</Label><TextInput value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))} placeholder="Jane Smith" /></div>
            <div style={{ marginBottom: 14 }}><Label>Company *</Label><TextInput value={contact.company} onChange={e => setContact(c => ({ ...c, company: e.target.value }))} placeholder="Acme Corp" /></div>
            <div style={{ marginBottom: 22 }}>
              <Label>Email <span style={{ fontWeight: 400, textTransform: "none", fontSize: 11 }}>(optional)</span></Label>
              <TextInput type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="jane@acme.com" />
            </div>
            {QUAL_QUESTIONS.map(qq => (
              <div key={qq.field} style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: C.dark }}>{qq.label}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {qq.options.map(o => (
                    <button key={o.val} onClick={() => setField(qq.field, o)} style={{
                      padding: "12px 16px", borderRadius: 12, cursor: "pointer", textAlign: "left",
                      fontSize: 14, fontWeight: 500, transition: "all .15s",
                      border: `2px solid ${form[qq.field]?.val === o.val ? C.dark : "#e0e0e0"}`,
                      background: form[qq.field]?.val === o.val ? C.dark : C.white,
                      color: form[qq.field]?.val === o.val ? C.white : C.dark,
                    }}>{o.label}</button>
                  ))}
                </div>
              </div>
            ))}
            <Btn label="Explore the ORO Platform →" onClick={goQualify} />
          </>
        )}

        {/* ── 1: ORCH OVERVIEW ── */}
        {screen === 1 && (
          <>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>The ORO Platform</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>
              Slide {orchSlide + 1} of {orchSlides.length}
              <span style={{ float: "right", color: C.gold, fontWeight: 600 }}>{orchSlides[orchSlide].title}</span>
            </div>
            {orchSlides[orchSlide].render()}
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              {orchSlide > 0 && (
                <button onClick={() => setOrchSlide(s => s - 1)} style={{ flex: 1, padding: 13, borderRadius: 12, border: `2px solid ${C.dark}`, background: C.white, color: C.dark, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>← Back</button>
              )}
              {orchSlide < orchSlides.length - 1
                ? <button onClick={() => setOrchSlide(s => s + 1)} style={{ flex: 2, padding: 13, borderRadius: 12, border: "none", background: C.dark, color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Next →</button>
                : <button onClick={() => qualified ? setScreen("qualified") : setScreen(3)} style={{ flex: 2, padding: 13, borderRadius: 12, border: "none", background: C.gold, color: C.dark, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>See it in action →</button>
              }
            </div>
          </>
        )}

        {/* ── QUALIFIED BUMP ── */}
        {screen === "qualified" && (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>You're a great fit for ORO!</div>
            <div style={{ color: "#666", fontSize: 15, marginBottom: 10 }}>
              We'd love to show you even more — and give you a chance to <strong>build your own ORO Agent!</strong>
            </div>
            <div style={{ background: "#fff8e1", borderRadius: 12, padding: 14, marginBottom: 24, fontSize: 14, color: "#8a6000" }}>
              But first — let's show you what ORO can do.
            </div>
            <Btn label="Let's go! →" onClick={() => setScreen(4)} />
          </div>
        )}

        {/* ── 4: TELL US ABOUT YOUR WORLD (prospect) ── */}
        {screen === 4 && (
          <>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>Tell us about your world</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Help us understand your current setup and priorities.</div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, color: C.dark }}>🖥️ Your Tech Stack</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 14 }}>Tap any systems you currently use.</div>
            {Object.entries(TECH_STACK).map(([section, tools]) => (
              <div key={section} style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{section}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {tools.map(t => {
                    const key = `${section}:${t}`;
                    return <Chip key={t} label={t} on={techStack.includes(key)} onClick={() => setTechStack(s => s.includes(key) ? s.filter(x => x !== key) : [...s, key])} />;
                  })}
                </div>
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Other</div>
              <TextInput value={techOther} onChange={e => setTechOther(e.target.value)} placeholder="Any other tools or systems..." />
            </div>
            {(techStack.length > 0 || techOther) && (
              <div style={{ background: C.white, borderRadius: 12, padding: 12, marginBottom: 16, border: `1.5px solid ${C.dark}` }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 6, textTransform: "uppercase" }}>Current Stack</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {techStack.map(t => <span key={t} style={{ background: C.dark, color: C.white, borderRadius: 10, padding: "3px 10px", fontSize: 12 }}>{t.split(":")[1]}</span>)}
                  {techOther && <span style={{ background: C.dark, color: C.white, borderRadius: 10, padding: "3px 10px", fontSize: 12 }}>{techOther}</span>}
                </div>
              </div>
            )}
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.dark }}>🎯 Biggest Pain Points</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
              {PAIN_POINTS.map(p => (
                <Chip key={p} label={p} on={pains.includes(p)} onClick={() => setPains(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p])} activeColor={C.red} />
              ))}
            </div>
            <Btn label="Let's see ORO in action →" onClick={() => setScreen(2)} color={C.gold} textColor={C.dark} />
            <div style={{ marginTop: 12 }} />
            <Btn label="Hand off to Solutions Engineer →" onClick={() => setScreen(41)} />
          </>
        )}

        {/* ── 2: NAVATTIC DEMOS ── */}
        {screen === 2 && (
          <>
            <div style={{ fontWeight: 800, fontSize: 20, marginBottom: 2 }}>See it in action</div>
            <div style={{ color: C.muted, fontSize: 14, marginBottom: 16 }}>Tap any module to explore an interactive demo.</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              {MODULES.map(m => {
                const seen = viewedModules.includes(m.id);
                return (
                  <button key={m.id} onClick={() => { setViewedModules(v => v.includes(m.id) ? v : [...v, m.id]); window.open(m.url, "_blank"); }} style={{
                    background: seen ? C.dark : C.white, color: seen ? C.white : C.dark,
                    border: `2px solid ${seen ? C.dark : "#e0e0e0"}`, borderRadius: 14,
                    padding: "16px 12px", cursor: "pointer", textAlign: "center", transition: "all .2s"
                  }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{m.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.3 }}>{m.label}</div>
                    {seen && <div style={{ fontSize: 10, color: C.gold, marginTop: 4 }}>✓ viewed</div>}
                  </button>
                );
              })}
            </div>
            <div style={{ background: "#e8f5e9", borderRadius: 10, padding: 10, marginBottom: 14, fontSize: 13, color: C.green }}>
              💡 <strong>{viewedModules.length}</strong> of {MODULES.length} modules explored
            </div>
            <Btn label="Continue →" onClick={() => setScreen(41)} />
          </>
        )}

        {/* ── 3: NOT QUALIFIED — GROUP DEMO BOOKING ── */}
        {screen === 3 && !nqDone && (
          <>
            <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
              <div style={{ fontSize: 44, marginBottom: 10 }}>👋</div>
              <div style={{ fontWeight: 800, fontSize: 21, marginBottom: 8 }}>We'd love you to see the product live!</div>
              <div style={{ color: "#666", fontSize: 14, marginBottom: 20 }}>Join one of our upcoming group demo sessions and see ORO live with a chance to ask questions and learn more.</div>
            </div>
            {Object.entries(groupedSlots).map(([day, slots]) => (
              <div key={day} style={{ marginBottom: 18 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{day}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {slots.map(s => (
                    <button key={s.id} onClick={() => setSelectedSlot(s)} style={{
                      padding: "8px 14px", borderRadius: 10, cursor: "pointer", fontSize: 13, fontWeight: 600,
                      border: `2px solid ${selectedSlot?.id === s.id ? C.dark : "#e0e0e0"}`,
                      background: selectedSlot?.id === s.id ? C.dark : C.white,
                      color: selectedSlot?.id === s.id ? C.white : C.dark,
                    }}>{s.time}</button>
                  ))}
                </div>
              </div>
            ))}
            {selectedSlot && (
              <div style={{ background: "#f0f7ff", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: C.dark, marginBottom: 8 }}>📅 {selectedSlot.day} at {selectedSlot.time} — confirm your spot</div>
                <Label>Email address</Label>
                <TextInput type="email" value={nqEmail} onChange={e => setNqEmail(e.target.value)} placeholder="jane@acme.com" />
              </div>
            )}
            {selectedSlot && nqEmail && <Btn label="Reserve my spot →" onClick={() => { submitToSheet(buildPayload()); setNqDone(true); }} color={C.gold} textColor={C.dark} />}
          </>
        )}

        {screen === 3 && nqDone && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 22, marginBottom: 8 }}>You're booked in!</div>
            <div style={{ color: "#666", fontSize: 15, marginBottom: 6 }}>We'll see you on <strong>{selectedSlot.day}</strong> at <strong>{selectedSlot.time}</strong>.</div>
            <div style={{ color: C.muted, fontSize: 13, marginBottom: 24 }}>A confirmation will be sent to {nqEmail}</div>
            <Btn label="Start new conversation" onClick={resetAll} color={C.gold} textColor={C.dark} />
          </div>
        )}

        {/* ── 41: SE NOTES ── */}
        {screen === 41 && (
          <>
            <div style={{ background: `linear-gradient(135deg, ${C.dark}, ${C.navy})`, borderRadius: 14, padding: "14px 16px", marginBottom: 20 }}>
              <div style={{ color: C.gold, fontWeight: 700, fontSize: 13 }}>🔒 Solutions Engineer View</div>
              <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginTop: 2 }}>This section is for internal use only.</div>
            </div>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.dark }}>📝 Discovery Notes</div>
            <textarea value={presalesNotes} onChange={e => setPresalesNotes(e.target.value)} placeholder="Key questions, requirements, context from the conversation..." rows={5}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 14, boxSizing: "border-box", resize: "none", marginBottom: 20, outline: "none" }} />
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8, color: C.dark }}>✅ Agreed Next Steps</div>
            <textarea value={agreed} onChange={e => setAgreed(e.target.value)} placeholder="e.g. custom demo next week, POC scope, intro to CTO..." rows={3}
              style={{ width: "100%", padding: "12px 14px", borderRadius: 12, border: "1.5px solid #e0e0e0", fontSize: 14, boxSizing: "border-box", resize: "none", marginBottom: 20, outline: "none" }} />
            <div style={{ background: "#f0f7ff", borderRadius: 14, padding: 16, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10, color: C.dark }}>📧 Stay Connected</div>
              <TextInput type="email" value={presalesEmail} onChange={e => setPresalesEmail(e.target.value)} placeholder="customer@email.com" />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 12 }}>
                <button onClick={() => setEmailConsent(!emailConsent)} style={{
                  width: 44, height: 26, borderRadius: 13, border: "none", cursor: "pointer", flexShrink: 0,
                  background: emailConsent ? C.green : "#ccc", position: "relative", transition: "background .2s"
                }}>
                  <span style={{ position: "absolute", top: 3, left: emailConsent ? 21 : 3, width: 20, height: 20, borderRadius: "50%", background: C.white, transition: "left .2s" }} />
                </button>
                <span style={{ fontSize: 13, color: emailConsent ? C.green : C.muted, fontWeight: 600 }}>Yes, ORO can contact me directly ✓</span>
              </div>
            </div>
            <Btn label="Complete & wrap up 🎉" onClick={() => { submitToSheet(buildPayload()); setScreen(5); }} />
          </>
        )}

        {/* ── 5: DONE ── */}
        {screen === 5 && (
          <div style={{ textAlign: "center", padding: "30px 0 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
            <div style={{ fontWeight: 800, fontSize: 24, marginBottom: 8, color: C.dark }}>All done!</div>
            <div style={{ color: "#666", fontSize: 15, marginBottom: 20 }}>Great conversation, {contact.name}. Your solutions team has everything they need.</div>
            <div style={{ background: C.white, borderRadius: 16, padding: 20, textAlign: "left", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 12, color: C.dark }}>Summary</div>
              {contact.name    && <div style={{ fontSize: 14, marginBottom: 4 }}>👤 <strong>{contact.name}</strong></div>}
              {contact.company && <div style={{ fontSize: 14, marginBottom: 4 }}>🏢 {contact.company}</div>}
              <div style={{ fontSize: 14, marginBottom: 4 }}>🏷️ <span style={{ color: C.green, fontWeight: 700 }}>Qualified lead</span></div>
              {viewedModules.length > 0 && <div style={{ fontSize: 13, color: "#666", marginTop: 6 }}>Modules: {viewedModules.map(id => MODULES.find(m => m.id === id)?.label).join(", ")}</div>}
              {techStack.length > 0      && <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Stack: {techStack.map(t => t.split(":")[1]).join(", ")}{techOther ? `, ${techOther}` : ""}</div>}
              {pains.length > 0          && <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Pains: {pains.join(", ")}</div>}
              {agreed                    && <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>Next steps: {agreed}</div>}
            </div>
            <Btn label="Start new conversation" onClick={resetAll} color={C.gold} textColor={C.dark} />
          </div>
        )}

      </div>
    </div>
  );
}
