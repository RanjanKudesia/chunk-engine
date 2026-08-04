/* @ts-self-types="./chunks_wasm.d.ts" */

export class Color {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ColorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_color_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get blue() {
        const ret = wasm.__wbg_get_color_blue(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get green() {
        const ret = wasm.__wbg_get_color_green(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get red() {
        const ret = wasm.__wbg_get_color_red(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set blue(arg0) {
        wasm.__wbg_set_color_blue(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set green(arg0) {
        wasm.__wbg_set_color_green(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set red(arg0) {
        wasm.__wbg_set_color_red(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Color.prototype[Symbol.dispose] = Color.prototype.free;

export class Font {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        FontFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_font_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get character_set() {
        const ret = wasm.__wbg_get_font_character_set(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {FontFamily}
     */
    get font_family() {
        const ret = wasm.__wbg_get_font_font_family(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {string}
     */
    get name() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_font_name(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {number} arg0
     */
    set character_set(arg0) {
        wasm.__wbg_set_font_character_set(this.__wbg_ptr, arg0);
    }
    /**
     * @param {FontFamily} arg0
     */
    set font_family(arg0) {
        wasm.__wbg_set_font_font_family(this.__wbg_ptr, arg0);
    }
    /**
     * @param {string} arg0
     */
    set name(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_font_name(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) Font.prototype[Symbol.dispose] = Font.prototype.free;

export class Indentation {
    static __wrap(ptr) {
        const obj = Object.create(Indentation.prototype);
        obj.__wbg_ptr = ptr;
        IndentationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IndentationFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_indentation_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get first_line() {
        const ret = wasm.__wbg_get_indentation_first_line(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get left() {
        const ret = wasm.__wbg_get_indentation_left(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get right() {
        const ret = wasm.__wbg_get_indentation_right(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set first_line(arg0) {
        wasm.__wbg_set_indentation_first_line(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set left(arg0) {
        wasm.__wbg_set_indentation_left(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set right(arg0) {
        wasm.__wbg_set_indentation_right(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Indentation.prototype[Symbol.dispose] = Indentation.prototype.free;

export class Painter {
    static __wrap(ptr) {
        const obj = Object.create(Painter.prototype);
        obj.__wbg_ptr = ptr;
        PainterFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PainterFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_painter_free(ptr, 0);
    }
    /**
     * @returns {boolean}
     */
    get bold() {
        const ret = wasm.__wbg_get_painter_bold(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {number}
     */
    get color_ref() {
        const ret = wasm.__wbg_get_painter_color_ref(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get font_ref() {
        const ret = wasm.__wbg_get_painter_font_ref(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get font_size() {
        const ret = wasm.__wbg_get_painter_font_size(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {boolean}
     */
    get italic() {
        const ret = wasm.__wbg_get_painter_italic(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get smallcaps() {
        const ret = wasm.__wbg_get_painter_smallcaps(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get strike() {
        const ret = wasm.__wbg_get_painter_strike(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get subscript() {
        const ret = wasm.__wbg_get_painter_subscript(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get superscript() {
        const ret = wasm.__wbg_get_painter_superscript(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @returns {boolean}
     */
    get underline() {
        const ret = wasm.__wbg_get_painter_underline(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * @param {boolean} arg0
     */
    set bold(arg0) {
        wasm.__wbg_set_painter_bold(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set color_ref(arg0) {
        wasm.__wbg_set_painter_color_ref(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set font_ref(arg0) {
        wasm.__wbg_set_painter_font_ref(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set font_size(arg0) {
        wasm.__wbg_set_painter_font_size(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set italic(arg0) {
        wasm.__wbg_set_painter_italic(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set smallcaps(arg0) {
        wasm.__wbg_set_painter_smallcaps(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set strike(arg0) {
        wasm.__wbg_set_painter_strike(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set subscript(arg0) {
        wasm.__wbg_set_painter_subscript(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set superscript(arg0) {
        wasm.__wbg_set_painter_superscript(this.__wbg_ptr, arg0);
    }
    /**
     * @param {boolean} arg0
     */
    set underline(arg0) {
        wasm.__wbg_set_painter_underline(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Painter.prototype[Symbol.dispose] = Painter.prototype.free;

export class Paragraph {
    static __wrap(ptr) {
        const obj = Object.create(Paragraph.prototype);
        obj.__wbg_ptr = ptr;
        ParagraphFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ParagraphFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_paragraph_free(ptr, 0);
    }
    /**
     * @returns {Alignment}
     */
    get alignment() {
        const ret = wasm.__wbg_get_paragraph_alignment(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {Indentation}
     */
    get indent() {
        const ret = wasm.__wbg_get_paragraph_indent(this.__wbg_ptr);
        return Indentation.__wrap(ret);
    }
    /**
     * @returns {Spacing}
     */
    get spacing() {
        const ret = wasm.__wbg_get_paragraph_spacing(this.__wbg_ptr);
        return Spacing.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    get tab_width() {
        const ret = wasm.__wbg_get_paragraph_tab_width(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {Alignment} arg0
     */
    set alignment(arg0) {
        wasm.__wbg_set_paragraph_alignment(this.__wbg_ptr, arg0);
    }
    /**
     * @param {Indentation} arg0
     */
    set indent(arg0) {
        _assertClass(arg0, Indentation);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_paragraph_indent(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {Spacing} arg0
     */
    set spacing(arg0) {
        _assertClass(arg0, Spacing);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_paragraph_spacing(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {number} arg0
     */
    set tab_width(arg0) {
        wasm.__wbg_set_paragraph_tab_width(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Paragraph.prototype[Symbol.dispose] = Paragraph.prototype.free;

export class RtfDocument {
    static __wrap(ptr) {
        const obj = Object.create(RtfDocument.prototype);
        obj.__wbg_ptr = ptr;
        RtfDocumentFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RtfDocumentFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rtfdocument_free(ptr, 0);
    }
    /**
     * @returns {StyleBlock[]}
     */
    get body() {
        const ret = wasm.__wbg_get_rtfdocument_body(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * @returns {RtfHeader}
     */
    get header() {
        const ret = wasm.__wbg_get_rtfdocument_header(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {StyleBlock[]} arg0
     */
    set body(arg0) {
        const ptr0 = passArrayJsValueToWasm0(arg0, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_rtfdocument_body(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * @param {RtfHeader} arg0
     */
    set header(arg0) {
        wasm.__wbg_set_rtfdocument_header(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) RtfDocument.prototype[Symbol.dispose] = RtfDocument.prototype.free;

/**
 * The vertical margin before / after a block of text
 */
export class Spacing {
    static __wrap(ptr) {
        const obj = Object.create(Spacing.prototype);
        obj.__wbg_ptr = ptr;
        SpacingFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SpacingFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_spacing_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get after() {
        const ret = wasm.__wbg_get_spacing_after(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get before() {
        const ret = wasm.__wbg_get_spacing_before(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {SpaceBetweenLine}
     */
    get between_line() {
        const ret = wasm.__wbg_get_spacing_between_line(this.__wbg_ptr);
        return ret;
    }
    /**
     * @returns {number}
     */
    get line_multiplier() {
        const ret = wasm.__wbg_get_spacing_line_multiplier(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set after(arg0) {
        wasm.__wbg_set_spacing_after(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set before(arg0) {
        wasm.__wbg_set_spacing_before(this.__wbg_ptr, arg0);
    }
    /**
     * @param {SpaceBetweenLine} arg0
     */
    set between_line(arg0) {
        wasm.__wbg_set_spacing_between_line(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} arg0
     */
    set line_multiplier(arg0) {
        wasm.__wbg_set_spacing_line_multiplier(this.__wbg_ptr, arg0);
    }
}
if (Symbol.dispose) Spacing.prototype[Symbol.dispose] = Spacing.prototype.free;

export class StyleBlock {
    static __wrap(ptr) {
        const obj = Object.create(StyleBlock.prototype);
        obj.__wbg_ptr = ptr;
        StyleBlockFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }
    static __unwrap(jsValue) {
        if (!(jsValue instanceof StyleBlock)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StyleBlockFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_styleblock_free(ptr, 0);
    }
    /**
     * @returns {Painter}
     */
    get painter() {
        const ret = wasm.__wbg_get_styleblock_painter(this.__wbg_ptr);
        return Painter.__wrap(ret);
    }
    /**
     * @returns {Paragraph}
     */
    get paragraph() {
        const ret = wasm.__wbg_get_styleblock_paragraph(this.__wbg_ptr);
        return Paragraph.__wrap(ret);
    }
    /**
     * @returns {string}
     */
    get text() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_styleblock_text(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * @param {Painter} arg0
     */
    set painter(arg0) {
        _assertClass(arg0, Painter);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_styleblock_painter(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {Paragraph} arg0
     */
    set paragraph(arg0) {
        _assertClass(arg0, Paragraph);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_styleblock_paragraph(this.__wbg_ptr, ptr0);
    }
    /**
     * @param {string} arg0
     */
    set text(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_styleblock_text(this.__wbg_ptr, ptr0, len0);
    }
}
if (Symbol.dispose) StyleBlock.prototype[Symbol.dispose] = StyleBlock.prototype.free;

/**
 * Install a panic hook that surfaces Rust panics as console errors (dev aid).
 */
export function __start() {
    wasm.__start();
}

/**
 * Chunk PDF markdown produced host-side (e.g. by `@llamaindex/liteparse-wasm`).
 * `total_pages` populates `document_metadata.total_pages`.
 * @param {string} markdown
 * @param {number} total_pages
 * @param {string} mode
 * @param {number} window_size
 * @param {number} overlap
 * @param {number} sentences_per_chunk
 * @param {number} paragraphs_per_page
 * @returns {any}
 */
export function chunkPdfMarkdown(markdown, total_pages, mode, window_size, overlap, sentences_per_chunk, paragraphs_per_page) {
    const ptr0 = passStringToWasm0(markdown, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.chunkPdfMarkdown(ptr0, len0, total_pages, ptr1, len1, window_size, overlap, sentences_per_chunk, paragraphs_per_page);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Like [`chunk_pdf_markdown`] but with host-supplied PDF images (image chunks
 * first). `images` is a JS `{ name, data: Uint8Array }[]`. Returns
 * `{ chunks, images }` like [`get_chunks_with_images`].
 * @param {string} markdown
 * @param {any} images
 * @param {number} total_pages
 * @param {string} mode
 * @param {number} window_size
 * @param {number} overlap
 * @param {number} sentences_per_chunk
 * @param {number} paragraphs_per_page
 * @returns {any}
 */
export function chunkPdfMarkdownWithImages(markdown, images, total_pages, mode, window_size, overlap, sentences_per_chunk, paragraphs_per_page) {
    const ptr0 = passStringToWasm0(markdown, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.chunkPdfMarkdownWithImages(ptr0, len0, images, total_pages, ptr1, len1, window_size, overlap, sentences_per_chunk, paragraphs_per_page);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Chunk a document from raw bytes. `filename` is used only for extension routing.
 * Returns an array of `{ content, content_type, metadata }`.
 * @param {Uint8Array} data
 * @param {string} filename
 * @param {string} mode
 * @param {number} window_size
 * @param {number} overlap
 * @param {number} sentences_per_chunk
 * @param {number} paragraphs_per_page
 * @returns {any}
 */
export function getChunks(data, filename, mode, window_size, overlap, sentences_per_chunk, paragraphs_per_page) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(filename, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.getChunks(ptr0, len0, ptr1, len1, ptr2, len2, window_size, overlap, sentences_per_chunk, paragraphs_per_page);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Chunk a document and also return its embedded images (py-chunks `list_images=True`).
 * Returns `{ chunks: Chunk[], images: { name, data: Uint8Array }[] }`.
 * @param {Uint8Array} data
 * @param {string} filename
 * @param {string} mode
 * @param {number} window_size
 * @param {number} overlap
 * @param {number} sentences_per_chunk
 * @param {number} paragraphs_per_page
 * @returns {any}
 */
export function getChunksWithImages(data, filename, mode, window_size, overlap, sentences_per_chunk, paragraphs_per_page) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(filename, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ptr2 = passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len2 = WASM_VECTOR_LEN;
    const ret = wasm.getChunksWithImages(ptr0, len0, ptr1, len1, ptr2, len2, window_size, overlap, sentences_per_chunk, paragraphs_per_page);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Convert a document from raw bytes to Markdown.
 * @param {Uint8Array} data
 * @param {string} filename
 * @returns {string}
 */
export function getMarkdown(data, filename) {
    let deferred4_0;
    let deferred4_1;
    try {
        const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(filename, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.getMarkdown(ptr0, len0, ptr1, len1);
        var ptr3 = ret[0];
        var len3 = ret[1];
        if (ret[3]) {
            ptr3 = 0; len3 = 0;
            throw takeFromExternrefTable0(ret[2]);
        }
        deferred4_0 = ptr3;
        deferred4_1 = len3;
        return getStringFromWasm0(ptr3, len3);
    } finally {
        wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
    }
}

/**
 * Convert a document to Markdown and also return its embedded images.
 * Returns `{ markdown: string, images: { name, data: Uint8Array }[] }`.
 * @param {Uint8Array} data
 * @param {string} filename
 * @returns {any}
 */
export function getMarkdownWithImages(data, filename) {
    const ptr0 = passArray8ToWasm0(data, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ptr1 = passStringToWasm0(filename, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    const ret = wasm.getMarkdownWithImages(ptr0, len0, ptr1, len1);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
}

/**
 * Apply the engine's PDF-markdown normalisation to host-parsed markdown.
 *
 * `chunkPdfMarkdown` already does this internally, so chunks agree across SDKs
 * without any help. `getMarkdown` returns the host parser's string directly,
 * which would otherwise skip it — this is what keeps the two in step.
 * @param {string} markdown
 * @returns {string}
 */
export function normalizePdfMarkdown(markdown) {
    let deferred2_0;
    let deferred2_1;
    try {
        const ptr0 = passStringToWasm0(markdown, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.normalizePdfMarkdown(ptr0, len0);
        deferred2_0 = ret[0];
        deferred2_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
    }
}

/**
 * @param {string} rtf
 * @returns {RtfDocument}
 */
export function parse_rtf(rtf) {
    const ptr0 = passStringToWasm0(rtf, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.parse_rtf(ptr0, len0);
    return RtfDocument.__wrap(ret);
}
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg_Error_92b29b0548f8b746: function(arg0, arg1) {
            const ret = Error(getStringFromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_String_8564e559799eccda: function(arg0, arg1) {
            const ret = String(arg1);
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_is_string_ea5e6cc2e4141dfe: function(arg0) {
            const ret = typeof(arg0) === 'string';
            return ret;
        },
        __wbg___wbindgen_is_undefined_c05833b95a3cf397: function(arg0) {
            const ret = arg0 === undefined;
            return ret;
        },
        __wbg___wbindgen_string_get_b0ca35b86a603356: function(arg0, arg1) {
            const obj = arg1;
            const ret = typeof(obj) === 'string' ? obj : undefined;
            var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            var len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbg_error_a6fa202b58aa1cd3: function(arg0, arg1) {
            let deferred0_0;
            let deferred0_1;
            try {
                deferred0_0 = arg0;
                deferred0_1 = arg1;
                console.error(getStringFromWasm0(arg0, arg1));
            } finally {
                wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
            }
        },
        __wbg_get_78f252d074a84d0b: function() { return handleError(function (arg0, arg1) {
            const ret = Reflect.get(arg0, arg1);
            return ret;
        }, arguments); },
        __wbg_get_unchecked_6e0ad6d2a41b06f6: function(arg0, arg1) {
            const ret = arg0[arg1 >>> 0];
            return ret;
        },
        __wbg_isArray_0677c962b281d01a: function(arg0) {
            const ret = Array.isArray(arg0);
            return ret;
        },
        __wbg_length_1f0964f4a5e2c6d8: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_length_370319915dc99107: function(arg0) {
            const ret = arg0.length;
            return ret;
        },
        __wbg_new_227d7c05414eb861: function() {
            const ret = new Error();
            return ret;
        },
        __wbg_new_32b398fb48b6d94a: function() {
            const ret = new Array();
            return ret;
        },
        __wbg_new_7796ffc7ed656783: function() {
            const ret = new Map();
            return ret;
        },
        __wbg_new_cd45aabdf6073e84: function(arg0) {
            const ret = new Uint8Array(arg0);
            return ret;
        },
        __wbg_new_da52cf8fe3429cb2: function() {
            const ret = new Object();
            return ret;
        },
        __wbg_new_from_slice_77cdfb7977362f3c: function(arg0, arg1) {
            const ret = new Uint8Array(getArrayU8FromWasm0(arg0, arg1));
            return ret;
        },
        __wbg_parse_1c0d8a8656d7e016: function() { return handleError(function (arg0, arg1) {
            const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
            return ret;
        }, arguments); },
        __wbg_prototypesetcall_4770620bbe4688a0: function(arg0, arg1, arg2) {
            Uint8Array.prototype.set.call(getArrayU8FromWasm0(arg0, arg1), arg2);
        },
        __wbg_push_d2ae3af0c1217ae6: function(arg0, arg1) {
            const ret = arg0.push(arg1);
            return ret;
        },
        __wbg_set_575dd786d51585f8: function(arg0, arg1, arg2) {
            const ret = arg0.set(arg1, arg2);
            return ret;
        },
        __wbg_set_6be42768c690e380: function(arg0, arg1, arg2) {
            arg0[arg1] = arg2;
        },
        __wbg_set_8535240470bf2500: function() { return handleError(function (arg0, arg1, arg2) {
            const ret = Reflect.set(arg0, arg1, arg2);
            return ret;
        }, arguments); },
        __wbg_set_8a16b38e4805b298: function(arg0, arg1, arg2) {
            arg0[arg1 >>> 0] = arg2;
        },
        __wbg_stack_3b0d974bbf31e44f: function(arg0, arg1) {
            const ret = arg1.stack;
            const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
            getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
        },
        __wbg_stringify_b54333f60f1e4dad: function() { return handleError(function (arg0) {
            const ret = JSON.stringify(arg0);
            return ret;
        }, arguments); },
        __wbg_styleblock_new: function(arg0) {
            const ret = StyleBlock.__wrap(arg0);
            return ret;
        },
        __wbg_styleblock_unwrap: function(arg0) {
            const ret = StyleBlock.__unwrap(arg0);
            return ret;
        },
        __wbindgen_cast_0000000000000001: function(arg0) {
            // Cast intrinsic for `F64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000002: function(arg0) {
            // Cast intrinsic for `I64 -> Externref`.
            const ret = arg0;
            return ret;
        },
        __wbindgen_cast_0000000000000003: function(arg0, arg1) {
            // Cast intrinsic for `Ref(String) -> Externref`.
            const ret = getStringFromWasm0(arg0, arg1);
            return ret;
        },
        __wbindgen_cast_0000000000000004: function(arg0) {
            // Cast intrinsic for `U64 -> Externref`.
            const ret = BigInt.asUintN(64, arg0);
            return ret;
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./chunks_wasm_bg.js": import0,
    };
}

const ColorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_color_free(ptr, 1));
const FontFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_font_free(ptr, 1));
const IndentationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_indentation_free(ptr, 1));
const PainterFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_painter_free(ptr, 1));
const ParagraphFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_paragraph_free(ptr, 1));
const RtfDocumentFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rtfdocument_free(ptr, 1));
const SpacingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_spacing_free(ptr, 1));
const StyleBlockFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_styleblock_free(ptr, 1));

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_externrefs.set(idx, obj);
    return idx;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_externrefs.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

let cachedDataViewMemory0 = null;
function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_externrefs.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('chunks_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
