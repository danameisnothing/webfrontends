"use strict";

// TODO: JSDoc!
class Processes {
    pid;
    name;
    startTime;

    // if they're on old browsers, I don't know what to say
    constructor({pid, name, startTime = performance.now()}) {
        this.pid = pid; // FIXME: this is controlled by terminal.js, because the array is inside terminal.js! consider controlling PID assignment in here instead!
        this.name = name;
        this.startTime = startTime;
    }
}
