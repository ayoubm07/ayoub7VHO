/// Centrale tabnavigatie
function switchTab(tabId) {
  // Verwijder active klasse op alle knoppen en secties
  document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(section => section.classList.remove('active'));

  // Activeer gekozen sectie
  const targetSection = document.getElementById('tab-' + tabId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  // Activeer bijbehorende menuknop bovenaan
  const targetBtn = document.querySelector(`.nav-btn[onclick*="${tabId}"]`);
  if (targetBtn) {
    targetBtn.classList.add('active');
  }
}

// Doorklikken vanaf de homepage naar een specifiek vak
function openSubject(subjectKey) {
  switchTab('leerstof');
  showSubjectTheory(subjectKey);
}

// Toon alleen het geselecteerde theorieblok
function showSubjectTheory(subjectKey) {
  document.querySelectorAll('.theory-block').forEach(block => {
    block.style.display = 'none';
  });

  const selected = document.getElementById('theory-' + subjectKey);
  if (selected) {
    selected.style.display = 'block';
  }
}

// Examenrooster opslag (LocalStorage)
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