import { useEffect, useRef, useState } from "react";
import { getLatLngFromDigiPin, normalizeDigipin } from "../../domain/location/digipin.js";
import { TEXT, topicList, identify, languages } from "./citizenLocale.js";
import "./CitizenHome.css";
import "./CitizenHomeV2.css";

const CONTACT_EMAIL="hello@mycitypulse.in";
const OFFICIAL="https://www.amccrs.com/AMCPortal";
const TRACK="https://www.amccrs.com/AMCPortal/Complaint/TrackProgress?activeTab=token";
const DIGIPIN_URL="https://dac.indiapost.gov.in/mydigipin";
const LOCAL_KEY="mcp:citizen:saved:v2";
const LANG_KEY="mcp:citizen:lang:v2";
const EMAIL_VALID=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PIN_VALID=/^[23456789CFJKLMPT]{10}$/; // 10 valid DIGIPIN characters
const AREAS=["South Bopal","Bopal","Ghuma","Shela","Shilaj","Bodakdev","Satellite","Vastrapur","Chandkheda","Thaltej","Gota"];

function localRead(key,fallback) {
  try {const value=localStorage.getItem(key);return value===null?fallback:JSON.parse(value);} catch{return fallback;}
}
function compose(t,values,topic) {
  const lines=[
    `${t.mailSubj}: ${t[topic.id]}`,
    "",t.greeting,"",t.intro,
    `${t.labelIssue}: ${t[topic.id]}`,
    `${t.labelPlace}: ${[values.landmark,values.area,values.city].filter(Boolean).join(", ")}`,
    values.digipin?`${t.labelDigipin}: ${normalizeDigipin(values.digipin)}`:null,
    values.placeType?`${t.labelType}: ${t[values.placeType]}`:null,
    values.since?`${t.labelWhen}: ${t[values.since]}`:null,
    `${t.labelDetail}: ${values.description}`,
    values.email?`${t.labelReply}: ${values.email}`:null,
    "",values.seven?t.letterRequest:t.letterGeneral,
    "",t.thanks
  ];
  return lines.filter(v=>v!==null).join("\n");
}
function sevenWeekdaysAfter(dateString) {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(dateString||"")) return null;
  const date=new Date(dateString+"T12:00:00");
  if(Number.isNaN(date.getTime()))return null;
  let count=0;while(count<7){date.setDate(date.getDate()+1);if(date.getDay()!==0&&date.getDay()!==6)count++;}
  return date.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});
}
function readCases(){ const data=localRead(LOCAL_KEY,[]);return Array.isArray(data)?data.slice(0,20):[]; }
function issueFor(value) {return topicList.find(x=>x.id===value)||topicList[topicList.length-1];}

