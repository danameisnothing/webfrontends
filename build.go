//usr/bin/env go run "$0" "$@"; exit "$?"
// taken from https://posener.github.io/go-shebang-story/
// TODO: run gofmt!

package main

import (
    "fmt"
    "os"
    "strings"
    "slices"
)

var (
    ExcludedItems []string = []string{
        // hidden directories that are irrelevant anyway
        ".config", ".git", ".cache", ".local",
        // files
        ".replit", ".replit.backup", "build.go",
    }
)

func recurse(start string, depth int) {
    files, err := os.ReadDir(start)
    if err != nil {
        panic(err)
    }

    // check if we are at the very bottom. if yes, it's time to print
    /*atBottom := true
    for _, v := range files {
        if v.IsDir() {
            atBottom = false
            break
        }
    }*/

    for k, v := range files {
        // HACKHACK: ugly lol
        if slices.Contains(ExcludedItems, v.Name()) {
            continue
        }

        // yikes
        // indent BETA
        // ├ │ ─ └ these are the chars
        var sb strings.Builder
        for i := range depth+1 {
            if depth == 0 {
                sb.WriteString("├")
            } else if depth > 0 {
                //sb.WriteString("|")
                // because usually the files are at the bottom
                if k == len(files)-1 && !v.IsDir() {
                    if i == depth {
                        sb.WriteString("└")
                    } else {
                        sb.WriteString("|")
                    }
                } else {
                    sb.WriteString("THISBRANCH") //BROKEN
                }
            }

            if i == depth {
                sb.WriteString("── ")
            } else {
                sb.WriteString("   ")
            }
        }

        fPath := fmt.Sprintf("%s/%s", start, v.Name())
        fmt.Printf("%s%s\n", sb.String(), v.Name())
        if v.IsDir() {
            recurse(fPath, depth+1)
        }
    }

    //fmt.Printf("%v\n", files)
}

func main() {
    curDir, err := os.Getwd()
    if err != nil {
        panic(err)
    }

    recurse(curDir, 0)

    //fmt.Printf("%v\n", os.Args[1:])
} 