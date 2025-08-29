/* =========================================================================
   Malla QF refinada: resumen global, chips en fila, buscador de prerrequisitos,
   editor de créditos inline, banner agregar compacto, alias y créditos cargados.
   ========================================================================= */

const LSK = "malla_qf_estado_v7";

/* ---------- Alias de nombres (viejo -> nuevo) ---------- */
const NAME_ALIASES = new Map([
  ["Matemática 01", "Matemática 1"],
  ["Matemática 02", "Matemática 2"],
  ["Física 003L", "Física 003 (Lab)"],
  ["Física 003L (Lab. de Física)", "Física 003 (Lab)"],
  ["Química Orgánica 103 L", "Química Orgánica 103 (Lab)"],
  ["Química Orgánica 103 (Lab)", "Química Orgánica 103 (Lab)"],
  ["Química Inorgánica T", "Química Inorgánica (Teó)"],
  ["Química Inorgánica (Teórico)", "Química Inorgánica (Teó)"],
  ["Química Inorgánica P", "Química Inorgánica (Lab)"],
  ["Química Inorgánica (Laboratorio)", "Química Inorgánica (Lab)"],
  ["Control de Calidad de los Medicamentos", "Control de Calidad de Medicamentos"],
  ["Introducción a las Ciencias Biológicas 1", "Introducción a las Cs. Biológicas 1"],
  ["Introducción a las Ciencias Biológicas II", "Introducción a las Cs. Biológicas 2"],
  ["Química Farmacéutica 101", "Química Farmacéutica 101 (Teó)"],
  ["Química Farmacéutica 102", "Química Farmacéutica 102 (Lab)"],
]);

/* ---------- Utils ---------- */
const slug = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const el = (tag, cls, text)=>{ const n=document.createElement(tag); if(cls)n.className=cls; if(text!=null)n.textContent=text; return n; };
const normalizeName = (name)=> NAME_ALIASES.get(name) || name;

