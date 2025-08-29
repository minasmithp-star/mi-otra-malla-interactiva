/* =========================================================================
   Organización académica: avance detallado + filtros + notas + planeación
   Ajustes: tooltip 0.5s, sin title nativo, textos “asignatura”, nuevo título
   ========================================================================= */

const LSK = "malla_quim_farma_estado_v4"; // estado (aprobada/planeada/notas)

/* ---------- Utils ---------- */
const slug = (s) => s.toLowerCase()
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* ---------- Plan completo (todos los semestres) ---------- */
const PLAN = [
  { titulo: "1° Semestre", items: [
    { name: "Matemática 1", req: [] },
    { name: "Química General 1", req: [] },
    { name: "Introducción a las Ciencias Biológicas 1", req: [] },
    { name: "Prevención de Riesgos en el Laboratorio", req: [] },
  ]},
  { titulo: "2° Semestre", items: [
    { name: "Matemática 2", req: ["Matemática 1"] },
    { name: "Química General 2", req: ["Química General 1", "Prevención de Riesgos en el Laboratorio"] },
    { name: "Física 101", req: ["Matemática 1"] },
    { name: "Introducción a las Ciencias Biológicas II", req: ["Introducción a las Ciencias Biológicas 1", "Prevención de Riesgos en el Laboratorio"] },
  ]},

  { titulo: "3° Semestre", items: [
    { name: "Química Orgánica 101", req: ["Química General 2"] },
    { name: "Química Analítica 1", req: ["Química General 2"] },
    { name: "Química Inorgánica T", req: ["Química General 2"] },
    { name: "Química Inorgánica P", req: ["Química General 2"] },
    { name: "Física 102", req: ["Física 101"] },
    { name: "Fisiología", req: ["Introducción a las Ciencias Biológicas II"] },
  ]},
  { titulo: "4° Semestre", items: [
    { name: "Química Orgánica 102", req: ["Química Orgánica 101"] },
    { name: "Química Analítica 2", req: ["Química Analítica 1"] },
    { name: "Fisicoquímica 102", req: ["Matemática 2", "Química Analítica 1"] },
    { name: "Física 003L", req: ["Física 102"] },
    { name: "Fisiopatología", req: ["Fisiología"] },
    { name: "Introducción al medicamento", req: [] },
  ]},

  { titulo: "5° Semestre", items: [
    { name: "Química Orgánica 103 L", req: ["Química Orgánica 101", "Química Analítica 1"] },
    { name: "Química Orgánica 104", req: ["Química Orgánica 102"] },
    { name: "Química Analítica 3", req: ["Química Analítica 2"] },
    { name: "Fisicoquímica 103", req: ["Fisicoquímica 102"] },
    { name: "Bioquímica", req: ["Introducción a las Ciencias Biológicas 1", "Química Orgánica 102", "Química Analítica 2", "Fisicoquímica 102"] },
  ]},
  { titulo: "6° Semestre", items: [
    { name: "Farmacognosia", req: ["Química Orgánica 103 L", "Química Orgánica 104", "Química Analítica 3"] },
    { name: "Botánica", req: ["Introducción a las Ciencias Biológicas II", "Química Orgánica 103 L", "Química Orgánica 104"] },
    { name: "Microbiología General", req: ["Introducción a las Ciencias Biológicas II", "Bioquímica"] },
    { name: "Inmunología 1", req: ["Introducción a las Ciencias Biológicas II", "Bioquímica"] },
    { name: "Farmacocinética y Biofarmacia", req: ["Matemática 2", "Fisiología"] },
    { name: "Introducción a los sistemas de gestión", req: [] },
    { name: "Taller de Integración Cs. Biol. y Biomédicas", req: ["Fisiología"] },
  ]},

  { titulo: "7° Semestre", items: [
    { name: "Química Farmacéutica 101", req: ["Química Orgánica 103 L", "Química Orgánica 104", "Química Analítica 3", "Fisicoquímica 103", "Bioquímica", "Farmacognosia"] },
    { name: "Química Farmacéutica 102", req: ["Química Orgánica 103 L", "Química Orgánica 104", "Química Analítica 3", "Fisicoquímica 103", "Bioquímica", "Farmacognosia"] },
    { name: "Farmacotecnia 1", req: ["Química Inorgánica T","Química Inorgánica P","Fisicoquímica 102","Introducción al medicamento","Farmacognosia","Botánica","Microbiología General","Farmacocinética y Biofarmacia","Química Analítica 3"] },
    { name: "Farmacología", req: ["Fisiología", "Bioquímica", "Química Orgánica 103 L", "Química Orgánica 104", "Taller de Integración Cs. Biol. y Biomédicas"] },
    { name: "Inmunología 2", req: ["Inmunología 1"] },
    { name: "Bromatología y Nutrición", req: ["Bioquímica", "Microbiología General"] },
  ]},
  { titulo: "8° Semestre", items: [
    { name: "Farmacoterapia", req: ["Fisiopatología", "Farmacocinética y Biofarmacia", "Farmacología"] },
    { name: "Farmacotecnia 2", req: ["Farmacotecnia 1"] },
    { name: "Control de Calidad de los Medicamentos", req: ["Microbiología General", "Química Farmacéutica 101", "Química Farmacéutica 102", "Farmacotecnia 1"] },
    { name: "Toxicología Fundamental", req: ["Química Analítica 3", "Bioquímica"] },
  ]},

  { titulo: "9° Semestre", items: [
    { name: "Legislación y Deontología", req: ["Farmacoterapia", "Farmacotecnia 2"] },
    { name: "Gestión de Empresas", req: [] },
  ]},
  { titulo: "10° Semestre", items: [
    { name: "Internado / Practicantado / Proyecto", req: ["Legislación y Deontología", "Gestión de Empresas"] },
  ]},
];

