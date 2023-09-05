"use client"
import React, { useEffect, useRef, useState } from "react"
import bfs from "../app/lib/Bfs";
import dfs from "../app/lib/Dfs";
import getRecursiveMaze from "../app/lib/RecursiveMaze";
import RandomMaze from "../app/lib/RandomMaze";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export default function Board() {
    const [w, setw] = useState(0);
    const [h, seth] = useState(28);
    const f = useRef(false);
    const setTermPoint = useRef(new Array(2).fill([-1, -1]));

    const start = useRef<any>();
    const terminate = useRef<any>();
    const running = useRef(false);
    const [center, setcenter] = useState({
        x: Math.floor(h / 2),
        y: Math.max(Math.floor(w / 2) - 10, 0)
    })

    let walls: Boolean[][] = [];

    let freeze = false;
    // Reference to td
    let createEl = new Array(h);
    for (let i = 0; i < h; i++) createEl[i] = []
    const rectangles = useRef(createEl)


    walls = new Array(h);
    for (let i = 0; i < h; i++) {
        walls[i] = new Array(w).fill(false);
    }

    function whInit() {
        setw(Math.floor(window.innerWidth / 25))
        setcenter({
            x: Math.floor(h / 2),
            y: Math.max(Math.floor(window.innerWidth / 50) - 10, 0)
        });
    }
    useEffect(() => {
        start.current = { x: 0, y: 0 };
        terminate.current = { x: h - 1, y: w - 1 };
        walls = [];
        walls = new Array(h);
        for (let i = 0; i < h; i++) {
            walls[i] = new Array(w).fill(false);
        }
        clear(true);
    }, [w]);
    useEffect(() => {
        clear(true);
        whInit();
        function handleResize() {
            if (!running.current) {
                whInit();
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
        // clear(false);
        let terminal = terminate.current;
        let arr, parent;

        // Bfs running . Returns an array and parent array
        if (n == 0) {
            let ret = bfs(center, terminal, w, h, walls);
            arr = ret[0];
            parent = ret[1];
        }
        else if (n == 1) {
            let ret = dfs(center, terminal, h, w, walls);
            arr = ret[0]
            parent = ret[1]
        }
        try {
            if (arr) {
                running.current = true;
                for (let i = 0; i < arr.length; i++) {
                    await sleep(1)
                    try {
                        rectangles.current[arr[i].x][arr[i].y].classList.add('visited');
                    } catch (err) {
                        running.current = false;
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
                        if (freeze) return;
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
        catch {

        }
    }

    // Clearing the board
    const clear = (f: Boolean) => {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                walls[i][j] = false;
            }
        }
        if (isrunning()) return;
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                let x1 = start.current.x, y1 = start.current.y, x2 = terminate.current.x, y2 = terminate.current.y;
                if (!f && ((i == x1 && j == y1) || (i == x2 && j == y2))) continue;
                rectangles.current[i][j].classList = []
                rectangles.current[i][j].classList.add("border-[1px]", "border-[#afd8f8]", "w-[25px]", "h-[25px]", "bg-whtie", "text-center", "font-light")
            }
        }
        if (f) {
            let x = 20;
            let MinY = Math.max(center.y, 0), MaxY = Math.min(center.y + x, w - 1);
            terminate.current = { ...center, y: MaxY }
            start.current = { ...center, y: MinY };
            if (rectangles.current[start.current.x][start.current.y])
                rectangles.current[start.current.x][start.current.y].classList.add('start');
            if (rectangles.current[terminate.current.x][terminate.current.y])
                rectangles.current[terminate.current.x][terminate.current.y].classList.add('target');
        }
    }


    // Adding a terminator el
    const addTerminal = () => {
        let x = Number(setTermPoint.current[0].value), y = Number(setTermPoint.current[1].value);
        if (typeof x == 'number' && typeof y == 'number') {
            if (x >= 0 && x < h && y >= 0 && y < w) {
                if (x == start.current.x && y == start.current.y) {
                    alert("Start and Terminate shouldn't be at same cell.");
                    return;
                }
                if (walls[x][y]) {
                    rectangles.current[x][y].classList.remove('wall');
                    walls[x][y] = false;
                }
                rectangles.current[terminate.current.x][terminate.current.y].classList.remove('target');
                rectangles.current[x][y].classList.add('target');
                terminate.current = { x, y };
            }
        } else {
            alert("Invalid Input")
        }
    }


    async function createMaze(type: number) {
        clear(false);
        running.current = true;
        let ret = [
            [0, 0, 0, w - 2],
            [0, 0, h - 2, 0],
            [0, w - 1, h - 2, w - 1],
            [h - 1, 0, h - 1, w - 1],
        ]
        if (type == 0)
            ret.push(...getRecursiveMaze(2, 2, h - 3, w - 3, 'vertical'))
        else if (type == 1)
            ret.push(...getRecursiveMaze(2, 2, h - 3, w - 3, 'horizontal'))
        else if (type == 2)
            ret.push(...RandomMaze(h, w));
        for (let i = 0; i < ret.length; i++) {
            let x1 = ret[i][0], y1 = ret[i][1], x2 = ret[i][2], y2 = ret[i][3], c = ret[i][4];
            for (let i = x1; i <= x2; i++) {
                for (let j = y1; j <= y2; j++) {
                    if ((x1 == x2 && j == c) || (y1 == y2 && i == c)) continue;
                    if ((i == start.current.x && j == start.current.y) || (i == terminate.current.x && j == terminate.current.y)) continue;
                    else {
                        await sleep(0);
                        try {
                            walls[i][j] = true;
                            rectangles.current[i][j].classList.add('wall');
                        } catch { }
                    }
                }
            }
        }
        running.current = false;
    }
    return (
        <div className="flex flex-col items-stretch h-fit min-h-screen">
            <div className="justify-between ">
                <div className="flex md:hidden border-b-black/40 border-b-2 p-4 w-full">
                    <svg onClick={() => {

                    }} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:hidden"><path d="M8 2H13.5C13.7761 2 14 2.22386 14 2.5V12.5C14 12.7761 13.7761 13 13.5 13H8V2ZM7 2H1.5C1.22386 2 1 2.22386 1 2.5V12.5C1 12.7761 1.22386 13 1.5 13H7V2ZM0 2.5C0 1.67157 0.671573 1 1.5 1H13.5C14.3284 1 15 1.67157 15 2.5V12.5C15 13.3284 14.3284 14 13.5 14H1.5C0.671573 14 0 13.3284 0 12.5V2.5Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                    <a className="md:hidden ml-6 flex items-center space-x-2" href="/">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6"><rect width="256" height="256" fill="none"></rect><line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                        <span className="md:hidden font-bold sm:inline-block">Path Finder</span>
                    </a>
                </div>
                <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-40 border-b bg-background/95 backdrop-blur flex-col md:flex md:flex-row md:w-full">
                    <div className="md:container mx-auto flex h-14 items-center">
                        <div className="mr-4 hidden md:flex">
                            <a className="mr-6 flex items-center space-x-2" href="/">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6"><rect width="256" height="256" fill="none"></rect><line x1="208" y1="128" x2="128" y2="208" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line><line x1="192" y1="40" x2="40" y2="192" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></line></svg>
                                <span className="hidden font-bold sm:inline-block">Path Finder</span>
                            </a>
                        </div>
                        <div className="flex justify-center items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div>
                                        <div className='rounded flex flex-row justify-center items-center hover:bg-slate-200 dark:hover:bg-zinc-800 p-2'>
                                            <span className='p-2'>Algorithms</span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Select an Algorithm</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <button onClick={() => run(0)} className="p-1">BFS</button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>

                                        <button onClick={() => run(1)} className="p-1">DFS</button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div>
                                        <div className='rounded flex flex-row justify-center items-center hover:bg-slate-200 dark:hover:bg-zinc-800 p-2'>
                                            <span className='p-2'>Maze</span>
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Select a Maze</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <button onClick={() => createMaze(0)} className="w-full text-left">Vertical Skew</button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button onClick={() => createMaze(1)} className="w-full text-left">Horizontal Skew</button>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <button onClick={() => createMaze(2)} className="w-full text-left">Random Maze</button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button onClick={() => clear(true)} className="m-2">Clear</Button>
                        </div>

                    </div>
                    <div className="flex">
                        <Input ref={(t) => setTermPoint.current[0] = t} placeholder="X" className="m-2 w-12" />
                        <Input ref={(t) => setTermPoint.current[1] = t} placeholder="Y" className="m-2 w-12" />
                        <Button onClick={() => addTerminal()} className="m-2">Target</Button>
                    </div>
                </header >
            </div>

            <div className="flex md:justify-center mt-20 mb-20 flex-wrap gap-5">
                <div className="flex items-center">
                    <div className="start border-0 w-[25px] h-[25px] bg-whtie text-center font-light"></div>
                    <div className="ml-2 mr-2">Start Node</div>
                </div>
                <div className="flex items-center">
                    <div className="start border-0 w-[25px] h-[25px] bg-whtie text-center font-light target"></div>
                    <div className="ml-2 mr-2">Target Node</div>
                </div>
                <div className="flex items-center">
                    <div className="border-[1px] border-[#afd8f8] w-[25px] h-[25px] bg-whtie text-center font-light"></div>
                    <div className="ml-2 mr-2">Unvisited Node</div>
                </div>
                <div className="flex items-center">
                    <div className="visited border-0 w-[25px] h-[25px] bg-whtie text-center font-light"></div>
                    <div className="ml-2 mr-2">Visited Node</div>
                </div>
                <div className="flex items-center">
                    <div className="border-0 w-[25px] h-[25px] bg-whtie text-center font-light wall"></div>
                    <div className="ml-2 mr-2">Wall Node</div>
                </div>
            </div>
            <div className="mb-5">
                <table className="m-2">
                    <tbody>
                        {
                            new Array(h).fill(0).map((_i, i) => {
                                return (
                                    <tr key={i}>
                                        {
                                            new Array(w).fill(0).map((_j, j) => {
                                                return (
                                                    <td onClick={() => {
                                                        if ((i != start.current.x && j != start.current.y) || (i != terminate.current.x && j != terminate.current.y)) {
                                                            rectangles.current[i][j].classList.toggle('wall');
                                                            walls[i][j] = !walls[i][j];
                                                        }
                                                    }} onDragOver={() => {
                                                        rectangles.current[i][j].classList.toggle('wall');
                                                        walls[i][j] = !walls[i][j];
                                                    }} title={`${i},${j}`} ref={(t) => rectangles.current[i][j] = t} key={i + j} className={'border-[1px] border-[#afd8f8] w-[25px] h-[25px] bg-whtie text-center font-light'}></td >
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
        </div >
    )
}
