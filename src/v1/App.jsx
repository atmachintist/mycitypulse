import { useEffect, useMemo, useState } from "react";
import { ISSUE_TYPES, SOURCES, translate, LANGUAGES } from "./content";
import "./styles.css";

const STORAGE_LANG="mcp:v1:lang";
const STORAGE_NOTES="mcp:v1:notes";
const VALID_PIN=/^[23456789CFJKLMPT]{10}$/;
const initialForm=()=>({issue:"waste", description:"", city:"Ahmedabad",area:"",landmark:"",digipin:"",ownership:"unsure"});
const topicKey={waste:"issueWaste",roads:"issueRoads",drainage:"issueDrainage",streetlights:"issueStreetlights",water:"issueWater",other:"issueOther"};
const futureDate=(v)=>{if(!v)return false;const d=new Date(v+"T12:00:00");const now=new Date();now.setHours(23,59,59,999);return Number.isNaN(d.getTime())||d>now;};
const todayLocal=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");};
const addWeekdays=(s)=>{if(!s)return null;const d=new Date(s+"T12:00:00");if(Number.isNaN(d.getTime()))return null;let n=0;while(n<7){d.setDate(d.getDate()+1);if(d.getDay()!==0&&d.getDay()!==6)n++;}return d.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"});};
function getNotes(){try{const x=JSON.parse(localStorage.getItem(STORAGE_NOTES)||"[]");return Array.isArray(x)?x.slice(0,40):[];}catch{return [];}}

function Icon({name,size=22}){
 const shared={viewBox:"0 0 24 24",width:size,height:size,fill:"none",stroke:"currentColor",strokeWidth:1.65,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":"true"};
 if(name==="arrow")return <svg {...shared}><path d="M5 12h14m-7-7 7 7-7 7"/></svg>;
 if(name==="pin")return <svg {...shared}><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></svg>;
 if(name==="chat")return <svg {...shared}><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-5.5a9 9 0 1 1 16.1-4Z"/></svg>;
 if(name==="city")return <svg {...shared}><path d="M3 21V8l6-3v16M9 11l6-4v14m0-10 6 3v7M6 11v2m0 3v2m6-4v2m6 1v1"/></svg>;
 if(name==="info")return <svg {...shared}><circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/></svg>;
 if(name==="check")return <svg {...shared}><path d="m4 13 5 5L20 6"/></svg>;
 if(name==="copy")return <svg {...shared}><rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>;
 if(name==="lock")return <svg {...shared}><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
 if(name==="book")return <svg {...shared}><path d="M12 7c-3-2-6-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V6c-4-1-7-1-10 1Zm0 0v14"/></svg>;
 if(name==="close")return <svg {...shared}><path d="M5 5l14 14M19 5 5 19"/></svg>;
 return <svg {...shared}><circle cx="12" cy="12" r="9"/></svg>;
}

function Mark(){return <span className="v1-mark" aria-hidden="true"><i/><i/><i/><i/></span>;}
function ButtonLink({href,children,secondary=false,small=false}){return <a className={"v1-btn "+(secondary?"v1-btn-outline":"v1-btn-dark")+(small?" v1-btn-small":"")} href={href}>{children}<Icon name="arrow" size={17}/></a>;}
function Eyebrow({children}){return <p className="v1-eyebrow"><span/> {children}</p>;}
function Kicker({number,title,description}){return <div className="v1-process-step"><span className="v1-stepnum">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>;}

function Shell({lang,setLang,children,current,t}){
 return <div className="v1-app" lang={lang}>
  <a className="v1-skip" href="#content">Skip to content</a>
  <header className="v1-header">
   <div className="v1-wrap v1-header-inner">
    <a className="v1-brand" href="/" aria-label="MyCityPulse home"><Mark/><span>mycity<strong>pulse</strong><small>.in</small></span></a>
    <nav className="v1-nav" aria-label="Main navigation">
     {[["/",t("navHome"),"home"],["/help",t("navHelp"),"help"],["/how-it-works",t("navHow"),"how"],["/know-your-city",t("navCity"),"city"]].map(([href,title,id])=><a href={href} key={id} aria-current={current===id?"page":undefined}>{title}</a>)}
    </nav>
    <div className="v1-header-right">
     <label className="v1-visually-hidden" htmlFor="v1-language">{t("language")}</label>
     <select id="v1-language" value={lang} aria-label={t("language")} onChange={e=>setLang(e.target.value)}>
      {LANGUAGES.map(l=><option value={l.id} key={l.id}>{l.label}</option>)}
     </select>
     <a className="v1-notes-link" href="/saved" title={t("navSaved")} aria-label={t("navSaved")}><Icon name="book" size={18}/></a>
    </div>
   </div>
  </header>
  <main id="content">{children}</main>
  <footer className="v1-footer"><div className="v1-wrap v1-footer-grid">
   <div><a className="v1-footer-brand" href="/"><Mark/> mycity<strong>pulse</strong></a><p>{t("footerLine")}</p><p className="v1-footer-caution">{t("footerFine")}</p></div>
   <div className="v1-footer-links"><a href="/help">{t("navHelp")}</a><a href="/how-it-works">{t("navHow")}</a><a href="/know-your-city">{t("navCity")}</a><a href="/saved">{t("navSaved")}</a></div>
   <div className="v1-footer-links"><a href={SOURCES.amcPortal} target="_blank" rel="noreferrer">AMC official complaint portal ↗</a><a href={SOURCES.nagrika} target="_blank" rel="noreferrer">Nāgrika: Governance Series ↗</a><a href="mailto:hello@mycitypulse.in?subject=MyCityPulse%20language%20request">{t("moreLanguage")} ↗</a></div>
  </div><div className="v1-wrap v1-footer-bottom"><span>© 2026 MyCityPulse</span><span>{t("betaNone")}</span></div></footer>
 </div>;
}

function Home({t}){
 return <>
  <section className="v1-hero v1-wrap">
   <div className="v1-hero-copy"><Eyebrow>{t("heroKicker")}</Eyebrow>
    <h1>{t("heroOne")}<br/><em>{t("heroTwo")}</em></h1>
    <p className="v1-hero-lead">{t("heroIntro")}</p>
    <div className="v1-actions"><ButtonLink href="/help">{t("heroStart")}</ButtonLink><ButtonLink secondary href="/how-it-works">{t("heroSecond")}</ButtonLink></div>
    <p className="v1-quietline"><Icon name="check" size={16}/>{t("heroTrust")}</p>
   </div>
   <div className="v1-paper" aria-label={t("mockTag")}>
    <div className="v1-paper-top"><span>MYCITYPULSE / 001</span><span className="v1-pin">◎</span></div>
    <div className="v1-paper-map"><div className="v1-road road-a"/><div className="v1-road road-b"/><div className="v1-map-build b1"/><div className="v1-map-build b2"/><div className="v1-map-build b3"/><div className="v1-pin-ring"><Icon name="pin" size={29}/></div></div>
    <div className="v1-paper-quote"><Eyebrow>{t("mockTag")}</Eyebrow><h2>“{t("mockLine")}”</h2><span className="v1-location"><Icon name="pin" size={16}/>{t("mockPlace")}</span></div>
    <div className="v1-paper-bottom"><span>{t("mockAnswer")}</span><span>↗</span></div>
   </div>
  </section>
  <section className="v1-section v1-bg-paper"><div className="v1-wrap"><Eyebrow>{t("pathKicker")}</Eyebrow><div className="v1-titleline"><h2>{t("pathTitle")}</h2><p>01 / 03</p></div>
   <div className="v1-choices">
    {[[<Icon name="chat" size={29}/>,t("path1"),t("path1Desc"),"/help"],[<Icon name="city" size={29}/>,t("path2"),t("path2Desc"),"/know-your-city"],[<Icon name="info" size={29}/>,t("path3"),t("path3Desc"),"/how-it-works"]].map(([ic,h,desc,url])=><a className="v1-choice-card" href={url} key={url}><div className="v1-card-symbol">{ic}</div><h3>{h}</h3><p>{desc}</p><div className="v1-card-bottom"><span>{t("pathAction")}</span><Icon name="arrow" size={21}/></div></a>)}
   </div>
  </div></section>
  <section className="v1-wrap v1-section v1-process-grid">
   <div><Eyebrow>{t("howKicker")}</Eyebrow><h2>{t("howTitle")}</h2><p className="v1-section-sub">{t("howIntro")}</p><ButtonLink secondary href="/how-it-works">{t("howMore")}</ButtonLink></div>
   <div className="v1-steps">{[[t("step1"),t("step1Desc")],[t("step2"),t("step2Desc")],[t("step3"),t("step3Desc")],[t("step4"),t("step4Desc")]].map(([h,p],i)=><Kicker key={h} number={"0"+(i+1)} title={h} description={p}/>)}</div>
  </section>
  <section className="v1-section v1-governance-band"><div className="v1-wrap"><Eyebrow>{t("cityKicker")}</Eyebrow><h2>{t("cityTitle")}</h2><p className="v1-section-sub">{t("cityIntro")}</p>
   <div className="v1-role-cards">{[[t("mayor"),t("mayorShort"),"01"],[t("commish"),t("commishShort"),"02"],[t("agency"),t("agencyShort"),"03"]].map(([h,p,n])=><div className="v1-role-card" key={n}><span>{n}</span><h3>{h}</h3><p>{p}</p></div>)}</div>
   <ButtonLink secondary href="/know-your-city">{t("cityAction")}</ButtonLink>
  </div></section>
  <section className="v1-wrap v1-section v1-trust-grid">
   <div className="v1-trust-icon"><Icon name="lock" size={34}/></div><div><Eyebrow>{t("trustKicker")}</Eyebrow><h2>{t("trustTitle")}</h2><p>{t("trustDesc")}</p><a className="v1-text-link" href="/how-it-works#questions">{t("trustLink")} <Icon name="arrow" size={16}/></a></div>
  </section>
  <section className="v1-wrap v1-final"><div><h2>{t("finalTitle")}</h2><p>{t("finalDesc")}</p></div><ButtonLink href="/help">{t("heroStart")}</ButtonLink></section>
 </>;
}
function DraftHelp({t,lang}){
 const [form,setForm]=useState(initialForm);const [step,setStep]=useState(0);const [draft,setDraft]=useState("");const [error,setError]=useState("");const [feedback,setFeedback]=useState("");const [ref,setRef]=useState("");const [filedDate,setFiledDate]=useState("");
 const change=(key,v)=>{setForm(f=>({...f,[key]:v}));setError("");setFeedback("");};
 const isAhmedabad=form.city.trim().toLowerCase()==="ahmedabad" || form.city.trim()==="અમદાવાદ" || form.city.trim()==="अहमदाबाद";
 const address=[form.landmark,form.area,form.city].filter(Boolean).join(", ");
 const initialDraft=()=>{
  const lines=[t("questionIssue")+": "+t(topicKey[form.issue]),t("describe")+": "+form.description,t("locationCity")+": "+form.city,t("area")+": "+form.area,form.landmark?t("landmark")+": "+form.landmark:null,form.digipin?t("digipin")+": "+form.digipin:null,t("ownership")+": "+t(form.ownership)];
  if(lang==="gu")return "વિષય: સ્થાનિક નાગરિક સમસ્યા\n\nમાનનીય અધિકારી,\n\nકૃપા કરીને નીચેની સમસ્યાની તપાસ કરી જરૂરી કાર્યવાહી કરવા વિનંતી.\n\n"+lines.filter(Boolean).join("\n")+"\n\nકૃપા કરીને ફરિયાદનો સત્તાવાર નંબર અને સ્થિતિ જણાવશો.\nઆભાર.";
  if(lang==="mr")return "विषय: स्थानिक नागरी समस्येबाबत तक्रार\n\nआदरणीय अधिकारी,\n\nकृपया पुढील समस्येची पाहणी करून आवश्यक कार्यवाही करावी.\n\n"+lines.filter(Boolean).join("\n")+"\n\nकृपया अधिकृत तक्रार क्रमांक आणि स्थिती कळवावी.\nधन्यवाद.";
  return "Subject: Request for civic service attention\n\nDear Sir/Madam,\n\nI would like to report the following civic issue and request inspection and necessary action.\n\n"+lines.filter(Boolean).join("\n")+"\n\nPlease share an official complaint acknowledgement and status updates where applicable.\n\nThank you.";
 };
 const advance=()=>{
  if(step===0){if(form.description.trim().length<12){setError(t("valIssue"));return;}setStep(1);}
  else if(step===1){
   if(!form.city.trim()){setError(t("valCity"));return;}
   if(!form.area.trim()&&!form.digipin.trim()){setError(t("valArea"));return;}
   if(form.digipin.trim()&&!VALID_PIN.test(form.digipin.trim().toUpperCase().replace(/-/g,""))){setError(t("valDigipin"));return;}
   setDraft(initialDraft());setStep(2);
  }
  setError("");window.scrollTo({top:0,behavior:"smooth"});
 };
 const copy=async()=>{try{await navigator.clipboard.writeText(draft);setFeedback(t("copied"));}catch{setFeedback(t("copyFailed"));}};
 const save=()=>{
  if(filedDate&&futureDate(filedDate)){setError(t("valDate"));return;}
  const item={id:String(Date.now())+"-"+Math.random().toString(36).slice(2,7),created:todayLocal(),description:form.description,category:t(topicKey[form.issue]),address,city:form.city,draft,reference:ref.trim().slice(0,120),filedDate:filedDate||""};
  try{localStorage.setItem(STORAGE_NOTES,JSON.stringify([item,...getNotes()].slice(0,40)));setFeedback(t("saved"));setError("");}catch{setFeedback(t("notSaved"));}
 };
 const steps=[t("helpStepA"),t("helpStepB"),t("helpStepC")];
 return <section className="v1-wrap v1-help-page">
  <Eyebrow>{t("pageHelpKicker")}</Eyebrow><h1>{t("pageHelpTitle")}</h1><p className="v1-page-lead">{t("pageHelpIntro")}</p>
  <div className="v1-help-banner"><Icon name="info" size={19}/><span>{t("helpStatus")}</span></div>
  <div className="v1-wizard-shell"><div className="v1-wizard-sidebar"><p>MYCITYPULSE / GUIDE</p><ol>{steps.map((label,i)=><li key={label} className={i===step?"current":i<step?"done":""}><span>{i<step?<Icon name="check" size={16}/>:String(i+1).padStart(2,"0")}</span><b>{label}</b></li>)}</ol><p className="v1-sidebar-fine"><Icon name="lock" size={17}/>{t("betaNone")}</p></div>
   <div className="v1-wizard-content">
    {step===0&&<div className="v1-panel">
      <h2>{t("questionIssue")}</h2>
      <div className="v1-topics" role="group" aria-label={t("questionIssue")}>{ISSUE_TYPES.map(item=><button type="button" className={"v1-topic "+(form.issue===item.id?"selected":"")} aria-pressed={form.issue===item.id} key={item.id} onClick={()=>change("issue",item.id)}><span>{item.symbol}</span>{t(topicKey[item.id])}</button>)}</div>
      <label htmlFor="v1-description" className="v1-field-title">{t("describe")} <span>*</span></label>
      <textarea id="v1-description" value={form.description} rows={5} maxLength={1800} placeholder={t("describeHint")} onChange={e=>change("description",e.target.value)} />
      <p className="v1-field-help">{t("describeTips")}</p>
    </div>}
    {step===1&&<div className="v1-panel">
      <h2>{t("helpStepB")}</h2><div className="v1-fields">
       <div><label className="v1-field-title" htmlFor="v1-city">{t("locationCity")} *</label><input id="v1-city" list="v1-city-suggestions" value={form.city} maxLength={100} onChange={e=>change("city",e.target.value)}/><datalist id="v1-city-suggestions">{["Ahmedabad","Thane","Mira-Bhayandar","Guwahati","Gandhinagar","Vadodara","Surat"].map(s=><option value={s} key={s}/>)}</datalist></div>
       <div><label className="v1-field-title" htmlFor="v1-area">{t("area")} *</label><input id="v1-area" value={form.area} maxLength={120} placeholder={t("areaPlaceholder")} onChange={e=>change("area",e.target.value)}/></div>
       <div><label className="v1-field-title" htmlFor="v1-landmark">{t("landmark")}</label><input id="v1-landmark" value={form.landmark} maxLength={150} placeholder={t("landmarkPlaceholder")} onChange={e=>change("landmark",e.target.value)}/></div>
       <div><label className="v1-field-title" htmlFor="v1-digipin">{t("digipin")}</label><input id="v1-digipin" value={form.digipin} maxLength={10} spellCheck="false" autoComplete="off" placeholder="3JK7… (10 characters)" onChange={e=>change("digipin",e.target.value.toUpperCase().replace(/[^23456789CFJKLMPT]/g,"").slice(0,10))}/><p className="v1-field-help">{t("digipinHint")} <a href={SOURCES.digipin} target="_blank" rel="noreferrer">{t("findDigipin")} ↗</a></p></div>
      </div>
      <span className="v1-field-title" id="v1-ownership">{t("ownership")}</span><div className="v1-segment" role="group" aria-labelledby="v1-ownership">{["public","private","unsure"].map(v=><button type="button" aria-pressed={form.ownership===v} className={form.ownership===v?"active":""} onClick={()=>change("ownership",v)} key={v}>{t(v)}</button>)}</div>
      <p className="v1-field-help">{t("privacyTip")}</p>
    </div>}
    {step===2&&<div className="v1-panel">
      <h2>{t("review")}</h2>
      <div className="v1-review-info"><div><small>{t("questionIssue")}</small><strong>{t(topicKey[form.issue])}</strong></div><div><small>{t("area")}</small><strong>{address||form.digipin}</strong></div></div>
      <label className="v1-field-title" htmlFor="v1-draft">{t("draftLabel")}</label><textarea id="v1-draft" className="v1-draft" value={draft} rows={13} onChange={e=>{setDraft(e.target.value);setFeedback("");}}/>
      <div className="v1-result-actions"><button className="v1-btn v1-btn-dark" onClick={copy} type="button"><Icon name="copy" size={18}/>{t("copy")}</button><button className="v1-btn v1-btn-outline" type="button" onClick={()=>setStep(0)}>{t("edit")}</button></div>
      <div className="v1-route-box"><Eyebrow>{t("routingTitle")}</Eyebrow><h3>{isAhmedabad?t("routedTitle"):t("routingUnknown")}</h3><p>{isAhmedabad?t("routedDesc"):t("routingUnknownDesc")}</p>
       {isAhmedabad&&<div className="v1-route-links"><a href={SOURCES.amcPortal} target="_blank" rel="noreferrer">{t("openAMC")} ↗</a><a href={SOURCES.amcTrack} target="_blank" rel="noreferrer">{t("trackAMC")} ↗</a></div>}
       <small>{t("noteNotFiled")} {isAhmedabad?t("tip"):""}</small>
      </div>
      <div className="v1-reference"><h3>{t("save")}</h3><p>{t("saveExpl")}</p><div className="v1-fields">
       <div><label className="v1-field-title" htmlFor="v1-ref">{t("reference")}</label><input id="v1-ref" maxLength={120} value={ref} onChange={e=>setRef(e.target.value)}/></div>
       <div><label className="v1-field-title" htmlFor="v1-filed">{t("filedDate")}</label><input id="v1-filed" type="date" max={todayLocal()} value={filedDate} onChange={e=>{setFiledDate(e.target.value);setError("");}}/></div>
      </div>
      {filedDate&&!futureDate(filedDate)&&<p className="v1-reminder"><strong>{t("sevenDays")}: {addWeekdays(filedDate)}</strong><br/>{t("sevenDaysDesc")}</p>}
      <button className="v1-btn v1-btn-outline" type="button" onClick={save}>{t("save")}</button>
      </div>
      <div className="v1-review-bottom"><a href="/saved">{t("navSaved")} ↗</a><a href="/help">{t("reopen")} ↗</a></div>
    </div>}
    {error&&<p className="v1-error" role="alert">{error}</p>}{feedback&&<p className="v1-success" role="status">{feedback}</p>}
    {step!==2&&<div className="v1-panel-buttons">{step>0&&<button className="v1-btn v1-btn-outline" onClick={()=>{setStep(0);setError("");}} type="button">{t("back")}</button>}<button className="v1-btn v1-btn-dark" type="button" onClick={advance}>{t("next")} <Icon name="arrow" size={17}/></button></div>}
   </div>
  </div>
  <div className="v1-help-footnote"><Icon name="info" size={20}/><span>{t("cityNotSupported")}</span></div>
 </section>;
}

function How({t}){
 const steps=[[t("step1"),t("howDetail1")],[t("step2"),t("howDetail2")],[t("step3"),t("howDetail3")],[t("step4"),t("howDetail4")]];
 const statuses=[[t("statusFirst"),t("statusFirstDesc")],[t("statusSecond"),t("statusSecondDesc")],[t("statusThird"),t("statusThirdDesc")]];
 const faqs=Array.from({length:6},(_,i)=>[t("faq"+(i+1)),t("faq"+(i+1)+"Answer")]);
 return <>
  <section className="v1-wrap v1-pagehero"><Eyebrow>{t("howKicker")}</Eyebrow><h1>{t("howPageTitle")}</h1><p className="v1-page-lead">{t("howPageIntro")}</p><ButtonLink href="/help">{t("heroStart")}</ButtonLink></section>
  <section className="v1-bg-paper v1-section"><div className="v1-wrap v1-how-detailed">{steps.map(([title,desc],i)=><div className="v1-detail-step" key={title}><span>{"0"+(i+1)}</span><div><h2>{title}</h2><p>{desc}</p></div></div>)}</div></section>
  <section className="v1-wrap v1-section"><Eyebrow>{t("trustKicker")}</Eyebrow><h2>{t("statusTitle")}</h2><div className="v1-statuses">{statuses.map(([title,desc],i)=><div key={title} className="v1-status"><span>{i===0?"✎":i===1?"↗":"✓"}</span><h3>{title}</h3><p>{desc}</p></div>)}</div></section>
  <section className="v1-bg-paper v1-section" id="questions"><div className="v1-wrap v1-faq-wrap"><Eyebrow>{t("trustKicker")}</Eyebrow><h2>{t("faqTitle")}</h2>{faqs.map(([q,a],i)=><details key={q} open={i===0}><summary>{q}</summary><p>{a}</p></details>)}<p className="v1-faq-small"><a href="mailto:hello@mycitypulse.in?subject=MyCityPulse%20language%20request">{t("moreLanguage")} ↗</a></p></div></section>
 </>;
}

function Know({t}){
 const roles=[[t("cityMayorTitle"),t("cityMayorDesc")],[t("cityCommishTitle"),t("cityCommishDesc")],[t("cityWardTitle"),t("cityWardDesc")],[t("cityAgencyTitle"),t("cityAgencyDesc")]];
 return <>
  <section className="v1-wrap v1-pagehero"><Eyebrow>{t("cityKicker")}</Eyebrow><h1>{t("cityPageTitle")}</h1><p className="v1-page-lead">{t("cityPageIntro")}</p><ButtonLink href="/help">{t("heroStart")}</ButtonLink></section>
  <section className="v1-bg-paper v1-section"><div className="v1-wrap"><Eyebrow>{t("cityPageFocus")}</Eyebrow><h2>{t("cityGovernanceTitle")}</h2><p className="v1-section-sub">{t("cityPageFocusBody")}</p><div className="v1-governance-grid">{roles.map(([h,p],i)=><article className="v1-gov-card" key={h}><span>0{i+1}</span><h3>{h}</h3><p>{p}</p></article>)}</div></div></section>
  <section className="v1-wrap v1-section v1-two-notes"><div><Eyebrow>THE CONSTITUTION</Eyebrow><h2>{t("ruleTitle")}</h2><p>{t("ruleText")}</p><a href={SOURCES.constitutional} className="v1-text-link" target="_blank" rel="noreferrer">{t("ruleRead")} <Icon name="arrow" size={16}/></a></div><div><Eyebrow>FURTHER READING</Eyebrow><h2>{t("nagrikaTitle")}</h2><p>{t("nagrikaDesc")}</p><a href={SOURCES.nagrika} className="v1-text-link" target="_blank" rel="noreferrer">{t("nagrikaLink")} <Icon name="arrow" size={16}/></a></div></section>
  <section className="v1-section v1-bg-paper"><div className="v1-wrap"><Eyebrow>{t("cityListTitle")}</Eyebrow><h2>{t("cityListCopy")}</h2><p className="v1-section-sub">{t("cityPageFocusBody")}</p><div className="v1-verified"><Icon name="check" size={18}/><span>{t("sourceVerified")} <a href={SOURCES.amcAnnouncement} target="_blank" rel="noreferrer">AMC CCRS 2.0 ↗</a></span></div></div></section>
  <section className="v1-wrap v1-final"><div><h2>{t("cityCallout")}</h2><p>{t("cityCalloutDesc")}</p></div><ButtonLink href="/help">{t("heroStart")}</ButtonLink></section>
 </>;
}

function Saved({t}){
 const [notes,setNotes]=useState(getNotes);const [error,setError]=useState("");
 const remove=(id)=>{const next=notes.filter(x=>x.id!==id);try{localStorage.setItem(STORAGE_NOTES,JSON.stringify(next));setNotes(next);}catch{setError(t("errorBrowser"));}};
 return <section className="v1-wrap v1-pagehero v1-saved-page"><Eyebrow>PERSONAL NOTES</Eyebrow><h1>{t("savedTitle")}</h1><p className="v1-page-lead">{t("savedIntro")}</p>{error&&<p className="v1-error">{error}</p>}
 {notes.length===0?<div className="v1-empty"><Icon name="book" size={35}/><p>{t("savedEmpty")}</p><ButtonLink href="/help">{t("heroStart")}</ButtonLink></div>:<div className="v1-saved-list">{notes.map(n=><article key={n.id} className="v1-saved-item"><div className="v1-saved-heading"><div><span className="v1-eyebrow">{n.category} · {t("savedAt")} {n.created}</span><h2>{n.address||n.city}</h2></div><button onClick={()=>remove(n.id)} aria-label={t("delete")} className="v1-delete">{t("delete")} ×</button></div><p>{n.description}</p><div className="v1-saved-status"><span>{n.reference?t("statusFiled"):t("statusDraft")}</span>{n.reference&&<span>{t("number")}: {n.reference}</span>}{n.filedDate&&<span>{t("until")}: {n.filedDate}</span>}</div><details><summary>{t("draftLabel")}</summary><pre>{n.draft}</pre></details></article>)}</div>}
 </section>;
}

export default function App(){
 const [lang,setLangState]=useState(()=>{try{const id=localStorage.getItem(STORAGE_LANG);return ["gu","mr"].includes(id)?id:"en";}catch{return "en";}});
 const setLang=(id)=>{setLangState(id);try{localStorage.setItem(STORAGE_LANG,id);}catch{/* browser restrictions */}};
 const pathname=(typeof window!=="undefined"?window.location.pathname:"/").replace(/\/+$/,"")||"/";
 const titles={"/":"MyCityPulse | Civic help for your city","/help":"Get civic help | MyCityPulse","/how-it-works":"How it works | MyCityPulse","/know-your-city":"Know your city | MyCityPulse","/saved":"Saved notes | MyCityPulse"};
 useEffect(()=>{document.title=titles[pathname]||"MyCityPulse";document.documentElement.lang=lang;window.scrollTo(0,0);},[pathname,lang]);
 const t=useMemo(()=>k=>translate(lang,k),[lang]);
 const current=pathname==="/help"?"help":pathname==="/how-it-works"?"how":pathname==="/know-your-city"?"city":"home";
 let page;
 switch(pathname){
  case "/":page=<Home t={t}/>;break;
  case "/help":page=<DraftHelp t={t} lang={lang}/>;break;
  case "/how-it-works":page=<How t={t}/>;break;
  case "/know-your-city":page=<Know t={t}/>;break;
  case "/saved":page=<Saved t={t}/>;break;
  default:page=<section className="v1-wrap v1-pagehero"><h1>{t("errorTitle")}</h1><p>{t("errorText")}</p><ButtonLink href="/">{t("navHome")}</ButtonLink></section>;
 }
 return <Shell lang={lang} setLang={setLang} t={t} current={current}>{page}</Shell>;
}