// this code was partially speedran through, expect poor-quality code, and little-to-no comments

import { ShapeEntry } from "./types/shape_entry.js";

const categories_sel = document.querySelector("#categories");
const subcategories_sel = document.querySelector("#subcategories");
const display_area = document.querySelector("#main_content");

// thanks Claude :)
const SHAPES = [
    new ShapeEntry({
        shape: "Persegi",
        canvas_draw_func: (ctx, canvas) => {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },
        canvas_ctx: "2d",
        inputs: ["Sisi"],
        calculate: () => {
            const sisi = Number(display_area.querySelector("#Sisi").value);
            return sisi * sisi;
        },
        id: "persegi",
        placeholder_formula: "S^2"
    }),
    new ShapeEntry({
        shape: "Persegi Panjang",
        canvas_draw_func: (ctx, canvas) => {},
        canvas_ctx: "2d",
        inputs: ["Panjang", "Lebar"],
        calculate: () => {
            const panjang = Number(display_area.querySelector("#Panjang").value);
            const lebar = Number(display_area.querySelector("#Lebar").value);
            return panjang * lebar;
        },
        id: "persegi-panjang",
        placeholder_formula: "PL"
    }),
    new ShapeEntry({
        shape: "Segitiga (Sembarang)",
        canvas_draw_func: (ctx, canvas) => {},
        canvas_ctx: "2d",
        inputs: ["A", "B", "C"],
        calculate: () => {
            // use Heron's formula, thanks math
            const a = Number(display_area.querySelector("#A").value);
            const b = Number(display_area.querySelector("#B").value);
            const c = Number(display_area.querySelector("#C").value);
            const s = (a + b + c) / 2;
            return Math.sqrt(s * (s - a) * (s - b) * (s - c));
        },
        id: "segitiga",
        placeholder_formula: "√(s(s-a)(s-b)(s-c))"
    }),
    new ShapeEntry({
        shape: "Lingkaran",
        canvas_draw_func: (ctx, canvas) => {},
        canvas_ctx: "2d",
        inputs: ["Jari-Jari"],
        calculate: () => {
            const r = Number(display_area.querySelector("#Jari-Jari").value);
            return Math.PI * r * r;
        },
        id: "lingkaran",
        placeholder_formula: "πr^2"
    }),
    new ShapeEntry({
        shape: "Trapesium",
        canvas_draw_func: (ctx, canvas) => {},
        canvas_ctx: "2d",
        inputs: ["Atas", "Bawah", "Tinggi"],
        calculate: () => {
            const a = Number(display_area.querySelector("#Atas").value);
            const b = Number(display_area.querySelector("#Bawah").value);
            const t = Number(display_area.querySelector("#Tinggi").value);
            return ((a + b) / 2) * t;
        },
        id: "trapesium",
        placeholder_formula: "((a+b)/2)t"
    })
];

function uijank_show_thing(target_id) {
    for (let i = 0; i < subcategories_sel.children.length; i++) {
        const subcurr = subcategories_sel.children[i];
        subcurr.style.display = (target_id !== null && subcurr.dataset.categoryFor === target_id) ? "block" : "none";
    }
}

function uijank_reset_display_area(target) {
    // https://stackoverflow.com/a/3955238
    while (target.lastChild) target.removeChild(target.lastChild);
}

function uijank_init_shape(id) {
    for (let i = 0; i < SHAPES.length; i++) {
        const curr = SHAPES[i];
        if (curr.id === id) {
            // because CreateElement() and the like seems like too much code
            display_area.insertAdjacentHTML("beforeend", `<canvas id="visualizer"></canvas>
<div id="calc_inp"></div>
<p id="area_res">Luas : ${curr.placeholder_formula}</p>`);
            const canvas = display_area.querySelector("#visualizer");
            curr.canvas_draw_func(canvas.getContext(curr.canvas_ctx), canvas);

            const calc_inp = display_area.querySelector("#calc_inp");
            for (let j = 0; j < curr.inputs.length; j++) {
                const input = curr.inputs[j];
                calc_inp.insertAdjacentHTML("beforeend", `<label for="${input}"><span>${input}</span></label>
<input id="${input}" type="number">
<br>`); // got a little lazy here
                document.querySelector(`#${input}`).addEventListener("input", () => {
                    if (curr.inputs.every((inp) => display_area.querySelector(`#${inp}`).value !== ""))
                        display_area.querySelector("#area_res").textContent = `Luas : ${curr.calculate()}`;
                    else
                        display_area.querySelector("#area_res").textContent = `Luas : ${curr.placeholder_formula}`;
                });
            }

            return;
        }
    }

    // if we got here, we can't find the id
    console.error(`Shape id "${id}" not implemented!`);
}

for (let i = 0; i < categories_sel.children.length; i++) {
    const curr = categories_sel.children[i];
    curr.addEventListener("click", (_) => {
        const target_id = curr.dataset.idTarget;
        uijank_show_thing(target_id);
    });
}

for (let i = 0; i < subcategories_sel.children.length; i++) {
    const subcurr = subcategories_sel.children[i];
    for (let j = 0; j < subcurr.children.length; j++) {
        const subcurr_child = subcurr.children[j];
        subcurr_child.addEventListener("click", (_) => {
            uijank_reset_display_area(display_area);
            uijank_init_shape(subcurr_child.dataset.shape);
        });
    }
}

// startup jank
uijank_show_thing(null);
uijank_reset_display_area(display_area);