export default function RandomMaze(h: number, w: number) {
    let array = [];
    for (let i = 2; i < h - 2; i++) {
        for (let j = 2; j < w - 2; j++) {
            array.push([i, j, i, j]);
        }
    }
    let currentIndex = array.length, randomIndex;
    while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array.slice(0, Math.max(0, array.length / 5));
}