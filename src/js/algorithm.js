import { PIECE_TYPES } from './store.js';

export function runCalculation(counts, prePlaced) {
    const connectedSolutions = [];
    const unconnectedSolutions = [];
    const MAX_DISPLAY = 300;
    const MAX_SEARCH_LIMIT = 5000;

    function isValid(grid, index, state) {
        if (index >= 3) {
            let pieceAbove = grid[index - 3];
            if (pieceAbove[2] !== state[0]) return false;
        }
        if (index % 3 !== 0) {
            let pieceLeft = grid[index - 1];
            if (pieceLeft[1] !== state[3]) return false;
        }
        return true;
    }

    function isFullyConnected(grid) {
        let visited = new Set([0]);
        let queue = [0];
        while(queue.length > 0) {
            let curr = queue.shift();
            let row = Math.floor(curr / 3);
            let col = curr % 3;
            
            if (row > 0 && grid[curr][0] === 1 && !visited.has(curr - 3)) { visited.add(curr - 3); queue.push(curr - 3); }
            if (col < 2 && grid[curr][1] === 1 && !visited.has(curr + 1)) { visited.add(curr + 1); queue.push(curr + 1); }
            if (row < 2 && grid[curr][2] === 1 && !visited.has(curr + 3)) { visited.add(curr + 3); queue.push(curr + 3); }
            if (col > 0 && grid[curr][3] === 1 && !visited.has(curr - 1)) { visited.add(curr - 1); queue.push(curr - 1); }
        }
        return visited.size === 9;
    }

    function solve(grid, currentCounts, index) {
        if (index === 9) {
            if (isFullyConnected(grid)) connectedSolutions.push([...grid]);
            else unconnectedSolutions.push([...grid]);
            return;
        }

        if (connectedSolutions.length >= MAX_DISPLAY) return;
        if (connectedSolutions.length + unconnectedSolutions.length > MAX_SEARCH_LIMIT) return;

        if (prePlaced[index] !== null) {
            let state = prePlaced[index];
            if (isValid(grid, index, state)) {
                grid[index] = state;
                solve(grid, currentCounts, index + 1);
                grid[index] = null; 
            }
            return;
        }

        for (let typeId = 0; typeId <= 4; typeId++) {
            if (currentCounts[typeId] > 0) {
                for (let state of PIECE_TYPES[typeId].states) {
                    if (isValid(grid, index, state)) {
                        grid[index] = state;
                        currentCounts[typeId]--;
                        solve(grid, currentCounts, index + 1);
                        currentCounts[typeId]++;
                        grid[index] = null;
                    }
                }
            }
        }
    }

    const startTime = performance.now();
    solve(new Array(9).fill(null), counts, 0);
    const endTime = performance.now();

    return {
        connected: connectedSolutions,
        unconnected: unconnectedSolutions,
        timeMs: endTime - startTime
    };
}
