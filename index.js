// The Temporal API is still widely unsupported
const W10_EOL_DATE = new Date(2025, 9, 14);

let win10EOLEl = document.querySelector("#windows_10_eol_time");
let delta = W10_EOL_DATE.getTime() - Date.now()

// yikes
let seconds = Math.floor(delta / 1000);
let minutes = Math.floor(seconds / 60);
let hours = Math.floor(minutes / 60);
let days = Math.floor(hours / 24);
let weeks = Math.floor(days / 7);

let builder = "";

if (seconds >= 0) {
    builder = "will reach EOL in ";
    if (weeks > 0) {
        builder += `${weeks} week${(weeks != 1) ? "s" : ""}, `;
    } if (days > 0) {
        builder += `${days % 7} day${(days % 7 != 1) ? "s" : ""}, `;
    } if (hours > 0) {
        builder += `${hours % 24} hour${(hours % 24 != 1) ? "s" : ""}, `;
    } if (minutes > 0) {
        builder += `${minutes % 60} minute${(minutes % 60 != 1) ? "s" : ""}, `;
    }
    builder += `${seconds % 60} second${(seconds % 60 != 1) ? "s" : ""}`;
} else {
    builder = "has reached EOL :(";
}
win10EOLEl.innerText = `${builder}`;