/* ---------- DOM ---------- */
const mallaDiv = document.getElementById("malla");
const viewport = document.getElementById("viewport");
const tooltip = document.getElementById("tooltip");
const progressText = document.getElementById("progress-text");
const progressFill = document.querySelector("#progress .fill");
const searchInput = document.getElementById("search-input");
const searchInfo = document.getElementById("search-info");
const filterSelect = document.getElementById("filter-state");
const avanceGrid = document.getElementById("avance-grid");

/* ---------- Estructuras ---------- */
const COURSES = new Map(); // id -> {id,name,reqIds,el,approved,planned,note}
const NAME_TO_ID = new Map();
const FWD = new Map();     // id -> Set(dependientes)
const REV = new Map();     // id -> Set(prerrequisitos)

/* ---------- Render ---------- */
function buildModel(){
  PLAN.forEach((sem, idx) => {
    const semDiv = document.createElement("div");
    semDiv.className = `semestre sem-${idx+1}`;
    const h2 = document.createElement("h2");
    h2.textContent = sem.titulo;
    semDiv.appendChild(h2);

    sem.items.forEach(item => {
      const id = slug(item.name);
      NAME_TO_ID.set(item.name, id);

      const div = document.createElement("div");
      div.className = "ramo";
      div.id = id;
      div.dataset.id = id;
      div.dataset.name = item.name;
      div.textContent = item.name;

      // fila de mini-actions (⭐ planeada / 📝 notas)
      const chiprow = document.createElement("div");
      chiprow.className = "chiprow";
      const btnPlan = document.createElement("button");
      btnPlan.className = "iconbtn plan-btn";
      btnPlan.type = "button";
      btnPlan.textContent = "⭐";
      btnPlan.title = ""; // sin title nativo
      const btnNote = document.createElement("button");
      btnNote.className = "iconbtn note-btn";
      btnNote.type = "button";
      btnNote.textContent = "📝";
      btnNote.title = "";
      chiprow.append(btnPlan, btnNote);
      div.appendChild(chiprow);

      semDiv.appendChild(div);

      COURSES.set(id, {
        id, name: item.name, reqNames: item.req.slice(), reqIds: [],
        el: div, approved: false, planned: false, note: ""
      });
      FWD.set(id, new Set());
      REV.set(id, new Set());
    });

    mallaDiv.appendChild(semDiv);
  });

  // Resolver requisitos
  COURSES.forEach(c => {
    c.reqIds = c.reqNames.map(n => NAME_TO_ID.get(n) || slug(n));
    c.reqIds.forEach(rid => {
      FWD.get(rid)?.add(c.id);
      REV.get(c.id)?.add(rid);
    });
  });
}

/* ---------- Estados ---------- */
function refreshLockStates(){
  COURSES.forEach(c => {
    const el = c.el;
    const unmet = c.reqIds.filter(rid => !COURSES.get(rid)?.approved);
    if (c.reqIds.length === 0 || unmet.length === 0){
      el.classList.add("desbloqueado");
      el.classList.remove("bloqueado");
      el.tabIndex = 0;
      el.setAttribute("aria-disabled","false");
    }else{
      el.classList.add("bloqueado");
      el.classList.remove("desbloqueado");
      el.classList.remove("aprobado");
      c.approved = false;
      el.tabIndex = -1;
      el.setAttribute("aria-disabled","true");
    }
    el.classList.toggle("aprobado", !!c.approved);
    el.classList.toggle("planeada", !!c.planned);
    // indicador 📌 si hay nota (mantiene icono 📝, no agregamos title nativo)
    // (Podríamos cambiar el emoji, pero preferimos no alterar los botones)
  });

  applyFilter(); // respetar filtro activo
  updateProgress();
  renderAvance();
}

