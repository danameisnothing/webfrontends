"use strict";

import { VFSNode } from "../vfs/vfs.js";

// TODO: JSDoc!
class Terminal {
    width;
    height;
    processes;
    env;
    vfs;
    pwdRef; // TODO: somehow use references?
    startTime;

    constructor({width, height}) {
        this.width = width;
        this.height = height;
        this.processes = [];
        this.env = [];
        this.vfs = this.buildFS();
        this.pwdRef = null; // TODO: somehow use references?
        this.startTime = performance.now();
    }

    buildFS() {
        return new VFSNode({
            name: "", // root dir, empty
            childNodes: [
                new VFSNode({name: "home"}),
                new VFSNode({name: "usr"}),
                new VFSNode({name: "root"}),
            ]
        });
    }
}