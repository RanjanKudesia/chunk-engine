/**
 * Multi-language code samples, keyed by id. Each carries the py / js / rs
 * dialect of the same operation.
 *
 * ## Dialect rules (verified against the SDK sources, 2026-08-08)
 *
 * - **Python** (`../py_chunks/py_chunks/_sources.py`): keyword-only options
 *   after the source; chunks are dicts — `chunk["content_type"]`.
 * - **JS** (`../js-chunks/src/index.ts`): camelCase options object, `async`,
 *   `c.contentType`.
 * - **Rust** (`../rs-chunks/src/dispatch.rs`): positional
 *   `get_chunks(path, mode, window_size, overlap, sentences_per_chunk,
 *   paragraphs_per_page) -> Result<Vec<Chunk>>`; `c.content_type`.
 *   Every Rust snippet that uses `?` is a **complete compiling program** —
 *   they are checked against the real crate, not written from memory.
 *
 * ## The running example: `notes.md`
 *
 * Every sample that shows real output was run at **default parameters**
 * (`mode` as stated, `window_size=3`, `overlap=1`, `sentences_per_chunk=3`,
 * `paragraphs_per_page=15`) against this exact file, with py-chunks 0.6.1 and
 * js-chunks 0.6.1 producing identical results. Pages that show the input can
 * reproduce it verbatim:
 *
 * ```markdown
 * # Chunking Notes
 *
 * Chunk-engine splits a document into retrieval-sized units. Each unit keeps the
 * structure it came from, so an embedding sees a whole idea instead of a
 * truncated one.
 *
 * ## Why structure matters
 *
 * A naive character splitter cuts mid-sentence and mid-table. The retrieved
 * passage then answers half a question, and the model fills in the rest. Keeping
 * a table whole costs nothing at index time and saves a wrong answer at query
 * time.
 *
 * | Splitter      | Table integrity |
 * | ------------- | --------------- |
 * | character     | broken          |
 * | chunk-engine  | preserved       |
 *
 * ## Modes
 *
 * Structural mode follows the document outline. Semantic mode merges adjacent
 * blocks that talk about the same thing. Sentence mode groups a fixed number of
 * sentences. Pick the one that matches how you will query the index.
 * ```
 */
import type { LangId } from "@/data/languages";

export interface Snippet {
  code: string;
  filename?: string;
}

/**
 * Partial on purpose: some operations exist in only one or two SDKs (`Blob`
 * input is JS-only, `UploadFile` is Python-only). `LangCode` renders the tabs a
 * sample actually defines; `lib/docs-markdown.ts` emits the fences it has.
 */
export type MultiSnippet = Partial<Record<LangId, Snippet>>;

export const samples: Record<string, MultiSnippet> = {
  // ── Landing / overview ───────────────────────────────────────────────────
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
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chunks = get_chunks("report.pdf", "semantic", 3, 1, 3, 15)?;

    for c in &chunks {
        println!("{:16} -> {}", c.content_type, c.content.chars().take(48).collect::<String>());
    }
    Ok(())
}

