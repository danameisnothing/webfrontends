//usr/bin/env go run "$0" "$@"; exit "$?"
// taken from https://posener.github.io/go-shebang-story/
// TODO: run gofmt!
// bruh, tree already has -H for HTML output...

package main

import (
	"fmt"
	"io"
	"os"
	"regexp"
	"strings"
	//"golang.org/x/net/html"
)

const (
	CommandShouldBe string = `tree -I "dirs.txt" -H "" | ./build.go`
)

func addSpanDir(inp string) string {
	matchHrefRgx := regexp.MustCompile(`<a href=".+/">`)
	matchHrefCloseRgx := regexp.MustCompile(`.+?<`) // this is operated on the slice after matchHrefRgx!

	var bodyAttr strings.Builder
	hrefWhere := matchHrefRgx.FindAllIndex([]byte(inp), -1)

	bodyAttr.WriteString(inp[:hrefWhere[0][0]])
	for k, v := range hrefWhere {
		var content string
		if k == len(hrefWhere)-1 {
			content = inp[v[1]:len(inp)]
		} else {
			content = inp[v[1]:hrefWhere[k+1][0]]
		}

		closeWhere := matchHrefCloseRgx.FindIndex([]byte(content))

		bodyAttr.WriteString(fmt.Sprintf("%s%s%s%s%s", inp[v[0]:v[1]], `<span class="shell_path">`, content[:closeWhere[1]-1], "</span>", content[closeWhere[1]-1:]))
	}

	return bodyAttr.String()
}

func removeHrefs(inp string) string {
	matchHrefs := regexp.MustCompile(`.href=".+?"`)

	locs := matchHrefs.FindAllIndex([]byte(inp), -1)

	var builder strings.Builder
	builder.WriteString(inp[:locs[0][0]])

	for k, v := range locs {
		var content string
		if k == len(locs)-1 {
			content = inp[v[1]:len(inp)]
		} else {
			content = inp[v[1]:locs[k+1][0]]
		}

		builder.WriteString(fmt.Sprintf("%s", content))
	}

	return builder.String()
}

func restoreHrefs(inp string) string {
	matchHrefs := regexp.MustCompile(`\t[├└]──.<a`)
	matchName := regexp.MustCompile(`<span class="shell_path">.+?</span>`)

	locs := matchHrefs.FindAllIndex([]byte(inp), -1)

	var builder strings.Builder
	builder.WriteString(inp[:locs[0][0]])

	for k, v := range locs {
		var content string
		if k == len(locs)-1 {
			content = inp[v[1]:len(inp)]
		} else {
			content = inp[v[1]:locs[k+1][0]]
		}

		idx := matchName.FindIndex([]byte(content))

		// must be a file on top-level
		if len(idx) == 0 {
			builder.WriteString(fmt.Sprintf("%s%s", inp[v[0]:v[1]], content))
			continue
		}
		builder.WriteString(fmt.Sprintf("%s%s%s", inp[v[0]:v[1]], fmt.Sprintf(` href="./%s/"`, content[idx[0]+len(`<span class="shell_path">`):idx[1]-len(`</span>`)]), content))
	}

	return builder.String()
}

func removeA(inp string) string {
	matchHrefs := regexp.MustCompile(`<a>.+</a>`)

	locs := matchHrefs.FindAllIndex([]byte(inp), -1)

	var builder strings.Builder
	builder.WriteString(inp[:locs[0][0]])

	for k, v := range locs {
		var content string
		if k == len(locs)-1 {
			content = inp[v[1]:len(inp)]
		} else {
			content = inp[v[1]:locs[k+1][0]]
		}

		str := inp[v[0]:v[1]]
		builder.WriteString(fmt.Sprintf("%s%s", str[len(`<a>`):len(str)-len(`</a>`)], content))
	}

	return builder.String()
}

/*func replaceLimit(inp string, target, repl string) {
    var ret strings.Builder
    var seq strings.Builder
    var lastFoundIdx int
    for k, v := range inp {
        if seq.Len() == 0 {
            seq.WriteRune(v)
        // TODO: find built-in methods from strings.Builder to check for first char
        } else if seq.String()[0] == v {
            seq.WriteRune(v)
        } else {
            seq.Reset()
            seq.WriteRune(v)
        }

        if seq.String() == target {
            ret.WriteString(inp[k-len(target):k])

        }
    }

    if ret.Len() == 0 {
        ret.WriteString(inp)
    }
}*/

func main() {
	// https://www.reddit.com/r/golang/comments/1edh11r/dealing_with_piped_input/
	stat, err := os.Stdin.Stat()
	if err != nil {
		panic(err)
	}

	// detect nothing being piped
	if (stat.Mode() & os.ModeCharDevice) != 0 {
		panic(fmt.Errorf("no input piped brih"))
	}

	buf, err := io.ReadAll(os.Stdin)
	if err != nil {
		panic(err)
	}

	//fmt.Printf("received : %s\n", string(buf))

	// regex to select main
	// https://golangforall.com/en/post/golang-regexp-matching-newline.html
	// <p>.+<a href="/\./">\..+<br><br><p> with DotNL
	// OBSOLETE : <a href=".+/" to get the place to put our custom dir class
	// .href=".+" to remove all hrefs WITHOUT DotNL!
	// \t[├└]── <a to get the place to add new inserts in

	matchBodyRgx := regexp.MustCompile(`(?s)<p>.+<a href="/\./">.+<br><br><p>`)

	body := matchBodyRgx.FindString(string(buf))
	if body == "" {
		panic(fmt.Errorf("failed to find body, make sure the command is correct : %s", CommandShouldBe))
	}

	dir := addSpanDir(body)
	rmHref := removeHrefs(dir)
	restHref := restoreHrefs(rmHref)
	stripA := removeA(restHref)

	spl := strings.Split(stripA, "\n")
	var finalBuf strings.Builder
	for k, v := range spl {
		// quick hack
		if k == 0 {
			finalBuf.WriteString(`<pre class="pre_dowrap"><samp class="font_jbmono">`)
			continue
		} else if k == len(spl)-1 {
			finalBuf.WriteString("</samp></pre>\n")
			continue
		}
		var suffix string
		if k != len(spl)-2 {
			suffix = "\n"
		}

		trimmed := fmt.Sprintf("%s", strings.TrimSpace(v))
		finalBuf.WriteString(fmt.Sprintf("%s%s", trimmed[:len(trimmed)-len(`<br>`)], suffix))
	}

	// tree outputs a "Non-breaking space" for some of the spaces. bruh
	out := strings.ReplaceAll(finalBuf.String(), "\u0020", "&nbsp;")
	out = strings.ReplaceAll(out, "\u00a0", "&nbsp;")

	// FIXME: some number of spaces need extra indentation (e.g 7 spaces needs 10 spaces), find a more elegant solution!
	out = strings.ReplaceAll(out, "&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;")
	/*out = strings.ReplaceAll(out, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")*/
	/*
	   │    │    └── img
	   │    │          ├── avif
	*/
	// for that scenario
	//out = strings.ReplaceAll(out, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;", "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;")
	out = strings.ReplaceAll(out, "&nbsp;", "\u0020")
	os.WriteFile("dirs.txt", []byte(out), 0666)
}