/* ---------- Plan base (obligatorias) con CRÉDITOS PRECARGADOS ---------- */
const PLAN = [
  { titulo: "1° Semestre", oblig: [
    { name: "Matemática 1", cr: 14, req: [] },
    { name: "Química General 1", cr: 7, req: [] },
    { name: "Introducción a las Cs. Biológicas 1", cr: 5, req: [] },
    { name: "Prevención de Riesgos en el Laboratorio", cr: 4, req: [] },
  ]},
  { titulo: "2° Semestre", oblig: [
    { name: "Matemática 2", cr: 10, req: ["Matemática 1"] },
    { name: "Química General 2", cr: 8, req: ["Química General 1", "Prevención de Riesgos en el Laboratorio"] },
    { name: "Física 101", cr: 7, req: ["Matemática 1"] },
    { name: "Introducción a las Cs. Biológicas 2", cr: 5, req: ["Introducción a las Cs. Biológicas 1", "Prevención de Riesgos en el Laboratorio"] },
  ]},

  { titulo: "3° Semestre", oblig: [
    { name: "Química Orgánica 101", cr: 11, req: ["Química General 2"] },
    { name: "Química Analítica 1", cr: 10, req: ["Química General 2"] },
    { name: "Química Inorgánica (Teó)", cr: 6, req: ["Química General 2"] },
    { name: "Química Inorgánica (Lab)", cr: 5, req: ["Química General 2"] },
    { name: "Física 102", cr: 7, req: ["Física 101"] },
    { name: "Fisiología", cr: 7, req: ["Introducción a las Cs. Biológicas 2"] },
  ]},
  { titulo: "4° Semestre", oblig: [
    { name: "Química Orgánica 102", cr: 6, req: ["Química Orgánica 101"] },
    { name: "Química Analítica 2", cr: 7, req: ["Química Analítica 1"] },
    { name: "Fisicoquímica 102", cr: 13, req: ["Matemática 2", "Química Analítica 1"] },
    { name: "Física 003 (Lab)", cr: 4, req: ["Física 102"] },
    { name: "Fisiopatología", cr: 7, req: ["Fisiología"] },
    { name: "Introducción al medicamento", cr: 1, req: [] },
  ]},

  { titulo: "5° Semestre", oblig: [
    { name: "Química Orgánica 103 (Lab)", cr: 5, req: ["Química Orgánica 101", "Química Analítica 1"] },
    { name: "Química Orgánica 104", cr: 3, req: ["Química Orgánica 102"] },
    { name: "Química Analítica 3", cr: 10, req: ["Química Analítica 2"] },
    { name: "Fisicoquímica 103", cr: 12, req: ["Fisicoquímica 102"] },
    { name: "Bioquímica", cr: 15, req: ["Introducción a las Cs. Biológicas 1", "Química Orgánica 102", "Química Analítica 2", "Fisicoquímica 102"] },
  ]},
  { titulo: "6° Semestre", oblig: [
    { name: "Farmacognosia", cr: 9, req: ["Química Orgánica 103 (Lab)", "Química Orgánica 104", "Química Analítica 3"] },
    { name: "Botánica", cr: 4, req: ["Introducción a las Cs. Biológicas 2", "Química Orgánica 103 (Lab)", "Química Orgánica 104"] },
    { name: "Microbiología General", cr: 12, req: ["Introducción a las Cs. Biológicas 2", "Bioquímica"] },
    { name: "Inmunología 1", cr: 3, req: ["Introducción a las Cs. Biológicas 2", "Bioquímica"] },
    { name: "Farmacocinética y Biofarmacia", cr: 7, req: ["Matemática 2", "Fisiología"] },
    { name: "Introducción a los sistemas de gestión", cr: 4, req: [] },
    { name: "Taller de Integración Cs. Biol. y Biomédicas", cr: 2, req: ["Fisiología"] },
  ]},

  { titulo: "7° Semestre", oblig: [
    { name: "Química Farmacéutica 101 (Teó)", cr: 8, req: ["Química Orgánica 103 (Lab)", "Química Orgánica 104", "Química Analítica 3", "Fisicoquímica 103", "Bioquímica", "Farmacognosia"] },
    { name: "Química Farmacéutica 102 (Lab)", cr: 5, req: ["Química Orgánica 103 (Lab)", "Química Orgánica 104", "Química Analítica 3", "Fisicoquímica 103", "Bioquímica", "Farmacognosia"] },
    { name: "Farmacotecnia 1", cr: 8, req: ["Química Inorgánica (Teó)","Química Inorgánica (Lab)","Fisicoquímica 102","Introducción al medicamento","Farmacognosia","Botánica","Microbiología General","Farmacocinética y Biofarmacia","Química Analítica 3"] },
    { name: "Farmacología", cr: 8, req: ["Fisiología", "Bioquímica", "Química Orgánica 103 (Lab)", "Química Orgánica 104", "Taller de Integración Cs. Biol. y Biomédicas"] },
    { name: "Inmunología 2", cr: 5, req: ["Inmunología 1"] },
    { name: "Bromatología y Nutrición", cr: 4, req: ["Bioquímica", "Microbiología General"] },
  ]},
  { titulo: "8° Semestre", oblig: [
    { name: "Farmacoterapia", cr: 7, req: ["Fisiopatología", "Farmacocinética y Biofarmacia", "Farmacología"] },
    { name: "Farmacotecnia 2", cr: 8, req: ["Farmacotecnia 1"] },
    { name: "Control de Calidad de Medicamentos", cr: 8, req: ["Microbiología General", "Química Farmacéutica 101 (Teó)", "Química Farmacéutica 102 (Lab)", "Farmacotecnia 1"] },
    { name: "Toxicología Fundamental", cr: 4, req: ["Química Analítica 3", "Bioquímica"] },
  ]},

  { titulo: "9° Semestre", oblig: [
    { name: "Legislación y Deontología", cr: 6, req: ["Farmacoterapia", "Farmacotecnia 2"] },
    { name: "Gestión de Empresas", cr: 4, req: [] },
  ]},
  { titulo: "10° Semestre", oblig: [
    { name: "Internado / Practicantado / Proyecto", cr: 50, req: ["Legislación y Deontología", "Gestión de Empresas"] },
  ]},
];