// heading          -> Q3 Financial Summary
// semantic         -> Revenue grew 18% quarter-over-quarter, driven...
// table            -> | Region | Revenue | YoY |`,
    },
  },

  /**
   * The shortest thing that proves it works. Output captured live from
   * `notes.md` (see the file header) at default parameters.
   */
  firstChunks: {
    py: {
      filename: "first_chunks.py",
      code: `from py_chunks import get_chunks

chunks = get_chunks("notes.md")
for c in chunks[:3]:
    print(c["content_type"], "|", c["content"][:40])

# heading | Chunking Notes
# plain_paragraph | Chunk-engine splits a document into retr
# heading | Why structure matters`,
    },
    js: {
      filename: "first-chunks.ts",
      code: `import { getChunks } from "js-chunks";

const chunks = await getChunks("./notes.md");
for (const c of chunks.slice(0, 3)) {
  console.log(c.contentType, "|", c.content.slice(0, 40));
}

// heading | Chunking Notes
// plain_paragraph | Chunk-engine splits a document into retr
// heading | Why structure matters`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chunks = get_chunks("notes.md", "default", 3, 1, 3, 15)?;
    for c in chunks.iter().take(3) {
        println!("{} | {}", c.content_type, c.content.chars().take(40).collect::<String>());
    }
    Ok(())
}

// heading | Chunking Notes
// plain_paragraph | Chunk-engine splits a document into retr
// heading | Why structure matters`,
    },
  },

  /** Post-install smoke test: import resolves, engine loads, chunks come back. */
  verify: {
    py: {
      filename: "verify.py",
      code: `import py_chunks
from py_chunks import get_chunks

print(py_chunks.__version__)                 # 0.6.2
print(len(get_chunks("notes.md")))           # 7
print(get_chunks("notes.md")[0]["content_type"])   # heading`,
    },
    js: {
      filename: "verify.ts",
      code: `import { getChunks } from "js-chunks";

// The wasm engine loads on first call — this proves it resolved.
const chunks = await getChunks("./notes.md");
console.log(chunks.length, chunks[0].contentType);   // 7 heading`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chunks = get_chunks("notes.md", "default", 3, 1, 3, 15)?;
    println!("{} {}", chunks.len(), chunks[0].content_type);   // 7 heading
    Ok(())
}`,
    },
  },

  // ── Input sources ────────────────────────────────────────────────────────
  srcPath: {
    py: {
      filename: "from_path.py",
      code: `from py_chunks import get_chunks, get_chunks_from_path

# get_chunks() sniffs the source type; get_chunks_from_path() is the explicit one.
chunks = get_chunks("notes.md")
chunks = get_chunks_from_path("notes.md", mode="section")

# A missing path raises FileNotFoundError before any parsing happens.`,
    },
    js: {
      filename: "from-path.ts",
      code: `import { getChunks } from "js-chunks";

// String sources are read with node:fs — Node only. In a browser or Deno,
// pass bytes plus opts.filename instead (see the Blob / File samples).
const chunks = await getChunks("./notes.md", { mode: "section" });`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Positional: (path, mode, window_size, overlap, sentences_per_chunk,
    //              paragraphs_per_page). These are the defaults.
    let chunks = get_chunks("notes.md", "section", 3, 1, 3, 15)?;
    println!("{}", chunks.len());
    Ok(())
}`,
    },
  },

  srcBlob: {
    js: {
      filename: "from-blob.ts",
      code: `import { getChunks } from "js-chunks";

// A plain Blob has no name, and the engine routes on the extension —
// so pass opts.filename. Works in the browser, Deno, Bun and Node.
const blob = await (await fetch("/notes.md")).blob();
const chunks = await getChunks(blob, { filename: "notes.md" });

// Without a filename this throws ChunkError { kind: "invalid-arg" }:
// "A filename is required for byte sources (pass opts.filename or a named Blob)
//  so the engine can route by extension."`,
    },
  },

  srcFileobj: {
    py: {
      filename: "from_fileobj.py",
      code: `import io
from py_chunks import get_chunks_from_fileobj

# An open file carries its own .name — no filename argument needed.
with open("notes.md", "rb") as f:
    chunks = get_chunks_from_fileobj(f)

# A BytesIO does not, so name it. (.read() may return str or bytes; both work.)
buf = io.BytesIO(b"# Chunking Notes\\n\\nHello.")
chunks = get_chunks_from_fileobj(buf, filename="notes.md")`,
    },
    js: {
      filename: "from-file.ts",
      code: `import { getChunks } from "js-chunks";

// A File (from <input type="file">) is a Blob that carries .name, so the
// engine can route without opts.filename.
const file = (document.querySelector("input[type=file]") as HTMLInputElement)
  .files![0];
const chunks = await getChunks(file);

// opts.filename still wins if you want to override the routing extension.`,
    },
  },

  srcUpload: {
    py: {
      filename: "upload.py",
      code: `from fastapi import FastAPI, UploadFile
from py_chunks import get_chunks_from_upload

app = FastAPI()

@app.post("/chunk")
def chunk(file: UploadFile):
    # Reads upload_file.file (the SpooledTemporaryFile) when present, because
    # UploadFile.read() is a coroutine — passing the object itself is safe in a
    # sync handler. filename comes from upload_file.filename.
    return get_chunks_from_upload(file, mode="section")`,
    },
  },

  srcUrl: {
    py: {
      filename: "from_url.py",
      code: `from py_chunks import get_chunks, get_chunks_from_s3_presigned_url

# Downloads with urlopen, then chunks the bytes in memory (nothing hits disk).
chunks = get_chunks_from_s3_presigned_url(url, timeout=60)

# The filename defaults to the last URL path segment; override it when the
# URL has no useful name (pre-signed links often don't).
chunks = get_chunks_from_s3_presigned_url(url, filename="report.pdf")

# get_chunks() routes http/https sources here for you.
chunks = get_chunks(url, filename="report.pdf")`,
    },
    js: {
      filename: "from-url.ts",
      code: `import { getChunks } from "js-chunks";

// js-chunks has no URL helper — fetch it yourself, then pass the bytes
// plus a filename so the engine can route by extension.
const res = await fetch(url);
const chunks = await getChunks(await res.arrayBuffer(), {
  filename: "report.pdf",
});`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks_from_bytes;

// rs-chunks has no URL helper either: download with your HTTP client of
// choice (reqwest, ureq, …) and chunk the response body. \`filename\` is used
// only for extension routing — nothing is written under that name.
fn chunk_download(body: &[u8], filename: &str) -> Result<(), Box<dyn std::error::Error>> {
    let chunks = get_chunks_from_bytes(body, filename, "default", 3, 1, 3, 15)?;
    println!("{} chunks", chunks.len());
    Ok(())
}`,
    },
  },

  srcStreamBytes: {
    py: {
      filename: "stream_bytes.py",
      code: `from py_chunks import stream_chunks_from_bytes

# The engine's streaming surface is path-based, so this one source *does* touch
# disk: the bytes go to a NamedTemporaryFile that is deleted when the iterator
# is exhausted, closed, or the with-block exits. (Batch bytes never touch disk.)
with stream_chunks_from_bytes(data, "report.pdf", mode="section") as chunks:
    for chunk in chunks:
        handle(chunk)`,
    },
    js: {
      filename: "stream-bytes.ts",
      code: `import { streamChunks } from "js-chunks";

// Bytes stream the same way paths do — but see the note in \`streamingAdvanced\`:
// in JS this is async-iteration ergonomics, not bounded memory.
for await (const chunk of streamChunks(bytes, { filename: "report.pdf" })) {
  handle(chunk);
}`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::formats::pdf;

// Only pdf and xlsx expose a bytes-streaming entry point; every other format
// streams from a path (\`formats::<fmt>::stream\`). There is no bytes streaming
// on the source-agnostic dispatch layer at all.
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = std::fs::read("report.pdf")?;
    for chunk in pdf::stream_from_bytes(data, "section", 3, 1, 3, 15) {
        let chunk = chunk?;
        println!("{}", chunk.content_type);
    }
    Ok(())
}`,
    },
  },

  srcMarkdownIn: {
    js: {
      filename: "markdown-in.ts",
      code: `import {
  chunkPdfMarkdown,
  chunkPdfMarkdownWithImages,
  normalizePdfMarkdown,
} from "js-chunks";

// You already have Markdown from some other PDF parser and want the engine's
// chunking over it. (.pdf input is parsed by the engine itself — this is for
// callers who parsed it elsewhere. It is what the playground drives.)
// totalPages populates document_metadata.total_pages.
const chunks = await chunkPdfMarkdown(markdown, 15, { mode: "section" });

// With host-supplied images: name must match the ![](name) reference.
// Resolves to { chunks, images }, image chunks first.
const withImages = await chunkPdfMarkdownWithImages(markdown, images, 15);

// Just the engine's normalisation step, when you need the string itself.
const normalised = await normalizePdfMarkdown(markdown);`,
    },
  },

  inputBytes: {
    py: {
      filename: "bytes.py",
      code: `from py_chunks import get_chunks_from_bytes

with open("report.pdf", "rb") as f:
    data = f.read()

# Straight to the engine's no-filesystem API — nothing is written to disk.
# filename is used only for extension detection.
chunks = get_chunks_from_bytes(data, "report.pdf")`,
    },
    js: {
      filename: "bytes.ts",
      code: `import fs from "node:fs";
import { getChunks } from "js-chunks";

const bytes = new Uint8Array(fs.readFileSync("report.pdf"));
const chunks = await getChunks(bytes, { filename: "report.pdf" });`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks_from_bytes;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let data = std::fs::read("report.pdf")?;
    // (data, filename, mode, window_size, overlap, sentences_per_chunk,
    //  paragraphs_per_page)
    let chunks = get_chunks_from_bytes(&data, "report.pdf", "default", 3, 1, 3, 15)?;
    println!("{}", chunks.len());
    Ok(())
}`,
    },
  },

  // ── Output shape ─────────────────────────────────────────────────────────
  outputAccess: {
    py: {
      code: `for chunk in chunks:
    chunk["content"]        # str
    chunk["content_type"]   # str, e.g. "heading", "semantic"
    chunk["metadata"]       # dict`,
    },
    js: {
      code: `for (const c of chunks) {
  c.content;      // string
  c.contentType;  // string (WASM content_type -> camelCase)
  c.metadata;     // Record<string, unknown>
}`,
    },
    rs: {
      code: `for c in &chunks {
    &c.content;       // String
    &c.content_type;  // String
    &c.metadata;      // serde_json::Value
}`,
    },
  },

  /**
   * One real chunk, complete — no elisions. `notes.md`, `mode="semantic"`,
   * index 3, default parameters. py-chunks and js-chunks return the same values;
   * only the key casing and container types differ.
   */
  chunkShape: {
    py: {
      filename: "chunk_shape.py",
      code: `chunk = get_chunks("notes.md", mode="semantic")[3]

# Every chunk is a dict with exactly three keys:
{
    "content": "A naive character splitter cuts mid-sentence and mid-table. The retrieved\\npassage then answers half a question, and the model fills in the rest. Keeping\\na table whole costs nothing at index time and saves a wrong answer at query\\ntime.",
    "content_type": "semantic",
    "metadata": {
        "avg_block_length": 234,
        "block_types": ["paragraph"],
        "chunk_index": 3,
        "document_metadata": {"source_type": "md", "total_input_blocks": 7},
        "has_list": False,
        "heading_path": ["Chunking Notes", "Why structure matters"],
        "keyword_density": 0.6,
        "merge_reasons": [],
        "paragraph_count": 1,
        "primary_merge_reason": "initial",
        "section_heading": "Why structure matters",
        "section_level": 2,
    },
}`,
    },
    js: {
      filename: "chunk-shape.ts",
      code: `const chunk = (await getChunks("./notes.md", { mode: "semantic" }))[3];

// Same values as py-chunks; content_type is surfaced as contentType, and
// metadata keys stay exactly as the engine emits them (snake_case).
{
  content: "A naive character splitter cuts mid-sentence and mid-table. The retrieved\\npassage then answers half a question, and the model fills in the rest. Keeping\\na table whole costs nothing at index time and saves a wrong answer at query\\ntime.",
  contentType: "semantic",
  metadata: {
    avg_block_length: 234,
    block_types: ["paragraph"],
    chunk_index: 3,
    document_metadata: { source_type: "md", total_input_blocks: 7 },
    has_list: false,
    heading_path: ["Chunking Notes", "Why structure matters"],
    keyword_density: 0.6,
    merge_reasons: [],
    paragraph_count: 1,
    primary_merge_reason: "initial",
    section_heading: "Why structure matters",
    section_level: 2,
  },
}`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let chunks = get_chunks("notes.md", "semantic", 3, 1, 3, 15)?;
    // Chunk is { content: String, content_type: String, metadata: serde_json::Value }
    // and derives Serialize, so this prints the shape the other two SDKs return.
    println!("{}", serde_json::to_string_pretty(&chunks[3])?);
    Ok(())
}

// {
//   "content": "A naive character splitter cuts mid-sentence and mid-table. The retrieved\\npassage then answers half a question, and the model fills in the rest. Keeping\\na table whole costs nothing at index time and saves a wrong answer at query\\ntime.",
//   "content_type": "semantic",
//   "metadata": {
//     "avg_block_length": 234,
//     "block_types": [
//       "paragraph"
//     ],
//     "chunk_index": 3,
//     "document_metadata": {
//       "source_type": "md",
//       "total_input_blocks": 7
//     },
//     "has_list": false,
//     "heading_path": [
//       "Chunking Notes",
//       "Why structure matters"
//     ],
//     "keyword_density": 0.6,
//     "merge_reasons": [],
//     "paragraph_count": 1,
//     "primary_merge_reason": "initial",
//     "section_heading": "Why structure matters",
//     "section_level": 2
//   }
// }`,
    },
  },

  /**
   * What `list_images` changes about the return type. The image-chunk literal
   * is captured verbatim from a DOCX with two embedded images.
   */
  chunksResult: {
    py: {
      filename: "chunks_result.py",
      code: `from py_chunks import get_chunks, ChunksResult

# Without list_images the return is a plain list[dict].
chunks = get_chunks("report.docx")

# With it, a ChunksResult dataclass — two fields, never a bare list.
result = get_chunks("report.docx", list_images=True)
result.chunks    # list[dict] — text chunks AND image chunks, in document order
result.images    # dict[str, bytes] — {"75a3c27ad7854d78.png": b"\\x89PNG\\r\\n..."}

# An image chunk: content is the image NAME, not the bytes.
# {"content": "75a3c27ad7854d78.png",
#  "content_type": "image",
#  "metadata": {"alt_text": "", "image_name": "75a3c27ad7854d78.png"}}

# Formats with no embedded-image support still return a ChunksResult —
# with an empty images dict, not an error.`,
    },
    js: {
      filename: "chunks-result.ts",
      code: `import { getChunks } from "js-chunks";

// listImages: true changes the resolved type to { chunks, images }.
const { chunks, images } = await getChunks("./report.docx", {
  listImages: true,
});

chunks;   // Chunk[] — text chunks AND image chunks, in document order
images;   // ChunkImage[] — an ARRAY of { name, data: Uint8Array },
          // where py-chunks hands you a name -> bytes dict.

// An image chunk, same values as py-chunks:
// { content: "75a3c27ad7854d78.png",
//   contentType: "image",
//   metadata: { alt_text: "", image_name: "75a3c27ad7854d78.png" } }`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::formats::docx;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Rust returns a tuple, and images are (name, bytes) pairs.
    let (chunks, images) = docx::chunk_with_images("report.docx", "default", 3, 1, 3, 15)?;
    println!("{} chunks, {} images", chunks.len(), images.len());
    Ok(())
}

// At the source-agnostic dispatch layer only the *bytes* variant exists:
// chunks_rs::get_chunks_with_images_from_bytes(&data, "report.docx", "default", 3, 1, 3, 15)`,
    },
  },

  // ── Modes ────────────────────────────────────────────────────────────────
  /**
   * The six document modes over the same `notes.md`, so the difference is the
   * mode and nothing else. Every output block below is a real run.
   */
  modeStructural: {
    py: {
      filename: "structural.py",
      code: `from py_chunks import get_chunks

# "structural" is what "default" resolves to for prose formats: one chunk per
# block, headings kept as their own chunks.
for c in get_chunks("notes.md", mode="structural"):
    print(c["content_type"], "|", c["metadata"]["section_heading"])

# heading | None
# plain_paragraph | Chunking Notes
# heading | None
# plain_paragraph | Why structure matters
# table | Why structure matters
# heading | None
# plain_paragraph | Modes`,
    },
    js: {
      filename: "structural.ts",
      code: `import { getChunks } from "js-chunks";

for (const c of await getChunks("./notes.md", { mode: "structural" })) {
  console.log(c.contentType, "|", c.metadata.section_heading);
}

// heading | null
// plain_paragraph | Chunking Notes
// heading | null
// plain_paragraph | Why structure matters
// table | Why structure matters
// heading | null
// plain_paragraph | Modes`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in &get_chunks("notes.md", "structural", 3, 1, 3, 15)? {
        println!("{} | {}", c.content_type, c.metadata["section_heading"]);
    }
    Ok(())
}

// heading | null
// plain_paragraph | "Chunking Notes"
// heading | null
// plain_paragraph | "Why structure matters"
// table | "Why structure matters"
// heading | null
// plain_paragraph | "Modes"`,
    },
  },

  modeSection: {
    py: {
      filename: "section.py",
      code: `from py_chunks import get_chunks

# One chunk per section body, with the heading trail in heading_path.
# The heading itself stays a SEPARATE chunk — it is not folded into the body.
for c in get_chunks("notes.md", mode="section"):
    print(c["content_type"], "|", c["metadata"]["heading_path"])

# heading | ['Chunking Notes']
# section | ['Chunking Notes']
# heading | ['Chunking Notes', 'Why structure matters']
# section | ['Chunking Notes', 'Why structure matters']
# heading | ['Chunking Notes', 'Modes']
# section | ['Chunking Notes', 'Modes']`,
    },
    js: {
      filename: "section.ts",
      code: `import { getChunks } from "js-chunks";

for (const c of await getChunks("./notes.md", { mode: "section" })) {
  console.log(c.contentType, "|", c.metadata.heading_path);
}

// heading | [ 'Chunking Notes' ]
// section | [ 'Chunking Notes' ]
// heading | [ 'Chunking Notes', 'Why structure matters' ]
// section | [ 'Chunking Notes', 'Why structure matters' ]
// heading | [ 'Chunking Notes', 'Modes' ]
// section | [ 'Chunking Notes', 'Modes' ]`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in &get_chunks("notes.md", "section", 3, 1, 3, 15)? {
        println!("{} | {}", c.content_type, c.metadata["heading_path"]);
    }
    Ok(())
}

// heading | ["Chunking Notes"]
// section | ["Chunking Notes"]
// heading | ["Chunking Notes","Why structure matters"]
// section | ["Chunking Notes","Why structure matters"]
// heading | ["Chunking Notes","Modes"]
// section | ["Chunking Notes","Modes"]`,
    },
  },

  modeSemantic: {
    py: {
      filename: "semantic.py",
      code: `from py_chunks import get_chunks

# Adjacent blocks merge when they look like the same idea. Every chunk records
# WHY it starts where it does, in primary_merge_reason (+ merge_reasons).
for c in get_chunks("notes.md", mode="semantic"):
    print(c["content_type"], "|", c["metadata"]["primary_merge_reason"])

# heading | initial
# semantic | initial
# heading | initial
# semantic | initial
# table | structural_boundary
# heading | initial
# semantic | initial`,
    },
    js: {
      filename: "semantic.ts",
      code: `import { getChunks } from "js-chunks";

for (const c of await getChunks("./notes.md", { mode: "semantic" })) {
  console.log(c.contentType, "|", c.metadata.primary_merge_reason);
}

// heading | initial
// semantic | initial
// heading | initial
// semantic | initial
// table | structural_boundary
// heading | initial
// semantic | initial`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in &get_chunks("notes.md", "semantic", 3, 1, 3, 15)? {
        println!("{} | {}", c.content_type, c.metadata["primary_merge_reason"]);
    }
    Ok(())
}

// heading | "initial"
// semantic | "initial"
// heading | "initial"
// semantic | "initial"
// table | "structural_boundary"
// heading | "initial"
// semantic | "initial"`,
    },
  },

  modeSentence: {
    py: {
      filename: "sentence.py",
      code: `from py_chunks import get_chunks

# Groups of sentences_per_chunk sentences (default 3), never crossing a block.
# Headings and tables stay whole and carry no sentence count.
for c in get_chunks("notes.md", mode="sentence"):
    print(c["content_type"], "|", c["metadata"].get("actual_sentence_count"))

# heading | None
# sentence | 2
# heading | None
# sentence | 2
# table | None
# heading | None
# sentence | 3
# sentence | 1     <- the short final group of a 4-sentence paragraph`,
    },
    js: {
      filename: "sentence.ts",
      code: `import { getChunks } from "js-chunks";

for (const c of await getChunks("./notes.md", { mode: "sentence" })) {
  console.log(c.contentType, "|", c.metadata.actual_sentence_count);
}

// heading | undefined
// sentence | 2
// heading | undefined
// sentence | 2
// table | undefined
// heading | undefined
// sentence | 3
// sentence | 1     <- the short final group of a 4-sentence paragraph`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in &get_chunks("notes.md", "sentence", 3, 1, 3, 15)? {
        println!("{} | {}", c.content_type, c.metadata["actual_sentence_count"]);
    }
    Ok(())
}

// heading | null
// sentence | 2
// heading | null
// sentence | 2
// table | null
// heading | null
// sentence | 3
// sentence | 1`,
    },
  },

  modeSlidingWindow: {
    py: {
      filename: "sliding_window.py",
      code: `from py_chunks import get_chunks

# window_size blocks per chunk, stepping by (window_size - overlap).
# Defaults: window_size=3, overlap=1 -> step 2. Headings are NOT separate here;
# every chunk is a window.
for c in get_chunks("notes.md", mode="sliding_window"):
    m = c["metadata"]
    print(c["content_type"], "|", m["paragraph_range"], "|", m["block_count"])

# sliding_window | [0, 2] | 3
# sliding_window | [2, 4] | 3
# sliding_window | [4, 6] | 3`,
    },
    js: {
      filename: "sliding-window.ts",
      code: `import { getChunks } from "js-chunks";

const chunks = await getChunks("./notes.md", {
  mode: "sliding_window",
  windowSize: 3,
  overlap: 1,
});
for (const c of chunks) {
  console.log(c.contentType, "|", c.metadata.paragraph_range, "|", c.metadata.block_count);
}

// sliding_window | [ 0, 2 ] | 3
// sliding_window | [ 2, 4 ] | 3
// sliding_window | [ 4, 6 ] | 3

// overlap >= windowSize throws ChunkError: "overlap must be less than window_size"`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in &get_chunks("notes.md", "sliding_window", 3, 1, 3, 15)? {
        println!("{} | {} | {}", c.content_type,
                 c.metadata["paragraph_range"], c.metadata["block_count"]);
    }
    Ok(())
}

// sliding_window | [0,2] | 3
// sliding_window | [2,4] | 3
// sliding_window | [4,6] | 3`,
    },
  },

  modePageAware: {
    py: {
      filename: "page_aware.py",
      code: `from py_chunks import get_chunks

# Markdown has no pages, so the engine synthesizes boundaries — page_break_type
# says which rule fired. On a paginated format (docx, pdf, pptx) the same mode
# also carries a real page_number; see the metadata reference.
for c in get_chunks("notes.md", mode="page_aware"):
    print(c["content_type"], "|", c["metadata"]["page_break_type"])

# heading | heading_boundary
# page_aware | heading_boundary
# heading | heading_boundary
# page_aware | heading_boundary
# heading | heading_boundary
# page_aware | heading_boundary`,
    },
    js: {
      filename: "page-aware.ts",
      code: `import { getChunks } from "js-chunks";

// paragraphsPerPage (default 15) is the fallback page size when a format has
// no real page breaks to follow.
for (const c of await getChunks("./notes.md", { mode: "page_aware" })) {
  console.log(c.contentType, "|", c.metadata.page_break_type);
}

// heading | heading_boundary
// page_aware | heading_boundary
// heading | heading_boundary
// page_aware | heading_boundary
// heading | heading_boundary
// page_aware | heading_boundary`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // The last positional argument is paragraphs_per_page (default 15).
    for c in &get_chunks("notes.md", "page_aware", 3, 1, 3, 15)? {
        println!("{} | {}", c.content_type, c.metadata["page_break_type"]);
    }
    Ok(())
}

// heading | "heading_boundary"
// page_aware | "heading_boundary"
// heading | "heading_boundary"
// page_aware | "heading_boundary"
// heading | "heading_boundary"
// page_aware | "heading_boundary"`,
    },
  },

  // ── Errors ───────────────────────────────────────────────────────────────
  /**
   * Real messages, captured from py-chunks 0.6.1 and js-chunks 0.6.1.
   * The JS `else throw` is defensive only: every js-chunks failure is now a
   * `ChunkError`, including a missing path (`kind: "io"`, Node's own message).
   */
  errorHandling: {
    py: {
      filename: "errors.py",
      code: `from py_chunks import get_chunks

try:
    chunks = get_chunks("report.xyz")
except FileNotFoundError as e:
    ...   # File not found: report.xyz
except ValueError as e:
    ...   # unsupported extension, bad mode, bad window/overlap
except RuntimeError as e:
    ...   # the document could not be parsed

# Real messages:
# ValueError: Unsupported file type '.xyz'. Supported: .csv, .doc, .docm, ...
# ValueError: mode must be one of ['default', 'page_aware', 'section',
#             'semantic', 'sentence', 'sliding_window', 'structural'] for MD,
#             got: 'nope'
# ValueError: overlap must be less than window_size
# ValueError: filename is required when source is bytes`,
    },
    js: {
      filename: "errors.ts",
      code: `import { getChunks, ChunkError } from "js-chunks";

try {
  const chunks = await getChunks("./report.xyz");
} catch (e) {
  if (e instanceof ChunkError) {
    // kind: "unsupported" | "invalid-arg" | "parse" | "io" | "unknown"
    console.error(e.kind, e.message);
  } else {
    throw e;   // defensive: every js-chunks failure is a ChunkError
  }
}

// unsupported   Unsupported file type '.xyz'
// invalid-arg   A filename is required for byte sources (pass opts.filename
//               or a named Blob) so the engine can route by extension.
// invalid-arg   overlap must be less than window_size
// io            ENOENT: no such file or directory, open './report.xyz'`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::{get_chunks, ChunkError};

fn main() {
    match get_chunks("report.xyz", "default", 3, 1, 3, 15) {
        Ok(chunks) => println!("{} chunks", chunks.len()),
        Err(ChunkError::Unsupported(m)) => eprintln!("unsupported: {m}"),
        Err(ChunkError::InvalidArg(m)) => eprintln!("bad argument: {m}"),
        Err(ChunkError::Parse(m)) => eprintln!("parse failed: {m}"),
        Err(ChunkError::Io(e)) => eprintln!("io: {e}"),
        // ChunkError is #[non_exhaustive] — a wildcard arm is required.
        Err(e) => eprintln!("other: {e}"),
    }
}

// unsupported: Unsupported file type '.xyz'`,
    },
  },

  // ── Streaming ────────────────────────────────────────────────────────────
  streaming: {
    py: {
      filename: "stream.py",
      code: `from py_chunks import stream_chunks

# Yields one chunk at a time
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
fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in csv::stream("data.csv", "row", 10, 5, 1, true, None, "utf-8", true)? {
        let c = c?;
        println!("{}", c.content_type);
    }
    Ok(())
}`,
    },
  },

  streamingAdvanced: {
    py: {
      filename: "stream_batches.py",
      code: `from py_chunks import stream_chunks

# Genuinely incremental for pdf and xlsx: chunks are produced as the document
# is read, so breaking early skips the rest of the parse. Every other format
# is chunked in full by the binding and drained through the same iterator —
# same results, same peak memory as get_chunks().
batch = []
for chunk in stream_chunks("large.pdf", mode="section"):
    batch.append(chunk)
    if len(batch) == 128:
        upsert(batch)
        batch.clear()

if batch:
    upsert(batch)`,
    },
    js: {
      filename: "stream-batches.ts",
      code: `import { streamChunks, type Chunk } from "js-chunks";

// Ergonomics, not bounded memory: the wasm boundary is a synchronous full
// parse, so the whole chunk list exists before the first yield. Use this to
// overlap embedding/upsert work with iteration — not to survive a huge file.
let batch: Chunk[] = [];
for await (const chunk of streamChunks("./large.pdf", { mode: "section" })) {
  batch.push(chunk);
  if (batch.length === 128) {
    await upsert(batch);
    batch = [];
  }
}
if (batch.length) await upsert(batch);`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::formats::pdf;
use chunks_rs::Chunk;

// Streaming is per-format (there is no dispatch-level stream). For PDF the
// "default" mode streams for real — a chunk costs only the pages it came from;
// the other modes rank heading sizes across the whole document, so the parse
// completes behind the iterator.
fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut batch: Vec<Chunk> = Vec::new();
    for chunk in pdf::stream("large.pdf", "default", 3, 1, 3, 15)? {
        batch.push(chunk?);
        if batch.len() == 128 {
            upsert(&batch);
            batch.clear();
        }
    }
    if !batch.is_empty() {
        upsert(&batch);
    }
    Ok(())
}`,
    },
  },

  // ── Markdown & images ────────────────────────────────────────────────────
  markdown: {
    py: {
      filename: "markdown.py",
      code: `from py_chunks import get_markdown

md = get_markdown("report.docx")                       # -> str
md = get_markdown(file_bytes, filename="report.pdf")   # bytes also supported

# get_markdown does NOT accept URLs — a URL string is treated as a path and
# raises FileNotFoundError. Download it first, then pass the bytes.`,
    },
    js: {
      filename: "markdown.ts",
      code: `import { getMarkdown } from "js-chunks";

const md = await getMarkdown("./report.docx");   // -> string

// With images: { markdown, images: { name, data }[] }
const withImages = await getMarkdown("./report.docx", { listImages: true });`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::{get_markdown, get_markdown_from_bytes};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let md = get_markdown("report.docx")?;                       // -> String
    let data = std::fs::read("report.docx")?;
    let md2 = get_markdown_from_bytes(&data, "report.docx")?;    // no filesystem
    println!("{} {}", md.len(), md2.len());
    Ok(())
}`,
    },
  },

  images: {
    py: {
      filename: "images.py",
      code: `from py_chunks import get_chunks

