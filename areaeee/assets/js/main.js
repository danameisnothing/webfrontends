const categories_sel = document.querySelector("#categories");
const subcategories_sel = document.querySelector("#subcategories");
const canvas = document.querySelector("#visualizer");
const ctx = canvas.getContext("2d");
const calcInp = document.querySelector("#calc_inp");

// shape configuration table keyed by the "data-shape" value in the DOM
const SHAPES = {
    // *** area shapes ***
    "persegi": {
        category: "area",
        inputs: [
            { name: "sisi", label: "Sisi (s)" }
        ],
        calc: ({ sisi }) => sisi * sisi,
        draw: (ctx, canvas, vals = { sisi: 100 }) => {
            const s = vals.sisi;
            canvas.width = s + 20;
            canvas.height = s + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.rect(10, 10, s, s);
            ctx.stroke();
        }
    },
    "persegi-panjang": {
        category: "area",
        inputs: [
            { name: "panjang", label: "Panjang (p)" },
            { name: "lebar", label: "Lebar (l)" }
        ],
        calc: ({ panjang, lebar }) => panjang * lebar,
        draw: (ctx, canvas, vals = { panjang: 150, lebar: 80 }) => {
            const p = vals.panjang;
            const l = vals.lebar;
            canvas.width = p + 20;
            canvas.height = l + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.rect(10, 10, p, l);
            ctx.stroke();
        }
    },
    "segitiga": {
        category: "area",
        inputs: [
            { name: "alas", label: "Alas (a)" },
            { name: "tinggi", label: "Tinggi (t)" }
        ],
        calc: ({ alas, tinggi }) => 0.5 * alas * tinggi,
        draw: (ctx, canvas, vals = { alas: 150, tinggi: 100 }) => {
            const a = vals.alas;
            const t = vals.tinggi;
            canvas.width = a + 20;
            canvas.height = t + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(10, canvas.height - 10);
            ctx.lineTo(10 + a, canvas.height - 10);
            ctx.lineTo(10, canvas.height - 10 - t);
            ctx.closePath();
            ctx.stroke();
        }
    },
    "lingkaran": {
        category: "area",
        inputs: [
            { name: "jari", label: "Jari-jari (r)" }
        ],
        calc: ({ jari }) => Math.PI * jari * jari,
        draw: (ctx, canvas, vals = { jari: 50 }) => {
            const r = vals.jari;
            canvas.width = r * 2 + 20;
            canvas.height = r * 2 + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.arc(r + 10, r + 10, r, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    "trapesium": {
        category: "area",
        inputs: [
            { name: "a", label: "Sisi atas (a)" },
            { name: "b", label: "Sisi bawah (b)" },
            { name: "t", label: "Tinggi (t)" }
        ],
        calc: ({ a, b, t }) => 0.5 * (parseFloat(a) + parseFloat(b)) * t,
        draw: (ctx, canvas, vals = { a: 100, b: 150, t: 80 }) => {
            const a = vals.a;
            const b = vals.b;
            const t = vals.t;
            const width = Math.max(a, b) + 20;
            canvas.width = width;
            canvas.height = t + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(10, canvas.height - 10);
            ctx.lineTo(10 + b, canvas.height - 10);
            ctx.lineTo(10 + b - (b - a) / 2, canvas.height - 10 - t);
            ctx.lineTo(10 + (b - a) / 2, canvas.height - 10 - t);
            ctx.closePath();
            ctx.stroke();
        }
    },

    // *** volume shapes ***
    "kubus": {
        category: "volume",
        inputs: [
            { name: "sisi", label: "Sisi (s)" }
        ],
        calc: ({ sisi }) => Math.pow(sisi, 3),
        draw: (ctx, canvas, vals = { sisi: 100 }) => {
            // simple square as top face of cube
            const s = vals.sisi;
            canvas.width = s + 20;
            canvas.height = s + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.rect(10, 10, s, s);
            ctx.stroke();
        }
    },
    "prisma": {
        category: "volume",
        inputs: [
            { name: "panjang", label: "Panjang (p)" },
            { name: "lebar", label: "Lebar (l)" },
            { name: "tinggi", label: "Tinggi (t)" }
        ],
        calc: ({ panjang, lebar, tinggi }) => panjang * lebar * tinggi,
        draw: (ctx, canvas, vals = { panjang: 120, lebar: 80, tinggi: 60 }) => {
            const p = vals.panjang;
            const l = vals.lebar;
            canvas.width = p + 20;
            canvas.height = l + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.rect(10, 10, p, l);
            ctx.stroke();
        }
    },
    "tabung": {
        category: "volume",
        inputs: [
            { name: "jari", label: "Jari-jari (r)" },
            { name: "tinggi", label: "Tinggi (t)" }
        ],
        calc: ({ jari, tinggi }) => Math.PI * jari * jari * tinggi,
        draw: (ctx, canvas, vals = { jari: 40, tinggi: 100 }) => {
            const r = vals.jari;
            const t = vals.tinggi;
            canvas.width = r * 2 + 20;
            canvas.height = t + r * 2 + 20;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            // top circle
            ctx.arc(r + 10, r + 10, r, 0, Math.PI * 2);
            ctx.stroke();
            // side rectangle
            ctx.beginPath();
            ctx.rect(10, r + 10, r * 2, t);
            ctx.stroke();
        }
    }
};

function uijank_show_thing(target_id) {
    for (let i = 0; i < subcategories_sel.children.length; i++) {
        const subcurr = subcategories_sel.children[i];
        subcurr.style.display = (target_id !== null && subcurr.dataset.categoryFor === target_id) ? "block" : "none";
    }
}

function selectShape(shapeId) {
    const shape = SHAPES[shapeId];
    if (!shape) {
        console.warn("unknown shape", shapeId);
        return;
    }

    // clear existing inputs/result
    calcInp.innerHTML = "";
    const resultEl = document.getElementById("result");
    if (resultEl) resultEl.remove();

    // draw with default values
    if (shape.draw) {
        shape.draw(ctx, canvas);
    }

    // create input fields
    shape.inputs.forEach(inp => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        label.textContent = inp.label + ": ";
        label.htmlFor = inp.name;
        const input = document.createElement("input");
        input.type = "number";
        input.id = inp.name;
        input.name = inp.name;
        input.min = "0";
        div.appendChild(label);
        div.appendChild(input);
        calcInp.appendChild(div);
    });

    const submit = document.createElement("button");
    submit.textContent = shape.category === "area" ? "Hitung Luas" : "Hitung Volume";
    submit.addEventListener("click", () => {
        const vals = {};
        shape.inputs.forEach(inp => {
            vals[inp.name] = parseFloat(document.getElementById(inp.name).value) || 0;
        });
        const answer = shape.calc(vals);
        showResult(answer, shape.category);
        if (shape.draw) shape.draw(ctx, canvas, vals);
    });
    calcInp.appendChild(submit);
}

function showResult(value, category) {
    let el = document.getElementById("result");
    if (!el) {
        el = document.createElement("div");
        el.id = "result";
        calcInp.parentNode.appendChild(el);
    }
    el.textContent = `${category === "area" ? "Luas" : "Volume"}: ${value}`;
}

// event delegation for categories and shapes
categories_sel.addEventListener("click", e => {
    if (e.target.matches("a")) {
        const target_id = e.target.dataset.idTarget;
        uijank_show_thing(target_id);
    }
});

subcategories_sel.addEventListener("click", e => {
    if (e.target.matches("a")) {
        const shapeId = e.target.dataset.shape;
        selectShape(shapeId);
    }
});

// on load hide all subcategories
uijank_show_thing(null);
