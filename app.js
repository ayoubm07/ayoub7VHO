// 1. Zorg dat de browser onthoudt of je al bent ingelogd
document.addEventListener("DOMContentLoaded", () => {
  // Als de browser de 'sleutel' herkent, sla dan de login over!
  if (localStorage.getItem('ayoub_ingelogd') === 'true') {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    switchTab('home'); 
  }
});

// 2. Wachtwoord check (Nu mét automatische onthoud-functie)
function checkAccess() {
  const codeInput = document.getElementById('accessCode').value;
  const errorMsg = document.getElementById('errorMsg');

  if (codeInput === "Examenhulp23") {
    errorMsg.style.display = 'none';
    
    // 🔥 SLA OP IN DE BROWSER DAT DE CODE GOED WAS 🔥
    localStorage.setItem('ayoub_ingelogd', 'true');
    
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-dashboard').style.display = 'block';
    switchTab('home');
  } else {
    errorMsg.style.display = 'block';
  }
}

// 3. De onbreekbare tab-wisselaar
function switchTab(tabId) {
  const allSections = document.querySelectorAll('.tab-content');
  allSections.forEach(sec => {
    sec.style.display = 'none';
    sec.classList.remove('active');
  });

  const targetSection = document.getElementById('tab-' + tabId);
  if (targetSection) {
    targetSection.style.display = 'block';
    targetSection.classList.add('active');
  }

  const allNavBtns = document.querySelectorAll('.nav-btn');
  allNavBtns.forEach(btn => btn.classList.remove('active'));
  
  allNavBtns.forEach(btn => {
    if (btn.getAttribute('onclick') && btn.getAttribute('onclick').includes(tabId)) {
      btn.classList.add('active');
    }
  });

  window.scrollTo(0, 0);
}

// 4. Doorklikken naar specifiek vak
function openSubject(subjectKey) {
  switchTab('leerstof');
  showSubjectTheory(subjectKey);
}

// 5. Toon theorie per vak
function showSubjectTheory(subjectKey) {
  const blocks = document.querySelectorAll('.theory-block');
  blocks.forEach(block => {
    block.style.display = 'none';
  });

  const selected = document.getElementById('theory-' + subjectKey);
  if (selected) {
    selected.style.display = 'block';
  }
}

// 6. Toon specifiek hoofdstuk binnen theorie
function showChapter(subject, chapterNum) {
  const chapters = document.querySelectorAll(`.${subject}-chapter`);
  chapters.forEach(ch => {
    ch.style.display = 'none';
  });

  const selectedChapter = document.getElementById(`${subject}-h${chapterNum}`);
  if (selectedChapter) {
    selectedChapter.style.display = 'block';
  }
}

// 7. Examenrooster opslag (LocalStorage)
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


// 8. AI Studiecoach Logica
function generateAIAdvice() {
  const adviceBox = document.getElementById('ai-advice-box');
  const adviceText = document.getElementById('ai-advice-text');
  
  // Toon het vak en zet de laad-animatie aan
  adviceBox.style.display = 'block';
  adviceText.innerHTML = "<em>De AI is je rooster en deadlines aan het analyseren... ⏳</em>";

  // Wacht 1.5 seconde (voor het professionele "denk" effect)
  setTimeout(() => {
    // Check of er wel examens zijn ingepland
    if (!exams || exams.length === 0) {
      adviceText.innerHTML = "Je hebt nog geen examens ingepland. Voeg er eerst een paar toe hieronder, dan maak ik een waterdichte planning voor je!";
      return;
    }

    // Sorteer de examens zodat degene die als eerste komt bovenaan staat
    const sortedExams = [...exams].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Filter examens in het verleden eruit
    const futureExams = sortedExams.filter(ex => new Date(ex.date) >= new Date(new Date().setHours(0,0,0,0)));
    
    if (futureExams.length === 0) {
      adviceText.innerHTML = "Al je ingeplande examens zijn al voorbij! Tijd om je rooster op te schonen en nieuwe doelen te stellen.";
      return;
    }

    // Pak het eerstvolgende examen
    const nextExam = futureExams[0];
    
    // Bereken hoeveel dagen het nog duurt
    const daysLeft = Math.ceil((new Date(nextExam.date) - new Date()) / (1000 * 60 * 60 * 24));
    
    // AI geeft antwoord op basis van de tijd die nog over is
    if (daysLeft === 0) {
      adviceText.innerHTML = `🚨 <strong>VANDAAG IS HET ZOVER!</strong> Je hebt vandaag examen voor <strong>${nextExam.subject}</strong>. Neem de theorie nog één keer snel door en vertrouw op jezelf. Succes!`;
    } else if (daysLeft <= 3) {
      adviceText.innerHTML = `⚠️ <strong>HOGE PRIORITEIT:</strong> Je examen <strong>${nextExam.subject}</strong> is al over ${daysLeft} dagen! Laat andere vakken even liggen. Ga direct naar de proeftoetsen-sectie en blijf oefenen tot je foutloos bent.`;
    } else if (daysLeft <= 7) {
      adviceText.innerHTML = `📅 <strong>Aanbevolen:</strong> Je volgende examen is <strong>${nextExam.subject}</strong> over ${daysLeft} dagen. Je hebt nog genoeg tijd, maar dit is het perfecte moment om alvast per hoofdstuk de theorie door te lezen.`;
    } else {
      adviceText.innerHTML = `✅ <strong>Je ligt op schema:</strong> Je hebt nog ${daysLeft} dagen de tijd tot <strong>${nextExam.subject}</strong>. Relax, zorg dat je aantekeningen op orde zijn en start pas over een paar dagen met actief leren.`;
    }
  }, 1500);
}