// build.js
// Merges /content/*.json into /templates/*.template.html and writes
// the finished, plain static HTML files to the project root.
// Runs at Vercel BUILD TIME only — the deployed output is still
// ordinary static HTML, nothing is rendered client-side.

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CONTENT_DIR = path.join(__dirname, "content");
const TEMPLATES_DIR = path.join(__dirname, "templates");
const OUTPUT_DIR = __dirname;
const STATIC_PASSTHROUGH_FILES = ["privacy.html", "404.html"];

// Fingerprints styles.css/site.js so every generated page requests the
// current version, even when a browser (or this project's preview server)
// would otherwise keep serving a stale cached copy after an edit.
function fileHash(filePath) {
  return crypto.createHash("md5").update(fs.readFileSync(filePath)).digest("hex").slice(0, 8);
}

function applyAssetVersions(html, cssHash, jsHash) {
  return html
    .replace(/assets\/css\/styles\.css(?:\?v=[0-9a-f]+)?/g, `assets/css/styles.css?v=${cssHash}`)
    .replace(/assets\/js\/site\.js(?:\?v=[0-9a-f]+)?/g, `assets/js/site.js?v=${jsHash}`);
}

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
  const cssHash = fileHash(path.join(__dirname, "assets/css/styles.css"));
  const jsHash = fileHash(path.join(__dirname, "assets/js/site.js"));

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

    html = applyAssetVersions(html, cssHash, jsHash);

    const outputPath = path.join(OUTPUT_DIR, `${pageName}.html`);
    fs.writeFileSync(outputPath, html, "utf8");
    console.log(`Built ${pageName}.html`);
  }

  for (const staticFile of STATIC_PASSTHROUGH_FILES) {
    const filePath = path.join(OUTPUT_DIR, staticFile);
    if (!fs.existsSync(filePath)) continue;
    const html = applyAssetVersions(fs.readFileSync(filePath, "utf8"), cssHash, jsHash);
    fs.writeFileSync(filePath, html, "utf8");
    console.log(`Versioned assets in ${staticFile}`);
  }
}

build();
