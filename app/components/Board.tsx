"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import bfs from "../lib/Bfs";
import dfs from "../lib/Dfs";

export default function Board() {
    const [w, setw] = useState(70);
    const [h, seth] = useState(26);
    const setTermPoint = useRef(new Array(2).fill([-1, -1]));

    const termina = useRef<any>();
    const running = useRef(false);
    const [center, setcenter] = useState({
        x: Math.floor(h / 2),
        y: Math.max(Math.floor(w / 2) - 10, 0)
    })


    // Reference to td
    let createEl = new Array(h);
    for (let i = 0; i < h; i++) createEl[i] = []
    const rectangles = useRef(createEl)



    useEffect(() => {
        clear(true);
    }, [w]);

    useEffect(() => {
        function handleResize() {
            if (!running.current) {
                setw(Math.floor(window.innerWidth / 20))
                setcenter({
                    x: Math.floor(h / 2),
                    y: Math.max(Math.floor(window.innerWidth / 40) - 10, 0)
                });
            }
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    const sleep = (delay: number) => new Promise((resolve) => setTimeout(resolve, delay))
    function isrunning() {
        if (running.current) {
            alert("Already running a process");
            return true;
        }
        return false;
    }
    // This is to run pathfinding algorithms
    const run = async (n: number) => {
        if (isrunning()) return;
        clear(true);
        let terminal = termina.current;
        let arr, parent;

        // Bfs running . Returns an array and parent array
        if (n == 0) {
            let ret = bfs(center, terminal, w, h);
            arr = ret[0];
            parent = ret[1];
        }
        else if (n == 1) {
            let ret = dfs(center, terminal, h, w);
            arr = ret[0]
            parent = ret[1]
        }
        if (arr) {
            running.current = true;
            for (let i = 0; i < arr.length; i++) {
                await sleep(1)
                try {
                    rectangles.current[arr[i].x][arr[i].y].classList.add('visited');
                } catch (err) {
                }
            }
            if (parent) {
                let p = [];

                // Terminal point to starting point
                while (terminal.x != -1 || terminal.y != -1) {
                    p.push(terminal);
                    terminal = {
                        x: parent[terminal.x][terminal.y][0],
                        y: parent[terminal.x][terminal.y][1]
                    }
                }
                p.reverse()
                for (let i = 0; i < p.length; i++) {
                    rectangles.current[p[i].x][p[i].y].classList.remove('visited');
                    rectangles.current[p[i].x][p[i].y].classList.add('shortest-path')
                    rectangles.current[p[i].x][p[i].y].classList.add('shortest-path-unweighted')
                    await sleep(1);
                    if (i != p.length - 1) {
                        rectangles.current[p[i].x][p[i].y].classList.remove('shortest-path-unweighted')
                    }
                }
                rectangles.current[p[p.length - 1].x][p[p.length - 1].y].classList.remove('target');
                running.current = false;
            }
        }
    }

    // Clearing the board
    const clear = (f: Boolean) => {
        if (isrunning()) return;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                rectangles.current[i][j].classList = []
                rectangles.current[i][j].classList.add("border-[1px]", "border-[#afd8f8]", "w-[25px]", "h-[25px]", "bg-whtie", "text-center", "font-light")
            }
        }
        if (f) {
            let x = 20;
            let MinY = Math.max(center.y, 0), MaxY = Math.min(center.y + x, w - 1);
            rectangles.current[center.x][MinY].classList.add('start');
            rectangles.current[center.x][MaxY].classList.add('target');
            termina.current = { ...center, y: MaxY }
        }
    }


    // Adding a terminator el
    const addTerminal = () => {
        let x = Number(setTermPoint.current[0].value), y = Number(setTermPoint.current[1].value);
        if (typeof x == 'number' && typeof y == 'number') {
            if (x >= 0 && x < h && y >= 0 && y < w) {
                rectangles.current[x][y].classList.add('target');
            }
        } else {
            alert("Invalid Input")
        }
    }

    return (
        <div>
            <div className="flex justify-between">
                <div>
                    <button onClick={() => run(0)} className="p-2 border-2">BFS</button>
                    <button onClick={() => run(1)} className="p-2 border-2">DFS</button>
                    <button onClick={() => clear(true)} className="p-2 border-2">Clear</button>
                </div>

                <div className="flex justify-end">
                    <input className="p-2 border-2 w-10" type="text" ref={(t) => setTermPoint.current[0] = t} placeholder="X" />
                    <input className="p-2 border-2 w-10" type="text" ref={(t) => setTermPoint.current[1] = t} placeholder="Y" />
                    <button onClick={() => addTerminal()} className="p-2 border-2">Terminal</button>

                </div>

            </div>


            <table className="m-2">
                <tbody>
                    {
                        new Array(h).fill(0).map((_i, i) => {
                            return (
                                <tr key={i}>
                                    {
                                        new Array(w).fill(0).map((_j, j) => {
                                            return (
                                                <td ref={(t) => rectangles.current[i][j] = t} key={i + j} className={'border-[1px] border-[#afd8f8] w-[25px] h-[25px] bg-whtie text-center font-light'}></td >
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table >
        </div>
    )
}
