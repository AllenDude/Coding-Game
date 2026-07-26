/* =========================================================
   state.js — persistence & gamification logic.
   Each academy ("web" / "java") gets its own independent
   localStorage key, so progress, XP, streaks and achievements
   never mix between the two.
   ========================================================= */

const State = (() => {

  const KEY_PREFIX = 'codequest_';
  const XP_PER_LEVEL = 150;
  const XP_LESSON = 20;
  const XP_QUEST = 30;
  const XP_BOSS = 100;
  const XP_QUIZ_PERFECT_BONUS = 10;

  function key(academyId){ return KEY_PREFIX + academyId; }

  function defaultState(){
    return {
      xp: 0,
      streak: 0,
      lastActive: null,           // 'YYYY-MM-DD'
      completedLessons: {},       // { lessonId: true }
      completedQuests: {},        // { lessonId: true }
      completedBosses: {},        // { chapterId: true }
      quizPerfect: {},            // { lessonId: true } scored 100%
      achievements: {},           // { achievementId: true }
      openChapter: null
    };
  }

  function load(academyId){
    try{
      const raw = localStorage.getItem(key(academyId));
      if(!raw) return defaultState();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultState(), parsed);
    }catch(e){
      console.warn('CodeQuest: could not read saved progress, starting fresh.', e);
      return defaultState();
    }
  }

  function save(academyId, state){
    try{
      localStorage.setItem(key(academyId), JSON.stringify(state));
    }catch(e){
      console.warn('CodeQuest: could not save progress (storage may be full/disabled).', e);
    }
  }

  function todayStr(){
    const d = new Date();
    return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
  }

  /** Call once per active session to update the daily streak. */
  function touchStreak(state){
    const today = todayStr();
    if(state.lastActive === today) return { changed:false };
    const y = new Date(); y.setDate(y.getDate()-1);
    const yesterday = y.getFullYear()+'-'+(y.getMonth()+1)+'-'+y.getDate();
    if(state.lastActive === yesterday){
      state.streak = (state.streak||0) + 1;
    } else {
      state.streak = 1;
    }
    state.lastActive = today;
    return { changed:true, streak: state.streak };
  }

  function levelInfo(xp){
    const level = Math.floor(xp / XP_PER_LEVEL) + 1;
    const into = xp % XP_PER_LEVEL;
    return { level, into, need: XP_PER_LEVEL, pct: Math.round((into/XP_PER_LEVEL)*100) };
  }

  /** Add XP and report whether a level-up occurred (before/after levels differ). */
  function addXp(state, amount){
    const before = levelInfo(state.xp).level;
    state.xp += amount;
    const after = levelInfo(state.xp).level;
    return { leveledUp: after > before, from: before, to: after };
  }

  function markLessonComplete(state, lessonId){
    if(state.completedLessons[lessonId]) return 0;
    state.completedLessons[lessonId] = true;
    return XP_LESSON;
  }

  function markQuestComplete(state, lessonId){
    if(state.completedQuests[lessonId]) return 0;
    state.completedQuests[lessonId] = true;
    return XP_QUEST;
  }

  function markBossComplete(state, chapterId){
    if(state.completedBosses[chapterId]) return 0;
    state.completedBosses[chapterId] = true;
    return XP_BOSS;
  }

  function markQuizResult(state, lessonId, correct, total){
    let bonus = 0;
    if(correct === total && !state.quizPerfect[lessonId]){
      state.quizPerfect[lessonId] = true;
      bonus = XP_QUIZ_PERFECT_BONUS;
    }
    return bonus;
  }

  /* ---------------- Unlock logic ---------------- */

  function isChapterUnlocked(academy, state, chapterIndex){
    if(chapterIndex === 0) return true;
    const prev = academy.chapters[chapterIndex - 1];
    return !!state.completedBosses[prev.boss.id];
  }

  function isLessonUnlocked(academy, state, chapterIndex, lessonIndex){
    if(!isChapterUnlocked(academy, state, chapterIndex)) return false;
    if(lessonIndex === 0) return true;
    const prevLesson = academy.chapters[chapterIndex].lessons[lessonIndex - 1];
    return !!state.completedLessons[prevLesson.id];
  }

  function isBossUnlocked(academy, state, chapterIndex){
    if(!isChapterUnlocked(academy, state, chapterIndex)) return false;
    const chap = academy.chapters[chapterIndex];
    return chap.lessons.every(l => state.completedLessons[l.id]);
  }

  function totalUnits(academy){
    return academy.chapters.reduce((sum, c) => sum + c.lessons.length + 1, 0); // +1 for boss
  }

  function completedUnits(state, academy){
    let n = 0;
    academy.chapters.forEach(c=>{
      c.lessons.forEach(l=>{ if(state.completedLessons[l.id]) n++; });
      if(state.completedBosses[c.boss.id]) n++;
    });
    return n;
  }

  function completionPct(state, academy){
    const total = totalUnits(academy);
    if(total === 0) return 0;
    return Math.round((completedUnits(state, academy)/total)*100);
  }

  /* ---------------- Achievements ---------------- */

  const ACHIEVEMENT_DEFS = [
    { id:'first-blood', name:'First Signal', desc:'Complete your first lesson', icon:'🛰️',
      test:(s)=> Object.keys(s.completedLessons).length >= 1 },
    { id:'quest-x5', name:'Quest Runner', desc:'Complete 5 quests', icon:'🗡️',
      test:(s)=> Object.keys(s.completedQuests).length >= 5 },
    { id:'quest-x10', name:'Quest Master', desc:'Complete 10 quests', icon:'⚔️',
      test:(s)=> Object.keys(s.completedQuests).length >= 10 },
    { id:'boss-first', name:'Boss Slayer', desc:'Defeat your first boss', icon:'🐉',
      test:(s)=> Object.keys(s.completedBosses).length >= 1 },
    { id:'boss-all', name:'Champion', desc:'Defeat every boss in this academy', icon:'👑',
      test:(s,academy)=> Object.keys(s.completedBosses).length >= academy.chapters.length },
    { id:'chapter-1', name:'Chapter Closed', desc:'Fully complete a chapter', icon:'📘',
      test:(s,academy)=> academy.chapters.some(c => c.lessons.every(l=>s.completedLessons[l.id]) && s.completedBosses[c.boss.id]) },
    { id:'streak-3', name:'Consistent Cadet', desc:'3-day streak', icon:'🔥',
      test:(s)=> s.streak >= 3 },
    { id:'streak-7', name:'Unstoppable', desc:'7-day streak', icon:'🌟',
      test:(s)=> s.streak >= 7 },
    { id:'xp-500', name:'Centurion', desc:'Reach 500 XP', icon:'💠',
      test:(s)=> s.xp >= 500 },
    { id:'xp-1000', name:'Grandmaster', desc:'Reach 1000 XP', icon:'💎',
      test:(s)=> s.xp >= 1000 },
    { id:'perfect-3', name:'Sharp Mind', desc:'Score 100% on 3 quizzes', icon:'🧠',
      test:(s)=> Object.keys(s.quizPerfect).length >= 3 },
    { id:'academy-complete', name:'Academy Graduate', desc:'Complete every chapter', icon:'🎓',
      test:(s,academy)=> completionPct(s, academy) >= 100 }
  ];

  /** Returns newly unlocked achievement definitions (and mutates state to record them). */
  function checkAchievements(state, academy){
    const unlocked = [];
    ACHIEVEMENT_DEFS.forEach(def=>{
      if(state.achievements[def.id]) return;
      if(def.test(state, academy)){
        state.achievements[def.id] = true;
        unlocked.push(def);
      }
    });
    return unlocked;
  }

  /* ---------------- Export / Import (for GitHub Pages hosting,
     where there's no backend — progress backup is a plain JSON
     file the user downloads/uploads themselves) ---------------- */

  function exportAll(){
    return {
      app: 'CodeQuest',
      version: 1,
      exportedAt: new Date().toISOString(),
      web: load('web'),
      java: load('java')
    };
  }

  /** Validates & writes an imported backup. Returns {ok, message}. */
  function importAll(obj){
    if(!obj || typeof obj !== 'object'){
      return { ok:false, message:'That file doesn\'t look like a CodeQuest backup.' };
    }
    const hasWeb = obj.web && typeof obj.web === 'object';
    const hasJava = obj.java && typeof obj.java === 'object';
    if(!hasWeb && !hasJava){
      return { ok:false, message:'No recognizable "web" or "java" progress found in this file.' };
    }
    if(hasWeb) save('web', Object.assign(defaultState(), obj.web));
    if(hasJava) save('java', Object.assign(defaultState(), obj.java));
    return { ok:true, message:'Progress restored for ' + [hasWeb&&'Web Dev', hasJava&&'Java'].filter(Boolean).join(' & ') + '.' };
  }
  return {
    XP_LESSON, XP_QUEST, XP_BOSS,
    exportAll, importAll,
    load, save, touchStreak, levelInfo, addXp,
    markLessonComplete, markQuestComplete, markBossComplete, markQuizResult,
    isChapterUnlocked, isLessonUnlocked, isBossUnlocked,
    totalUnits, completedUnits, completionPct,
    ACHIEVEMENT_DEFS, checkAchievements
  };
})();
