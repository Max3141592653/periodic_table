const table = document.getElementById('periodic-table');
const hitsEl = document.getElementById('hits');
const errorsEl = document.getElementById('errors');
const timerEl = document.getElementById('timer');

const scoreDisplay = document.createElement('div');
scoreDisplay.id = 'score-display';
document.body.appendChild(scoreDisplay);

let hits = 0;
let errors = 0;
let seconds = 0;
let timerInterval;
let mistakesList = [];

// Llista elements de la versió simple
const simpleElements = [
  "H","Li","Na","K","Rb","Cs","Fr",
  "Be","Mg","Ca","Sr","Ba","Ra",
  "Cr","Mn","Fe","Co","Ni","Cu","Zn","Pd","Pt","Ag","Au","Cd","Hg",
  "B","Al","Ga","In","Tl",
  "C","Si","Ge","Sn","Pb",
  "N","P","As","Sb","Bi",
  "O","S","Se","Te","Po",
  "F","Cl","Br","I","At",
  "He","Ne","Ar","Kr","Xe","Rn"
];

// Funció mapatge groupBlock -> classe CSS
function getCategoryClass(groupBlock) {
  switch(groupBlock?.toLowerCase()) {
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

// Cronòmetre
function startTimer() {
  timerInterval = setInterval(() => {
    seconds++;
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    timerEl.textContent = `${min}:${sec.toString().padStart(2,'0')}`;
  }, 1000);
}

// flashTable modificat: només aplica colors a cel·les opacitat 1
function flashTable() {
  if (table.classList.contains('flash')) return;

  table.classList.add('flash');
  scoreDisplay.textContent = `Puntuació ${hits}     \u00A0 - Errors ${errors} - Temps ${seconds}`;
  scoreDisplay.style.display = 'block';

  setTimeout(() => {
    table.classList.remove('flash');
    scoreDisplay.style.display = 'none';

    document.querySelectorAll('.cell.filled').forEach(cell => {
      if (parseFloat(cell.style.opacity || '1') < 1) return;

      const num = parseInt(cell.dataset.num);
      if (!num) return;
      const el = elements.find(e => e.atomicNumber === num);
      if (!el) return;

      const cls = getCategoryClass(el.groupBlock);
      cell.classList.add(cls);
    });

    if (switchInput) switchInput.checked = true;

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }, 5000);
}

// ------------------ SELECTOR LATERAL ------------------ //
let currentVersion = 'full';

const versionWrapper = document.createElement('div');
versionWrapper.style.position = 'fixed';
versionWrapper.style.left = '10px';
versionWrapper.style.top = '50%';
versionWrapper.style.transform = 'translateY(-50%)';
versionWrapper.style.display = 'flex';
versionWrapper.style.flexDirection = 'column';
versionWrapper.style.gap = '10px';
versionWrapper.style.fontFamily = 'Arial, sans-serif';
versionWrapper.style.fontSize = '16px';
document.body.appendChild(versionWrapper);

const simpleOption = document.createElement('span');
const fullOption = document.createElement('span');

simpleOption.textContent = 'SIMPLE';
fullOption.textContent = 'COMPLETA';

simpleOption.style.cursor = 'pointer';
fullOption.style.cursor = 'pointer';

function updateVersionVisual(selected) {
  if(selected === 'simple'){
    simpleOption.style.color = '#8e44ad';
    fullOption.style.color = '#555';
  } else {
    fullOption.style.color = '#8e44ad';
    simpleOption.style.color = '#555';
  }
  currentVersion = selected;
}

simpleOption.addEventListener('click', () => {
  updateVersionVisual('simple');
  updateTableVersion('simple');
});

fullOption.addEventListener('click', () => {
  updateVersionVisual('full');
  updateTableVersion('full');
});

versionWrapper.appendChild(simpleOption);
versionWrapper.appendChild(fullOption);
updateVersionVisual(currentVersion);

// ------------------ FUNCIO UPDATE TABLE ------------------ //
function updateTableVersion(version) {
  version = version || currentVersion;

  document.querySelectorAll('#periodic-table .cell').forEach(cell => {
    const num = parseInt(cell.dataset.num);
    const el = elements.find(e => e.atomicNumber === num);
    if(!el) return;

    if(version === 'simple') {
      if(simpleElements.includes(el.symbol)) {
        cell.style.opacity = '1';
        cell.style.pointerEvents = 'auto';
        if(!cell.classList.contains('filled')){
          cell.innerHTML = `<div class="num">${el.atomicNumber}</div><div class="sym">?</div>`;
        }
      } else {
        cell.style.opacity = '0.3';
        cell.style.pointerEvents = 'none';
        cell.innerHTML = `<div class="num">${el.atomicNumber}</div><div class="sym">${el.symbol}</div>`;
        cell.classList.add('filled');
      }
    } else {
      cell.style.opacity = '1';
      cell.style.pointerEvents = 'auto';
      if(simpleElements.includes(el.symbol) === false && cell.classList.contains('filled')){
        cell.innerHTML = `<div class="num">${el.atomicNumber}</div><div class="sym">?</div>`;
        cell.classList.remove('filled');
      }
      if(!cell.classList.contains('filled')){
        cell.innerHTML = `<div class="num">${el.atomicNumber}</div><div class="sym">?</div>`;
      }
    }
  });
}

// ------------------ CHECK TAULA ------------------ //
function checkTableFull() {
  const version = currentVersion;
  let filledCount, totalCount;

  if(version === 'simple') {
    const simpleCells = Array.from(document.querySelectorAll('#periodic-table .cell')).filter(cell=>{
      const num = parseInt(cell.dataset.num);
      const el = elements.find(e=>e.atomicNumber===num);
      return el && simpleElements.includes(el.symbol);
    });
    totalCount = simpleCells.length;
    filledCount = simpleCells.filter(c=>c.classList.contains('filled')).length;
  } else {
    const allCells = document.querySelectorAll('#periodic-table .cell');
    totalCount = allCells.length;
    filledCount = Array.from(allCells).filter(c=>c.classList.contains('filled')).length;
  }

  if(filledCount === totalCount || hits === 118) {
    clearInterval(timerInterval);
    flashTable();
  }
}

// ------------------ CREAR CEL·LES ------------------ //
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

      if(el && (el.symbol.toLowerCase() === guess.toLowerCase() || el.name.toLowerCase() === guess.toLowerCase())){
        hits++;
        hitsEl.textContent = hits;
        cell.innerHTML = `<div class="num">${el.atomicNumber}</div><div class="sym">${el.symbol}</div><div class="name">${el.name}</div>`;
        cell.classList.add('filled');
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

// ------------------ CREAR TAULA ------------------ //
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

// ------------------ CRONÒMETRE ------------------ //
startTimer();

// ------------------ ERROS CLICK ------------------ //
errorsEl.addEventListener('click', ()=> {
  if(mistakesList.length>0) alert("Errors d'aquesta ronda:\n"+mistakesList.join('\n'));
});

// ------------------ BOTÓ OMPLIR ------------------ //
const fillBtn = document.createElement('button');
fillBtn.id = 'fill-table';
fillBtn.textContent = 'Omplir taula';
fillBtn.style.position = 'fixed';
fillBtn.style.right = '10px';
fillBtn.style.bottom = '10px';
fillBtn.style.padding = '10px 15px';
fillBtn.style.background = '#6200ea';
fillBtn.style.color = '#fff';
fillBtn.style.border = 'none';
fillBtn.style.borderRadius = '8px';
fillBtn.style.cursor = 'pointer';
fillBtn.style.zIndex = '1000';
fillBtn.style.display = 'none';
document.body.appendChild(fillBtn);

fillBtn.onclick = () => {
  elements.forEach(el=>{
    if(el.atomicNumber === 2) return;
    const cell = document.querySelector(`.cell[data-num='${el.atomicNumber}']`);
    if(cell && !cell.classList.contains('filled')){
      cell.innerHTML = `<div class="num">${el.atomicNumber}</div><div class="sym">${el.symbol}</div><div class="name">${el.name}</div>`;
      cell.classList.add('filled');
      hits++;
    }
  });
  hitsEl.textContent = hits;
  if(hits === 118) flashTable();
};

// ------------------ COMBINACIÓ SECRET ------------------ //
document.addEventListener("keydown", (e)=>{
  if(e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "k"){
    fillBtn.style.display = fillBtn.style.display === "none" ? "block" : "none";
  }
});

// ------------------ SWITCH COLORS ------------------ //
const switchWrapper = document.createElement('div');
switchWrapper.className = 'switch-wrapper';

const switchInput = document.createElement('input');
switchInput.type = 'checkbox';
switchInput.id = 'switch-colors';

const switchLabel = document.createElement('label');
switchLabel.htmlFor = 'switch-colors';

const switchText = document.createElement('span');
switchText.textContent = 'Mostrar colors';

switchWrapper.appendChild(switchInput);
switchWrapper.appendChild(switchLabel);
switchWrapper.appendChild(switchText);
document.body.appendChild(switchWrapper);

switchInput.addEventListener('change', () => {
  const active = switchInput.checked;

  document.querySelectorAll('.cell.filled').forEach(cell => {
    if (parseFloat(cell.style.opacity || '1') < 1) return;

    const num = parseInt(cell.dataset.num);
    if (!num) return;
    const el = elements.find(e => e.atomicNumber === num);
    if (!el) return;

    const cls = getCategoryClass(el.groupBlock);

    if (active) {
      cell.classList.add(cls);
    } else {
      cell.classList.remove(cls);
    }
  });
});
