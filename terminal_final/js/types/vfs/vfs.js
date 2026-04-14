"use strict";

export const PATH_SEPARATOR = "/";

export class VFSNode {
    name;
    createdTime;
    modifiedTime;
    permissions; // TODO: figure out what class to store this on!
    childNodes; // null or array of VFSNode

    // for why pass createdTime and modifiedTime, to make it easier for VFS storing later on (if we want to do that)
    constructor({name, createdTime = performance.now(), modifiedTime = performance.now(), permissions = null, childNodes = null}) {
        // why would you anyway?
        if (name.includes(PATH_SEPARATOR)) throw new Error("invalid char on node name");

        this.name = name;
        this.createdTime = createdTime;
        this.modifiedTime = modifiedTime;
        this.permissions = permissions;
        this.childNodes = childNodes;
    }
}
