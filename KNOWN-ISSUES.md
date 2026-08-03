# chunk-engine — Known Issues (engine defects)

Consolidated, actionable list of **known defects in the underlying engine**
(`py_chunks` / `rs-chunks` / `js-chunks` share the same Rust core, so most items
affect all three SDKs). Compiled from `py_chunks/TECH_DEBT.md` (benchmark review
2026-07-28 + 17-agent per-format review 2026-08-03) as a handoff for the fixing
agent.

- **This is a tracking doc, not published on the site.** Code locations are
  relative to the **library** repo (`src/extensions/...`, `py_chunks/...`), not
  this website repo.
- Severity: 🔴 **Critical** (near-universal correctness / silent data corruption)
  · 🟠 **High** (silent content loss on common inputs) · 🟡 **Medium** (content or
  metadata gap, narrower blast radius) · ⚪ **Low** (test/doc-accuracy, no data loss).
- Each item keeps its original TECH_DEBT number for cross-reference.

---

## Fix-first shortlist (🔴 / highest-impact 🟠)

| # | Format | One-line | Why urgent |
|---|---|---|---|
| 10 | `.doc` | Compressed-piece FC offset not halved | Corrupts start/end of virtually every real `.doc` |
| 9 | docx/pptx | Literal `&` silently dropped | Silent, ubiquitous corruption ("R&D"→"R D") in flagship formats |
| 51 | odt/odp | All 5 XML entities dropped **+ bare `&` truncates whole doc** | Broader than #9, adds silent whole-document loss |
| 22 | html | Unclosed `<p>`/`<li>` lose >98% of content | Very common legacy/hand-authored HTML |
| 45 | json | Single-object JSON → one 750KB+ chunk in every mode | Breaks bounded-size contract; most common JSON shape |
| 8 / 21 | xlsb / xlsm | One bad sheet (chart / XLM macro) kills whole workbook | Total content loss, no per-sheet isolation |
| 4 | pptx | SmartArt decks → 0 chunks | Total content loss |
| 56 | pdf | Blank/text-less PDFs emit garbage `code_block` chunks | Contradicts documented raise + page-image fallback |
| 30 / 31 | txt | UTF-16 / cp1252 files → garbage or U+FFFD | Realistic Notepad "Unicode" / legacy encodings |

