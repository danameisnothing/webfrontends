"use strict";

export class Process {
    /** @type {Number} */
    pid;
    /** @type {String} */
    name;
    /** @type {Number} */
    startTime;

    // if they're on old browsers, I don't know what to say
    /**
     * Creates a new process.
     * @param {Object} obj
     * @param {Number} obj.pid
     * @param {String} obj.name
     * @param {Number} obj.startTime
     */
    constructor({pid, name, startTime = performance.now()}) {
        this.pid = pid; // FIXME: this is controlled by terminal.js, because the array is inside terminal.js! consider controlling PID assignment in here instead!
        this.name = name;
        this.startTime = startTime;
    }
}
