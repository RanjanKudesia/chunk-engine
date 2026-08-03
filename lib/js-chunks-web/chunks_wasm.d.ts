/* tslint:disable */
/* eslint-disable */
export interface RtfHeader {
    character_set: CharacterSet;
    font_table: FontTable;
    color_table: ColorTable;
    stylesheet: StyleSheet;
}

export type Alignment = "LeftAligned" | "RightAligned" | "Center" | "Justify";

export type CharacterSet = "Ansi" | "Mac" | "Pc" | "Pca" | { Ansicpg: number };

export type FontFamily = "Nil" | "Roman" | "Swiss" | "Modern" | "Script" | "Decor" | "Tech" | "Bidi";

export type SpaceBetweenLine = { Value: number } | "Auto" | "Invalid";


export class Color {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    blue: number;
    green: number;
    red: number;
}

export class Font {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    character_set: number;
    font_family: FontFamily;
    name: string;
}

export class Indentation {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    first_line: number;
    left: number;
    right: number;
}

export class Painter {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    bold: boolean;
    color_ref: number;
    font_ref: number;
    font_size: number;
    italic: boolean;
    smallcaps: boolean;
    strike: boolean;
    subscript: boolean;
    superscript: boolean;
    underline: boolean;
}

export class Paragraph {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    alignment: Alignment;
    indent: Indentation;
    spacing: Spacing;
    tab_width: number;
}

export class RtfDocument {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    body: StyleBlock[];
    header: RtfHeader;
}

/**
 * The vertical margin before / after a block of text
 */
export class Spacing {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    after: number;
    before: number;
    between_line: SpaceBetweenLine;
    line_multiplier: number;
}

export class StyleBlock {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    painter: Painter;
    paragraph: Paragraph;
    text: string;
}

/**
 * Install a panic hook that surfaces Rust panics as console errors (dev aid).
 */
export function __start(): void;

/**
 * Chunk PDF markdown produced host-side (e.g. by `@llamaindex/liteparse-wasm`).
 * `total_pages` populates `document_metadata.total_pages`.
 */
