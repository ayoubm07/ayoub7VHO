// Navigatie tussen secties
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

  const content = document.getElementById('tab-' + tabId);
  if (content) content.classList.add('active');

  const btn = document.querySelector(`.nav-btn[onclick*="${tabId}"]`);
  if (btn) btn.classList.add('active');
}

// Schakelt naar theorie en toont direct het juiste vak
function openSubject(subjectKey) {
  switchTab('leerstof');
  showSubjectTheory(subjectKey);
}

// Toont het gekozen theorieblok en verbergt de rest
function showSubjectTheory(subjectKey) {
  document.querySelectorAll('.theory-block').forEach(el => {
    el.style.display = 'none';
  });

  const selected = document.getElementById('theory-' + subjectKey);
  if (selected) {
    selected.style.display = 'block';
  }
}
  switchTab('leerstof');
  console.log("Vak geopend:", subjectKey);
}

// Examenrooster opslag
let exams = JSON.parse(localStorage.getItem('ayoub_exams') || '[]');

const examForm = document.getElementById('examForm');
const examList = document.getElementById('examList');

function renderExams() {
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