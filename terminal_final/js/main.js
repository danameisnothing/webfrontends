"use strict";

const term = new Terminal();
term.open(document.getElementById("terminal"));
term.onKey((e) => {
    switch (e.domEvent.key) {
        case "Backspace":
            term.write("\b \b");
            break;
        case "Enter":
            term.write("\r\n");
            break;
        default:
            term.write(e.domEvent.key);
            break;
    }
});