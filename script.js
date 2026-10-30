/* ==========================================================
   Why-Path — script.js
   Vanilla JS. All quiz + notebook data at the top.
   ========================================================== */

// ============================================================
// QUIZ DATA — 5 maths questions with concept tags
// ============================================================
const QUIZ_DATA = [
  {
    id: 1,
    concept: "Order of Operations (BODMAS)",
    question: "What is the value of  3 + 4 × 2 ?",
    options: ["14", "11", "10", "24"],
    answer: 1,                       // index of correct option
    explanationCorrect: "Correct! Multiplication before addition: 4 × 2 = 8, then 3 + 8 = 11.",
    explanationWrong: "Remember BODMAS — multiplication comes before addition. 4 × 2 = 8, then 3 + 8 = 11."
  },
  {
    id: 2,
    concept: "Fractions — Addition",
    question: "What is  1/3 + 1/6 ?",
    options: ["1/2", "2/9", "1/9", "2/6"],
    answer: 0,
    explanationCorrect: "Correct! LCM of 3 and 6 is 6: 2/6 + 1/6 = 3/6 = 1/2.",
    explanationWrong: "Find a common denominator. LCM(3, 6) = 6 → 2/6 + 1/6 = 3/6 = 1/2."
  },
  {
    id: 3,
    concept: "Solving Linear Equations",
    question: "Solve for x:  2x + 5 = 13",
    options: ["x = 3", "x = 4", "x = 9", "x = 6"],
    answer: 1,
    explanationCorrect: "Correct! Subtract 5: 2x = 8, divide by 2: x = 4.",
    explanationWrong: "Subtract 5 from both sides: 2x = 8. Then divide by 2: x = 4."
  },
  {
    id: 4,
    concept: "Percentages",
    question: "What is 25% of 240?",
    options: ["48", "60", "80", "50"],
    answer: 1,
    explanationCorrect: "Correct! 25% = 1/4, and 240 ÷ 4 = 60.",
    explanationWrong: "25% means one quarter. 240 ÷ 4 = 60."
  },
  {
    id: 5,
    concept: "Area of a Triangle",
    question: "A triangle has base 10 cm and height 6 cm. What is its area?",
    options: ["60 cm²", "30 cm²", "16 cm²", "36 cm²"],
    answer: 1,
    explanationCorrect: "Correct! Area = ½ × base × height = ½ × 10 × 6 = 30 cm².",
    explanationWrong: "Area of a triangle = ½ × base × height = ½ × 10 × 6 = 30 cm²."
  }
];

// Topic strength data (mock, recalculated after quiz)
const TOPIC_STRENGTHS_BASE = {
  "Order of Operations (BODMAS)": 70,
  "Fractions — Addition": 55,
  "Solving Linear Equations": 80,
  "Percentages": 65,
  "Area of a Triangle": 45
};

// ============================================================
// NOTEBOOK DATA — sample notes and canned Q&A
// ============================================================
const NOTEBOOK_NOTES = `[1] Newton's First Law (Law of Inertia): An object at rest stays at rest, and an object in motion stays in motion at constant velocity, unless acted upon by a net external force.

[2] Newton's Second Law: The acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. Mathematically, F = ma.

[3] Newton's Third Law: For every action, there is an equal and opposite reaction. When object A exerts a force on object B, object B simultaneously exerts a force equal in magnitude and opposite in direction on object A.

[4] Friction: A contact force that opposes the relative motion or tendency of motion between two surfaces. Static friction prevents motion; kinetic friction acts during motion.

[5] Momentum: The product of an object's mass and velocity (p = mv). The law of conservation of momentum states that total momentum in an isolated system remains constant.`;