export default function CitizenHome(){
  const [lang,setLang]=useState(()=>{try{const s=localStorage.getItem(LANG_KEY);return TEXT[s]?s:"en";}catch{return"en";}});
  const [mode,setMode]=useState("home");
  const [stage,setStage]=useState(1);
  const [form,setForm]=useState({description:"",city:"Ahmedabad",area:"",landmark:"",digipin:"",placeType:"",since:"",email:"",seven:false,topic:"auto"});
  const [draft,setDraft]=useState("");
  const [cases,setCases]=useState(readCases);
  const [ref,setRef]=useState("");
  const [filedDate,setFiledDate]=useState("");
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [precise,setPrecise]=useState(false);
  const [more,setMore]=useState(false);
  const [languageRequest,setLanguageRequest]=useState(false);
  const [requestedLanguage,setRequestedLanguage]=useState("");
  const [emailBox,setEmailBox]=useState(false);
  const [accountEmail,setAccountEmail]=useState("");
  const [authBusy,setAuthBusy]=useState(false);
  const [authState,setAuthState]=useState("");
  const deskRef=useRef(null);
  const t=TEXT[lang];
  const topic=issueFor(form.topic==="auto"?identify(form.description):form.topic);
  const digipin=normalizeDigipin(form.digipin);
  const pinOkay=!digipin|| (PIN_VALID.test(digipin)&&(()=>{try{const x=getLatLngFromDigiPin(digipin);return Number.isFinite(x.latitude)&&Number.isFinite(x.longitude);}catch{return false;}})());
  const inAhmedabad=form.city.trim().toLowerCase()==="ahmedabad"||form.city.trim()==="અમદાવાદ"||form.city.trim()==="अहमदाबाद";
  const authUrl=(import.meta.env.VITE_SUPABASE_URL||"").replace(/\/$/,"");
  const anonKey=import.meta.env.VITE_SUPABASE_ANON_KEY;
  const authConfigured=Boolean(authUrl&&anonKey);

  useEffect(()=>{document.documentElement.lang=lang;document.title="MyCityPulse | "+t.heroAccent;},[lang,t.heroAccent]);
  function changeLang(next){setLang(next);try{localStorage.setItem(LANG_KEY,next);}catch{} }
  function change(key,value){setForm(prev=>({...prev,[key]:value}));setError("");}
  function start(topicId){
    setMode("desk");setStage(1);setError("");setNotice("");setPrecise(false);setMore(false);
    if(topicId){const i=issueFor(topicId);setForm(old=>({...old,topic:topicId,description:t[topicId]}));}
    else setForm(old=>({...old,topic:"auto",description:""}));
    requestAnimationFrame(()=>deskRef.current?.scrollIntoView({behavior:"smooth",block:"start"}));
  }
  function advance(){
    setError("");
    if(stage===1){
      if(form.description.trim().length<4){setError(t.needDesc);return;}
      if(!form.city.trim()){setError(t.needCity);return;}
      if(!form.area.trim()&&!digipin){setError(t.needArea);return;}
      if(!pinOkay){setError(t.invalidPin);return;}
      setStage(2);
    }else if(stage===2){
      if(form.email.trim()&&!EMAIL_VALID.test(form.email.trim())){setError(t.invalidEmail);return;}
      setDraft(compose(t,form,topic));setStage(3);
    }
    deskRef.current?.scrollIntoView({behavior:"smooth",block:"start"});
  }
  async function copyMessage(){
    try{await navigator.clipboard.writeText(draft);setNotice(t.copied);}catch{setNotice(t.manualCopy);}
  }
  function save(){
    const next=[{id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),topic:t[topic.id],area:form.area,city:form.city,landmark:form.landmark,digipin:digipin,reference:ref.trim().slice(0,100),filedDate:ref.trim()?filedDate:"",requestSeven:form.seven,created:new Date().toISOString()},...cases].slice(0,20);
    try{localStorage.setItem(LOCAL_KEY,JSON.stringify(next));setCases(next);setNotice(t.localSaved);setRef("");}
    catch{setNotice(t.cannotSave);}
  }
  function remove(id){const next=cases.filter(x=>x.id!==id);try{localStorage.setItem(LOCAL_KEY,JSON.stringify(next));setCases(next);}catch{setNotice(t.cannotSave);}}
  function sendLangRequest(e){
    e.preventDefault();if(!requestedLanguage.trim())return;
    const subject=encodeURIComponent("MyCityPulse language request: "+requestedLanguage.trim());
    const body=encodeURIComponent("Please consider adding "+requestedLanguage.trim()+" to MyCityPulse.\n\nSent from the website language selector.");
    window.location.href=`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setLanguageRequest(false);
  }
  async function requestSignIn(e){
    e.preventDefault();if(!EMAIL_VALID.test(accountEmail.trim())){setAuthState(t.invalidEmail);return;}
    if(!authConfigured){setAuthState(t.accessNotReady);return;}
    setAuthBusy(true);setAuthState("");
    try{
      const resp=await fetch(`${authUrl}/auth/v1/otp`,{
        method:"POST",headers:{"Content-Type":"application/json","apikey":anonKey},
        body:JSON.stringify({email:accountEmail.trim(),create_user:true,options:{email_redirect_to:window.location.origin+"/"}})
      });
      if(!resp.ok)throw new Error("Unable to request email link");
      setAuthState(t.checkInbox);
    }catch{setAuthState(t.authError);}finally{setAuthBusy(false);}
  }

  return <div className="mcp-citizen mcp-v2" lang={lang}>
    <header className="mcp-header mcp-wrap">
      <a href="/" className="mcp-wordmark" aria-label="MyCityPulse home"><span className="mcp-logomark"><i/><i/><i/><i/></span><span>mycity<b>pulse</b><small>.in</small></span></a>
      <nav className="mcp-nav" aria-label="Main navigation"><a href="/">Home</a><a href="/how-it-works">How it works</a><a href="/explore">{t.cities}</a><button type="button" onClick={()=>setMode("saved")}>{t.saved}<span className="mcp-count">{cases.length}</span></button></nav>
      <div className="mcp-translate"><label htmlFor="mcp-language">{t.lang}</label><select id="mcp-language" aria-label={t.lang} value={lang} onChange={e=>changeLang(e.target.value)}>{languages.map(l=><option key={l.id} value={l.id}>{l.label}</option>)}</select><button type="button" title={t.otherLang} onClick={()=>setLanguageRequest(v=>!v)}>＋</button></div>
    </header>
    {languageRequest&&<form className="mcp-wrap mcp-lang-form" onSubmit={sendLangRequest}><label htmlFor="mcp-request-language">{t.languageName}</label><input id="mcp-request-language" value={requestedLanguage} onChange={e=>setRequestedLanguage(e.target.value)} placeholder={t.languagePlaceholder} maxLength={70} required/><button type="submit" className="mcp-btn mcp-btn-dark">{t.request} ↗</button><button type="button" className="mcp-quiet" onClick={()=>setLanguageRequest(false)}>{t.cancel}</button><small>{t.requestHint}</small></form>}

    <main>
      <section className="mcp-hero mcp-wrap" aria-labelledby="mcp-hero-title">
        <div className="mcp-hero-content"><div className="mcp-eyebrow"><span/>{t.tagline}</div><h1 id="mcp-hero-title">{t.hero}<br/><em>{t.heroAccent}</em></h1><p className="mcp-hero-lead">{t.lead}</p><div className="mcp-hero-buttons"><button type="button" className="mcp-btn mcp-btn-orange" onClick={()=>start()}>{t.start}<span>↗</span></button><a href="#how" className="mcp-btn mcp-btn-outline">{t.explain} ↓</a></div><div className="mcp-trust"><span>✓ {t.privacy}</span><span>✓ {t.notFiled}</span><span>✓ {t.free}</span></div></div>
        <div className="mcp-scene"><div className="mcp-scene-top"><span><i className="mcp-signal"/> CITY MOMENTS</span><span>23° N / 72° E</span></div><div className="mcp-art"><div className="mcp-sun"/><div className="mcp-cloud"/><div className="mcp-house house-one"><div/><div/><div/></div><div className="mcp-house house-two"><div/><div/><div/></div><div className="mcp-house house-three"><div/><div/></div><div className="mcp-tree"><span/><i/></div><div className="mcp-road"><span/><span/></div><div className="mcp-pin">!</div></div><div className="mcp-scene-caption"><div><small>THE EVERYDAY CITY</small><strong>“Kachra kyare uthse?”</strong><p>Ahmedabad, one ordinary morning.</p></div><span>↗</span></div></div>
      </section>
      <section className="mcp-issues"><div className="mcp-wrap"><div className="mcp-issues-head"><span>{t.common}</span><span>{t.yourWords} ↘</span></div><div className="mcp-issue-grid">{topicList.slice(0,4).map(x=><button key={x.id} type="button" className="mcp-issue" onClick={()=>start(x.id)}><span className="mcp-issue-icon">{x.symbol}</span><span>{t[x.id]}</span><span className="mcp-issue-arrow">↗</span></button>)}</div></div></section>

      <div className="mcp-wrap mcp-flow-wrap" id="citizen-desk" ref={deskRef}>
        {mode==="desk"&&<section className="mcp-flow" aria-labelledby="mcp-flow-title">
          <div className="mcp-flow-heading"><div><div className="mcp-eyebrow"><span/>{t.tagline}</div><h2 id="mcp-flow-title">{stage===1?t.stage1:stage===2?t.stage2:t.stage3}</h2></div><div className="mcp-step-count">{t.step} {stage}/3</div></div><div className="mcp-track"><span style={{width:`${stage/3*100}%`}}/></div>
          {stage===1&&<form className="mcp-form" onSubmit={e=>{e.preventDefault();advance();}}>
            <label htmlFor="mcp-description" className="mcp-label">{t.describe} *</label>
            <textarea id="mcp-description" value={form.description} onChange={e=>change("description",e.target.value)} placeholder={t.descPlaceholder} rows={4} maxLength={1200} required autoFocus/>
            <div className="mcp-discovered"><span>{t.issueType}: <b>{t[topic.id]}</b></span><button type="button" onClick={()=>setMore(s=>!s)}>{t.changeType} ⌄</button></div>
            {more&&<div className="mcp-chooser">{topicList.map(x=><button type="button" key={x.id} aria-pressed={topic.id===x.id} className={topic.id===x.id?"mcp-choice selected":"mcp-choice"} onClick={()=>{change("topic",x.id);setMore(false);}}>{x.symbol} {t[x.id]}</button>)}</div>}
            <label className="mcp-label" htmlFor="mcp-city">{t.city} *</label>
            <select id="mcp-city" value={form.city==="Ahmedabad"?"Ahmedabad":"other"} onChange={e=>change("city",e.target.value==="Ahmedabad"?"Ahmedabad":"")}><option value="Ahmedabad">{t.cityAhmedabad}</option><option value="other">{t.cityOther}</option></select>
            {!inAhmedabad&&<><label className="mcp-label" htmlFor="mcp-othercity">{t.cityName} *</label><input id="mcp-othercity" value={form.city} onChange={e=>change("city",e.target.value)} placeholder={t.cityNamePlaceholder} maxLength={100}/></>}
            <div className="mcp-form-cols"><div><label className="mcp-label" htmlFor="mcp-area">{t.area}{!digipin?" *":""}</label><input list="mcp-area-choices" id="mcp-area" value={form.area} onChange={e=>change("area",e.target.value)} placeholder={t.areaPlaceholder} maxLength={120}/><datalist id="mcp-area-choices">{AREAS.map(x=><option key={x} value={x}/>)}</datalist></div><div><label className="mcp-label" htmlFor="mcp-landmark">{t.landmark}</label><input id="mcp-landmark" value={form.landmark} onChange={e=>change("landmark",e.target.value)} placeholder={t.landmarkPlaceholder} maxLength={160}/></div></div>
            <button type="button" className="mcp-disclosure" aria-expanded={precise} onClick={()=>setPrecise(!precise)}>＋ {t.precision} <span>⌄</span></button>
            {precise&&<div className="mcp-pin-area"><label className="mcp-label" htmlFor="mcp-digipin">{t.digipin}</label><input id="mcp-digipin" value={form.digipin} onChange={e=>change("digipin",normalizeDigipin(e.target.value).slice(0,10))} placeholder={t.digipinPlaceholder} maxLength={10} autoComplete="off" inputMode="text" aria-invalid={!pinOkay}/><div className="mcp-pin-help"><span>{t.digitip}</span><a href={DIGIPIN_URL} target="_blank" rel="noopener noreferrer">{t.findPin}</a></div>{!pinOkay&&<p className="mcp-error" role="alert">{t.invalidPin}</p>}</div>}
            {error&&<p className="mcp-error" role="alert">{error}</p>}<div className="mcp-form-actions"><button type="submit" className="mcp-btn mcp-btn-orange">{t.next} →</button><button type="button" className="mcp-quiet" onClick={()=>setMode("home")}>{t.close}</button></div>
          </form>}
          {stage===2&&<div className="mcp-form">
            <div className="mcp-result-card"><span className="mcp-result-tag">{t.result}</span><div className="mcp-result-grid"><div><small>{t.issueType}</small><strong>{t[topic.id]}</strong></div><div><small>{t.location}</small><strong>{[form.area,form.city].filter(Boolean).join(", ")||digipin}</strong></div><div><small>{t.service}</small><strong>{t[topic.desk]}</strong></div></div><h3>{t.check}</h3><p>{form.placeType==="private"?t.reasonPrivate:t.reasonPublic}</p><p className="mcp-help">{t.guidance}</p></div>
            <div className="mcp-optional"><label className="mcp-label">{t.ownership}</label><div className="mcp-pills">{["public","private","unsure"].map(x=><button key={x} type="button" aria-pressed={form.placeType===x} className={form.placeType===x?"on":""} onClick={()=>change("placeType",x)}>{t[x]}</button>)}</div>
            <label className="mcp-label">{t.since}</label><div className="mcp-pills">{["today","days","week","unknown"].map(x=><button key={x} type="button" aria-pressed={form.since===x} className={form.since===x?"on":""} onClick={()=>change("since",x)}>{t[x]}</button>)}</div></div>
            <div className="mcp-followup"><h3>{t.contact}</h3><p>{t.contactInfo}</p><label className="mcp-check"><input type="checkbox" checked={form.seven} onChange={e=>change("seven",e.target.checked)}/><span>{t.deadline}</span></label><p className="mcp-help">{t.deadlineNote}</p><label htmlFor="mcp-email" className="mcp-label">{t.email}</label><input type="email" id="mcp-email" value={form.email} placeholder={t.emailPlaceholder} onChange={e=>change("email",e.target.value)} maxLength={180}/></div>
            {error&&<p className="mcp-error" role="alert">{error}</p>}
            <div className="mcp-form-actions"><button type="button" className="mcp-btn mcp-btn-orange" onClick={advance}>{t.create} →</button><button type="button" className="mcp-quiet" onClick={()=>setStage(1)}>← {t.back}</button></div>
          </div>}
          {stage===3&&<div className="mcp-result">
            <label className="mcp-label" htmlFor="mcp-draft">{t.draftLabel}</label><button type="button" className="mcp-quiet" onClick={()=>setDraft(compose(t,form,topic))}>{t.retranslate} ↻</button><textarea className="mcp-draft" id="mcp-draft" rows={12} value={draft} onChange={e=>setDraft(e.target.value)}/>
            <div className="mcp-form-actions"><button type="button" onClick={copyMessage} className="mcp-btn mcp-btn-dark">{t.copy} ⧉</button><button type="button" className="mcp-quiet" onClick={()=>setStage(2)}>← {t.back}</button></div>
            <div className="mcp-official"><span>{t.officialTitle}</span><p>{t.officialInfo}</p>{inAhmedabad?<div className="mcp-link-row"><a href={OFFICIAL} target="_blank" rel="noopener noreferrer">{t.official}</a><a href={TRACK} target="_blank" rel="noopener noreferrer">{t.track}</a></div>:<p>{t.outOfArea}</p>}{inAhmedabad&&<p className="mcp-help">{t.jurisdiction}</p>}</div>
            <div className="mcp-save"><label className="mcp-label" htmlFor="mcp-reference">{t.ref}</label><div className="mcp-save-row"><input id="mcp-reference" value={ref} maxLength={100} onChange={e=>setRef(e.target.value)} placeholder={t.refPlaceholder}/><button type="button" className="mcp-btn mcp-btn-outline" onClick={save}>{t.save} ✓</button></div>{!!ref.trim()&&<div className="mcp-date-field"><label className="mcp-label" htmlFor="mcp-filed-date">{t.filedDate}</label><input id="mcp-filed-date" type="date" value={filedDate} max={new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10)} onChange={e=>setFiledDate(e.target.value)}/>{form.seven&&filedDate&&<p className="mcp-help"><strong>{t.followup}: {sevenWeekdaysAfter(filedDate)}</strong><br/>{t.followupDisclaimer}</p>}</div>}</div>
            {notice&&<p role="status" className="mcp-success">{notice}</p>}
          </div>}
        </section>}
        {mode==="saved"&&<section className="mcp-flow"><div className="mcp-flow-heading"><h2>{t.myCases}</h2><button type="button" className="mcp-quiet" onClick={()=>setMode("home")}>{t.close} ✕</button></div>
          {!cases.length?<p className="mcp-empty">{t.noCases}</p>:<div className="mcp-saved-grid">{cases.map(x=><article key={x.id} className="mcp-saved-card"><small>{new Date(x.created).toLocaleDateString()}</small><h3>{x.topic}</h3><p>{[x.landmark,x.area,x.city].filter(Boolean).join(", ")}</p><p>{x.reference||t.noReference}</p>{x.requestSeven&&x.filedDate&&<p><b>{t.followup}: {sevenWeekdaysAfter(x.filedDate)}</b><br/><small>{t.followupDisclaimer}</small></p>}<button type="button" onClick={()=>remove(x.id)}>{t.delete}</button></article>)}</div>}<p className="mcp-help">{t.deviceOnly}</p><button type="button" className="mcp-btn mcp-btn-orange" onClick={()=>start()}>{t.newCase} ↗</button>
        </section>}
      </div>

      <section id="how" className="mcp-how mcp-wrap"><div className="mcp-section-heading"><div><span className="mcp-eyebrow"><span/>{t.explain}</span><h2>{t.stepsTitle}</h2></div><p>{t.stepsLead}</p></div><div className="mcp-how-grid">{[[t.how1,t.how1Body,"◎"],[t.how2,t.how2Body,"⌾"],[t.how3,t.how3Body,"▤"]].map(([head,body,icon],i)=><article key={head}><div className="mcp-number">0{i+1} <span>↘</span></div><span className="mcp-how-icon">{icon}</span><h3>{head}</h3><p>{body}</p></article>)}</div></section>
      <section className="mcp-pilot"><div className="mcp-wrap mcp-pilot-grid"><div><span className="mcp-eyebrow"><span/> {t.tagline}</span><h2>{t.edgeTitle}</h2><p>{t.edgeBody}</p></div><div className="mcp-pilot-panel"><div>MYCITYPULSE · CIVIC CONTEXT</div><div className="mcp-concentric"><i/><i/><i/><span/></div><strong>ONE PLACE.<br/>MULTIPLE SYSTEMS.</strong><small>LOCATION IS NOT JURISDICTION</small></div></div></section>
      <section className="mcp-more mcp-wrap"><div className="mcp-section-heading"><div><span className="mcp-eyebrow"><span/> CITY EXPLORER</span><h2>{t.exploreTitle}</h2></div><p>{t.exploreBody}</p></div><div className="mcp-more-grid"><a href="/explore"><span>01 / CITY ATLAS</span><h3>{t.atlas}</h3><strong>↗</strong></a><a href="/ahmedabad"><span>02 / LOCAL PROFILE</span><h3>{t.profile}</h3><strong>↗</strong></a><a href="/compare"><span>03 / COMPARE</span><h3>{t.compareTitle}</h3><strong>↗</strong></a></div></section>
      <section className="mcp-accounts mcp-wrap"><h2>{t.account}</h2><p>{t.accountNote}</p><button type="button" className="mcp-btn mcp-btn-outline" onClick={()=>setEmailBox(x=>!x)}>{t.emailAccess} ↓</button>{emailBox&&<form onSubmit={requestSignIn} className="mcp-account-form"><label htmlFor="mcp-account-email" className="mcp-label">{t.email}</label><input type="email" required id="mcp-account-email" value={accountEmail} onChange={e=>setAccountEmail(e.target.value)} placeholder={t.emailPlaceholder}/>{authConfigured?<button type="submit" className="mcp-btn mcp-btn-dark" disabled={authBusy}>{t.accessReady}</button>:<p className="mcp-help">{t.accessNotReady}</p>}{authState&&<p role="status">{authState}</p>}</form>}</section>
    </main>
    <footer className="mcp-footer"><div className="mcp-wrap mcp-footer-grid"><div><a href="/" className="mcp-wordmark"><span className="mcp-logomark"><i/><i/><i/><i/></span><span>mycity<b>pulse</b><small>.in</small></span></a><p>{t.copyFooter}</p></div><div><b>{t.footer}</b></div><div><a href="/">Home ↗</a><a href="/how-it-works">How it works ↗</a><a href="/explore">{t.cities} ↗</a><a href={OFFICIAL} target="_blank" rel="noopener noreferrer">AMC CCRS ↗</a></div></div><div className="mcp-wrap mcp-footer-bottom"><span>© 2026 MyCityPulse</span><span>{t.footer}</span></div></footer>
    <div className="mcp-mobile-bar"><a href="/explore">⌕<span>{t.cities}</span></a><button type="button" onClick={()=>start()}>+<span>{t.start}</span></button><button type="button" onClick={()=>setMode("saved")}>▤<span>{t.saved}</span></button></div>
  </div>;
}