/* ---------- Progreso ---------- */
function updateProgress(){
  const total = COURSES.size;
  let ok = 0;
  COURSES.forEach(c => { if (c.approved) ok++; });
  const pct = total ? Math.round((ok/total)*100) : 0;
  progressText.textContent = `${ok} / ${total} (${pct}%)`;
  progressFill.style.width = `${pct}%`;
}

/* ---------- Panel de avance (global, por año, por semestre) ---------- */
function renderAvance(){
  const semTotals = PLAN.map((sem, i) => {
    let t=0,a=0,u=0,b=0,p=0;
    sem.items.forEach(it=>{
      t++;
      const id = NAME_TO_ID.get(it.name) || slug(it.name);
      const c = COURSES.get(id);
      if (!c) return;
      if (c.approved) a++;
      const unmet = c.reqNames.map(n=>NAME_TO_ID.get(n)||slug(n)).filter(rid => !COURSES.get(rid)?.approved);
      if (c.approved) { /* contada arriba */ }
      else if (unmet.length === 0) u++;
      else b++;
      if (c.planned) p++;
    });
    return { semestre: i+1, total:t, aprob:a, desblo:u, bloq:b, plan:p };
  });

  // por año (cada 2 semestres)
  const yearTotals = [];
  for (let y=0; y<semTotals.length/2; y++){
    const s1 = semTotals[2*y];
    const s2 = semTotals[2*y+1];
    const agg = {
      year: y+1,
      total: (s1?.total||0)+(s2?.total||0),
      aprob: (s1?.aprob||0)+(s2?.aprob||0),
      desblo:(s1?.desblo||0)+(s2?.desblo||0),
      bloq:  (s1?.bloq||0)+(s2?.bloq||0),
      plan:  (s1?.plan||0)+(s2?.plan||0),
    };
    yearTotals.push(agg);
  }

  const toCard = (title, data) => `
    <div class="card-metric">
      <div class="title">${title}</div>
      <div class="nums">
        <span class="badge">Total: ${data.total}</span>
        <span class="badge">Aprob: ${data.aprob}</span>
        <span class="badge">Desbloq: ${data.desblo}</span>
        <span class="badge">Bloq: ${data.bloq}</span>
        <span class="badge">Plan: ${data.plan}</span>
      </div>
    </div>`;

  // Global
  const global = semTotals.reduce((acc,s)=>({
    total: acc.total+s.total, aprob: acc.aprob+s.aprob, desblo: acc.desblo+s.desblo, bloq: acc.bloq+s.bloq, plan: acc.plan+s.plan
  }), {total:0, aprob:0, desblo:0, bloq:0, plan:0});

  let html = toCard("Global", global);
  // Años
  yearTotals.forEach(y=>{
    html += toCard(`Año ${y.year}`, y);
  });
  // Semestres
  semTotals.forEach(s=>{
    html += toCard(`Semestre ${s.semestre}`, s);
  });

  avanceGrid.innerHTML = html;
}

/* ---------- Interacciones ---------- */
let hoverTimer = null;
let touchTimer = null;
let activeTooltipTarget = null;

