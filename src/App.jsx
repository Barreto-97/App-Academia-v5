import { useState, useMemo } from "react";

// ============================================================
// 🏋️ TREINOS BASE — edite aqui ou use a aba "Editar Treinos"
// ============================================================
const BASE_LIBRARY = {
  A1: { label:"A1", name:"Peito + Ombro (leve) + Tríceps", color:"#FF4D4D", emoji:"🔴",
    groups:[
      { name:"Peito", exercises:[
        { id:"a1_1", name:"Supino Reto",          sets:"4x10", video:"https://youtu.be/rT7DgCr-3pg" },
        { id:"a1_2", name:"Crossover Polia Alta",  sets:"3x12", video:"https://youtu.be/taI4XduLpTk" },
      ]},
      { name:"Ombro", exercises:[
        { id:"a1_3", name:"Elevação Lateral",      sets:"4x12", video:"https://youtu.be/3VcKaXpzqRo" },
      ]},
      { name:"Tríceps", exercises:[
        { id:"a1_4", name:"Tríceps Corda",         sets:"4x12", video:"https://youtu.be/2-LAMcpzODU" },
      ]},
    ],
  },
  A2: { label:"A2", name:"Peito + Ombro (complemento) + Tríceps", color:"#FF4D4D", emoji:"🔴",
    groups:[
      { name:"Peito", exercises:[
        { id:"a2_1", name:"Supino Inclinado",       sets:"4x10", video:"https://youtu.be/DbFgADa2PL8" },
        { id:"a2_2", name:"Crucifixo na Polia",     sets:"3x12", video:"https://youtu.be/eozdVDA78K0" },
        { id:"a2_3", name:"Crossover Polia Baixa",  sets:"3x12", video:"https://youtu.be/d4O8EVQHs-k" },
      ]},
      { name:"Ombro", exercises:[
        { id:"a2_4", name:"Arnold Press",           sets:"4x10", video:"https://youtu.be/6Z15_WdXmVw" },
      ]},
      { name:"Tríceps", exercises:[
        { id:"a2_5", name:"Tríceps Testa / Francês",sets:"4x10", video:"https://youtu.be/d_KZxkY_0cM" },
      ]},
    ],
  },
  B1: { label:"B1", name:"Costas + Bíceps", color:"#4D79FF", emoji:"🔵",
    groups:[
      { name:"Costas", exercises:[
        { id:"b1_1", name:"Puxador Frente",        sets:"4x10", video:"https://youtu.be/CAwf7n6Luuc" },
        { id:"b1_2", name:"Remada Baixa",           sets:"4x10", video:"https://youtu.be/GZbfZ033f74" },
      ]},
      { name:"Bíceps", exercises:[
        { id:"b1_3", name:"Rosca 21 (Barra W)",    sets:"3x21", video:"https://youtu.be/4ybFnMmSGbQ" },
        { id:"b1_4", name:"Martelo",                sets:"3x12", video:"https://youtu.be/zC3nLlEvin4" },
      ]},
    ],
  },
  B2: { label:"B2", name:"Costas + Bíceps (complemento)", color:"#4D79FF", emoji:"🔵",
    groups:[
      { name:"Costas", exercises:[
        { id:"b2_1", name:"Pulldown",               sets:"4x10",   video:"https://youtu.be/lueEJGjTuPQ" },
        { id:"b2_2", name:"Crucifixo Invertido",    sets:"3x15",   video:"https://youtu.be/Ow0N0TknJaA" },
        { id:"b2_3", name:"Barra Fixa",             sets:"4x máx", video:"https://youtu.be/eGo4IYlbE5g" },
      ]},
      { name:"Bíceps", exercises:[
        { id:"b2_4", name:"Rosca Concentrada",      sets:"3x12", video:"https://youtu.be/Jvj2wV0vOYU" },
      ]},
    ],
  },
  C1: { label:"C1", name:"Pernas — ênfase quadríceps", color:"#22c55e", emoji:"🟢",
    groups:[
      { name:"Quadríceps", exercises:[
        { id:"c1_1", name:"Agachamento Livre",      sets:"4x10", video:"https://youtu.be/aclHkVaku9U" },
        { id:"c1_2", name:"Leg Press",               sets:"4x12", video:"https://youtu.be/IZxyjW7MPJQ" },
        { id:"c1_3", name:"Cadeira Extensora",       sets:"3x15", video:"https://youtu.be/YyvSfVjQeL0" },
      ]},
      { name:"Adutores", exercises:[
        { id:"c1_4", name:"Adutora",                sets:"3x15", video:"https://youtu.be/GDokWqKkMvs" },
      ]},
    ],
  },
  C2: { label:"C2", name:"Pernas — ênfase posterior", color:"#22c55e", emoji:"🟢",
    groups:[
      { name:"Posterior", exercises:[
        { id:"c2_1", name:"Terra (Deadlift)",       sets:"4x8",  video:"https://youtu.be/op9kVnSso6Q" },
        { id:"c2_2", name:"Stiff",                   sets:"4x10", video:"https://youtu.be/1uDiW5--rAE" },
        { id:"c2_3", name:"Cadeira Flexora",         sets:"3x12", video:"https://youtu.be/-LwkVHYGxUQ" },
        { id:"c2_4", name:"Flexora em Pé",           sets:"3x12", video:"https://youtu.be/WvHBf1Wgh5Q" },
      ]},
    ],
  },
};
// ============================================================

