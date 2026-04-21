"use strict";

export class Env {
    /** @type {String} */
    name;
    /** @type {String} */
    value;

    /**
     * Creates a new environment variable.
     * @param {Object} obj
     * @param {String} obj.name
     * @param {String} obj.val
     */
    constructor({name, val}) {
        this.name = name;
        this.value = val;
    }
}