function bindInteractions(){
  COURSES.forEach(c => {
    const el = c.el;
    const btnPlan = el.querySelector(".plan-btn");
    const btnNote = el.querySelector(".note-btn");

    // Click aprobar (solo desbloqueada)
    el.addEventListener("click", (e) => {
      // evita que botones internos disparen toggle
      if (e.target === btnPlan || e.target === btnNote) return;
      if (!el.classList.contains("desbloqueado")) return;
      c.approved = !c.approved;
      // si aprueba, ya no necesitamos 'planeada'
      if (c.approved) c.planned = false;
      refreshLockStates();
      autoSave();
    });

    // Planificar ⭐
    btnPlan.addEventListener("click", (e)=>{
      e.stopPropagation();
      // Solo sentido organizativo; puede marcar planeada aun bloqueada, para simular
      c.planned = !c.planned;
      // si planea y estaba aprobada, desmarca aprobado (organización conservadora)
      if (c.planned && c.approved) c.approved = false;
      refreshLockStates();
      autoSave();
    });

    // Notas 📝
    btnNote.addEventListener("click", (e)=>{
      e.stopPropagation();
      openNotesModal(c);
    });

    // Resaltado dependencias (hover in/out)
    el.addEventListener("mouseenter", () => { applyHighlight(c.id); });
    el.addEventListener("mouseleave", () => { clearHighlight(); });

    // Tooltip requisitos (solo si bloqueada) a los 0.5s
    el.addEventListener("mouseenter", (e) => {
      if (!el.classList.contains("bloqueado")) return;
      scheduleTooltip(c, e);
    });
    el.addEventListener("mousemove", (e) => {
      if (activeTooltipTarget === c.id) positionTooltipToEvent(e);
    });
    el.addEventListener("mouseleave", () => { cancelTooltip(); });

    // Long-press 0.5s móvil/tablet
    el.addEventListener("touchstart", (e) => {
      if (!el.classList.contains("bloqueado")) return;
      e.preventDefault();
      touchTimer = setTimeout(() => {
        const touch = (e.touches && e.touches[0]) ? e.touches[0] : null;
        const cx = touch ? touch.clientX : el.getBoundingClientRect().left;
        const cy = touch ? touch.clientY : el.getBoundingClientRect().top;
        showTooltipForCourse(c, cx, cy);
      }, 500);
    }, { passive:false });
    el.addEventListener("touchmove", () => { clearTimeout(touchTimer); });
    el.addEventListener("touchend", () => { clearTimeout(touchTimer); hideTooltip(); });
  });

  // Filtro por estado
  filterSelect.addEventListener("change", applyFilter);

  // Accesibilidad
  document.addEventListener("keydown", (e)=>{
    if (e.key === "Enter"){
      const el = document.activeElement;
      if (el && el.classList && el.classList.contains("ramo") && el.classList.contains("desbloqueado")){
        el.click();
      }
    }
  });

  // Buscador
  setupSearch();
}

/* ---------- Filtro ---------- */
function applyFilter(){
  const v = filterSelect.value;
  COURSES.forEach(c => {
    const el = c.el;
    const unmet = c.reqIds.filter(rid => !COURSES.get(rid)?.approved);
    const isBlocked = !(c.reqIds.length === 0 || unmet.length === 0);
    const isUnlocked = !isBlocked && !c.approved;
    const isApproved = !!c.approved;
    const isPlanned = !!c.planned;

    let show = true;
    if (v === "unlocked") show = isUnlocked;
    else if (v === "blocked") show = isBlocked;
    else if (v === "approved") show = isApproved;
    else if (v === "planned") show = isPlanned;
    else show = true;

    el.style.display = show ? "" : "none";
  });
}

/* ---------- Resaltado dependencias ---------- */
function ancestorsOf(id){
  const vis = new Set(); const q=[id];
  while(q.length){ const cur=q.pop(); (REV.get(cur) || []).forEach(p=>{ if(!vis.has(p)){ vis.add(p); q.push(p); } }); }
  return vis;
}
function descendantsOf(id){
  const vis = new Set(); const q=[id];
  while(q.length){ const cur=q.pop(); (FWD.get(cur) || []).forEach(n=>{ if(!vis.has(n)){ vis.add(n); q.push(n); } }); }
  return vis;
}
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

/* ---------- Tooltip requisitos ---------- */
function scheduleTooltip(course, evt){
  clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => showTooltipForCourse(course, evt.clientX, evt.clientY), 500);
}
function positionTooltipToEvent(evt){ positionTooltip(evt.clientX, evt.clientY); }
function positionTooltip(clientX, clientY){
  const rb = viewport.getBoundingClientRect();
  tooltip.style.left = (clientX - rb.left + viewport.scrollLeft + 12) + "px";
  tooltip.style.top  = (clientY - rb.top  + viewport.scrollTop  + 12) + "px";
}
function showTooltipForCourse(course, clientX, clientY){
  activeTooltipTarget = course.id;
  tooltip.innerHTML = `
    <strong>${course.name}</strong>
    <div style="margin-top:6px">
      ${course.reqNames.length ? `<div>Requisitos:</div><ul style="margin:6px 0 0 18px; padding:0">${course.reqNames.map(r=>`<li>${r}</li>`).join("")}</ul>` : `<em>Sin requisitos</em>`}
    </div>`;
  tooltip.hidden = false;
  positionTooltip(clientX, clientY);
  requestAnimationFrame(() => tooltip.classList.add("show"));
}
function hideTooltip(){
  tooltip.classList.remove("show");
  activeTooltipTarget = null;
  setTimeout(() => { if (!activeTooltipTarget) tooltip.hidden = true; }, 180);
}
function cancelTooltip(){ clearTimeout(hoverTimer); if (activeTooltipTarget) hideTooltip(); }