/* ---------- DOM ---------- */
const mallaDiv = document.getElementById("malla");
const viewport = document.getElementById("viewport");
const tooltip = document.getElementById("tooltip");
const creditsText = document.getElementById("credits-text");
const progressFill = document.querySelector("#progress .fill");
const searchInput = document.getElementById("search-input");
const searchInfo = document.getElementById("search-info");
const filterSelect = document.getElementById("filter-state");
const avanceGrid = document.getElementById("avance-grid");
const notesModal = document.getElementById("notes-modal");
const notesTitle = document.getElementById("notes-title");
const notesText = document.getElementById("notes-text");
const notesSave = document.getElementById("notes-save");
const notesCancel = document.getElementById("notes-cancel");
const addModal = document.getElementById("add-modal");
const addType = document.getElementById("add-type");
const addName = document.getElementById("add-name");
const addCredits = document.getElementById("add-credits");
const addReqs = document.getElementById("add-reqs");
const addReqSearch = document.getElementById("add-req-search");
const addSave = document.getElementById("add-save");
const addCancel = document.getElementById("add-cancel");

/* ---------- Estructuras ---------- */
const COURSES = new Map();
const NAME_TO_ID = new Map();
const FWD = new Map();
const REV = new Map();
const SEM_CREDITS = [];
const SEM_NODES = [];
let notesCurrentId = null;
let currentCreditEditorFor = null;

/* ---------- Render ---------- */
function sectionContainer(title){
  const wrap = el("div","sem-section");
  const h = el("div","section-title",title);
  const list = el("div");
  wrap.append(h,list);
  return {wrap, list, h};
}

function buildModel(){
  PLAN.forEach((sem, idx) => {
    const semDiv = el("div",`semestre sem-${idx+1}`);
    SEM_NODES[idx] = semDiv;
    const h2 = el("h2",null,sem.titulo);
    const corner = el("div","sem-credits","0/50");
    semDiv.append(h2, corner);

    const secOb = sectionContainer("Obligatorias");
    const secOp = sectionContainer("Optativas"); secOp.wrap.style.display="none";
    const secEl = sectionContainer("Electivas"); secEl.wrap.style.display="none";

    const addBanner = el("div","add-banner");
    addBanner.innerHTML = `<strong>➕ Agregar asignatura</strong>`;
    addBanner.addEventListener("click", ()=> openAddModal(idx));

    semDiv.append(secOb.wrap, secOp.wrap, secEl.wrap, addBanner);
    sem._sec = {ob:secOb.list, op:secOp, el:secEl};

    sem.oblig.forEach(item => renderCourse(idx, item, "oblig"));

    mallaDiv.appendChild(semDiv);
  });

  // mapa de requisitos
  COURSES.forEach(c => {
    c.reqIds = (c.reqNames||[]).map(n => {
      const nn = normalizeName(n);
      return NAME_TO_ID.get(nn) || NAME_TO_ID.get(n) || slug(nn);
    });
    c.reqIds.forEach(rid => { FWD.get(rid)?.add(c.id); REV.get(c.id)?.add(rid); });
  });

  updateSemCounters();
}