const NOTEBOOK_QA = [
  {
    keywords: ["newton", "second", "law", "f=ma", "force"],
    answer: "Newton's Second Law states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This is expressed as <strong>F = ma</strong>. <span class='ref-marker'>2</span>",
    references: "Source: Note [2]"
  },
  {
    keywords: ["first", "inertia"],
    answer: "Newton's First Law, also called the <strong>Law of Inertia</strong>, states that an object at rest stays at rest, and an object in motion stays in motion at a constant velocity, unless acted upon by a net external force. <span class='ref-marker'>1</span>",
    references: "Source: Note [1]"
  },
  {
    keywords: ["third", "action", "reaction"],
    answer: "Newton's Third Law states that for every action there is an <strong>equal and opposite reaction</strong>. When object A pushes on object B, object B pushes back on A with equal force in the opposite direction. <span class='ref-marker'>3</span>",
    references: "Source: Note [3]"
  },
  {
    keywords: ["friction", "static", "kinetic"],
    answer: "Friction is a contact force that opposes relative motion between two surfaces. <strong>Static friction</strong> prevents motion from starting, while <strong>kinetic friction</strong> acts on objects already in motion. <span class='ref-marker'>4</span>",
    references: "Source: Note [4]"
  },
  {
    keywords: ["momentum", "conservation", "p=mv"],
    answer: "Momentum is defined as <strong>p = mv</strong> (mass × velocity). The law of conservation of momentum states that the total momentum of an isolated system remains constant — no momentum is gained or lost. <span class='ref-marker'>5</span>",
    references: "Source: Note [5]"
  }
];

const SUGGESTED_QUESTIONS = [
  "What is Newton's second law?",
  "Explain friction",
  "What is momentum?",
  "What is the law of inertia?"
];

// ============================================================
// DOM READY
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFadeIn();
  initDemoTabs();
  initQuiz();
  initNotebook();
});

// ============================================================
// NAVIGATION — mobile toggle + auto-close on link click
// ============================================================
function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("main-nav");

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
  });

  // Close nav when a link is clicked (mobile)
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
    });
  });
}

// ============================================================
// FADE-IN ON SCROLL — simple IntersectionObserver
// ============================================================
function initFadeIn() {
  // Respect prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
}

// ============================================================
// DEMO TABS
// ============================================================
function initDemoTabs() {
  const tabs = document.querySelectorAll(".demo-tab");
  const panels = document.querySelectorAll(".demo-panel");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
      panels.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });
}