const cp   = (x) => JSON.parse(JSON.stringify(x));
const uid  = () => `x${Date.now()}${Math.random().toString(36).slice(2,5)}`;
const fmtD = (d) => d.toISOString().slice(0,10);
const todayStr = fmtD(new Date());

const weekMonday = (date) => {
  const d = new Date(date), day = d.getDay();
  d.setDate(d.getDate() + (day===0 ? -6 : 1-day)); return d;
};
const weekDays = (mon) => Array.from({length:7},(_,i)=>{
  const d=new Date(mon); d.setDate(d.getDate()+i); return {ds:fmtD(d),d};
});
const SHORT = ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"];
const LONG  = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingo"];
const dIdx  = (ds) => { const w=new Date(ds).getDay(); return w===0?6:w-1; };

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;800&family=Barlow:wght@400;500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  html,body{overscroll-behavior:none}
  ::-webkit-scrollbar{display:none}
  .dc{display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px 4px;border-radius:10px;border:1.5px solid transparent;background:transparent;cursor:pointer;transition:all .18s;flex:1;min-width:0}
  .dc.act{background:var(--a);border-color:var(--a)}
  .dc.tdy{border-color:var(--a)}
  .dc.hwk{background:#111118;border-color:#1e1e2e}
  .dc.act.hwk{background:var(--a);border-color:var(--a)}
  .er{display:flex;align-items:center;gap:10px;padding:13px 14px;border-radius:12px;background:#111118;border:1px solid #1c1c2c;transition:all .2s;cursor:pointer}
  .er.dn{background:#0d160d;border-color:#172017;opacity:.52}
  .ck{width:30px;height:30px;border-radius:50%;border:2px solid #2a2a3a;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;flex-shrink:0}
  .ck.on{background:#22c55e;border-color:#22c55e}
  .yt{width:34px;height:34px;border-radius:9px;background:#180000;border:1px solid #3a0808;display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:all .15s}
  .yt:active{background:#cc0000;border-color:#cc0000}
  .ip{width:100%;background:#111118;border:1.5px solid #2a2a3a;border-radius:10px;padding:11px 13px;color:#f0f0f0;font-family:'Barlow',sans-serif;font-size:14px;outline:none;-webkit-appearance:none;transition:border-color .2s}
  .ip:focus{border-color:var(--a)}
  .ip::placeholder{color:#444}
  .ips{background:#0e0e1a;border:1px solid #252535;border-radius:8px;padding:8px 10px;color:#e0e0e0;font-family:'Barlow',sans-serif;font-size:13px;outline:none;-webkit-appearance:none}
  .ips:focus{border-color:var(--a)}
  .ips::placeholder{color:#383848}
  .tb{flex:1;padding:12px 4px;background:transparent;border:none;border-top:3px solid transparent;color:#555;font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:1px;cursor:pointer;transition:all .2s;text-transform:uppercase}
  .tb.on{color:var(--a);border-top-color:var(--a)}
  .wb{display:flex;align-items:center;gap:8px;width:100%;padding:13px 14px;background:#111118;border:1.5px solid #1e1e2e;border-radius:12px;cursor:pointer;font-family:'Barlow Condensed',sans-serif;transition:all .2s}
  .wb.sw{border-color:var(--b);background:color-mix(in srgb,var(--b) 12%,#111118)}
  .pb{height:100%;border-radius:4px;transition:width .5s ease}
  .db{width:28px;height:28px;border-radius:7px;background:#1a0808;border:1px solid #3a1010;color:#cc4444;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:1}
  .db:active{background:#cc0000;color:#fff}
  .ec{background:#111118;border:1px solid #1e1e2e;border-radius:14px;overflow:hidden;margin-bottom:14px}
  .fl{animation:fi .25s ease}
  @keyframes fi{0%{opacity:.3;transform:scale(.97)}100%{opacity:1;transform:scale(1)}}
`;

export default function App() {
  const curMon = weekMonday(new Date(todayStr));
  const [calOpen,  setCalOpen]  = useState(false);
  const [selDate,  setSelDate]  = useState(todayStr);
  const [library,  setLibrary]  = useState(cp(BASE_LIBRARY));
  const [dayWk,    setDayWk]    = useState({});
  const [done,     setDone]     = useState({});
  const [view,     setView]     = useState("workout");
  const [picking,  setPicking]  = useState(false);
  const [editKey,  setEditKey]  = useState(null);
  const [draft,    setDraft]    = useState(null);
  const [newGrp,   setNewGrp]   = useState("");
  const [addForms, setAddForms] = useState({});
  const [flash,    setFlash]    = useState(false);

  const WK_KEYS = Object.keys(library);
  const PAST = 4;
  const weeks = useMemo(() => {
    if (!calOpen) return [weekDays(curMon)];
    return Array.from({length:PAST+1},(_,i)=>{
      const m=new Date(curMon); m.setDate(m.getDate()-(PAST-i)*7); return weekDays(m);
    });
  }, [calOpen]);

  const selWk  = dayWk[selDate] || null;
  const wk     = selWk ? library[selWk] : null;
  const acc    = wk ? wk.color : "#4D79FF";
  const groups = wk ? wk.groups : [];
  const total  = groups.reduce((s,g)=>s+g.exercises.length,0);
  const doneN  = groups.reduce((s,g)=>s+g.exercises.filter(e=>done[`${selDate}_${e.id}`]).length,0);
  const pct    = total>0?(doneN/total)*100:0;
  const dayLbl = LONG[dIdx(selDate)];
  const isToday = selDate===todayStr;

  const toggle  = (id) => setDone(p=>({...p,[`${selDate}_${id}`]:!p[`${selDate}_${id}`]}));
  const openVid = (url) => url && window.open(url,"_blank","noopener,noreferrer");

  const startEdit = (k) => { setEditKey(k); setDraft(cp(library[k])); setNewGrp(""); setAddForms({}); };
  const saveEdit  = () => { setLibrary(p=>({...p,[editKey]:cp(draft)})); setFlash(true); setTimeout(()=>setFlash(false),1800); };
  const updEx = (gi,ei,f,v) => setDraft(p=>{const d=cp(p);d.groups[gi].exercises[ei][f]=v;return d;});
  const delEx = (gi,ei) => setDraft(p=>{const d=cp(p);d.groups[gi].exercises.splice(ei,1);if(!d.groups[gi].exercises.length)d.groups.splice(gi,1);return d;});
  const addEx = (gi) => {
    const f=addForms[gi]||{}; if(!f.name) return;
    setDraft(p=>{const d=cp(p);d.groups[gi].exercises.push({id:uid(),name:f.name,sets:f.sets||"",video:f.video||""});return d;});
    setAddForms(p=>({...p,[gi]:{name:"",sets:"",video:""}}));
  };
  const addGrp = () => {
    if(!newGrp.trim()) return;
    setDraft(p=>{const d=cp(p);d.groups.push({name:newGrp.trim(),exercises:[]});return d;});
    setNewGrp("");
  };
  const goView = (v) => { setView(v); setPicking(false); if(v!=="edit"){setEditKey(null);setDraft(null);} };

  return (
    <div style={{minHeight:"100vh",background:"#090910",fontFamily:"'Barlow Condensed',sans-serif",color:"#f0f0f0",maxWidth:430,margin:"0 auto"}}>
      <style>{CSS}</style>
      <div style={{"--a":acc}}>

        {/* HEADER */}
        <div style={{padding:"18px 16px 0",background:"#0d0d18"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
            <div>
              <p style={{fontSize:11,color:"#555",letterSpacing:2,textTransform:"uppercase",marginBottom:2}}>
                {new Date(todayStr+"T12:00:00").toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
              </p>
              <h1 style={{fontSize:28,fontWeight:800,letterSpacing:1,lineHeight:1.1}}>GYM <span style={{color:acc}}>TRACKER</span></h1>
            </div>
            <div style={{background:"#111118",border:`1px solid ${acc}44`,borderRadius:12,padding:"7px 14px",textAlign:"center",minWidth:58}}>
              <div style={{fontSize:20}}>{wk?wk.emoji:"📋"}</div>
              <div style={{fontSize:wk?15:10,fontWeight:800,color:wk?acc:"#555",letterSpacing:1}}>{wk?wk.label:"SEM TREINO"}</div>
            </div>
          </div>

          {/* Calendar */}
          {weeks.map((wkDays,wi)=>{
            const isPast=wi<weeks.length-1;
            return(
              <div key={wi} style={{marginBottom:6}}>
                {isPast&&<p style={{fontSize:10,color:"#444",letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>
                  {new Date(wkDays[0].ds+"T12:00:00").toLocaleDateString("pt-BR",{day:"numeric",month:"short"})} – {new Date(wkDays[6].ds+"T12:00:00").toLocaleDateString("pt-BR",{day:"numeric",month:"short"})}
                </p>}
                <div style={{display:"flex",gap:4}}>
                  {wkDays.map(({ds,d})=>{
                    const k2=dayWk[ds], w2=k2?library[k2]:null;
                    const isA=selDate===ds, isTd=ds===todayStr;
                    const ca=w2?w2.color:isTd?"#4D79FF":"#555";
                    return(
                      <button key={ds}
                        className={`dc${isA?" act":""}${isTd&&!isA?" tdy":""}${w2&&!isA?" hwk":""}`}
                        style={{"--a":ca}}
                        onClick={()=>{setSelDate(ds);if(view==="edit")goView("workout");}}>
                        <span style={{fontSize:10,fontWeight:700,color:isA?"#fff":isTd?ca:"#666"}}>{SHORT[dIdx(ds)]}</span>
                        <span style={{fontSize:13,fontWeight:800,color:isA?"#fff":"#aaa"}}>{d.getDate()}</span>
                        {w2?<span style={{fontSize:10,fontWeight:800,color:isA?"rgba(255,255,255,.85)":w2.color,lineHeight:1}}>{w2.label}</span>
                           :<span style={{fontSize:9,color:isA?"rgba(255,255,255,.3)":"#333"}}>—</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button onClick={()=>setCalOpen(p=>!p)}
            style={{width:"100%",marginTop:4,marginBottom:10,padding:"7px",background:"transparent",border:"1px solid #1a1a2a",borderRadius:8,color:"#555",fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,fontWeight:700,letterSpacing:1,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <span style={{fontSize:13}}>{calOpen?"▲":"▼"}</span>
            {calOpen?"Recolher calendário":"Ver semanas anteriores"}
          </button>
        </div>

        {/* TABS */}
        <div style={{display:"flex",background:"#0a0a12",borderBottom:"1px solid #1a1a2a",position:"sticky",top:0,zIndex:10}}>
          {[["workout","Treino"],["edit","Editar Treinos"],["add","+ Exercício"]].map(([k,l])=>(
            <button key={k} className={`tb${view===k?" on":""}`} style={{"--a":acc}} onClick={()=>goView(k)}>{l}</button>
          ))}
        </div>

        {/* ════ TREINO ════ */}
        {view==="workout"&&(
          <div style={{padding:"16px 16px 100px"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,gap:10}}>
              <div>
                <p style={{fontSize:13,color:"#555"}}>{dayLbl}{isToday?" · hoje":""}</p>
                {wk?<p style={{fontSize:15,fontWeight:700,color:acc}}>{wk.emoji} {wk.label} — {wk.name}</p>
                   :<p style={{fontSize:14,color:"#444"}}>Nenhum treino selecionado</p>}
              </div>
              <button onClick={()=>setPicking(p=>!p)}
                style={{background:picking?acc:"#1a1a2a",border:`1.5px solid ${picking?acc:"#2a2a3a"}`,color:picking?"#fff":"#aaa",borderRadius:10,padding:"9px 14px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",flexShrink:0}}>
                {wk?"Trocar":"Escolher"}
              </button>
            </div>

            {picking&&(
              <div style={{background:"#0e0e1a",border:"1px solid #1e1e2e",borderRadius:14,padding:"14px",marginBottom:16,display:"flex",flexDirection:"column",gap:8}}>
                <p style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:4}}>Treino de {dayLbl}:</p>
                <button className="wb" style={{"--b":"#666",borderColor:!selWk?"#888":"#1e1e2e",background:!selWk?"#1e1e2e":"#111118"}}
                  onClick={()=>{setDayWk(p=>({...p,[selDate]:null}));setPicking(false);}}>
                  <span style={{fontSize:18}}>😴</span>
                  <div style={{flex:1,textAlign:"left"}}><span style={{fontSize:14,fontWeight:700,color:!selWk?"#ccc":"#666"}}>Descanso</span></div>
                  {!selWk&&<span style={{color:"#22c55e",fontSize:16}}>✓</span>}
                </button>
                {WK_KEYS.map(k=>{
                  const w=library[k], isSel=selWk===k;
                  return(
                    <button key={k} className={`wb${isSel?" sw":""}`} style={{"--b":w.color}}
                      onClick={()=>{setDayWk(p=>({...p,[selDate]:k}));setPicking(false);}}>
                      <span style={{fontSize:18}}>{w.emoji}</span>
                      <div style={{flex:1,textAlign:"left"}}>
                        <span style={{fontSize:15,fontWeight:800,color:isSel?w.color:"#ccc",letterSpacing:.5}}>{w.label}</span>
                        <p style={{fontSize:11,color:isSel?w.color:"#555",marginTop:1}}>{w.name}</p>
                      </div>
                      {isSel&&<span style={{color:"#22c55e",fontSize:16}}>✓</span>}
                    </button>
                  );
                })}
              </div>
            )}

            {wk&&(
              <div style={{background:"#111118",border:`1px solid ${acc}33`,borderRadius:14,padding:"13px 16px",marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <p style={{fontSize:13,color:"#777"}}>Progresso</p>
                  <span style={{fontSize:20,fontWeight:800,color:pct===100?"#22c55e":acc}}>{doneN}/{total}</span>
                </div>
                <div style={{height:6,background:"#1e1e2e",borderRadius:4,overflow:"hidden"}}>
                  <div className="pb" style={{width:`${pct}%`,background:pct===100?"linear-gradient(90deg,#16a34a,#22c55e)":`linear-gradient(90deg,${acc}88,${acc})`}}/>
                </div>
                {pct===100&&<p style={{textAlign:"center",marginTop:10,fontSize:14,color:"#22c55e",fontWeight:700}}>🎉 Treino concluído! Bora crescer!</p>}
              </div>
            )}

            {!wk&&!picking&&(
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"48px 24px",textAlign:"center",gap:12}}>
                <div style={{fontSize:52}}>🏋️</div>
                <h2 style={{fontSize:20,fontWeight:800}}>Qual treino hoje?</h2>
                <p style={{fontSize:14,color:"#555",lineHeight:1.6}}>Toque em <strong style={{color:"#aaa"}}>"Escolher"</strong> acima<br/>para selecionar A1, B1, C1...</p>
              </div>
            )}

            {groups.map((g,gi)=>(
              <div key={gi} style={{marginBottom:22}}>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:4,height:18,borderRadius:2,background:acc,flexShrink:0}}/>
                  <h3 style={{fontSize:13,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"#ccc"}}>{g.name}</h3>
                  <div style={{flex:1,height:1,background:"#1e1e2e"}}/>
                  <span style={{fontSize:11,color:"#555"}}>{g.exercises.filter(e=>done[`${selDate}_${e.id}`]).length}/{g.exercises.length}</span>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:8}}>
                  {g.exercises.map(ex=>{
                    const dn=!!done[`${selDate}_${ex.id}`];
                    return(
                      <div key={ex.id} className={`er${dn?" dn":""}`} onClick={()=>toggle(ex.id)}>
                        <button className={`ck${dn?" on":""}`} style={{border:dn?"none":`2px solid ${acc}55`}}
                          onClick={e=>{e.stopPropagation();toggle(ex.id);}}>
                          {dn&&<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </button>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:15,fontWeight:600,color:dn?"#444":"#eee",textDecoration:dn?"line-through":"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{ex.name}</p>
                          <p style={{fontSize:12,fontWeight:700,color:dn?"#333":acc,marginTop:2}}>{ex.sets}</p>
                        </div>
                        {ex.video&&(
                          <div className="yt" onClick={e=>{e.stopPropagation();openVid(ex.video);}}>
                            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                              <path d="M15.8 1.9C15.6 1.1 15 .5 14.2.3C13 0 8 0 8 0S3 0 1.8.3C1 .5.4 1.1.2 1.9C0 3.1 0 6 0 6S0 8.9.2 10.1C.4 10.9 1 11.5 1.8 11.7C3 12 8 12 8 12S13 12 14.2 11.7C15 11.5 15.6 10.9 15.8 10.1C16 8.9 16 6 16 6S16 3.1 15.8 1.9Z" fill="#FF0000"/>
                              <path d="M6.4 8.6L10.5 6 6.4 3.4V8.6Z" fill="white"/>
                            </svg>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ════ EDITAR TREINOS ════ */}
        {view==="edit"&&(
          <div style={{padding:"16px 16px 100px"}}>
            {!editKey?(
              <>
                <div style={{marginBottom:16}}>
                  <h2 style={{fontSize:22,fontWeight:800,letterSpacing:1}}>EDITAR <span style={{color:acc}}>TREINOS</span></h2>
                  <p style={{fontSize:13,color:"#555",marginTop:4}}>Selecione um treino para editar sua composição.</p>
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {WK_KEYS.map(k=>{
                    const w=library[k], cnt=w.groups.reduce((s,g)=>s+g.exercises.length,0);
                    return(
                      <div key={k} style={{background:"#111118",border:`1px solid ${w.color}33`,borderRadius:14,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
                        <div style={{fontSize:28}}>{w.emoji}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <p style={{fontSize:18,fontWeight:800,color:w.color,letterSpacing:.5}}>{w.label}</p>
                          <p style={{fontSize:12,color:"#666",marginTop:2}}>{w.name}</p>
                          <p style={{fontSize:11,color:"#444",marginTop:3}}>{w.groups.length} grupos · {cnt} exercícios</p>
                        </div>
                        <button onClick={()=>startEdit(k)}
                          style={{padding:"8px 14px",background:"transparent",border:`1px solid ${w.color}66`,borderRadius:9,color:w.color,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",letterSpacing:.5,flexShrink:0}}>
                          ✏️ Editar
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            ):(
              draft&&(
                <>
                  <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                    <button onClick={()=>{setEditKey(null);setDraft(null);}}
                      style={{background:"#1a1a2a",border:"1px solid #2a2a3a",borderRadius:8,padding:"7px 12px",color:"#aaa",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                      ← Voltar
                    </button>
                    <div style={{flex:1}}>
                      <p style={{fontSize:11,color:"#555",letterSpacing:1,textTransform:"uppercase"}}>Editando</p>
                      <p style={{fontSize:17,fontWeight:800,color:draft.color}}>{draft.emoji} {draft.label}</p>
                    </div>
                    <button onClick={saveEdit}
                      style={{background:flash?"#22c55e":draft.color,border:"none",borderRadius:10,padding:"9px 18px",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,cursor:"pointer",transition:"background .3s",letterSpacing:.5}}
                      className={flash?"fl":""}>
                      {flash?"✓ Salvo!":"Salvar"}
                    </button>
                  </div>

                  <div style={{marginBottom:14}}>
                    <label style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:5}}>Nome do treino</label>
                    <input className="ip" style={{"--a":draft.color}} value={draft.name} onChange={e=>setDraft(p=>({...p,name:e.target.value}))}/>
                  </div>

                  {draft.groups.map((g,gi)=>(
                    <div key={gi} className="ec">
                      <div style={{padding:"10px 14px",background:"#0e0e1a",display:"flex",alignItems:"center",gap:8,borderBottom:"1px solid #1e1e2e"}}>
                        <div style={{width:3,height:16,borderRadius:2,background:draft.color,flexShrink:0}}/>
                        <span style={{fontSize:13,fontWeight:800,letterSpacing:2,textTransform:"uppercase",color:"#ccc",flex:1}}>{g.name}</span>
                        <span style={{fontSize:11,color:"#555"}}>{g.exercises.length} ex.</span>
                      </div>
                      {g.exercises.map((ex,ei)=>(
                        <div key={ex.id} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"10px 12px",borderBottom:"1px solid #141424"}}>
                          <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
                            <input className="ips" style={{"--a":draft.color,width:"100%"}}
                              placeholder="Nome" value={ex.name} onChange={e=>updEx(gi,ei,"name",e.target.value)}/>
                            <div style={{display:"flex",gap:6}}>
                              <input className="ips" style={{"--a":draft.color,width:88}}
                                placeholder="Séries" value={ex.sets} onChange={e=>updEx(gi,ei,"sets",e.target.value)}/>
                              <input className="ips" style={{"--a":draft.color,flex:1}}
                                placeholder="youtu.be/..." value={ex.video} onChange={e=>updEx(gi,ei,"video",e.target.value)}/>
                            </div>
                          </div>
                          <button className="db" onClick={()=>delEx(gi,ei)}>×</button>
                        </div>
                      ))}
                      <div style={{padding:"10px 12px",background:"#0a0a14",borderTop:"1px dashed #1e1e2e"}}>
                        <p style={{fontSize:10,color:"#444",letterSpacing:1,textTransform:"uppercase",marginBottom:7}}>+ Adicionar exercício</p>
                        <div style={{display:"flex",flexDirection:"column",gap:6}}>
                          <input className="ips" style={{"--a":draft.color,width:"100%"}}
                            placeholder="Nome do exercício"
                            value={addForms[gi]?.name||""} onChange={e=>setAddForms(p=>({...p,[gi]:{...(p[gi]||{}),name:e.target.value}}))}/>
                          <div style={{display:"flex",gap:6}}>
                            <input className="ips" style={{"--a":draft.color,width:88}}
                              placeholder="Séries"
                              value={addForms[gi]?.sets||""} onChange={e=>setAddForms(p=>({...p,[gi]:{...(p[gi]||{}),sets:e.target.value}}))}/>
                            <input className="ips" style={{"--a":draft.color,flex:1}}
                              placeholder="youtu.be/..."
                              value={addForms[gi]?.video||""} onChange={e=>setAddForms(p=>({...p,[gi]:{...(p[gi]||{}),video:e.target.value}}))}/>
                            <button onClick={()=>addEx(gi)}
                              style={{width:32,height:32,borderRadius:8,background:draft.color,border:"none",color:"#fff",fontSize:20,cursor:"pointer",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,lineHeight:1}}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{background:"#0e0e1a",border:"1px dashed #252535",borderRadius:14,padding:"14px",marginBottom:10,marginTop:4}}>
                    <p style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",marginBottom:8}}>Novo grupo muscular</p>
                    <div style={{display:"flex",gap:8}}>
                      <input className="ips" style={{"--a":draft.color,flex:1}}
                        placeholder="Ex: Ombro, Abdômen..." value={newGrp}
                        onChange={e=>setNewGrp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGrp()}/>
                      <button onClick={addGrp}
                        style={{padding:"8px 16px",borderRadius:8,background:draft.color,border:"none",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:800,cursor:"pointer"}}>
                        Criar
                      </button>
                    </div>
                  </div>

                  <button onClick={saveEdit}
                    style={{width:"100%",padding:"15px",border:"none",borderRadius:12,color:"#fff",background:flash?"#22c55e":draft.color,fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,letterSpacing:1.5,cursor:"pointer",textTransform:"uppercase",transition:"background .3s"}}
                    className={flash?"fl":""}>
                    {flash?`✓ Treino Salvo!`:`Salvar ${draft.label}`}
                  </button>
                </>
              )
            )}
          </div>
        )}

        {/* ════ + EXERCÍCIO ════ */}
        {view==="add"&&(
          <QuickAddView accent={acc} dayLbl={dayLbl} isToday={isToday}/>
        )}

        {/* Bottom fade */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:430,background:"linear-gradient(0deg,#090910 65%,transparent)",padding:"10px 20px 20px",pointerEvents:"none",display:"flex",justifyContent:"center"}}>
          <div style={{width:90,height:4,borderRadius:2,background:`${acc}44`}}/>
        </div>

      </div>
    </div>
  );
}

function QuickAddView({accent, dayLbl, isToday}) {
  const [f, setF] = useState({group:"",name:"",sets:"",video:""});
  const [saved, setSaved] = useState(false);
  const set = (k,v) => setF(p=>({...p,[k]:v}));
  const save = () => {
    if (!f.name) return;
    setSaved(true);
    setTimeout(()=>{ setSaved(false); setF({group:"",name:"",sets:"",video:""}); }, 1800);
  };
  return(
    <div style={{padding:"20px 16px 100px",display:"flex",flexDirection:"column",gap:14}}>
      <div>
        <h2 style={{fontSize:22,fontWeight:800,letterSpacing:1}}>EXTRA <span style={{color:accent}}>DO DIA</span></h2>
        <p style={{fontSize:13,color:"#555",marginTop:4}}>Para: <strong style={{color:"#aaa"}}>{dayLbl}{isToday?" (hoje)":""}</strong></p>
        <p style={{fontSize:12,color:"#3a3a5a",marginTop:6,lineHeight:1.5}}>Para editar permanentemente use a aba <strong style={{color:"#666"}}>Editar Treinos</strong>.</p>
      </div>
      {[
        {label:"Grupo muscular",k:"group",ph:"Ex: Peito, Bíceps..."},
        {label:"Nome do exercício",k:"name",ph:"Ex: Supino inclinado..."},
        {label:"Séries / Repetições",k:"sets",ph:"Ex: 4x12, 3x15..."},
        {label:"Link YouTube (opcional)",k:"video",ph:"https://youtu.be/..."},
      ].map(({label,k,ph})=>(
        <div key={k}>
          <label style={{fontSize:11,color:"#555",letterSpacing:1.5,textTransform:"uppercase",display:"block",marginBottom:6}}>{label}</label>
          <input className="ip" style={{"--a":accent}} placeholder={ph} value={f[k]} onChange={e=>set(k,e.target.value)}/>
        </div>
      ))}
      <button onClick={save}
        style={{width:"100%",padding:"15px",border:"none",borderRadius:12,color:"#fff",background:saved?"#22c55e":accent,fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:700,letterSpacing:1.5,cursor:"pointer",textTransform:"uppercase",marginTop:4,transition:"background .3s"}}>
        {saved?"✓ Adicionado!":"Salvar Exercício"}
      </button>
    </div>
  );
}
