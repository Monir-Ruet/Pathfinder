import queue from "./queue";

function ok(i: number, j: number, h: number, w: number): boolean {
    return i >= 0 && i < h && j > 0 && j < w;
}

interface point {
    x: number,
    y: number
}
export default function bfs(s: point, t: point, w: number, h: number) {
    let arr = []
    let dx = [-1, 0, 1, 0]
    let dy = [0, 1, 0, -1]
    let visited = new Array(h), parent = new Array(h);
    for (let i = 0; i < h; i++) {
        visited[i] = new Array(w).fill(false);
        parent[i] = new Array(w).fill([-1, -1]);
    }
    let q = new queue();
    q.push(s);
    visited[s.x][s.y] = 1;
    while (q.size()) {
        let u = q.front();
        arr.push(u);
        q.pop();
        let f = true;
        for (let i = 0; i < 4; i++) {
            if (u.x + dx[i] == t.x && u.y + dy[i] == t.y) {
                f = false;
                arr.push(t);
                parent[u.x + dx[i]][u.y + dy[i]] = [u.x, u.y];
                break;
            }
            if (ok(u.x + dx[i], u.y + dy[i], h, w) && !visited[u.x + dx[i]][u.y + dy[i]]) {
                visited[u.x + dx[i]][u.y + dy[i]] = true;
                q.push({
                    x: u.x + dx[i],
                    y: u.y + dy[i]
                })
                parent[u.x + dx[i]][u.y + dy[i]] = [u.x, u.y];
            }
        }
        if (!f) break;
    }
    return [arr, parent]
}