let arr: any[] = [];
function recursiveDivisionMaze(rowStart: number, rowEnd: number, colStart: number, colEnd: number, orientation: string) {
    if (rowEnd < rowStart || colEnd < colStart) {
        return;
    }
    if (orientation === "horizontal") {
        let possibleRows = [];
        for (let number = rowStart; number <= rowEnd; number += 2) {
            possibleRows.push(number);
        }
        let possibleCols = [];
        for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
            possibleCols.push(number);
        }
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let currentRow = possibleRows[randomRowIndex];
        let colRandom = possibleCols[randomColIndex];
        arr.push([currentRow, colStart - 1, currentRow, colEnd + 1, colRandom]);
        if (currentRow - 2 - rowStart > colEnd - colStart) {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, orientation);
        } else {
            recursiveDivisionMaze(rowStart, currentRow - 2, colStart, colEnd, "vertical");
        }
        if (rowEnd - (currentRow + 2) > colEnd - colStart) {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, orientation);
        } else {
            recursiveDivisionMaze(currentRow + 2, rowEnd, colStart, colEnd, "vertical");
        }
    } else {
        let possibleCols = [];
        for (let number = colStart; number <= colEnd; number += 2) {
            possibleCols.push(number);
        }
        let possibleRows = [];
        for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
            possibleRows.push(number);
        }
        let randomColIndex = Math.floor(Math.random() * possibleCols.length);
        let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
        let currentCol = possibleCols[randomColIndex];
        let rowRandom = possibleRows[randomRowIndex];

        arr.push([Math.max(rowStart - 1, 0), currentCol, rowEnd + 1, currentCol, rowRandom]);
        if (rowEnd - rowStart > currentCol - 2 - colStart) {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, "horizontal");
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, colStart, currentCol - 2, orientation);
        }
        if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, "horizontal");
        } else {
            recursiveDivisionMaze(rowStart, rowEnd, currentCol + 2, colEnd, orientation);
        }
    }
};

export default function getRecursiveMaze(x1: number, y1: number, x2: number, y2: number, orientation: string) {
    arr = [];
    recursiveDivisionMaze(x1, x2, y1, y2, orientation);
    return arr;
}
