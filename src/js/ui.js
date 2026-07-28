export function renderPathsInto(element, state) {
    element.innerHTML = '';
    if (!state) return;
    if (state[0]) element.innerHTML += '<div class="path path-top"></div>';
    if (state[1]) element.innerHTML += '<div class="path path-right"></div>';
    if (state[2]) element.innerHTML += '<div class="path path-bottom"></div>';
    if (state[3]) element.innerHTML += '<div class="path path-left"></div>';
    element.innerHTML += '<div class="path-center"></div>';
}

export function createSection(titleText, grids, isConnected, prePlaced) {
    const section = document.createElement('div');
    section.className = 'results-container';
    
    const title = document.createElement('h2');
    title.className = 'results-title';
    title.style.color = isConnected ? '#4ade80' : '#ffb84d';
    title.innerText = titleText;
    section.appendChild(title);

    const gridContainer = document.createElement('div');
    gridContainer.className = 'results-grid';

    grids.forEach(sol => {
        const mapDiv = document.createElement('div');
        mapDiv.className = `map-grid ${isConnected ? 'connected' : ''}`;
        
        sol.forEach((cellState, idx) => {
            const cellWrapper = document.createElement('div');
            cellWrapper.style.width = '50px';
            cellWrapper.style.height = '50px';
            
            const cellDiv = document.createElement('div');
            cellDiv.className = 'cell-render';
            if (prePlaced[idx] !== null) cellDiv.classList.add('locked');
            
            renderPathsInto(cellDiv, cellState);
            
            cellWrapper.appendChild(cellDiv);
            mapDiv.appendChild(cellWrapper);
        });
        gridContainer.appendChild(mapDiv);
    });
    section.appendChild(gridContainer);
    return section;
}
