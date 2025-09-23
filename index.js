// The Temporal API is still widely unsupported
const W10_EOL_DATE = new Date(2025, 9, 14);
const PRIDE_MONTH = 6 - 1;

let win10EOLEl = document.querySelector("#windows_10_eol_time");
let prideStatEl = document.querySelector("#pride_stat");

function jankDeltaData(delta) {
    // yikes
    let seconds = delta / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    let weeks = days / 7;
    let months = weeks / 4;
    let years = months / 12;

    return {
        "seconds_raw": seconds,
        "minutes_raw": minutes,
        "hours_raw": hours,
        "days_raw": days,
        "weeks_raw": weeks,
        "months_raw": months,
        "years_raw": years,
        "seconds": Math.floor(seconds % 60),
        "minutes": Math.floor(minutes % 60),
        "hours": Math.floor(hours % 24),
        "days": Math.floor(days % 7),
        "weeks": Math.floor(weeks % 4),
        "months": Math.floor(months % 12),
        "years": Math.floor(years)
    };
}

function jankDeltaFormat(data) {
    let builder = "";
    if (data["months"] > 0) {
        builder += `${data["months"]} month${(data["months"] != 1) ? "s" : ""}, `;
    } if (data["weeks"] > 0) {
        builder += `${data["weeks"]} week${(data["weeks"] != 1) ? "s" : ""}, `;
    } if (data["days"] > 0) {
        builder += `${data["days"]} day${(data["days"] != 1) ? "s" : ""}, `;
    } if (data["hours"] > 0) {
        builder += `${data["hours"]} hour${(data["hours"] != 1) ? "s" : ""}, `;
    } if (data["minutes"] > 0) {
        builder += `${data["minutes"]} minute${(data["minutes"] != 1) ? "s" : ""}, `;
    }
    builder += `${data["seconds"]} second${(data["seconds"] != 1) ? "s" : ""}`;

    return builder;
}

function getWindows10Status() {
    let delta = W10_EOL_DATE.getTime() - new Date().getTime();//Date.now();

    let data = jankDeltaData(delta);

    let builder = "";

    // no sprintf?
    if (data["seconds_raw"] > 0) {
        builder = "will reach EOL in ";
        builder += jankDeltaFormat(data);
    } else {
        builder = "has reached EOL :(";
    }

    return builder;
}

function getPrideStatus() {
    let builder = "";
    if (new Date().getMonth() == PRIDE_MONTH) {
        builder = "Pride month is currently ongoing, ending in NULL";
    } else {
        let isUnder = new Date().getMonth() < PRIDE_MONTH; // last is prev year
        let isOver = new Date().getMonth() > PRIDE_MONTH; // last is now

        // last
        let dec = (isUnder) ? new Date(new Date().getFullYear()-1, PRIDE_MONTH, 1) : new Date(new Date().getFullYear(), PRIDE_MONTH, 1);
        let deltaLast = Date.now() - dec.getTime();
        let last = jankDeltaFormat(jankDeltaData(deltaLast));
        builder = `It has been ${last} since Pride Month ended, and NULL until next one?`;
    }

    return builder;
}

win10EOLEl.innerText = `${getWindows10Status()}`;
prideStatEl.innerText = `${getPrideStatus()}`;