function ok(i: number, j: number, h: number, w: number): boolean {
    return i >= 0 && i < h && j >= 0 && j < w;
}

interface point {
    x: number,
    y: number
}
export default function dfs(s: { x: number, y: number }, t: { x: number, y: number }, h: number, w: number, walls: Boolean[][]) {
    let visited = new Array(h), parent = new Array(h);
    let arr: point[] = [];
    let f = true;
    let dx = [-1, 0, 1, 0]
    let dy = [0, 1, 0, -1]
    for (let i = 0; i < h; i++) {
        visited[i] = new Array(w).fill(false);
        parent[i] = new Array(w).fill({ x: -1, y: -1 })
    }
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            visited[i][j] = walls[i][j];
        }
    }
    // for (let i = 0; i < walls.length; i++) {
    //     if (walls[i][0] >= 0 && walls[i][0] < h && walls[i][1] >= 0 && walls[i][1] < w) visited[walls[i][0]][walls[i][1]] = true;
    // }
    function run(s: point, t: point, p: point) {
        if (visited[s.x][s.y]) return;
        visited[s.x][s.y] = true;
        arr.push(s);
        parent[s.x][s.y] = [p.x, p.y];
        if (s.x == t.x && s.y == t.y) {
            f = false;
            return;
        }
        for (let i = 0; i < 4; i++) {
            if (f && ok(s.x + dx[i], s.y + dy[i], h, w) && visited[s.x + dx[i]][s.y + dy[i]] == false) {
                run({ x: s.x + dx[i], y: s.y + dy[i] }, t, s)
            }
        }
    }
    run(s, t, { x: -1, y: -1 });
    return [arr, parent];
}