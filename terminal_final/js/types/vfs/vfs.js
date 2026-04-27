"use strict";

export const VFS_PATH_SEPARATOR = "/";

export class VFSNode {
    /** @type {String} */
    name;
    /** @type {Number} */
    createdTime;
    /** @type {Number} */
    modifiedTime;
    /** @type {Number} Do some wacky thing with bitfields. */
    permissions;
    /** @type {?VFSNode[]} null to indicate a file, or a VFSNode array to indicate a directory. */
    childNodes;

    // for why pass createdTime and modifiedTime, to make it easier for VFS storing later on (if we want to do that)
    /**
     * Creates a new VFS node.
     * @param {Object} obj
     * @param {String} obj.name
     * @param {Number} obj.createdTime
     * @param {Number} obj.modifiedTime
     * @param {Number} obj.permissions
     * @param {?VFSNode[]} obj.childNodes
     */
    constructor({name, createdTime = performance.now(), modifiedTime = performance.now(), permissions = null, childNodes = null}) {
        // why would you anyway?
        if (name.includes(VFS_PATH_SEPARATOR)) throw new Error("invalid char on node name");

        this.name = name;
        this.createdTime = createdTime;
        this.modifiedTime = modifiedTime;
        this.permissions = permissions;
        this.childNodes = childNodes;
    }
}
