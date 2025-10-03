// script.js

// ----------- دعم اللغتين العربية والإنجليزية -----------
const translations = {
  ar: {
    nav_focus: "التركيز",
    nav_health: "الصحة",
    nav_productivity: "الإنتاجية",
    nav_breathing: "التنفس",
    nav_ai: "ذكاء اصطناعي",
    nav_rewards: "المكافآت",
    nav_mood: "الشعور",
    focus_title: "مؤقت التركيز",
    start: "ابدأ",
    pause: "إيقاف مؤقت",
    reset: "إعادة",
    focus_duration: "مدة الجلسة (دقيقة):",
    health_title: "متابعة الصحة",
    water_intake: "كمية الماء (مل):",
    exercise_duration: "مدة الرياضة (دقيقة):",
    add_record: "إضافة",
    date: "التاريخ",
    water: "ماء (مل)",
    exercise: "رياضة (د)",
    remove: "حذف",
    productivity_title: "مهام اليوم",
    task_placeholder: "أضف مهمة جديدة...",
    add: "إضافة",
    breathing_title: "تمارين التنفس",
    start_breathing: "ابدأ التمرين",
    ai_title: "مساعد الذكاء الاصطناعي",
    ai_placeholder: "اكتب سؤالك أو اطلب نصيحة للصحة أو التركيز...",
    ask_ai: "اسأل الذكاء الاصطناعي",
    rewards_title: "نظام المكافآت",
    earned_points: "النقاط: ",
    reward_focus: "🎁 أكمل جلسة تركيز — 5 نقاط",
    reward_tasks: "🎁 أنجز جميع المهام اليومية — 10 نقاط",
    reward_mood: "🎁 تحديث مؤشر شعورك يومياً — 2 نقطة",
    mood_title: "مؤشر الشعور",
    footer_text: "مساعد صحي وتركيزي - يدعم العربية والإنجليزية"
  },
  en: {
    nav_focus: "Focus",
    nav_health: "Health",
    nav_productivity: "Productivity",
    nav_breathing: "Breathing",
    nav_ai: "AI Assistant",
    nav_rewards: "Rewards",
    nav_mood: "Mood",
    focus_title: "Focus Timer",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    focus_duration: "Focus Duration (min):",
    health_title: "Health Tracking",
    water_intake: "Water Intake (ml):",
    exercise_duration: "Exercise Duration (min):",
    add_record: "Add",
    date: "Date",
    water: "Water (ml)",
    exercise: "Exercise (min)",
    remove: "Remove",
    productivity_title: "Today's Tasks",
    task_placeholder: "Add a new task...",
    add: "Add",
    breathing_title: "Breathing Exercises",
    start_breathing: "Start Exercise",
    ai_title: "AI Assistant",
    ai_placeholder: "Write your question or ask for health/focus advice...",
    ask_ai: "Ask AI",
    rewards_title: "Rewards System",
    earned_points: "Points: ",
    reward_focus: "🎁 Complete a focus session — 5 pts",
    reward_tasks: "🎁 Finish all daily tasks — 10 pts",
    reward_mood: "🎁 Update your mood daily — 2 pts",
    mood_title: "Mood Tracker",
    footer_text: "Health & Focus Assistant - Supports Arabic & English"
  }
};

// ----------- إعداد وتبديل اللغة -----------
let currentLang = localStorage.getItem('lang') || 'ar';
document.body.setAttribute('lang', currentLang);

// دالة تحديث الترجمة لكل العناصر الحاوية لـdata-i18n
function updateTranslations() {
  const t = translations[currentLang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
  // تحديث placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key]) el.setAttribute('placeholder', t[key]);
  });
  // تغيير اتجاه الصفحة
  document.body.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
  document.getElementById('lang-btn').textContent = currentLang === 'ar' ? 'EN' : 'AR';
}
updateTranslations();

document.getElementById('lang-btn').onclick = function() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('lang', currentLang);
  document.body.setAttribute('lang', currentLang);
  updateTranslations();
};

// ----------- الوضع الداكن والفاتح -----------
const themeBtn = document.getElementById('theme-btn');
function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  document.getElementById('theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
}
let savedTheme = localStorage.getItem('theme');
if (!savedTheme) {
  savedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
setTheme(savedTheme);

themeBtn.onclick = function() {
  const nextTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
};

// ----------- مؤقت التركيز (Focus Timer) -----------
let timer = null, secondsLeft = 0, isPaused = false;
const timerDisplay = document.getElementById('timer-display');
const sessionInput = document.getElementById('session-minutes');
const startBtn = document.getElementById('start-timer');
const pauseBtn = document.getElementById('pause-timer');
const resetBtn = document.getElementById('reset-timer');

function updateTimerDisplay() {
  const min = String(Math.floor(secondsLeft/60)).padStart(2, '0');
  const sec = String(secondsLeft%60).padStart(2, '0');
  timerDisplay.textContent = `${min}:${sec}`;
}
function startFocusTimer() {
  if(timer) clearInterval(timer);
  secondsLeft = parseInt(sessionInput.value, 10) * 60;
  updateTimerDisplay();
  isPaused = false;
  timer = setInterval(() => {
    if (!isPaused) {
      if (secondsLeft > 0) {
        secondsLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timer);
        playSound(); // تنبيه صوتي عند انتهاء المؤقت
        rewardPoints(5);
        alert(currentLang === 'ar' ? "انتهت جلسة التركيز! 🎉" : "Focus session finished! 🎉");
      }
    }
  }, 1000);
}
function pauseFocusTimer() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? (currentLang==='ar' ?"استئناف":"Resume") : (currentLang==='ar' ? "إيقاف مؤقت":"Pause");
}
function resetFocusTimer() {
  clearInterval(timer);
  secondsLeft = parseInt(sessionInput.value, 10) * 60;
  updateTimerDisplay();
}

