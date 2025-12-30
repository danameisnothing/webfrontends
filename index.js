// The Temporal API is still widely unsupported
const W10_EOL_DATE = new Date(2025, 9, 15);
const PRIDE_MONTH = 6 - 1;

const win10EOLEl = document.querySelector("#windows_10_eol_time");
const prideStatEl = document.querySelector("#pride_stat");

function jankDeltaData(delta) {
    // yikes
    const seconds = delta / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const weeks = days / 7;
    const months = weeks / 4;
    const years = months / 12;

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

// Intl.DurationFormat.format() is only recently baseline (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DurationFormat/format)
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
    const delta = W10_EOL_DATE.getTime() - new Date().getTime();
    const data = jankDeltaData(delta);
    return (data["seconds_raw"] > 0) ? `will reach EoL in ${jankDeltaFormat(data)}` : "has reached EoL :(. Long live Windows 11!";
}

function getPrideDelta(isForNextEvent) {
    const clone = new Date(new Date().getFullYear(), PRIDE_MONTH, 1);
    const currMonth = new Date().getMonth();
    if (!isForNextEvent) {
        // last pride month is previous year
        if (currMonth < PRIDE_MONTH) {
            clone.setFullYear(clone.getFullYear() - 1);
        }
        return Date.now() - clone.getTime();
    }

    // next pride month is next year
    if (currMonth > PRIDE_MONTH) {
        clone.setFullYear(clone.getFullYear() + 1);
    }
    return clone.getTime() - Date.now();
}

function getPrideStatus() {
    const currMonth = new Date().getMonth();
    if (currMonth == PRIDE_MONTH) {
        return `Pride month is currently ongoing, ending in ${jankDeltaFormat(jankDeltaData(new Date(new Date().getFullYear(), PRIDE_MONTH + 1).getTime() - Date.now()))}`;
    }

    return `It has been ${jankDeltaFormat(jankDeltaData(getPrideDelta(false)))} since Pride Month ended, and ${jankDeltaFormat(jankDeltaData(getPrideDelta(true)))} until next one`;
}

win10EOLEl.innerText = `${getWindows10Status()}`;
prideStatEl.innerText = `${getPrideStatus()}`;