import { CARD_ENTRIES } from "./consts.js";

export function populateCards() {
    for (let i = 0; i < CARD_ENTRIES.length; i++) {
        let strBuf = "";
        for (let j = 0; j < CARD_ENTRIES[i].entries.length; j++) {
            const CUR_ENTRY = CARD_ENTRIES[i].entries[j];
            strBuf += `<div class="card_set">
        <div class="card_full">
            <div class="card_zoomer">
                <div class="card_entry_backside"></div>
                <div class="card_entry_frontside">
                    <img width="${CUR_ENTRY.img_width}" class="card_img"
                        src="${CUR_ENTRY.img_url}">
                </div>
            </div>
        </div>
        <div class="card_property">
            <div class="card_prop_container">
                <h3 class="card_prop_title">${CUR_ENTRY.card_title}</h3>
                <div class="card_prop_desc_container">
                    <i class="card_prop_description">${CUR_ENTRY.card_description}</i>
                </div>
            </div>
        </div>
    </div>`;
        }
        const HTML_TEMPLATE = `<div class="card_entry" id="cardentry_${CARD_ENTRIES[i].kind}">
    ${strBuf}
</div>`;
        document.querySelector("#card_section").insertAdjacentHTML("afterend", HTML_TEMPLATE);
    }
}