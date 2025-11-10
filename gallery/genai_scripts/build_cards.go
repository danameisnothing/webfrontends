package main

import (
	"encoding/json"
	"html/template"
	"log"
	"os"
	"strings"
)

// Define structs to match the JSON structure
type CardEntry struct {
	ImgURL         string `json:"img_url"`
	ImgWidth       string `json:"img_width"`
	CardTitle      string `json:"card_title"`
	CardDescription string `json:"card_description"`
}

type Category struct {
	Kind    string      `json:"kind"`
	Entries []CardEntry `json:"entries"`
}

type Config struct {
	Categories []Category `json:"categories"`
}

// Function to replace newlines with <br> tags
func nl2br(text string) template.HTML {
	return template.HTML(strings.ReplaceAll(template.HTMLEscapeString(text), "\n", "<br>"))
}

// Function to trim whitespace
func trimSpace(text string) string {
	return strings.TrimSpace(text)
}

func main() {
	// Read JSON config file
	file, err := os.ReadFile("config.json")
	if err != nil {
		log.Fatalf("Error reading config file: %v", err)
	}

	// Parse JSON
	var config Config
	err = json.Unmarshal(file, &config)
	if err != nil {
		log.Fatalf("Error parsing JSON: %v", err)
	}

	// Define HTML templates
	cardSectionTemplate := `
	<div id="card_section">
	{{range .Categories}}
	<div class="card_entry" id="cardentry_{{.Kind}}">
	{{range .Entries}}
	<div class="card_set">
	<div class="card_full">
	<div class="card_zoomer">
	<div class="card_entry_backside"></div>
	<div class="card_entry_frontside">
	<img width="{{trimSpace .ImgWidth}}" class="card_img" src="{{trimSpace .ImgURL}}">
	</div>
	</div>
	</div>
	<div class="card_property">
	<div class="card_prop_container">
	<h3 class="card_prop_title">{{.CardTitle}}</h3>
	<div class="card_prop_desc_container">
	<i class="card_prop_description">{{nl2br .CardDescription}}</i>
	</div>
	</div>
	</div>
	</div>
	{{end}}
	</div>
	{{end}}
	</div>
	`

	// Create and parse template with custom functions
	funcMap := template.FuncMap{
		"nl2br":     nl2br,
		"trimSpace": trimSpace,
	}

	tmpl := template.Must(template.New("cardSection").Funcs(funcMap).Parse(cardSectionTemplate))

	// Execute template with config data
	err = tmpl.Execute(os.Stdout, config)
	if err != nil {
		log.Fatalf("Error executing template: %v", err)
	}
}
