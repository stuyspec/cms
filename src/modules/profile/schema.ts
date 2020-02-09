import { Schema, Node, DOMOutputSpec, Mark, ParseRule } from "prosemirror-model"

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
    // :: NodeSpec The top level document node.
    doc: {
        content: "block+"
    },

    // :: NodeSpec A plain paragraph textblock. Represented in the DOM
    // as a `<p>` element.
    paragraph: {
        content: "inline*",
        group: "block",
        parseDOM: [{ tag: "p" }],
        toDOM(_: Node): DOMOutputSpec { return ["p", 0] }
    },

    // :: NodeSpec A horizontal rule (`<hr>`).
    horizontal_rule: {
        group: "block",
        parseDOM: [{ tag: "hr" }],
        toDOM(_: Node): DOMOutputSpec { return ["hr"] }
    },

    article_extension: {
        attrs: { type: { default: "" }, props: { default: "{}" }, media: { default: "[]" } },
        group: "block",
        draggable: true,
        selectable: true,
        toDOM(node: Node): DOMOutputSpec {
            return ["article-extension", { type: node.attrs.type, props: node.attrs.props, media: node.attrs.media }]
        },
        parseDOM: [{
            tag: "article-extension[type][props]",
            getAttrs(dom: string | HTMLElement) {
                return (dom as HTMLElement).getAttribute
                    ? {
                        type: (dom as HTMLElement).getAttribute("type"),
                        props: (dom as HTMLElement).getAttribute("props"),
                        media: (dom as HTMLElement).getAttribute("media")
                    }
                    : {}
            }
        }] as ParseRule[]
    },

    // :: NodeSpec A heading textblock, with a `level` attribute that
    // should hold the number 1 to 6. Parsed and serialized as `<h1>` to
    // `<h6>` elements.
    heading: {
        attrs: { level: { default: 5 } },
        content: "inline*",
        group: "block",
        parseDOM: [{ tag: "h4", attrs: { level: 4 } },
        { tag: "h5", attrs: { level: 5 } }],
        toDOM(node: Node): DOMOutputSpec {
            return ["h" + node.attrs.level, { class: node.attrs.level == 4 ? "RichEditorCenteredHeader" : "RichEditorHeader" }, 0]
        }
    },

    // :: NodeSpec A code listing. Disallows marks or non-text inline
    // nodes by default. Represented as a `<pre>` element with a
    // `<code>` element inside of it.

    // :: NodeSpec The text node.
    text: {
        group: "inline"
    },

    // :: NodeSpec An inline image (`<img>`) node. Supports `src`,
    // `alt`, and `href` attributes. The latter two default to the empty
    // string.

    // :: NodeSpec A hard line break, represented in the DOM as `<br>`.
    hard_break: {
        inline: true,
        group: "inline",
        selectable: false,
        parseDOM: [{ tag: "br" }],
        toDOM(_: Node): DOMOutputSpec { return ["br"] }
    }
}

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
    // :: MarkSpec A link. Has `href` and `title` attributes. `title`
    // defaults to the empty string. Rendered and parsed as an `<a>`
    // element.
    link: {
        attrs: {
            href: {},
            title: { default: null }
        },
        inclusive: false,
        parseDOM: [{
            tag: "a[href]", getAttrs(dom: string | HTMLElement) {
                return (dom as HTMLElement).getAttribute
                    ? { href: (dom as HTMLElement).getAttribute("href"), title: (dom as HTMLElement).getAttribute("title") }
                    : {}
            }
        }] as ParseRule[],
        toDOM(node: Mark, _inc: boolean): DOMOutputSpec { return ["a", node.attrs] }
    },

    // :: MarkSpec An emphasis mark. Rendered as an `<em>` element.
    // Has parse rules that also match `<i>` and `font-style: italic`.
    em: {
        parseDOM: [{ tag: "i" }, { tag: "em" }, { style: "font-style=italic" }] as ParseRule[],
        toDOM(_: Mark, _inc: boolean): DOMOutputSpec { return ["em"] }
    },

    // :: MarkSpec A strong mark. Rendered as `<strong>`, parse rules
    // also match `<b>` and `font-weight: bold`.
    strong: {
        parseDOM: [{ tag: "strong" },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        { tag: "b", getAttrs: (node: HTMLElement) => node.style.fontWeight != "normal" && null },
        { style: "font-weight", getAttrs: (value: string) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }] as ParseRule[],
        toDOM(_: Mark, _inc: boolean): DOMOutputSpec { return ["strong"] }
    },

    // :: MarkSpec Code font mark. Represented as a `<code>` element.
    code: {
        parseDOM: [{ tag: "code" }] as ParseRule[],
        toDOM(_: Mark, _inc: boolean): DOMOutputSpec { return ["code"] }
    }
}

// :: Schema
// This schema rougly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema = new Schema({ nodes, marks })
