"use strict";

import { Term } from "./types/term/term.js";

import { sh } from "./commands/sh.js";

// this is just for bootstrapping
const xterm = new Terminal();
xterm.open(document.getElementById("terminal"));

const term = new Term({
    width: 60,
    height: 20,
    xterm: xterm
});
term.runProcess({
    name: "sh",
    func: sh,
    args: []
});

// TODO: cantumkan sumber
// created with the Windsurf IDE
// XTerm.js is used, MIT licensed
// custom Terminal parser from an undisclosed personal project lol