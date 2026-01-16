import { CARD_ENTRIES } from "./consts.js";

function addCardKind(kind) {
    let strBuf = "";
    for (let i = 0; i < CARD_ENTRIES.length; i++) {
        if (kind != "all" && CARD_ENTRIES[i].kind != kind) continue;

        for (let j = 0; j < CARD_ENTRIES[i].entries.length; j++) {
            const CUR_ENTRY = CARD_ENTRIES[i].entries[j];
            strBuf += `<div class="card_set">
        <div class="card_full">
            <div class="card_zoomer">
                <div class="card_entry_backside"></div>
                <div class="card_entry_frontside">
                    <img width="${CUR_ENTRY.img_width}" class="card_img"
                        src="${CUR_ENTRY.img_url}" alt="${CUR_ENTRY.img_alt}">
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
    }

    const HTML_TEMPLATE = `<div class="card_entry" id="cardentry_${kind}">
    ${strBuf}
</div>`;
    document.querySelector("#card_section").insertAdjacentHTML("beforeend", HTML_TEMPLATE);
}

function changeCard(el) {
    const container = document.querySelector("#card_section");
    // https://stackoverflow.com/a/3955238
    while (container.lastChild) container.removeChild(container.lastChild);
    addCardKind(el.dataset.cardType);
}

export function initCards() {
    // https://stackoverflow.com/a/8997289
    const els = document.querySelectorAll(`#card_type_selector > input[name="card_type_selector_radios"]`);
    for (let i = 0; i < els.length; i++) {
        els[i].addEventListener("change", () => changeCard(els[i]));
    
        // since that event listener only fires on change, we'll check the default value
        if (els[i].checked) changeCard(els[i]);
    }
}