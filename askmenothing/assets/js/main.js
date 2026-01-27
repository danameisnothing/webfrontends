const GRADES = [
    "matematika",
    "fisika",
    "kimia",
    "informatika",
    "mandarin",
    "bahasa indonesia"
];

let data = [];

function main() {
    for (let i = 0; i < GRADES.length; i++) {
        const SUBJECT = GRADES.at(i);
        // parseInt is not sane, we cast to Number
        let res = Number(window.prompt(`What is ${SUBJECT}`));
        if (Number.isNaN(res)) {
            document.write("and you failed, go refresh.");
            return;
        } else if (res > 100 || res < 0) {
            document.write("what the hell man?");
            return;
        }

        data[i] = {
            subject: SUBJECT,
            grade: res,
        };
    }

    let sum = data.reduce((acc, cur) => acc + cur.grade, 0);
    let mark = sum / data.length;
    let grade = "";

    if (mark <= 100 && mark >= 91) grade = "A";
    else if (mark <= 90 && mark >= 81) grade = "B";
    else if (mark <= 80 && mark >= 71) grade = "C";
    else if (mark <= 70 && mark >= 61) grade = "D";
    else if (mark <= 60 && mark >= 0) grade = "Failed";

    document.write(`Average : ${mark}\nMark : ${grade}`);
}

main();