"use strict";

import { Term } from "../term/term.js";

// only used for lookup by sh!
export class Command {
    /** @type {String} */
    name;
    /** @type {Function(string[], Term)} */
    func;

    /**
     * @param {Object} obj
     * @param {String} obj.name
     * @param {Function(string[], Term)} obj.func
     */
    constructor({name, func}) {
        this.name = name;
        this.func = func;
    }
}