export function chunkPdfMarkdown(markdown: string, total_pages: number, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Like [`chunk_pdf_markdown`] but with host-supplied PDF images (image chunks
 * first). `images` is a JS `{ name, data: Uint8Array }[]`. Returns
 * `{ chunks, images }` like [`get_chunks_with_images`].
 */
export function chunkPdfMarkdownWithImages(markdown: string, images: any, total_pages: number, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Chunk a document from raw bytes. `filename` is used only for extension routing.
 * Returns an array of `{ content, content_type, metadata }`.
 */
export function getChunks(data: Uint8Array, filename: string, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Chunk a document and also return its embedded images (py-chunks `list_images=True`).
 * Returns `{ chunks: Chunk[], images: { name, data: Uint8Array }[] }`.
 */
export function getChunksWithImages(data: Uint8Array, filename: string, mode: string, window_size: number, overlap: number, sentences_per_chunk: number, paragraphs_per_page: number): any;

/**
 * Convert a document from raw bytes to Markdown.
 */
export function getMarkdown(data: Uint8Array, filename: string): string;

/**
 * Convert a document to Markdown and also return its embedded images.
 * Returns `{ markdown: string, images: { name, data: Uint8Array }[] }`.
 */
export function getMarkdownWithImages(data: Uint8Array, filename: string): any;

export function parse_rtf(rtf: string): RtfDocument;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __start: () => void;
    readonly chunkPdfMarkdown: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number) => [number, number, number];
    readonly chunkPdfMarkdownWithImages: (a: number, b: number, c: any, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number];
    readonly getChunks: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number];
    readonly getChunksWithImages: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number, i: number, j: number) => [number, number, number];
    readonly getMarkdown: (a: number, b: number, c: number, d: number) => [number, number, number, number];
    readonly getMarkdownWithImages: (a: number, b: number, c: number, d: number) => [number, number, number];
    readonly __wbg_get_painter_bold: (a: number) => number;
    readonly __wbg_get_painter_color_ref: (a: number) => number;
    readonly __wbg_get_painter_font_ref: (a: number) => number;
    readonly __wbg_get_painter_font_size: (a: number) => number;
    readonly __wbg_get_painter_italic: (a: number) => number;
    readonly __wbg_get_painter_smallcaps: (a: number) => number;
    readonly __wbg_get_painter_strike: (a: number) => number;
    readonly __wbg_get_painter_subscript: (a: number) => number;
    readonly __wbg_get_painter_superscript: (a: number) => number;
    readonly __wbg_get_painter_underline: (a: number) => number;
    readonly __wbg_get_styleblock_painter: (a: number) => number;
    readonly __wbg_get_styleblock_paragraph: (a: number) => number;
    readonly __wbg_get_styleblock_text: (a: number) => [number, number];
    readonly __wbg_painter_free: (a: number, b: number) => void;
    readonly __wbg_set_painter_bold: (a: number, b: number) => void;
    readonly __wbg_set_painter_color_ref: (a: number, b: number) => void;
    readonly __wbg_set_painter_font_ref: (a: number, b: number) => void;
    readonly __wbg_set_painter_font_size: (a: number, b: number) => void;
    readonly __wbg_set_painter_italic: (a: number, b: number) => void;
    readonly __wbg_set_painter_smallcaps: (a: number, b: number) => void;
    readonly __wbg_set_painter_strike: (a: number, b: number) => void;
    readonly __wbg_set_painter_subscript: (a: number, b: number) => void;
    readonly __wbg_set_painter_superscript: (a: number, b: number) => void;
    readonly __wbg_set_painter_underline: (a: number, b: number) => void;
    readonly __wbg_set_styleblock_painter: (a: number, b: number) => void;
    readonly __wbg_set_styleblock_paragraph: (a: number, b: number) => void;
    readonly __wbg_set_styleblock_text: (a: number, b: number, c: number) => void;
    readonly __wbg_styleblock_free: (a: number, b: number) => void;
    readonly __wbg_get_indentation_first_line: (a: number) => number;
    readonly __wbg_get_indentation_left: (a: number) => number;
    readonly __wbg_get_indentation_right: (a: number) => number;
    readonly __wbg_get_paragraph_alignment: (a: number) => any;
    readonly __wbg_get_paragraph_indent: (a: number) => number;
    readonly __wbg_get_paragraph_spacing: (a: number) => number;
    readonly __wbg_get_paragraph_tab_width: (a: number) => number;
    readonly __wbg_get_spacing_after: (a: number) => number;
    readonly __wbg_get_spacing_between_line: (a: number) => any;
    readonly __wbg_get_spacing_line_multiplier: (a: number) => number;
    readonly __wbg_indentation_free: (a: number, b: number) => void;
    readonly __wbg_paragraph_free: (a: number, b: number) => void;
    readonly __wbg_set_indentation_first_line: (a: number, b: number) => void;
    readonly __wbg_set_indentation_left: (a: number, b: number) => void;
    readonly __wbg_set_indentation_right: (a: number, b: number) => void;
    readonly __wbg_set_paragraph_alignment: (a: number, b: any) => void;
    readonly __wbg_set_paragraph_indent: (a: number, b: number) => void;
    readonly __wbg_set_paragraph_spacing: (a: number, b: number) => void;
    readonly __wbg_set_paragraph_tab_width: (a: number, b: number) => void;
    readonly __wbg_set_spacing_after: (a: number, b: number) => void;
    readonly __wbg_set_spacing_between_line: (a: number, b: any) => void;
    readonly __wbg_set_spacing_line_multiplier: (a: number, b: number) => void;
    readonly __wbg_spacing_free: (a: number, b: number) => void;
    readonly __wbg_set_spacing_before: (a: number, b: number) => void;
    readonly __wbg_get_spacing_before: (a: number) => number;
    readonly __wbg_color_free: (a: number, b: number) => void;
    readonly __wbg_font_free: (a: number, b: number) => void;
    readonly __wbg_get_color_blue: (a: number) => number;
    readonly __wbg_get_color_green: (a: number) => number;
    readonly __wbg_get_color_red: (a: number) => number;
    readonly __wbg_get_font_character_set: (a: number) => number;
    readonly __wbg_get_font_font_family: (a: number) => any;
    readonly __wbg_get_font_name: (a: number) => [number, number];
    readonly __wbg_set_color_blue: (a: number, b: number) => void;
    readonly __wbg_set_color_green: (a: number, b: number) => void;
    readonly __wbg_set_color_red: (a: number, b: number) => void;
    readonly __wbg_set_font_character_set: (a: number, b: number) => void;
    readonly __wbg_set_font_font_family: (a: number, b: any) => void;
    readonly __wbg_set_font_name: (a: number, b: number, c: number) => void;
    readonly __wbg_get_rtfdocument_body: (a: number) => [number, number];
    readonly __wbg_get_rtfdocument_header: (a: number) => any;
    readonly __wbg_rtfdocument_free: (a: number, b: number) => void;
    readonly __wbg_set_rtfdocument_body: (a: number, b: number, c: number) => void;
    readonly __wbg_set_rtfdocument_header: (a: number, b: any) => void;
    readonly parse_rtf: (a: number, b: number) => number;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_exn_store: (a: number) => void;
    readonly __externref_table_alloc: () => number;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __externref_table_dealloc: (a: number) => void;
    readonly __externref_drop_slice: (a: number, b: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
