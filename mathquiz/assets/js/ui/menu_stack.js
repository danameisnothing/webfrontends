// TODO: JSDoc!
import { Vector2 } from "../types/Vector2.js"

// TODO: transplant from the one I made in C
export class MenuStack {
    #size;
    #currPos;

    // items is structured like this :
    // [item1, item2]
    // [item3, NULL]
    // [item4, item5]
    constructor(items) {
        // sanity checks
        if (items.length === 0) throw new Error("array length expected to be >0");
        if (!items.every((x) => x.length === items[0].length)) throw new Error("array sizes must be the same for all");

        this.items = items;
        this.#size = new Vector2(items[0].length, items.length);
        this.#currPos = Vector2.zero();
    }
}