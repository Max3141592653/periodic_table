const table = document.getElementById('periodic-table');
const hitsEl = document.getElementById('hits');
const errorsEl = document.getElementById('errors');
const timerEl = document.getElementById('timer');

const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score-display';
document.body.appendChild(scoreDisplay);

// Mapatge de groupBlock (elements.js) a les classes CSS que tens al style.css
function getCategoryClass(groupBlock) {
  if (!groupBlock) return 'nonmetal';
  const g = groupBlock.toLowerCase();
  if (g.includes('noble')) return 'noble-gas';
  if (g.includes('metalloid')) return 'semi-metal';
  if (g.includes('halogen')) return 'nonmetal';
  if (g.includes('alkali') || g.includes('alkaline') || g.includes('metal')) return 'metal';
  if (g.includes('transition')) return 'metal';
  if (g.includes('post-transition')) return 'metal';
  if (g.includes('lanthanoid')) return 'metal';
  if (g.includes('actinoid')) return 'metal';
  if (g.includes('nonmetal')) return 'nonmetal';
  return 'nonmetal';
}


let hits = 0;
let errors = 0;
let seconds = 0;
let timerInterval;
let mistakesList = []; // per guardar errors

// Cronòmetre
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerEl.textContent = `${min}:${sec.toString().padStart(2,'0')}`;
  }, 1000);
}

