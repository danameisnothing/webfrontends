"use strict";

import { VFSNode, VFS_PATH_SEPARATOR } from "../vfs/vfs.js";
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
     * Recursively traverses the VFS to find a node. Note that depth starts with one, because the first slice is the root directory, which is empty.
     * @param {string[]} slices
     * @param {number} depth
     * @param {VFSNode} fs
     * @returns {VFSNode | null}
     */
    #recursePath(slices, depth, fs) {
        // special case, too lazy
        if (slices.length === 1 && slices[0] === "") {
            return fs;
        }

        for (let i = 0; i < fs.childNodes.length; i++) {
            if (fs.childNodes[i].name === slices[depth]) {
                if (depth === slices.length - 1) return fs;

                return this.#recursePath(slices, depth + 1, fs.childNodes[i]);
            }
        }

        return null;
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

    /**
     * Resolves a path to a VFS node
     * @param {string} path
     * @returns {VFSNode}
     */
    resolvePath(path) {
        const end = (path.endsWith(VFS_PATH_SEPARATOR)) ? path.length - 1 : path.length;
        const cpy = path.substring(0, end);
        const slices = cpy.split(VFS_PATH_SEPARATOR);
        if (slices.length <= 0) {
    		throw new Error("invalid path format");
        }
        if (slices[0] !== "") {
            throw new Error("invalid path format");
        }

        const val = this.#recursePath(slices, 1, this.vfs);
        if (val === null) throw new Error(`path "${path}" not found`);

        return val;
    }
}