function renderCourse(semIndex, item, kind){
  const visibleName = normalizeName(item.name);
  const id = slug(visibleName);

  if (!NAME_TO_ID.has(visibleName)) NAME_TO_ID.set(visibleName, id);
  if (item.name !== visibleName && !NAME_TO_ID.has(item.name)) NAME_TO_ID.set(item.name, id);

  if (!FWD.has(id)) FWD.set(id, new Set());
  if (!REV.has(id)) REV.set(id, new Set());

  const sem = PLAN[semIndex];
  const targetList = (kind==="oblig") ? sem._sec.ob : (kind==="opt" ? sem._sec.op.list : sem._sec.el.list);
  if (kind!=="oblig"){
    const sec = kind==="opt"? sem._sec.op : sem._sec.el;
    sec.wrap.style.display="";
  }

  const div = el("div","ramo");
  div.id = id; div.dataset.id = id; div.dataset.name = visibleName;

  // Título
  const title = el("div","ramo-title",visibleName);
  div.appendChild(title);

  // Meta row: credit chip + plan/notes buttons
  const meta = el("div","ramo-meta");
  const metaLeft = el("div","meta-left");
  const creditChip = el("div","credit-chip",`🧮 ${item.cr||0} cr.`);
  metaLeft.appendChild(creditChip);
  const metaRight = el("div","meta-right");
  const btnPlan = el("button","iconbtn plan-btn","⭐");
  const btnNote = el("button","iconbtn note-btn","📝");
  metaRight.append(btnPlan, btnNote);
  meta.append(metaLeft, metaRight);
  div.appendChild(meta);

  targetList.appendChild(div);

  const c = {
    id, name: visibleName, cr: item.cr||0,
    reqNames: (item.req||item.reqNames||[]).map(normalizeName),
    reqIds: [], el: div, approved:false, planned:false, note:"",
    semIndex, kind
  };
  COURSES.set(id, c);

  // Editor de créditos inline
  creditChip.addEventListener("click",(e)=>{
    e.stopPropagation();
    openCreditEditor(c);
  });

  div.addEventListener("click",(e)=>{
    if (e.target===btnPlan || e.target===btnNote) return;
    if (!div.classList.contains("desbloqueado")) return;
    c.approved = !c.approved;
    if (c.approved) c.planned = false;
    refreshLockStates();
    saveState();
  });

  btnPlan.addEventListener("click",(e)=>{
    e.stopPropagation();
    c.planned = !c.planned;
    if (c.planned) c.approved = false;
    refreshLockStates();
    saveState();
  });

  btnNote.addEventListener("click",(e)=>{
    e.stopPropagation();
    openNotesModal(c);
  });

  // Highlight + tooltip bloqueadas (0.5s)
  div.addEventListener("mouseenter", ()=> applyHighlight(c.id));
  div.addEventListener("mouseleave", ()=> clearHighlight());
  div.addEventListener("mouseenter",(e)=>{ if (div.classList.contains("bloqueado")) scheduleTooltip(c,e); });
  div.addEventListener("mousemove",(e)=>{ if (activeTooltipTarget===c.id) positionTooltipToEvent(e); });
  div.addEventListener("mouseleave", cancelTooltip);
  // touch long-press
  div.addEventListener("touchstart",(e)=>{
    if (!div.classList.contains("bloqueado")) return;
    e.preventDefault();
    touchTimer = setTimeout(()=>{
      const t=(e.touches&&e.touches[0])?e.touches[0]:null;
      const cx=t? t.clientX: div.getBoundingClientRect().left;
      const cy=t? t.clientY: div.getBoundingClientRect().top;
      showTooltipForCourse(c,cx,cy);
    },500);
  },{passive:false});
  div.addEventListener("touchmove", ()=> clearTimeout(touchTimer));
  div.addEventListener("touchend", ()=> { clearTimeout(touchTimer); hideTooltip(); });

  div.classList.add("bloqueado");
}

/* ---------- Editor inline de créditos ---------- */
function closeCreditEditor(){
  if (!currentCreditEditorFor) return;
  const c = currentCreditEditorFor;
  const ed = c.el.querySelector(".credit-editor");
  if (ed) ed.remove();
  currentCreditEditorFor = null;
}
function openCreditEditor(c){
  // cierra cualquiera abierto
  if (currentCreditEditorFor && currentCreditEditorFor.id !== c.id) closeCreditEditor();
  if (currentCreditEditorFor && currentCreditEditorFor.id === c.id){
    closeCreditEditor(); return;
  }
  const existing = c.el.querySelector(".credit-editor");
  if (existing) { existing.remove(); }

  const editor = el("div","credit-editor");
  const label = el("span",null,"Editar créditos:");
  const input = document.createElement("input");
  input.type = "number"; input.min = "0"; input.max = "50"; input.step = "1"; input.value = String(c.cr||0);
  const btnCancel = el("button","iconbtn","Cancelar");
  const btnSave = el("button","iconbtn","Guardar");

  btnCancel.addEventListener("click",(e)=>{ e.stopPropagation(); closeCreditEditor(); });
  btnSave.addEventListener("click",(e)=>{
    e.stopPropagation();
    const n = Math.max(0, Math.min(50, parseInt(input.value,10)||0));
    c.cr = n;
    const chip = c.el.querySelector(".credit-chip");
    if (chip) chip.textContent = `🧮 ${n} cr.`;
    updateCreditsUI();
    saveState();
    closeCreditEditor();
  });

  editor.append(label, input, btnSave, btnCancel);
  c.el.appendChild(editor);
  currentCreditEditorFor = c;
}