function flashTable() {
  // si ja està fent-se el flash, no fem res
  if (table.classList.contains('flash')) return;

  table.classList.add('flash');
  scoreDisplay.textContent = `Puntuació ${hits}     \u00A0 - Errors ${errors} -  Temps ${seconds}` ;
  scoreDisplay.style.display = 'block';

  // Després del temps del missatge (5s segons), apliquem colors i aturem el cronòmetre
  setTimeout(() => {
    table.classList.remove('flash');
    scoreDisplay.style.display = 'none';

    // Apliquem classes de categoria a totes les cel·les omplertes (només després del flash)
    document.querySelectorAll('.cell.filled').forEach(cell => {
      const num = parseInt(cell.dataset.num);
      if (!num) return;
      const el = elements.find(e => e.atomicNumber === num);
      if (!el) return;
      const cls = getCategoryClass(el.groupBlock);
      cell.classList.add(cls);
    });

    // Aturem el cronòmetre si està corrent
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 5000);
}


// Ara comprovem per hits (nombre d'encerts reals)
// Activem destello quan hits === 118
// Comprova si taula plena i atura cronòmetre
function checkTableFull() {
  const totalCells = document.querySelectorAll('#periodic-table .cell').length;
  const filledCells = document.querySelectorAll('#periodic-table .cell.filled').length;

  if(filledCells === totalCells || hits === 118) {
    clearInterval(timerInterval);  // Atura el cronòmetre
    flashTable();                  // Activem destell i colors finals
  }
}



// Map de colors segons groupBlock
function getCategoryClass(groupBlock) {
  switch(groupBlock) {
    case 'metal': return 'metal';
    case 'nonmetal': return 'nonmetal';
    case 'metalloid': return 'semi-metal';
    case 'noble gas': return 'noble-gas';
    case 'alkali metal': return 'metal';
    case 'alkaline earth metal': return 'metal';
    case 'transition metal': return 'metal';
    case 'post-transition metal': return 'metal';
    case 'halogen': return 'nonmetal';
    case 'lanthanoid': return 'metal';
    case 'actinoid': return 'metal';
    default: return 'nonmetal';
  }
}

// Crear cel·la
function createCell(num) {
  const cell = document.createElement('div');
  const el = elements.find(e => e.atomicNumber === num);

  if(num === '*') { cell.className='cell special'; cell.innerHTML='<div class="sym">*</div>'; }
  else if(num === '**') { cell.className='cell special'; cell.innerHTML='<div class="sym">**</div>'; }
  else if(num===0) { cell.className='cell gap'; }
  else {
    cell.className='cell';
    cell.dataset.num = num;
    cell.innerHTML = `<div class="num">${num}</div><div class="sym">?</div>`;

    cell.onclick = () => {
      const guess = prompt(`Element ${num} – Symbol o name:`)?.trim();
      if (!guess) return;
    
      if (el && (el.symbol.toLowerCase() === guess.toLowerCase() || el.name.toLowerCase() === guess.toLowerCase())) {
        // incrementem hits només quan és correcte i num és un nombre real
        hits++;
        hitsEl.textContent = hits;
    
        // mostrem la informació, marquem com a filled, PERO NO posem classe de categoria ara
        cell.innerHTML = `<div class="num">${el.atomicNumber}</div>
                          <div class="sym">${el.symbol}</div>
                          <div class="name">${el.name}</div>`;
        cell.classList.add('filled');
    
        // comprovem si la taula està plena (ara basat en hits)
        checkTableFull();
      } else {
        errors++;
        errorsEl.textContent = errors;
        mistakesList.push(`Element ${num}: intent "${guess}"`);
        alert('Wrong – try again!');
      }
    };
    
  }
  return cell;
}

// Main table
const mainRows = [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [3,4,0,0,0,0,0,0,0,0,0,0,5,6,7,8,9,10],
  [11,12,0,0,0,0,0,0,0,0,0,0,13,14,15,16,17,18],
  [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
  [37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
  [55,56,'*',72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],
  [87,88,'**',104,105,106,107,108,109,110,111,112,113,114,115,116,117,118],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,'*',57,58,59,60,61,62,63,64,65,66,67,68,69,70,71],
  [0,0,'**',89,90,91,92,93,94,95,96,97,98,99,100,101,102,103]
];

mainRows.forEach(row => row.forEach(num => table.appendChild(createCell(num))));

startTimer();

// Click a errors per veure llistat
errorsEl.addEventListener('click', ()=>{
  if(mistakesList.length>0) alert("Errors d'aquesta ronda:\n"+mistakesList.join('\n'));
});

// Botó revelar colors parcials
// Botó Reveal colors
const revealBtn = document.createElement('button');
revealBtn.id = 'reveal-colors';
revealBtn.textContent = 'Mostrar colors';
document.body.appendChild(revealBtn);


revealBtn.onclick = () => {
  document.querySelectorAll('.cell.filled').forEach(cell => {
    const num = parseInt(cell.dataset.num);
    if (!num) return;
    const el = elements.find(e => e.atomicNumber === num);
    if (!el) return;
    const cls = getCategoryClass(el.groupBlock);
    cell.classList.add(cls);
  });
};

document.body.appendChild(revealBtn);



// Crear botó per omplir tota la taula
const fillBtn = document.createElement('button');
fillBtn.id = 'fill-table';
fillBtn.textContent = 'Omplir taula';
fillBtn.style.padding = '10px 15px';
fillBtn.style.background = '#6200ea';
fillBtn.style.color = '#fff';
fillBtn.style.border = 'none';
fillBtn.style.borderRadius = '8px';
fillBtn.style.cursor = 'pointer';
fillBtn.style.zIndex = '1000';
document.body.appendChild(fillBtn);

// Funció per omplir la taula
fillBtn.onclick = () => {
  elements.forEach(el => {
    if(el.atomicNumber === 2) return; // No fem Helio
    const cell = document.querySelector(`.cell[data-num='${el.atomicNumber}']`);
    if(cell && !cell.classList.contains('filled')) {
      cell.innerHTML = `
        <div class="num">${el.atomicNumber}</div>
        <div class="sym">${el.symbol}</div>
        <div class="name">${el.name}</div>`;
      cell.classList.add('filled');
      hits++; // augmentem encerts
    }
  });

  hitsEl.textContent = hits;

  // Comprovem si la taula està plena
  if(hits === 118) {
    flashTable(); // activa destello i mostra colors
  }
};


  // Actualitza comptadors
  hits = document.querySelectorAll('.cell.filled').length;
  hitsEl.textContent = hits;

  checkTableFull();


// Amagar el botó d'admin per defecte
fillBtn.style.display = "none";

// Combinació secreta: CTRL + SHIFT + A
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "k") {
    fillBtn.style.display = fillBtn.style.display === "none" ? "block" : "none";
  }
});
