const cmdEl = document.querySelector("#command");
const pathEl = document.querySelector("#path");
const cmdRespEl = document.querySelector("#cmd_resp")

// consider a path if :
// .lastIndexOf("/") is greater than .lastIndexOf(".")
// consider a file if :
//  .lastIndexOf(".") is greater than .lastIndexOf("/")
// this can fail with /index.html/, but whatever
const isFile = window.location.pathname.lastIndexOf(".") > window.location.pathname.lastIndexOf("/")

if (isFile) {
    cmdEl.innerText = "cat";
    cmdRespEl.innerText = `cat: ${window.location.pathname}: No such file or directory`;
} else {
    cmdEl.innerText = "ls";
    cmdRespEl.innerText = `ls: cannot access '${window.location.pathname}': No such file or directory`;
}
pathEl.innerText = window.location.pathname;