export const BASE_SHAPES = {
    0: [1,0,0,0], // Dead End
    1: [1,0,1,0], // Straight
    2: [1,1,0,0], // Corner
    3: [1,1,0,1], // T-Junction (3-way)
    4: [1,1,1,1]  // Cross (4-way)
};

export const PIECE_TYPES = {
    0: { states: [[1,0,0,0], [0,1,0,0], [0,0,1,0], [0,0,0,1]] },
    1: { states: [[1,0,1,0], [0,1,0,1]] },
    2: { states: [[1,1,0,0], [0,1,1,0], [0,0,1,1], [1,0,0,1]] },
    3: { states: [[1,1,0,1], [1,1,1,0], [0,1,1,1], [1,0,1,1]] },
    4: { states: [[1,1,1,1]] }
};

// 狀態管理物件
export const store = {
    prePlaced: new Array(9).fill(null),
    placedCount: 0
};