result = get_chunks("deck.pptx", list_images=True)   # -> ChunksResult
result.chunks   # text chunks + image chunks (content_type="image")
result.images   # {"<hash>.jpeg": b"..."} — name matches the ![](name) reference`,
    },
    js: {
      filename: "images.ts",
      code: `import { getChunks } from "js-chunks";

const { chunks, images } = await getChunks("./deck.pptx", { listImages: true });
// images: { name: string; data: Uint8Array }[]  — name matches the ![](name) ref`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::formats::pptx;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Returns (chunks, images); images are (name, bytes) pairs
    let (chunks, images) = pptx::chunk_with_images("deck.pptx", "default", 3, 1, 3, 15)?;
    println!("{} {}", chunks.len(), images.len());
    Ok(())
}`,
    },
  },

  // ── Recipes / integration ────────────────────────────────────────────────
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

fn ingest(path: &str) -> Result<(), Box<dyn std::error::Error>> {
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

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for entry in fs::read_dir("docs")? {
        let path = entry?.path();
        let p = path.to_string_lossy().to_string();
        match get_chunks(&p, "default", 3, 1, 3, 15) {
            Ok(chunks) => index(&path, &chunks),
            Err(e) => eprintln!("skip {p}: {e}"),  // keep going
        }
    }
    Ok(())
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

# Streaming — lazy iteration; genuinely incremental for pdf and xlsx
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

// Streaming — async-iteration ergonomics over the same results
for await (const chunk of streamChunks("./large.pdf", { mode: "section" })) {
  handle(chunk);
}

// Markdown conversion
const md = await getMarkdown("./report.docx");`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::{formats::csv, get_chunks, get_markdown};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Batch — dispatch by extension. Positional args:
    // get_chunks(path, mode, window_size, overlap, sentences_per_chunk,
    //            paragraphs_per_page)
    let chunks = get_chunks("document.pdf", "default", 3, 1, 3, 15)?;
    println!("{} chunks", chunks.len());

    let chunks = get_chunks("notes.md", "semantic", 3, 1, 3, 15)?;

    for c in &chunks {
        println!("[{}] {}", c.content_type, c.content);
        // c.metadata is a serde_json::Value with format-specific provenance
    }

    // Streaming is per-format, and yields the same chunks one at a time
    for c in csv::stream("data.csv", "row", 10, 5, 1, true, None, "utf-8", true)? {
        let c = c?;
        println!("{}", c.content_type);
    }

    // One-shot Markdown conversion
    let md = get_markdown("report.docx")?;
    println!("{}", md.len());
    Ok(())
}`,
    },
  },

  // --- W4 recipes ---------------------------------------------------------
  // Appended by the W4 docs lane (modes / streaming / recipes / errors /
  // frameworks). Every chunk-engine call below was run against the real SDKs;
  // third-party client calls (psycopg, qdrant-client, langchain, llama-index)
  // are written against those packages' documented APIs and are marked where
  // they cannot be executed without a running server.

  /**
   * `page_aware` on a DOCX — the case that actually carries a page number.
   * Captured live from `test_files/docx/all_round.docx` (5 pages) at default
   * parameters, py-chunks and js-chunks producing identical values.
   */
  modePageAwareDocx: {
    py: {
      filename: "page_aware_docx.py",
      code: `from py_chunks import get_chunks

