const table = document.getElementById('periodic-table');
const seriesWrapper = document.getElementById('series-wrapper');
const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.tab-content');

// Tab switching
tabs.forEach(t => t.onclick = () => {
  tabs.forEach(x => x.classList.remove('active'));
  contents.forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  document.getElementById(t.dataset.tab).classList.add('active');
});

// Create a cell
function createCell(num) {
  const cell = document.createElement('div');
  const el = elements.find(e => e.atomicNumber === num);

  if (num === 200) {
    cell.className = 'cell special';
    cell.innerHTML = '<div class="sym">*</div>';
  } else if (num === 201) {
    cell.className = 'cell special';
    cell.innerHTML = '<div class="sym">**</div>';
  } else if (num === 0) {
    cell.className = 'cell gap';
  } else {
    cell.className = 'cell';
    cell.dataset.num = num;
    cell.innerHTML = `<div class="num">${num}</div><div class="sym">?</div>`;
    cell.onclick = () => {
      const guess = prompt(`Element ${num} – Symbol or name:`)?.trim();
      if (!guess) return;
      if (el && (el.symbol.toLowerCase() === guess.toLowerCase() ||
                 el.name.toLowerCase() === guess.toLowerCase())) {
        cell.innerHTML = `
          <div class="num">${el.atomicNumber}</div>
          <div class="sym">${el.symbol}</div>
          <div class="name">${el.name}</div>`;
        cell.style.backgroundColor = el.cpk || '#01718a';
        cell.classList.add('filled');
      } else {
        alert("Wrong – try again!"); 
      }
    };
  }
  return cell;
}

// Main table rows
const mainRows = [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2],
  [3,4,0,0,0,0,0,0,0,0,0,0,5,6,7,8,9,10],
  [11,12,0,0,0,0,0,0,0,0,0,0,13,14,15,16,17,18],
  [19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36],
  [37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54],
  [55,56,200,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86],
  [87,88,201,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71],
  [0,0,0,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103]
];

// Add main rows
mainRows.forEach(row => row.forEach(num => table.appendChild(createCell(num))));


