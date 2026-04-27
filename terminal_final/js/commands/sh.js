"use strict";

import { Term } from "../types/term/term.js";

export const EOL = "\r\n"; // michaelsoft binbows

// https://stackoverflow.com/a/35718902
function readInp(xterm) {
    return new Promise((resolve, reject) => {
        let inpBuf = "";
        // https://stackoverflow.com/a/71109840
        const lstnr = xterm.onKey((e) => {
            switch (e.domEvent.key) {
                case "Backspace":
                    if (inpBuf.length === 0) return;
                    inpBuf = inpBuf.slice(0, -1);
                    xterm.write("\b \b");
                    break;
                case "Enter":
                    xterm.write("\r\n");
                    lstnr.dispose();
                    resolve(inpBuf);
                    break;
                default:
                    // just making sure that we only write keys that take up one char
                    if (e.domEvent.key.length !== 1) return;
                    inpBuf += e.domEvent.key;
                    xterm.write(e.domEvent.key);
                    break;
            }
        });
    });
}

/**
 * only for IntelliSense lol
 * @param {string[]} args
 * @param {Term} term
 */
export function sh(args, term) {
    // we don't get free blocking input like you would on a real terminal environment
    (async () => {
        // referencing
        const xterm = term.xterm;
        while (true) {
            const path = term.resolvePath("/root/");
            xterm.write(`${path.name} $ `);
            const inp = await readInp(xterm);
            xterm.write(`${inp}${EOL}`);
        }
    })();
}