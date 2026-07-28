// build.js
// Merges /content/*.json into /templates/*.template.html and writes
// the finished, plain static HTML files to the project root.
// Runs at Vercel BUILD TIME only — the deployed output is still
// ordinary static HTML, nothing is rendered client-side.

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "content");
const TEMPLATES_DIR = path.join(__dirname, "templates");
const OUTPUT_DIR = __dirname;

// Converts HTML-entity text into plain text safe to embed inside a
// JSON-LD <script> block (which does NOT get HTML entities decoded
// by the browser, since script contents are raw text, not parsed HTML).
function toSchemaSafeText(value) {
  return String(value)
    .replace(/&rsquo;|&#8217;/g, "'")
    .replace(/&lsquo;|&#8216;/g, "'")
    .replace(/&rdquo;|&#8221;/g, '"')
    .replace(/&ldquo;|&#8220;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")   // strip any stray HTML tags (e.g. <span>)
    .replace(/"/g, '\\"');    // escape quotes for valid JSON-LD string
}

// Expands {{#each fieldName}}...{{this.prop}}...{{/each}} blocks against an
// array field in the content JSON, so repeatable lists (e.g. OEM programs)
// can be driven from structured data instead of hand-flattened tokens.
function renderEachBlocks(html, content) {
  const eachRegex = /{{#each\s+(\w+)}}([\s\S]*?){{\/each}}/g;
  return html.replace(eachRegex, (match, fieldName, block) => {
    const items = content[fieldName];
    if (!Array.isArray(items)) return "";
    return items
      .map(item => {
        let itemHtml = block;
        for (const [key, value] of Object.entries(item)) {
          const token = new RegExp(`{{\\s*this\\.${key}\\s*}}`, "g");
          itemHtml = itemHtml.replace(token, value);
        }
        return itemHtml;
      })
      .join("");
  });
}

function build() {
  const templates = fs.readdirSync(TEMPLATES_DIR).filter(f => f.endsWith(".template.html"));

  for (const templateFile of templates) {
    const pageName = templateFile.replace(".template.html", "");
    const jsonPath = path.join(CONTENT_DIR, `${pageName}.json`);

    if (!fs.existsSync(jsonPath)) {
      console.warn(`No content file for ${pageName}, skipping.`);
      continue;
    }

    const content = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
    let html = fs.readFileSync(path.join(TEMPLATES_DIR, templateFile), "utf8");

    html = renderEachBlocks(html, content);

    // Auto-generate a "_plain" schema-safe variant of every string field,
    // so templates can reference {{fieldname_plain}} inside JSON-LD
    // blocks without the client having to maintain two copies.
    const withPlainVariants = { ...content };
    for (const [key, value] of Object.entries(content)) {
      if (typeof value !== "string") continue;
      withPlainVariants[`${key}_plain`] = toSchemaSafeText(value);
    }

    for (const [key, value] of Object.entries(withPlainVariants)) {
      const token = new RegExp(`{{\\s*${key}\\s*}}`, "g");
      html = html.replace(token, value);
    }

    const remaining = html.match(/{{\s*[\w]+\s*}}/g);
    if (remaining) {
      console.warn(`Warning: ${pageName}.html has unfilled tokens: ${remaining.join(", ")}`);
    }

    const outputPath = path.join(OUTPUT_DIR, `${pageName}.html`);
    fs.writeFileSync(outputPath, html, "utf8");
    console.log(`Built ${pageName}.html`);
  }
}

build();