/* ---------- Agregar Optativa/Electiva ---------- */
let addTargetSem = null;
function openAddModal(semIndex){
  addTargetSem = semIndex;
  addType.value = "optativa";
  addName.value = "";
  addCredits.value = "0";
  renderReqsSelector();
  addModal.showModal();

  // Enfocar buscador de prerrequisitos al abrir
  setTimeout(()=> addReqSearch?.focus(), 50);
}
function renderReqsSelector(){
  // Render completo
  addReqs.innerHTML = "";
  const list = Array.from(COURSES.values()).sort((a,b)=> a.name.localeCompare(b.name));
  list.forEach(c=>{
    const id = `req-${c.id}`;
    const w = el("label");
    const cb = el("input"); cb.type="checkbox"; cb.value=c.id; cb.id=id;
    const span = el("span",null,c.name);
    w.append(cb, span);
    addReqs.appendChild(w);
  });
  // Filtro por texto
  if (addReqSearch){
    addReqSearch.value = "";
    addReqSearch.oninput = ()=>{
      const q = addReqSearch.value.trim().toLowerCase();
      Array.from(addReqs.querySelectorAll("label")).forEach(lab=>{
        const txt = lab.textContent.toLowerCase();
        lab.style.display = (!q || txt.includes(q)) ? "" : "none";
      });
    };
  }
}
addSave.addEventListener("click",(e)=>{
  e.preventDefault();
  if (addTargetSem==null) return;
  const kind = addType.value==="electiva" ? "elec" : "opt";
  const name = normalizeName(addName.value.trim());
  const cr = Math.max(0, Math.min(50, parseInt(addCredits.value,10)||0));
  if (!name){ addName.focus(); return; }

  const reqSel = Array.from(addReqs.querySelectorAll("input[type=checkbox]:checked")).map(c=> c.value);
  const reqNames = reqSel.map(id=> COURSES.get(id)?.name || id);
  const item = { name, cr, req: reqNames };
  renderCourse(addTargetSem, item, kind);

  const id = slug(name);
  const c = COURSES.get(id);
  c.reqIds = reqSel.slice();
  c.reqNames = reqNames.slice();
  c.reqIds.forEach(rid => { FWD.get(rid)?.add(c.id); REV.get(c.id)?.add(rid); });

  refreshLockStates();
  saveState();
  addModal.close();
});
addCancel.addEventListener("click",(e)=>{ e.preventDefault(); addModal.close(); });

/* ---------- Estados / dependencias ---------- */
function unmetReqs(c){ return c.reqIds.filter(rid => !COURSES.get(rid)?.approved); }
function refreshLockStates(){
  closeCreditEditor();
  COURSES.forEach(c=>{
    const elv = c.el;
    const unmet = unmetReqs(c);
    const unlocked = (c.reqIds.length===0 || unmet.length===0);
    elv.classList.toggle("desbloqueado", unlocked);
    elv.classList.toggle("bloqueado", !unlocked);
    elv.classList.toggle("aprobado", !!c.approved);
    elv.classList.toggle("planeada", !!c.planned);
    elv.tabIndex = unlocked ? 0 : -1;
    elv.setAttribute("aria-disabled", unlocked ? "false" : "true");
  });
  applyFilter();
  updateCreditsUI();
  renderResumenGlobal();
}