> ⚠️ **Docs-accuracy conflicts** — three items contradict what the **live website
> currently states** (see the [dedicated section](#docs-accuracy-conflicts) at the
> bottom). Decide per item whether to fix the engine or correct the docs.

---

## `.doc` (legacy Word 97–2003)

### 10. 🔴 Compressed-piece FC offset not halved — corrupts nearly every real `.doc`
- **Repro:** `test_files/doc/sample.doc`, `1mb.doc`, any mode (get_chunks / get_markdown / list_images).
- **Symptom:** content silently shifted — title/authors/abstract/first heading gone; last chunk truncated mid-word or raw binary noise emitted as a `plain_paragraph`.
- **Where:** `src/extensions/doc/piece_table.rs::parse_pieces` — for a compressed (`fCompressed=1`) piece, raw `Fc.fc` must be **divided by 2** ([MS-DOC] 2.9.74); code uses `fc_raw & !0x4000_0000` directly (2048 instead of the true 1024).
- **Impact:** upstream of all 7 modes. Likely also causes the "all headings report level 2" symptom. No test asserts against known ground-truth text — why it shipped.

### 11. 🟡 `page_aware` never populates `page_number` (always null)
- **Where:** `src/extensions/doc/structural.rs` (`chunks_to_py` / `DocStructuralIterator::__next__`) hardcodes `"page_number": Null` for all modes, unlike docx `page_aware.rs`.
- **Impact:** no page provenance for `.doc` in `page_aware`.

### 12. 🟡 All 7 `.doc` modes share one flat generic paragraph model
- **Where:** single 764-line `structural.rs` over one `ParagraphType` enum; table cells flattened to `" | "` string (no row/col/cell metadata); `ParagraphProp.ilvl` parsed but `#[allow(dead_code)]`.
- **Impact:** no table structure / list depth / section breadcrumbs vs docx.

## docx / pptx (OOXML text-run extraction)

### 9. 🔴 Literal `&` characters silently dropped from DOCX and PPTX text
- **Repro:** `d.add_paragraph("Research & Development")` → `get_chunks` returns "Research Development"; `"R&D Update"` → `"R D Update"`. Source XML is correctly escaped (`<w:t>… &amp; …</w:t>`) — the bug is in extraction. Reproduces identically in PPTX.
- **Where:** quick-xml 0.38 emits a distinct `Event::GeneralRef` for `&amp;`/`&…;` (unlike 0.31); unhandled in the `_ => {}` catch-alls of **both** `common.rs::parse_document_xml_blocks_streaming` **and** `to_markdown.rs` (so `docx_to_markdown` body text is affected too — the "markdown not affected" note in TECH_DEBT referred to the separate `.md`-file chunker).
- **Likely scope:** every OOXML format sharing this path — `.docm .dotx .dotm .potx .potm .ppsx .ppsm` in addition to confirmed `.docx`/`.pptx`. ODT/ODF hit a broader variant (#51); legacy `.doc`/`.ppt` untested.
- **Impact:** silent, ubiquitous corruption ("S&P 500"→"S P 500", "Johnson & Johnson"→"Johnson Johnson"). Already disclosed on the benchmarks page. **Owner was fixing this in `src/extensions/md/`.**

## docx (gold standard — but real gaps)

### 1. 🟡 `section` mode: document intro lands out of reading order
- **Repro:** `all_round.docx`, `mode="section"` — intro/title paragraph emitted as chunk[7] instead of chunk[0].
- **Where:** section-boundary bookkeeping in the section chunker (pre-first-heading block flushed late).

### 2. 🟡 `get_markdown` drops body text adjacent to inline images
- **Repro:** `all_round.docx` Images section — paragraph after an inline image dropped by `get_markdown` (but kept by `get_chunks`, which instead drops the image marker → the two paths are inconsistent).

### 3. 🟡 `semantic` mode fragments numbered/bulleted lists
- **Repro:** `all_round.docx`, `mode="semantic"` — 6-item list broken into 27–35-char bullet-piece chunks instead of one `bullet_list`. Other modes correct.

### 5. 🟡 Heading level not clamped to 1–6
- **Repro:** `poi_bug59058.docx` — `source_paragraph_heading_level` returns `7` for a "Heading 7" style. Schema/tests assume 1..=6.
- **Fix:** clamp (or officially allow 7–9 outline levels in the schema).

### 6. 🟡 `semantic` mode yields zero chunks on two fixtures
- **Repro:** `poi_saut_page.docx`, `poi_chartex.docx`, `mode="semantic"` only → empty list. Two unrelated edge cases; diagnose independently.

### 13. 🟠 Only the first image per paragraph is extracted — siblings silently dropped
- **Repro:** `poi_VariousPictures.docx` (5 images in one `<w:p>`, 2 supported), `list_images=True` → exactly one image chunk, `images=={}`. `image_count` correctly reports 5.
- **Where:** `src/extensions/docx/common.rs::parse_document_xml_blocks_streaming` — `DocxBlock.image_alt/image_rid` are singular `Option`; harvest guards skip every image after the first in a paragraph.
- **Impact:** galleries / side-by-side images; affects get_chunks, list_images, `docx_to_markdown_with_images`.

### 14. 🟡 Byte-length short-paragraph threshold conflates CJK/Hebrew paragraphs
- **Repro:** `corpus_rtl_cjk.docx`, `mode="default"` — Hebrew+Japanese+Chinese paragraphs merged into one chunk.
- **Where:** `structural.rs::classify_paragraph_content`, `SHORT_PARAGRAPH_THRESHOLD=80` measured in **bytes** (`text.len()`); 2–3 bytes/char scripts fall under the "disconnected fragment" bucket.

## pptx

### 4. 🟠 Some files yield zero chunks in `default` mode (SmartArt)
- **Repro:** `poi_SmartArt.pptx`, `poi_tika-2605.pptx` → empty list (SmartArt text lives in `diagrams/data*.xml`, not shape text). Also partial loss when a slide has SmartArt + other text (`corpus_smartart.pptx`).

### 15. 🟠 Embedded chart data never extracted
- **Repro:** `poi_bar-chart.pptx` — `ppt/charts/chart1.xml` has real series/categories/values; get_chunks returns only the shape title, get_markdown has no data.
- **Where:** `src/extensions/pptx/common.rs` shape walker handles `<p:sp>`/`<a:tbl>` only; never reads `chartN.xml` from `<p:graphicFrame>`.

### 16. 🟡 `semantic`/`section` raise instead of returning `[]` on SmartArt-empty files
- **Where:** `pptx/section.rs:51`, `semantic.rs:302` `Err(...)` on zero output; other 5 modes emit empty vec. Inconsistent error contract across modes.

### 17. 🟡 Slide background-fill images invisible to text and image extraction
- **Repro:** `poi_02_bug59273.potx` (background-only slide) → 0 chunks, 0 images even with `list_images=True`.
- **Where:** `pptx/common.rs::extract_slide_pic_rids` matches `<p:pic>` only; never looks in `<p:bg><p:bgPr><a:blipFill>`.

## ppt (legacy PowerPoint 97–2003)

### 18. 🟡 No slide-aware metadata (unlike pptx)
- Metadata is `{source, chunk_index, total_chunks, paragraph_type, heading_level, page_number(null)}`; no `slide_number`/`slide_title`/`document_metadata`. Codified in `test_ppt.py` as parity with `.doc`.

### 19. 🟡 Image→slide attribution silently degrades to null on some files
- **Repro:** `sample1.ppt` → all images `page_number=None`; `sample2/3.ppt` correct. All-or-nothing gate `slide_pibs.len() == slide_count` in `ppt/images.rs`.

## Spreadsheets (xlsx / xls / xlsm / xlsb / ods / xltx / xltm)

### 8. 🟠 XLSB: whole file fails when a sheet contains a chart
- **Repro:** `calamine_any_sheets.xlsb` → `RuntimeError: ... Xlsb error: failed to fill whole buffer`. Other data sheets never reached. This is why measured coverage is **35/36**.

### 21. 🟠 XLSM: whole workbook fails on legacy XLM (pre-VBA) macro sheets
- **Repro A:** `poi_xlmmacro.xlsm` → `Unrecognized sheet:type: xl/macrosheets/sheet1.xml`. **Repro B:** `closedxml_tdf111974.xlsm` → `Relationship not found` (empty `r:id`). Real business sheets unreachable.
- **Where:** `open_spreadsheet` in `common.rs` — no per-sheet isolation; one bad sheet aborts the whole open. Same class as #8.

### 20. 🟡 `table` mode never surfaces named ranges for `.ods` (and no `.xlsb` `.bin.rels` fallback)
- **Repro:** `phpspreadsheet_DefinedNames.ods` — `sheet` mode returns named tables, `table` mode returns `is_named_table:False`.
- **Where:** `xlsx/table_region.rs::read_named_tables_for_sheet` reads OOXML only; no ODS branch / `.bin.rels` fallback (a second impl diverged from `common.rs`).

## html / htm

### 22. 🔴 Unclosed `<p>`/`<li>` tags lose >98% of content
- **Repro:** `w3c_html40_cover.htm` (HTML4 optional end tags) → 13 chunks / 611 chars from a 53KB file (~1.1%). Properly-closed sibling extracts 14,277 chars.
- **Where:** `src/extensions/html/common.rs` (`find_matching_tag_end`/`parse_html_blocks`) — hand-rolled parser requires explicit close; on none, discards the whole block instead of inferring an implicit close at the next block boundary.

### 23. 🟡 Named entities outside a small allowlist left undecoded
- `&copy;`/`&reg;` etc. rendered literally. `html/common.rs::decode_entity` handles only ~8 named entities + numeric refs.

### 24. 🟡 Nested `<table>` rows flattened into parent (constructed repro; no real fixture)
- `extract_tag_blocks(raw,"tr")` scans `<tr>` at any depth. **Unverified on a real fixture** — add one before prioritizing.

## csv / tsv

### 25. 🟠 Batch vs streaming produce different content for ragged/growing-width files
- **Repro:** `a,b\n1,2\n1,2,3,4,5\n`, `mode="row"` — batch pads to global max width (5 cols on every chunk incl. first); streaming grows incrementally. Breaks the README's "streaming output identical to batch" guarantee.
- **Where:** `csv/chunker.rs::parse_csv_to_rows` (global pre-scan) vs `stream_iter.rs::build_row_streaming`.

### 26. 🟠 First data row unconditionally treated as header — silent loss on headerless files
- **Repro:** headerless TSV (`tika_text-test.tsv`) → row 1 consumed as `header_row` and dropped; with `include_headers=True` its values become permanent per-column labels (bloats content ~1.85×). No `has_header` opt-out anywhere.
- **Where:** `csv/chunker.rs` / `stream_iter.rs` / `sliding_window.rs` all call `records.next()` once as header.

## Markdown engine (shared — json / ipynb / eml / txt route through this)

### 27. 🟠 Nested list hierarchy silently destroyed (all modes)
- **Repro:** nested `.md` list, and every `test_files/json/*` via the JSON→markdown pipeline — indentation stripped in `md/common.rs::parse_markdown_blocks` (`trimmed.trim()`), nesting unrecoverable. High impact on JSON (nested objects encoded as indented bullets).

### 28. 🟠 List/table/code blocks never size-capped, in any mode
- **Repro:** `_stress_big_table.md` → single 39,657-char table chunk; big list → 62,149 chars. `MAX_CHUNK_CHARS` etc. enforced for prose only. Affects any pipeline format emitting one big list/table/code block (JSON arrays, ipynb outputs, wide tables).

### 29. 🟡 Lines with 2+ pipes misclassified as tables
- **Repro:** `` `ls -la | grep foo | wc -l` `` and `C:\Users\foo|bar` tagged `content_type:"table"`. `looks_like_table_row` needs no header-separator / multi-row check. Content correct but type wrong.

## txt

### 30. 🟠 UTF-16 files silently produce garbage chunks (no error)
- **Repro:** Notepad "Unicode" save → null-interleaved garbage as `plain_paragraph`. `txt/structural.rs::build_chunks_from_txt_bytes` uses `from_utf8().unwrap_or_else(from_utf8_lossy)` — no BOM/encoding sniffing.

### 31. 🟠 Non-UTF-8 8-bit encodings (cp1252/Latin-1) silently corrupt punctuation
- Every non-ASCII byte → U+FFFD via the same lossy fallback. Contradicts CLAUDE.md's "encodings must be correct".

### 32. 🟡 UTF-8 BOM leaks into first chunk/heading text
- Heading becomes `\uFEFFTITLE`; `split_blocks`/`classify_block` never strip a leading BOM.

### 33. 🟡 ALL-CAPS single-line heuristic misfires on labels/acronyms
- "WARNING", "NASA JPL USA" classified as `heading`. Corrupts `section_heading`/`heading_path` in section/semantic/page_aware.

### 34. ⚪ Fixture corpus (3 synthetic files) below the ≥10-real-fixture bar
- `test_txt.py` hardcodes 3 hand-authored files; none exercise BOM/UTF-16/cp1252/empty/single-line — why #30–33 went uncaught.

## eml / mbox

### 35. 🟡 Text/HTML attachment content parsed then silently discarded
- **Repro:** `tika_testRFC822_multipart_attachments.eml` — base64 text/plain attachment decoded by mail-parser but dropped; only the filename line renders. `eml/extract.rs::document_from_message` builds `embedded_text:None` for the `PartType::Text/Html` arm.

### 36. 🟡 `.mbox` chunks carry no per-message metadata
- 152-message mailbox → every chunk's `document_metadata` is just `{source_type, message_count}`; no per-message index/subject/from/date. `eml/mbox.rs::mbox_to_markdown` discards each message's parsed `EmlDocument`.

### 37. 🟡 Threading headers (In-Reply-To/References) parsed upstream but never surfaced
- mail-parser exposes them; `EmlDocument`/`document_from_message` never reads them. Cheapest email-specific structure, unused.

## epub

### 38. 🟡 Multi-valued Dublin Core metadata collapsed to first value
- **Repro:** `tika_testEPUB_multi-metadata-vals.epub` (2 `dc:creator`) → only first author. `epub/package.rs` `if slot.is_none()` keeps first occurrence (also identifier/publisher/contributor).

### 39. 🟡 Native TOC (`toc.ncx` / `nav.xhtml`) never parsed
- `package.rs::parse()` reads OPF manifest/spine only. Chapter titles surface only incidentally via the HTML chunker finding `<h2>` — no fallback for books whose chapter markers aren't heading tags.

### 40. 🟡 TOC/navigation pages chunked as ordinary prose
- `tika_testEPUB.epub` TOC link-list emitted as `short_disconnected_paragraph`, indistinguishable from real content; no `is_navigation` flag. Pollutes retrieval.

## ipynb

### 41. 🟠 Image references vanish from every text-chunk mode
- get_markdown has `![](output_image_1.png)` but the ref is absent from every chunk in all 7 modes (empty alt text leaves no trace). `list_images=True` image metadata is only `{image_name}` — no cell index / link to the code cell it followed.

### 42. 🟠 Notebook with only externally-referenced images → total content loss
- **Repro:** `nbc_embed_images.ipynb` (markdown cells with `![](./x.jpeg)` / `<img src=…>`) → 0 chunks AND 0 images, silently. `extract.rs` only resolves `attachment:` base64 images.

### 43. 🟡 Output MIME priority prefers plain text over richer html/rst
- `render_outputs` renders `text/plain` even when `text/html`/`text/x-rst` present and richer.

### 44. ⚪ Error-traceback path unexercised by any real fixture
- 0 of 11 fixtures contain `output_type:"error"`; `strip_ansi`/traceback code unverified.

## json / jsonl / ndjson

### 45. 🟠 Single-object JSON → one monolithic chunk in every mode (incl. sliding_window)
- **Repro:** `vega_us-10m.json` (1.53MB topojson object) → 1 chunk of 764,655 chars in all 7 modes. `extract.rs::render_kv` joins fields with `\n` (never `\n\n`), so the shared blank-line-based chunkers find no boundary. Breaks the bounded-size contract for the most common JSON shape.

### 46. 🟡 `section`/`semantic`/`page_aware` merge unrelated JSONL records with no boundary metadata
- **Repro:** `elastic_products.ndjson` (25 records) → `section` collapses to 2 chunks concatenating unrelated products; `document_metadata` has only file-level counts, no per-chunk record range/id. `render_record` deliberately omits per-record headings, removing the signal those chunkers group on.

## msg (Outlook)

### 47. 🟡 Sender "From" leaks raw Exchange legacyDN
- **Repro:** 8/17 fixtures — `document_metadata["from"]` is a raw X.500 DN. `msg/extract.rs` never checks `PidTagSenderAddrType (0x0C1E)` before formatting `{name} <{email}>`.

### 48. 🟠 `list_images=True` is a no-op for `.msg` (unlike `.eml`)
- **Repro:** `tika_test-outlook2003.msg` (11 real JPEG attachments) → `images={}`. `.msg` absent from `_MD_IMAGE_DISPATCH`/`_CHUNKS_IMAGE_DISPATCH`; `msg/extract.rs::read_attachments` never reads bytes for non-embedded attachments.

### 49. ⚪ Hand-rolled LZFu/RTF path untested (contradicts CLAUDE.md)
- All 17 fixtures have plain/HTML bodies; the compressed-RTF path is dead code on the corpus. Add an RTF-only fixture.

## odf (odt / odp)

### 51. 🔴 XML entities dropped + bare `&` truncates whole document (broader than #9)
- **Repro:** odt with `Research &amp; Development` → "Research Development"; ALL five predefined entities dropped (`&lt;&gt;&quot;&apos;` too); a malformed bare `&` silently truncates the **entire rest of the document** (`Err(_) => break`).
- **Where:** `odf/text.rs::content_to_markdown` — quick-xml 0.38 emits `Event::GeneralRef` for standalone entities; unhandled `_ => {}`. `decode_entities()` is dead code here.

### 50. 🟡 Ordered/numbered lists always flattened to bullets
- 5 distinct list styles all render as `- item`. `odf/text.rs` hardcodes `ordered_stack.push(false)`; never reads `text:list-style-name`/`style:num-format`.

### 52. 🟡 odp has no `slide_number`/`slide_title` metadata (pptx does)
- Slide identity exists only as unstructured `## Slide N` markdown heading.

### 53. 🟡 Images extracted but never referenced inline or deduped
- `chunk_odf_with_images` prepends all images as a flat block before text; no hashing/dedup/positional `![](…)`. `text.rs` has no `draw:frame`/`draw:image` arm.

## pdf (rewritten this release — liteparse-based)

### 54. ⚪ `default` and `structural` modes are silently identical (doc mismatch)
- **Repro:** any fixture — `mode="default"` vs `"structural"` byte-for-byte identical (59/59 chunks). README + `pdf.py` docstring say they differ (fast path vs full font-size pipeline).
- **Where:** `chunkers.rs` `chunk_pdf` and `chunk_pdf_fast` both call `run_mode(...,"default",...)`; `chunks_for_mode` has one `"default"|"structural"` arm post-rewrite. See [Docs-accuracy conflicts](#docs-accuracy-conflicts).

### 55. 🟡 Streaming fully eager, not incremental (doc mismatch)
- **Repro:** `stream_chunks("sample-5000-page.pdf")` — iterator construction ~804ms (full parse+chunk), every `next()` ~0.02ms. All chunks pre-materialized.
- **Where:** `chunkers.rs::stream_pdf_chunks` runs the full pipeline synchronously into a `Vec`; no background thread / mpsc despite the README claim. See [Docs-accuracy conflicts](#docs-accuracy-conflicts).

### 56. 🟠 Blank/text-less PDFs emit garbage `code_block` chunks
- **Repro:** `large-doc.pdf` (0 text, 0 page objects) → N chunks of `` ```text\n\n``` `` typed `code_block`; `list_images=True` returns 0 images. Contradicts **two** documented behaviors (raise on no text, and page-image fallback — the latter doesn't exist in the new pipeline).
- **Where:** `liteparse_backend.rs::pdf_to_markdown` emits an empty fenced block per contentless page.

### 57. 🟡 Images inside Form XObjects missed entirely
- **Repro:** `pdfjs_images.pdf` → 0 images though pdfium finds 4 IMAGE objects nested in a Form XObject. liteparse's `embed_images` path doesn't traverse XObject forms.

### 58. 🟡 Multi-column author/affiliation blocks misclassified as tables
- **Repro:** `arxiv_1706.03762_attention.pdf` header renders as a markdown table. liteparse spatial-column heuristic (upstream crate).

## rtf

### 59. 🟡 Bold/italic/underline formatting completely discarded
- `tika_testRTFBoldItalic.rtf` → flat text, no `**`/`*`. `extract.rs::handle_control_word` has no `b"b"/b"i"/b"ul"` arm. All 7 modes collapse to 1 chunk.

### 60. 🟡 Body headings (paragraph styles) never detected — only `{\title}` becomes H1
- Only 2/13 fixtures produce any heading. section/semantic modes lose sectioning fidelity for RTF.

### 61. 🟡 Symbol-font bullet glyphs leak as U+FFFD / raw PUA into text
- `tika_testRTFListLibreOffice.rtf` → literal U+FFFD per bullet; Japanese → U+F0FC. `charset_to_encoding` naive mapping + no symbol-font/PUA→bullet translation.

### 62. 🟡 `document_metadata.author` always null
- `{\author …}` present in 7 fixtures but `RtfDoc.author` is set by `default()` and never assigned (unlike `title`).

---

## Test / verification gaps (not engine bugs)

### 7. ⚪ Encrypted DOCX fixture breaks the parametrized "expect success" glob
- `poi_bug53475-password-is-pass.docx` correctly raises a clean `RuntimeError`, but `test_docx.py` globs every `.docx` and assumes success → cascades into 66 failures. Exclude known-adversarial fixtures (or add a `pytest.raises` test).

---

## Docs-accuracy conflicts

These items mean the **live website currently documents behavior the shipped
engine doesn't match**. Each needs a decision: fix the engine (restore the
documented behavior) **or** correct the docs. Flagged here; not changed on the
site yet.

| # | Site page that currently claims otherwise | Reality per review |
|---|---|---|
| 54 | [`chunking-modes/structural`](content/docs/chunking-modes/structural.mdx) — "PDF `default` and `structural` are **not** the same" | Byte-for-byte identical this release (both call the same pipeline). |
| 55 | [`streaming`](content/docs/streaming.mdx) — PDF streams incrementally (background thread) | PDF streaming is fully eager: the whole doc parses before the first chunk yields. |
| 56 | [`error-handling`](content/docs/error-handling.mdx) + [`supported-formats`](content/docs/supported-formats.mdx) — scanned/text-less PDF raises, and `list_images=True` returns one image per page | Text-less PDFs emit garbage `code_block` chunks and return **no** page images. |

> #9 (`&` drop) is already disclosed on the benchmarks page; #8 (35/36 coverage)
> likewise. The three above are **not** yet reflected and are the ones to
> reconcile.

---

*Source of truth: `../py_chunks/TECH_DEBT.md` (62 items). Items 1–9 from the
2026-07-28 benchmark review; 10–62 from the 2026-08-03 multi-agent per-format
review. Owner was fixing #9 in `src/extensions/md/`; the rest were open/untriaged
at time of writing.*