# DOCX is one of the few formats whose page_aware chunks carry a real
# page_number. page_break_type says where each boundary came from.
for c in get_chunks("all_round.docx", mode="page_aware"):
    m = c["metadata"]
    print(c["content_type"], "| page", m["page_number"], "|", m["page_break_type"])

# page_aware | page 1 | explicit    <- <w:br w:type="page"/> in the file
# page_aware | page 2 | rendered    <- <w:lastRenderedPageBreak/> hint
# page_aware | page 3 | section     <- <w:sectPr> boundary
# page_aware | page 4 | rendered
# page_aware | page 5 | estimated   <- no marker; paragraphs_per_page fallback`,
    },
    js: {
      filename: "page-aware-docx.ts",
      code: `import { getChunks } from "js-chunks";

for (const c of await getChunks("./all_round.docx", { mode: "page_aware" })) {
  console.log(c.contentType, "| page", c.metadata.page_number,
              "|", c.metadata.page_break_type);
}

// page_aware | page 1 | explicit
// page_aware | page 2 | rendered
// page_aware | page 3 | section
// page_aware | page 4 | rendered
// page_aware | page 5 | estimated

// On a PDF the same loop prints \`undefined\` for every page_number —
// PDF page_aware does not emit that key at all.`,
    },
    rs: {
      filename: "main.rs",
      code: `use chunks_rs::get_chunks;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    for c in &get_chunks("all_round.docx", "page_aware", 3, 1, 3, 15)? {
        println!("{} | page {} | {}", c.content_type,
                 c.metadata["page_number"], c.metadata["page_break_type"]);
    }
    Ok(())
}

// page_aware | page 1 | "explicit"
// page_aware | page 2 | "rendered"
// page_aware | page 3 | "section"
// page_aware | page 4 | "rendered"
// page_aware | page 5 | "estimated"`,
    },
  },

  /**
   * Ingest into a real vector database. Python uses pgvector via psycopg 3;
   * JavaScript uses Qdrant via @qdrant/js-client-rest; Rust uses qdrant-client.
   * The chunk-engine half is verified; the DB half needs a running server.
   */
  vectorDbIngest: {
    py: {
      filename: "ingest_pgvector.py",
      code: `# pip install py-chunks psycopg[binary] pgvector
import psycopg
from pgvector.psycopg import register_vector
from py_chunks import get_chunks

conn = psycopg.connect("postgresql://localhost/rag")
register_vector(conn)
conn.execute("CREATE EXTENSION IF NOT EXISTS vector")
conn.execute("""
    CREATE TABLE IF NOT EXISTS chunks (
        id          bigserial PRIMARY KEY,
        source      text NOT NULL,
        chunk_index int  NOT NULL,
        content     text NOT NULL,
        content_type text NOT NULL,
        metadata    jsonb NOT NULL,
        embedding   vector(1536),
        UNIQUE (source, chunk_index)
    )
""")

def ingest(path: str) -> int:
    chunks = get_chunks(path, mode="semantic")
    with conn.cursor() as cur:
        for i, chunk in enumerate(chunks):
            cur.execute(
                """INSERT INTO chunks
                       (source, chunk_index, content, content_type, metadata, embedding)
                   VALUES (%s, %s, %s, %s, %s, %s)
                   ON CONFLICT (source, chunk_index) DO UPDATE
                       SET content   = EXCLUDED.content,
                           metadata  = EXCLUDED.metadata,
                           embedding = EXCLUDED.embedding""",
                (path, i, chunk["content"], chunk["content_type"],
                 psycopg.types.json.Jsonb(chunk["metadata"]),
                 embed(chunk["content"])),          # your embedding model
            )
    conn.commit()
    return len(chunks)

# chunk_index is positional here because not every format writes one into
# metadata. See /docs/output-schema for which ones do.`,
    },
    js: {
      filename: "ingest-qdrant.ts",
      code: `// npm i js-chunks @qdrant/js-client-rest
import { QdrantClient } from "@qdrant/js-client-rest";
import { getChunks } from "js-chunks";

const qdrant = new QdrantClient({ url: "http://localhost:6333" });
const COLLECTION = "docs";

await qdrant.createCollection(COLLECTION, {
  vectors: { size: 1536, distance: "Cosine" },
}).catch(() => {});   // already exists

export async function ingest(path: string) {
  const chunks = await getChunks(path, { mode: "semantic" });

  await qdrant.upsert(COLLECTION, {
    wait: true,
    points: await Promise.all(
      chunks.map(async (chunk, i) => ({
        id: \`\${path}#\${i}\`,
        vector: await embed(chunk.content),        // your embedding model
        payload: {
          source: path,
          chunkIndex: i,
          content: chunk.content,
          contentType: chunk.contentType,
          ...chunk.metadata,
        },
      })),
    ),
  });

  return chunks.length;
}`,
    },
    rs: {
      filename: "ingest_qdrant.rs",
      code: `// qdrant-client = "1"
use chunks_rs::get_chunks;
use qdrant_client::qdrant::{PointStruct, UpsertPointsBuilder};
use qdrant_client::Qdrant;

async fn ingest(client: &Qdrant, path: &str) -> Result<usize, Box<dyn std::error::Error>> {
    let chunks = get_chunks(path, "semantic", 3, 1, 3, 15)?;

    let points: Vec<PointStruct> = chunks
        .iter()
        .enumerate()
        .map(|(i, c)| {
            PointStruct::new(
                i as u64,
                embed(&c.content),                   // your embedding model
                [
                    ("source", path.into()),
                    ("chunk_index", (i as i64).into()),
                    ("content", c.content.clone().into()),
                    ("content_type", c.content_type.clone().into()),
                ],
            )
        })
        .collect();

    client
        .upsert_points(UpsertPointsBuilder::new("docs", points).wait(true))
        .await?;
    Ok(chunks.len())
}`,
    },
  },

  /**
   * LangChain adapters. Both sides just map a chunk onto the framework's
   * Document type — chunk-engine has already done the splitting, so no
   * TextSplitter is involved.
   */
  langchainAdapter: {
    py: {
      filename: "langchain_loader.py",
      code: `# pip install py-chunks langchain-core
from langchain_core.documents import Document
from langchain_core.document_loaders import BaseLoader
from py_chunks import get_chunks


class ChunkEngineLoader(BaseLoader):
    """A LangChain loader that is already chunked — no TextSplitter needed."""

    def __init__(self, path: str, mode: str = "semantic"):
        self.path, self.mode = path, mode

    def lazy_load(self):
        for i, chunk in enumerate(get_chunks(self.path, mode=self.mode)):
            yield Document(
                page_content=chunk["content"],
                metadata={
                    "source": self.path,
                    "chunk_index": i,
                    "content_type": chunk["content_type"],
                    **chunk["metadata"],
                },
            )


docs = ChunkEngineLoader("handbook.docx").load()
# Feed straight to a vector store — do NOT run RecursiveCharacterTextSplitter
# over these; it would cut the structure chunk-engine just preserved.`,
    },
    js: {
      filename: "langchain-loader.ts",
      code: `// npm i js-chunks @langchain/core
import { BaseDocumentLoader } from "@langchain/core/document_loaders/base";
import { Document } from "@langchain/core/documents";
import { getChunks, type ChunkMode } from "js-chunks";

export class ChunkEngineLoader extends BaseDocumentLoader {
  constructor(
    private path: string,
    private mode: ChunkMode = "semantic",
  ) {
    super();
  }

  async load(): Promise<Document[]> {
    const chunks = await getChunks(this.path, { mode: this.mode });
    return chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk.content,
          metadata: {
            source: this.path,
            chunkIndex: i,
            contentType: chunk.contentType,
            ...chunk.metadata,
          },
        }),
    );
  }
}

const docs = await new ChunkEngineLoader("./handbook.docx").load();`,
    },
  },

  /** LlamaIndex reader. Python only — there is no js-chunks LlamaIndex.TS binding. */
  llamaIndexAdapter: {
    py: {
      filename: "llamaindex_reader.py",
      code: `# pip install py-chunks llama-index-core
from llama_index.core import VectorStoreIndex
from llama_index.core.readers.base import BaseReader
from llama_index.core.schema import TextNode
from py_chunks import get_chunks


class ChunkEngineReader(BaseReader):
    """Emit TextNodes directly — skip LlamaIndex's own node parser."""

    def load_data(self, path: str, mode: str = "semantic") -> list[TextNode]:
        nodes = []
        for i, chunk in enumerate(get_chunks(path, mode=mode)):
            nodes.append(
                TextNode(
                    text=chunk["content"],
                    id_=f"{path}#{i}",
                    metadata={
                        "source": path,
                        "chunk_index": i,
                        "content_type": chunk["content_type"],
                        **chunk["metadata"],
                    },
                )
            )
        return nodes


nodes = ChunkEngineReader().load_data("research.pdf")
index = VectorStoreIndex(nodes)   # nodes are pre-chunked; no transformations`,
    },
  },

  /**
   * Re-index only what changed. The identity of a chunk is
   * (source, chunk_index); the content hash decides whether it needs
   * re-embedding. Verified against the real SDKs for the hashing/looping half.
   */
  incrementalReindex: {
    py: {
      filename: "reindex.py",
      code: `import hashlib
from py_chunks import get_chunks


def content_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def reindex(path: str, store) -> dict:
    """Re-embed only the chunks whose text actually changed."""
    chunks = get_chunks(path, mode="semantic")

    # {chunk_index: hash} of what is already indexed for this source
    known = store.hashes_for_source(path)
    stats = {"added": 0, "updated": 0, "deleted": 0, "unchanged": 0}

    for i, chunk in enumerate(chunks):
        h = content_hash(chunk["content"])
        if known.get(i) == h:
            stats["unchanged"] += 1
            continue
        store.upsert(
            key=(path, i),
            vector=embed(chunk["content"]),
            text=chunk["content"],
            meta={**chunk["metadata"], "source": path,
                  "chunk_index": i, "content_hash": h},
        )
        stats["updated" if i in known else "added"] += 1

    # The document got shorter: drop the tail.
    for stale in (idx for idx in known if idx >= len(chunks)):
        store.delete((path, stale))
        stats["deleted"] += 1

    return stats`,
    },
    js: {
      filename: "reindex.ts",
      code: `import { createHash } from "node:crypto";
import { getChunks } from "js-chunks";

const contentHash = (text: string) =>
  createHash("sha256").update(text, "utf8").digest("hex");

export async function reindex(path: string, store: Store) {
  const chunks = await getChunks(path, { mode: "semantic" });
  const known = await store.hashesForSource(path);   // Map<number, string>
  const stats = { added: 0, updated: 0, deleted: 0, unchanged: 0 };

  for (const [i, chunk] of chunks.entries()) {
    const hash = contentHash(chunk.content);
    if (known.get(i) === hash) {
      stats.unchanged++;
      continue;
    }
    await store.upsert({
      key: \`\${path}#\${i}\`,
      vector: await embed(chunk.content),
      text: chunk.content,
      meta: { ...chunk.metadata, source: path, chunkIndex: i, contentHash: hash },
    });
    known.has(i) ? stats.updated++ : stats.added++;
  }

  for (const idx of known.keys()) {
    if (idx >= chunks.length) {
      await store.delete(\`\${path}#\${idx}\`);
      stats.deleted++;
    }
  }

  return stats;
}`,
    },
    rs: {
      filename: "reindex.rs",
      code: `use std::collections::HashMap;

use chunks_rs::get_chunks;
use sha2::{Digest, Sha256};

fn content_hash(text: &str) -> String {
    format!("{:x}", Sha256::digest(text.as_bytes()))
}

fn reindex(path: &str, store: &mut Store) -> Result<(), Box<dyn std::error::Error>> {
    let chunks = get_chunks(path, "semantic", 3, 1, 3, 15)?;
    let known: HashMap<usize, String> = store.hashes_for_source(path);

    for (i, chunk) in chunks.iter().enumerate() {
        let hash = content_hash(&chunk.content);
        if known.get(&i) == Some(&hash) {
            continue;                       // unchanged — skip the embedding call
        }
        store.upsert(path, i, embed(&chunk.content), &chunk.content, &hash);
    }

    for stale in known.keys().filter(|i| **i >= chunks.len()) {
        store.delete(path, *stale);
    }
    Ok(())
}`,
    },
  },

  /**
   * De-duplicate chunks across a corpus. Boilerplate (headers, footers,
   * legal notices) repeats verbatim across documents and poisons retrieval.
   */
  dedup: {
    py: {
      filename: "dedup.py",
      code: `import hashlib
from pathlib import Path
from py_chunks import get_chunks


def normalize(text: str) -> str:
    # Collapse whitespace so "same paragraph, different wrapping" collides.
    return " ".join(text.split()).casefold()


seen: dict[str, tuple[str, int]] = {}
unique, duplicates = [], []

for path in Path("corpus").rglob("*"):
    if not path.is_file():
        continue
    try:
        chunks = get_chunks(str(path), mode="semantic")
    except Exception as e:
        print("skip", path, e)
        continue

    for i, chunk in enumerate(chunks):
        key = hashlib.sha256(normalize(chunk["content"]).encode()).hexdigest()
        if key in seen:
            duplicates.append((str(path), i, seen[key]))
            continue
        seen[key] = (str(path), i)
        unique.append(chunk)

print(f"{len(unique)} unique, {len(duplicates)} duplicate chunks")

# Tip: sliding_window is *designed* to overlap, so never dedup its output —
# you would delete the overlap that makes the mode work.`,
    },
    js: {
      filename: "dedup.ts",
      code: `import { createHash } from "node:crypto";
import { readdir } from "node:fs/promises";
import { getChunks, type Chunk } from "js-chunks";

const normalize = (t: string) => t.split(/\s+/).join(" ").toLowerCase();
const key = (t: string) => createHash("sha256").update(normalize(t)).digest("hex");

const seen = new Map<string, string>();
const unique: Chunk[] = [];
let duplicates = 0;

for (const name of await readdir("corpus")) {
  let chunks: Chunk[];
  try {
    chunks = await getChunks(\`corpus/\${name}\`, { mode: "semantic" });
  } catch (e) {
    console.warn("skip", name, e);
    continue;
  }
  for (const [i, chunk] of chunks.entries()) {
    const k = key(chunk.content);
    if (seen.has(k)) {
      duplicates++;
      continue;
    }
    seen.set(k, \`\${name}#\${i}\`);
    unique.push(chunk);
  }
}

console.log(\`\${unique.length} unique, \${duplicates} duplicate chunks\`);`,
    },
    rs: {
      filename: "dedup.rs",
      code: `use std::collections::HashMap;
use std::fs;

use chunks_rs::get_chunks;
use sha2::{Digest, Sha256};

fn normalize(text: &str) -> String {
    text.split_whitespace().collect::<Vec<_>>().join(" ").to_lowercase()
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let mut seen: HashMap<String, String> = HashMap::new();
    let (mut unique, mut duplicates) = (0usize, 0usize);

    for entry in fs::read_dir("corpus")? {
        let path = entry?.path();
        let p = path.to_string_lossy().to_string();
        let chunks = match get_chunks(&p, "semantic", 3, 1, 3, 15) {
            Ok(c) => c,
            Err(e) => {
                eprintln!("skip {p}: {e}");
                continue;
            }
        };
        for (i, c) in chunks.iter().enumerate() {
            let key = format!("{:x}", Sha256::digest(normalize(&c.content).as_bytes()));
            if seen.contains_key(&key) {
                duplicates += 1;
                continue;
            }
            seen.insert(key, format!("{p}#{i}"));
            unique += 1;
        }
    }

    println!("{unique} unique, {duplicates} duplicate chunks");
    Ok(())
}`,
    },
  },
};