/* ---------- Créditos ---------- */
function sumApprovedCredits(){ let sum = 0; COURSES.forEach(c => { if (c.approved) sum += (c.cr||0); }); return sum; }
function updateCreditsUI(){
  const ap = sumApprovedCredits();
  creditsText.textContent = `${ap} / 420`;
  const pct = Math.max(0, Math.min(100, Math.round((ap/420)*100)));
  progressFill.style.width = `${pct}%`;

  // Por semestre: planeados/50
  SEM_CREDITS.length = PLAN.length;
  for (let i=0;i<PLAN.length;i++){ SEM_CREDITS[i] = 0; }
  COURSES.forEach(c=>{ if (c.planned) SEM_CREDITS[c.semIndex] += (c.cr||0); });
  PLAN.forEach((sem, i)=>{
    const badge = SEM_NODES[i].querySelector(".sem-credits");
    badge.textContent = `${SEM_CREDITS[i]} / 50`;
  });
}

/* ---------- Resumen Global (reemplaza el panel detallado) ---------- */
function renderResumenGlobal(){
  let total=0, aprob=0, desblo=0, bloq=0, plan=0, capr=0, cplan=0;
  COURSES.forEach(c=>{
    total++;
    const blocked = !(c.reqIds.length===0 || unmetReqs(c).length===0);
    if (c.approved){ aprob++; capr += (c.cr||0); }
    else if (blocked){ bloq++; }
    else { desblo++; }
    if (c.planned){ plan++; cplan += (c.cr||0); }
  });
  const html = `
    <div class="card-metric">
      <div class="title">Global</div>
      <div class="nums">
        <span class="badge">Asignaturas: ${total}</span>
        <span class="badge">Aprobadas: ${aprob}</span>
        <span class="badge">Desbloqueadas: ${desblo}</span>
        <span class="badge">Bloqueadas: ${bloq}</span>
        <span class="badge">Planeadas: ${plan}</span>
        <span class="badge">Créd. aprobados: ${capr}</span>
        <span class="badge">Créd. planeados: ${cplan}</span>
      </div>
    </div>`;
  avanceGrid.innerHTML = html;
}

/* ---------- Filtro ---------- */
function applyFilter(){
  const v = filterSelect.value;
  COURSES.forEach(c=>{
    const blocked = !(c.reqIds.length===0 || unmetReqs(c).length===0);
    const unlocked = !blocked && !c.approved;
    const isApproved = !!c.approved;
    const isPlanned = !!c.planned;
    let show = true;
    if (v==="unlocked") show = unlocked;
    else if (v==="blocked") show = blocked;
    else if (v==="approved") show = isApproved;
    else if (v==="planned") show = isPlanned;
    c.el.style.display = show ? "" : "none";
  });
}

/* ---------- Notas ---------- */
function openNotesModal(course){
  notesCurrentId = course.id;
  notesTitle.textContent = `Notas — ${course.name}`;
  notesText.value = course.note || "";
  notesModal.showModal();
}
notesSave.addEventListener("click",(e)=>{
  e.preventDefault();
  if (!notesCurrentId) return;
  const c = COURSES.get(notesCurrentId);
  c.note = notesText.value.trim();
  c.el.dataset.hasNote = c.note ? "1" : "";
  saveState(); notesModal.close();
});
notesCancel.addEventListener("click",(e)=>{ e.preventDefault(); notesModal.close(); });