/* ---------- Notas ---------- */
const modal = document.getElementById("notes-modal");
const notesTitle = document.getElementById("notes-title");
const notesText = document.getElementById("notes-text");
const notesSave = document.getElementById("notes-save");
const notesCancel = document.getElementById("notes-cancel");
let notesCurrentId = null;

function openNotesModal(course){
  notesCurrentId = course.id;
  notesTitle.textContent = `Notas — ${course.name}`;
  notesText.value = course.note || "";
  modal.showModal();
}
notesSave.addEventListener("click", (e)=>{
  e.preventDefault();
  if (!notesCurrentId) return;
  const c = COURSES.get(notesCurrentId);
  c.note = notesText.value.trim();
  // visual: si hay nota, añadimos/quitamos pequeño pin al nombre (simple: prefijo 📌)
  c.el.dataset.hasNote = c.note ? "1" : "";
  saveState();
  modal.close();
});
notesCancel.addEventListener("click", (e)=>{ e.preventDefault(); modal.close(); });

/* ---------- LocalStorage ---------- */
function saveState(){
  const data = {};
  COURSES.forEach(c => data[c.id] = { a:!!c.approved, p:!!c.planned, n:c.note||"" });
  try{ localStorage.setItem(LSK, JSON.stringify(data)); }catch(e){}
}
function loadState(){
  try{
    const raw = localStorage.getItem(LSK); if(!raw) return;
    const data = JSON.parse(raw);
    COURSES.forEach(c => {
      const rec = data[c.id] || {};
      c.approved = !!rec.a; c.planned = !!rec.p; c.note = rec.n || "";
      c.el.classList.toggle("aprobado", c.approved);
      c.el.classList.toggle("planeada", c.planned);
      c.el.dataset.hasNote = c.note ? "1" : "";
    });
    refreshLockStates();
  }catch(e){}
}
function resetState(){
  try{ localStorage.removeItem(LSK); }catch(e){}
  COURSES.forEach(c => {
    c.approved = false; c.planned = false; c.note = "";
    c.el.classList.remove("aprobado","planeada");
    c.el.dataset.hasNote = "";
  });
  refreshLockStates();
}
function autoSave(){ saveState(); }

/* ---------- Botones top ---------- */
document.getElementById("btn-guardar").addEventListener("click", saveState);
document.getElementById("btn-cargar").addEventListener("click", loadState);
document.getElementById("btn-reset").addEventListener("click", resetState);

/* ---------- Buscador ---------- */
function findCourseByQuery(q){
  if (!q) return null;
  const norm = q.trim().toLowerCase();
  for (const [, c] of COURSES){ if (c.name.toLowerCase() === norm) return c; }
  for (const [, c] of COURSES){ if (c.name.toLowerCase().includes(norm)) return c; }
  return null;
}
function describeReqs(c){
  if (!c.reqNames.length) return "<em>Sin requisitos</em>";
  return `<ul style="margin:6px 0 0 18px; padding:0">${c.reqNames.map(r => `<li>${r}</li>`).join("")}</ul>`;
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
    if (!q){
      searchInfo.hidden = true; searchInfo.innerHTML = ""; clearHighlight(); return;
    }
    if (!c){
      searchInfo.hidden = false; searchInfo.innerHTML = `<strong>Sin resultados</strong>`; clearHighlight(); return;
    }
    const unmet = c.reqIds.filter(rid => !COURSES.get(rid)?.approved);
    const estado = c.approved ? "Aprobada" : (unmet.length ? "Bloqueada" : "Desbloqueada");
    searchInfo.hidden = false;
    searchInfo.innerHTML = `
      <div><strong>${c.name}</strong></div>
      <div style="margin-top:4px"><strong>Estado:</strong> ${estado}</div>
      <div style="margin-top:6px"><strong>Requisitos</strong>: ${describeReqs(c)}</div>
      <div style="margin-top:8px"><button id="btn-go" class="btn">Ir a la asignatura</button></div>`;
    applyHighlight(c.id);
    document.getElementById("btn-go").onclick = ()=> scrollToCourse(c);
  });
}

/* ---------- Init ---------- */
function init(){
  buildModel();
  refreshLockStates();
  bindInteractions();
  loadState();
}
init();
