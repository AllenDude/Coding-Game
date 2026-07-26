/* =========================================================
   ui.js — rendering & interaction logic for CodeQuest.
   ========================================================= */

const App = (() => {

  const ACADEMIES = { web: WEB_ACADEMY, java: JAVA_ACADEMY };
  const root = () => document.getElementById('app');

  // in-memory router state
  let route = { view:'home' };
  // per-lesson in-memory editor buffers, keyed by lessonId (or chapterId+'-boss')
  const editorBuffers = {};

  function esc(str){
    return String(str==null?'':str).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  /* ================= Toasts & Level-up ================= */

  function toast(icon, title, sub){
    const layer = document.getElementById('overlayLayer');
    const tpl = document.getElementById('tpl-toast').content.cloneNode(true);
    tpl.querySelector('.toast-icon').textContent = icon;
    tpl.querySelector('.toast-title').textContent = title;
    tpl.querySelector('.toast-sub').textContent = sub || '';
    const node = tpl.querySelector('.toast');
    layer.appendChild(node);
    setTimeout(()=> node.remove(), 4200);
  }

  function showLevelUp(level){
    const layer = document.getElementById('overlayLayer');
    const modal = document.createElement('div');
    modal.className = 'levelup-modal';
    modal.innerHTML = `
      <div class="levelup-card">
        <div class="big">⚡</div>
        <div class="eyebrow">Level Up</div>
        <h2 class="glow-text">Level ${level}</h2>
        <p style="color:var(--text-dim)">Your circuits hum with new power.</p>
        <button class="btn btn-primary" id="lvupClose">Continue</button>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector('#lvupClose').addEventListener('click', ()=> modal.remove());
    modal.addEventListener('click', (e)=>{ if(e.target===modal) modal.remove(); });
  }

  function grantXp(academyId, state, amount){
    if(amount <= 0) return;
    const res = State.addXp(state, amount);
    if(res.leveledUp) showLevelUp(res.to);
  }

  function grantAchievements(academyId, state){
    const academy = ACADEMIES[academyId];
    const newOnes = State.checkAchievements(state, academy);
    newOnes.forEach(a => toast(a.icon, 'Achievement Unlocked', a.name));
  }

  function persist(academyId, state){
    State.save(academyId, state);
  }

  /* ================= Top bar ================= */

  function renderTopbar(academyId, state){
    if(!academyId) {
      return `<div class="topbar">
        <div class="brand" id="brandHome"><span class="brand-mark"></span><span>CodeQuest</span></div>
        <div class="topbar-stats"><span class="stat-chip">Offline Coding RPG</span></div>
      </div>`;
    }
    const li = State.levelInfo(state.xp);
    return `<div class="topbar">
      <div class="brand" id="brandHome"><span class="brand-mark"></span><span>CodeQuest</span></div>
      <div class="topbar-stats">
        <span class="stat-chip">🏫 <b>${esc(ACADEMIES[academyId].name)}</b></span>
        <span class="stat-chip">⭐ Lv <b>${li.level}</b></span>
        <span class="stat-chip">✨ <b>${state.xp}</b> XP</span>
        <span class="stat-chip"><span class="streak-flame">🔥</span> <b>${state.streak||0}</b> day streak</span>
      </div>
    </div>`;
  }

  function wireTopbar(){
    const b = document.getElementById('brandHome');
    if(b) b.addEventListener('click', ()=>{ route = { view:'home' }; render(); });
  }

  /* ================= HOME ================= */

  function renderHome(){
    const webState = State.load('web');
    const javaState = State.load('java');
    root().innerHTML = `
      ${renderTopbar(null)}
      <div class="view">
        <div class="hero">
          <div class="eyebrow">Welcome, Cadet</div>
          <h1>Pick your <span class="glow-text">Academy</span></h1>
          <p>Learn to code by completing quests, not reading manuals. Choose a path below — each tracks its own XP, achievements and quest log.</p>
        </div>
        <div class="academy-grid">
          ${academyCard(WEB_ACADEMY, webState)}
          ${academyCard(JAVA_ACADEMY, javaState)}
        </div>

        <div class="panel" style="margin-top:1.6rem; display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap;">
          <div>
            <h3 style="margin-bottom:.25rem;">💾 Backup & Restore</h3>
            <p style="color:var(--text-dim); font-size:.85rem; margin:0;">This app has no server — export a save file to move progress between browsers or devices, or back it up before clearing site data.</p>
          </div>
          <div style="display:flex; gap:.6rem;">
            <button class="btn btn-ghost btn-sm" id="exportBtn">⬇ Export Progress</button>
            <button class="btn btn-ghost btn-sm" id="importBtn">⬆ Import Progress</button>
            <input type="file" id="importFile" accept="application/json" style="display:none;">
          </div>
        </div>

        <p class="footer-note">Progress is saved automatically in this browser via localStorage. Fully offline — no accounts, no network required.</p>
      </div>
    `;
    document.querySelectorAll('.academy-card').forEach(card=>{
      card.addEventListener('click', ()=>{
        const id = card.getAttribute('data-id');
        route = { view:'academy', academyId:id };
        render();
      });
    });
    wireDataButtons(()=>{ route = { view:'home' }; render(); });
  }

  function academyCard(academy, state){
    const pct = State.completionPct(state, academy);
    const li = State.levelInfo(state.xp);
    return `<div class="academy-card" data-id="${academy.id}">
      <div class="tag">${academy.id === 'web' ? '9 Chapters' : '3 Chapters'}</div>
      <h2>${esc(academy.name)}</h2>
      <p>${esc(academy.tagline)}</p>
      <div class="academy-progress">
        <div class="bar-label"><span>Level ${li.level} · ${state.xp} XP</span><span>${pct}% complete</span></div>
        <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="academy-cta"><button class="btn btn-primary">Enter Academy →</button></div>
    </div>`;
  }

  /* ================= Export / Import ================= */

  function downloadJson(obj, filename){
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type:'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(()=> URL.revokeObjectURL(url), 1000);
  }

  function exportProgress(){
    const data = State.exportAll();
    const stamp = new Date().toISOString().slice(0,10);
    downloadJson(data, `codequest-progress-${stamp}.json`);
    toast('💾', 'Progress Exported', 'Save file downloaded');
  }

  function importProgress(file, onDone){
    const reader = new FileReader();
    reader.onload = () => {
      let parsed;
      try{ parsed = JSON.parse(reader.result); }
      catch(e){ toast('⚠️', 'Import Failed', 'That file isn\'t valid JSON.'); return; }
      const result = State.importAll(parsed);
      if(result.ok){
        toast('✅', 'Progress Restored', result.message);
        if(onDone) onDone();
      } else {
        toast('⚠️', 'Import Failed', result.message);
      }
    };
    reader.onerror = () => toast('⚠️', 'Import Failed', 'Could not read that file.');
    reader.readAsText(file);
  }

  /** Wires the Export/Import buttons+hidden file input present in the current view. */
  function wireDataButtons(onImported){
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    if(exportBtn) exportBtn.addEventListener('click', exportProgress);
    if(importBtn && importFile){
      importBtn.addEventListener('click', ()=> importFile.click());
      importFile.addEventListener('change', ()=>{
        if(importFile.files && importFile.files[0]){
          importProgress(importFile.files[0], onImported);
        }
        importFile.value = '';
      });
    }
  }

  /* ================= ACADEMY DASHBOARD ================= */

  function renderAcademy(academyId){
    const academy = ACADEMIES[academyId];
    const state = State.load(academyId);
    const streakRes = State.touchStreak(state);
    if(streakRes.changed) persist(academyId, state);

    const li = State.levelInfo(state.xp);
    const pct = State.completionPct(state, academy);

    root().innerHTML = `
      ${renderTopbar(academyId, state)}
      <div class="view">
        <div class="dash-header">
          <div>
            <div class="eyebrow">${academyId === 'web' ? 'Web Development Academy' : 'Java Academy'}</div>
            <h1>${esc(academy.name)}</h1>
          </div>
          <button class="btn btn-ghost btn-sm" id="backHome">← All Academies</button>
        </div>

        <div class="panel" style="margin-bottom:1.2rem; display:flex; align-items:center; justify-content:flex-end; gap:.6rem; flex-wrap:wrap;">
          <button class="btn btn-ghost btn-sm" id="exportBtn">⬇ Export Progress</button>
          <button class="btn btn-ghost btn-sm" id="importBtn">⬆ Import Progress</button>
          <input type="file" id="importFile" accept="application/json" style="display:none;">
        </div>

        <div class="panel" style="margin-bottom:1.2rem;">
          <div class="bar-label"><span>Level ${li.level} progress</span><span>${li.into}/${li.need} XP</span></div>
          <div class="bar"><div class="bar-fill" style="width:${li.pct}%"></div></div>
          <div class="bar-label" style="margin-top:.9rem;"><span>Academy completion</span><span>${pct}%</span></div>
          <div class="bar"><div class="bar-fill" style="width:${pct}%"></div></div>
        </div>

        <div class="dash-grid">
          <div>
            <div class="panel">
              <h3>🌌 Skill Constellation</h3>
              <div id="chaptersWrap"></div>
            </div>
          </div>
          <div>
            <div class="panel">
              <h3>🏆 Achievements</h3>
              <div class="ach-grid" id="achGrid"></div>
            </div>
          </div>
        </div>
      </div>
    `;
    wireTopbar();
    document.getElementById('backHome').addEventListener('click', ()=>{ route={view:'home'}; render(); });
    wireDataButtons(()=>{ render(); });
    renderChapters(academyId, academy, state);
    renderAchievements(academy, state);
  }

  function renderChapters(academyId, academy, state){
    const wrap = document.getElementById('chaptersWrap');
    wrap.innerHTML = academy.chapters.map((chap, ci)=>{
      const unlocked = State.isChapterUnlocked(academy, state, ci);
      const bossUnlocked = State.isBossUnlocked(academy, state, ci);
      const bossDone = !!state.completedBosses[chap.boss.id];
      const doneCount = chap.lessons.filter(l=>state.completedLessons[l.id]).length;
      const isOpen = state.openChapter === chap.id || (!state.openChapter && unlocked && !bossDone && ci === firstUnfinishedChapter(academy,state));

      const lessonRows = chap.lessons.map((lesson, li)=>{
        const lUnlocked = State.isLessonUnlocked(academy, state, ci, li);
        const lDone = !!state.completedLessons[lesson.id];
        const stateClass = lDone ? 'done' : (lUnlocked ? 'unlocked' : 'locked');
        return `<div class="node-row ${stateClass}" data-chapter="${ci}" data-lesson="${li}">
          <div class="connector"></div>
          <div class="node ${stateClass}">${lDone ? '✓' : (li+1)}</div>
          <div class="node-info">
            <h4>${esc(lesson.title)}</h4>
            <div class="sub">${lUnlocked ? (lDone ? 'Completed' : 'Ready') : 'Locked'}</div>
          </div>
        </div>`;
      }).join('');

      const bossClass = bossDone ? 'done' : (bossUnlocked ? 'unlocked' : 'locked');
      const bossRow = `<div class="node-row ${bossClass}" data-chapter="${ci}" data-boss="1">
          <div class="connector"></div>
          <div class="node boss ${bossClass}">${bossDone ? '✓' : '☠'}</div>
          <div class="node-info">
            <h4>${esc(chap.boss.title)}</h4>
            <div class="sub">${bossUnlocked ? (bossDone ? 'Defeated' : 'Boss ready') : 'Complete all lessons first'}</div>
          </div>
        </div>`;

      return `<div class="chapter-block ${unlocked?'':'locked'} ${isOpen?'open':''}" data-chapter-id="${chap.id}">
        <div class="chapter-head" data-toggle="${chap.id}">
          <div>
            <h3>${esc(chap.title)}</h3>
            <div class="meta">${chap.summary}</div>
          </div>
          <div style="display:flex; align-items:center; gap:.8rem;">
            <span class="pill ${doneCount===chap.lessons.length?'on':''}">${doneCount}/${chap.lessons.length} lessons</span>
            <span class="chapter-chevron">›</span>
          </div>
        </div>
        <div class="chapter-body">
          ${lessonRows}
          ${bossRow}
        </div>
      </div>`;
    }).join('');

    wrap.querySelectorAll('.chapter-head').forEach(head=>{
      head.addEventListener('click', ()=>{
        const id = head.getAttribute('data-toggle');
        const block = head.closest('.chapter-block');
        const willOpen = !block.classList.contains('open');
        wrap.querySelectorAll('.chapter-block').forEach(b=>b.classList.remove('open'));
        if(willOpen) block.classList.add('open');
        state.openChapter = willOpen ? id : null;
        persist(academyId, state);
      });
    });
    wrap.querySelectorAll('.node-row').forEach(rowEl=>{
      rowEl.addEventListener('click', ()=>{
        if(rowEl.classList.contains('locked')) return;
        const ci = parseInt(rowEl.getAttribute('data-chapter'),10);
        if(rowEl.hasAttribute('data-boss')){
          route = { view:'boss', academyId, chapterIndex:ci };
        } else {
          const li = parseInt(rowEl.getAttribute('data-lesson'),10);
          route = { view:'lesson', academyId, chapterIndex:ci, lessonIndex:li };
        }
        render();
      });
    });
  }

  function firstUnfinishedChapter(academy, state){
    for(let i=0;i<academy.chapters.length;i++){
      if(!state.completedBosses[academy.chapters[i].boss.id]) return i;
    }
    return academy.chapters.length - 1;
  }

  function renderAchievements(academy, state){
    const grid = document.getElementById('achGrid');
    grid.innerHTML = State.ACHIEVEMENT_DEFS.map(def=>{
      const on = !!state.achievements[def.id];
      return `<div class="ach-card ${on?'':'locked'}">
        <div class="ico">${def.icon}</div>
        <div class="name">${esc(def.name)}</div>
        <div class="desc">${esc(def.desc)}</div>
      </div>`;
    }).join('');
  }

  /* ================= LESSON VIEW ================= */

  function renderLesson(academyId, chapterIndex, lessonIndex){
    const academy = ACADEMIES[academyId];
    const chapter = academy.chapters[chapterIndex];
    const lesson = chapter.lessons[lessonIndex];
    const state = State.load(academyId);

    if(!State.isLessonUnlocked(academy, state, chapterIndex, lessonIndex)){
      route = { view:'academy', academyId }; render(); return;
    }

    if(!editorBuffers[lesson.id]){
      editorBuffers[lesson.id] = {
        lessonFiles: Object.assign({}, lesson.files),
        questFiles: buildQuestStartFiles(lesson)
      };
    }
    const buf = editorBuffers[lesson.id];

    root().innerHTML = `
      ${renderTopbar(academyId, state)}
      <div class="view">
        <div class="lesson-header">
          <div class="crumb">
            <button id="crumbBack">← ${esc(chapter.title)}</button>
            <span> / ${esc(lesson.title)}</span>
          </div>
          <span class="pill">${esc(chapter.subject)} · ${esc(chapter.tier)}</span>
        </div>
        <h1 style="font-size:1.5rem; margin-bottom:1rem;">${esc(lesson.title)}</h1>

        <div class="lesson-tabs">
          <div class="lesson-tab active" data-tab="learn">📖 Learn</div>
          <div class="lesson-tab" data-tab="practice">🧪 Try It</div>
          <div class="lesson-tab" data-tab="quiz">❓ Quiz</div>
          <div class="lesson-tab" data-tab="quest">⚔️ Quest</div>
        </div>

        <div class="tab-panel active" data-panel="learn">
          <div class="explain-box">
            <p>${esc(lesson.explanation)}</p>
            <h4 style="margin:1.1rem 0 .5rem; color:var(--blue-soft);">Syntax</h4>
            <div class="code-block">${esc(lesson.syntax)}</div>
            <h4 style="margin:1.1rem 0 .5rem; color:var(--violet-soft);">Common Mistakes</h4>
            <ul class="mistake-list">${lesson.mistakes.map(m=>`<li>${m}</li>`).join('')}</ul>
          </div>
        </div>

        <div class="tab-panel" data-panel="practice">
          <div id="practiceEditor"></div>
        </div>

        <div class="tab-panel" data-panel="quiz">
          <div id="quizArea"></div>
        </div>

        <div class="tab-panel" data-panel="quest">
          <div class="quest-card">
            <div class="quest-title">⚔️ ${esc(lesson.quest.title)}</div>
            <p style="margin:.6rem 0 1rem; color:var(--text-dim);">${esc(lesson.quest.description)}</p>
            <div id="questEditor"></div>
            <div id="questFeedback"></div>
          </div>
        </div>
      </div>
    `;
    wireTopbar();
    document.getElementById('crumbBack').addEventListener('click', ()=>{ route={view:'academy', academyId}; render(); });
    wireTabs();

    mountEditor(document.getElementById('practiceEditor'), lesson.editorType, buf.lessonFiles, { runnable:true, allowRunOnly:true });
    mountQuiz(academyId, academy, state, lesson);
    mountQuestEditor(academyId, academy, state, chapter, lesson, buf);
  }

  function buildQuestStartFiles(lesson){
    const q = lesson.quest;
    const files = {};
    if(lesson.editorType === 'html'){
      files.html = q.starter != null ? q.starter : (lesson.files.html||'');
    } else if(lesson.editorType === 'css'){
      files.html = lesson.files.html || '';
      files.css = q.starter != null ? q.starter : (lesson.files.css||'');
    } else if(lesson.editorType === 'js'){
      files.html = q.starterHtml != null ? q.starterHtml : (lesson.files.html||'');
      files.js = q.starter != null ? q.starter : (lesson.files.js||'');
    } else if(lesson.editorType === 'java'){
      files.java = q.starter != null ? q.starter : (lesson.files.java||'');
    }
    return files;
  }

  function wireTabs(){
    const tabs = document.querySelectorAll('.lesson-tab');
    tabs.forEach(t=>{
      t.addEventListener('click', ()=>{
        tabs.forEach(x=>x.classList.remove('active'));
        t.classList.add('active');
        const name = t.getAttribute('data-tab');
        document.querySelectorAll('.tab-panel').forEach(p=>{
          p.classList.toggle('active', p.getAttribute('data-panel')===name);
        });
      });
    });
  }

  /* ================= EDITOR + LIVE PREVIEW ================= */

  function buildPreviewDoc(files, frameId){
    const html = files.html || '';
    const css = files.css || '';
    const js = files.js || '';
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
      body{ font-family: system-ui, sans-serif; margin:12px; color:#111; }
      ${css}
    </style></head><body>${html}
    <script>
      (function(){
        var __logs = [];
        var _origLog = console.log;
        console.log = function(){
          var args = Array.prototype.slice.call(arguments);
          __logs.push(args.map(function(a){
            try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
            catch(e){ return String(a); }
          }).join(' '));
          try{ parent.postMessage({ __cqlogs:true, frameId:'${frameId}', logs: __logs }, '*'); }catch(e){}
          _origLog.apply(console, arguments);
        };
        window.onerror = function(msg){
          try{ parent.postMessage({ __cqlogs:true, frameId:'${frameId}', logs: __logs, error:String(msg) }, '*'); }catch(e){}
          return true;
        };
      })();
    <\/script>
    <script>
      try { ${js} } catch(e){ console.log('Error: ' + e.message); }
    <\/script>
    </body></html>`;
  }

  /**
   * Mounts an editor+preview block into `container`.
   * files: mutable object the caller keeps a reference to (edited in place).
   * opts.onFilesChanged(files) fires on every input so quest checks can re-read.
   */
  function mountEditor(container, editorType, files, opts = {}){
    opts = Object.assign({ runnable:false }, opts);

    if(editorType === 'java'){
      container.innerHTML = `
        <div class="editor-wrap">
          <div class="editor-col">
            <div class="editor-labels"><button class="active">Main.java</button></div>
            <textarea class="code-input" spellcheck="false" style="min-height:260px;">${esc(files.java||'')}</textarea>
            <div class="run-row"><button class="btn btn-sm btn-primary" id="runBtn">▶ Simulate Run</button>
              <span class="pill">Offline Java is simulated, not compiled</span></div>
          </div>
          <div class="editor-col">
            <div class="editor-labels"><button class="active">Simulated Console</button></div>
            <div class="console-out" id="consoleOut">Click "Simulate Run" to see approximate output.</div>
          </div>
        </div>`;
      const ta = container.querySelector('textarea');
      ta.addEventListener('input', ()=>{ files.java = ta.value; if(opts.onFilesChanged) opts.onFilesChanged(files); });
      container.querySelector('#runBtn').addEventListener('click', ()=>{
        const res = Validators.simulateJava(files.java);
        const out = container.querySelector('#consoleOut');
        out.innerHTML = (res.lines.length ? res.lines.map(esc).join('\n') : '(no output)') + '\n\n<span style="color:var(--text-faint)">'+esc(res.note)+'</span>';
      });
      return;
    }

    // html / css / js share a similar shape: editable file(s) + live iframe preview
    const showHtml = editorType === 'html';
    const showCss = editorType === 'css';
    const showJs = editorType === 'js';

    let editableLabel = showHtml ? 'index.html' : (showCss ? 'style.css' : 'script.js');
    const contextNote = showCss ? '<div class="pill">HTML is fixed context — edit the CSS</div>'
      : (showJs && files.html ? '<div class="pill">HTML is fixed context — edit the JS</div>' : '');

    container.innerHTML = `
      <div class="editor-wrap">
        <div class="editor-col">
          <div class="editor-labels"><button class="active">${editableLabel}</button></div>
          <textarea class="code-input" spellcheck="false">${esc(showHtml ? (files.html||'') : (showCss ? (files.css||'') : (files.js||'')))}</textarea>
          ${contextNote}
        </div>
        <div class="editor-col">
          <div class="editor-labels"><button class="active">Live Preview</button></div>
          <div class="preview-frame-wrap"><iframe sandbox="allow-scripts"></iframe></div>
          ${showJs ? '<div class="console-out" id="consoleOut">Console output will appear here.</div>' : ''}
        </div>
      </div>`;

    const ta = container.querySelector('textarea');
    const iframe = container.querySelector('iframe');
    const consoleOut = container.querySelector('#consoleOut');
    const frameId = 'f' + Math.random().toString(36).slice(2) + Date.now();

    function refresh(){
      iframe.srcdoc = buildPreviewDoc(files, frameId);
      if(opts.onFilesChanged) opts.onFilesChanged(files);
    }

    let debounceTimer;
    ta.addEventListener('input', ()=>{
      if(showHtml) files.html = ta.value;
      else if(showCss) files.css = ta.value;
      else files.js = ta.value;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(refresh, 250);
    });

    if(showJs){
      window.addEventListener('message', function handler(ev){
        if(!ev.data || !ev.data.__cqlogs || ev.data.frameId !== frameId) return;
        let text = ev.data.logs.join('\n');
        if(ev.data.error) text += (text?'\n':'') + 'Error: ' + ev.data.error;
        consoleOut.textContent = text || '(no console output yet)';
      });
    }

    refresh();
  }

  /* ================= QUIZ ================= */

  function mountQuiz(academyId, academy, state, lesson){
    const area = document.getElementById('quizArea');
    let answers = new Array(lesson.quiz.length).fill(null);
    let submitted = false;

    function draw(){
      area.innerHTML = lesson.quiz.map((q,qi)=>{
        return `<div class="quiz-q">
          <p class="qtext">${qi+1}. ${esc(q.q)}</p>
          <div class="quiz-opts" data-qi="${qi}">
            ${q.options.map((opt,oi)=>{
              let cls = 'quiz-opt';
              if(answers[qi]===oi) cls += ' selected';
              if(submitted){
                if(oi===q.answer) cls += ' correct';
                else if(answers[qi]===oi) cls += ' incorrect';
              }
              return `<button class="${cls}" data-oi="${oi}" ${submitted?'disabled':''}>${esc(opt)}</button>`;
            }).join('')}
          </div>
        </div>`;
      }).join('') + `<button class="btn btn-primary" id="quizSubmit" ${submitted?'disabled':''}>${submitted?'Submitted':'Submit Answers'}</button>
      <div id="quizResult"></div>`;

      if(!submitted){
        area.querySelectorAll('.quiz-opts').forEach(group=>{
          const qi = parseInt(group.getAttribute('data-qi'),10);
          group.querySelectorAll('.quiz-opt').forEach(btn=>{
            btn.addEventListener('click', ()=>{
              answers[qi] = parseInt(btn.getAttribute('data-oi'),10);
              draw();
            });
          });
        });
        const submitBtn = document.getElementById('quizSubmit');
        submitBtn.disabled = answers.some(a=>a===null);
        submitBtn.addEventListener('click', ()=>{
          submitted = true;
          const correct = answers.filter((a,i)=>a===lesson.quiz[i].answer).length;
          const bonus = State.markQuizResult(state, lesson.id, correct, lesson.quiz.length);
          grantXp(academyId, state, bonus);
          grantAchievements(academyId, state);
          persist(academyId, state);
          draw();
          const res = document.getElementById('quizResult');
          res.className = 'quiz-result';
          res.textContent = `Score: ${correct}/${lesson.quiz.length}` + (bonus? `  (+${bonus} XP for a perfect score!)`:'');
        });
      }
    }
    draw();
  }

  /* ================= QUEST ================= */

  function mountQuestEditor(academyId, academy, state, chapter, lesson, buf){
    const container = document.getElementById('questEditor');
    mountEditor(container, lesson.editorType, buf.questFiles, {});

    const runRow = document.createElement('div');
    runRow.className = 'run-row';
    runRow.style.marginTop = '.8rem';
    const already = !!state.completedLessons[lesson.id];
    runRow.innerHTML = `<button class="btn btn-primary" id="questCheck">${already?'✓ Quest Complete — Re-check':'Check Quest'}</button>`;
    container.parentElement.querySelector('#questFeedback').before(runRow);

    document.getElementById('questCheck').addEventListener('click', async ()=>{
      const feedback = document.getElementById('questFeedback');
      feedback.innerHTML = `<div class="quest-feedback">Checking...</div>`;
      let result;
      try{
        result = await lesson.quest.validate(buf.questFiles);
      }catch(e){
        result = { pass:false, message:'Validator error: '+e.message };
      }
      feedback.innerHTML = `<div class="quest-feedback ${result.pass?'pass':'fail'}">${result.pass?'✅':'❌'} ${esc(result.message)}</div>`;
      if(result.pass){
        const wasComplete = !!state.completedLessons[lesson.id];
        let gained = 0;
        gained += State.markLessonComplete(state, lesson.id);
        gained += State.markQuestComplete(state, lesson.id);
        grantXp(academyId, state, gained);
        grantAchievements(academyId, state);
        persist(academyId, state);
        if(!wasComplete){
          toast('🗡️', 'Quest Complete', '+' + gained + ' XP');
        }
      }
    });
  }

  /* ================= BOSS VIEW ================= */

  function renderBoss(academyId, chapterIndex){
    const academy = ACADEMIES[academyId];
    const chapter = academy.chapters[chapterIndex];
    const state = State.load(academyId);

    if(!State.isBossUnlocked(academy, state, chapterIndex)){
      route = { view:'academy', academyId }; render(); return;
    }

    const bossKey = chapter.boss.id;
    if(!editorBuffers[bossKey]){
      editorBuffers[bossKey] = { files: Object.assign({}, chapter.boss.files) };
    }
    const buf = editorBuffers[bossKey];
    const done = !!state.completedBosses[bossKey];

    root().innerHTML = `
      ${renderTopbar(academyId, state)}
      <div class="view">
        <div class="lesson-header">
          <div class="crumb"><button id="crumbBack">← ${esc(chapter.title)}</button></div>
          <span class="pill">Boss Project</span>
        </div>
        <div class="boss-banner">
          <div class="skull">☠️</div>
          <h1 style="margin:.4rem 0;">${esc(chapter.boss.title)}</h1>
          <p style="color:var(--text-dim); max-width:560px; margin:.4rem auto;">${esc(chapter.boss.flavor)}</p>
        </div>
        <div class="panel">
          <h3>Mission Briefing</h3>
          <p style="color:var(--text-dim); line-height:1.6;">${esc(chapter.boss.description)}</p>
        </div>
        <div class="panel">
          <h3>Battle Editor</h3>
          <div id="bossEditor"></div>
          <div class="run-row" style="margin-top:.8rem;"><button class="btn btn-primary" id="bossCheck">${done?'✓ Defeated — Re-check':'⚔️ Engage Boss'}</button></div>
          <div id="bossFeedback"></div>
        </div>
      </div>
    `;
    wireTopbar();
    document.getElementById('crumbBack').addEventListener('click', ()=>{ route={view:'academy', academyId}; render(); });
    mountEditor(document.getElementById('bossEditor'), chapter.boss.editorType, buf.files, {});

    document.getElementById('bossCheck').addEventListener('click', async ()=>{
      const feedback = document.getElementById('bossFeedback');
      feedback.innerHTML = `<div class="quest-feedback">Checking...</div>`;
      let result;
      try{ result = await chapter.boss.validate(buf.files); }
      catch(e){ result = { pass:false, message:'Validator error: '+e.message }; }
      feedback.innerHTML = `<div class="quest-feedback ${result.pass?'pass':'fail'}">${result.pass?'🏆':'❌'} ${esc(result.message)}</div>`;
      if(result.pass){
        const wasDone = !!state.completedBosses[bossKey];
        const gained = State.markBossComplete(state, bossKey);
        grantXp(academyId, state, gained);
        grantAchievements(academyId, state);
        persist(academyId, state);
        if(!wasDone) toast('🏆', 'Boss Defeated', '+' + gained + ' XP');
      }
    });
  }

  /* ================= ROUTER ================= */

  function render(){
    if(route.view === 'home') renderHome();
    else if(route.view === 'academy') renderAcademy(route.academyId);
    else if(route.view === 'lesson') renderLesson(route.academyId, route.chapterIndex, route.lessonIndex);
    else if(route.view === 'boss') renderBoss(route.academyId, route.chapterIndex);
    window.scrollTo(0,0);
  }

  function init(){
    render();
  }

  return { init };
})();
