import { BASE_SHAPES, store } from './store.js';
import { runCalculation } from './algorithm.js';
import { renderPathsInto, createSection } from './ui.js';

function init() {
    // 1. 初始化 Palette
    document.querySelectorAll('.palette-item').forEach((item, idx) => {
        renderPathsInto(item, BASE_SHAPES[idx]);
        item.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('typeId', e.target.dataset.type);
        });
    });

    // 2. 初始化 Setup Grid
    initSetupGrid();

    // 3. 綁定 Inventory 輸入事件
    for (let i = 0; i <= 4; i++) {
        document.getElementById(`qty-${i}`).addEventListener('input', updateTotalCount);
    }

    // 4. 綁定按鈕
    document.getElementById('btn-reset').addEventListener('click', resetSetup);
    document.getElementById('btn-calc').addEventListener('click', startCalculation);
}

function initSetupGrid() {
    const grid = document.getElementById('setup-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'setup-cell';
        
        // 拖曳事件
        cell.addEventListener('dragover', (e) => { e.preventDefault(); cell.classList.add('drag-over'); });
        cell.addEventListener('dragleave', () => cell.classList.remove('drag-over'));
        cell.addEventListener('drop', (e) => dropToCell(e, i, cell));
        
        // 點擊事件
        cell.addEventListener('click', () => rotateCell(i, cell));
        cell.addEventListener('contextmenu', (e) => { e.preventDefault(); clearCell(i, cell); });
        cell.addEventListener('dblclick', () => clearCell(i, cell));

        grid.appendChild(cell);
    }
    updateTotalCount();
}

function dropToCell(e, index, cellElem) {
    e.preventDefault();
    cellElem.classList.remove('drag-over');
    const typeId = e.dataTransfer.getData('typeId');
    if (typeId === "") return;

    store.prePlaced[index] = [...BASE_SHAPES[typeId]];
    cellElem.classList.add('locked');
    renderPathsInto(cellElem, store.prePlaced[index]);
    updateTotalCount();
}

function rotateCell(index, cellElem) {
    if (!store.prePlaced[index]) return;
    let arr = store.prePlaced[index];
    store.prePlaced[index] = [arr[3], arr[0], arr[1], arr[2]];
    renderPathsInto(cellElem, store.prePlaced[index]);
}

function clearCell(index, cellElem) {
    store.prePlaced[index] = null;
    cellElem.classList.remove('locked');
    cellElem.innerHTML = '';
    updateTotalCount();
}

function resetSetup() {
    store.prePlaced.fill(null);
    initSetupGrid();
}

function updateTotalCount() {
    store.placedCount = store.prePlaced.filter(p => p !== null).length;
    document.getElementById('setup-info').innerText = `Tip: Left-click rotate / Right-click clear (Placed: ${store.placedCount})`;

    let bagCount = 0;
    for(let i=0; i<=4; i++) bagCount += (parseInt(document.getElementById(`qty-${i}`).value) || 0);
    
    const total = store.placedCount + bagCount;
    const infoDiv = document.getElementById('total-info');
    infoDiv.innerText = `Total Count (Placed + Inventory): ${total}`;
    infoDiv.style.color = (total === 9) ? '#4ade80' : '#ff6b6b';
}

function startCalculation() {
    let bagCount = 0;
    const counts = [];
    for (let i = 0; i <= 4; i++) {
        let val = parseInt(document.getElementById(`qty-${i}`).value) || 0;
        counts[i] = val;
        bagCount += val;
    }

    const total = store.placedCount + bagCount;
    const statusDiv = document.getElementById('status');
    const resultsDiv = document.getElementById('results');

    if (total !== 9) {
        statusDiv.style.color = '#ff6b6b';
        statusDiv.innerText = `Error: (Placed ${store.placedCount} + Inventory ${bagCount}) Total must be exactly 9!`;
        resultsDiv.innerHTML = '';
        return;
    }

    statusDiv.style.color = '#e0e0e0';
    statusDiv.innerText = 'Calculating chart combination based on pre-placed charts...';
    resultsDiv.innerHTML = '';
    
    setTimeout(() => {
        const result = runCalculation(counts, store.prePlaced);
        renderSolutions(result);
    }, 50);
}

function renderSolutions({ connected, unconnected, timeMs }) {
    const statusDiv = document.getElementById('status');
    const container = document.getElementById('results');
    let totalFound = connected.length + unconnected.length;

    if (totalFound === 0) {
        statusDiv.style.color = '#ff6b6b';
        statusDiv.innerText = `Done (${timeMs.toFixed(1)}ms): No valid configurations found.`;
        return;
    }

    statusDiv.style.color = '#4ade80';
    statusDiv.innerText = `Done (${timeMs.toFixed(1)}ms): Found ${connected.length} fully connected optimal solutions, and ${unconnected.length} disjointed solutions.`;

    if (connected.length > 0) {
        container.appendChild(createSection(`🏆 Perfect Fully Connected Charts (${connected.length})`, connected.slice(0, 300), true, store.prePlaced));
    }
    
    if (unconnected.length > 0 && connected.length < 300) {
        const remain = 300 - connected.length;
        container.appendChild(createSection(`⚠️ Valid Disjointed Charts`, unconnected.slice(0, remain), false, store.prePlaced));
    }
}

// 啟動應用
init();
