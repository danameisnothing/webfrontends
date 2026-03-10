export class ShapeEntry {
    constructor({shape, canvas_draw_func, canvas_ctx, inputs, calculate, id, placeholder_formula}) {
        this.shape = shape;
        this.canvas_draw_func = canvas_draw_func;
        this.canvas_ctx = canvas_ctx;
        this.inputs = inputs;
        this.calculate = calculate;
        this.id = id;
        this.placeholder_formula = placeholder_formula;
    }
}