/* ---------- Tooltip (0.5s) ---------- */
let hoverTimer = null, touchTimer = null, activeTooltipTarget = null;
function scheduleTooltip(c, evt){
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(()=> showTooltipForCourse(c, evt.clientX, evt.clientY), 500);
}
function positionTooltipToEvent(evt){ positionTooltip(evt.clientX, evt.clientY); }
function positionTooltip(clientX, clientY){
  const rb = viewport.getBoundingClientRect();
  tooltip.style.left = (clientX - rb.left + viewport.scrollLeft + 12) + "px";
  tooltip.style.top  = (clientY - rb.top  + viewport.scrollTop  + 12) + "px";
}
function showTooltipForCourse(c, clientX, clientY){
  activeTooltipTarget = c.id;
  const list = c.reqNames?.length
    ? `<div>Requisitos:</div><ul style="margin:6px 0 0 18px; padding:0">${c.reqNames.map(r=>`<li>${normalizeName(r)}</li>`).join("")}</ul>`
    : `<em>Sin requisitos</em>`;
  tooltip.innerHTML = `<strong>${c.name}</strong><div style="margin-top:6px">${list}</div>`;
  tooltip.hidden = false;
  positionTooltip(clientX, clientY);
  requestAnimationFrame(()=> tooltip.classList.add("show"));
}
function hideTooltip(){
  tooltip.classList.remove("show");
  activeTooltipTarget = null;
  setTimeout(()=>{ if(!activeTooltipTarget) tooltip.hidden = true; }, 180);
}
function cancelTooltip(){ clearTimeout(hoverTimer); if (activeTooltipTarget) hideTooltip(); }

/* ---------- Resaltado dependencias ---------- */
function ancestorsOf(id){ const vis=new Set(), q=[id]; while(q.length){ const cur=q.pop(); (REV.get(cur)||[]).forEach(p=>{ if(!vis.has(p)){ vis.add(p); q.push(p);} }); } return vis; }
function descendantsOf(id){ const vis=new Set(), q=[id]; while(q.length){ const cur=q.pop(); (FWD.get(cur)||[]).forEach(n=>{ if(!vis.has(n)){ vis.add(n); q.push(n);} }); } return vis; }
function applyHighlight(centerId){
  document.body.classList.add("dim");
  const A = ancestorsOf(centerId), D = descendantsOf(centerId);
  const nodesHi = new Set([centerId, ...A, ...D]);
  COURSES.forEach(c => c.el.classList.toggle("is-highlight", nodesHi.has(c.id)));
}
function clearHighlight(){
  document.body.classList.remove("dim");
  COURSES.forEach(c => c.el.classList.remove("is-highlight"));
}

/* ---------- Guardado / Carga con migración ---------- */
function buildAliasIdMap(){
  const map = new Map();
  NAME_ALIASES.forEach((newName, oldName)=>{ map.set(slug(oldName), slug(newName)); });
  return map;
}
function saveState(){
  const data = {};
  COURSES.forEach(c => data[c.id] = {
    a: !!c.approved, p: !!c.planned, n: c.note||"", cr: c.cr||0,
    s: c.semIndex, k: c.kind, rn: c.reqNames||[]
  });
  localStorage.setItem(LSK, JSON.stringify(data));
}
function loadState(){
  const raw = localStorage.getItem(LSK); if (!raw) return;
  const data = JSON.parse(raw);
  const aliasId = buildAliasIdMap();

  const migrated = {};
  Object.keys(data).forEach(oldId=>{
    const rec = data[oldId];
    const newId = aliasId.get(oldId) || oldId;
    migrated[newId] = Object.assign({}, migrated[newId]||{}, rec);
  });

  Object.keys(migrated).forEach(id=>{
    const rec = migrated[id];
    let c = COURSES.get(id);
    if (!c){
      const nameGuess = id.replace(/-/g," ").replace(/\b\w/g,ch=>ch.toUpperCase());
      const item = { name: nameGuess, cr: rec.cr||0, req: rec.rn||[] };
      renderCourse(rec.s ?? 0, item, rec.k || "opt");
      c = COURSES.get(id);
    }
    c.approved = !!rec.a; c.planned = !!rec.p; c.note = rec.n||""; c.cr = rec.cr||0;
    c.reqNames = (rec.rn||[]).map(normalizeName);
    c.reqIds = c.reqNames.map(n => NAME_TO_ID.get(n) || slug(n));
    const chip = c.el.querySelector(".credit-chip");
    if (chip) chip.textContent = `🧮 ${c.cr} cr.`;
  });
}

