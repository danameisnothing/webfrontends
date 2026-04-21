"use strict";

import { VFSNode } from "../vfs/vfs.js";
import { Process } from "../process/process.js";
import { Env } from "../env/env.js";
import { Command } from "../command/command.js";

import { sh } from "../../commands/sh.js";

// TODO: JSDoc!
export class Term {
    /** @type {Number} */
    width;
    /** @type {Number} */
    height;
    /** @type {Process[]} */
    processes;
    /** @type {Env[]} */
    env;
    /** @type {VFSNode} */
    vfs;
    pwdRef; // TODO: somehow use references?
    /** @type {Number} */
    startTime;
    /** @type {Command[]} */
    commands;
    /** @type {Terminal} */
    xterm;

    /**
     * Creates a new terminal.
     * @param {Object} obj
     * @param {Number} obj.width
     * @param {Number} obj.height
     * @param {Terminal} obj.xterm
     */
    constructor({width, height, xterm}) {
        this.width = width;
        this.height = height;
        this.processes = [];
        this.env = [];
        this.vfs = this.#buildFS();
        this.pwdRef = null; // TODO: somehow use references?
        this.startTime = performance.now();
        this.commands = this.#buildCommands();
        this.xterm = xterm;
    }

    #buildFS() {
        return new VFSNode({
            name: "", // root dir, empty
            childNodes: [
                new VFSNode({name: "home"}),
                new VFSNode({name: "usr"}),
                new VFSNode({name: "root"}),
            ]
        });
    }

    #buildCommands() {
        return [
            new Command({
                name: "sh",
                func: sh
            })
        ];
    }

    /**
     * Runs a process.
     * @param {Object} obj
     * @param {String} obj.name
     * @param {Function(string[], Term)} obj.func
     * @param {string[]} obj.args
     */
    runProcess({name, func, args}) {
        const freePID = this.#getFreePID();
        this.processes.push(new Process({
            pid: freePID,
            name: name
        }));
        func(args, this);
        this.terminateProcess(freePID);
    }

    // TODO: this should actually kill the running process!
    terminateProcess(pid) {
        this.processes = this.processes.filter((p) => p.pid !== pid);
    }

    #getFreePID() {
        // this technically works, no 0 though
        const pids = this.processes.sort((a, b) => (a.pid < b.pid) ? -1 : 1);
        for (let i = 0; i < pids.length; i++) {
            if (i !== pids[i].pid) {
                return i;
            }
        }
        return 0; // this means first process
    }

    /**
     * Finds the corresponding function for a command
     * @param {string} name 
     * @returns {Function(string[], Term) | null}
     */
    #resolveCommand(name) {
        const res = this.commands.find((c) => c.name === name);
        return res ? res.func : null;
    }
}