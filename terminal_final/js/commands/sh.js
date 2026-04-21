"use strict";

export const EOL = "\r\n"; // michaelsoft binbows

export function sh(args, term) {
    // we don't get free blocking input like you would on a real terminal environment
    (async () => {
        // referencing
        const xterm = term.xterm;
        xterm.write(`Hello, testing if this won't fall over${EOL}`);
        xterm.onKey((e) => {
            switch (e.domEvent.key) {
                case "Backspace":
                    xterm.write("\b \b");
                    break;
                case "Enter":
                    xterm.write("\r\n");
                    break;
                default:
                    xterm.write(e.domEvent.key);
                    break;
            }
        });
    })();
}