// ============================================================
// QUIZ ENGINE
// ============================================================
function initQuiz() {
  let currentQ = 0;
  let userAnswers = [];     // stores { questionIndex, selectedOption, correct }

  const questionArea = document.getElementById("quiz-question-area");
  const resultsArea  = document.getElementById("quiz-results");
  const questionEl   = document.getElementById("quiz-question");
  const optionsEl    = document.getElementById("quiz-options");
  const nextBtn      = document.getElementById("quiz-next");
  const progressText = document.getElementById("quiz-progress-text");
  const progressFill = document.getElementById("quiz-progress-fill");
  const restartBtn   = document.getElementById("quiz-restart");

  renderQuestion();

  /* Render a question */
  function renderQuestion() {
    const q = QUIZ_DATA[currentQ];
    questionEl.textContent = q.question;
    optionsEl.innerHTML = "";
    nextBtn.disabled = true;

    q.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = opt;
      btn.type = "button";
      btn.addEventListener("click", () => selectOption(i, btn));
      optionsEl.appendChild(btn);
    });

    progressText.textContent = `Question ${currentQ + 1} of ${QUIZ_DATA.length}`;
    progressFill.style.width = `${((currentQ + 1) / QUIZ_DATA.length) * 100}%`;
  }

  /* Handle option selection */
  function selectOption(idx, btn) {
    const q = QUIZ_DATA[currentQ];
    const buttons = optionsEl.querySelectorAll(".quiz-option");

    // Disable all
    buttons.forEach(b => { b.disabled = true; b.classList.remove("selected"); });

    const correct = idx === q.answer;
    btn.classList.add(correct ? "correct" : "wrong");
    if (!correct) buttons[q.answer].classList.add("correct");

    userAnswers.push({ questionIndex: currentQ, selectedOption: idx, correct });
    nextBtn.disabled = false;
  }

  /* Next / finish */
  nextBtn.addEventListener("click", () => {
    currentQ++;
    if (currentQ < QUIZ_DATA.length) {
      renderQuestion();
    } else {
      showResults();
    }
  });

  /* Show results */
  function showResults() {
    questionArea.classList.add("hidden");
    resultsArea.classList.remove("hidden");

    const score = userAnswers.filter(a => a.correct).length;
    document.getElementById("quiz-score").textContent =
      `You scored ${score} out of ${QUIZ_DATA.length}.`;

    // Concept-level feedback
    const fbContainer = document.getElementById("quiz-feedback");
    fbContainer.innerHTML = "";
    userAnswers.forEach(a => {
      const q = QUIZ_DATA[a.questionIndex];
      const div = document.createElement("div");
      div.className = "concept-fb " + (a.correct ? "pass" : "fail");
      div.innerHTML = `<strong>${q.concept}</strong>: ${a.correct ? q.explanationCorrect : q.explanationWrong}`;
      fbContainer.appendChild(div);
    });

    // Strength bars
    const strengthContainer = document.getElementById("quiz-strengths");
    strengthContainer.innerHTML = "";
    const strengths = { ...TOPIC_STRENGTHS_BASE };
    userAnswers.forEach(a => {
      const concept = QUIZ_DATA[a.questionIndex].concept;
      strengths[concept] = a.correct
        ? Math.min(100, strengths[concept] + 20)
        : Math.max(0, strengths[concept] - 25);
    });
    Object.entries(strengths).forEach(([topic, pct]) => {
      const color = pct >= 70 ? "var(--color-success)" : pct >= 40 ? "var(--color-warning)" : "var(--color-danger)";
      const row = document.createElement("div");
      row.className = "strength-row";
      row.innerHTML = `
        <span class="strength-label">${topic}</span>
        <div class="strength-bar-bg"><div class="strength-bar-fg" style="width:${pct}%;background:${color}"></div></div>
        <span class="strength-val">${pct}%</span>`;
      strengthContainer.appendChild(row);
    });

    // Learning path (focus on weak concepts)
    const pathEl = document.getElementById("quiz-path");
    pathEl.innerHTML = "";
    const weakTopics = Object.entries(strengths)
      .filter(([, pct]) => pct < 70)
      .sort((a, b) => a[1] - b[1]);

    if (weakTopics.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Great job — all topics are strong! Keep practising to maintain mastery.";
      pathEl.appendChild(li);
    } else {
      // Build a meaningful learning path
      const pathSteps = [];
      weakTopics.forEach(([topic]) => {
        pathSteps.push(`Review fundamentals of "${topic}"`);
        pathSteps.push(`Practice 5 targeted problems on "${topic}"`);
      });
      pathSteps.push("Re-take the diagnostic quiz to measure improvement");

      pathSteps.forEach(step => {
        const li = document.createElement("li");
        li.textContent = step;
        pathEl.appendChild(li);
      });
    }
  }

  /* Restart */
  restartBtn.addEventListener("click", () => {
    currentQ = 0;
    userAnswers = [];
    resultsArea.classList.add("hidden");
    questionArea.classList.remove("hidden");
    renderQuestion();
  });
}

// ============================================================
// NOTEBOOK ENGINE
// ============================================================
function initNotebook() {
  const notesEl    = document.getElementById("notebook-notes");
  const messagesEl = document.getElementById("chat-messages");
  const inputEl    = document.getElementById("chat-input");
  const sendBtn    = document.getElementById("chat-send");
  const suggestEl  = document.getElementById("suggested-questions");

  // Display notes
  notesEl.textContent = NOTEBOOK_NOTES;

  // Render suggested questions
  SUGGESTED_QUESTIONS.forEach(q => {
    const btn = document.createElement("button");
    btn.className = "suggested-q";
    btn.textContent = q;
    btn.type = "button";
    btn.addEventListener("click", () => {
      inputEl.value = q;
      handleSend();
    });
    suggestEl.appendChild(btn);
  });

  // Send handler
  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, "user");
    inputEl.value = "";

    // Match against canned Q&A
    const lower = text.toLowerCase();
    const match = NOTEBOOK_QA.find(qa =>
      qa.keywords.some(kw => lower.includes(kw))
    );

    if (match) {
      // Simulate brief typing delay
      setTimeout(() => {
        addMessage(match.answer + `<br><small style="color:var(--color-text-muted)">${match.references}</small>`, "assistant");
      }, 400);
    } else {
      setTimeout(() => {
        addMessage(
          "I couldn't find a specific answer in your notes for that question. Try asking about Newton's laws, friction, or momentum.",
          "assistant"
        );
      }, 400);
    }
  }

  function addMessage(html, role) {
    const div = document.createElement("div");
    div.className = "chat-msg " + role;
    div.innerHTML = html;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  sendBtn.addEventListener("click", handleSend);
  inputEl.addEventListener("keydown", e => {
    if (e.key === "Enter") handleSend();
  });
}
