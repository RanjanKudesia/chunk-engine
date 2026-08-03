/**
 * Multi-language code samples, keyed by id. Each carries the py / js / rs
 * dialect of the same operation — verified against each package's README:
 *   - Python: snake_case kwargs, dict access chunk["content_type"]
 *   - JS: camelCase, options object, c.contentType, async
 *   - Rust: positional args get_chunks(path, mode, ws, overlap, spc, ppp)?, c.content_type
 */
import type { LangId } from "@/data/languages";

export interface Snippet {
  code: string;
  filename?: string;
}
export type MultiSnippet = Record<LangId, Snippet>;

export const samples: Record<string, MultiSnippet> = {
  hero: {
    py: {
      filename: "chunk.py",
      code: `from py_chunks import get_chunks

# One API. Every format. Rust underneath.
chunks = get_chunks("report.pdf", mode="semantic")

for chunk in chunks:
    print(chunk["content_type"], "->", chunk["content"][:48])

# heading          -> Q3 Financial Summary
# semantic         -> Revenue grew 18% quarter-over-quarter, driven...
# table            -> | Region | Revenue | YoY |`,
    },
    js: {
      filename: "chunk.ts",
      code: `import { getChunks } from "js-chunks";

// One API. Every format. Rust (WASM) underneath.
const chunks = await getChunks("./report.pdf", { mode: "semantic" });

for (const c of chunks) {
  console.log(c.contentType, "->", c.content.slice(0, 48));
}

// heading          -> Q3 Financial Summary
// semantic         -> Revenue grew 18% quarter-over-quarter, driven...
// table            -> | Region | Revenue | YoY |`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

// One API. Every format. Pure Rust.
let chunks = get_chunks("report.pdf", "semantic", 3, 1, 3, 15)?;

for c in &chunks {
    println!("{:16} -> {}", c.content_type, &c.content[..48]);
}

// heading          -> Q3 Financial Summary
// semantic         -> Revenue grew 18% quarter-over-quarter, driven...
// table            -> | Region | Revenue | YoY |`,
    },
  },

  streaming: {
    py: {
      filename: "stream.py",
      code: `from py_chunks import stream_chunks

# Constant memory — yields one chunk at a time
for chunk in stream_chunks("data.csv", mode="row"):
    handle(chunk)`,
    },
    js: {
      filename: "stream.ts",
      code: `import { streamChunks } from "js-chunks";

// Async iterable — one chunk at a time
for await (const chunk of streamChunks("./data.csv", { mode: "row" })) {
  handle(chunk);
}`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::formats::csv;

// stream() is a native Iterator yielding Result<Chunk>
for c in csv::stream("data.csv", "row", 10, 5, 1, true, None, "utf-8", true)? {
    let c = c?;
    handle(c);
}`,
    },
  },

  markdown: {
    py: { filename: "markdown.py", code: `from py_chunks import get_markdown

md = get_markdown("report.docx")           # -> str
md = get_markdown(file_bytes, filename="report.pdf")  # bytes also supported` },
    js: { filename: "markdown.ts", code: `import { getMarkdown } from "js-chunks";

const md = await getMarkdown("./report.docx");   // -> string` },
    rs: { filename: "main.rs", code: `use chunks_rs::get_markdown;

let md = get_markdown("report.docx")?;     // -> String` },
  },

  images: {
    py: { filename: "images.py", code: `from py_chunks import get_chunks, ChunksResult

result = get_chunks("deck.pptx", list_images=True)   # -> ChunksResult
result.chunks   # text chunks + image chunks (content_type="image")
result.images   # {"<hash>.jpeg": b"..."}` },
    js: { filename: "images.ts", code: `import { getChunks } from "js-chunks";

const { chunks, images } = await getChunks("./deck.pptx", { listImages: true });
// images: { name: string; data: Uint8Array }[]  — name matches the ![](name) ref` },
    rs: { filename: "main.rs", code: `use chunks_rs::formats::pptx;

// Returns (chunks, images); images are (name, bytes) pairs
let (chunks, images) = pptx::chunk_with_images("deck.pptx", "default", 3, 1, 3, 15)?;` },
  },

  inputBytes: {
    py: { filename: "bytes.py", code: `from py_chunks import get_chunks_from_bytes

with open("report.pdf", "rb") as f:
    data = f.read()

chunks = get_chunks_from_bytes(data, "report.pdf")   # filename drives dispatch` },
    js: { filename: "bytes.ts", code: `import fs from "node:fs";
import { getChunks } from "js-chunks";

const bytes = new Uint8Array(fs.readFileSync("report.pdf"));
const chunks = await getChunks(bytes, { filename: "report.pdf" });` },
    rs: { filename: "main.rs", code: `use chunks_rs::get_chunks_from_bytes;

let data = std::fs::read("report.pdf")?;
// (data, filename, mode, window_size, overlap, sentences_per_chunk, paragraphs_per_page)
let chunks = get_chunks_from_bytes(&data, "report.pdf", "default", 3, 1, 3, 15)?;` },
  },

  outputAccess: {
    py: { code: `for chunk in chunks:
    chunk["content"]        # str
    chunk["content_type"]   # str, e.g. "heading", "semantic"
    chunk["metadata"]       # dict` },
    js: { code: `for (const c of chunks) {
  c.content;      // string
  c.contentType;  // string (WASM content_type -> camelCase)
  c.metadata;     // Record<string, unknown>
}` },
    rs: { code: `for c in &chunks {
    &c.content;       // String
    &c.content_type;  // String
    &c.metadata;      // serde_json::Value
}` },
  },

  ragPipeline: {
    py: {
      filename: "ingest.py",
      code: `from py_chunks import get_chunks

def ingest(path):
    # Semantic chunks make the best embeddings.
    for chunk in get_chunks(path, mode="semantic"):
        vector = embed(chunk["content"])          # your embedding model
        store(vector, text=chunk["content"], meta=chunk["metadata"])`,
    },
    js: {
      filename: "ingest.ts",
      code: `import { getChunks } from "js-chunks";

async function ingest(path: string) {
  // Semantic chunks make the best embeddings.
  for (const chunk of await getChunks(path, { mode: "semantic" })) {
    const vector = await embed(chunk.content);    // your embedding model
    await store(vector, { text: chunk.content, meta: chunk.metadata });
  }
}`,
    },
    rs: {
      filename: "ingest.rs",
      code: `use chunks_rs::get_chunks;

fn ingest(path: &str) -> anyhow::Result<()> {
    // Semantic chunks make the best embeddings.
    for c in &get_chunks(path, "semantic", 3, 1, 3, 15)? {
        let vector = embed(&c.content);           // your embedding model
        store(vector, &c.content, &c.metadata);
    }
    Ok(())
}`,
    },
  },

  batchFolder: {
    py: {
      filename: "batch.py",
      code: `from pathlib import Path
from py_chunks import get_chunks

for path in Path("docs").rglob("*"):
    if not path.is_file():
        continue
    try:
        index(path.name, get_chunks(str(path)))
    except Exception as e:
        print("skip", path, e)   # one bad file shouldn't halt the batch`,
    },
    js: {
      filename: "batch.ts",
      code: `import { readdir } from "node:fs/promises";
import { getChunks } from "js-chunks";

for (const name of await readdir("docs")) {
  try {
    index(name, await getChunks(\`docs/\${name}\`));
  } catch (e) {
    console.warn("skip", name, e);   // one bad file shouldn't halt the batch
  }
}`,
    },
    rs: {
      filename: "batch.rs",
      code: `use std::fs;
use chunks_rs::get_chunks;

for entry in fs::read_dir("docs")? {
    let path = entry?.path();
    let p = path.to_string_lossy();
    match get_chunks(&p, "default", 3, 1, 3, 15) {
        Ok(chunks) => index(&path, &chunks),
        Err(e) => eprintln!("skip {p}: {e}"),  // keep going
    }
}`,
    },
  },

  quickstart: {
    py: {
      filename: "quickstart.py",
      code: `from py_chunks import get_chunks, stream_chunks, get_markdown

# Batch — works for every supported format
chunks = get_chunks("document.pdf")
chunks = get_chunks("notes.md",  mode="semantic")
chunks = get_chunks("deck.pptx", mode="sliding_window", window_size=3, overlap=1)

for chunk in chunks:
    print(chunk["content"], chunk["content_type"], chunk["metadata"])

# Streaming — constant memory over huge files
for chunk in stream_chunks("large.pdf", mode="section"):
    handle(chunk)

# Markdown conversion
md = get_markdown("report.docx")`,
    },
    js: {
      filename: "quickstart.ts",
      code: `import { getChunks, streamChunks, getMarkdown } from "js-chunks";

// Batch — works for every supported format
let chunks = await getChunks("./document.pdf");
chunks = await getChunks("./notes.md",  { mode: "semantic" });
chunks = await getChunks("./deck.pptx", { mode: "sliding_window", windowSize: 3, overlap: 1 });

for (const c of chunks) {
  console.log(c.content, c.contentType, c.metadata);
}

// Streaming — constant memory over huge files
for await (const chunk of streamChunks("./large.pdf", { mode: "section" })) {
  handle(chunk);
}

// Markdown conversion
const md = await getMarkdown("./report.docx");`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::{get_chunks, get_markdown};

// Batch — dispatch by extension. Positional args:
// get_chunks(path, mode, window_size, overlap, sentences_per_chunk, paragraphs_per_page)
let chunks = get_chunks("document.pdf", "default", 3, 1, 3, 15)?;
let chunks = get_chunks("notes.md",     "semantic", 3, 1, 3, 15)?;

for c in &chunks {
    println!("[{}] {}", c.content_type, c.content);
    // c.metadata is a serde_json::Value with format-specific provenance
}

// Streaming yields the same chunks, one at a time
use chunks_rs::formats::csv;
for c in csv::stream("data.csv", "row", 10, 5, 1, true, None, "utf-8", true)? {
    let c = c?;
}

// One-shot Markdown conversion
let md = get_markdown("report.docx")?;`,
    },
  },
};