/* ---------- Buscador (acepta alias) ---------- */
function findCourseByQuery(q){
  if (!q) return null;
  const norm = q.trim().toLowerCase();
  for (const [, c] of COURSES){
    if (c.name.toLowerCase() === norm) return c;
    for (const [oldName, newName] of NAME_ALIASES){
      if (newName === c.name && oldName.toLowerCase() === norm) return c;
    }
  }
  for (const [, c] of COURSES){
    if (c.name.toLowerCase().includes(norm)) return c;
    for (const [oldName, newName] of NAME_ALIASES){
      if (newName === c.name && oldName.toLowerCase().includes(norm)) return c;
    }
  }
  return null;
}
function describeReqs(c){
  if (!c.reqNames || !c.reqNames.length) return "<em>Sin requisitos</em>";
  return `<ul style="margin:6px 0 0 18px; padding:0">${c.reqNames.map(r=> `<li>${normalizeName(r)}</li>`).join("")}</ul>`;
}
function scrollToCourse(c){
  c.el.classList.add("pulse");
  c.el.scrollIntoView({behavior:"smooth", block:"center", inline:"center"});
  setTimeout(()=>c.el.classList.remove("pulse"), 2000);
}
function setupSearch(){
  searchInput.addEventListener("input", ()=>{
    const q = searchInput.value;
    const c = findCourseByQuery(q);
    if (!q){ searchInfo.hidden = true; searchInfo.innerHTML = ""; clearHighlight(); return; }
    if (!c){ searchInfo.hidden = false; searchInfo.innerHTML = `<strong>Sin resultados</strong>`; clearHighlight(); return; }
    const unmet = unmetReqs(c);
    const estado = c.approved ? "Aprobada" : (unmet.length ? "Bloqueada" : "Desbloqueada");
    searchInfo.hidden = false;
    searchInfo.innerHTML = `
      <div><strong>${c.name}</strong></div>
      <div style="margin-top:4px"><strong>Estado:</strong> ${estado}</div>
      <div style="margin-top:6px"><strong>Créditos:</strong> ${c.cr||0}</div>
      <div style="margin-top:6px"><strong>Requisitos</strong>: ${describeReqs(c)}</div>
      <div style="margin-top:8px"><button id="btn-go" class="btn">Ir a la asignatura</button></div>`;
    applyHighlight(c.id);
    document.getElementById("btn-go").onclick = ()=> scrollToCourse(c);
  });
}

/* ---------- Init ---------- */
function init(){
  buildModel();

  // Construir grafos base
  COURSES.forEach(c=>{
    c.reqIds = (c.reqNames||[]).map(n => NAME_TO_ID.get(n) || slug(n));
    c.reqIds.forEach(rid => { FWD.get(rid)?.add(c.id); REV.get(c.id)?.add(rid); });
  });

  refreshLockStates();
  setupSearch();

  // Restaurar estado (con migración por alias)
  try{ loadState(); }catch(e){}

  refreshLockStates();

  // Botones barra
  document.getElementById("btn-guardar").addEventListener("click", saveState);
  document.getElementById("btn-cargar").addEventListener("click", ()=>{ loadState(); refreshLockStates(); });
  document.getElementById("btn-reset").addEventListener("click", ()=>{
    localStorage.removeItem(LSK);
    location.reload();
  });

  // Accesibilidad Enter
  document.addEventListener("keydown",(e)=>{
    if (e.key==="Enter"){
      const el = document.activeElement;
      if (el && el.classList && el.classList.contains("ramo") && el.classList.contains("desbloqueado")){
        el.click();
      }
    }
  });
}

window.addEventListener("DOMContentLoaded", () => {
  try { init(); } catch (err) {
    console.error("Fallo en init():", err);
    alert("Ocurrió un problema inicializando la malla. Revisa la consola (F12).");
  }
});

/* ---------- Miscelánea ---------- */
function updateSemCounters(){
  PLAN.forEach((_, i)=>{
    const badge = SEM_NODES[i].querySelector(".sem-credits");
    if (badge) badge.textContent = `0 / 50`;
  });
}