startBtn.onclick = startFocusTimer;
pauseBtn.onclick = pauseFocusTimer;
resetBtn.onclick = resetFocusTimer;
sessionInput.onchange = resetFocusTimer;

// ----------- متابعة الصحة (ماء / رياضة) -----------
let healthData = JSON.parse(localStorage.getItem('healthData')) || [];
const healthForm = document.getElementById('health-form');
const healthTableBody = document.querySelector('#health-table tbody');

function renderHealthTable() {
  healthTableBody.innerHTML = '';
  healthData.forEach((item, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${item.date}</td><td>${item.water}</td><td>${item.exercise}</td>
    <td><button data-index="${i}">❌</button></td>`;
    healthTableBody.appendChild(row);
  });
}
healthForm.onsubmit = function(e) {
  e.preventDefault();
  const date = new Date().toLocaleDateString(currentLang);
  const water = document.getElementById('water').value;
  const exercise = document.getElementById('exercise').value;
  if (water || exercise) {
    healthData.unshift({date, water, exercise});
    localStorage.setItem('healthData', JSON.stringify(healthData));
    renderHealthTable();
    rewardPoints(1);
  }
  healthForm.reset();
}
healthTableBody.onclick = function(e) {
  if(e.target.tagName === 'BUTTON') {
    const idx = e.target.getAttribute('data-index');
    healthData.splice(idx, 1);
    localStorage.setItem('healthData', JSON.stringify(healthData));
    renderHealthTable();
  }
};
renderHealthTable();

// ----------- قائمة المهام اليومية (Todo) -----------
let todoList = JSON.parse(localStorage.getItem('todoList')) || [];
const todoForm = document.getElementById('todo-form');
const todoUl = document.getElementById('todo-list');

function renderTodoList() {
  todoUl.innerHTML = '';
  todoList.forEach((task, i) => {
    const li = document.createElement('li');
    li.className = task.done ? 'completed' : '';
    li.innerHTML = `<span>${task.text}</span>
      <span>
      <button data-action="done" data-index="${i}">${task.done ? '✔️':'✅'}</button>
      <button data-action="remove" data-index="${i}">❌</button>
      </span>`;
    todoUl.appendChild(li);
  });
  // تحقق إذا كانت كل المهام مكتملة
  if(todoList.length && todoList.every(t=>t.done)) rewardPoints(10);
}
todoForm.onsubmit = function(e) {
  e.preventDefault();
  const inpt = document.getElementById('new-task');
  const text = inpt.value.trim();
  if (text) {
    todoList.push({text, done:false});
    localStorage.setItem('todoList',JSON.stringify(todoList));
    renderTodoList();
    inpt.value = '';
  }
};
todoUl.onclick = function(e) {
  if(e.target.tagName==='BUTTON') {
    const action = e.target.getAttribute('data-action');
    const idx = +e.target.getAttribute('data-index');
    if(action==='done') {
      todoList[idx].done = !todoList[idx].done;
    } else if(action==='remove') {
      todoList.splice(idx,1);
    }
    localStorage.setItem('todoList',JSON.stringify(todoList));
    renderTodoList();
  }
}
renderTodoList();

// ---------- تمارين التنفس المرئية ----------
const breathBtn = document.getElementById('breath-btn');
const breathVisual = document.getElementById('breath-visual');
const breathInstructions = document.getElementById('breath-instructions');
let breathingActive = false, breathingStep=0;
const breathingSteps = [
  {txt_ar:'شهيق',txt_en:'Inhale', sec:4, css:'inhale'},
  {txt_ar:'حبس النفس',txt_en:'Hold', sec:7, css:'hold'},
  {txt_ar:'زفير',txt_en:'Exhale', sec:8, css:'exhale'},
];
function breathingSeq(i) {
  if (!breathingActive) return;
  const st = breathingSteps[i % breathingSteps.length];
  breathVisual.style.transform = st.css==='inhale'
    ? 'scale(1.4)' : st.css==='exhale' ? 'scale(1)' : 'scale(1.17)';
  breathInstructions.textContent = currentLang==='ar'?st.txt_ar:st.txt_en;
  let count = st.sec;
  breathVisual.textContent = count;
  let seqInt = setInterval(()=>{
    if(--count === 0) {
      clearInterval(seqInt);
      // خطوة جديدة
      breathVisual.textContent = '';
      breathingSeq(++i);
    } else {
      breathVisual.textContent = count;
    }
  }, 1000);
}
breathBtn.onclick = function() {
  breathingActive = !breathingActive;
  if(breathingActive){
    breathBtn.textContent = currentLang === 'ar' ? 'إيقاف' : 'Stop';
    breathingSeq(0);
    rewardPoints(1);
  } else {
    breathInstructions.textContent = '';
    breathVisual.textContent = '';
    breathVisual.style.transform = 'scale(1)';
    breathBtn.textContent = translations[currentLang]['start_breathing'];
  }
};

// ----------- الذكاء الاصطناعي (محاكاة عبر واجهة API عامة/وهمية) -----------
const aiForm = document.getElementById('ai-form');
const aiInput = document.getElementById('ai-input');
const aiResponse = document.getElementById('ai-response');

aiForm.onsubmit = async function(e) {
  e.preventDefault();
  const msg = aiInput.value.trim();
  aiResponse.textContent = (currentLang === 'ar') ?
   "جاري التفكير..." : "Thinking ...";
  // محاكاة إجابة ذكاء اصطناعي
  setTimeout(()=>{
    // الرد ممكن تعديله لاحقاً عبر أي API حقيقي
    aiResponse.innerHTML = (currentLang === 'ar') ?
     "نصيحة: خذ قسطاً من الراحة واشرب الماء ونظم جدولك. ❤️" :
     "Tip: Take a break, drink water, and organize your schedule. ❤️";
    rewardPoints(1);
  }, 1700);
  aiInput.value = '';
}

// ----------- نظام المكافآت والنقاط -----------
let points = parseInt(localStorage.getItem('points') || '0', 10);
const pointsSummary = document.getElementById('points-summary');
function updatePointsDisplay() {
  pointsSummary.textContent = translations[currentLang]['earned_points'] + points + " 🎉";
}
function rewardPoints(amount) {
  points += amount;
  localStorage.setItem('points', points);
  updatePointsDisplay();
}
updatePointsDisplay();

// ----------- مؤشر الشعور و تاريخه -----------
let moodHistory = JSON.parse(localStorage.getItem('moodHistory') || '[]');
const moodBtns = document.querySelectorAll('.mood-btn');
const moodHistoryDiv = document.getElementById('mood-history');
moodBtns.forEach(btn =>{
  btn.onclick = function() {
    document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    // سجل شعور اليوم (نحتفظ بآخر 7 أيام)
    const entry = {
      date: new Date().toLocaleDateString(currentLang),
      mood: btn.dataset.mood
    };
    moodHistory.unshift(entry);
    moodHistory = moodHistory.slice(0,7);
    localStorage.setItem('moodHistory',JSON.stringify(moodHistory));
    renderMoodHistory();
    rewardPoints(2);
  };
});
function renderMoodHistory() {
  if(moodHistory.length==0) {
    moodHistoryDiv.textContent = (currentLang==='ar')?"لا يوجد تحديث لمؤشر الشعور.":"No mood updates yet.";
    return;
  }
  let txt = moodHistory.map(entry =>
    `<span title="${entry.date}">${moodEmoji(entry.mood)}</span>`
  ).join(' ');
  moodHistoryDiv.innerHTML = (currentLang==='ar' ? "آخر المشاعر: " : "Recent moods: ") + txt;
}
function moodEmoji(mood) {
  switch(mood) {
    case 'happy': return '😊';
    case 'neutral': return '😐';
    case 'sad': return '😢';
    case 'stress': return '😫';
    default: return '';
  }
}
renderMoodHistory();

// ----------- صوت تنبيه عند نهاية المؤقت -----------
function playSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const o = ctx.createOscillator();
  o.type='sine'; o.frequency.value=600;
  o.connect(ctx.destination); o.start();
  setTimeout(()=>{o.stop();ctx.close();},350);
}

// ----------- التحديث عند تبديل اللغة أو موضوع الصفحة -----------
function globalReactiveUI() {
  updatePointsDisplay();
  renderMoodHistory();
  renderHealthTable();
  renderTodoList();
  pauseBtn.textContent = isPaused ? (currentLang==='ar' ? "استئناف":"Resume") : translations[currentLang]['pause'];
  // تحديث نصوص أزرار التنفس
  breathBtn.textContent = breathingActive
      ? (currentLang==='ar'? 'إيقاف':'Stop')
      : translations[currentLang]['start_breathing'];
  // ... وغيرهم حسب الحاجة
}
const obs = new MutationObserver(globalReactiveUI);
obs.observe(document.body, {attributes:true, attributeFilter:["lang","data-theme"]});