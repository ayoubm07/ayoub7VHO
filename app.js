// 1. Zorg dat bij het laden van de pagina alleen 'home' zichtbaar is
document.addEventListener("DOMContentLoaded", () => {
  switchTab('home'); 
});

// 2. De onbreekbare tab-wisselaar
function switchTab(tabId) {
  // Verberg ALLE secties keihard
  const allSections = document.querySelectorAll('.tab-content');
  allSections.forEach(sec => {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });

  // Toon ALLEEN de gekozen sectie
  const targetSection = document.getElementById('tab-' + tabId);
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.classList.add('active');
  }

  // Zet de knoppen in het menu goed
  const allNavBtns = document.querySelectorAll('.nav-btn');
  allNavBtns.forEach(btn => btn.classList.remove('active'));
  
  allNavBtns.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
      btn.classList.add('active');
    }
  });

  // Scroll netjes terug naar boven als je wisselt
  window.scrollTo(0, 0);
}

// 3. Doorklikken naar specifiek vak
function openSubject(subjectKey) {
  switchTab('leerstof');
  showSubjectTheory(subjectKey);
}

// 4. Toon theorie per vak
function showSubjectTheory(subjectKey) {
  // Verberg alle theorieblokken
  const blocks = document.querySelectorAll('.theory-block');
  blocks.forEach(block => {
    block.style.display = 'none';
  });

  // Toon alleen het juiste theorieblok
  const selected = document.getElementById('theory-' + subjectKey);
  if (selected) {
    selected.style.display = 'block';
  }
}

// 5. Examenrooster opslag (LocalStorage)
let exams = JSON.parse(localStorage.getItem('ayoub_exams') || '[]');
const examForm = document.getElementById('examForm');
const examList = document.getElementById('examList');

function renderExams() {
  if (!examList) return;
  examList.innerHTML = '';

  if (exams.length === 0) {
    examList.innerHTML = '<p style="color: var(--text-muted);">Nog geen examens ingepland.</p>';
    return;
  }

  exams.forEach((ex, i) => {
    const item = document.createElement('div');
    item.className = 'card';
    item.style.display = 'flex';
    item.style.justifyContent = 'space-between';
    item.innerHTML = `
      <div>
        <strong>${ex.subject}</strong> - <span>${new Date(ex.date).toLocaleString('nl-BE')}</span>
        <small style="color: var(--text-muted); display: block;">${ex.weight || ''}</small>
      </div>
      <button onclick="deleteExam(${i})" style="background:none; border:none; color:#ef4444; cursor:pointer;">Verwijderen</button>
    `;
    examList.appendChild(item);
  });
}

function deleteExam(index) {
  exams.splice(index, 1);
  localStorage.setItem('ayoub_exams', JSON.stringify(exams));
  renderExams();
}

if (examForm) {
  examForm.addEventListener('submit', (e) => {
    e.preventDefault();
    exams.push({
      subject: document.getElementById('examSubject').value,
      date: document.getElementById('examDate').value,
      weight: document.getElementById('examWeight').value
    });
    localStorage.setItem('ayoub_exams', JSON.stringify(exams));
    examForm.reset();
    renderExams();
  });
}

renderExams();

// Toon specifiek hoofdstuk binnen een theorieblok
function showChapter(subject, chapterNum) {
  // 1. Verberg eerst alle hoofdstukken van dit vak
  const chapters = document.querySelectorAll(`.${subject}-chapter`);
  chapters.forEach(ch => {
    ch.style.display = 'none';
  });

  // 2. Toon alleen het hoofdstuk waarop geklikt is
  const selectedChapter = document.getElementById(`${subject}-h${chapterNum}`);
  if (selectedChapter) {
    selectedChapter.style.display = 'block';
  }
}